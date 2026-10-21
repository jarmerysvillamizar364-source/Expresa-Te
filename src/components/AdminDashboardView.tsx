import React, { useEffect, useState } from 'react';
import { Language } from '../data/translations';
import {
  STUDENTS_CENSUS,
  StudentCensusRecord,
} from '../data/institutionalCensus';
import {
  orientationService,
  OrientationRequest,
} from '../services/orientationService';

interface AdminDashboardViewProps {
  lang: Language;
  adminName: string;
  adminEmail: string;
  adminRole: string;
  adminPerfil: string;
  adminGrade: string;
  onNavigate: (screen: string) => void;
  onShowToast: (msg: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  lang,
  adminName,
  adminPerfil,
  adminGrade,
  onShowToast,
}) => {
  // Tabs: 'casos' | 'censo' | 'protocolos' | 'pausa'
  const [activeTab, setActiveTab] = useState<'casos' | 'censo' | 'protocolos' | 'pausa'>('casos');

  // Case triage filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'nueva' | 'revision' | 'agendada' | 'resuelta'>('all');
  const [areaFilter, setAreaFilter] = useState<'all' | 'Orientación Escolar' | 'Psicología'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Active cases from service
  const [cases, setCases] = useState<OrientationRequest[]>([]);

  // Response modal state
  const [selectedCase, setSelectedCase] = useState<OrientationRequest | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [newStatus, setNewStatus] = useState<OrientationRequest['status']>('revision');
  const [internalNote, setInternalNote] = useState('');

  // Census grade filter
  const [censusGradeFilter, setCensusGradeFilter] = useState<string>('todos');

  const loadCases = () => {
    const list = orientationService.getRequests('administrativo');
    setCases(list);
  };

  useEffect(() => {
    loadCases();
  }, []);

  // Filtered cases
  const filteredCases = cases.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (areaFilter !== 'all' && c.targetArea !== areaFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTopic = c.topic.toLowerCase().includes(q);
      const matchMsg = c.message.toLowerCase().includes(q);
      const matchId = c.id.toLowerCase().includes(q);
      const matchName = c.studentName.toLowerCase().includes(q);
      if (!matchTopic && !matchMsg && !matchId && !matchName) return false;
    }
    return true;
  });

  // KPI counts
  const totalCount = cases.length;
  const newCount = cases.filter((c) => c.status === 'nueva').length;
  const inReviewCount = cases.filter((c) => c.status === 'revision').length;
  const scheduledCount = cases.filter((c) => c.status === 'agendada').length;
  const resolvedCount = cases.filter((c) => c.status === 'resuelta').length;

  const handleOpenActionModal = (c: OrientationRequest) => {
    setSelectedCase(c);
    setResponseMessage(c.responseNote || '');
    setNewStatus(c.status);
    setInternalNote('');
  };

  const handleSaveCaseAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    orientationService.updateStatus(selectedCase.id, newStatus, responseMessage.trim() || undefined);

    if (internalNote.trim()) {
      orientationService.addCaseNote(
        selectedCase.id,
        internalNote.trim(),
        adminName,
        adminPerfil === 'Psicología' ? 'Psicología' : 'Orientación Escolar'
      );
    }

    loadCases();
    setSelectedCase(null);
    onShowToast(`Caso ${selectedCase.id} actualizado exitosamente.`);
  };

  return (
    <div className="flex flex-col w-full space-y-8 pb-12 animate-fade-in text-left">
      {/* 1. Header Banner tailored to Counselor / Psychologist */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-highest p-6 sm:p-8 border border-outline-variant/30 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>
              {adminPerfil === 'Psicología' ? 'Gabinete de Psicología' : 'Gabinete de Orientación Escolar'}
            </span>
          </div>
          <h1 className="font-headline-lg font-bold text-on-surface tracking-tight">
            Panel Profesional: <span className="text-primary">{adminName}</span>
          </h1>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            {adminGrade} • Sede Principal. Gestión confidencial de solicitudes de acompañamiento, triaje y seguimiento socioemocional escolar.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-label-md font-bold shadow-2xs border ${
            adminPerfil === 'Psicología'
              ? 'bg-purple-100 text-purple-900 border-purple-200'
              : 'bg-teal-100 text-teal-900 border-teal-200'
          }`}>
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            <span>Perfil: {adminPerfil}</span>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            Ley 1090 de 2006 • Sigilo y Deontología Profesional
          </span>
        </div>
      </section>

      {/* 2. Primary Navigation Tabs for Administrative Staff */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/30 shadow-2xs">
        {[
          { id: 'casos' as const, label: `Gestión de Casos (${newCount} nuevos)`, icon: 'inbox' },
          { id: 'censo' as const, label: `Directorio Escolar (${STUDENTS_CENSUS.length} estudiantes)`, icon: 'groups' },
          { id: 'protocolos' as const, label: 'Protocolos & Convivencia (Ley 1620)', icon: 'policy' },
          { id: 'pausa' as const, label: 'Pausa y Cuidado del Profesional', icon: 'spa' },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 h-11 px-4 rounded-xl font-label-md font-bold transition-all cursor-pointer whitespace-nowrap active:scale-[0.98] ${
                active
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================================================================== */}
      {/* TAB 1: GESTIÓN Y TRIAJE DE CASOS */}
      {/* ================================================================== */}
      {activeTab === 'casos' && (
        <div className="space-y-6">
          {/* Metrics Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-2xs flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Total Solicitudes
              </span>
              <span className="font-headline-lg font-bold text-on-surface mt-2">{totalCount}</span>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-primary/30 shadow-2xs flex flex-col justify-between bg-primary-fixed/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Nuevas (Por revisar)
                </span>
                <span className="text-xs font-bold text-primary font-mono">EN ESPERA</span>
              </div>
              <span className="font-headline-lg font-bold text-primary mt-2">{newCount}</span>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-secondary/30 shadow-2xs flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                En Revisión / Cita
              </span>
              <span className="font-headline-lg font-bold text-secondary mt-2">
                {inReviewCount + scheduledCount}
              </span>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-teal-500/30 shadow-2xs flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                Resueltas & Seguras
              </span>
              <span className="font-headline-lg font-bold text-teal-700 mt-2">{resolvedCount}</span>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/30 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all' as const, label: 'Todas' },
                { id: 'nueva' as const, label: 'Nuevas' },
                { id: 'revision' as const, label: 'En revisión' },
                { id: 'agendada' as const, label: 'Con cita' },
                { id: 'resuelta' as const, label: 'Resueltas' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={`h-9 px-3.5 rounded-xl font-label-sm font-bold text-xs cursor-pointer transition-all active:scale-[0.98] whitespace-nowrap flex items-center justify-center ${
                    statusFilter === st.id
                      ? 'bg-primary text-on-primary shadow-2xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Department Area Filter & Search */}
            <div className="flex items-center gap-2">
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value as typeof areaFilter)}
                className="h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-bold text-on-surface outline-none cursor-pointer"
              >
                <option value="all">Todas las áreas</option>
                <option value="Orientación Escolar">Orientación Escolar</option>
                <option value="Psicología">Psicología</option>
              </select>

              <div className="relative flex-1 sm:w-56">
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-outline text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar caso o estudiante..."
                  className="w-full h-10 pl-8 pr-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Cases List */}
          <div className="space-y-4">
            {filteredCases.length === 0 ? (
              <div className="bg-surface-container-lowest p-12 rounded-3xl border border-outline-variant/30 text-center space-y-2">
                <span className="material-symbols-outlined text-[36px] text-on-surface-variant">
                  inventory_2
                </span>
                <h3 className="font-title-md font-bold text-on-surface">
                  No se encontraron casos con los filtros aplicados
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Intenta cambiar el estado de triaje o el término de búsqueda.
                </p>
              </div>
            ) : (
              filteredCases.map((c) => (
                <div
                  key={c.id}
                  className={`bg-surface-container-lowest rounded-3xl p-6 border transition-all shadow-xs flex flex-col justify-between gap-4 ${
                    c.status === 'nueva'
                      ? 'border-primary/40 bg-primary-fixed/5'
                      : 'border-outline-variant/30'
                  }`}
                >
                  {/* Top Bar: ID, Urgency, Status, Area */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-outline-variant/15">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-sm text-primary">
                        {c.id}
                      </span>
                      <span className="text-outline-variant">•</span>
                      <span className="text-xs text-on-surface-variant">{c.timeFormatted}</span>
                      <span className="text-outline-variant">•</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        c.targetArea === 'Psicología'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {c.targetArea}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Priority Tag */}
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        c.priority === 'urgente'
                          ? 'bg-red-100 text-red-800 font-extrabold'
                          : c.priority === 'alta'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        Urgencia: {c.priority}
                      </span>

                      {/* Status Tag */}
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        c.status === 'nueva'
                          ? 'bg-primary text-on-primary'
                          : c.status === 'revision'
                          ? 'bg-secondary text-on-secondary'
                          : c.status === 'agendada'
                          ? 'bg-purple-600 text-white'
                          : 'bg-teal-700 text-white'
                      }`}>
                        {c.status === 'nueva'
                          ? 'Nueva'
                          : c.status === 'revision'
                          ? 'En revisión'
                          : c.status === 'agendada'
                          ? 'Cita agendada'
                          : 'Resuelta'}
                      </span>
                    </div>
                  </div>

                  {/* Student Identification & Channel info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-outline text-[20px]">
                        {c.isAnonymous ? 'visibility_off' : 'school'}
                      </span>
                      <span className="font-bold text-sm text-on-surface">
                        {c.studentName}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        ({c.studentGrade})
                      </span>
                    </div>

                    <div className="text-xs text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        {c.contactPref === 'presencial' ? 'meeting_room' : c.contactPref === 'plataforma' ? 'chat' : 'phone'}
                      </span>
                      <span>Canal elegido: <strong className="capitalize">{c.contactPref}</strong></span>
                    </div>
                  </div>

                  {/* Topic & Full Confidential Message */}
                  <div className="bg-surface-container-low p-4 rounded-2xl space-y-2">
                    <h4 className="font-title-md font-bold text-on-surface">
                      {c.topic}
                    </h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      &quot;{c.message}&quot;
                    </p>
                  </div>

                  {/* Existing Response or Internal Notes */}
                  {c.responseNote && (
                    <div className="p-3.5 rounded-2xl bg-primary-fixed/20 border border-primary/20 text-xs space-y-1">
                      <span className="font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">reply</span>
                        <span>Respuesta oficial enviada al estudiante:</span>
                      </span>
                      <p className="text-on-surface">{c.responseNote}</p>
                    </div>
                  )}

                  {c.notes && c.notes.length > 0 && (
                    <div className="p-3 rounded-2xl bg-surface-container-high/60 text-xs space-y-2 border border-outline-variant/20">
                      <span className="font-bold text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">clinical_notes</span>
                        <span>Bitácora interna del caso ({c.notes.length} notas):</span>
                      </span>
                      {c.notes.map((n) => (
                        <div key={n.id} className="pl-2 border-l-2 border-primary/50 text-[11px] text-on-surface">
                          <strong>{n.authorName} ({n.authorRole}):</strong> {n.note}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Button: Open Attend Modal */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleOpenActionModal(c)}
                      className="h-10 px-5 rounded-xl bg-primary text-on-primary font-label-md font-bold flex items-center gap-2 cursor-pointer shadow-xs hover:bg-primary/95 active:scale-[0.98] transition-all whitespace-nowrap"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit_note</span>
                      <span>Atender Caso & Responder</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 2: CENSO INSTITUCIONAL Y DIRECTORIO ESCOLAR */}
      {/* ================================================================== */}
      {activeTab === 'censo' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-on-surface">
                Directorio y Censo de Estudiantes Matriculados
              </h2>
              <p className="text-xs text-on-surface-variant">
                15 registros habilitados en el censo oficial para seguimiento y verificación.
              </p>
            </div>

            {/* Filter by Grade */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface-variant">Filtrar por grado:</span>
              <select
                value={censusGradeFilter}
                onChange={(e) => setCensusGradeFilter(e.target.value)}
                className="h-9 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-bold text-on-surface outline-none cursor-pointer"
              >
                <option value="todos">Todos los grados</option>
                <option value="11">Grado 11°</option>
                <option value="10">Grado 10°</option>
                <option value="9">Grado 9°</option>
                <option value="8">Grado 8°</option>
                <option value="7">Grado 7°</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STUDENTS_CENSUS
              .filter((st) => censusGradeFilter === 'todos' || st.grado.includes(censusGradeFilter))
              .map((st: StudentCensusRecord, idx) => (
                <div
                  key={st.documento}
                  className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-surface-container-low text-primary font-bold border border-outline-variant/20">
                      Doc: {st.documento}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-on-surface">{st.nombreCompleto}</h4>
                    <p className="text-xs text-on-surface-variant font-medium mt-0.5">{st.grado}</p>
                    <p className="text-xs text-on-surface-variant">{st.sede} • Jornada {st.jornada}</p>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 text-tertiary font-semibold">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      <span>Censo oficial</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onShowToast(`Expediente escolar de ${st.nombreCompleto} en orden.`)}
                      className="text-primary hover:underline font-bold cursor-pointer"
                    >
                      Ver ficha
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 3: PROTOCOLOS INSTITUCIONALES Y RUTAS (LEY 1620) */}
      {/* ================================================================== */}
      {activeTab === 'protocolos' && (
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-primary font-bold">
              <span className="material-symbols-outlined text-[24px]">policy</span>
              <h3 className="font-title-lg">
                Ruta de Atención Integral para la Convivencia Escolar (Ley 1620 de 2013)
              </h3>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Como funcionario de Orientación Escolar o Psicología, sigue esta clasificación para la activación de protocolos según la gravedad del caso:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-2">
                <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                  Situaciones Tipo I
                </span>
                <h4 className="font-bold text-sm text-on-surface">Conflictos cotidianos manejables</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Desacuerdos entre pares, malentendidos en recreo o aula. Mediación pedagógica y acuerdos de convivencia sin daño físico o moral grave.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-2">
                <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-secondary/10 text-secondary">
                  Situaciones Tipo II
                </span>
                <h4 className="font-bold text-sm text-on-surface">Acoso escolar o agresión repetitiva</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Bullying, ciberacoso o agresiones sistemáticas que afectan la salud física o emocional pero no configuran delito. Requiere citación de acudientes y plan de acompañamiento.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-2">
                <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-red-100 text-red-800">
                  Situaciones Tipo III
                </span>
                <h4 className="font-bold text-sm text-on-surface">Vulneración grave o presunto delito</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Riesgo vital, violencia sexual, agresiones con incapacidad o autolesión severa. Remisión inmediata a sector salud, ICBF o autoridades de policía judicial.
                </p>
              </div>
            </div>
          </div>

          {/* Directorio de Remisión Externa Oficial */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-xs space-y-4">
            <h3 className="font-title-md font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">call</span>
              <span>Líneas y Contactos Interinstitucionales de Emergencia</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
                <span className="font-bold text-error block">Línea 106</span>
                <span className="text-on-surface font-semibold">Salud Mental y Contención Emocional</span>
                <span className="text-on-surface-variant block">Atención psicosocial 24 horas</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
                <span className="font-bold text-tertiary block">Línea 141 (ICBF)</span>
                <span className="text-on-surface font-semibold">Defensoría de Familia y Menores</span>
                <span className="text-on-surface-variant block">Protección urgente de derechos</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
                <span className="font-bold text-primary block">Línea 123</span>
                <span className="text-on-surface font-semibold">Urgencias Médicas / Ambulancia</span>
                <span className="text-on-surface-variant block">Atención hospitalaria prioritaria</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
                <span className="font-bold text-secondary block">Línea 122 (Fiscalía)</span>
                <span className="text-on-surface font-semibold">CAIVAS / Delitos contra Menores</span>
                <span className="text-on-surface-variant block">Denuncia y medidas de protección</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 4: PAUSA CONSCIENTE Y CUIDADO DEL PROFESIONAL */}
      {/* ================================================================== */}
      {activeTab === 'pausa' && (
        <div className="max-w-3xl mx-auto w-full bg-surface-container-lowest p-6 sm:p-10 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary-fixed/50 text-secondary mx-auto flex items-center justify-center">
            <span className="material-symbols-outlined text-[36px]">spa</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-on-surface">
              Pausa Consciente para el Orientador y Psicólogo
            </h2>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
              La labor de contención emocional y escucha activa genera desgaste por empatía. Tómate 2 minutos de respiración y descanso antes del siguiente caso.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/20 max-w-lg mx-auto text-left space-y-3">
            <h4 className="font-bold text-sm text-primary">Técnica de Descompresión entre Sesiones:</h4>
            <ul className="space-y-2 text-xs text-on-surface-variant list-disc pl-4">
              <li>Ponte de pie, estira los brazos y hombros durante 30 segundos.</li>
              <li>Toma un vaso de agua antes de atender a la siguiente persona.</li>
              <li>Inhala profundamente en 4 segundos, retén 4 y exhala en 6 segundos.</li>
              <li>Recuerda delimitar el espacio laboral de tu bienestar personal.</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onShowToast('¡Pausa registrada! Recuerda que tu salud mental también es prioridad.')}
            className="px-6 py-2.5 rounded-xl bg-secondary text-on-secondary font-label-md font-bold cursor-pointer shadow-xs hover:bg-secondary/90 transition-all"
          >
            Completar Pausa de Descompresión
          </button>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL: ATENDER CASO, ENVIAR RESPUESTA Y ACTUALIZAR ESTADO */}
      {/* ================================================================== */}
      {selectedCase && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedCase(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-outline-variant/30 flex flex-col gap-4 overflow-y-auto"
          >
            <div className="flex items-start justify-between pb-3 border-b border-outline-variant/20">
              <div>
                <span className="font-mono font-bold text-xs text-primary">
                  {selectedCase.id}
                </span>
                <h3 className="font-title-lg font-bold text-on-surface">
                  Atención del Caso: {selectedCase.topic}
                </h3>
                <span className="text-xs text-on-surface-variant">
                  Estudiante: <strong>{selectedCase.studentName}</strong> ({selectedCase.studentGrade}) • Canal: <strong>{selectedCase.contactPref}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Student Message Quote */}
            <div className="p-3.5 rounded-2xl bg-surface-container-low text-xs space-y-1">
              <span className="font-bold text-on-surface-variant block">Mensaje original del estudiante:</span>
              <p className="text-on-surface italic leading-relaxed">&quot;{selectedCase.message}&quot;</p>
            </div>

            <form onSubmit={handleSaveCaseAction} className="space-y-4">
              {/* Change Status */}
              <div className="space-y-1.5">
                <label className="font-label-md font-bold text-on-surface block">
                  Actualizar estado del caso:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'nueva' as const, label: 'Nueva' },
                    { id: 'revision' as const, label: 'En revisión' },
                    { id: 'agendada' as const, label: 'Cita agendada' },
                    { id: 'resuelta' as const, label: 'Resuelta' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setNewStatus(st.id)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        newStatus === st.id
                          ? 'bg-primary text-on-primary border-primary shadow-xs'
                          : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Response to Student */}
              <div className="space-y-1.5">
                <label htmlFor="response-text" className="font-label-md font-bold text-on-surface block">
                  Respuesta oficial para el estudiante (visible en su portal privado):
                </label>
                <textarea
                  id="response-text"
                  rows={3}
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Escribe una respuesta empática, por ejemplo: 'Hola, hemos recibido tu solicitud. Te esperamos este miércoles en el consultorio 2 a las 10:00 AM...'"
                  className="w-full p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Internal Clinical Note */}
              <div className="space-y-1.5">
                <label htmlFor="note-text" className="font-label-md font-bold text-on-surface block">
                  Nota interna confidencial (solo visible para Orientación y Psicología):
                </label>
                <textarea
                  id="note-text"
                  rows={2}
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Bitácora interna: observaciones clínicas, acuerdos de citación, coordinación con acudiente..."
                  className="w-full p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="h-10 px-5 rounded-xl bg-surface-container text-on-surface font-label-md font-semibold cursor-pointer hover:bg-surface-container-high active:scale-[0.98] transition-all whitespace-nowrap"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-primary text-on-primary font-label-md font-bold cursor-pointer shadow-xs hover:bg-primary/95 active:scale-[0.98] transition-all whitespace-nowrap"
                >
                  Guardar y Notificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
