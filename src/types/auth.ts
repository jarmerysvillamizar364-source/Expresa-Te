/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  documento?: string;
  role: 'estudiante' | 'orientador' | 'psicologo' | 'administrativo' | 'docente';
  perfil?: 'Orientación Escolar' | 'Psicología' | 'Estudiante';
  grade: string;
  sede?: string;
  password?: string;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpiresAt?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface SessionMetadata {
  sessionToken: string;
  userId: string;
  userEmail: string;
  userName: string;
  documento?: string;
  role: string;
  perfil?: string;
  grade?: string;
  sede?: string;
  isVerified: boolean;
  createdAt: string;
  expiresAt: string;
  userAgent?: string;
}

export interface ValidationResult {
  isValid: boolean;
  normalizedEmail: string;
  error?: string;
  errorCode?:
    | 'EMPTY_EMAIL'
    | 'INVALID_FORMAT'
    | 'UNAUTHORIZED_DOMAIN'
    | 'PERSONAL_EMAIL_REJECTED'
    | 'ALREADY_REGISTERED';
  domain?: string;
}

export interface AuthResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errorCode?: string;
}
