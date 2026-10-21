import React, { useState } from 'react';
import { ASSETS, Language, translations } from '../data/translations';
import { PWAInstallButton } from './PWAInstallButton';
import { orientationService } from '../services/orientationService';

interface HomeProps {
  lang: Language;
  onNavigate: (screen: string) => void;
  isLoggedIn: boolean;
  userName: string;
  onShowToast: (msg: string) => void;
}

export const WelcomeScreen: React.FC<HomeProps> = ({
  lang,
  onNavigate,
  isLoggedIn,
  userName,
  onShowToast,
}) => {
  const t = translations[lang].welcome;
  const isEs = lang === 'es';
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    {
      id: 'calma',
      emoji: '🌱',
      label: isEs ? 'En calma' : 'Calm',
      feedback: isEs
        ? '¡Qué alegría! Mantén esa serenidad durante tu jornada escolar.'
        : 'Wonderful! Maintain that serenity throughout your day.',
    },
    {
      id: 'inquieto',
      emoji: '🌊',
      label: isEs ? 'Pensativo / Inquieto' : 'Thoughtful',
      feedback: isEs
        ? 'Es natural sentir dudas. Tómate las cosas paso a paso con amabilidad.'
        : 'It is natural to feel reflective. Take things step by step.',
    },
    {
      id: 'abrumado',
      emoji: '🌧️',
      label: isEs ? 'Abrumado' : 'Overwhelmed',
      feedback: isEs
        ? 'No estás solo. Haz una pausa en Autocuidado o solicita apoyo con Orientación.'
        : 'You are not alone. Take a pause in Self-Care or reach out to Guidance.',
    },
    {
      id: 'motivado',
      emoji: '✨',
      label: isEs ? 'Motivado' : 'Motivated',
      feedback: isEs
        ? '¡Excelente energía! Canalízala en tus metas cuidando tus descansos.'
        : 'Great energy! Channel it towards your goals with healthy balance.',
    },
  ];

  const selectedMoodObj = moods.find((m) => m.id === selectedMood);

  return (
    <div className="flex flex-col w-full space-y-10 sm:space-y-12 animate-fade-in text-left">
      {/* 1. HERO SECTION: Clean, balanced two-column presentation */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-highest p-6 sm:p-10 lg:p-12 shadow-sm border border-outline-variant/30">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-secondary-fixed/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column (8 cols): Title, mood check-in & quick actions */}
          <div className="lg:col-span-8 flex flex-col items-start space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-primary">
              <span className="tracking-wide uppercase">
                {isLoggedIn ? (isEs ? `Bienvenido(a), ${userName}` : `Welcome, ${userName}`) : t.communitySub}
              </span>
              <span className="text-outline-variant" aria-hidden="true">·</span>
              <span className="text-tertiary flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-[15px]">verified_user</span>
                <span>{t.safeBadge}</span>
              </span>
            </div>

            <h1 className="font-headline-xl font-bold text-on-surface tracking-tight leading-tight">
              {t.heroTitle}
            </h1>

            <p className="font-body-lg text-on-surface-variant max-w-xl leading-relaxed">
              {t.heroDesc}
            </p>

            {/* Daily Mood Check-In Widget */}
            <div className="w-full pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                {isEs ? 'Check-in emocional de hoy:' : 'Today emotional check-in:'}
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {moods.map((m) => {
                  const isSelected = selectedMood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedMood(m.id);
                        onShowToast(`${m.emoji} ${m.label}: ${m.feedback}`);
                      }}
                      className={`flex items-center gap-2 h-10 px-3.5 rounded-xl transition-all cursor-pointer font-label-md active:scale-[0.98] border whitespace-nowrap ${
                        isSelected
                          ? 'bg-primary text-on-primary border-primary shadow-xs font-bold'
                          : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low border-outline-variant/30 shadow-2xs'
                      }`}
                    >
                      <span className="text-base">{m.emoji}</span>
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {selectedMoodObj && (
                <div className="mt-3 p-3.5 rounded-2xl bg-surface-container-lowest border border-primary/20 text-xs sm:text-sm text-on-surface flex items-start gap-2.5 animate-fade-in shadow-2xs">
                  <span className="text-lg shrink-0">{selectedMoodObj.emoji}</span>
                  <span className="leading-relaxed">{selectedMoodObj.feedback}</span>
                </div>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="w-full flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('recursos')}
                className="h-11 px-5 rounded-xl bg-primary text-on-primary font-label-md font-bold shadow-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[19px]">smart_display</span>
                <span>{isEs ? 'Explorar Audiovisuales' : 'Audiovisual Hub'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('autocuidado')}
                className="h-11 px-5 rounded-xl bg-surface-container-lowest text-tertiary font-label-md font-bold border border-outline-variant/40 hover:bg-tertiary-fixed/30 flex items-center justify-center gap-2 shadow-2xs active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[19px]">spa</span>
                <span>{isEs ? 'Centro de Autocuidado' : 'Self-Care Center'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('orientacion')}
                className="h-11 px-5 rounded-xl bg-surface-container-low text-secondary font-label-md font-bold hover:bg-surface-container border border-outline-variant/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[19px]">support_agent</span>
                <span>{t.requestGuidance}</span>
              </button>
            </div>
          </div>

          {/* Right Column (4 cols): Emblem Card & 24/7 Helpline Assurance */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/30 flex flex-col items-center text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-xs p-2 flex items-center justify-center border border-outline-variant/20 mb-3">
                <img
                  alt="Expresa Te Logo"
                  className="w-full h-full object-contain"
                  src={ASSETS.loginEmblem}
                />
              </div>
              <h3 className="font-title-md font-bold text-on-surface">
                Expresa Te
              </h3>
              <p className="font-body-sm text-on-surface-variant mt-1 leading-relaxed">
                {isEs
                  ? 'Tu bienestar emocional y convivencia escolar son protegidos con estricto sigilo profesional.'
                  : 'Your emotional wellbeing and peaceful coexistence are protected with ethical confidence.'}
              </p>
            </div>

            {/* Quick 24/7 Crisis Hotline Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-error-container/40 text-error flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md font-bold text-on-surface">
                    {isEs ? 'Línea 106 de Apoyo 24/7' : '24/7 Line 106 Support'}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {isEs ? 'Atención psicológica gratuita' : 'Free immediate mental care'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onShowToast(isEs ? 'Línea 106 disponible las 24 horas marcando gratis desde celular' : 'Line 106 toll-free 24/7')}
                className="h-9 px-3.5 rounded-xl bg-error text-on-error font-label-sm font-bold active:scale-[0.98] transition-transform cursor-pointer shrink-0"
              >
                106
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PWA Install Banner */}
      <PWAInstallButton lang={lang} variant="banner" />

      {/* 2. THE 4 DISTINCT PLATFORM SECTIONS (ZERO DUPLICATION) */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <span className="material-symbols-outlined text-[16px]">apps</span>
            <span>{isEs ? 'Estructura de la Plataforma' : 'Platform Sections'}</span>
          </div>
          <h2 className="font-headline-md font-bold text-on-surface tracking-tight">
            {isEs ? 'Todo en su Lugar: Cuatro Espacios Especializados' : 'Everything in Its Place: Four Core Spaces'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Section 1: Educación Emocional & Audiovisuales */}
          <article
            onClick={() => onNavigate('recursos')}
            className="group bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-2xs hover:shadow-md hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-fixed/40 text-primary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[26px]">smart_display</span>
              </div>
              <div>
                <span className="text-xs font-bold text-primary block mb-0.5">
                  {isEs ? 'Apartado 1' : 'Section 1'}
                </span>
                <h3 className="font-title-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  {isEs ? 'Educación & Audiovisuales' : 'Education & Audiovisual'}
                </h3>
              </div>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                {isEs
                  ? 'Masterclasses animadas (Técnica STOP, Manejo de Exámenes), audioguías de relajación e infografías descargables.'
                  : 'Animated masterclasses (STOP Method, Exam Focus), guided audio podcasts, and clear emotional infographics.'}
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-outline-variant/15 flex items-center justify-between text-primary font-label-md font-bold">
              <span>{isEs ? 'Ver biblioteca' : 'Open library'}</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </article>

          {/* Section 2: Centro de Autocuidado */}
          <article
            onClick={() => onNavigate('autocuidado')}
            className="group bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-2xs hover:shadow-md hover:border-tertiary/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed text-tertiary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[26px]">spa</span>
              </div>
              <div>
                <span className="text-xs font-bold text-tertiary block mb-0.5">
                  {isEs ? 'Apartado 2' : 'Section 2'}
                </span>
                <h3 className="font-title-lg font-bold text-on-surface group-hover:text-tertiary transition-colors">
                  {isEs ? 'Autocuidado Activo' : 'Active Self-Care'}
                </h3>
              </div>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                {isEs
                  ? 'Herramientas interactivas en vivo: Respirador rítmico (4-7-8 y Caja), anclaje sensorial 5-4-3-2-1 y temporizador Pomodoro 25/5.'
                  : 'Live hands-on tools: Paced breathing orb (4-7-8 & Box), 5-4-3-2-1 grounding checklist, and Pomodoro study timer.'}
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-outline-variant/15 flex items-center justify-between text-tertiary font-label-md font-bold">
              <span>{isEs ? 'Abrir herramientas' : 'Open tools'}</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </article>

          {/* Section 3: Orientación y Psicología */}
          <article
            onClick={() => onNavigate('orientacion')}
            className="group bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-2xs hover:shadow-md hover:border-secondary/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[26px]">support_agent</span>
              </div>
              <div>
                <span className="text-xs font-bold text-secondary block mb-0.5">
                  {isEs ? 'Apartado 3' : 'Section 3'}
                </span>
                <h3 className="font-title-lg font-bold text-on-surface group-hover:text-secondary transition-colors">
                  {isEs ? 'Orientación y Psicología' : 'Guidance & Psychology'}
                </h3>
              </div>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                {isEs
                  ? 'Agenda consultas y citas confidenciales con el gabinete escolar. Haz seguimiento privado de tus respuestas.'
                  : 'Book confidential appointments with certified school psychologists and track your private replies.'}
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-outline-variant/15 flex items-center justify-between text-secondary font-label-md font-bold">
              <span>{isEs ? 'Pedir consulta' : 'Request support'}</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </article>

          {/* Section 4: Mi Perfil y Privacidad */}
          <article
            onClick={() => onNavigate('perfil')}
            className="group bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-2xs hover:shadow-md hover:border-outline transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-surface-container-high text-on-surface flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[26px]">badge</span>
              </div>
              <div>
                <span className="text-xs font-bold text-on-surface-variant block mb-0.5">
                  {isEs ? 'Apartado 4' : 'Section 4'}
                </span>
                <h3 className="font-title-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  {isEs ? 'Mi Perfil & Ajustes' : 'My Profile & Privacy'}
                </h3>
              </div>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                {isEs
                  ? 'Administra tu sesión institucional, tema claro/oscuro, preferencias de privacidad y marco ético Ley 1581 / 1090.'
                  : 'Manage your institutional session, dark/light display preferences, confidentiality settings, and ethical policies.'}
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-outline-variant/15 flex items-center justify-between text-on-surface font-label-md font-bold">
              <span>{isEs ? 'Gestionar perfil' : 'Manage profile'}</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </article>
        </div>
      </section>

      {/* 3. Daily Affirmation & Reflection Card */}
      <section className="p-6 sm:p-8 bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-high rounded-3xl border border-outline-variant/30 flex items-center gap-4 sm:gap-6 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[28px]">lightbulb</span>
        </div>
        <div className="flex flex-col">
          <span className="font-title-sm font-bold text-primary">
            {isEs ? 'Recordatorio y Reflexión del Día' : 'Daily Wellbeing Reflection'}
          </span>
          <p className="font-body-md text-on-surface-variant mt-0.5 leading-relaxed">
            {isEs
              ? '"Aprender a hacer una pausa a tiempo no es perder el ritmo; es cuidar la mente para llegar más lejos con serenidad."'
              : '"Learning to pause is not falling behind; it is caring for your mind so you can go further with peace."'}
          </p>
        </div>
      </section>
    </div>
  );
};

// ============================================================================
// STUDENT DASHBOARD: PERSONAL TRACKING VIEW (NON-REDUNDANT)
// ============================================================================
export const StudentDashboardScreen: React.FC<HomeProps> = ({
  lang,
  onNavigate,
  userName,
  onShowToast,
}) => {
  const isEs = lang === 'es';
  const requests = orientationService.getRequests('estudiante');

  return (
    <div className="flex flex-col w-full space-y-8 pb-12 animate-fade-in text-left">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-highest p-6 sm:p-8 border border-outline-variant/30 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span>{isEs ? 'Espacio Personal del Estudiante' : 'Student Personal Space'}</span>
          </div>
          <h1 className="font-headline-lg font-bold text-on-surface tracking-tight">
            {isEs ? `Mi Panel: ${userName || 'Estudiante'}` : `My Dashboard: ${userName || 'Student'}`}
          </h1>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            {isEs
              ? 'Consulta el estado de tus consultas confidenciales con el orientador y accede directamente a las herramientas de apoyo.'
              : 'Review your private counseling requests and jump directly to specialized wellbeing tools.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('orientacion')}
          className="h-11 px-5 rounded-xl bg-primary text-on-primary font-label-md font-bold shadow-xs hover:opacity-95 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[19px]">add_comment</span>
          <span>{isEs ? 'Nueva Consulta' : 'New Request'}</span>
        </button>
      </section>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            {isEs ? 'Consultas Enviadas' : 'Requests Sent'}
          </span>
          <div className="text-3xl font-bold font-mono text-on-surface mt-1">
            {requests.length}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            {isEs ? 'En Acompañamiento' : 'Active Follow-up'}
          </span>
          <div className="text-3xl font-bold font-mono text-primary mt-1">
            {requests.filter((r) => r.status === 'revision' || r.status === 'agendada').length}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            {isEs ? 'Privacidad' : 'Privacy Status'}
          </span>
          <div className="text-sm font-bold text-tertiary mt-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span>{isEs ? '100% Protegido' : '100% Protected'}</span>
          </div>
        </div>
      </div>

      {/* Direct Shortcuts to Distinct Sections */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xs space-y-4">
        <h3 className="font-title-md font-bold text-on-surface">
          {isEs ? 'Accesos Directos a los Apartados Especializados' : 'Shortcuts to Dedicated Sections'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => onNavigate('recursos')}
            className="p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 text-left transition-all cursor-pointer flex flex-col justify-between gap-2"
          >
            <div className="flex items-center gap-2 text-primary font-bold">
              <span className="material-symbols-outlined text-[20px]">smart_display</span>
              <span>{isEs ? 'Audiovisuales & Videos' : 'Audiovisual & Videos'}</span>
            </div>
            <p className="text-xs text-on-surface-variant">
              {isEs ? 'Masterclasses STOP y exámenes' : 'STOP & exam masterclasses'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('autocuidado')}
            className="p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 text-left transition-all cursor-pointer flex flex-col justify-between gap-2"
          >
            <div className="flex items-center gap-2 text-tertiary font-bold">
              <span className="material-symbols-outlined text-[20px]">spa</span>
              <span>{isEs ? 'Autocuidado en Vivo' : 'Live Self-Care'}</span>
            </div>
            <p className="text-xs text-on-surface-variant">
              {isEs ? 'Respirador 4-7-8, anclaje y Pomodoro' : '4-7-8 breathing & Pomodoro'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('orientacion')}
            className="p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 text-left transition-all cursor-pointer flex flex-col justify-between gap-2"
          >
            <div className="flex items-center gap-2 text-secondary font-bold">
              <span className="material-symbols-outlined text-[20px]">forum</span>
              <span>{isEs ? 'Citas y Consultas' : 'Appointments & Queries'}</span>
            </div>
            <p className="text-xs text-on-surface-variant">
              {isEs ? 'Bandeja de seguimiento privado' : 'Private follow-up inbox'}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
