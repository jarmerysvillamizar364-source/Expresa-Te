import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../data/translations';

interface UserProfileDropdownProps {
  lang: Language;
  userName: string;
  userEmail: string;
  userRole: 'estudiante' | 'orientador' | 'psicologo' | 'administrativo';
  userPerfil?: string;
  userGrade?: string;
  userSede?: string;
  isVerified?: boolean;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onChangeLang: (newLang: Language) => void;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  onShowToast: (msg: string) => void;
  onOpenEmergencyModal?: () => void;
  activeScreen: string;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  lang,
  userName,
  userEmail,
  userRole,
  userPerfil,
  userGrade,
  userSede = 'Sede Principal',
  isVerified = true,
  darkMode,
  onToggleDarkMode,
  onChangeLang,
  onNavigate,
  onLogout,
  onShowToast,
  onOpenEmergencyModal,
  activeScreen,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isStaff = userRole === 'orientador' || userRole === 'psicologo' || userRole === 'administrativo';

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowLogoutConfirm(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setShowLogoutConfirm(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleAction = (callback: () => void) => {
    setIsOpen(false);
    setShowLogoutConfirm(false);
    callback();
  };

  const getInitials = (name: string, email: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    }
    return email ? email.substring(0, 2).toUpperCase() : 'US';
  };

  const getRoleLabel = () => {
    if (userPerfil) return userPerfil;
    if (userRole === 'psicologo') return lang === 'es' ? 'Psicología' : 'Psychology';
    if (userRole === 'orientador') return lang === 'es' ? 'Orientación Escolar' : 'Counselor';
    if (userRole === 'administrativo') return lang === 'es' ? 'Directivo / Administrativo' : 'Staff Admin';
    return lang === 'es' ? 'Estudiante' : 'Student';
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button: User Avatar + Name + Dropdown Indicator */}
      <button
        type="button"
        id="user-profile-menu-button"
        onClick={() => {
          setIsOpen(!isOpen);
          setShowLogoutConfirm(false);
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={lang === 'es' ? 'Menú de opciones de usuario' : 'User profile options menu'}
        className={`h-9 sm:h-10 pl-1.5 pr-2 sm:pl-2 sm:pr-3 rounded-xl font-label-sm font-bold shadow-xs hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 shrink-0 border border-outline-variant/30 ${
          isOpen
            ? 'bg-primary text-on-primary ring-2 ring-primary/30'
            : 'bg-primary-container text-on-primary hover:opacity-95'
        }`}
      >
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs uppercase shadow-2xs">
          {getInitials(userName, userEmail)}
        </div>
        <span className="hidden sm:inline max-w-[110px] md:max-w-[130px] truncate text-left text-xs sm:text-sm">
          {userName || (userEmail ? userEmail.split('@')[0] : 'Usuario')}
        </span>
        <span
          className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Standard Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-profile-menu-button"
          className="absolute right-0 top-full mt-2 w-76 sm:w-84 max-h-[85vh] overflow-y-auto bg-surface-container-lowest text-on-surface rounded-2xl shadow-2xl border border-outline-variant/30 z-50 divide-y divide-outline-variant/15 origin-top-right transition-all animate-in fade-in zoom-in-95 focus:outline-none"
        >
          {/* Header 1: User Identity Card */}
          <div className="p-4 bg-surface-container-low/50">
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-primary text-on-primary font-bold text-sm flex items-center justify-center shadow-xs">
                  {getInitials(userName, userEmail)}
                </div>
                {isVerified && (
                  <div
                    title={lang === 'es' ? 'Cuenta Institucional Verificada' : 'Verified Institutional Account'}
                    className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center ring-2 ring-surface-container-lowest"
                  >
                    <span className="material-symbols-outlined text-[11px] font-bold">
                      check
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-title-sm font-bold text-on-surface truncate">
                    {userName || 'Usuario Institucional'}
                  </p>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant truncate">
                  {userEmail}
                </p>

                <div className="mt-1.5 flex flex-wrap items-center gap-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-primary-fixed/30 text-primary">
                    <span className="material-symbols-outlined text-[13px]">
                      {isStaff ? 'shield_person' : 'school'}
                    </span>
                    {getRoleLabel()}
                  </span>
                  {userGrade && !isStaff && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-surface-container-high text-on-surface-variant truncate max-w-[130px]">
                      {userGrade}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Institutional campus sub-badge */}
            <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant font-medium">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-primary">
                  location_city
                </span>
                <span>{userSede}</span>
              </span>
              <span className="text-tertiary font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px]">verified_user</span>
                <span>{lang === 'es' ? 'Activo' : 'Active'}</span>
              </span>
            </div>
          </div>

          {/* Section 2: Account & Navigation Links */}
          <div className="py-1.5 px-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => handleAction(() => onNavigate('perfil'))}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-label-md text-sm text-left transition-colors cursor-pointer group ${
                activeScreen === 'perfil'
                  ? 'bg-primary-fixed/30 text-primary font-bold'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px]">
                    account_circle
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold leading-tight">
                    {lang === 'es' ? 'Mi Perfil' : 'My Profile'}
                  </span>
                  <span className="text-[11px] text-on-surface-variant leading-tight">
                    {lang === 'es' ? 'Detalles de cuenta y credenciales' : 'Account details and credentials'}
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </button>

            {/* Dashboard Link according to role */}
            <button
              type="button"
              role="menuitem"
              onClick={() =>
                handleAction(() => onNavigate(isStaff ? 'panel-orientador' : 'panel-estudiante'))
              }
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-label-md text-sm text-left transition-colors cursor-pointer group ${
                (isStaff && activeScreen === 'panel-orientador') ||
                (!isStaff && activeScreen === 'panel-estudiante')
                  ? 'bg-primary-fixed/30 text-primary font-bold'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                  <span className="material-symbols-outlined text-[18px]">
                    {isStaff ? 'dashboard_customize' : 'dashboard'}
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold leading-tight">
                    {isStaff
                      ? lang === 'es' ? 'Gestión de Casos & Censo' : 'Case Management & Census'
                      : lang === 'es' ? 'Mi Espacio Personal' : 'My Personal Space'}
                  </span>
                  <span className="text-[11px] text-on-surface-variant leading-tight">
                    {isStaff
                      ? lang === 'es' ? 'Triage, protocolos y seguimiento' : 'Triage, protocols & tracking'
                      : lang === 'es' ? 'Diario emocional y progreso' : 'Mood diary and progress'}
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </button>

            {/* Guidance Request / Inbox */}
            {!isStaff ? (
              <button
                type="button"
                role="menuitem"
                onClick={() => handleAction(() => onNavigate('orientacion'))}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-label-md text-sm text-left transition-colors cursor-pointer group ${
                  activeScreen === 'orientacion' || activeScreen === 'solicitud-enviada'
                    ? 'bg-primary-fixed/30 text-primary font-bold'
                    : 'text-on-surface hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-tertiary group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">
                      support_agent
                    </span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-semibold leading-tight">
                      {lang === 'es' ? 'Solicitud de Orientación' : 'Guidance Request'}
                    </span>
                    <span className="text-[11px] text-on-surface-variant leading-tight">
                      {lang === 'es' ? 'Acompañamiento seguro y privado' : 'Safe and private guidance'}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </button>
            ) : null}
          </div>

          {/* Section 3: Resources & Wellness */}
          <div className="py-1.5 px-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => handleAction(() => onNavigate('audiovisuales'))}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-label-md text-sm text-left transition-colors cursor-pointer group ${
                activeScreen === 'audiovisuales' || activeScreen === 'recursos'
                  ? 'bg-primary-fixed/30 text-primary font-bold'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[19px] text-primary">
                  smart_display
                </span>
                <span className="font-medium">
                  {lang === 'es' ? 'Centro de Audiovisuales' : 'Audiovisual Media Hub'}
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => handleAction(() => onNavigate('autocuidado'))}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-label-md text-sm text-left transition-colors cursor-pointer group ${
                activeScreen === 'autocuidado'
                  ? 'bg-primary-fixed/30 text-primary font-bold'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[19px] text-tertiary">
                  spa
                </span>
                <span className="font-medium">
                  {lang === 'es' ? 'Herramientas de Autocuidado' : 'Self-Care Tools'}
                </span>
              </div>
            </button>
          </div>

          {/* Section 4: Quick Platform Preferences (Theme & Language) */}
          <div className="py-2 px-3 bg-surface-container-low/30 space-y-2">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
              {lang === 'es' ? 'Preferencias del Sistema' : 'System Preferences'}
            </span>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between py-1 text-xs">
              <div className="flex items-center gap-2 text-on-surface font-medium">
                <span className="material-symbols-outlined text-[17px] text-primary">
                  {darkMode ? 'dark_mode' : 'light_mode'}
                </span>
                <span>{darkMode ? (lang === 'es' ? 'Tema Oscuro' : 'Dark Mode') : (lang === 'es' ? 'Tema Claro' : 'Light Mode')}</span>
              </div>
              <button
                type="button"
                onClick={onToggleDarkMode}
                className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  darkMode ? 'bg-primary' : 'bg-surface-container-high'
                }`}
                role="switch"
                aria-checked={darkMode}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    darkMode ? 'translate-x-4.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Language Selection: Single Toggle Button */}
            <div className="flex items-center justify-between py-1 text-xs">
              <div className="flex items-center gap-2 text-on-surface font-medium">
                <span className="material-symbols-outlined text-[17px] text-secondary">
                  translate
                </span>
                <span>{lang === 'es' ? 'Idioma' : 'Language'}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextLang = lang === 'es' ? 'en' : 'es';
                  onChangeLang(nextLang);
                  onShowToast(
                    nextLang === 'es'
                      ? 'Idioma cambiado a Español'
                      : 'Language switched to English'
                  );
                }}
                title={lang === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'}
                aria-label={lang === 'es' ? 'Cambiar idioma' : 'Switch language'}
                className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-[11px] font-bold text-primary transition-all cursor-pointer flex items-center gap-1 shadow-2xs active:scale-95"
              >
                <span className="uppercase">{lang}</span>
                <span className="text-on-surface-variant font-normal">⇄</span>
                <span className="text-on-surface-variant font-semibold">{lang === 'es' ? 'EN' : 'ES'}</span>
              </button>
            </div>
          </div>

          {/* Section 5: Crisis / Help Helpline info */}
          <div className="p-2.5 bg-error-container/20">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (onOpenEmergencyModal) {
                  onOpenEmergencyModal();
                } else {
                  window.location.href = 'tel:106';
                }
              }}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-surface-container-lowest/70 hover:bg-surface-container-lowest border border-error/20 text-error transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  emergency
                </span>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight">
                    {lang === 'es' ? 'Línea de Crisis 106' : 'Crisis Line 106'}
                  </span>
                  <span className="text-[10px] text-on-surface-variant leading-tight">
                    {lang === 'es' ? 'Apoyo emocional 24/7' : '24/7 Emotional support'}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-error text-on-error rounded-md">
                {lang === 'es' ? 'Llamar' : 'Call'}
              </span>
            </button>
          </div>

          {/* Section 6: Standard Logout action */}
          <div className="p-2 bg-surface-container-low/40">
            {showLogoutConfirm ? (
              <div className="p-2.5 bg-error-container/40 rounded-xl border border-error/30 space-y-2 text-center animate-in fade-in">
                <p className="text-xs font-bold text-error">
                  {lang === 'es' ? '¿Confirmas cerrar tu sesión?' : 'Are you sure you want to sign out?'}
                </p>
                <div className="flex items-center gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-1.5 px-2 bg-surface-container text-on-surface font-label-sm font-semibold rounded-lg text-xs hover:bg-surface-container-high cursor-pointer transition-colors"
                  >
                    {lang === 'es' ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(onLogout)}
                    className="flex-1 py-1.5 px-2 bg-error text-on-error font-label-sm font-bold rounded-lg text-xs hover:opacity-90 cursor-pointer shadow-xs transition-opacity"
                  >
                    {lang === 'es' ? 'Sí, salir' : 'Sign out'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                role="menuitem"
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-error hover:bg-error-container/40 font-label-md text-sm transition-colors cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-error-container/60 text-error flex items-center justify-center group-hover:bg-error group-hover:text-on-error transition-colors">
                  <span className="material-symbols-outlined text-[17px]">
                    logout
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold leading-tight">
                    {lang === 'es' ? 'Cerrar Sesión' : 'Sign Out'}
                  </span>
                  <span className="text-[10px] text-error/80 leading-tight">
                    {lang === 'es' ? 'Finalizar sesión institucional' : 'End institutional session'}
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
