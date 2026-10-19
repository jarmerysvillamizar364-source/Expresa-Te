/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidationResult } from '../types/auth';

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
 * Validates institutional email address.
 * Allowed: Exactly ends with @colegio.edu.co with a valid local part.
 * Rejects personal domains (gmail, hotmail, etc.) and any unauthorized domain.
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

  // Basic RFC email format test (localpart@domain)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(normalized)) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      errorCode: 'INVALID_FORMAT',
      error:
        lang === 'es'
          ? 'El formato del correo es inválido. Debe incluir nombre de usuario y dominio.'
          : 'Invalid email format. Must include a username and domain.',
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

  // Check personal domain rejection with explicit message
  if (PERSONAL_DOMAINS.includes(domain)) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      errorCode: 'PERSONAL_EMAIL_REJECTED',
      domain,
      error:
        lang === 'es'
          ? `Dominio personal no permitido (@${domain}). Debes ingresar tu correo institucional terminado en @${INSTITUTIONAL_DOMAIN}.`
          : `Personal domain rejected (@${domain}). You must use your institutional email ending in @${INSTITUTIONAL_DOMAIN}.`,
    };
  }

  // Exact institutional domain verification
  if (domain !== INSTITUTIONAL_DOMAIN) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      errorCode: 'UNAUTHORIZED_DOMAIN',
      domain,
      error:
        lang === 'es'
          ? `Dominio no autorizado (@${domain}). Este sistema es exclusivo para la comunidad institucional (@${INSTITUTIONAL_DOMAIN}).`
          : `Unauthorized domain (@${domain}). This system is exclusive to the institutional community (@${INSTITUTIONAL_DOMAIN}).`,
    };
  }

  return {
    isValid: true,
    normalizedEmail: normalized,
    domain,
  };
}
