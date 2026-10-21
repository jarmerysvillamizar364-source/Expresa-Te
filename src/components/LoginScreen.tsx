import React, { useState } from 'react';
import { ASSETS, Language, translations } from '../data/translations';
import { authService } from '../services/authService';
import { validateAnyEmail } from '../utils/institutionalValidator';
import {
  STUDENTS_CENSUS,
  ADMINISTRATIVE_CENSUS,
  StudentCensusRecord,
  AdministrativeCensusRecord,
  CensusRecord,
} from '../data/institutionalCensus';

export interface LoginScreenProps {
  lang: Language;
  accountDeleted: boolean;
  onLoginSuccess: (
    email: string,
    isVerified?: boolean,
    name?: string,
    grade?: string,
    role?: string,
    perfil?: string
  ) => void;
  onNavigate: (screen: string) => void;
  onShowToast: (msg: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  lang,
  accountDeleted,
  onLoginSuccess,
  onShowToast,
}) => {
  const t = translations[lang].login;

  // Active view: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state: starts strictly blank
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Registration state
  const [regRole, setRegRole] = useState<'estudiante' | 'administrativo'>('estudiante');
  const [regDoc, setRegDoc] = useState('');
  const [docValidated, setDocValidated] = useState(false);
  const [censusRecord, setCensusRecord] = useState<CensusRecord | null>(null);
  const [docFeedback, setDocFeedback] = useState<{
    status: 'idle' | 'success' | 'not_found' | 'already_registered';
    message: string;
  }>({ status: 'idle', message: '' });

  // Registration fields: starts strictly blank, allows ANY email provider
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  // Census records inspection modal
  const [showCensusModal, setShowCensusModal] = useState(false);
  const [censusTab, setCensusTab] = useState<'estudiantes' | 'administrativos'>('estudiantes');

  // --------------------------------------------------------------------------
  // DOCUMENT LOOKUP IN PRE-LOADED CENSUS DATABASE
  // --------------------------------------------------------------------------
  const handleVerifyDocument = (docToVerify?: string) => {
    const docQuery = (docToVerify !== undefined ? docToVerify : regDoc).trim();
    setRegError(null);

    if (!docQuery) {
      setDocFeedback({
        status: 'not_found',
        message: lang === 'es' ? 'Por favor ingresa un número de documento.' : 'Please enter an ID document number.',
      });
      setDocValidated(false);
      setCensusRecord(null);
      return;
    }

    const check = authService.verifyCensusDocument(docQuery, regRole);

    if (!check.found || !check.record) {
      setDocFeedback({
        status: 'not_found',
        message:
          lang === 'es'
            ? `El documento ${docQuery} no figura en la base de datos de ${
                regRole === 'estudiante' ? 'estudiantes' : 'personal administrativo'
              }. Verifica el número o consulta el censo escolar.`
            : `ID ${docQuery} was not found in the ${
                regRole === 'estudiante' ? 'student' : 'staff'
              } database.`,
      });
      setDocValidated(false);
      setCensusRecord(null);
    } else if (check.alreadyRegistered) {
      setDocFeedback({
        status: 'already_registered',
        message: check.message,
      });
      setDocValidated(false);
      setCensusRecord(check.record);
    } else {
      setDocFeedback({
        status: 'success',
        message:
          lang === 'es'
            ? '✓ Documento validado en la base de datos oficial. Completa tu correo y contraseña.'
            : '✓ ID verified in official database. Complete your email and password.',
      });
      setDocValidated(true);
      setCensusRecord(check.record);
    }
  };

  const handleSelectFromCensus = (record: CensusRecord) => {
    setRegRole(record.rol);
    setRegDoc(record.documento);
    setShowCensusModal(false);
    handleVerifyDocument(record.documento);
  };

  // --------------------------------------------------------------------------
  // LOGIN SUBMIT
  // --------------------------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLogin(true);
    setLoginError(null);

    try {
      const res = await authService.login(identifier, password, accountDeleted, lang);
      if (res.success && res.data) {
        onShowToast(res.message || t.successLogin);
        onLoginSuccess(
          res.data.user.email,
          res.data.user.isVerified,
          res.data.user.name,
          res.data.user.grade,
          res.data.user.role,
          res.data.user.perfil
        );
      } else {
        setLoginError(res.message || t.errorUnregistered);
      }
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // --------------------------------------------------------------------------
  // REGISTRATION SUBMIT
  // --------------------------------------------------------------------------
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!docValidated || !censusRecord) {
      setRegError(
        lang === 'es'
          ? 'Debes ingresar y validar primero un número de documento que figure en el censo escolar.'
          : 'You must first verify an ID number registered in the school census.'
      );
      return;
    }

    // Accepts ANY valid standard email provider (Gmail, Hotmail, Outlook, Yahoo, etc.)
    const emailValidation = validateAnyEmail(regEmail, lang);
    if (!emailValidation.isValid) {
      setRegError(emailValidation.error || 'Correo electrónico inválido.');
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setRegError(
        lang === 'es'
          ? 'La contraseña debe tener al menos 6 caracteres.'
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError(
        lang === 'es' ? 'Las contraseñas no coinciden.' : 'Passwords do not match.'
      );
      return;
    }

    setIsSubmittingReg(true);
    try {
      const res = await authService.registerWithCensus({
        documento: regDoc,
        email: emailValidation.normalizedEmail,
        password: regPassword,
        lang,
      });

      if (res.success && res.data) {
        onShowToast(res.message);
        onLoginSuccess(
          res.data.user.email,
          res.data.user.isVerified,
          res.data.user.name,
          res.data.user.grade,
          res.data.user.role,
          res.data.user.perfil
        );
      } else {
        setRegError(res.message || 'Error al completar el registro.');
      }
    } finally {
      setIsSubmittingReg(false);
    }
  };

  const studentRec = censusRecord && censusRecord.rol === 'estudiante' ? (censusRecord as StudentCensusRecord) : null;
  const adminRec = censusRecord && censusRecord.rol === 'administrativo' ? (censusRecord as AdministrativeCensusRecord) : null;

  return (
    <div className="flex flex-col items-center justify-center w-full py-6 sm:py-10 animate-fade-in">
      <div className="w-full max-w-xl bg-surface-container-lowest rounded-3xl p-6 sm:p-10 border border-outline-variant/30 shadow-2xl flex flex-col items-center relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-primary-fixed/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Anchor */}
        <div className="w-full flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-sm p-2 flex items-center justify-center border border-outline-variant/30 mb-4">
            <img
              alt="Expresa Te Logo"
              className="w-full h-full object-contain"
              src={ASSETS.loginEmblem}
            />
          </div>
          <h1 className="font-headline-lg font-bold text-on-surface tracking-tight">
            Expresa Te
          </h1>
          <p className="font-body-md text-on-surface-variant mt-1 max-w-md">
            {t.subtitle}
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-primary font-label-sm font-semibold border border-outline-variant/30 mt-3 shadow-2xs">
            <span className="material-symbols-outlined text-[16px] text-tertiary">
              lock
            </span>
            <span>{t.badge}</span>
          </div>
        </div>

        {/* Tab Switcher: Iniciar Sesión / Crear Cuenta */}
        <div className="w-full grid grid-cols-2 p-1.5 bg-surface-container-low rounded-2xl mb-6 border border-outline-variant/30">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setLoginError(null);
            }}
            className={`py-2.5 rounded-xl font-label-lg font-bold transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.tabLogin}
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setRegError(null);
            }}
            className={`py-2.5 rounded-xl font-label-lg font-bold transition-all cursor-pointer ${
              authMode === 'register'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.tabRegister}
          </button>
        </div>

        {/* ================================================================== */}
        {/* VIEW 1: INICIAR SESIÓN */}
        {/* ================================================================== */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
            {loginError && (
              <div
                role="alert"
                className="p-4 rounded-2xl bg-error-container text-on-error-container flex items-start gap-3 shadow-xs border border-error/20"
              >
                <span className="material-symbols-outlined text-[22px] text-error shrink-0 mt-0.5">
                  error
                </span>
                <div className="flex flex-col text-left text-sm">
                  <span className="font-bold">Error de acceso</span>
                  <span className="mt-0.5">{loginError}</span>
                </div>
              </div>
            )}

            {/* Identifier: Correo o Documento */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-identifier" className="font-label-lg text-on-surface font-semibold text-left">
                {t.userLabel}
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                  badge
                </span>
                <input
                  id="login-identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder={t.userPlaceholder}
                  className="w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface rounded-xl font-body-md placeholder:text-outline-variant outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="font-label-lg text-on-surface font-semibold">
                  {t.pwdLabel}
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="font-label-md text-primary hover:underline cursor-pointer"
                >
                  {t.forgotPwd}
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                  lock
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder="••••••••"
                  className="w-full h-12 pl-11 pr-12 bg-surface-container-low text-on-surface rounded-xl font-body-md placeholder:text-outline-variant outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? t.hidePwd : t.showPwd}
                  className="absolute right-2.5 text-outline hover:text-primary p-2 rounded-lg cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label
                onClick={() => setRemember(!remember)}
                className="flex items-center gap-2.5 cursor-pointer select-none"
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors border ${
                    remember
                      ? 'bg-primary border-primary text-on-primary'
                      : 'bg-surface-container-low border-outline-variant text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px] font-bold">check</span>
                </div>
                <span className="font-body-sm text-on-surface-variant">{t.rememberDevice}</span>
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isSubmittingLogin}
              className="w-full h-12 rounded-xl bg-primary text-on-primary font-title-md font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary/95 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 mt-1"
            >
              <span>{isSubmittingLogin ? 'Verificando...' : t.submitBtn}</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

            {/* Link to Census Inspection Drawer for easy evaluation */}
            <div className="pt-2 flex flex-col items-center gap-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowCensusModal(true)}
                className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary font-semibold transition-colors cursor-pointer py-1"
              >
                <span className="material-symbols-outlined text-[16px] text-tertiary">
                  fact_check
                </span>
                <span>{t.viewCensusBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setRegError(null);
                }}
                className="font-label-md text-primary font-semibold hover:underline cursor-pointer"
              >
                {t.noAccountPrompt}
              </button>
            </div>
          </form>
        )}

        {/* ================================================================== */}
        {/* VIEW 2: REGISTRO CON BASE DE DATOS PREVIA (CENSO INSTITUCIONAL) */}
        {/* ================================================================== */}
        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="w-full flex flex-col gap-5">
            {/* Step 1: Role Selection */}
            <div className="flex flex-col gap-2">
              <label className="font-label-lg text-on-surface font-semibold text-left">
                {t.roleSelectorTitle}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRegRole('estudiante');
                    setDocValidated(false);
                    setCensusRecord(null);
                    setDocFeedback({ status: 'idle', message: '' });
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    regRole === 'estudiante'
                      ? 'border-primary bg-primary-fixed/20 shadow-xs'
                      : 'border-outline-variant/30 bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-[20px] ${regRole === 'estudiante' ? 'text-primary' : 'text-on-surface-variant'}`}>
                      school
                    </span>
                    <span className="font-label-lg font-bold text-on-surface">
                      {t.roleStudent}
                    </span>
                  </div>
                  <span className="font-label-sm text-on-surface-variant line-clamp-1">
                    {t.roleStudentDesc}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRegRole('administrativo');
                    setDocValidated(false);
                    setCensusRecord(null);
                    setDocFeedback({ status: 'idle', message: '' });
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    regRole === 'administrativo'
                      ? 'border-primary bg-primary-fixed/20 shadow-xs'
                      : 'border-outline-variant/30 bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-[20px] ${regRole === 'administrativo' ? 'text-primary' : 'text-on-surface-variant'}`}>
                      psychology
                    </span>
                    <span className="font-label-lg font-bold text-on-surface">
                      {t.roleAdmin}
                    </span>
                  </div>
                  <span className="font-label-sm text-on-surface-variant line-clamp-1">
                    {t.roleAdminDesc}
                  </span>
                </button>
              </div>
            </div>

            {/* Step 2: Document Input & Validation */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="reg-doc" className="font-label-lg text-on-surface font-semibold text-left">
                  {t.docLabel}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setCensusTab(regRole === 'estudiante' ? 'estudiantes' : 'administrativos');
                    setShowCensusModal(true);
                  }}
                  className="font-label-sm text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">list_alt</span>
                  <span>Ver censo</span>
                </button>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1 flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                    id_card
                  </span>
                  <input
                    id="reg-doc"
                    type="text"
                    required
                    value={regDoc}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setRegDoc(val);
                      setDocValidated(false);
                      setCensusRecord(null);
                      setDocFeedback({ status: 'idle', message: '' });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleVerifyDocument();
                      }
                    }}
                    placeholder={
                      regRole === 'estudiante'
                        ? 'ej. 1001234001'
                        : 'ej. 5234567001 (Orientación) o 5234567003 (Psicología)'
                    }
                    className="w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface rounded-xl font-body-md placeholder:text-outline-variant outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/30 transition-all"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleVerifyDocument()}
                  className="px-4 h-12 rounded-xl bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface font-label-md font-bold transition-all shrink-0 cursor-pointer border border-outline-variant/30 active:scale-95 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  <span>{t.docSearchBtn}</span>
                </button>
              </div>

              {/* Feedback Banner for Document Search */}
              {docFeedback.status === 'not_found' && (
                <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs flex items-start gap-2 border border-error/20">
                  <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">warning</span>
                  <span>{docFeedback.message}</span>
                </div>
              )}

              {docFeedback.status === 'already_registered' && (
                <div className="p-3 rounded-xl bg-secondary-fixed/50 text-secondary text-xs flex items-center justify-between gap-2 border border-secondary/20">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] shrink-0">info</span>
                    <span>{docFeedback.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setIdentifier(regDoc);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-secondary text-on-secondary font-bold text-xs shrink-0 cursor-pointer"
                  >
                    Iniciar Sesión
                  </button>
                </div>
              )}
            </div>

            {/* Step 3: Official Census Auto-populated Information Card (Read-only) */}
            {docValidated && censusRecord && (
              <div className="p-4 rounded-2xl bg-primary-fixed/20 border border-primary/30 flex flex-col gap-2.5 text-left animate-fade-in shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>{t.docValidatedBadge}</span>
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/70 text-on-surface-variant border border-outline-variant/20">
                    Doc: {censusRecord.documento}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-on-surface-variant font-semibold block">{t.nameLabel}:</span>
                    <span className="font-bold text-sm text-on-surface">{censusRecord.nombreCompleto}</span>
                  </div>

                  {studentRec && (
                    <>
                      <div>
                        <span className="text-on-surface-variant font-semibold block">{t.gradeLabel}:</span>
                        <span className="font-bold text-sm text-on-surface">{studentRec.grado}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-on-surface-variant font-semibold block">{t.campusLabel}:</span>
                        <span className="text-on-surface">{studentRec.sede} • Jornada {studentRec.jornada}</span>
                      </div>
                    </>
                  )}

                  {adminRec && (
                    <>
                      <div>
                        <span className="text-on-surface-variant font-semibold block">{t.roleLabel}:</span>
                        <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md text-xs ${
                          adminRec.perfil === 'Psicología'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}>
                          {adminRec.perfil}
                        </span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-on-surface-variant font-semibold block">{t.positionLabel}:</span>
                        <span className="font-medium text-on-surface">{adminRec.cargo} ({adminRec.sede})</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Fields at user's discretion (Starts BLANK, accepts ANY email domain) */}
            {docValidated && (
              <div className="flex flex-col gap-4 animate-fade-in pt-1">
                {regError && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-error-container text-on-error-container flex items-start gap-2.5 text-xs border border-error/20"
                  >
                    <span className="material-symbols-outlined text-[18px] text-error shrink-0">error</span>
                    <span>{regError}</span>
                  </div>
                )}

                {/* Email (any provider allowed) */}
                <div className="flex flex-col gap-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label htmlFor="reg-email" className="font-label-lg text-on-surface font-semibold">
                      {t.emailLabel}
                    </label>
                    <span className="text-[11px] text-tertiary font-semibold">
                      Cualquier correo válido
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                      alternate_email
                    </span>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => {
                        setRegEmail(e.target.value);
                        if (regError) setRegError(null);
                      }}
                      placeholder={t.emailPlaceholder}
                      className="w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface rounded-xl font-body-md placeholder:text-outline-variant outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/30 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-on-surface-variant px-1">
                    {t.emailHint}
                  </p>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="reg-password" className="font-label-lg text-on-surface font-semibold">
                    {t.pwdLabel}
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                      lock
                    </span>
                    <input
                      id="reg-password"
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => {
                        setRegPassword(e.target.value);
                        if (regError) setRegError(null);
                      }}
                      placeholder={t.pwdNewPlaceholder}
                      className="w-full h-12 pl-11 pr-12 bg-surface-container-low text-on-surface rounded-xl font-body-md placeholder:text-outline-variant outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      aria-label="Toggle password visibility"
                      className="absolute right-2.5 text-outline hover:text-primary p-2 rounded-lg cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showRegPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="reg-confirm-password" className="font-label-lg text-on-surface font-semibold">
                    {t.confirmPwdLabel}
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                      lock_reset
                    </span>
                    <input
                      id="reg-confirm-password"
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => {
                        setRegConfirmPassword(e.target.value);
                        if (regError) setRegError(null);
                      }}
                      placeholder={t.confirmPwdPlaceholder}
                      className="w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface rounded-xl font-body-md placeholder:text-outline-variant outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/30 transition-all"
                    />
                  </div>
                </div>

                {/* Submit Register */}
                <button
                  type="submit"
                  disabled={isSubmittingReg}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 mt-2"
                >
                  <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                  <span>{isSubmittingReg ? 'Creando cuenta...' : t.registerBtn}</span>
                </button>
              </div>
            )}

            {!docValidated && (
              <div className="p-4 rounded-xl bg-surface-container-low text-on-surface-variant text-xs text-center border border-outline-variant/20">
                <p>
                  Coloca tu número de documento de identidad y presiona <strong>&quot;Buscar en censo&quot;</strong> para traer tus datos institucionales oficiales y habilitar la creación de tu cuenta.
                </p>
              </div>
            )}

            <div className="text-center pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setLoginError(null);
                }}
                className="font-label-md text-primary font-semibold hover:underline cursor-pointer"
              >
                {t.alreadyHaveAccountPrompt}
              </button>
            </div>
          </form>
        )}

        {/* Crisis Hotline Footer in Login Card */}
        <div
          onClick={() =>
            onShowToast(
              lang === 'es'
                ? 'Línea 106 de atención y contención emocional disponible 24/7'
                : 'Line 106 emotional support available 24/7'
            )
          }
          className="mt-8 w-full bg-surface-container-low rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs cursor-pointer hover:bg-surface-container transition-colors border border-outline-variant/20"
        >
          <div className="flex items-center gap-2.5 min-w-0 text-left">
            <div className="w-8 h-8 rounded-xl bg-secondary-fixed/50 flex items-center justify-center shrink-0 text-secondary">
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
            </div>
            <div className="min-w-0">
              <p className="font-label-md text-on-surface font-semibold truncate leading-tight">
                {t.helpTitle}
              </p>
              <p className="text-[11px] text-on-surface-variant truncate">
                {t.helpSub}
              </p>
            </div>
          </div>
          <span className="font-label-sm font-bold text-secondary bg-secondary-fixed/40 px-2.5 py-0.5 rounded-full shrink-0">
            106 (24/7)
          </span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MODAL: CENSO INSTITUCIONAL PREVIO (15 Estudiantes y 3 Administrativos) */}
      {/* ==================================================================== */}
      {showCensusModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowCensusModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[85vh] bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-outline-variant/30 flex flex-col gap-4 overflow-hidden"
          >
            <div className="flex items-start justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">database</span>
                </div>
                <div className="flex flex-col text-left">
                  <h3 className="font-title-lg font-bold text-on-surface">
                    {t.censusModalTitle}
                  </h3>
                  <p className="font-body-sm text-on-surface-variant">
                    {t.censusModalDesc}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCensusModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Tabs: 15 Estudiantes vs 3 Administrativos */}
            <div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-xl border border-outline-variant/30">
              <button
                type="button"
                onClick={() => setCensusTab('estudiantes')}
                className={`py-2 rounded-lg font-label-md font-bold transition-all cursor-pointer ${
                  censusTab === 'estudiantes'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Estudiantes ({STUDENTS_CENSUS.length} registros)
              </button>
              <button
                type="button"
                onClick={() => setCensusTab('administrativos')}
                className={`py-2 rounded-lg font-label-md font-bold transition-all cursor-pointer ${
                  censusTab === 'administrativos'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Administrativos ({ADMINISTRATIVE_CENSUS.length} registros: 2 Orientación, 1 Psicología)
              </button>
            </div>

            {/* List of Records */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {censusTab === 'estudiantes' ? (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-primary px-1">
                    15 Estudiantes registrados para validación por documento:
                  </div>
                  {STUDENTS_CENSUS.map((st, idx) => (
                    <div
                      key={st.documento}
                      className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-on-surface truncate">
                            {st.nombreCompleto}
                          </div>
                          <div className="text-xs text-on-surface-variant">
                            Doc: <span className="font-mono font-semibold text-primary">{st.documento}</span> • {st.grado} • {st.sede}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectFromCensus(st)}
                        className="w-full sm:w-auto px-3 py-2 sm:py-1.5 rounded-lg bg-primary text-on-primary font-label-sm font-semibold hover:bg-primary/90 transition-all cursor-pointer shrink-0 shadow-2xs text-center"
                      >
                        Usar documento
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-primary px-1">
                    3 Perfiles Administrativos (2 Orientación y 1 Psicología):
                  </div>
                  {ADMINISTRATIVE_CENSUS.map((adm, idx) => (
                    <div
                      key={adm.documento}
                      className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-secondary/10 text-secondary text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-on-surface truncate">
                              {adm.nombreCompleto}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              adm.perfil === 'Psicología'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-teal-100 text-teal-800'
                            }`}>
                              {adm.perfil}
                            </span>
                          </div>
                          <div className="text-xs text-on-surface-variant mt-0.5">
                            Doc: <span className="font-mono font-semibold text-primary">{adm.documento}</span> • {adm.cargo}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectFromCensus(adm)}
                        className="w-full sm:w-auto px-3 py-2 sm:py-1.5 rounded-lg bg-secondary text-on-secondary font-label-sm font-semibold hover:bg-secondary/90 transition-all cursor-pointer shrink-0 shadow-2xs text-center"
                      >
                        Usar documento
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-outline-variant/20 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCensusModal(false)}
                className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-label-md font-semibold cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowForgotModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-outline-variant/30 flex flex-col gap-4 text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-secondary-fixed/50 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">lock_reset</span>
            </div>
            <div>
              <h3 className="font-title-lg font-bold text-on-surface">
                Recuperación de Acceso
              </h3>
              <p className="font-body-sm text-on-surface-variant mt-1 leading-relaxed">
                Por motivos de seguridad institucional y protección de menores, puedes restablecer tus credenciales o recuperar tu cuenta acercándote al Departamento de Orientación y Psicología Escolar o validando nuevamente tu documento de identidad en el censo.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-surface-container-low text-xs text-on-surface-variant space-y-1 border border-outline-variant/20">
              <div className="font-bold text-on-surface">Horario de atención institucional:</div>
              <div>Lunes a Viernes de 7:00 AM a 4:00 PM • Consultorio de Bienestar</div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md font-bold cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
