import React, { useState } from 'react';
import { ASSETS, Language, translations } from '../data/translations';
import { authService } from '../services/authService';
import { PWAInstallButton } from './PWAInstallButton';

export { LoginScreen } from './LoginScreen';
export type { LoginScreenProps } from './LoginScreen';

interface ProfileScreenProps {
  lang: Language;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isLoggedIn: boolean;
  userName: string;
  userEmail: string;
  userGrade: string;
  userRole?: string;
  userPerfil?: string;
  userDocumento?: string;
  userSede?: string;
  isVerified?: boolean;
  onToggleLanguage?: () => void;
  onNavigate: (screen: string) => void;
  onUpdateProfile: (name: string, grade: string) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onShowToast: (msg: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  lang,
  darkMode,
  onToggleDarkMode,
  onToggleLanguage,
  isLoggedIn,
  userName,
  userEmail,
  userGrade,
  userRole = 'estudiante',
  userPerfil,
  userDocumento,
  userSede,
  isVerified = true,
  onNavigate,
  onUpdateProfile,
  onLogout,
  onDeleteAccount,
  onShowToast,
}) => {
  const t = translations[lang].profile;
  const isStaff = userRole === 'orientador' || userRole === 'psicologo' || userRole === 'administrativo';
  const [selfcareReminders, setSelfcareReminders] = useState(true);
  const [anonMode, setAnonMode] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editGrade, setEditGrade] = useState(userGrade);
  const [confirmModal, setConfirmModal] = useState<
    'none' | 'logout' | 'delete'
  >('none');

  // Synchronize edit inputs when active user props change
  React.useEffect(() => {
    setEditName(userName);
    setEditGrade(userGrade);
  }, [userName, userGrade]);

  const handleSaveEdit = () => {
    onUpdateProfile(editName.trim() || userName, editGrade.trim() || userGrade);
    setIsEditing(false);
    onShowToast(lang === 'es' ? 'Datos de perfil actualizados' : 'Profile data updated');
  };

  // State 1: NO AUTHENTICATED USER - Show empty profile section with prompt and login button
  if (!isLoggedIn || !userEmail.trim()) {
    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto pb-12 space-y-6 animate-fade-in">
        <div className="flex flex-col pt-space-xs">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-headline-lg-mobile text-on-surface font-bold tracking-tight">
                {t.title}
              </h1>
              <p className="font-body-sm text-on-surface-variant mt-0.5">
                {t.subtitle}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[22px]">
                person_off
              </span>
            </div>
          </div>
        </div>

        {/* Tarjeta de perfil vacío */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-space-lg sm:p-space-xl shadow-sm border border-outline-variant/30 flex flex-col items-center text-center space-y-4 py-10">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[32px]">
              lock_person
            </span>
          </div>

          <div className="space-y-1.5 max-w-sm">
            <h2 className="font-title-lg text-on-surface font-bold">
              {t.notLoggedInMessage || 'Inicia sesión para ver tu perfil'}
            </h2>
            <p className="font-body-md text-on-surface-variant">
              {t.notLoggedInDesc ||
                'Accede con tu correo institucional (@colegio.edu.co) para consultar tu información académica, gestionar tus preferencias y mantener tus datos seguros.'}
            </p>
          </div>

          <div className="w-full max-w-xs pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-primary text-on-primary font-label-lg font-semibold shadow-md shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                login
              </span>
              <span>{t.loginBtn || 'Iniciar sesión'}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('inicio')}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-md transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              <span>{translations[lang].login.backHome || 'Volver al inicio'}</span>
            </button>
          </div>
        </div>

        {/* Ajustes generales de la aplicación disponibles sin iniciar sesión */}
        <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md border border-outline-variant/20">
          <span className="font-title-md text-on-surface font-semibold block">
            {t.accountSettings}
          </span>
          <div
            onClick={onToggleDarkMode}
            className="flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  {darkMode ? 'dark_mode' : 'light_mode'}
                </span>
              </div>
              <div>
                <p className="font-label-lg text-on-surface">{t.displayMode}</p>
                <p className="font-body-sm text-on-surface-variant">
                  {darkMode ? t.displayModeDarkSub : t.displayModeLightSub}
                </p>
              </div>
            </div>
            <span className="font-label-md text-primary font-medium bg-surface-container-low px-2.5 py-1 rounded-full">
              {darkMode
                ? translations[lang].header.darkMode
                : translations[lang].header.lightMode}
            </span>
          </div>
        </section>
      </div>
    );
  }

  // State 2: AUTHENTICATED USER - Show authorized real user information
  const userInitials = userName.trim()
    ? userName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : (userEmail ? userEmail[0].toUpperCase() : 'U');

  const confidentialIdNumber = Math.abs(
    userEmail.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0) % 9000 + 1000
  );

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto pb-12 space-y-6 animate-fade-in">
      <div className="flex flex-col pt-space-xs">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline-lg-mobile text-on-surface font-bold tracking-tight">
              {t.title}
            </h1>
            <p className="font-body-sm text-on-surface-variant mt-0.5">
              {t.subtitle}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-fixed/40 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[22px]">
              verified_user
            </span>
          </div>
        </div>
      </div>

      <div className="w-full bg-surface-container-low rounded-xl p-space-md flex items-center gap-space-md shadow-sm">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined text-[20px]">lock</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-label-md text-primary font-semibold">
            {t.protectedTitle}
          </p>
          <p className="font-body-sm text-on-surface-variant truncate">
            {t.protectedSub}
          </p>
        </div>
      </div>

      {/* Información básica */}
      <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md">
        <div className="flex items-center justify-between">
          <span className="font-title-md text-on-surface font-semibold">
            {t.basicInfo}
          </span>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg font-label-md text-primary font-semibold bg-surface-container-low hover:bg-surface-container transition-colors active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">
                edit
              </span>
              {t.editData}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveEdit}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg font-label-md text-on-primary font-semibold bg-primary hover:opacity-90 transition-colors active:scale-95 cursor-pointer whitespace-nowrap shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">
                check
              </span>
              {t.saveData}
            </button>
          )}
        </div>

        <div className="flex items-center gap-space-md">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-fixed to-primary-container flex items-center justify-center text-on-primary-container font-title-lg font-bold shadow-inner">
              {userInitials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary text-[14px] shadow-sm">
              <span className="material-symbols-outlined text-[14px]">
                shield
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-title-md outline-none ring-2 ring-primary/50"
              />
            ) : (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-title-md text-on-surface font-semibold truncate max-w-[200px] sm:max-w-none">
                  {userName || userEmail.split('@')[0]}
                </span>
                <span className={`font-label-sm px-2.5 py-0.5 rounded-md font-bold ${
                  isStaff
                    ? userPerfil === 'Psicología'
                      ? 'bg-purple-100 text-purple-900 border border-purple-200'
                      : 'bg-teal-100 text-teal-900 border border-teal-200'
                    : 'bg-primary-fixed/40 text-on-primary-fixed-variant'
                }`}>
                  {isStaff ? (userPerfil || 'Personal Institucional') : t.pseudonym}
                </span>
              </div>
            )}
            <p className="font-body-sm text-on-surface-variant truncate mt-0.5">
              {t.confidentialId}: #{confidentialIdNumber}-{isStaff ? (userPerfil === 'Psicología' ? 'PSI' : 'ADM') : 'EST'}
            </p>
          </div>
        </div>

        <div className="space-y-space-sm pt-space-xs">
          {/* Grade or Administrative Position */}
          <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low gap-2">
            <div className="flex items-center gap-space-sm min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                <span className="material-symbols-outlined text-[18px]">
                  {isStaff ? 'badge' : 'school'}
                </span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-label-sm text-on-surface-variant">
                  {isStaff ? (lang === 'es' ? 'Cargo y Rol Asignado' : 'Official Role') : t.gradeLabel}
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editGrade}
                    onChange={(e) => setEditGrade(e.target.value)}
                    className="w-full h-9 px-2.5 mt-0.5 rounded-md bg-surface-container-lowest text-on-surface font-body-sm outline-none ring-1 ring-primary"
                  />
                ) : (
                  <span className="font-body-sm text-on-surface font-medium truncate">
                    {userGrade}
                  </span>
                )}
              </div>
            </div>
            <span className="font-label-sm text-tertiary bg-surface-container-lowest px-2.5 py-1 rounded-md font-medium shrink-0">
              {isStaff ? (lang === 'es' ? 'Activo en Censo' : 'Census Active') : t.activeBadge}
            </span>
          </div>

          {/* Institutional Document if available */}
          {userDocumento && (
            <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low gap-2">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    id_card
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-on-surface-variant">
                    {lang === 'es' ? 'Documento Institucional Validado' : 'Verified ID Document'}
                  </span>
                  <span className="font-body-sm font-mono text-on-surface font-semibold truncate">
                    {userDocumento} {userSede ? `• ${userSede}` : ''}
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-tertiary shrink-0">
                verified
              </span>
            </div>
          )}

          {/* Email Address */}
          <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low gap-2">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                <span className="material-symbols-outlined text-[18px]">
                  alternate_email
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-on-surface-variant">
                  {t.emailLabel}
                </span>
                <span className="font-body-sm text-on-surface font-medium truncate">
                  {userEmail}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={`font-label-sm px-2.5 py-0.5 rounded-md font-semibold ${
                  isVerified
                    ? 'text-tertiary bg-tertiary/10'
                    : 'text-amber-600 bg-amber-500/10'
                }`}
              >
                {isVerified
                  ? lang === 'es'
                    ? 'Verificado'
                    : 'Verified'
                  : lang === 'es'
                  ? 'No verificado'
                  : 'Unverified'}
              </span>
              <span
                className={`material-symbols-outlined text-[18px] ${
                  isVerified ? 'text-tertiary' : 'text-amber-500'
                }`}
              >
                {isVerified ? 'verified' : 'pending'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Configuración de cuenta */}
      <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md">
        <span className="font-title-md text-on-surface font-semibold block">
          {t.accountSettings}
        </span>
        <div className="space-y-space-sm">
          <div className="flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-full bg-primary-fixed/40 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  spa
                </span>
              </div>
              <div>
                <p className="font-label-lg text-on-surface">
                  {t.selfcareReminders}
                </p>
                <p className="font-body-sm text-on-surface-variant">
                  {t.selfcareRemindersSub}
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={selfcareReminders}
              onClick={() => setSelfcareReminders(!selfcareReminders)}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors relative flex items-center cursor-pointer ${
                selfcareReminders ? 'bg-primary' : 'bg-outline-variant'
              }`}
            >
              <span
                className={`w-5 h-5 bg-surface-container-lowest rounded-full transition-transform shadow-sm ${
                  selfcareReminders ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></span>
            </button>
          </div>

          <div
            onClick={() => onShowToast('Canal de avisos: Solo chat interno')}
            className="flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  forum
                </span>
              </div>
              <div>
                <p className="font-label-lg text-on-surface">
                  {t.orientationAlerts}
                </p>
                <p className="font-body-sm text-on-surface-variant">
                  {t.orientationAlertsSub}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant">
              <span className="font-label-sm">{t.chatOnly}</span>
              <span className="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </div>
          </div>

          <div
            onClick={onToggleDarkMode}
            className="flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  {darkMode ? 'dark_mode' : 'light_mode'}
                </span>
              </div>
              <div>
                <p className="font-label-lg text-on-surface">{t.displayMode}</p>
                <p className="font-body-sm text-on-surface-variant">
                  {darkMode ? t.displayModeDarkSub : t.displayModeLightSub}
                </p>
              </div>
            </div>
            <span className="font-label-md text-primary font-medium bg-surface-container-low px-2.5 py-1 rounded-full">
              {darkMode
                ? translations[lang].header.darkMode
                : translations[lang].header.lightMode}
            </span>
          </div>

          {/* Language Toggle Row */}
          {onToggleLanguage && (
            <div
              onClick={onToggleLanguage}
              className="flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">
                    translate
                  </span>
                </div>
                <div>
                  <p className="font-label-lg text-on-surface">
                    {lang === 'es' ? 'Idioma de la plataforma' : 'Platform Language'}
                  </p>
                  <p className="font-body-sm text-on-surface-variant">
                    {lang === 'es' ? 'Español (Clic para cambiar a Inglés)' : 'English (Click to switch to Spanish)'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLanguage();
                }}
                className="h-8 px-3 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-2xs hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">translate</span>
                <span>{lang.toUpperCase()} ⇄ {lang === 'es' ? 'EN' : 'ES'}</span>
              </button>
            </div>
          )}

          {/* PWA App Install Control */}
          <div className="pt-1">
            <PWAInstallButton lang={lang} variant="menu" />
          </div>
        </div>
      </section>

      {/* Privacidad y Seguridad */}
      <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md">
        <div className="flex items-center justify-between">
          <span className="font-title-md text-on-surface font-semibold">
            {t.privacySecurity}
          </span>
          <span className="material-symbols-outlined text-primary text-[20px]">
            security
          </span>
        </div>

        <div className="space-y-space-sm">
          <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low/70">
            <div className="flex items-center gap-space-sm pr-2">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  visibility_off
                </span>
              </div>
              <div>
                <p className="font-label-lg text-on-surface">{t.anonMode}</p>
                <p className="font-body-sm text-on-surface-variant">
                  {t.anonModeSub}
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={anonMode}
              onClick={() => setAnonMode(!anonMode)}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors relative flex items-center shrink-0 cursor-pointer ${
                anonMode ? 'bg-primary' : 'bg-outline-variant'
              }`}
            >
              <span
                className={`w-5 h-5 bg-surface-container-lowest rounded-full transition-transform shadow-sm ${
                  anonMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></span>
            </button>
          </div>

          <div className="flex items-center justify-between p-space-sm rounded-lg">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-9 h-9 rounded-full bg-tertiary-fixed/50 text-tertiary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  verified
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-label-lg text-on-surface truncate">
                  {t.encryption}
                </p>
                <p className="font-body-sm text-on-surface-variant">
                  {t.encryptionSub}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-tertiary/10 text-tertiary px-2.5 py-1 rounded-full shrink-0">
              <span className="material-symbols-outlined text-[14px]">
                lock
              </span>
              <span className="font-label-sm font-semibold">
                {t.verifiedBadge}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onShowToast(
                'Protocolo ético escolar Ley 1581 de Protección de Datos'
              )
            }
            className="w-full flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container-low transition-colors text-on-surface group text-left cursor-pointer"
          >
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  description
                </span>
              </div>
              <div>
                <p className="font-label-lg group-hover:text-primary transition-colors">
                  {t.policy}
                </p>
                <p className="font-body-sm text-on-surface-variant">
                  {t.policySub}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">
              open_in_new
            </span>
          </button>
        </div>
      </section>

      {/* Cerrar sesión & Eliminar cuenta */}
      <div className="pt-space-xs space-y-space-sm">
        <button
          type="button"
          onClick={() => setConfirmModal('logout')}
          className="w-full h-11 px-5 flex items-center justify-center gap-2 rounded-xl bg-surface-container-low text-error hover:bg-error-container/40 active:scale-[0.98] transition-all font-label-lg font-bold cursor-pointer whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>{t.logoutBtn}</span>
        </button>

        <button
          type="button"
          onClick={() => setConfirmModal('delete')}
          className="w-full h-11 px-5 flex items-center justify-center gap-2 rounded-xl border border-error/40 bg-error-container/20 text-error hover:bg-error-container/50 active:scale-[0.98] transition-all font-label-lg font-bold cursor-pointer whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px]">
            delete_forever
          </span>
          <span>{t.deleteAccountBtn}</span>
        </button>

        <p className="text-center font-label-sm text-outline pt-1">
          {t.versionFooter}
        </p>
      </div>

      {/* Confirmation Modals for Logout and Account Deletion */}
      {confirmModal !== 'none' && (
        <div
          onClick={() => setConfirmModal('none')}
          className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 shadow-2xl flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-error-container text-error flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">
                  {confirmModal === 'logout' ? 'logout' : 'warning'}
                </span>
              </div>
              <h3 className="font-title-lg text-on-surface font-bold">
                {confirmModal === 'logout'
                  ? t.logoutConfirmTitle
                  : t.deleteConfirmTitle}
              </h3>
            </div>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              {confirmModal === 'logout'
                ? t.logoutConfirmDesc
                : t.deleteConfirmDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal('none')}
                className="flex-1 h-11 px-5 rounded-xl bg-surface-container text-on-surface font-label-lg font-bold hover:bg-surface-container-high active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  const action = confirmModal;
                  setConfirmModal('none');
                  if (action === 'logout') {
                    onLogout();
                  } else {
                    onDeleteAccount();
                  }
                }}
                className="flex-1 h-11 px-5 rounded-xl bg-error text-on-error font-label-lg font-bold shadow-sm hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                {confirmModal === 'logout'
                  ? t.confirmLogoutBtn
                  : t.confirmDeleteBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface DeleteReceiptProps {
  lang: Language;
  deletedEmail: string;
  deletedName: string;
  onNavigate: (screen: string) => void;
  onRestoreDemoAccount: () => void;
  onShowToast: (msg: string) => void;
}

export const AccountDeletionReceiptScreen: React.FC<DeleteReceiptProps> = ({
  lang,
  deletedEmail,
  deletedName,
  onNavigate,
  onRestoreDemoAccount,
  onShowToast,
}) => {
  const t = translations[lang].deleteReceipt;
  const nowStr = new Date().toLocaleString(lang === 'es' ? 'es-CO' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const confidentialIdStr = deletedEmail
    ? '#' +
      (
        Math.abs(
          deletedEmail
            .split('')
            .reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
        ) %
          9000 +
        1000
      ).toString() +
      '-EST'
    : '#0000-EST';

  const handleDownloadReceipt = () => {
    const content = [
      '====================================================',
      '       EXPRESA TE — COMPROBANTE OFICIAL DE BAJA     ',
      '====================================================',
      `Folio de eliminación: #BAJA-9042-ET`,
      `Estado: ${t.statusDeleted.toUpperCase()} DEFINITIVAMENTE`,
      `Fecha y hora: ${nowStr}`,
      `Cuenta eliminada: ${deletedEmail} (${deletedName})`,
      `ID confidencial: ${confidentialIdStr}`,
      `Datos borrados: ${t.dataWipedValue}`,
      `Estado en directorio: ${t.protocolValue}`,
      '----------------------------------------------------',
      t.reassurance,
      '====================================================',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Comprobante_Eliminacion_Cuenta_ExpresaTe_ET9042.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast(t.downloadedToast);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto items-center text-center py-8 space-y-6 animate-fade-in">
      {/* Seal / Badge */}
      <div className="relative flex items-center justify-center pt-space-xs">
        <div className="absolute w-28 h-28 bg-error/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="relative w-20 h-20 bg-surface-container-lowest rounded-full shadow-lg flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-error to-primary-container flex items-center justify-center text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-[32px]">
              receipt_long
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-tertiary-fixed text-on-tertiary-fixed p-1.5 rounded-full shadow-md flex items-center justify-center">
            <span className="material-symbols-outlined text-[15px]">
              verified
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="space-y-space-xs px-space-sm">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low text-primary rounded-md font-label-sm font-semibold tracking-wide uppercase">
          <span className="material-symbols-outlined text-[14px]">
            verified_user
          </span>
          {t.badge}
        </span>
        <h1 className="font-headline-lg-mobile text-on-surface font-bold tracking-tight">
          {t.title}
        </h1>
        <p className="font-body-md text-on-surface-variant leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Detailed Receipt Card */}
      <div className="w-full bg-surface-container-lowest rounded-xl p-space-lg shadow-md text-left space-y-space-md border border-outline-variant/30">
        <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/25">
          <div className="flex flex-col">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              {t.folioLabel}
            </span>
            <span className="font-title-md text-primary font-mono tracking-tight font-bold">
              #BAJA-9042-ET
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-error-container text-on-error-container rounded-md">
            <span className="w-2 h-2 rounded-full bg-error"></span>
            <span className="font-label-sm font-semibold">
              {t.statusDeleted}
            </span>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-lg p-space-md space-y-space-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 font-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-primary">
                event_busy
              </span>
              {t.dateLabel}
            </span>
            <span className="font-label-md text-on-surface font-medium text-right">
              {nowStr}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 font-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-primary">
                alternate_email
              </span>
              {t.accountLabel}
            </span>
            <span className="font-label-md text-on-surface font-medium truncate max-w-[180px]">
              {deletedEmail}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 font-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-primary">
                badge
              </span>
              {t.idLabel}
            </span>
            <span className="font-label-md text-on-surface font-mono font-semibold">
              {confidentialIdStr}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 font-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-primary">
                delete_sweep
              </span>
              {t.dataWipedLabel}
            </span>
            <span className="font-label-md text-tertiary font-semibold text-right">
              {t.dataWipedValue}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 font-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-primary">
                gpp_maybe
              </span>
              {t.protocolLabel}
            </span>
            <span className="font-label-md text-error font-semibold text-right">
              {t.protocolValue}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-space-sm bg-surface-container/60 rounded-lg">
          <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">
            shield_lock
          </span>
          <p className="font-body-sm text-on-surface-variant leading-snug">
            {t.reassurance}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col gap-space-sm pt-space-xs">
        <button
          type="button"
          onClick={handleDownloadReceipt}
          className="w-full h-11 px-5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg font-bold shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px]">
            download
          </span>
          <span>{t.downloadBtn}</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="w-full h-11 px-5 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-label-lg font-bold hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[18px]">login</span>
          <span>{t.testLoginUnregisteredBtn}</span>
        </button>

        <button
          type="button"
          onClick={onRestoreDemoAccount}
          className="w-full h-11 px-5 rounded-xl bg-surface-container-low text-primary font-label-md font-semibold hover:bg-surface-container transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[18px]">
            restore
          </span>
          <span>{t.restoreDemoBtn}</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('inicio')}
          className="w-full h-10 px-4 rounded-xl text-on-surface-variant font-label-md hover:text-on-surface transition-all flex items-center justify-center cursor-pointer whitespace-nowrap"
        >
          {t.backHomeBtn}
        </button>
      </div>
    </div>
  );
};
