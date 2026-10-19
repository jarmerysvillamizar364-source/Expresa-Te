import React, { useState } from 'react';
import { ASSETS, Language, translations } from '../data/translations';

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
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingTimer, setBreathingTimer] = useState(4);

  // Breathing interval effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathingTimer((prev) => (prev > 1 ? prev - 1 : 4));
      }, 1000);
    } else {
      setBreathingTimer(4);
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  return (
    <div className="flex flex-col w-full space-y-12 sm:space-y-16">
      {/* 1. HERO SECTION: Two-column desktop responsive web banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-highest p-6 sm:p-10 lg:p-14 shadow-sm border border-outline-variant/30">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-secondary-fixed/25 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (7 cols): Inspiring title, mood selector, and primary actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-5">
            {/* Top Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-xs border border-outline-variant/30">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-sm font-bold text-primary tracking-wide uppercase">
                {t.communitySub}
              </span>
              <span className="text-outline-variant">•</span>
              <span className="font-label-sm text-tertiary font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  verified
                </span>
                {t.safeBadge}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
              {t.heroTitle}
            </h1>

            {/* Supportive Subtitle */}
            <p className="text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
              {t.heroDesc}
            </p>

            {/* Interactive Mood Selector with Instant Empathetic Reassurance */}
            <div className="w-full pt-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2.5">
                {lang === 'es' ? '¿Cómo te sientes en este instante?' : 'How are you feeling right now?'}
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                {[
                  {
                    id: 'calma',
                    emoji: '🌱',
                    label: t.moodCalm,
                    feedback: lang === 'es' ? '¡Qué alegría! Mantén esa serenidad durante tu jornada.' : 'Great to hear! Enjoy this serenity today.',
                  },
                  {
                    id: 'inquieto',
                    emoji: '🌊',
                    label: t.moodThoughtful,
                    feedback: lang === 'es' ? 'Es válido reflexionar. Respira hondo y tómate las cosas con calma.' : 'Reflection is healthy. Take deep breaths.',
                  },
                  {
                    id: 'abrumado',
                    emoji: '🌧️',
                    label: t.moodOverwhelmed,
                    feedback: lang === 'es' ? 'No estás solo. Haz una pausa y cuenta con nuestro equipo de orientación.' : 'You are not alone. Take a break; we are here for you.',
                  },
                ].map((m) => {
                  const isSelected = selectedMood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedMood(m.id);
                        onShowToast(`${m.emoji} ${m.label}: ${m.feedback}`);
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer font-label-md active:scale-95 border ${
                        isSelected
                          ? 'bg-primary text-on-primary border-primary shadow-md font-bold'
                          : 'bg-surface-container-lowest/80 text-on-surface hover:bg-surface-container-lowest border-outline-variant/30 shadow-xs'
                      }`}
                    >
                      <span className="text-lg">{m.emoji}</span>
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('recursos')}
                className="h-12 px-6 rounded-2xl bg-gradient-to-r from-primary-container to-primary text-on-primary font-label-lg font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  auto_stories
                </span>
                <span>{t.exploreResources}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('orientacion')}
                className="h-12 px-6 rounded-2xl bg-surface-container-lowest text-secondary font-label-lg font-bold border border-outline-variant/30 hover:bg-secondary-fixed/40 flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  support_agent
                </span>
                <span>{t.requestGuidance}</span>
              </button>

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => onNavigate('panel-estudiante')}
                  className="h-12 px-5 rounded-2xl bg-tertiary-fixed/40 text-tertiary font-label-md font-bold flex items-center justify-center gap-1.5 hover:bg-tertiary-fixed/70 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    dashboard
                  </span>
                  <span>{lang === 'es' ? 'Mi Panel' : 'My Dashboard'}</span>
                </button>
              ) : null}
            </div>
          </div>

          {/* Right Column (5 cols): Visual Showcase Card with Breathing Coach */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 shadow-lg border border-outline-variant/30 flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-xs p-1 mb-4 border border-outline-variant/20">
                <img
                  alt="Expresa Te Logo"
                  className="w-full h-full object-contain"
                  src={ASSETS.loginEmblem}
                />
              </div>

              <span className="font-headline-sm font-bold text-on-surface">
                {t.pauseTitle}
              </span>
              <p className="font-body-sm text-on-surface-variant max-w-xs mt-1 mb-5">
                {isBreathing ? t.pauseActive : t.pauseDesc}
              </p>

              {/* Animated breathing circle */}
              <div className="relative w-28 h-28 flex items-center justify-center mb-5">
                <div
                  className={`absolute inset-0 rounded-full bg-primary/20 transition-all duration-1000 ${
                    isBreathing ? 'scale-125 opacity-70' : 'scale-90 opacity-40'
                  }`}
                ></div>
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-primary-container text-on-primary flex flex-col items-center justify-center shadow-md transition-transform duration-1000 ${
                    isBreathing ? 'scale-110' : 'scale-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[28px]">
                    {isBreathing ? 'air' : 'self_improvement'}
                  </span>
                  {isBreathing && (
                    <span className="text-xs font-bold mt-0.5">{breathingTimer}s</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = !isBreathing;
                  setIsBreathing(next);
                  onShowToast(next ? t.pauseActive : 'Pausa finalizada. ¡Excelente trabajo!');
                }}
                className={`w-full py-3 px-5 rounded-xl font-label-md font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isBreathing
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low hover:bg-surface-container text-primary border border-outline-variant/30'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isBreathing ? 'pause_circle' : 'play_circle'}
                </span>
                <span>{isBreathing ? (lang === 'es' ? 'Pausar respiración' : 'Pause breathing') : (lang === 'es' ? 'Iniciar 1 min de pausa' : 'Start 1 min pause')}</span>
              </button>
            </div>

            {/* Quick Helpline Assurance Card */}
            <div className="bg-surface-container-lowest/80 backdrop-blur-sm rounded-2xl p-4 border border-outline-variant/30 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-error-container/40 text-error flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">
                    phone_in_talk
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md font-bold text-on-surface">
                    {lang === 'es' ? 'Asistencia Inmediata 24/7' : 'Immediate 24/7 Support'}
                  </span>
                  <span className="font-body-sm text-on-surface-variant">
                    {lang === 'es' ? 'Línea 106 Secretaría de Salud' : 'Line 106 Emotional Care'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('orientacion')}
                className="px-3.5 py-1.5 rounded-xl bg-secondary text-on-secondary font-label-sm font-bold hover:bg-secondary/90 transition-all cursor-pointer shrink-0"
              >
                {lang === 'es' ? 'Ver líneas' : 'View lines'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST & ASSURANCE PILLARS: 4-column responsive web grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: 'lock',
            title: lang === 'es' ? '100% Confidencial' : '100% Confidential',
            desc: lang === 'es' ? 'Tus consultas, check-ins y solicitudes permanecen estrictamente protegidas.' : 'Your queries, check-ins, and requests are strictly protected.',
            color: 'text-primary',
            bg: 'bg-primary-fixed/30',
          },
          {
            icon: 'psychology',
            title: lang === 'es' ? 'Orientación Escolar' : 'School Guidance',
            desc: lang === 'es' ? 'Acompañamiento por profesionales certificados de tu institución educativa.' : 'Support provided by certified educational psychologists.',
            color: 'text-secondary',
            bg: 'bg-secondary-fixed',
          },
          {
            icon: 'spa',
            title: lang === 'es' ? 'Recursos Prácticos' : 'Practical Tools',
            desc: lang === 'es' ? 'Técnicas de respiración, manejo de estrés y convivencia a tu propio ritmo.' : 'Breathing techniques, stress management, and peaceful coexistence.',
            color: 'text-tertiary',
            bg: 'bg-tertiary-fixed',
          },
          {
            icon: 'support_agent',
            title: lang === 'es' ? 'Canal Amigable' : 'Friendly Space',
            desc: lang === 'es' ? 'Elige si deseas atención presencial, virtual o seguimiento reservado.' : 'Choose in-person, digital, or quiet confidential follow-up.',
            color: 'text-on-surface',
            bg: 'bg-surface-container-high',
          },
        ].map((pillar, idx) => (
          <div
            key={idx}
            className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-xs flex flex-col gap-2.5 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl ${pillar.bg} ${pillar.color} flex items-center justify-center shrink-0`}>
              <span className="material-symbols-outlined text-[22px]">
                {pillar.icon}
              </span>
            </div>
            <h3 className="font-title-md font-bold text-on-surface">
              {pillar.title}
            </h3>
            <p className="font-body-sm text-on-surface-variant leading-relaxed">
              {pillar.desc}
            </p>
          </div>
        ))}
      </section>

      {/* 3. RECURSOS PARA TU BIENESTAR: 3-column responsive web grid */}
      <section className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/30 text-primary font-label-sm font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[15px]">
                local_library
              </span>
              <span>{t.findResourcesTitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              {t.findResourcesSub}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('recursos')}
            className="self-start sm:self-auto inline-flex items-center gap-1 font-label-md font-bold text-primary hover:underline cursor-pointer"
          >
            <span>{lang === 'es' ? 'Ver toda la biblioteca' : 'View all library'}</span>
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <article
            onClick={() => onNavigate('recursos')}
            className="group bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">
                    air
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm font-bold">
                  {t.card1Tag}
                </span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                {t.card1Title}
              </h3>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                {t.card1Desc}
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-outline-variant/20 flex items-center justify-between text-primary font-label-md font-bold">
              <span>{t.card1Action}</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </article>

          {/* Card 2 */}
          <article
            onClick={() => onNavigate('recursos')}
            className="group bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-sm hover:shadow-lg hover:border-secondary/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">
                    balance
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm font-bold">
                  {t.card2Tag}
                </span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
                {t.card2Title}
              </h3>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                {t.card2Desc}
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-outline-variant/20 flex items-center justify-between text-secondary font-label-md font-bold">
              <span>{t.card2Action}</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </article>

          {/* Card 3 */}
          <article
            onClick={() => onNavigate('recursos')}
            className="group bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-sm hover:shadow-lg hover:border-tertiary/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">
                    diversity_1
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm font-bold">
                  {t.card3Tag}
                </span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface group-hover:text-tertiary transition-colors">
                {t.card3Title}
              </h3>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                {t.card3Desc}
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-outline-variant/20 flex items-center justify-between text-tertiary font-label-md font-bold">
              <span>{t.card3Action}</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </article>
        </div>
      </section>

      {/* 4. TWO-COLUMN INTERACTIVE CALLOUTS: Guidance Request & Self-Care Space */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Callout 1: Guidance */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high p-8 sm:p-10 border border-outline-variant/30 flex flex-col justify-between shadow-sm">
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-primary-fixed/20 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs">
              <span className="material-symbols-outlined text-[26px]">
                forum
              </span>
            </div>
            <h3 className="text-2xl font-bold text-on-surface tracking-tight">
              {t.talkTitle}
            </h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              {t.talkDesc}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-on-surface font-label-sm font-semibold">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  verified_user
                </span>
                <span>{t.anonBadge}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface font-label-sm font-semibold">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  schedule
                </span>
                <span>{t.warmReply}</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={() => onNavigate('orientacion')}
              className="w-full h-12 rounded-2xl bg-primary text-on-primary font-label-lg font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                chat_bubble
              </span>
              <span>{t.requestGuidance}</span>
            </button>
          </div>
        </div>

        {/* Callout 2: Self-Care & Grounding Suite */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high p-8 sm:p-10 border border-outline-variant/30 flex flex-col justify-between shadow-sm">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-tertiary-fixed/20 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-tertiary shadow-xs">
              <span className="material-symbols-outlined text-[26px]">spa</span>
            </div>
            <h3 className="text-2xl font-bold text-on-surface tracking-tight">
              {lang === 'es' ? 'Herramientas de Autocuidado y Calma' : 'Self-Care & Calming Tools'}
            </h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              {lang === 'es'
                ? 'Practica técnicas de atención plena, anclaje sensorial 5-4-3-2-1 y temporizadores de estudio diseñados para tu día a día.'
                : 'Practice mindfulness techniques, 5-4-3-2-1 grounding exercises, and study focus timers designed for your daily routine.'}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-on-surface font-label-sm font-semibold">
                <span className="material-symbols-outlined text-tertiary text-[20px]">
                  air
                </span>
                <span>{lang === 'es' ? 'Respiración 4-7-8' : '4-7-8 Breathing'}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface font-label-sm font-semibold">
                <span className="material-symbols-outlined text-tertiary text-[20px]">
                  timer
                </span>
                <span>{lang === 'es' ? 'Foco y Pomodoro' : 'Focus & Study'}</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={() => onNavigate('autocuidado')}
              className="w-full h-12 rounded-2xl bg-tertiary text-on-tertiary font-label-lg font-bold flex items-center justify-center gap-2 shadow-md shadow-tertiary/20 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                self_improvement
              </span>
              <span>{lang === 'es' ? 'Abrir Centro de Autocuidado' : 'Open Self-Care Center'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export const StudentDashboardScreen: React.FC<HomeProps> = ({
  lang,
  onNavigate,
  isLoggedIn,
  userName,
  onShowToast,
}) => {
  const t = translations[lang].studentHome;
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const moods = [
    {
      id: 'Tranquilo',
      label: t.mood1,
      icon: 'self_improvement',
      color: 'text-primary',
      bg: 'bg-primary-fixed/40',
      advice: t.advice1,
    },
    {
      id: 'Ansioso',
      label: t.mood2,
      icon: 'air',
      color: 'text-secondary',
      bg: 'bg-secondary-fixed',
      advice: t.advice2,
    },
    {
      id: 'Motivado',
      label: t.mood3,
      icon: 'bolt',
      color: 'text-tertiary',
      bg: 'bg-tertiary-fixed',
      advice: t.advice3,
    },
    {
      id: 'Agobiado',
      label: t.mood4,
      icon: 'wb_cloudy',
      color: 'text-error',
      bg: 'bg-error-container/40',
      advice: t.advice4,
    },
  ];

  const activeMoodObj = moods.find((m) => m.id === selectedMood);

  return (
    <div className="flex flex-col w-full space-y-10 pb-8">
      {/* 1. Header Banner with Student Info & Privacy Badge */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-highest p-6 sm:p-8 lg:p-10 border border-outline-variant/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest text-primary shadow-xs">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-sm font-bold uppercase tracking-wider">{t.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight">
            {t.greetingPrefix} <span className="text-primary">{userName ? `${userName}` : 'Expresa Te'}</span>
          </h1>
          <p className="text-base text-on-surface-variant leading-relaxed">
            {t.greetingDesc}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2.5 shrink-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/30 font-label-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">
              verified_user
            </span>
            <span>{t.privacyTitle}</span>
          </div>
          <span className="text-xs text-on-surface-variant max-w-xs text-left md:text-right">
            {t.privacySub}
          </span>
        </div>
      </section>

      {/* 2. Emotional Check-in Widget & Advice Banner */}
      <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">
                sentiment_satisfied
              </span>
            </div>
            <h2 className="text-xl font-bold text-on-surface">{t.checkinTitle}</h2>
          </div>
          {savedFeedback && (
            <span className="font-label-sm font-bold text-tertiary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>{t.checkinSaved}</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {moods.map((m) => {
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setSelectedMood(m.id);
                  setSavedFeedback(true);
                  setTimeout(() => setSavedFeedback(false), 3000);
                  onShowToast(`${m.label}: ${m.advice}`);
                }}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl transition-all cursor-pointer active:scale-95 border ${
                  isSelected
                    ? 'bg-primary-fixed/30 border-primary shadow-md font-bold'
                    : 'bg-surface-container-low/70 hover:bg-surface-container border-outline-variant/20 text-on-surface'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${m.bg} flex items-center justify-center mb-2.5 ${m.color} shadow-xs`}
                >
                  <span className="material-symbols-outlined text-[26px]">
                    {m.icon}
                  </span>
                </div>
                <span className="font-title-md font-bold">{m.label}</span>
              </button>
            );
          })}
        </div>

        {activeMoodObj && (
          <div className="p-4 rounded-2xl bg-surface-container-low text-on-surface font-body-md flex items-center gap-3 border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[22px] shrink-0">
              favorite
            </span>
            <span className="leading-relaxed">{activeMoodObj.advice}</span>
          </div>
        )}
      </section>

      {/* 3. Quick Action 3-Column Desktop Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-on-surface">{t.exploreTitle}</h2>
          <span className="font-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
            {t.quickActions}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Action 1 */}
          <button
            type="button"
            onClick={() => onNavigate('recursos')}
            className="group flex flex-col justify-between p-6 bg-surface-container-lowest hover:bg-surface-container-low rounded-3xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all active:scale-[0.99] text-left cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-fixed/40 text-primary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[26px]">
                  local_library
                </span>
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                  {t.resTitle}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm font-bold">
                  {t.resTag}
                </span>
              </div>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                {t.resDesc}
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-outline-variant/20 flex items-center justify-between text-primary font-label-md font-bold">
              <span>{lang === 'es' ? 'Explorar biblioteca' : 'Explore library'}</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </button>

          {/* Action 2 */}
          <button
            type="button"
            onClick={() => onNavigate('autocuidado')}
            className="group flex flex-col justify-between p-6 bg-surface-container-lowest hover:bg-surface-container-low rounded-3xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all active:scale-[0.99] text-left cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed text-tertiary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[26px]">spa</span>
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm font-bold text-on-surface group-hover:text-tertiary transition-colors">
                  {t.selfTitle}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm font-bold">
                  {t.selfTag}
                </span>
              </div>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                {t.selfDesc}
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-outline-variant/20 flex items-center justify-between text-tertiary font-label-md font-bold">
              <span>{lang === 'es' ? 'Iniciar pausas' : 'Start pauses'}</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </button>

          {/* Action 3 */}
          <button
            type="button"
            onClick={() => onNavigate('orientacion')}
            className="group flex flex-col justify-between p-6 bg-surface-container-lowest hover:bg-surface-container-low rounded-3xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all active:scale-[0.99] text-left cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[26px]">
                  forum
                </span>
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
                  {t.oriTitle}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm font-bold">
                  {t.oriTag}
                </span>
              </div>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                {t.oriDesc}
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-outline-variant/20 flex items-center justify-between text-secondary font-label-md font-bold">
              <span>{lang === 'es' ? 'Pedir acompañamiento' : 'Request guidance'}</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* 4. Recommended for You (3-Column Desktop Grid) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              auto_awesome
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface">{t.recTitle}</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('recursos')}
            className="font-label-md font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{t.seeAll}</span>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            onClick={() => onNavigate('autocuidado')}
            className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/30 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-full h-44 rounded-2xl overflow-hidden relative bg-surface-container mb-4">
                <img
                  alt={t.rec1Title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={ASSETS.recBreathing}
                />
                <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-xl bg-on-surface/80 backdrop-blur-md text-white font-label-sm font-bold">
                  3 min
                </span>
              </div>
              <span className="font-label-sm text-primary font-bold uppercase tracking-wider">
                {t.rec1Cat}
              </span>
              <h3 className="font-title-lg font-bold text-on-surface mt-1 leading-snug">
                {t.rec1Title}
              </h3>
            </div>
            <div className="flex items-center justify-between pt-4 mt-3 border-t border-outline-variant/20 text-on-surface-variant font-body-sm">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-tertiary">
                  pace
                </span>
                <span>{t.rec1Meta}</span>
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onShowToast(lang === 'es' ? 'Guardado en tus favoritos' : 'Saved to favorites');
                }}
                className="material-symbols-outlined text-primary text-[22px] hover:scale-110 transition-transform"
              >
                bookmark_border
              </span>
            </div>
          </article>

          <article
            onClick={() => onNavigate('recursos')}
            className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/30 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-full h-44 rounded-2xl overflow-hidden relative bg-surface-container mb-4">
                <img
                  alt={t.rec2Title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={ASSETS.recStudy}
                />
                <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-xl bg-on-surface/80 backdrop-blur-md text-white font-label-sm font-bold">
                  5 min
                </span>
              </div>
              <span className="font-label-sm text-secondary font-bold uppercase tracking-wider">
                {t.rec2Cat}
              </span>
              <h3 className="font-title-lg font-bold text-on-surface mt-1 leading-snug">
                {t.rec2Title}
              </h3>
            </div>
            <div className="flex items-center justify-between pt-4 mt-3 border-t border-outline-variant/20 text-on-surface-variant font-body-sm">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  menu_book
                </span>
                <span>{t.rec2Meta}</span>
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onShowToast(lang === 'es' ? 'Guardado en tus favoritos' : 'Saved to favorites');
                }}
                className="material-symbols-outlined text-secondary text-[22px] hover:scale-110 transition-transform"
              >
                bookmark_border
              </span>
            </div>
          </article>

          <article
            onClick={() => onNavigate('orientacion')}
            className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/30 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-full h-44 rounded-2xl overflow-hidden relative bg-surface-container mb-4">
                <img
                  alt={t.rec3Title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={ASSETS.recSupport}
                />
                <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-xl bg-on-surface/80 backdrop-blur-md text-white font-label-sm font-bold">
                  {t.guideBadge}
                </span>
              </div>
              <span className="font-label-sm text-tertiary font-bold uppercase tracking-wider">
                {t.rec3Cat}
              </span>
              <h3 className="font-title-lg font-bold text-on-surface mt-1 leading-snug">
                {t.rec3Title}
              </h3>
            </div>
            <div className="flex items-center justify-between pt-4 mt-3 border-t border-outline-variant/20 text-on-surface-variant font-body-sm">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-tertiary">
                  record_voice_over
                </span>
                <span>{t.rec3Meta}</span>
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onShowToast(lang === 'es' ? 'Guardado en tus favoritos' : 'Saved to favorites');
                }}
                className="material-symbols-outlined text-tertiary text-[22px] hover:scale-110 transition-transform"
              >
                bookmark_border
              </span>
            </div>
          </article>
        </div>
      </section>

      {/* 5. Daily Positive Affirmation & Focus Card */}
      <section className="p-6 sm:p-8 bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-high rounded-3xl border border-outline-variant/30 flex items-center gap-4 sm:gap-6 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[28px]">
            emoji_objects
          </span>
        </div>
        <div className="flex flex-col">
          <p className="font-title-md font-bold text-primary">
            {t.dailyReminderTitle}
          </p>
          <p className="font-body-md text-on-surface-variant mt-0.5 leading-relaxed">
            "{t.dailyReminderQuote}"
          </p>
        </div>
      </section>
    </div>
  );
};
