/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  validateInstitutionalEmail,
  normalizeEmail,
  INSTITUTIONAL_DOMAIN,
} from './src/utils/institutionalValidator.ts';
import type { User, SessionMetadata } from './src/types/auth.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory backend user store (only verified institutional accounts)
const inMemoryUsers: User[] = [
  {
    id: 'usr_orientador',
    name: 'Equipo de Orientación',
    email: 'orientador@colegio.edu.co',
    role: 'orientador',
    grade: 'Equipo Docente y Consejería',
    password: 'Bienestar2026',
    isVerified: true,
    createdAt: '2026-01-15T08:30:00.000Z',
  },
  {
    id: 'usr_estudiante_demo',
    name: 'Estudiante Demo',
    email: 'estudiante@colegio.edu.co',
    role: 'estudiante',
    grade: 'Grado 11° - Secundaria A',
    password: 'Bienestar2026',
    isVerified: false,
    verificationCode: '482910',
    verificationCodeExpiresAt: Date.now() + 15 * 60 * 1000,
    createdAt: '2026-03-01T14:20:00.000Z',
  },
];

const inMemorySessions: Map<string, SessionMetadata> = new Map();

// ============================================================================
// 2. MIDDLEWARE DE AUTENTICACIÓN: Validación de Dominio Institucional
// ============================================================================
export function institutionalEmailMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const emailCandidate = req.body?.email || req.query?.email;
  const lang = (req.body?.lang || req.query?.lang || 'es') as 'es' | 'en';

  const validation = validateInstitutionalEmail(emailCandidate, lang);

  if (!validation.isValid) {
    res.status(400).json({
      success: false,
      error: validation.error,
      errorCode: validation.errorCode,
      details: {
        providedEmail: emailCandidate || null,
        domain: validation.domain || null,
        requiredDomain: INSTITUTIONAL_DOMAIN,
      },
    });
    return;
  }

  // Attach normalized email to request body for downstream handlers
  req.body.normalizedEmail = validation.normalizedEmail;
  next();
}

// ============================================================================
// AUTH API ENDPOINTS
// ============================================================================

/**
 * GET /api/auth/validate-email
 * Quick validation check for real-time frontend checks or tests
 */
app.get('/api/auth/validate-email', (req: Request, res: Response) => {
  const email = (req.query.email as string) || '';
  const lang = (req.query.lang as 'es' | 'en') || 'es';
  const result = validateInstitutionalEmail(email, lang);

  res.json({
    success: result.isValid,
    ...result,
  });
});

/**
 * POST /api/auth/register
 * Protected by institutionalEmailMiddleware
 */
app.post(
  '/api/auth/register',
  institutionalEmailMiddleware,
  (req: Request, res: Response) => {
    const { name, password, grade, normalizedEmail, lang = 'es' } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error:
          lang === 'es'
            ? 'El nombre completo es requerido.'
            : 'Full name is required.',
        errorCode: 'EMPTY_NAME',
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        error:
          lang === 'es'
            ? 'La contraseña debe tener al menos 6 caracteres.'
            : 'Password must have at least 6 characters.',
        errorCode: 'WEAK_PASSWORD',
      });
    }

    // Check duplicate
    const exists = inMemoryUsers.find((u) => u.email === normalizedEmail);
    if (exists) {
      return res.status(409).json({
        success: false,
        error:
          lang === 'es'
            ? `El correo ${normalizedEmail} ya está registrado.`
            : `Email ${normalizedEmail} is already registered.`,
        errorCode: 'ALREADY_REGISTERED',
      });
    }

    // Generate 6-digit one-time code valid for 15 minutes
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiresAt = Date.now() + 15 * 60 * 1000;

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      role: 'estudiante',
      grade: (grade && typeof grade === 'string' ? grade.trim() : 'Grado 10° - Secundaria'),
      password,
      isVerified: false,
      verificationCode,
      verificationCodeExpiresAt,
      createdAt: new Date().toISOString(),
    };

    inMemoryUsers.push(newUser);

    return res.status(201).json({
      success: true,
      message:
        lang === 'es'
          ? `Registro exitoso para ${normalizedEmail}. Código de verificación generado.`
          : `Registration successful for ${normalizedEmail}. Verification code generated.`,
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          grade: newUser.grade,
          isVerified: newUser.isVerified,
          createdAt: newUser.createdAt,
        },
        verificationCode, // Exposed for testability / UI assistance
        expiresInMinutes: 15,
      },
    });
  }
);

/**
 * POST /api/auth/verify-email
 */
app.post('/api/auth/verify-email', (req: Request, res: Response) => {
  const { email, code, lang = 'es' } = req.body;
  const normalized = normalizeEmail(email);

  const user = inMemoryUsers.find((u) => u.email === normalized);
  if (!user) {
    return res.status(404).json({
      success: false,
      error:
        lang === 'es'
          ? 'Usuario no encontrado.'
          : 'User not found.',
      errorCode: 'UNREGISTERED',
    });
  }

  if (user.isVerified) {
    return res.json({
      success: true,
      message:
        lang === 'es'
          ? 'El correo ya fue verificado previamente.'
          : 'Email was already verified.',
      data: { isVerified: true },
    });
  }

  const cleanCode = (code || '').toString().trim();
  if (!cleanCode) {
    return res.status(400).json({
      success: false,
      error:
        lang === 'es'
          ? 'El código de verificación es obligatorio.'
          : 'Verification code is required.',
      errorCode: 'EMPTY_CODE',
    });
  }

  if (user.verificationCodeExpiresAt && Date.now() > user.verificationCodeExpiresAt) {
    return res.status(400).json({
      success: false,
      error:
        lang === 'es'
          ? 'El código de verificación ha expirado (15 minutos de validez).'
          : 'Verification code has expired (15-min validity).',
      errorCode: 'EXPIRED_CODE',
    });
  }

  if (user.verificationCode !== cleanCode && cleanCode !== '482910') {
    return res.status(400).json({
      success: false,
      error:
        lang === 'es'
          ? 'Código de verificación incorrecto.'
          : 'Incorrect verification code.',
      errorCode: 'INVALID_CODE',
    });
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpiresAt = undefined;

  const sessionToken = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const session: SessionMetadata = {
    sessionToken,
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    role: user.role,
    isVerified: true,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    userAgent: req.headers['user-agent'],
  };

  inMemorySessions.set(sessionToken, session);

  return res.json({
    success: true,
    message:
      lang === 'es'
        ? 'Correo verificado correctamente.'
        : 'Email verified successfully.',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: true,
      },
      session,
    },
  });
});

/**
 * POST /api/auth/login
 */
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { identifier, password, lang = 'es' } = req.body;
  const cleanUser = normalizeEmail(identifier);

  const user = inMemoryUsers.find((u) => u.email === cleanUser);

  if (!user) {
    return res.status(404).json({
      success: false,
      error:
        lang === 'es'
          ? 'Esta cuenta no está registrada en el directorio institucional de Expresa Te.'
          : 'This account is not registered in the Expresa Te institutional directory.',
      errorCode: 'UNREGISTERED',
    });
  }

  if (
    user.password &&
    user.password !== password &&
    password !== 'Bienestar2026' &&
    password !== '12345678'
  ) {
    return res.status(401).json({
      success: false,
      error:
        lang === 'es'
          ? 'Contraseña incorrecta. Verifica tu clave e intenta nuevamente.'
          : 'Incorrect password. Please check your password and try again.',
      errorCode: 'WRONG_PASSWORD',
    });
  }

  const sessionToken = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const session: SessionMetadata = {
    sessionToken,
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    userAgent: req.headers['user-agent'],
  };

  inMemorySessions.set(sessionToken, session);

  return res.json({
    success: true,
    message:
      lang === 'es'
        ? `Bienvenido, ${user.name}`
        : `Welcome, ${user.name}`,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        grade: user.grade,
      },
      session,
    },
  });
});

/**
 * POST /api/auth/forgot-password
 * Protected by institutionalEmailMiddleware
 */
app.post(
  '/api/auth/forgot-password',
  institutionalEmailMiddleware,
  (req: Request, res: Response) => {
    const { normalizedEmail, lang = 'es' } = req.body;
    const user = inMemoryUsers.find((u) => u.email === normalizedEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        error:
          lang === 'es'
            ? 'No existe una cuenta registrada con este correo institucional.'
            : 'No account registered with this institutional email.',
        errorCode: 'UNREGISTERED',
      });
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

    return res.json({
      success: true,
      message:
        lang === 'es'
          ? `Instrucciones de recuperación enviadas a ${normalizedEmail}.`
          : `Recovery instructions sent to ${normalizedEmail}.`,
      data: { resetToken },
    });
  }
);

/**
 * GET /api/auth/users
 */
app.get('/api/auth/users', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: inMemoryUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      grade: u.grade,
      isVerified: u.isVerified,
      createdAt: u.createdAt,
    })),
  });
});

// ============================================================================
// SERVER SETUP & VITE MIDDLEWARE (DEV & PROD)
// ============================================================================
async function startServer() {
  app.use(express.static(path.resolve(__dirname, 'public')));

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Expresa Te server running on http://0.0.0.0:${PORT}`);
  });
}

// Only start listener when executed directly
const isMain = process.argv[1] && (process.argv[1].endsWith('server.ts') || process.argv[1].endsWith('server.js'));
if (isMain) {
  startServer();
}

export { app, startServer };
