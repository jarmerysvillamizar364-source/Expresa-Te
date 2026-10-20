/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CaseNote {
  id: string;
  authorName: string;
  authorRole: 'Orientación Escolar' | 'Psicología';
  createdAt: string;
  note: string;
}

export interface OrientationRequest {
  id: string;
  studentEmail: string;
  studentName: string;
  studentDoc?: string;
  studentGrade: string;
  isAnonymous: boolean;
  targetArea: 'Orientación Escolar' | 'Psicología' | 'General';
  status: 'nueva' | 'revision' | 'agendada' | 'resuelta';
  priority: 'preventiva' | 'moderada' | 'alta' | 'urgente';
  createdAt: string;
  timeFormatted: string;
  topic: string;
  message: string;
  contactPref: 'presencial' | 'plataforma' | 'llamada';
  responseNote?: string;
  notes?: CaseNote[];
}

const STORAGE_KEY = 'expresa_te_orientation_cases_v2';

const INITIAL_CASES: OrientationRequest[] = [
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

class OrientationService {
  private requests: OrientationRequest[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.requests = JSON.parse(stored);
      } else {
        this.requests = [...INITIAL_CASES];
        this.persist();
      }
    } catch {
      this.requests = [...INITIAL_CASES];
    }
  }

  private persist() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.requests));
    }
  }

  /**
   * Obtiene solicitudes respetando estrictamente el rol del usuario:
   * - Si es estudiante: SOLO puede ver sus propias solicitudes registradas con su correo.
   * - Si es administrativo: puede ver todas las solicitudes institucionales.
   */
  public getRequests(role: string, studentEmail?: string): OrientationRequest[] {
    const isStaff = role === 'orientador' || role === 'psicologo' || role === 'administrativo';
    if (isStaff) {
      return [...this.requests];
    }

    // Role is estudiante: filter strictly by student email
    if (!studentEmail) return [];
    const normalized = studentEmail.trim().toLowerCase();
    return this.requests.filter(
      (r) => r.studentEmail.toLowerCase() === normalized
    );
  }

  /**
   * Envía una nueva solicitud de orientación desde el portal del estudiante.
   */
  public createRequest(params: {
    studentEmail: string;
    studentName: string;
    studentDoc?: string;
    studentGrade: string;
    isAnonymous: boolean;
    targetArea: 'Orientación Escolar' | 'Psicología' | 'General';
    topic: string;
    message: string;
    contactPref: 'presencial' | 'plataforma' | 'llamada';
  }): OrientationRequest {
    const randomId = `#CASO-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();

    const newReq: OrientationRequest = {
      id: randomId,
      studentEmail: params.studentEmail,
      studentName: params.isAnonymous
        ? 'Estudiante Anónimo (Identidad Protegida)'
        : params.studentName,
      studentDoc: params.isAnonymous ? undefined : params.studentDoc,
      studentGrade: params.studentGrade || 'Estudiante',
      isAnonymous: params.isAnonymous,
      targetArea: params.targetArea,
      status: 'nueva',
      priority: 'moderada',
      createdAt: now.toISOString(),
      timeFormatted: `Hoy, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      topic: params.topic,
      message: params.message,
      contactPref: params.contactPref,
      notes: [],
    };

    this.requests.unshift(newReq);
    this.persist();
    return newReq;
  }

  /**
   * Actualiza el estado de un caso por parte del equipo administrativo.
   */
  public updateStatus(
    id: string,
    status: OrientationRequest['status'],
    responseNote?: string
  ): boolean {
    const target = this.requests.find((r) => r.id === id);
    if (!target) return false;

    target.status = status;
    if (responseNote !== undefined) {
      target.responseNote = responseNote;
    }
    this.persist();
    return true;
  }

  /**
   * Agrega una nota de seguimiento confidencial al expediente.
   */
  public addCaseNote(
    caseId: string,
    noteText: string,
    authorName: string,
    authorRole: 'Orientación Escolar' | 'Psicología'
  ): boolean {
    const target = this.requests.find((r) => r.id === caseId);
    if (!target) return false;

    if (!target.notes) target.notes = [];
    target.notes.push({
      id: `note_${Date.now()}`,
      authorName,
      authorRole,
      createdAt: new Date().toISOString(),
      note: noteText,
    });
    this.persist();
    return true;
  }
}

export const orientationService = new OrientationService();
