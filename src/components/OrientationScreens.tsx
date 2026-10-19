import React, { useState } from 'react';
import { Language, translations } from '../data/translations';

interface OrientationProps {
  lang: Language;
  subScreen: 'form' | 'sent' | 'counselor';
  onChangeSubScreen: (sub: 'form' | 'sent' | 'counselor') => void;
  onNavigate: (screen: string) => void;
  onShowToast: (msg: string) => void;
}

export const OrientationScreens: React.FC<OrientationProps> = ({
  lang,
  subScreen,
  onChangeSubScreen,
  onNavigate,
  onShowToast,
}) => {
  const t = translations[lang].orientation;
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [contactPref, setContactPref] = useState<
    'presencial' | 'plataforma' | 'llamada'
  >('presencial');
  const [counselorFilter, setCounselorFilter] = useState<
    'all' | 'nueva' | 'revision' | 'atendida'
  >('all');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const [requests, setRequests] = useState([
    {
      id: '#4829',
      grade: 'Grado 10°',
      status: 'nueva' as 'nueva' | 'revision' | 'atendida',
      time: 'Hoy, 10:30 AM',
      topic: 'Estrés académico y exámenes finales',
      topicIcon: 'help_center',
      excerpt:
        '"Me siento abrumado con las entregas grupales de esta semana y me cuesta concentrarme para descansar..."',
    },
    {
      id: '#3912',
      grade: 'Grado 11°',
      status: 'revision' as 'nueva' | 'revision' | 'atendida',
      time: 'Ayer, 04:15 PM',
      topic: 'Apoyo socioemocional y orientación vocacional',
      topicIcon: 'favorite',
      excerpt:
        '"Solicito un espacio presencial o virtual para revisar opciones universitarias y manejo de expectativas familiares."',
    },
    {
      id: '#5104',
      grade: 'Grado 9°',
      status: 'nueva' as 'nueva' | 'revision' | 'atendida',
      time: 'Ayer, 11:20 AM',
      topic: 'Convivencia y relaciones en el aula',
      topicIcon: 'diversity_3',
      excerpt:
        '"Quisiera mediar en un malentendido surgido en el recreo con compañeros de clase para evitar distanciamiento."',
    },
    {
      id: '#2980',
      grade: 'Grado 10°',
      status: 'atendida' as 'nueva' | 'revision' | 'atendida',
      time: '12 Feb, 09:00 AM',
      topic: 'Manejo de ansiedad ante presentaciones',
      topicIcon: 'spa',
      excerpt:
        'Sesión de respiración completada • Plan de seguimiento enviado',
    },
  ]);

  const handleCycleStatus = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req;
        const nextStatus =
          req.status === 'nueva'
            ? 'revision'
            : req.status === 'revision'
            ? 'atendida'
            : 'nueva';
        onShowToast(`${req.id} → ${nextStatus.toUpperCase()}`);
        return { ...req, status: nextStatus };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast(t.sentTitle);
    onChangeSubScreen('sent');
  };

  return (
    <div className="flex flex-col w-full space-y-8 pb-12">
      {/* Sub-Navigation Web Tabs */}
      <div className="flex justify-center w-full">
        <div className="inline-flex items-center gap-1.5 p-1.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs max-w-xl w-full">
          <button
            type="button"
            onClick={() => onChangeSubScreen('form')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-label-md font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              subScreen === 'form'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              edit_note
            </span>
            <span>{t.subTabForm}</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeSubScreen('sent')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-label-md font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              subScreen === 'sent'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              task_alt
            </span>
            <span>{t.subTabSent}</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeSubScreen('counselor')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-label-md font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              subScreen === 'counselor'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              psychology
            </span>
            <span>{t.subTabCounselor}</span>
          </button>
        </div>
      </div>

      {/* 1. SOLICITAR ORIENTACIÓN (FORM): Split-view 2-column web layout */}
      {subScreen === 'form' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Form Card */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="relative overflow-hidden bg-gradient-to-br from-surface-container-low to-surface-container rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest text-tertiary shadow-xs mb-3">
                <span className="material-symbols-outlined text-[16px]">
                  verified_user
                </span>
                <span className="font-label-sm font-bold uppercase tracking-wider">
                  {t.badge}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                {t.title}
              </h1>
              <p className="font-body-md text-on-surface-variant mt-2 leading-relaxed">
                {t.subtitle}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-6"
            >
              {/* Motivo de consulta */}
              <div className="space-y-2">
                <label
                  htmlFor="motivoSelect"
                  className="flex items-center gap-2 font-title-md font-bold text-on-surface"
                >
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    psychology
                  </span>
                  <span>{t.reasonLabel}</span>
                </label>
                <div className="relative">
                  <select
                    id="motivoSelect"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="w-full h-12 pl-4 pr-10 bg-surface-container-low text-on-surface font-body-md rounded-2xl border border-outline-variant/30 appearance-none outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest cursor-pointer transition-all"
                  >
                    <option value="" disabled>
                      {t.reasonPlaceholder}
                    </option>
                    <option value="apoyo-emocional">{t.reason1}</option>
                    <option value="estres-escolar">{t.reason2}</option>
                    <option value="situacion-personal">{t.reason3}</option>
                    <option value="convivencia">{t.reason4}</option>
                    <option value="otro">{t.reason5}</option>
                  </select>
                  <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">
                      expand_more
                    </span>
                  </div>
                </div>
                <span className="text-xs text-on-surface-variant block px-1">
                  {t.reasonHint}
                </span>
              </div>

              {/* Mensaje o Descripción */}
              <div className="space-y-2">
                <label
                  htmlFor="mensajeTextarea"
                  className="flex items-center gap-2 font-title-md font-bold text-on-surface"
                >
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    edit
                  </span>
                  <span>{t.msgLabel}</span>
                </label>
                <textarea
                  id="mensajeTextarea"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.msgPlaceholder}
                  className="w-full p-4 bg-surface-container-low text-on-surface font-body-md rounded-2xl border border-outline-variant/30 outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest resize-none transition-all placeholder:text-outline-variant"
                ></textarea>
              </div>

              {/* Preferencia de contacto */}
              <div className="space-y-2">
                <span className="block font-title-md font-bold text-on-surface">
                  {t.prefLabel}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'presencial' as const,
                      label: t.pref1Title,
                      icon: 'meeting_room',
                    },
                    {
                      id: 'plataforma' as const,
                      label: t.pref2Title,
                      icon: 'chat',
                    },
                    {
                      id: 'llamada' as const,
                      label: t.pref3Title,
                      icon: 'phone',
                    },
                  ].map((p) => {
                    const isSelected = contactPref === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setContactPref(p.id)}
                        className={`p-3.5 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-on-primary border-primary shadow-xs font-bold'
                            : 'bg-surface-container-low border-outline-variant/30 text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {p.icon}
                        </span>
                        <span className="font-label-sm">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggle de Modo Anónimo */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-label-md font-bold text-on-surface block">
                    {lang === 'es' ? 'Identidad protegida y confidencial' : 'Protected confidential identity'}
                  </span>
                  <span className="text-xs text-on-surface-variant leading-relaxed">
                    {lang === 'es'
                      ? 'Tu mensaje se procesa con protocolo de confidencialidad institucional escolar.'
                      : 'Your message is processed under school institutional confidentiality protocols.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    isAnonymous ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs absolute top-1 ${
                      isAnonymous ? 'left-6' : 'left-1'
                    }`}
                  ></div>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg font-bold shadow-md shadow-primary/25 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  send
                </span>
                <span>{t.submitBtn}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-on-surface-variant pt-1">
                <span className="material-symbols-outlined text-[15px] text-tertiary">
                  shield_lock
                </span>
                <span>{t.trustDesc}</span>
              </div>
            </form>
          </div>

          {/* Right Column (5 cols): Institutional Guidance Sidebar */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Step-by-step guidance card */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 border border-outline-variant/30 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 text-primary">
                <span className="material-symbols-outlined text-[24px]">
                  help_center
                </span>
                <h3 className="font-title-lg font-bold text-on-surface">
                  {lang === 'es' ? '¿Cómo funciona la orientación?' : 'How guidance works'}
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    step: '1',
                    title: lang === 'es' ? 'Recepción Confidencial' : 'Confidential Intake',
                    desc: lang === 'es' ? 'Tu solicitud llega de manera cifrada únicamente al equipo de orientación escolar.' : 'Your request arrives encrypted only to the school guidance team.',
                  },
                  {
                    step: '2',
                    title: lang === 'es' ? 'Asignación Respetuosa' : 'Warm Assignment',
                    desc: lang === 'es' ? 'Un orientador revisará tu motivo y preparará un espacio seguro y cálido.' : 'A certified counselor will review your reason and prepare a safe space.',
                  },
                  {
                    step: '3',
                    title: lang === 'es' ? 'Contacto en 24-48 horas' : 'Contact in 24-48h',
                    desc: lang === 'es' ? 'Te responderemos según tu canal preferido (presencial, chat o llamada).' : 'We will reply according to your preferred channel.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-primary-fixed/40 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-title-sm font-bold text-on-surface">
                        {item.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Hotline Card */}
            <div className="bg-error-container/20 rounded-3xl p-6 sm:p-7 border border-error/30 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 text-error">
                <span className="material-symbols-outlined text-[24px]">
                  emergency
                </span>
                <h3 className="font-title-lg font-bold text-on-surface">
                  {lang === 'es' ? '¿Es una situación urgente?' : 'Is it an urgent situation?'}
                </h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {lang === 'es'
                  ? 'Si sientes que tu vida o la de alguien está en riesgo inminente, comunícate de inmediato con las líneas oficiales 24/7 gratuitas:'
                  : 'If you or someone else is in immediate distress, reach out directly to the official 24/7 toll-free lines:'}
              </p>
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => onShowToast('Llamando a Línea 106 de atención emocional...')}
                  className="w-full py-2.5 px-4 rounded-xl bg-error text-on-error font-label-md font-bold flex items-center justify-between cursor-pointer shadow-xs hover:bg-error/90 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">phone</span>
                    <span>Línea 106</span>
                  </span>
                  <span className="text-xs font-semibold">Salud Mental 24/7</span>
                </button>

                <button
                  type="button"
                  onClick={() => onShowToast('Llamando a Línea 141 del ICBF...')}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-container-lowest text-on-surface font-label-md font-bold flex items-center justify-between cursor-pointer border border-outline-variant/30 hover:bg-surface-container-low transition-all"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-tertiary">phone</span>
                    <span>Línea 141 (ICBF)</span>
                  </span>
                  <span className="text-xs text-on-surface-variant">Protección Niñez</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SOLICITUD ENVIADA (SENT): Clean Web Confirmation Card */}
      {subScreen === 'sent' && (
        <div className="max-w-2xl mx-auto w-full flex flex-col items-center text-center space-y-6 pt-4 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[44px]">
              check_circle
            </span>
          </div>

          <div className="space-y-2 max-w-lg">
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
              {t.sentTitle}
            </h1>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              {t.sentDesc}
            </p>
          </div>

          <div className="w-full bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm text-left space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
              <div className="flex flex-col">
                <span className="font-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
                  {t.trackingLabel}
                </span>
                <span className="font-headline-sm text-primary font-mono font-bold mt-0.5">
                  #ET-8492
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-high text-primary rounded-full font-label-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>{t.statusReview}</span>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    calendar_today
                  </span>
                  {t.dateSentLabel}
                </span>
                <span className="font-bold text-on-surface">{t.dateSentValue}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    psychology
                  </span>
                  {t.counselorLabel}
                </span>
                <span className="font-bold text-on-surface">{t.counselorValue}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    forum
                  </span>
                  {t.prefChosenLabel}
                </span>
                <span className="font-bold text-on-surface">{t.prefChosenValue}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-surface-container-low/70 rounded-2xl border border-outline-variant/30">
              <span className="material-symbols-outlined text-tertiary text-[22px] shrink-0 mt-0.5">
                volunteer_activism
              </span>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                {t.reassuranceText}
              </p>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => onChangeSubScreen('counselor')}
              className="h-12 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg font-bold shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer hover:opacity-95"
            >
              <span>{t.viewRequestBtn}</span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('inicio')}
              className="h-12 rounded-2xl bg-surface-container text-on-surface font-label-lg font-bold hover:bg-surface-container-high transition-colors flex items-center justify-center cursor-pointer"
            >
              {t.backHomeBtn}
            </button>
          </div>
        </div>
      )}

      {/* 3. PANEL DE ORIENTADOR (PROFESSIONAL ADMIN DASHBOARD): Multi-column Web View */}
      {subScreen === 'counselor' && (
        <div className="flex flex-col space-y-8 animate-fade-in">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-highest p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest text-primary shadow-xs">
                <span className="material-symbols-outlined text-[18px]">
                  psychology
                </span>
                <span className="font-label-sm font-bold uppercase tracking-wider">
                  {t.profBadge}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                {t.profTitle}
              </h1>
              <p className="font-body-md text-on-surface-variant max-w-xl leading-relaxed">
                {t.profDesc}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-container-lowest text-primary font-label-sm font-bold shadow-xs border border-outline-variant/30">
              <span className="material-symbols-outlined text-[18px]">
                verified_user
              </span>
              <span>{t.profProtocol}</span>
            </div>
          </div>

          {/* Metric KPI Summary Cards (3 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-md font-bold text-on-surface-variant">
                  {t.metricNew}
                </span>
                <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
              </div>
              <span className="text-4xl font-extrabold text-primary tracking-tight mt-3">
                05
              </span>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-md font-bold text-on-surface-variant">
                  {t.metricReview}
                </span>
                <span className="w-3 h-3 rounded-full bg-secondary"></span>
              </div>
              <span className="text-4xl font-extrabold text-secondary tracking-tight mt-3">
                03
              </span>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-md font-bold text-on-surface-variant">
                  {t.metricResolved}
                </span>
                <span className="w-3 h-3 rounded-full bg-tertiary"></span>
              </div>
              <span className="text-4xl font-extrabold text-tertiary tracking-tight mt-3">
                28
              </span>
            </div>
          </div>

          {/* Filter Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/30 shadow-xs">
            {[
              { id: 'all' as const, label: t.tabAll, dot: null },
              {
                id: 'nueva' as const,
                label: t.tabNew,
                dot: 'bg-primary',
              },
              {
                id: 'revision' as const,
                label: t.tabReview,
                dot: 'bg-secondary',
              },
              {
                id: 'atendida' as const,
                label: t.tabResolved,
                dot: 'bg-tertiary',
              },
            ].map((tab) => {
              const active = counselorFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCounselorFilter(tab.id)}
                  className={`flex items-center gap-2 h-10 px-4 rounded-xl font-label-md font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {tab.dot ? (
                    <span className={`w-2 h-2 rounded-full ${tab.dot}`}></span>
                  ) : (
                    <span className="material-symbols-outlined text-[17px]">
                      tune
                    </span>
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Request Cards (2-Column Desktop Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {requests
              .filter(
                (r) =>
                  counselorFilter === 'all' || r.status === counselorFilter
              )
              .map((req) => (
                <div
                  key={req.id}
                  className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {req.status === 'nueva' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            Nueva
                          </span>
                        )}
                        {req.status === 'revision' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            En revisión
                          </span>
                        )}
                        {req.status === 'atendida' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm font-bold">
                            <span className="material-symbols-outlined text-[14px] text-tertiary">
                              check_circle
                            </span>
                            Atendida
                          </span>
                        )}
                        <span className="font-mono font-bold text-sm text-primary">
                          {req.id}
                        </span>
                      </div>
                      <span className="font-label-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">
                          schedule
                        </span>
                        {req.time}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary">
                          badge
                        </span>
                        <span className="font-title-md font-bold text-on-surface">
                          Estudiante {req.id} • {req.grade}
                        </span>
                      </div>
                      <h4 className="font-body-md font-semibold text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                          {req.topicIcon}
                        </span>
                        <span>{req.topic}</span>
                      </h4>
                      <p className="font-body-sm text-on-surface-variant bg-surface-container-low p-3.5 rounded-2xl leading-relaxed mt-2">
                        {req.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-outline-variant/20">
                    <button
                      type="button"
                      onClick={() =>
                        onShowToast(`Abriendo expediente ${req.id}...`)
                      }
                      className="h-11 rounded-2xl bg-primary text-on-primary font-label-md font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:bg-primary/90 transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        visibility
                      </span>
                      <span>
                        {req.status === 'atendida'
                          ? t.viewDossierBtn
                          : t.viewReqBtn}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCycleStatus(req.id)}
                      className="h-11 rounded-2xl bg-surface-container-low hover:bg-surface-container text-secondary font-label-md font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-outline-variant/30 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        cached
                      </span>
                      <span>{t.updateStatusBtn}</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
