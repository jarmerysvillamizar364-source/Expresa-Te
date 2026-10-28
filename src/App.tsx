import React, { useEffect, useState } from 'react';
import {
  AccountDeletionReceiptScreen,
  LoginScreen,
  ProfileScreen,
} from './components/AuthAndProfileScreens';
import {
  StudentDashboardScreen,
  WelcomeScreen,
} from './components/HomeScreens';
import { StudentOrientationView } from './components/StudentOrientationView';
import { AdminDashboardView } from './components/AdminDashboardView';
import {
  ResourcesScreen,
  SelfCareScreen,
} from './components/ResourcesAndSelfCare';
import { ASSETS, Language, translations } from './data/translations';
import { authService } from './services/authService';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AudiovisualModal } from './components/AudiovisualModal';
import { AudiovisualsView } from './components/AudiovisualsView';
import { EmergencyHelplineModal } from './components/EmergencyHelplineModal';
import { UserProfileDropdown } from './components/UserProfileDropdown';
import { PhoneCall, Sun, Moon, Globe, Film } from 'lucide-react';

export type ActiveScreen =
  | 'inicio'
  | 'panel-estudiante'
  | 'recursos'
  | 'autocuidado'
  | 'orientacion'
  | 'solicitud-enviada'
  | 'panel-orientador'
  | 'login'
  | 'perfil'
  | 'comprobante-eliminar'
  | 'audiovisuales';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('expresa_te_lang');
      if (stored === 'en' || stored === 'es') return stored;
    }
    return 'es';
  });
  // Initial state: Persisted theme from localStorage (defaults to false / Light Mode)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('expresa_te_theme') === 'dark';
    }
    return false;
  });
  // Default first interface is strictly 'login' until authenticated
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('login');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [accountDeleted, setAccountDeleted] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<'estudiante' | 'orientador' | 'psicologo' | 'administrativo'>('estudiante');
  const [userPerfil, setUserPerfil] = useState<string>('Estudiante');
  const [userDocumento, setUserDocumento] = useState<string>('');
  const [userSede, setUserSede] = useState<string>('Sede Principal');
  const [userGrade, setUserGrade] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAudiovisualModal, setShowAudiovisualModal] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [selectedModalVideoId, setSelectedModalVideoId] = useState<string | undefined>(undefined);

  const handleOpenAudiovisualModal = (videoId?: string) => {
    setSelectedModalVideoId(videoId);
    setShowAudiovisualModal(true);
  };

  const isStaff = userRole === 'orientador' || userRole === 'psicologo' || userRole === 'administrativo';

  // Restore active authorized session on mount if one exists
  useEffect(() => {
    const session = authService.getSession();
    if (session && session.userEmail) {
      setIsLoggedIn(true);
      setUserEmail(session.userEmail);
      setUserName(session.userName || session.userEmail.split('@')[0]);
      const role = (session.role as any) || 'estudiante';
      setUserRole(role);
      setUserPerfil(
        session.perfil ||
          (role === 'psicologo'
            ? 'Psicología'
            : role === 'orientador'
            ? 'Orientación Escolar'
            : 'Estudiante')
      );
      setUserDocumento(session.documento || '');
      setUserSede(session.sede || 'Sede Principal');
      setUserGrade(
        role === 'psicologo'
          ? 'Departamento de Psicología'
          : role === 'orientador'
          ? 'Equipo de Orientación'
          : session.grade || 'Estudiante'
      );
      setIsVerified(Boolean(session.isVerified));
      setActiveScreen(role === 'estudiante' ? 'inicio' : 'panel-orientador');
    } else {
      setIsLoggedIn(false);
      setUserEmail('');
      setUserName('');
      setUserRole('estudiante');
      setUserPerfil('Estudiante');
      setUserDocumento('');
      setUserSede('Sede Principal');
      setUserGrade('');
      setIsVerified(false);
      setActiveScreen('login');
    }
  }, []);

  // Theme effect: cleanly add or remove 'dark' on <html> and <body> and persist
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (darkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('expresa_te_theme', darkMode ? 'dark' : 'light');
    }
  }, [darkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserName('');
    setUserEmail('');
    setUserGrade('');
    setUserDocumento('');
    setUserSede('Sede Principal');
    setIsVerified(false);
    setMenuOpen(false);
    showToast(
      lang === 'es'
        ? 'Sesión cerrada correctamente'
        : 'Logged out successfully'
    );
    setActiveScreen('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleLanguage = () => {
    const nextLang: Language = lang === 'es' ? 'en' : 'es';
    setLang(nextLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('expresa_te_lang', nextLang);
    }
    showToast(
      nextLang === 'es'
        ? 'Idioma cambiado a Español'
        : 'Language switched to English'
    );
  };

  const handleNavigate = (screen: string) => {
    // If not logged in, allow access to 'login', 'comprobante-eliminar', and 'audiovisuales' (institutional wellness media hub)
    if (!isLoggedIn && screen !== 'login' && screen !== 'comprobante-eliminar' && screen !== 'audiovisuales') {
      setActiveScreen('login');
      setMenuOpen(false);
      showToast(
        lang === 'es'
          ? 'Debes iniciar sesión para acceder al contenido de la plataforma'
          : 'Please sign in to access platform content'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Role-based interface boundary guards:
    // 1. General User (Student) cannot access counselor / psychology management panel
    if (!isStaff && screen === 'panel-orientador') {
      showToast(
        lang === 'es'
          ? 'Acceso denegado: Esta área está reservada exclusivamente para orientación y psicología.'
          : 'Restricted area: Access is exclusive to school counselors and psychologists.'
      );
      setActiveScreen('inicio');
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. Staff user redirected from student-only forms to staff triage workspace
    if (isStaff && (screen === 'orientacion' || screen === 'panel-estudiante')) {
      setActiveScreen('panel-orientador');
      setMenuOpen(false);
      showToast(
        lang === 'es'
          ? 'Como directivo/orientador, tu espacio de trabajo es el panel de Gestión de Casos.'
          : 'As staff, your workspace is Case Management.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveScreen(screen as ActiveScreen);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tHeader = translations[lang].header;
  const tNav = translations[lang].nav;
  const tSwitch = translations[lang].screenSwitcher;
  const tFooter = translations[lang].footer;

  const isNavActive = (key: string) => {
    if (key === 'inicio') {
      return activeScreen === 'inicio';
    }
    if (key === 'panel-estudiante') {
      return activeScreen === 'panel-estudiante';
    }
    if (key === 'recursos' || key === 'audiovisuales') {
      return activeScreen === 'recursos' || activeScreen === 'audiovisuales';
    }
    if (key === 'autocuidado') {
      return activeScreen === 'autocuidado';
    }
    if (key === 'orientacion') {
      return (
        activeScreen === 'orientacion' ||
        activeScreen === 'solicitud-enviada'
      );
    }
    if (key === 'panel-orientador') {
      return activeScreen === 'panel-orientador';
    }
    if (key === 'perfil') {
      return (
        activeScreen === 'perfil' ||
        activeScreen === 'comprobante-eliminar'
      );
    }
    return activeScreen === key;
  };

  const navItems = isStaff
    ? [
        {
          id: 'panel-orientador',
          label: lang === 'es' ? 'Gestión de Casos' : 'Case Management',
          shortLabel: lang === 'es' ? 'Casos' : 'Cases',
          icon: 'dashboard_customize',
        },
        {
          id: 'audiovisuales',
          label: lang === 'es' ? 'Audiovisuales' : 'Media Hub',
          shortLabel: lang === 'es' ? 'Recursos' : 'Media',
          icon: 'smart_display',
        },
        {
          id: 'autocuidado',
          label: lang === 'es' ? 'Pausa Profesional' : 'Staff Self-Care',
          shortLabel: lang === 'es' ? 'Pausa' : 'Care',
          icon: 'spa',
        },
      ]
    : [
        {
          id: 'inicio',
          label: tNav.inicio,
          shortLabel: tNav.inicio,
          icon: 'home',
        },
        {
          id: 'panel-estudiante',
          label: lang === 'es' ? 'Mi Espacio' : 'My Space',
          shortLabel: lang === 'es' ? 'Espacio' : 'Space',
          icon: 'dashboard',
        },
        {
          id: 'audiovisuales',
          label: lang === 'es' ? 'Audiovisuales' : 'Media Hub',
          shortLabel: lang === 'es' ? 'Recursos' : 'Media',
          icon: 'smart_display',
        },
        {
          id: 'autocuidado',
          label: tNav.autocuidado,
          shortLabel: lang === 'es' ? 'Cuidado' : 'Care',
          icon: 'spa',
        },
        {
          id: 'orientacion',
          label: tNav.orientacion,
          shortLabel: lang === 'es' ? 'Orientación' : 'Support',
          icon: 'support_agent',
        },
      ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-body-md min-h-screen flex flex-col antialiased selection:bg-cyan-500/20 selection:text-cyan-900 dark:selection:text-cyan-200 transition-colors duration-200">
      {/* Top Web Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-xs dark:shadow-[0_4px_24px_-4px_rgba(6,182,212,0.12)] border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-200">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto h-16 sm:h-18 px-2.5 sm:px-4 lg:px-6 flex items-center justify-between gap-1.5 sm:gap-2.5 lg:gap-3">
          {/* Brand Zone: Project Name "Expresa Te" with its respective logo */}
          <button
            type="button"
            onClick={() => handleNavigate(!isLoggedIn ? 'login' : isStaff ? 'panel-orientador' : 'inicio')}
            className="flex items-center gap-2 sm:gap-2.5 text-left cursor-pointer shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl min-w-0"
            title="Expresa Te"
          >
            <span className="text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent tracking-tight leading-none group-hover:opacity-90 transition-opacity">
              Expresa Te
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 p-1 rounded-xl bg-white dark:bg-slate-900 shadow-2xs border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <img
                alt="Expresa Te Logo"
                className="w-full h-full object-contain"
                src="/assets/aistudio/expresa_te_logo_square.png"
                loading="eager"
              />
            </div>
          </button>

          {/* Center Navigation Zone: Shown on lg+ ONLY after user logs in */}
          {isLoggedIn ? (
            /* Desktop Web Navigation Links (Rendered ONLY after user logs in) */
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 min-w-0" aria-label="Navegación principal">
              {navItems.map((item) => {
                const active = isNavActive(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    className={`flex items-center gap-1 xl:gap-1.5 h-8.5 xl:h-9.5 px-2 xl:px-3 rounded-xl text-xs xl:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-[0.98] shrink-0 ${
                      active
                        ? 'bg-primary-fixed/40 text-primary shadow-2xs font-bold'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[17px] xl:text-[18px]">
                      {item.icon}
                    </span>
                    <span className="hidden xl:inline">{item.label}</span>
                    <span className="xl:hidden text-xs">{item.shortLabel || item.label}</span>
                  </button>
                );
              })}
            </nav>
          ) : null}

          {/* Controls Zone: Línea 106 (destacado en rojo/rosa) + Tema (Claro/Oscuro) + Idioma (ES / EN) */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">
            {/* Botón de ayuda/emergencia: "Línea 106" destacado en tono rojo/rosa suave */}
            <button
              type="button"
              onClick={() => setShowEmergencyModal(true)}
              title={lang === 'es' ? 'Línea 106 de Crisis y Ayuda Inmediata' : 'Line 106 Crisis & Immediate Support'}
              className="inline-flex items-center gap-1 sm:gap-1.5 h-8.5 sm:h-9 md:h-10 px-2 sm:px-2.5 md:px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-500 dark:text-rose-400 border border-rose-500/30 text-xs font-bold transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0 shadow-[0_0_12px_rgba(244,63,94,0.15)] group min-w-[36px]"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">{lang === 'es' ? 'Línea 106' : 'Line 106'}</span>
              <span className="sm:hidden font-mono">106</span>
            </button>

            {/* Botón de acceso directo: "Audiovisuales" */}
            <button
              type="button"
              onClick={() => handleNavigate('audiovisuales')}
              title={lang === 'es' ? 'Abrir Centro de Videos y Audiovisuales' : 'Open Audiovisual Media Hub'}
              className="inline-flex items-center gap-1 sm:gap-1.5 h-8.5 sm:h-9 md:h-10 px-2 sm:px-2.5 md:px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-teal-800 dark:text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.15)] group min-w-[36px]"
            >
              <Film className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">{lang === 'es' ? 'Audiovisuales' : 'Media Hub'}</span>
              <span className="sm:hidden hidden min-[360px]:inline text-xs">{lang === 'es' ? 'Videos' : 'Media'}</span>
            </button>

            {/* In-App PWA Install Trigger (Header variant shown on 2xl+ screens) */}
            <div className="hidden 2xl:inline-flex">
              <PWAInstallButton lang={lang} variant="header" />
            </div>

            {/* Botón para cambiar de tema (Claro/Oscuro) */}
            <button
              type="button"
              onClick={() => {
                const nextMode = !darkMode;
                setDarkMode(nextMode);
                showToast(
                  lang === 'es'
                    ? nextMode
                      ? 'Modo Oscuro activado'
                      : 'Modo Claro activado'
                    : nextMode
                    ? 'Dark Mode enabled'
                    : 'Light Mode enabled'
                );
              }}
              title={
                darkMode
                  ? lang === 'es'
                    ? 'Cambiar a Modo Claro'
                    : 'Switch to Light Mode'
                  : lang === 'es'
                  ? 'Cambiar a Modo Oscuro'
                  : 'Switch to Dark Mode'
              }
              aria-label={
                darkMode
                  ? lang === 'es'
                    ? 'Cambiar a Modo Claro'
                    : 'Switch to Light Mode'
                  : lang === 'es'
                  ? 'Cambiar a Modo Oscuro'
                  : 'Switch to Dark Mode'
              }
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 border border-slate-300 dark:border-slate-700/80 hover:border-cyan-500/40 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center shrink-0 shadow-xs"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* Selector de idioma (ES / EN) */}
            <button
              type="button"
              onClick={handleToggleLanguage}
              title={lang === 'es' ? 'Cambiar a inglés (Switch to English)' : 'Cambiar a español (Switch to Spanish)'}
              aria-label={lang === 'es' ? 'Cambiar idioma a inglés' : 'Switch language to Spanish'}
              className="h-8.5 sm:h-9 md:h-10 px-2 sm:px-2.5 md:px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700/60 hover:border-cyan-500/40 transition-all active:scale-95 cursor-pointer flex items-center gap-1 sm:gap-1.5 shrink-0 font-bold text-xs group shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-teal-700 dark:text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span className="uppercase font-extrabold text-teal-800 dark:text-cyan-300">
                {lang.toUpperCase()}
              </span>
            </button>

            {/* User Profile Dropdown Menu (Shown ONLY when logged in) */}
            {isLoggedIn && (
              <UserProfileDropdown
                lang={lang}
                userName={userName}
                userEmail={userEmail}
                userRole={userRole}
                userPerfil={userPerfil}
                userGrade={userGrade}
                userSede={userSede}
                isVerified={isVerified}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
                onChangeLang={setLang}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
                onShowToast={showToast}
                onOpenEmergencyModal={() => setShowEmergencyModal(true)}
                activeScreen={activeScreen}
              />
            )}

            {/* Hamburger button for mobile / tablet drawer */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menú de navegación"
              className="lg:hidden w-8.5 h-8.5 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/30 transition-colors active:scale-95 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu (Visible on < lg, covering phones and portrait tablets) */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex justify-end lg:hidden animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-72 sm:w-80 max-w-[85vw] h-full bg-surface-container-lowest p-5 sm:p-6 shadow-2xl border-l border-outline-variant/30 flex flex-col justify-between overflow-y-auto pb-safe"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
                <div className="flex items-center gap-2.5">
                  <img
                    alt="Expresa Te Logo"
                    className="w-9 h-9 object-contain rounded-xl bg-white p-1 border border-outline-variant/30"
                    src={ASSETS.loginEmblem}
                  />
                  <div className="flex flex-col">
                    <span className="font-title-md text-primary font-bold">
                      Expresa Te
                    </span>
                    <span className="font-label-sm text-tertiary">
                      Espacio Institucional
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    close
                  </span>
                </button>
              </div>

              {/* Status Info in Drawer */}
              {isLoggedIn ? (
                <>
                  <div className="bg-primary-fixed/20 p-3 rounded-xl border border-primary/20 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                      {userName ? userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-md font-bold text-on-surface truncate">
                        {userName}
                      </span>
                      <span className="font-label-sm text-primary font-semibold truncate">
                        {isStaff
                          ? `${userPerfil || 'Personal Oficial'} • Sede Principal`
                          : `${userGrade || 'Estudiante'} • Verificado`}
                      </span>
                    </div>
                  </div>

                  {/* Navigation list (Strictly role-separated) */}
                  <div className="flex flex-col gap-1 pt-2">
                    <span className="font-label-sm font-bold text-on-surface-variant uppercase tracking-wider px-3 mb-1">
                      {isStaff ? 'Panel Administrativo' : 'Navegación Estudiante'}
                    </span>
                    {(isStaff
                      ? [
                          {
                            id: 'panel-orientador',
                            label: lang === 'es' ? 'Gestión de Casos & Censo' : 'Case Management & Census',
                            icon: 'dashboard_customize',
                          },
                          {
                            id: 'audiovisuales',
                            label: lang === 'es' ? 'Centro de Audiovisuales' : 'Audiovisual Hub',
                            icon: 'smart_display',
                          },
                          {
                            id: 'autocuidado',
                            label: lang === 'es' ? 'Pausa Profesional' : 'Staff Self-Care',
                            icon: 'spa',
                          },
                          {
                            id: 'perfil',
                            label: lang === 'es' ? 'Mi Perfil Oficial' : 'Official Profile',
                            icon: 'badge',
                          },
                        ]
                      : [
                          { id: 'inicio', label: tSwitch.welcome, icon: 'home' },
                          { id: 'panel-estudiante', label: tSwitch.studentDashboard, icon: 'dashboard' },
                          { id: 'audiovisuales', label: lang === 'es' ? 'Audiovisuales & Videos' : 'Audiovisual Media', icon: 'smart_display' },
                          { id: 'recursos', label: tSwitch.resources, icon: 'local_library' },
                          { id: 'autocuidado', label: tSwitch.selfcare, icon: 'spa' },
                          { id: 'orientacion', label: tSwitch.requestForm, icon: 'chat_bubble' },
                          { id: 'perfil', label: tSwitch.profile, icon: 'person' },
                        ]
                    ).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-label-md text-left transition-colors cursor-pointer ${
                          activeScreen === item.id
                            ? 'bg-primary text-on-primary font-bold shadow-xs'
                            : 'text-on-surface hover:bg-surface-container-low'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-label-md text-left text-error hover:bg-error-container/30 transition-colors cursor-pointer mt-1"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        logout
                      </span>
                      <span className="font-semibold">{lang === 'es' ? 'Cerrar Sesión' : 'Sign Out'}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-2">
                  <span className="font-label-sm font-bold text-primary uppercase tracking-wider block">
                    Acceso Requerido
                  </span>
                  <p className="font-body-sm text-on-surface-variant">
                    {lang === 'es'
                      ? 'Inicia sesión con tu cuenta institucional para acceder a todos los contenidos, biblioteca de recursos y acompañamiento.'
                      : 'Please sign in with your institutional account to access platform content and guidance.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleNavigate('audiovisuales')}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-teal-800 dark:text-cyan-300 font-bold text-xs border border-cyan-500/30 cursor-pointer transition-all active:scale-98"
                  >
                    <Film className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>{lang === 'es' ? 'Explorar Centro Audiovisual' : 'Explore Audiovisual Media'}</span>
                  </button>
                </div>
              )}

              {/* Emergency Hotline in Drawer */}
              <div className="bg-error-container/30 border border-error/20 p-3 rounded-xl flex items-center justify-between gap-2 mt-2">
                <div className="flex items-center gap-2 text-error">
                  <span className="material-symbols-outlined text-[20px]">
                    emergency
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-sm font-bold">Línea 106</span>
                    <span className="text-[11px] text-on-surface-variant">Salud Emocional 24/7</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowEmergencyModal(true);
                  }}
                  className="px-2.5 py-1 bg-error text-on-error rounded-lg font-label-sm font-semibold cursor-pointer hover:bg-error/90 active:scale-95 transition-all"
                >
                  {lang === 'es' ? 'Ayuda' : 'Help'}
                </button>
              </div>
              {/* PWA Mobile Drawer Install Action */}
              <div className="pt-2">
                <PWAInstallButton lang={lang} variant="menu" />
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/20 flex flex-col gap-2">
              <div className="flex items-center justify-between text-on-surface-variant font-label-sm">
                <span>Modo de pantalla:</span>
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center gap-1 font-semibold text-primary cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {darkMode ? 'light_mode' : 'dark_mode'}
                  </span>
                  <span>{darkMode ? tHeader.lightMode : tHeader.darkMode}</span>
                </button>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant font-label-sm">
                <span>{lang === 'es' ? 'Idioma:' : 'Language:'}</span>
                <button
                  type="button"
                  onClick={handleToggleLanguage}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold cursor-pointer border border-outline-variant/30 text-xs transition-colors shadow-2xs active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">translate</span>
                  <span>{lang === 'es' ? 'ES (Cambiar a EN)' : 'EN (Switch to ES)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container: Centered vertically and horizontally before login, standard dashboard padding when logged in */}
      <main
        className={`w-full mx-auto px-3 sm:px-6 lg:px-8 flex flex-col min-w-0 transition-all ${
          !isLoggedIn && activeScreen === 'login'
            ? 'flex-1 min-h-[calc(100vh-4.5rem)] pt-20 pb-8 sm:pt-24 sm:pb-12 max-w-7xl 2xl:max-w-[1440px] items-center justify-center'
            : 'flex-1 max-w-7xl 2xl:max-w-[1440px] pt-20 sm:pt-26 lg:pt-28 pb-24 md:pb-16'
        }`}
      >
        {!isLoggedIn ? (
          /* FIRST INTERFACE BEFORE LOGIN: Only LoginScreen, Deletion Receipt or Audiovisuals Hub */
          activeScreen === 'comprobante-eliminar' ? (
            <AccountDeletionReceiptScreen
              lang={lang}
              deletedEmail={userEmail || 'usuario@colegio.edu.co'}
              deletedName={userName || 'Estudiante'}
              onNavigate={handleNavigate}
              onRestoreDemoAccount={() => {
                setAccountDeleted(false);
                setUserEmail('');
                setUserName('');
                setUserRole('estudiante');
                setUserPerfil('Estudiante');
                setUserDocumento('');
                setUserSede('Sede Principal');
                setUserGrade('');
                setActiveScreen('login');
              }}
              onShowToast={showToast}
            />
          ) : activeScreen === 'audiovisuales' ? (
            <AudiovisualsView
              lang={lang}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              userName={userName}
              onNavigate={handleNavigate}
              onShowToast={showToast}
            />
          ) : (
            <LoginScreen
              lang={lang}
              accountDeleted={accountDeleted}
              onLoginSuccess={(email, verified = true, name, grade, role, perfil) => {
                setIsLoggedIn(true);
                setUserEmail(email);
                setUserName(name || email.split('@')[0]);
                const userR = (role as any) || 'estudiante';
                setUserRole(userR);
                setUserPerfil(
                  perfil ||
                    (userR === 'psicologo'
                      ? 'Psicología'
                      : userR === 'orientador'
                      ? 'Orientación Escolar'
                      : 'Estudiante')
                );
                setUserGrade(
                  grade ||
                    (userR === 'psicologo'
                      ? 'Departamento de Psicología'
                      : userR === 'orientador'
                      ? 'Equipo de Orientación'
                      : 'Estudiante')
                );
                setIsVerified(verified);

                const session = authService.getSession();
                if (session) {
                  setUserDocumento(session.documento || '');
                  setUserSede(session.sede || 'Sede Principal');
                }

                // Immediately transition user to the appropriate platform interface
                const targetScreen = userR === 'estudiante' ? 'inicio' : 'panel-orientador';
                setActiveScreen(targetScreen);
                showToast(
                  lang === 'es'
                    ? `¡Bienvenido a Expresa Te, ${name || email.split('@')[0]}!`
                    : `Welcome to Expresa Te, ${name || email.split('@')[0]}!`
                );
              }}
              onNavigate={handleNavigate}
              onShowToast={showToast}
              onOpenAudiovisualModal={handleOpenAudiovisualModal}
              onOpenEmergencyModal={() => setShowEmergencyModal(true)}
            />
          )
        ) : (
          /* ALL PLATFORM CONTENT: Renders ONLY after user has authenticated and tailored to user role */
          <>
            {/* Staff Header Notification Banner when on staff mode */}
            {isStaff && (
              <div className="mb-6 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                    userPerfil === 'Psicología'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {userPerfil === 'Psicología' ? 'psychology' : 'diversity_3'}
                    </span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-label-md font-bold text-on-surface">
                      Espacio Administrativo Oficial: {userPerfil}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      Sesión activa para {userName} • Sede Principal (Ley 1090 / 1620)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleNavigate('panel-orientador')}
                    className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl font-label-sm font-bold cursor-pointer transition-all ${
                      activeScreen === 'panel-orientador'
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Gestión de Casos & Censo
                  </button>
                </div>
              </div>
            )}

            {/* Student Screens */}
            {activeScreen === 'inicio' && (
              <WelcomeScreen
                lang={lang}
                onNavigate={handleNavigate}
                isLoggedIn={isLoggedIn}
                userName={userName}
                onShowToast={showToast}
                onOpenAudiovisualModal={handleOpenAudiovisualModal}
                onOpenEmergencyModal={() => setShowEmergencyModal(true)}
              />
            )}

            {activeScreen === 'panel-estudiante' && !isStaff && (
              <StudentDashboardScreen
                lang={lang}
                onNavigate={handleNavigate}
                isLoggedIn={isLoggedIn}
                userName={userName}
                onShowToast={showToast}
                onOpenAudiovisualModal={handleOpenAudiovisualModal}
                onOpenEmergencyModal={() => setShowEmergencyModal(true)}
              />
            )}

            {activeScreen === 'audiovisuales' && (
              <AudiovisualsView
                lang={lang}
                isLoggedIn={isLoggedIn}
                userRole={userRole}
                userName={userName}
                onNavigate={handleNavigate}
                onShowToast={showToast}
              />
            )}

            {activeScreen === 'recursos' && (
              <ResourcesScreen
                lang={lang}
                onNavigate={handleNavigate}
                onShowToast={showToast}
              />
            )}

            {activeScreen === 'autocuidado' && (
              <SelfCareScreen
                lang={lang}
                onNavigate={handleNavigate}
                onShowToast={showToast}
              />
            )}

            {/* Student Orientation View (Confidential submission & private tracking) */}
            {(activeScreen === 'orientacion' || activeScreen === 'solicitud-enviada') && !isStaff && (
              <StudentOrientationView
                lang={lang}
                studentEmail={userEmail}
                studentName={userName}
                studentGrade={userGrade}
                onNavigate={handleNavigate}
                onShowToast={showToast}
              />
            )}

            {/* Administrative Staff Dashboard (Triage, Census, Protocols Ley 1620, Pause) */}
            {activeScreen === 'panel-orientador' && isStaff && (
              <AdminDashboardView
                lang={lang}
                adminName={userName}
                adminEmail={userEmail}
                adminRole={userRole}
                adminPerfil={userPerfil}
                adminGrade={userGrade}
                onNavigate={handleNavigate}
                onShowToast={showToast}
              />
            )}

            {activeScreen === 'perfil' && (
              <ProfileScreen
                lang={lang}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
                onToggleLanguage={handleToggleLanguage}
                isLoggedIn={isLoggedIn}
                userName={userName}
                userEmail={userEmail}
                userGrade={userGrade}
                userRole={userRole}
                userPerfil={userPerfil}
                userDocumento={userDocumento}
                userSede={userSede}
                isVerified={isVerified}
                onNavigate={handleNavigate}
                onUpdateProfile={(name, grade) => {
                  setUserName(name);
                  setUserGrade(grade);
                }}
                onLogout={handleLogout}
                onDeleteAccount={() => {
                  authService.logout();
                  setIsLoggedIn(false);
                  setAccountDeleted(true);
                  setUserName('');
                  setUserEmail('');
                  setUserGrade('');
                  setIsVerified(false);
                  showToast(
                    lang === 'es'
                      ? 'Cuenta eliminada. Comprobante generado.'
                      : 'Account deleted. Receipt generated.'
                  );
                  setActiveScreen('comprobante-eliminar');
                }}
                onShowToast={showToast}
              />
            )}

            {activeScreen === 'comprobante-eliminar' && (
              <AccountDeletionReceiptScreen
                lang={lang}
                deletedEmail={userEmail || 'usuario@colegio.edu.co'}
                deletedName={userName || 'Estudiante'}
                onNavigate={handleNavigate}
                onRestoreDemoAccount={() => {
                  setAccountDeleted(false);
                  setUserEmail('');
                  setUserName('');
                  setUserGrade('');
                  setActiveScreen('login');
                }}
                onShowToast={showToast}
              />
            )}
          </>
        )}
      </main>

      {/* Web Footer */}
      <footer className="w-full bg-slate-50 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800/80 pt-14 pb-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-200 dark:border-slate-800/80">
            {/* Col 1: Brand & Institutional Mission (4 cols on desktop) */}
            <div className="lg:col-span-4 flex flex-col items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-center">
                  <img
                    alt="Expresa Te Logo"
                    className="w-full h-full object-contain"
                    src={ASSETS.loginEmblem}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm font-bold text-teal-700 dark:text-cyan-400 tracking-tight leading-none">
                    Expresa Te
                  </span>
                  <span className="font-label-sm text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {tFooter.badgeSafe}
                  </span>
                </div>
              </div>

              <p className="font-body-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-sm">
                {tFooter.tagline}
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-teal-700 dark:text-cyan-300 font-label-sm border border-slate-200 dark:border-slate-800">
                <span className="material-symbols-outlined text-[16px] text-emerald-600 dark:text-emerald-400">
                  verified
                </span>
                <span>{tFooter.badgeSafe}</span>
              </div>
            </div>

            {/* Col 2: Navigation Links or Access info depending on auth status */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <span className="font-title-md font-bold text-slate-900 dark:text-white">
                {tFooter.colExploreTitle}
              </span>
              {isLoggedIn ? (
                <ul className="flex flex-col gap-2 font-body-sm text-slate-700 dark:text-slate-300">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('inicio')}
                      className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer text-left"
                    >
                      {tFooter.linkHome}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('panel-estudiante')}
                      className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer text-left"
                    >
                      {tFooter.linkDashboard}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('recursos')}
                      className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer text-left"
                    >
                      {tFooter.linkResources}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('autocuidado')}
                      className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer text-left"
                    >
                      {tFooter.linkSelfcare}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('perfil')}
                      className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer text-left"
                    >
                      {tFooter.linkProfile}
                    </button>
                  </li>
                </ul>
              ) : (
                <div className="space-y-2.5">
                  <p className="font-body-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {lang === 'es'
                      ? 'Inicia sesión con tu correo escolar para acceder a los recursos, panel y herramientas.'
                      : 'Sign in with your school email to access resources, dashboard, and tools.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleNavigate('login')}
                    className="inline-flex items-center gap-1.5 font-label-sm font-bold text-teal-700 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    <span>{lang === 'es' ? 'Ir al inicio de sesión' : 'Go to sign in'}</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>

            {/* Col 3: Crisis & 24/7 Hotlines (3 cols) */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <span className="font-title-md font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-rose-500 text-[18px]">
                  support_agent
                </span>
                <span>{tFooter.colHotlinesTitle}</span>
              </span>
              <ul className="flex flex-col gap-2 font-body-sm text-slate-700 dark:text-slate-300">
                <li
                  onClick={() => setShowEmergencyModal(true)}
                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500/50 cursor-pointer transition-colors group"
                >
                  <span className="font-semibold text-teal-700 dark:text-teal-400 group-hover:text-rose-500 transition-colors">{tFooter.line106Label}</span>
                  <span className="font-label-sm px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 group-hover:bg-rose-500 group-hover:text-white font-bold transition-colors">24/7</span>
                </li>
                <li
                  onClick={() => { window.location.href = 'tel:192'; }}
                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500/50 cursor-pointer transition-colors group"
                >
                  <span className="font-semibold text-cyan-700 dark:text-cyan-400 group-hover:text-cyan-500 transition-colors">{tFooter.line192Label}</span>
                  <span className="font-label-sm px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 group-hover:bg-cyan-500 group-hover:text-white font-bold transition-colors">Gratis</span>
                </li>
                <li
                  onClick={() => { window.location.href = 'tel:141'; }}
                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/50 cursor-pointer transition-colors group"
                >
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors">{tFooter.line141Label}</span>
                  <span className="font-label-sm px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 group-hover:bg-emerald-500 group-hover:text-white font-bold transition-colors">ICBF</span>
                </li>
                <li
                  onClick={() => { window.location.href = 'tel:123'; }}
                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500/50 cursor-pointer transition-colors group"
                >
                  <span className="font-semibold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">{tFooter.line123Label}</span>
                  <span className="font-label-sm px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white group-hover:bg-rose-500 group-hover:text-white font-bold transition-colors">Urgencias</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Legal & Ethics (2 cols) */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <span className="font-title-md font-bold text-slate-900 dark:text-white">
                {tFooter.colLegalTitle}
              </span>
              <p className="font-body-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {tFooter.legalDesc}
              </p>
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-label-sm">
                  <span className="material-symbols-outlined text-[15px]">verified_user</span>
                  <span>{lang === 'es' ? 'Ley 1581 y 1098' : 'Data Protection'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-slate-700 dark:text-slate-300 font-body-sm">
            <p>© {new Date().getFullYear()} {tFooter.rights}</p>
            <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-label-sm">
              <span className="text-teal-700 dark:text-teal-400 font-semibold">
                {lang === 'es' ? 'Bienestar y Convivencia Escolar' : 'School Guidance & Wellbeing'}
              </span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                {lang === 'es' ? 'Entorno Protegido' : 'Protected Space'}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Connectivity & Offline State Indicator */}
      <OfflineIndicator lang={lang} />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-2xl font-label-md shadow-2xl flex items-center gap-2.5 transition-all animate-bounce-short border border-inverse-on-surface/20">
          <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile-Only Bottom Navigation Bar (Rendered ONLY after logging in, tailored to role) */}
      {isLoggedIn && (
        <nav
          aria-label="Navegación móvil"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl shadow-[0_-8px_24px_rgba(0,0,0,0.06)] border-t border-outline-variant/20 pb-safe"
        >
          <div className="flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
            {(isStaff
              ? [
                  { id: 'panel-orientador', icon: 'assignment', label: lang === 'es' ? 'Casos' : 'Cases' },
                  { id: 'recursos', icon: 'local_library', label: tNav.recursos },
                  { id: 'autocuidado', icon: 'spa', label: lang === 'es' ? 'Pausa' : 'Pause' },
                  { id: 'perfil', icon: 'badge', label: tNav.perfil },
                ]
              : [
                  { id: 'inicio', icon: 'home', label: tNav.inicio },
                  { id: 'panel-estudiante', icon: 'dashboard', label: lang === 'es' ? 'Mi Espacio' : 'My Space' },
                  { id: 'recursos', icon: 'local_library', label: tNav.recursos },
                  { id: 'autocuidado', icon: 'spa', label: tNav.autocuidado },
                  { id: 'orientacion', icon: 'forum', label: tNav.orientacion },
                  { id: 'perfil', icon: 'person', label: tNav.perfil },
                ]
            ).map((tab) => {
              const active = isNavActive(tab.id);
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleNavigate(tab.id)}
                  className={`flex flex-col items-center justify-center flex-1 min-w-0 min-h-[48px] py-1 transition-all cursor-pointer rounded-xl select-none active:scale-95 ${
                    active
                      ? 'text-primary font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px] mb-0.5">
                    {tab.icon}
                  </span>
                  <span className="font-label-sm tracking-tight text-[11px] font-semibold truncate max-w-full px-0.5 leading-tight">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* Global Interactive Audiovisual Modal & Video Player */}
      <AudiovisualModal
        isOpen={showAudiovisualModal}
        onClose={() => setShowAudiovisualModal(false)}
        lang={lang}
        initialVideoId={selectedModalVideoId}
        onNavigateToFullLibrary={() => handleNavigate('audiovisuales')}
        onOpenGuidance={() => handleNavigate(isLoggedIn ? 'orientacion' : 'login')}
      />

      {/* Verified Official Línea 106 & Emergency Helpline Modal */}
      <EmergencyHelplineModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        lang={lang}
        onOpenGuidance={() => {
          setShowEmergencyModal(false);
          handleNavigate(isLoggedIn ? 'orientacion' : 'login');
        }}
      />
    </div>
  );
}
