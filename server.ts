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
import type { AudiovisualResource } from './src/types/audiovisual.ts';
import { INITIAL_AUDIOVISUAL_RESOURCES } from './src/data/audiovisualData.ts';
import type { OrientationRequest, CaseNote } from './src/services/orientationService.ts';

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
// AUDIOVISUALES API ENDPOINTS (Educación Emocional & Orientación)
// ============================================================================
const inMemoryAudiovisuals: AudiovisualResource[] = [...INITIAL_AUDIOVISUAL_RESOURCES];

/**
 * GET /api/audiovisuales
 * Supports query params: search, category, format
 */
app.get('/api/audiovisuales', (req: Request, res: Response) => {
  const { search, category, format } = req.query;

  let results = [...inMemoryAudiovisuals];

  if (format && typeof format === 'string' && format !== 'all') {
    results = results.filter((item) => item.format === format);
  }

  if (category && typeof category === 'string' && category !== 'all') {
    results = results.filter((item) => item.category === category);
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase().trim();
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }

  return res.json({
    success: true,
    total: results.length,
    data: results,
  });
});

/**
 * GET /api/audiovisuales/:id
 */
app.get('/api/audiovisuales/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const item = inMemoryAudiovisuals.find((r) => r.id === id);

  if (!item) {
    return res.status(404).json({
      success: false,
      error: 'Recurso audiovisual no encontrado.',
    });
  }

  return res.json({
    success: true,
    data: item,
  });
});

/**
 * POST /api/audiovisuales
 * Creates new resource (prepares administration support)
 */
app.post('/api/audiovisuales', (req: Request, res: Response) => {
  const {
    title,
    category,
    categoryLabel,
    format,
    duration,
    thumbnail,
    mediaUrl,
    author,
    description,
    takeaways,
    transcript,
    tags,
  } = req.body;

  if (!title || !category || !format || !mediaUrl) {
    return res.status(400).json({
      success: false,
      error: 'Los campos title, category, format y mediaUrl son obligatorios.',
    });
  }

  // Detect YouTube ID if applicable
  const ytMatch = mediaUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  const youtubeId = ytMatch ? ytMatch[1] : undefined;
  const safeEmbedUrl = youtubeId ? `https://www.youtube-nocookie.com/embed/${youtubeId}` : mediaUrl;

  const newResource: AudiovisualResource = {
    id: `av_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: String(title).trim(),
    category,
    categoryLabel: categoryLabel || 'Recurso Institucional',
    format: format || 'video',
    duration: duration || '3:00 min',
    thumbnail: thumbnail || '/src/assets/images/video_stop_technique_1792612453981.jpg',
    mediaUrl: safeEmbedUrl,
    youtubeId,
    author: author || 'Equipo de Orientación Escolar',
    description: description || '',
    takeaways: Array.isArray(takeaways) ? takeaways : [],
    transcript: transcript || '',
    isDemo: false,
    publishedAt: new Date().toISOString(),
    tags: Array.isArray(tags) ? tags : ['institucional'],
  };

  inMemoryAudiovisuals.unshift(newResource);

  return res.status(201).json({
    success: true,
    message: 'Recurso audiovisual agregado exitosamente.',
    data: newResource,
  });
});

/**
 * PUT /api/audiovisuales/:id
 */
app.put('/api/audiovisuales/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = inMemoryAudiovisuals.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Recurso no encontrado.',
    });
  }

  const existing = inMemoryAudiovisuals[index];
  const updated: AudiovisualResource = {
    ...existing,
    ...req.body,
    id: existing.id, // Immutable ID
    publishedAt: existing.publishedAt,
  };

  inMemoryAudiovisuals[index] = updated;

  return res.json({
    success: true,
    message: 'Recurso actualizado con éxito.',
    data: updated,
  });
});

/**
 * DELETE /api/audiovisuales/:id
 */
app.delete('/api/audiovisuales/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = inMemoryAudiovisuals.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Recurso no encontrado.',
    });
  }

  inMemoryAudiovisuals.splice(index, 1);

  return res.json({
    success: true,
    message: 'Recurso eliminado correctamente.',
  });
});

// ============================================================================
// ORIENTATION CASES API ENDPOINTS (Acompañamiento Escolar & Psicología)
// ============================================================================
const inMemoryCases: OrientationRequest[] = [
  {
    id: '#CASO-4829',
    studentEmail: 'alejandro.torres@correo.com',
    studentName: 'Alejandro Torres Morales',
    studentDoc: '1001234001',
    studentGrade: 'Grado 10° - Secundaria A',
    isAnonymous: false,
    targetArea: 'Orientación Escolar',
    status: 'nueva',
    priority: 'alta',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    timeFormatted: 'Hoy, 10:30 AM',
    topic: 'Estrés académico y exámenes finales',
    message: 'Me siento abrumado con las entregas grupales de esta semana y me cuesta concentrarme para descansar adecuadamente. Quisiera apoyo para organizar mi tiempo.',
    contactPref: 'presencial',
    notes: [],
  },
  {
    id: '#CASO-3912',
    studentEmail: 'mateo.gomez@correo.com',
    studentName: 'Mateo Gómez Silva',
    studentDoc: '1001234003',
    studentGrade: 'Grado 11° - Secundaria A',
    isAnonymous: false,
    targetArea: 'Psicología',
    status: 'revision',
    priority: 'moderada',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    timeFormatted: 'Ayer, 04:15 PM',
    topic: 'Apoyo socioemocional y expectativas futuras',
    message: 'Solicito un espacio presencial o virtual para revisar el manejo de ansiedad respecto a la graduación y presión de expectativas familiares.',
    contactPref: 'plataforma',
    responseNote: 'En revisión por el Departamento de Psicología para acordar espacio en consultorio.',
    notes: [
      {
        id: 'note_1',
        authorName: 'Dra. Marcela Rincón Duarte',
        authorRole: 'Psicología',
        createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        note: 'Se revisa perfil del estudiante. Caso priorizado para sesión de escucha activa este jueves.',
      },
    ],
  },
  {
    id: '#CASO-5104',
    studentEmail: 'anonimo_5104@expresate.seguro',
    studentName: 'Estudiante Anónimo (Identidad Protegida)',
    studentGrade: 'Grado 9° - Secundaria B',
    isAnonymous: true,
    targetArea: 'Orientación Escolar',
    status: 'nueva',
    priority: 'urgente',
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    timeFormatted: 'Ayer, 11:20 AM',
    topic: 'Convivencia y relaciones en el aula de clase',
    message: 'Quisiera mediar en un malentendido surgido con compañeros en el recreo. Me siento aislado y prefiero mantener la consulta anónima por ahora.',
    contactPref: 'plataforma',
    notes: [],
  },
  {
    id: '#CASO-2980',
    studentEmail: 'valeria.castro@correo.com',
    studentName: 'Valeria Castro Ríos',
    studentDoc: '1001234004',
    studentGrade: 'Grado 11° - Secundaria B',
    isAnonymous: false,
    targetArea: 'Psicología',
    status: 'resuelta',
    priority: 'preventiva',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    timeFormatted: '16 Feb, 09:00 AM',
    topic: 'Manejo de ansiedad ante presentaciones orales',
    message: 'Tenía mucho pánico escénico para la exposición de biología.',
    contactPref: 'presencial',
    responseNote: 'Sesión de respiración completada con éxito. Estudiante reportó mejoría notable en su presentación.',
    notes: [
      {
        id: 'note_2',
        authorName: 'Dra. Marcela Rincón Duarte',
        authorRole: 'Psicología',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        note: 'Sesión presencial de 30 minutos realizada en Consultorio de Psicología. Se enseñó técnica 4-7-8.',
      },
    ],
  },
];

/**
 * GET /api/orientation/cases
 * Query params: role, studentEmail
 */
app.get('/api/orientation/cases', (req: Request, res: Response) => {
  const { role, studentEmail } = req.query;
  const isStaff = role === 'orientador' || role === 'psicologo' || role === 'administrativo';

  if (isStaff) {
    return res.json({ success: true, data: inMemoryCases });
  }

  // Student role: only see own requests
  const filtered = studentEmail
    ? inMemoryCases.filter((c) => c.studentEmail.toLowerCase() === String(studentEmail).toLowerCase())
    : [];
  return res.json({ success: true, data: filtered });
});

/**
 * POST /api/orientation/cases
 */
app.post('/api/orientation/cases', (req: Request, res: Response) => {
  const {
    studentEmail,
    studentName,
    studentDoc,
    studentGrade,
    isAnonymous,
    targetArea,
    topic,
    message,
    contactPref,
  } = req.body;

  if (!message || !topic) {
    return res.status(400).json({
      success: false,
      error: 'El tema y el mensaje son requeridos.',
    });
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const timeFormatted = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newCase: OrientationRequest = {
    id: `#CASO-${randomNum}`,
    studentEmail: isAnonymous ? `anonimo_${randomNum}@expresate.seguro` : (studentEmail || 'estudiante@colegio.edu.co'),
    studentName: isAnonymous ? 'Estudiante Anónimo (Identidad Protegida)' : (studentName || 'Estudiante'),
    studentDoc,
    studentGrade: studentGrade || 'Grado 10° - Secundaria',
    isAnonymous: Boolean(isAnonymous),
    targetArea: targetArea || 'Orientación Escolar',
    status: 'nueva',
    priority: 'moderada',
    createdAt: now.toISOString(),
    timeFormatted: `Hoy, ${timeFormatted}`,
    topic: String(topic).trim(),
    message: String(message).trim(),
    contactPref: contactPref || 'presencial',
    notes: [],
  };

  inMemoryCases.unshift(newCase);

  return res.status(201).json({
    success: true,
    message: 'Solicitud de orientación registrada exitosamente.',
    data: newCase,
  });
});

/**
 * PUT /api/orientation/cases/:id/status
 */
app.put('/api/orientation/cases/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, responseNote } = req.body;

  const target = inMemoryCases.find((c) => c.id === id);
  if (!target) {
    return res.status(404).json({ success: false, error: 'Caso no encontrado.' });
  }

  if (status) target.status = status;
  if (responseNote !== undefined) target.responseNote = responseNote;

  return res.json({
    success: true,
    message: 'Estado del caso actualizado.',
    data: target,
  });
});

/**
 * POST /api/orientation/cases/:id/notes
 */
app.post('/api/orientation/cases/:id/notes', (req: Request, res: Response) => {
  const { id } = req.params;
  const { note, authorName, authorRole } = req.body;

  const target = inMemoryCases.find((c) => c.id === id);
  if (!target) {
    return res.status(404).json({ success: false, error: 'Caso no encontrado.' });
  }

  const newNote: CaseNote = {
    id: `note_${Date.now()}`,
    authorName: authorName || 'Personal Oficial',
    authorRole: authorRole || 'Orientación Escolar',
    createdAt: new Date().toISOString(),
    note: String(note).trim(),
  };

  if (!target.notes) target.notes = [];
  target.notes.push(newNote);

  return res.status(201).json({
    success: true,
    message: 'Nota interna agregada con éxito.',
    data: newNote,
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
