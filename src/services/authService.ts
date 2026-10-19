/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthResponse, SessionMetadata, User, ValidationResult } from '../types/auth';
import {
  STUDENTS_CENSUS,
  ADMINISTRATIVE_CENSUS,
  lookupCensusByDocument,
  StudentCensusRecord,
  AdministrativeCensusRecord,
  CensusRecord,
} from '../data/institutionalCensus';
import {
  normalizeEmail,
  validateAnyEmail,
} from '../utils/institutionalValidator';

const USERS_STORAGE_KEY = 'expresa_te_users_v6';
const SESSION_STORAGE_KEY = 'expresa_te_active_session_v6';

// No pre-registered test accounts: allows registering any of the 15 students and 3 admins fresh
const DEFAULT_USERS: User[] = [];

class AuthService {
  private users: User[] = [];
  private activeSession: SessionMetadata | null = null;

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        this.users = JSON.parse(stored);
      } else {
        this.users = [...DEFAULT_USERS];
        this.persistUsers();
      }

      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (storedSession) {
        this.activeSession = JSON.parse(storedSession);
      }
    } catch {
      this.users = [...DEFAULT_USERS];
    }
  }

  private persistUsers() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    }
  }

  private persistSession(session: SessionMetadata | null) {
    this.activeSession = session;
    if (typeof window !== 'undefined') {
      if (session) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
  }

  public getUsers(): User[] {
    return [...this.users];
  }

  public getSession(): SessionMetadata | null {
    return this.activeSession;
  }

  /**
   * Consulta el censo escolar previo por documento y comprueba si ya tiene cuenta.
   */
  public verifyCensusDocument(
    doc: string,
    expectedRole?: 'estudiante' | 'administrativo'
  ): {
    found: boolean;
    alreadyRegistered: boolean;
    record: CensusRecord | null;
    message: string;
  } {
    const cleanDoc = doc.trim().replace(/\D/g, '');
    if (!cleanDoc) {
      return {
        found: false,
        alreadyRegistered: false,
        record: null,
        message: 'Por favor ingresa un número de documento válido.',
      };
    }

    const record = lookupCensusByDocument(cleanDoc);

    if (!record) {
      return {
        found: false,
        alreadyRegistered: false,
        record: null,
        message: `El documento ${cleanDoc} no se encuentra registrado en el censo de la institución. Verifica el número o contacta a secretaría.`,
      };
    }

    // Role check if specified
    if (expectedRole && record.rol !== expectedRole) {
      const roleName = expectedRole === 'estudiante' ? 'estudiante' : 'personal administrativo';
      return {
        found: false,
        alreadyRegistered: false,
        record: null,
        message: `El documento ${cleanDoc} corresponde a otro tipo de usuario y no a ${roleName}.`,
      };
    }

    // Check if account already exists
    const existing = this.users.find(
      (u) => u.documento && u.documento === cleanDoc
    );

    if (existing) {
      return {
        found: true,
        alreadyRegistered: true,
        record,
        message: `Este documento ya tiene una cuenta activa asociada (${existing.email}). Puedes iniciar sesión directamente.`,
      };
    }

    return {
      found: true,
      alreadyRegistered: false,
      record,
      message: '✓ Documento validado en la base de datos institucional.',
    };
  }

  /**
   * Registra una nueva cuenta a partir de un documento validado en el censo.
   * Permite cualquier tipo de correo electrónico.
   */
  public async registerWithCensus(params: {
    documento: string;
    email: string;
    password: string;
    lang?: 'es' | 'en';
  }): Promise<AuthResponse<{ user: User; session: SessionMetadata }>> {
    const { documento, email, password, lang = 'es' } = params;
    const cleanDoc = documento.trim().replace(/\D/g, '');

    // 1. Verify document in census
    const censusCheck = this.verifyCensusDocument(cleanDoc);
    if (!censusCheck.found || !censusCheck.record) {
      return {
        success: false,
        message: censusCheck.message,
        errorCode: 'NOT_IN_CENSUS',
      };
    }

    if (censusCheck.alreadyRegistered) {
      return {
        success: false,
        message: censusCheck.message,
        errorCode: 'ALREADY_REGISTERED',
      };
    }

    // 2. Validate email (accepts ANY valid domain)
    const emailValidation = validateAnyEmail(email, lang);
    if (!emailValidation.isValid) {
      return {
        success: false,
        message: emailValidation.error || 'Correo electrónico inválido.',
        errorCode: emailValidation.errorCode,
      };
    }
    const normalizedEmail = emailValidation.normalizedEmail;

    // 3. Check duplicate email
    const duplicateEmail = this.users.find((u) => u.email === normalizedEmail);
    if (duplicateEmail) {
      return {
        success: false,
        message:
          lang === 'es'
            ? `El correo ${normalizedEmail} ya está registrado con otra cuenta.`
            : `Email ${normalizedEmail} is already registered with another account.`,
        errorCode: 'DUPLICATE_EMAIL',
      };
    }

    // 4. Validate password
    if (!password || password.length < 6) {
      return {
        success: false,
        message:
          lang === 'es'
            ? 'La contraseña debe tener mínimo 6 caracteres.'
            : 'Password must be at least 6 characters.',
        errorCode: 'WEAK_PASSWORD',
      };
    }

    // 5. Create user based on Census Record
    const rec = censusCheck.record;
    const isStudent = rec.rol === 'estudiante';
    const studentRec = isStudent ? (rec as StudentCensusRecord) : null;
    const adminRec = !isStudent ? (rec as AdministrativeCensusRecord) : null;

    let role: User['role'] = 'estudiante';
    let perfil: User['perfil'] = 'Estudiante';

    if (!isStudent && adminRec) {
      if (adminRec.perfil === 'Psicología') {
        role = 'psicologo';
        perfil = 'Psicología';
      } else {
        role = 'orientador';
        perfil = 'Orientación Escolar';
      }
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      documento: cleanDoc,
      name: rec.nombreCompleto,
      email: normalizedEmail,
      role,
      perfil,
      grade: isStudent && studentRec ? studentRec.grado : adminRec ? adminRec.cargo : 'Comunidad',
      sede: rec.sede,
      password,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.persistUsers();

    // 6. Automatically generate session
    const session: SessionMetadata = {
      sessionToken: `tok_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      userId: newUser.id,
      userEmail: newUser.email,
      userName: newUser.name,
      documento: newUser.documento,
      role: newUser.role,
      perfil: newUser.perfil,
      grade: newUser.grade,
      sede: newUser.sede,
      isVerified: true,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    this.persistSession(session);

    return {
      success: true,
      message:
        lang === 'es'
          ? `¡Cuenta creada exitosamente! Bienvenido, ${newUser.name}.`
          : `Account successfully created! Welcome, ${newUser.name}.`,
      data: {
        user: { ...newUser, password: '[PROTECTED]' },
        session,
      },
    };
  }

  /**
   * Inicio de sesión por correo o por documento de identidad.
   */
  public async login(
    identifier: string,
    password: string,
    accountDeleted: boolean = false,
    lang: 'es' | 'en' = 'es'
  ): Promise<AuthResponse<{ user: User; session: SessionMetadata }>> {
    if (accountDeleted) {
      return {
        success: false,
        message:
          lang === 'es'
            ? 'Esta cuenta fue dada de baja definitivamente.'
            : 'This account was deleted.',
        errorCode: 'ACCOUNT_DELETED',
      };
    }

    const trimmed = identifier.trim();
    if (!trimmed) {
      return {
        success: false,
        message:
          lang === 'es'
            ? 'Ingresa tu correo o número de documento.'
            : 'Enter your email or ID number.',
        errorCode: 'EMPTY_IDENTIFIER',
      };
    }

    if (!password) {
      return {
        success: false,
        message:
          lang === 'es'
            ? 'Ingresa tu contraseña.'
            : 'Please enter your password.',
        errorCode: 'EMPTY_PASSWORD',
      };
    }

    const cleanDoc = trimmed.replace(/\D/g, '');
    const cleanEmail = trimmed.toLowerCase();

    // Find user by email or by document
    const user = this.users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail ||
        (cleanDoc && u.documento === cleanDoc)
    );

    if (!user) {
      return {
        success: false,
        message:
          lang === 'es'
            ? 'No existe una cuenta registrada con este correo o documento.'
            : 'No registered account found with this email or document.',
        errorCode: 'UNREGISTERED_USER',
      };
    }

    if (user.password && user.password !== password) {
      return {
        success: false,
        message:
          lang === 'es'
            ? 'Contraseña incorrecta. Por favor verifica tus datos.'
            : 'Incorrect password. Please verify your credentials.',
        errorCode: 'WRONG_PASSWORD',
      };
    }

    const session: SessionMetadata = {
      sessionToken: `tok_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      documento: user.documento,
      role: user.role,
      perfil: user.perfil,
      grade: user.grade,
      sede: user.sede,
      isVerified: Boolean(user.isVerified),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    this.persistSession(session);

    return {
      success: true,
      message:
        lang === 'es'
          ? `Sesión iniciada correctamente. ¡Hola, ${user.name}!`
          : `Signed in successfully. Hello, ${user.name}!`,
      data: {
        user: { ...user, password: '[PROTECTED]' },
        session,
      },
    };
  }

  public logout(): void {
    this.persistSession(null);
  }
}

export const authService = new AuthService();
