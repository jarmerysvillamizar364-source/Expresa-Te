import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Play,
  Heart,
  Video,
  Activity,
  PhoneCall,
  ArrowRight,
  Lightbulb,
  Compass,
  User,
  PlusCircle,
  Lock,
  Building2,
  Calendar,
} from 'lucide-react';
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
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px]" />
      </div>

      {/* 1. HERO SECTION: Modern Dark Mode Split Presentation */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900/80 dark:bg-slate-900/80 border border-slate-800/90 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column (8 cols): Title, mood check-in & quick actions */}
          <div className="lg:col-span-8 flex flex-col items-start space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {isLoggedIn
                    ? isEs
                      ? `BIENVENIDO(A), ${userName.toUpperCase()}`
                      : `WELCOME, ${userName.toUpperCase()}`
                    : 'PORTAL INSTITUCIONAL'}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Confidencial</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {isEs ? (
                <>
                  Tu Espacio Seguro para{' '}
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                    Aprender, Cuidarte y Expresarte
                  </span>
                </>
              ) : (
                <>
                  Your Safe Space to{' '}
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                    Learn, Heal & Express Yourself
                  </span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-300/90 max-w-xl leading-relaxed">
              {t.heroDesc}
            </p>

            {/* Daily Mood Check-In Widget */}
            <div className="w-full pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
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
                      className={`flex items-center gap-2 h-10 px-3.5 rounded-xl transition-all cursor-pointer text-xs sm:text-sm font-semibold active:scale-[0.98] border whitespace-nowrap ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 border-transparent shadow-md shadow-cyan-500/20 font-bold'
                          : 'bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-800/60 border-slate-800'
                      }`}
                    >
                      <span className="text-base">{m.emoji}</span>
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {selectedMoodObj && (
                <div className="mt-3 p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-xs sm:text-sm text-slate-200 flex items-start gap-2.5 animate-fade-in shadow-inner">
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
                className="h-11 px-5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                <Video className="w-4 h-4" />
                <span>{isEs ? 'Explorar Audiovisuales' : 'Audiovisual Hub'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('autocuidado')}
                className="h-11 px-5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-emerald-300 font-bold text-xs sm:text-sm border border-slate-700 hover:border-emerald-500/40 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                <Heart className="w-4 h-4 text-emerald-400" />
                <span>{isEs ? 'Centro de Autocuidado' : 'Self-Care Center'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('orientacion')}
                className="h-11 px-5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-cyan-300 font-bold text-xs sm:text-sm border border-slate-700 hover:border-cyan-500/40 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                <HeartHandshake className="w-4 h-4 text-cyan-400" />
                <span>{t.requestGuidance}</span>
              </button>
            </div>
          </div>

          {/* Right Column (4 cols): Emblem Card & 24/7 Helpline Assurance */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-3xl blur-md opacity-60" />
              <div className="relative bg-slate-950/80 rounded-3xl p-6 border border-slate-800/90 backdrop-blur-xl flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 p-2 flex items-center justify-center shadow-inner mb-3">
                  <img
                    alt="Expresa Te Logo"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                    src={ASSETS.bannerLogo || '/assets/aistudio/image_6440f15d.png'}
                  />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Expresa Te
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {isEs
                    ? 'Tu bienestar emocional y convivencia escolar son protegidos con estricto sigilo profesional.'
                    : 'Your emotional wellbeing and peaceful coexistence are protected with ethical confidence.'}
                </p>
              </div>
            </div>

            {/* Quick 24/7 Crisis Hotline Card */}
            <div className="bg-slate-950/80 rounded-2xl p-4 border border-rose-500/25 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white">
                    {isEs ? 'Línea 106 de Apoyo 24/7' : '24/7 Line 106 Support'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isEs ? 'Atención psicológica gratuita' : 'Free immediate mental care'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  onShowToast(
                    isEs
                      ? 'Línea 106 disponible las 24 horas marcando gratis desde celular'
                      : 'Line 106 toll-free 24/7'
                  )
                }
                className="h-8 px-3 rounded-lg bg-rose-500 text-white font-bold text-xs active:scale-[0.98] transition-transform cursor-pointer shrink-0 shadow-sm shadow-rose-500/20"
              >
                106
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PWA Install Banner */}
      <PWAInstallButton lang={lang} variant="banner" />

      {/* 2. THE 4 DISTINCT PLATFORM SECTIONS */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Compass className="w-4 h-4" />
            <span>{isEs ? 'Estructura de la Plataforma' : 'Platform Sections'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {isEs ? 'Todo en su Lugar: Cuatro Espacios Especializados' : 'Everything in Its Place: Four Core Spaces'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Section 1: Educación Emocional & Audiovisuales */}
          <article
            onClick={() => onNavigate('recursos')}
            className="group bg-slate-900/80 hover:bg-slate-900 rounded-3xl p-6 border border-slate-800/90 hover:border-cyan-500/40 shadow-xl backdrop-blur-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-0.5">
                  {isEs ? 'Apartado 1' : 'Section 1'}
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {isEs ? 'Educación & Audiovisuales' : 'Education & Audiovisual'}
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isEs
                  ? 'Masterclasses animadas (Técnica STOP, Manejo de Exámenes), audioguías de relajación e infografías descargables.'
                  : 'Animated masterclasses (STOP Method, Exam Focus), guided audio podcasts, and clear emotional infographics.'}
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-cyan-400 text-xs font-bold">
              <span>{isEs ? 'Ver biblioteca' : 'Open library'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </article>

          {/* Section 2: Centro de Autocuidado */}
          <article
            onClick={() => onNavigate('autocuidado')}
            className="group bg-slate-900/80 hover:bg-slate-900 rounded-3xl p-6 border border-slate-800/90 hover:border-emerald-500/40 shadow-xl backdrop-blur-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
                  {isEs ? 'Apartado 2' : 'Section 2'}
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {isEs ? 'Autocuidado Activo' : 'Active Self-Care'}
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isEs
                  ? 'Herramientas interactivas en vivo: Respirador rítmico (4-7-8 y Caja), anclaje sensorial 5-4-3-2-1 y temporizador Pomodoro 25/5.'
                  : 'Live hands-on tools: Paced breathing orb (4-7-8 & Box), 5-4-3-2-1 grounding checklist, and Pomodoro study timer.'}
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-emerald-400 text-xs font-bold">
              <span>{isEs ? 'Abrir herramientas' : 'Open tools'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </article>

          {/* Section 3: Orientación y Psicología */}
          <article
            onClick={() => onNavigate('orientacion')}
            className="group bg-slate-900/80 hover:bg-slate-900 rounded-3xl p-6 border border-slate-800/90 hover:border-cyan-500/40 shadow-xl backdrop-blur-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-0.5">
                  {isEs ? 'Apartado 3' : 'Section 3'}
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {isEs ? 'Orientación y Psicología' : 'Guidance & Psychology'}
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isEs
                  ? 'Agenda consultas y citas confidenciales con el gabinete escolar. Haz seguimiento privado de tus respuestas.'
                  : 'Book confidential appointments with certified school psychologists and track your private replies.'}
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-cyan-400 text-xs font-bold">
              <span>{isEs ? 'Pedir consulta' : 'Request support'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </article>

          {/* Section 4: Mi Perfil y Privacidad */}
          <article
            onClick={() => onNavigate('perfil')}
            className="group bg-slate-900/80 hover:bg-slate-900 rounded-3xl p-6 border border-slate-800/90 hover:border-slate-700 shadow-xl backdrop-blur-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  {isEs ? 'Apartado 4' : 'Section 4'}
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {isEs ? 'Mi Perfil & Ajustes' : 'My Profile & Privacy'}
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isEs
                  ? 'Administra tu sesión institucional, tema claro/oscuro, preferencias de privacidad y marco ético Ley 1581 / 1090.'
                  : 'Manage your institutional session, dark/light display preferences, confidentiality settings, and ethical policies.'}
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-slate-300 text-xs font-bold">
              <span>{isEs ? 'Gestionar perfil' : 'Manage profile'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </article>
        </div>
      </section>

      {/* 3. Daily Reflection Card */}
      <section className="p-6 sm:p-8 bg-slate-900/80 border border-slate-800/90 rounded-3xl backdrop-blur-xl flex items-center gap-4 sm:gap-6 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0 shadow-xs">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            {isEs ? 'Recordatorio y Reflexión del Día' : 'Daily Wellbeing Reflection'}
          </span>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
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
// STUDENT DASHBOARD: PERSONAL TRACKING VIEW
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
      <section className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-slate-800/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Compass className="w-4 h-4" />
            <span>{isEs ? 'Espacio Personal del Estudiante' : 'Student Personal Space'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isEs ? `Mi Panel: ${userName || 'Estudiante'}` : `My Dashboard: ${userName || 'Student'}`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isEs
              ? 'Consulta el estado de tus consultas confidenciales con el orientador y accede directamente a las herramientas de apoyo.'
              : 'Review your private counseling requests and jump directly to specialized wellbeing tools.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('orientacion')}
          className="h-11 px-5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isEs ? 'Nueva Consulta' : 'New Request'}</span>
        </button>
      </section>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl backdrop-blur-xl space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {isEs ? 'Consultas Enviadas' : 'Requests Sent'}
          </span>
          <div className="text-3xl font-bold font-mono text-white mt-1">
            {requests.length}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl backdrop-blur-xl space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {isEs ? 'En Acompañamiento' : 'Active Follow-up'}
          </span>
          <div className="text-3xl font-bold font-mono text-cyan-400 mt-1">
            {requests.filter((r) => r.status === 'revision' || r.status === 'agendada').length}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl backdrop-blur-xl space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {isEs ? 'Privacidad' : 'Privacy Status'}
          </span>
          <div className="text-sm font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
            <Lock className="w-4 h-4" />
            <span>{isEs ? '100% Protegido' : '100% Protected'}</span>
          </div>
        </div>
      </div>

      {/* Direct Shortcuts */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-xl backdrop-blur-xl space-y-4">
        <h3 className="text-lg font-bold text-white">
          {isEs ? 'Accesos Directos a los Apartados Especializados' : 'Shortcuts to Dedicated Sections'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => onNavigate('recursos')}
            className="p-4 rounded-2xl bg-slate-950/60 hover:bg-slate-950/90 border border-slate-800/80 hover:border-cyan-500/30 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 group"
          >
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs sm:text-sm">
              <Video className="w-4 h-4" />
              <span>{isEs ? 'Audiovisuales & Videos' : 'Audiovisual & Videos'}</span>
            </div>
            <p className="text-xs text-slate-400">
              {isEs ? 'Masterclasses STOP y exámenes' : 'STOP & exam masterclasses'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('autocuidado')}
            className="p-4 rounded-2xl bg-slate-950/60 hover:bg-slate-950/90 border border-slate-800/80 hover:border-emerald-500/30 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 group"
          >
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
              <Heart className="w-4 h-4" />
              <span>{isEs ? 'Autocuidado en Vivo' : 'Live Self-Care'}</span>
            </div>
            <p className="text-xs text-slate-400">
              {isEs ? 'Respirador 4-7-8, anclaje y Pomodoro' : '4-7-8 breathing & Pomodoro'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('orientacion')}
            className="p-4 rounded-2xl bg-slate-950/60 hover:bg-slate-950/90 border border-slate-800/80 hover:border-cyan-500/30 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 group"
          >
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs sm:text-sm">
              <HeartHandshake className="w-4 h-4" />
              <span>{isEs ? 'Citas y Consultas' : 'Appointments & Queries'}</span>
            </div>
            <p className="text-xs text-slate-400">
              {isEs ? 'Bandeja de seguimiento privado' : 'Private follow-up inbox'}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
