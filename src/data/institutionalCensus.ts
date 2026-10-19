/**
 * Base de Datos Institucional Previa (Censo Escolar Oficial)
 * Contiene los registros previos de estudiantes y personal administrativo
 * para validar la identidad mediante documento antes de permitir el registro.
 */

export interface StudentCensusRecord {
  documento: string;
  nombreCompleto: string;
  grado: string;
  jornada: string;
  sede: string;
  rol: 'estudiante';
}

export interface AdministrativeCensusRecord {
  documento: string;
  nombreCompleto: string;
  perfil: 'Orientación Escolar' | 'Psicología';
  cargo: string;
  sede: string;
  rol: 'administrativo';
}

export type CensusRecord = StudentCensusRecord | AdministrativeCensusRecord;

/**
 * Base de datos con exactamente 15 registros de estudiantes
 */
export const STUDENTS_CENSUS: StudentCensusRecord[] = [
  {
    documento: '1001234001',
    nombreCompleto: 'Alejandro Torres Morales',
    grado: 'Grado 10° - Secundaria A',
    jornada: 'Mañana',
    sede: 'Sede Principal',
    rol: 'estudiante',
  },
  {
    documento: '1001234002',
    nombreCompleto: 'Sofía Valentina Méndez',
    grado: 'Grado 10° - Secundaria B',
    jornada: 'Mañana',
    sede: 'Sede Principal',
    rol: 'estudiante',
  },
  {
    documento: '1001234003',
    nombreCompleto: 'Mateo Gómez Silva',
    grado: 'Grado 11° - Secundaria A',
    jornada: 'Mañana',
    sede: 'Sede Principal',
    rol: 'estudiante',
  },
  {
    documento: '1001234004',
    nombreCompleto: 'Valeria Castro Ríos',
    grado: 'Grado 11° - Secundaria B',
    jornada: 'Mañana',
    sede: 'Sede Principal',
    rol: 'estudiante',
  },
  {
    documento: '1001234005',
    nombreCompleto: 'Santiago Ruiz Herrera',
    grado: 'Grado 9° - Secundaria A',
    jornada: 'Tarde',
    sede: 'Sede B - Bachillerato',
    rol: 'estudiante',
  },
  {
    documento: '1001234006',
    nombreCompleto: 'Camila Andrea Rivas',
    grado: 'Grado 9° - Secundaria B',
    jornada: 'Tarde',
    sede: 'Sede B - Bachillerato',
    rol: 'estudiante',
  },
  {
    documento: '1001234007',
    nombreCompleto: 'Daniel Felipe Mendoza',
    grado: 'Grado 8° - Secundaria A',
    jornada: 'Mañana',
    sede: 'Sede Principal',
    rol: 'estudiante',
  },
  {
    documento: '1001234008',
    nombreCompleto: 'Mariana Ospina Cruz',
    grado: 'Grado 8° - Secundaria B',
    jornada: 'Mañana',
    sede: 'Sede Principal',
    rol: 'estudiante',
  },
  {
    documento: '1001234009',
    nombreCompleto: 'Nicolás Pardo Gil',
    grado: 'Grado 7° - Secundaria A',
    jornada: 'Tarde',
    sede: 'Sede B - Bachillerato',
    rol: 'estudiante',
  },
  {
    documento: '1001234010',
    nombreCompleto: 'Lucía Fernanda Restrepo',
    grado: 'Grado 7° - Secundaria B',
    jornada: 'Tarde',
    sede: 'Sede B - Bachillerato',
    rol: 'estudiante',
  },
  {
    documento: '1001234011',
    nombreCompleto: 'Samuel David Vargas',
    grado: 'Grado 10° - Secundaria A',
    jornada: 'Mañana',
    sede: 'Sede Principal',
    rol: 'estudiante',
  },
  {
    documento: '1001234012',
    nombreCompleto: 'Isabella Ortiz Vega',
    grado: 'Grado 11° - Secundaria A',
    jornada: 'Mañana',
    sede: 'Sede Principal',
    rol: 'estudiante',
  },
  {
    documento: '1001234013',
    nombreCompleto: 'Sebastián Morales Peña',
    grado: 'Grado 9° - Secundaria A',
    jornada: 'Tarde',
    sede: 'Sede B - Bachillerato',
    rol: 'estudiante',
  },
  {
    documento: '1001234014',
    nombreCompleto: 'Gabriela Salcedo Luna',
    grado: 'Grado 10° - Secundaria B',
    jornada: 'Mañana',
    sede: 'Sede Principal',
    rol: 'estudiante',
  },
  {
    documento: '1001234015',
    nombreCompleto: 'Emiliano Quintana Hoyos',
    grado: 'Grado 11° - Secundaria B',
    jornada: 'Mañana',
    sede: 'Sede Principal',
    rol: 'estudiante',
  },
];

/**
 * Base de datos con exactamente 3 registros administrativos:
 * - 2 de Orientación Escolar
 * - 1 de Psicología
 */
export const ADMINISTRATIVE_CENSUS: AdministrativeCensusRecord[] = [
  {
    documento: '5234567001',
    nombreCompleto: 'Dra. Elena Gómez Restrepo',
    perfil: 'Orientación Escolar',
    cargo: 'Orientadora Escolar Principal',
    sede: 'Sede Principal - Consultorio de Bienestar',
    rol: 'administrativo',
  },
  {
    documento: '5234567002',
    nombreCompleto: 'Lic. Carlos Andrés Montoya',
    perfil: 'Orientación Escolar',
    cargo: 'Orientador Escolar - Convivencia y Apoyo Socioemocional',
    sede: 'Sede B - Bachillerato',
    rol: 'administrativo',
  },
  {
    documento: '5234567003',
    nombreCompleto: 'Dra. Marcela Rincón Duarte',
    perfil: 'Psicología',
    cargo: 'Psicóloga Educativa y Contención Emocional',
    sede: 'Sede Principal - Departamento de Psicología',
    rol: 'administrativo',
  },
];

/**
 * Busca un registro en el censo escolar por número de documento
 */
export function lookupCensusByDocument(doc: string): CensusRecord | null {
  const cleanDoc = doc.trim().replace(/\D/g, '');
  if (!cleanDoc) return null;

  const student = STUDENTS_CENSUS.find((s) => s.documento === cleanDoc);
  if (student) return student;

  const admin = ADMINISTRATIVE_CENSUS.find((a) => a.documento === cleanDoc);
  if (admin) return admin;

  return null;
}

/**
 * Busca específicamente en el censo de estudiantes
 */
export function lookupStudentByDocument(doc: string): StudentCensusRecord | null {
  const cleanDoc = doc.trim().replace(/\D/g, '');
  if (!cleanDoc) return null;
  return STUDENTS_CENSUS.find((s) => s.documento === cleanDoc) || null;
}

/**
 * Busca específicamente en el censo de administrativos
 */
export function lookupAdminByDocument(doc: string): AdministrativeCensusRecord | null {
  const cleanDoc = doc.trim().replace(/\D/g, '');
  if (!cleanDoc) return null;
  return ADMINISTRATIVE_CENSUS.find((a) => a.documento === cleanDoc) || null;
}
