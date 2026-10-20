import React, { useEffect, useState } from 'react';
import { Language, translations } from '../data/translations';
import {
  orientationService,
  OrientationRequest,
} from '../services/orientationService';

interface StudentOrientationViewProps {
  lang: Language;
  studentEmail: string;
  studentName: string;
  studentGrade: string;
  onNavigate: (screen: string) => void;
  onShowToast: (msg: string) => void;
}

export const StudentOrientationView: React.FC<StudentOrientationViewProps> = ({
  lang,
  studentEmail,
  studentName,
  studentGrade,
  onNavigate,
  onShowToast,
}) => {
  const t = translations[lang].orientation;
  const [activeTab, setActiveTab] = useState<'nueva' | 'mis_solicitudes'>('nueva');

  // Form state
  const [targetArea, setTargetArea] = useState<'Orientación Escolar' | 'Psicología' | 'General'>('Orientación Escolar');
  const [topic, setTopic] = useState('Estrés académico y presión escolar');
  const [customTopic, setCustomTopic] = useState('');
  const [message, setMessage] = useState('');
  const [contactPref, setContactPref] = useState<'presencial' | 'plataforma' | 'llamada'>('presencial');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<OrientationRequest | null>(null);

  // My requests state
  const [myRequests, setMyRequests] = useState<OrientationRequest[]>([]);

  const loadMyRequests = () => {
    const list = orientationService.getRequests('estudiante', studentEmail);
    setMyRequests(list);
  };

  useEffect(() => {
    loadMyRequests();
  }, [studentEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      onShowToast(
        lang === 'es'
          ? 'Por favor escribe tu mensaje o motivo de consulta.'
          : 'Please enter your message.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const finalTopic = topic === 'Otro' && customTopic.trim() ? customTopic.trim() : topic;
      const created = orientationService.createRequest({
        studentEmail,
        studentName: isAnonymous ? 'Estudiante Anónimo' : studentName,
        studentGrade,
        isAnonymous,
        targetArea,
        topic: finalTopic,
        message,
        contactPref,
      });

      setSubmittedRequest(created);
      loadMyRequests();
      onShowToast(
        lang === 'es'
          ? `Solicitud ${created.id} enviada confidencialmente.`
          : `Request ${created.id} submitted confidentially.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedRequest(null);
    setMessage('');
    setCustomTopic('');
    setActiveTab('nueva');
  };

  return (
    <div className="flex flex-col w-full space-y-8 pb-12 animate-fade-in">
      {/* Top Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-highest p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest text-primary shadow-xs">
            <span className="material-symbols-outlined text-[18px]">support_agent</span>
            <span className="font-label-sm font-bold uppercase tracking-wider">
              {lang === 'es' ? 'Atención y Escucha Confidencial' : 'Confidential Support'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            {lang === 'es' ? 'Solicitar Orientación y Acompañamiento' : 'Request Guidance & Support'}
          </h1>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            {lang === 'es'
              ? 'Este es tu espacio seguro para comunicarte con los equipos de Orientación Escolar y Psicología. Nadie más verá tu solicitud.'
              : 'This is your confidential space to reach out to school guidance and psychology teams. Only assigned counselors see your request.'}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/30 font-label-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>100% Protegido y Seguro</span>
          </div>
          <span className="text-xs text-on-surface-variant">
            {lang === 'es' ? 'Tus datos no son públicos ni visibles a otros estudiantes' : 'Your data is strictly confidential'}
          </span>
        </div>
      </section>

      {/* Mode Tabs: Nueva Solicitud vs Mis Solicitudes */}
      <div className="flex justify-center w-full">
        <div className="inline-flex items-center gap-2 p-1.5 bg-surface-container-low rounded-2xl border border-outline-variant/30 max-w-md w-full">
          <button
            type="button"
            onClick={() => setActiveTab('nueva')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-label-md font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'nueva'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">add_comment</span>
            <span>{lang === 'es' ? 'Nueva Solicitud' : 'New Request'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              loadMyRequests();
              setActiveTab('mis_solicitudes');
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl font-label-md font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'mis_solicitudes'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">inbox</span>
            <span>{lang === 'es' ? `Mis Solicitudes (${myRequests.length})` : `My Requests (${myRequests.length})`}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: NUEVA SOLICITUD */}
      {activeTab === 'nueva' && !submittedRequest && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column (7 Cols) */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Target Area: Orientación Escolar vs Psicología */}
              <div className="space-y-2">
                <label className="font-label-lg font-bold text-on-surface block text-left">
                  {lang === 'es' ? '1. ¿A qué área deseas dirigir tu consulta?' : '1. Which area do you want to contact?'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: 'Orientación Escolar' as const,
                      label: 'Orientación Escolar',
                      icon: 'favorite',
                      desc: 'Convivencia, metas, estudio',
                    },
                    {
                      id: 'Psicología' as const,
                      label: 'Psicología',
                      icon: 'psychology',
                      desc: 'Emociones, ansiedad, crisis',
                    },
                    {
                      id: 'General' as const,
                      label: 'Cualquiera disponible',
                      icon: 'groups',
                      desc: 'Atención más rápida',
                    },
                  ].map((area) => (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => setTargetArea(area.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        targetArea === area.id
                          ? 'border-primary bg-primary-fixed/20 shadow-xs'
                          : 'border-outline-variant/30 bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-on-surface">
                        <span className={`material-symbols-outlined text-[18px] ${targetArea === area.id ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {area.icon}
                        </span>
                        <span>{area.label}</span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant">
                        {area.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Selector */}
              <div className="space-y-2 text-left">
                <label htmlFor="topic-select" className="font-label-lg font-bold text-on-surface block">
                  {lang === 'es' ? '2. Motivo principal de tu solicitud:' : '2. Main topic:'}
                </label>
                <select
                  id="topic-select"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="Estrés académico y presión escolar">
                    Estrés académico y presión por exámenes o tareas
                  </option>
                  <option value="Manejo de ansiedad y emociones">
                    Manejo de ansiedad, miedos o desborde emocional
                  </option>
                  <option value="Convivencia y relaciones en el aula">
                    Convivencia, prevención de acoso o conflictos con compañeros
                  </option>
                  <option value="Dificultades personales o familiares">
                    Situación familiar o personal difícil
                  </option>
                  <option value="Orientación vocacional y futuro académico">
                    Orientación vocacional, carrera o plan de vida
                  </option>
                  <option value="Otro">Otro motivo personalizado...</option>
                </select>

                {topic === 'Otro' && (
                  <input
                    type="text"
                    required
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Escribe brevemente el tema..."
                    className="w-full h-11 px-4 mt-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
              </div>

              {/* Message */}
              <div className="space-y-2 text-left">
                <label htmlFor="message-text" className="font-label-lg font-bold text-on-surface block">
                  {lang === 'es' ? '3. Cuéntanos qué sucede (Mensaje privado):' : '3. What would you like to share?'}
                </label>
                <textarea
                  id="message-text"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    lang === 'es'
                      ? 'Escribe con total tranquilidad lo que estás sintiendo o lo que necesitas. El equipo te responderá con respeto y calidez...'
                      : 'Describe what you are going through. Our counselors will respond warmly...'
                  }
                  className="w-full p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md placeholder:text-outline-variant outline-none focus:ring-2 focus:ring-primary resize-y transition-all"
                />
              </div>

              {/* Contact Preference */}
              <div className="space-y-2 text-left">
                <label className="font-label-lg font-bold text-on-surface block">
                  {lang === 'es' ? '4. ¿Cómo prefieres que nos comuniquemos?' : '4. How would you like to be contacted?'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'presencial' as const, label: 'Presencial', icon: 'meeting_room', sub: 'En consultorio' },
                    { id: 'plataforma' as const, label: 'Por plataforma', icon: 'chat', sub: 'Mensaje privado' },
                    { id: 'llamada' as const, label: 'Llamada', icon: 'call', sub: 'Contacto telefónico' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setContactPref(p.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        contactPref === p.id
                          ? 'border-primary bg-primary-fixed/20 shadow-xs'
                          : 'border-outline-variant/30 bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[20px] ${contactPref === p.id ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {p.icon}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-on-surface">{p.label}</span>
                        <span className="text-[10px] text-on-surface-variant">{p.sub}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Anonymous Toggle */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-left">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isAnonymous ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {isAnonymous ? 'visibility_off' : 'badge'}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-sm text-on-surface block">
                      {isAnonymous ? 'Enviar de manera 100% Anónima' : 'Enviar identificado con mi nombre'}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {isAnonymous
                        ? 'Tu nombre y documento no se mostrarán al orientador; solo tu grado para ubicarte.'
                        : `El orientador sabrá que la solicitud es de ${studentName} (${studentGrade}).`}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    isAnonymous ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${isAnonymous ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-primary text-on-primary font-title-md font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary/95 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
                <span>{isSubmitting ? 'Enviando confidencialmente...' : 'Enviar Solicitud Confidencial'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Confidentiality & Emergency Hotlines (5 Cols) */}
          <div className="lg:col-span-5 space-y-5 text-left">
            {/* Trust Guarantee */}
            <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-primary font-bold">
                <span className="material-symbols-outlined text-[22px]">shield</span>
                <span className="font-title-md">Garantía de Confidencialidad</span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Toda la información que compartas en este formulario está protegida bajo el secreto profesional de Orientación Escolar y el Código Deontológico de Psicología (Ley 1090 de 2006). Ningún profesor ni compañero tendrá acceso a tus respuestas.
              </p>
              <div className="space-y-2 pt-2 border-t border-outline-variant/20 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                  <span>Sin juzgar y con escucha empática garantizada</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                  <span>Respuesta en menos de 24 horas hábiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                  <span>Puedes cancelar o pausar el acompañamiento cuando lo decidas</span>
                </div>
              </div>
            </div>

            {/* Immediate Help Hotlines */}
            <div className="p-6 rounded-3xl bg-error-container/30 border border-error/20 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-error font-bold">
                <span className="material-symbols-outlined text-[20px]">emergency</span>
                <span className="font-title-md">¿Necesitas ayuda urgente e inmediata?</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Si sientes que estás en una situación de crisis grave que no da espera, puedes comunicarte gratis a cualquier hora:
              </p>
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => onShowToast('Línea 106 de atención emocional activa 24/7')}
                  className="w-full py-2.5 px-4 rounded-xl bg-error text-on-error font-label-md font-bold flex items-center justify-between cursor-pointer shadow-xs hover:bg-error/90 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">phone</span>
                    <span>Línea 106</span>
                  </span>
                  <span className="text-xs">Salud Mental 24/7 (Gratis)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onShowToast('Línea 141 de Protección ICBF')}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-container-lowest text-on-surface font-label-md font-bold flex items-center justify-between cursor-pointer border border-outline-variant/30 hover:bg-surface-container-low transition-all"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-tertiary">phone</span>
                    <span>Línea 141 (ICBF)</span>
                  </span>
                  <span className="text-xs text-on-surface-variant">Protección a Niñez</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION CARD (when just submitted) */}
      {activeTab === 'nueva' && submittedRequest && (
        <div className="max-w-2xl mx-auto w-full bg-surface-container-lowest rounded-3xl p-6 sm:p-10 border border-outline-variant/30 shadow-lg text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-primary-fixed/40 text-primary mx-auto flex items-center justify-center">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-on-surface">
              ¡Tu solicitud ha sido recibida!
            </h2>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto">
              El equipo de {submittedRequest.targetArea} ha recibido tu mensaje y se pondrá en contacto contigo de forma respetuosa y confidencial.
            </p>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-4 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Folio de seguimiento:</span>
              <span className="font-mono font-bold text-primary">{submittedRequest.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Área asignada:</span>
              <span className="font-bold text-on-surface">{submittedRequest.targetArea}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Canal preferido:</span>
              <span className="font-bold text-on-surface capitalize">{submittedRequest.contactPref}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Estado actual:</span>
              <span className="font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                Recibida / En espera de revisión
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('mis_solicitudes')}
              className="flex-1 h-12 rounded-xl bg-primary text-on-primary font-label-md font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Ver mis solicitudes</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <button
              type="button"
              onClick={handleResetForm}
              className="flex-1 h-12 rounded-xl bg-surface-container text-on-surface font-label-md font-bold flex items-center justify-center cursor-pointer hover:bg-surface-container-high"
            >
              Enviar otra consulta
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: MIS SOLICITUDES ENVIADAS (STUDENT PRIVATE HISTORY) */}
      {activeTab === 'mis_solicitudes' && (
        <div className="max-w-4xl mx-auto w-full space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-on-surface">
                {lang === 'es' ? 'Historial de mis solicitudes' : 'My submitted requests'}
              </h2>
              <p className="text-xs text-on-surface-variant">
                {lang === 'es'
                  ? 'Consulta el estado y las respuestas confidenciales de tus orientadores.'
                  : 'Track status and responses from counselors.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmittedRequest(null);
                setActiveTab('nueva');
              }}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-sm font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Nueva solicitud</span>
            </button>
          </div>

          {myRequests.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-3xl p-10 border border-outline-variant/30 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-low text-on-surface-variant mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">mark_chat_read</span>
              </div>
              <h3 className="font-title-md font-bold text-on-surface">
                Aún no has enviado solicitudes de orientación
              </h3>
              <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
                Cuando necesites hablar sobre tus emociones, estrés o dudas de convivencia, envía una solicitud y aquí verás su avance.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('nueva')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold cursor-pointer"
              >
                Crear mi primera solicitud
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 border border-outline-variant/30 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-outline-variant/20">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-sm text-primary">
                        {req.id}
                      </span>
                      <span className="text-outline-variant">•</span>
                      <span className="text-xs font-semibold text-on-surface-variant">
                        {req.targetArea}
                      </span>
                      <span className="text-outline-variant">•</span>
                      <span className="text-xs text-on-surface-variant">
                        {req.timeFormatted}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === 'nueva' && (
                        <span className="px-3 py-1 rounded-full bg-primary-fixed/40 text-primary font-label-sm font-bold text-xs flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <span>Recibida</span>
                        </span>
                      )}
                      {req.status === 'revision' && (
                        <span className="px-3 py-1 rounded-full bg-secondary-fixed text-secondary font-label-sm font-bold text-xs flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-secondary" />
                          <span>En revisión por orientador</span>
                        </span>
                      )}
                      {req.status === 'agendada' && (
                        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-label-sm font-bold text-xs flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">event</span>
                          <span>Cita agendada en consultorio</span>
                        </span>
                      )}
                      {req.status === 'resuelta' && (
                        <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-label-sm font-bold text-xs flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">check</span>
                          <span>Acompañamiento completado</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-title-md font-bold text-on-surface">
                      {req.topic}
                    </h4>
                    <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                      {req.message}
                    </p>
                  </div>

                  {req.responseNote && (
                    <div className="p-3.5 rounded-2xl bg-primary-fixed/20 border border-primary/20 space-y-1">
                      <span className="text-xs font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">reply</span>
                        <span>Respuesta del equipo de orientación:</span>
                      </span>
                      <p className="text-xs text-on-surface leading-relaxed">
                        {req.responseNote}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 text-xs text-on-surface-variant border-t border-outline-variant/10">
                    <span className="capitalize">
                      Preferencia de contacto: <strong>{req.contactPref}</strong>
                    </span>
                    <span>
                      {req.isAnonymous ? 'Identidad Anónima' : 'Identificado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
