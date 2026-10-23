/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ValidationResult } from '../types/auth.ts';

export const INSTITUTIONAL_DOMAIN = 'colegio.edu.co';
export const INSTITUTIONAL_SUFFIX = `@${INSTITUTIONAL_DOMAIN}`;

export const PERSONAL_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'yahoo.es',
  'icloud.com',
  'live.com',
  'msn.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
];

/**
 * Normalizes email: strips leading/trailing spaces and converts to lowercase.
 */
export function normalizeEmail(email: string | null | undefined): string {
  if (!email) return '';
  return email.trim().toLowerCase();
}

/**
 * Validates any valid standard email format (allowing personal, institutional, or any custom domain).
 */
export function validateAnyEmail(
  rawEmail: string | null | undefined,
  lang: 'es' | 'en' = 'es'
): ValidationResult {
  const normalized = normalizeEmail(rawEmail);

  if (!normalized) {
    return {
      isValid: false,
      normalizedEmail: '',
      errorCode: 'EMPTY_EMAIL',
      error:
        lang === 'es'
          ? 'El correo electrónico es obligatorio.'
          : 'Email address is required.',
    };
  }

  // Standard email format test (localpart@domain.tld)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(normalized)) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      errorCode: 'INVALID_FORMAT',
      error:
        lang === 'es'
          ? 'El formato del correo es inválido.'
          : 'Invalid email format.',
    };
  }

  const parts = normalized.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1] || !parts[1].includes('.')) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      errorCode: 'INVALID_FORMAT',
      error:
        lang === 'es'
          ? 'Ingresa un correo electrónico válido.'
          : 'Please enter a valid email address.',
    };
  }

  return {
    isValid: true,
    normalizedEmail: normalized,
    domain: parts[1],
  };
}

/**
 * Legacy validator for specific @colegio.edu.co domain checks.
 */
export function validateInstitutionalEmail(
  rawEmail: string | null | undefined,
  lang: 'es' | 'en' = 'es'
): ValidationResult {
  const normalized = normalizeEmail(rawEmail);

  if (!normalized) {
    return {
      isValid: false,
      normalizedEmail: '',
      errorCode: 'EMPTY_EMAIL',
      error:
        lang === 'es'
          ? 'El correo electrónico es obligatorio.'
          : 'Email address is required.',
    };
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(normalized)) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      errorCode: 'INVALID_FORMAT',
      error:
        lang === 'es'
          ? 'El formato del correo es inválido.'
          : 'Invalid email format.',
    };
  }

  const parts = normalized.split('@');
  if (parts.length !== 2) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      errorCode: 'INVALID_FORMAT',
      error:
        lang === 'es'
          ? 'El correo debe tener una única arroba (@).'
          : 'Email must contain a single @ symbol.',
    };
  }

  const [localPart, domain] = parts;

  if (!localPart || localPart.length < 2) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      errorCode: 'INVALID_FORMAT',
      domain,
      error:
        lang === 'es'
          ? 'El nombre de usuario antes del @ es demasiado corto.'
          : 'Username before @ is too short.',
    };
  }

  if (PERSONAL_DOMAINS.includes(domain)) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      errorCode: 'PERSONAL_EMAIL_REJECTED',
      domain,
      error:
        lang === 'es'
          ? `Dominio personal no permitido (@${domain}).`
          : `Personal domain rejected (@${domain}).`,
    };
  }

  if (domain !== INSTITUTIONAL_DOMAIN) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      errorCode: 'UNAUTHORIZED_DOMAIN',
      domain,
      error:
        lang === 'es'
          ? `Dominio no autorizado (@${domain}).`
          : `Unauthorized domain (@${domain}).`,
    };
  }

  return {
    isValid: true,
    normalizedEmail: normalized,
    domain,
  };
}
