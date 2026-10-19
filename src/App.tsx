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
import { OrientationScreens } from './components/OrientationScreens';
import {
  ResourcesScreen,
  SelfCareScreen,
} from './components/ResourcesAndSelfCare';
import { ASSETS, Language, translations } from './data/translations';
import { authService } from './services/authService';

export type ActiveScreen =
  | 'login'
  | 'inicio'
  | 'panel-estudiante'
  | 'recursos'
  | 'autocuidado'
  | 'orientacion'
  | 'solicitud-enviada'
  | 'panel-orientador'
  | 'perfil'
  | 'comprobante-eliminar';

export default function App() {
  const [lang, setLang] = useState<Language>('es');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('login');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [accountDeleted, setAccountDeleted] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userGrade, setUserGrade] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showHotlineModal, setShowHotlineModal] = useState<boolean>(false);

  // Restore active authorized session on mount if one exists
  useEffect(() => {
    const session = authService.getSession();
    if (
      session &&
      session.userEmail &&
      session.userEmail !== 'c.rodriguez@colegio.edu.co' &&
      session.userName !== 'Camila R.'
    ) {
      setIsLoggedIn(true);
      setUserEmail(session.userEmail);
      setUserName(session.userName || session.userEmail.split('@')[0]);
      setUserGrade(session.role === 'orientador' ? 'Equipo de Orientación' : 'Estudiante');
      setIsVerified(Boolean(session.isVerified));
      setActiveScreen('inicio');
    } else {
      setIsLoggedIn(false);
      setUserEmail('');
      setUserName('');
      setUserGrade('');
      setIsVerified(false);
      setActiveScreen('login');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleNavigate = (screen: string) => {
    if (!isLoggedIn && screen !== 'login' && screen !== 'comprobante-eliminar') {
      setActiveScreen('login');
      showToast(
        lang === 'es'
          ? 'Debes iniciar sesión para acceder a las herramientas'
          : 'You must sign in to access platform tools'
      );
      return;
    }
    setActiveScreen(screen as ActiveScreen);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserName('');
    setUserEmail('');
    setUserGrade('');
    setIsVerified(false);
    setActiveScreen('login');
    setMenuOpen(false);
    showToast(
      lang === 'es'
        ? 'Sesión cerrada correctamente'
        : 'Logged out successfully'
    );
  };

  const tHeader = translations[lang].header;
  const tNav = translations[lang].nav;
  const tSwitch = translations[lang].screenSwitcher;
  const tFooter = translations[lang].footer;

  const isNavActive = (key: string) => {
    if (key === 'inicio') return activeScreen === 'inicio';
    if (key === 'panel-estudiante') return activeScreen === 'panel-estudiante';
    if (key === 'recursos') return activeScreen === 'recursos';
    if (key === 'autocuidado') return activeScreen === 'autocuidado';
    if (key === 'orientacion') {
      return activeScreen === 'orientacion' || activeScreen === 'solicitud-enviada';
    }
    if (key === 'panel-orientador') return activeScreen === 'panel-orientador';
    if (key === 'perfil') return activeScreen === 'perfil';
    return activeScreen === key;
  };

  const navItems = [
    { id: 'inicio', label: tNav.inicio, icon: 'home' },
    { id: 'recursos', label: tNav.recursos, icon: 'local_library' },
    { id: 'autocuidado', label: tNav.autocuidado, icon: 'spa' },
    { id: 'orientacion', label: tNav.orientacion, icon: 'forum' },
    { id: 'panel-estudiante', label: tSwitch.studentDashboard, icon: 'dashboard' },
    { id: 'panel-orientador', label: tSwitch.counselorPanel, icon: 'psychology' },
  ];

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top Professional Web Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_4px_24px_-4px_rgba(20,184,166,0.08)] border-b border-outline-variant/20 transition-colors">
        <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Zone: Official Emblem + Logo + Institutional Badge */}
          <button
            type="button"
            onClick={() => {
              if (isLoggedIn) {
                handleNavigate('inicio');
              } else {
                handleNavigate('login');
              }
            }}
            className="flex items-center gap-3 text-left cursor-pointer shrink-0 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-white shadow-xs p-1 flex items-center justify-center border border-outline-variant/30 group-hover:scale-105 transition-transform">
              <img
                alt="Expresa Te Logo"
                className="w-full h-full object-contain"
                src={ASSETS.loginEmblem}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm font-bold text-primary tracking-tight leading-none">
                  Expresa Te
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed/30 text-primary font-label-sm font-semibold border border-primary/20">
                  <span className="material-symbols-outlined text-[13px] text-tertiary">
                    shield_lock
                  </span>
                  <span>{isLoggedIn ? '100% Seguro' : 'Portal Institucional'}</span>
                </span>
              </div>
              <span className="font-label-sm text-on-surface-variant hidden xs:inline mt-0.5">
                {tHeader.subtitle}
              </span>
            </div>
          </button>

          {/* Center Navigation Zone */}
          {isLoggedIn ? (
            /* Desktop Web Navigation Links (Only visible once logged in) */
            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5" aria-label="Navegación principal">
              {navItems.map((item) => {
                const active = isNavActive(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-label-md font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-primary-fixed/40 text-primary shadow-xs font-bold'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          ) : (
            /* Notice when not logged in */
            <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px] text-primary">
                verified_user
              </span>
              <span>
                {lang === 'es'
                  ? 'Portal seguro para estudiantes y equipo de orientación'
                  : 'Secure portal for students and counseling team'}
              </span>
            </div>
          )}

          {/* Controls Zone: Emergency / Crisis + Dark Mode + Language + User Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Emergency / Crisis Button (Always available for immediate psychological first-aid) */}
            <button
              type="button"
              onClick={() => setShowHotlineModal(true)}
              title={lang === 'es' ? 'Línea de Crisis y Apoyo Inmediato' : 'Crisis & Immediate Support Line'}
              className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-error-container/40 text-error hover:bg-error-container/70 border border-error/30 font-label-sm font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[17px] text-error">
                emergency
              </span>
              <span className="hidden sm:inline">{lang === 'es' ? 'Línea 106' : 'Hotline 106'}</span>
            </button>

            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              title={tHeader.themeTooltip}
              aria-label={tHeader.themeTooltip}
              className="flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm font-semibold transition-all active:scale-95 cursor-pointer border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">
                {darkMode ? 'light_mode' : 'dark_mode'}
              </span>
              <span className="hidden xl:inline">{darkMode ? tHeader.lightMode : tHeader.darkMode}</span>
            </button>

            {/* Language Selector: ES / EN */}
            <div
              role="group"
              aria-label="Selector de idioma"
              className="flex items-center bg-surface-container-low p-0.5 rounded-full border border-outline-variant/30"
            >
              <button
                type="button"
                onClick={() => setLang('es')}
                className={`h-8 px-2.5 rounded-full font-label-sm font-bold transition-all cursor-pointer ${
                  lang === 'es'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`h-8 px-2.5 rounded-full font-label-sm font-bold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                EN
              </button>
            </div>

            {/* User Profile / Status Button */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleNavigate('perfil')}
                  className="flex items-center gap-2 h-9 pl-2 pr-3 bg-primary-container text-on-primary rounded-full font-label-sm font-bold shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[100px] sm:max-w-[130px] truncate">{userName || 'Mi Perfil'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  title={lang === 'es' ? 'Cerrar sesión' : 'Log out'}
                  aria-label={lang === 'es' ? 'Cerrar sesión' : 'Log out'}
                  className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-surface-container-low hover:bg-error-container/40 text-on-surface-variant hover:text-error border border-outline-variant/30 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    logout
                  </span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleNavigate('login')}
                className="flex items-center gap-1.5 h-9 px-3.5 bg-primary text-on-primary rounded-full font-label-sm font-bold shadow-xs hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">
                  lock_open
                </span>
                <span>{translations[lang].welcome.loginBtn}</span>
              </button>
            )}

            {/* Hamburger button for mobile / tablet drawer */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menú de navegación"
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/30 transition-colors active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex justify-end md:hidden animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-80 h-full bg-surface-container-lowest p-6 shadow-2xl border-l border-outline-variant/30 flex flex-col justify-between overflow-y-auto"
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
                <div className="bg-primary-fixed/20 p-3 rounded-xl border border-primary/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                      {userName ? userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-md font-bold text-on-surface truncate">
                        {userName}
                      </span>
                      <span className="font-label-sm text-primary">
                        {userGrade || 'Estudiante'} • Verificado
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Cerrar sesión"
                    className="p-1.5 rounded-lg bg-surface-container hover:bg-error-container/40 text-on-surface-variant hover:text-error cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      logout
                    </span>
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-2">
                  <p className="font-label-sm text-on-surface-variant leading-relaxed">
                    {lang === 'es'
                      ? 'Inicia sesión con tu correo institucional (@colegio.edu.co) para desbloquear las herramientas de bienestar.'
                      : 'Sign in with your institutional email (@colegio.edu.co) to unlock all wellbeing tools.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleNavigate('login')}
                    className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      login
                    </span>
                    <span>{translations[lang].welcome.loginBtn}</span>
                  </button>
                </div>
              )}

              {/* Navigation list (Only if logged in) */}
              {isLoggedIn && (
                <div className="flex flex-col gap-1 pt-2">
                  <span className="font-label-sm font-bold text-on-surface-variant uppercase tracking-wider px-3 mb-1">
                    Navegación
                  </span>
                  {[
                    { id: 'inicio', label: tSwitch.welcome, icon: 'home' },
                    { id: 'panel-estudiante', label: tSwitch.studentDashboard, icon: 'dashboard' },
                    { id: 'recursos', label: tSwitch.resources, icon: 'local_library' },
                    { id: 'autocuidado', label: tSwitch.selfcare, icon: 'spa' },
                    { id: 'orientacion', label: tSwitch.requestForm, icon: 'chat_bubble' },
                    { id: 'panel-orientador', label: tSwitch.counselorPanel, icon: 'psychology' },
                    { id: 'perfil', label: tSwitch.profile, icon: 'person' },
                  ].map((item) => (
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
                    setShowHotlineModal(true);
                    setMenuOpen(false);
                  }}
                  className="px-2.5 py-1 bg-error text-on-error rounded-lg font-label-sm font-semibold cursor-pointer"
                >
                  Ayuda
                </button>
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
                <span>Idioma:</span>
                <span className="font-bold text-primary">{lang.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Full-Width Web Layout Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col">
        {!isLoggedIn ? (
          /* ========================================================================= */
          /* GATEWAY INTERFACE: BEFORE LOGIN (LOGIN / REGISTER ONLY)                  */
          /* "TODO el contenido propio de la plataforma debe visualizarse después     */
          /*  que el usuario haya iniciado sesión, antes no..."                       */
          /* ========================================================================= */
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
                setUserGrade('');
                setActiveScreen('login');
              }}
              onShowToast={showToast}
            />
          ) : (
            <LoginScreen
              lang={lang}
              accountDeleted={accountDeleted}
              onLoginSuccess={(email, verified = true, name, grade) => {
                setIsLoggedIn(true);
                setUserEmail(email);
                setUserName(name || email.split('@')[0]);
                setUserGrade(grade || 'Estudiante');
                setIsVerified(verified);
                // Immediately grant access to the proprietary platform content!
                setActiveScreen(
                  grade?.toLowerCase().includes('orientador')
                    ? 'panel-orientador'
                    : 'inicio'
                );
                showToast(
                  lang === 'es'
                    ? `¡Bienvenido/a a Expresa Te, ${name || email.split('@')[0]}!`
                    : `Welcome to Expresa Te, ${name || email.split('@')[0]}!`
                );
              }}
              onNavigate={handleNavigate}
              onShowToast={showToast}
            />
          )
        ) : (
          /* ========================================================================= */
          /* PROPRIETARY PLATFORM SCREENS (ONLY ACCESSIBLE AFTER LOGIN)                */
          /* ========================================================================= */
          <>
            {activeScreen === 'inicio' && (
              <WelcomeScreen
                lang={lang}
                onNavigate={handleNavigate}
                isLoggedIn={isLoggedIn}
                userName={userName}
                onShowToast={showToast}
              />
            )}

            {activeScreen === 'panel-estudiante' && (
              <StudentDashboardScreen
                lang={lang}
                onNavigate={handleNavigate}
                isLoggedIn={isLoggedIn}
                userName={userName}
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

            {(activeScreen === 'orientacion' ||
              activeScreen === 'solicitud-enviada' ||
              activeScreen === 'panel-orientador') && (
              <OrientationScreens
                lang={lang}
                subScreen={
                  activeScreen === 'solicitud-enviada'
                    ? 'sent'
                    : activeScreen === 'panel-orientador'
                    ? 'counselor'
                    : 'form'
                }
                onChangeSubScreen={(sub) => {
                  if (sub === 'form') setActiveScreen('orientacion');
                  if (sub === 'sent') setActiveScreen('solicitud-enviada');
                  if (sub === 'counselor') setActiveScreen('panel-orientador');
                }}
                onNavigate={handleNavigate}
                onShowToast={showToast}
              />
            )}

            {activeScreen === 'perfil' && (
              <ProfileScreen
                lang={lang}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
                isLoggedIn={isLoggedIn}
                userName={userName}
                userEmail={userEmail}
                userGrade={userGrade}
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
          </>
        )}
      </main>

      {/* Comprehensive Professional Web Footer */}
      <footer className="w-full bg-surface-container-lowest/90 border-t border-outline-variant/30 pt-14 pb-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-outline-variant/20">
            {/* Col 1: Brand & Institutional Mission (4 cols on desktop) */}
            <div className="lg:col-span-4 flex flex-col items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white p-1 border border-outline-variant/30 shadow-xs flex items-center justify-center">
                  <img
                    alt="Expresa Te Logo"
                    className="w-full h-full object-contain"
                    src={ASSETS.loginEmblem}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm font-bold text-primary tracking-tight leading-none">
                    Expresa Te
                  </span>
                  <span className="font-label-sm text-tertiary mt-0.5">
                    {tFooter.badgeSafe}
                  </span>
                </div>
              </div>

              <p className="font-body-sm text-on-surface-variant leading-relaxed max-w-sm">
                {tFooter.tagline}
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low text-primary font-label-sm border border-outline-variant/30">
                <span className="material-symbols-outlined text-[16px] text-tertiary">
                  verified
                </span>
                <span>{tFooter.badgeSafe}</span>
              </div>
            </div>

            {/* Col 2: Navigation Links (Only shown when logged in or safe links when not logged in) */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <span className="font-title-md font-bold text-on-surface">
                {isLoggedIn ? tFooter.colExploreTitle : (lang === 'es' ? 'Portal Institucional' : 'Institutional Portal')}
              </span>
              <ul className="flex flex-col gap-2 font-body-sm text-on-surface-variant">
                {isLoggedIn ? (
                  <>
                    <li>
                      <button
                        type="button"
                        onClick={() => handleNavigate('inicio')}
                        className="hover:text-primary transition-colors cursor-pointer text-left"
                      >
                        {tFooter.linkHome}
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => handleNavigate('panel-estudiante')}
                        className="hover:text-primary transition-colors cursor-pointer text-left"
                      >
                        {tFooter.linkDashboard}
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => handleNavigate('recursos')}
                        className="hover:text-primary transition-colors cursor-pointer text-left"
                      >
                        {tFooter.linkResources}
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => handleNavigate('autocuidado')}
                        className="hover:text-primary transition-colors cursor-pointer text-left"
                      >
                        {tFooter.linkSelfcare}
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => handleNavigate('perfil')}
                        className="hover:text-primary transition-colors cursor-pointer text-left"
                      >
                        {tFooter.linkProfile}
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button
                        type="button"
                        onClick={() => handleNavigate('login')}
                        className="hover:text-primary transition-colors cursor-pointer text-left font-semibold text-primary"
                      >
                        {translations[lang].welcome.loginBtn}
                      </button>
                    </li>
                    <li className="text-on-surface-variant/80">
                      {lang === 'es' ? 'Política de Confidencialidad' : 'Confidentiality Policy'}
                    </li>
                    <li className="text-on-surface-variant/80">
                      {lang === 'es' ? 'Protocolos Escolares de Convivencia' : 'School Coexistence Protocols'}
                    </li>
                    <li className="text-on-surface-variant/80">
                      {lang === 'es' ? 'Protección de Datos Institucionales' : 'Institutional Data Protection'}
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Col 3: Crisis & 24/7 Hotlines (3 cols) */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <span className="font-title-md font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-error text-[18px]">
                  support_agent
                </span>
                <span>{tFooter.colHotlinesTitle}</span>
              </span>
              <ul className="flex flex-col gap-2 font-body-sm text-on-surface-variant">
                <li
                  onClick={() => setShowHotlineModal(true)}
                  className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low/70 hover:bg-surface-container cursor-pointer transition-colors"
                >
                  <span className="font-semibold text-primary">{tFooter.line106Label}</span>
                  <span className="font-label-sm px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">24/7</span>
                </li>
                <li
                  onClick={() => setShowHotlineModal(true)}
                  className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low/70 hover:bg-surface-container cursor-pointer transition-colors"
                >
                  <span className="font-semibold text-secondary">{tFooter.line192Label}</span>
                  <span className="font-label-sm px-2 py-0.5 rounded bg-secondary/10 text-secondary font-bold">Gratis</span>
                </li>
                <li
                  onClick={() => setShowHotlineModal(true)}
                  className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low/70 hover:bg-surface-container cursor-pointer transition-colors"
                >
                  <span className="font-semibold text-tertiary">{tFooter.line141Label}</span>
                  <span className="font-label-sm px-2 py-0.5 rounded bg-tertiary/10 text-tertiary font-bold">ICBF</span>
                </li>
                <li
                  onClick={() => setShowHotlineModal(true)}
                  className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low/70 hover:bg-surface-container cursor-pointer transition-colors"
                >
                  <span className="font-semibold text-on-surface">{tFooter.line123Label}</span>
                  <span className="font-label-sm px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-bold">Urgencias</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Legal & Ethics (2 cols) */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <span className="font-title-md font-bold text-on-surface">
                {tFooter.colLegalTitle}
              </span>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                {tFooter.legalDesc}
              </p>
              {isLoggedIn ? (
                <div className="flex flex-col gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleNavigate('orientacion')}
                    className="inline-flex items-center gap-1 text-primary hover:underline font-label-md cursor-pointer"
                  >
                    <span>{tFooter.linkOrientation}</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate('panel-orientador')}
                    className="inline-flex items-center gap-1 text-secondary hover:underline font-label-md cursor-pointer"
                  >
                    <span>{tFooter.linkCounselor}</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              ) : (
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
                    <span className="material-symbols-outlined text-[14px] text-tertiary">lock</span>
                    <span>{lang === 'es' ? 'Requiere inicio de sesión' : 'Sign-in required'}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-on-surface-variant font-body-sm">
            <p>© {new Date().getFullYear()} {tFooter.rights}</p>
            {isLoggedIn ? (
              <div className="flex items-center gap-4 text-on-surface-variant font-label-sm">
                <button
                  type="button"
                  onClick={() => handleNavigate('inicio')}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  {tNav.inicio}
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleNavigate('perfil')}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  {tNav.perfil}
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleNavigate('orientacion')}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  {tNav.orientacion}
                </button>
              </div>
            ) : (
              <span className="font-label-sm text-tertiary flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                <span>{lang === 'es' ? 'Espacio seguro e institucional' : 'Secure institutional environment'}</span>
              </span>
            )}
          </div>
        </div>
      </footer>

      {/* Floating Emergency Hotline Modal */}
      {showHotlineModal && (
        <div
          onClick={() => setShowHotlineModal(false)}
          className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 flex flex-col gap-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-error-container/40 text-error flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px]">
                    emergency
                  </span>
                </div>
                <div>
                  <h3 className="font-title-lg font-bold text-on-surface">
                    {lang === 'es' ? 'Líneas de Atención Emocional 24/7' : '24/7 Emotional Support Hotlines'}
                  </h3>
                  <p className="font-body-sm text-on-surface-variant">
                    {lang === 'es'
                      ? 'Líneas gratuitas, confidenciales y con profesionales de salud mental disponibles las 24 horas.'
                      : 'Free, confidential lines with mental health professionals available 24 hours a day.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHotlineModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-primary-fixed/20 border border-primary/20 flex flex-col justify-between">
                <div>
                  <span className="font-label-sm font-bold text-primary uppercase">
                    {lang === 'es' ? 'Línea 106 Escolar' : 'School Hotline 106'}
                  </span>
                  <p className="font-title-md font-bold text-on-surface mt-1">Tel: 106</p>
                  <p className="font-body-xs text-on-surface-variant mt-1">
                    {lang === 'es' ? 'Atención especializada para niños, niñas y adolescentes.' : 'Specialized attention for children and teens.'}
                  </p>
                </div>
                <div className="mt-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full bg-primary/20 text-primary font-label-xs font-bold">
                    WhatsApp: 300 754 8933
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-secondary-fixed/20 border border-secondary/20 flex flex-col justify-between">
                <div>
                  <span className="font-label-sm font-bold text-secondary uppercase">
                    {lang === 'es' ? 'Línea 192 Nacional' : 'National 192'}
                  </span>
                  <p className="font-title-md font-bold text-on-surface mt-1">Tel: 192 (Opción 4)</p>
                  <p className="font-body-xs text-on-surface-variant mt-1">
                    {lang === 'es' ? 'Ministerio de Salud y Protección Social de Colombia.' : 'Ministry of Health & Social Protection.'}
                  </p>
                </div>
                <div className="mt-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full bg-secondary/20 text-secondary font-label-xs font-bold">
                    {lang === 'es' ? 'Gratis todo el país' : 'Nationwide Free'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low text-on-surface-variant text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-tertiary shrink-0">
                shield_lock
              </span>
              <span>
                {lang === 'es'
                  ? 'No estás solo/a. Si estás atravesando un momento difícil o de crisis, estos servicios te brindarán contención inmediata.'
                  : 'You are not alone. If you are experiencing a difficult moment or crisis, these services provide immediate support.'}
              </span>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowHotlineModal(false)}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-primary/90 transition-colors cursor-pointer"
              >
                {lang === 'es' ? 'Entendido' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-2xl font-label-md shadow-2xl flex items-center gap-2.5 transition-all animate-bounce-short border border-inverse-on-surface/20">
          <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile-Only Bottom Navigation Bar (ONLY visible when logged in, hidden on desktop/tablet) */}
      {isLoggedIn && (
        <nav
          aria-label="Navegación móvil"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-xl shadow-[0_-8px_24px_rgba(0,0,0,0.06)] border-t border-outline-variant/20"
        >
          <div className="flex items-center justify-around h-16 px-2">
            {[
              { id: 'inicio', icon: 'home', label: tNav.inicio },
              { id: 'recursos', icon: 'local_library', label: tNav.recursos },
              { id: 'autocuidado', icon: 'spa', label: tNav.autocuidado },
              { id: 'orientacion', icon: 'forum', label: tNav.orientacion },
              { id: 'perfil', icon: 'person_outline', label: tNav.perfil },
            ].map((tab) => {
              const active = isNavActive(tab.id);
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleNavigate(tab.id)}
                  className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors cursor-pointer ${
                    active
                      ? 'text-primary font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px] mb-0.5">
                    {tab.icon}
                  </span>
                  <span className="font-label-sm tracking-tight text-[11px]">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
