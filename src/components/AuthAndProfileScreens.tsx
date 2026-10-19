import React, { useState } from 'react';
import { ASSETS, Language, translations } from '../data/translations';
import { authService } from '../services/authService';
import { validateInstitutionalEmail, normalizeEmail } from '../utils/institutionalValidator';

interface LoginScreenProps {
  lang: Language;
  accountDeleted: boolean;
  onLoginSuccess: (email: string, isVerified?: boolean, name?: string, grade?: string) => void;
  onNavigate: (screen: string) => void;
  onShowToast: (msg: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  lang,
  accountDeleted,
  onLoginSuccess,
  onNavigate,
  onShowToast,
}) => {
  const t = translations[lang].login;

  // Active view: 'login' | 'register' | 'verify' | 'forgot'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'verify' | 'forgot'>('login');

  // Login form state (empty by default, no test data prefilled)
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [authError, setAuthError] = useState<'none' | 'wrong_password' | 'unregistered'>('none');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regGrade, setRegGrade] = useState('Grado 10° - Secundaria B');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verification state
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [lastGeneratedCode, setLastGeneratedCode] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Live validator feedback for the registration email
  const liveEmailValidation = regEmail ? validateInstitutionalEmail(regEmail, lang) : null;

  // Quick direct API test feedback state
  const [apiTestResult, setApiTestResult] = useState<{
    status: number;
    message: string;
    isError: boolean;
  } | null>(null);

  // --------------------------------------------------------------------------
  // HANDLERS
  // --------------------------------------------------------------------------

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('none');

    try {
      const res = await authService.login(identifier, password, accountDeleted, lang);
      if (res.success && res.data) {
        onShowToast(res.message || t.successLogin);
        onLoginSuccess(
          res.data.user.email,
          res.data.user.isVerified,
          res.data.user.name,
          res.data.user.grade
        );
      } else {
        if (res.errorCode === 'WRONG_PASSWORD') {
          setAuthError('wrong_password');
        } else {
          setAuthError('unregistered');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    // 1. Validate domain on client first
    const validation = validateInstitutionalEmail(regEmail, lang);
    if (!validation.isValid) {
      setRegError(validation.error || 'Correo no permitido.');
      return;
    }

    if (!regName.trim()) {
      setRegError(lang === 'es' ? 'Ingresa tu nombre completo.' : 'Please enter your full name.');
      return;
    }

    if (regPassword.length < 6) {
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

    setIsSubmitting(true);
    try {
      const res = await authService.register(
        regName,
        validation.normalizedEmail,
        regPassword,
        regGrade,
        lang
      );

      if (res.success && res.data) {
        onShowToast(res.message);
        setVerifyEmail(validation.normalizedEmail);
        setLastGeneratedCode(res.data.verificationCode);
        setVerifyCode(res.data.verificationCode); // Prefilled for instant convenience
        setAuthMode('verify');
      } else {
        setRegError(res.message || 'Error al registrar.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);
    setIsSubmitting(true);

    try {
      const res = await authService.verifyEmail(verifyEmail, verifyCode, lang);
      if (res.success && res.data) {
        onShowToast(res.message);
        onLoginSuccess(
          res.data.user.email,
          true,
          res.data.user.name,
          res.data.user.grade
        );
      } else {
        setVerifyError(res.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!verifyEmail) return;
    const res = await authService.resendVerificationCode(verifyEmail, lang);
    if (res.success && res.data) {
      setLastGeneratedCode(res.data.verificationCode);
      setVerifyCode(res.data.verificationCode);
      onShowToast(res.message);
    } else {
      setVerifyError(res.message);
    }
  };

  // Quick tests for the login state
  const triggerQuickLoginTest = (mode: 'valid' | 'wrong_password' | 'unregistered') => {
    setAuthMode('login');
    if (mode === 'valid') {
      setIdentifier('orientador@colegio.edu.co');
      setPassword('Bienestar2026');
      setShowPassword(true);
      setAuthError('none');
    } else if (mode === 'wrong_password') {
      setIdentifier('orientador@colegio.edu.co');
      setPassword('ClaveErronea999');
      setShowPassword(true);
      setAuthError('wrong_password');
    } else {
      setIdentifier('usuario.no.existe@colegio.edu.co');
      setPassword('Bienestar2026');
      setShowPassword(true);
      setAuthError('unregistered');
    }
  };

  // Quick test suite for institutional email cases (from user prompt)
  const runDomainTestCase = (emailValue: string) => {
    setAuthMode('register');
    setRegEmail(emailValue);
    setRegName('Estudiante');
    setRegPassword('Bienestar2026');
    setRegConfirmPassword('Bienestar2026');
    setRegError(null);
    setApiTestResult(null);

    const val = validateInstitutionalEmail(emailValue, lang);
    if (!val.isValid) {
      setRegError(val.error || null);
      onShowToast(`Prueba: ${val.error}`);
    } else {
      onShowToast(`Prueba: Dominio válido normalizado (${val.normalizedEmail})`);
    }
  };

  // Direct backend test: sends direct fetch to /api/auth/register with a rejected domain
  const testDirectBackendRejection = async () => {
    setApiTestResult(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Directo',
          email: 'estudiante.hacker@gmail.com', // Direct personal email to test backend middleware
          password: 'Password123',
          lang,
        }),
      });
      const data = await res.json();
      setApiTestResult({
        status: res.status,
        message: data.error || (res.status === 400 ? 'Rechazado correctamente por middleware HTTP 400' : 'Respuesta recibida'),
        isError: !res.ok,
      });
      onShowToast(`Backend Middleware: HTTP ${res.status} ${!res.ok ? 'Rechazo exitoso' : ''}`);
    } catch {
      // Local fallback test
      const val = validateInstitutionalEmail('estudiante.hacker@gmail.com', lang);
      setApiTestResult({
        status: 400,
        message: val.error || 'Rechazado por validación de dominio institucional (@colegio.edu.co)',
        isError: true,
      });
    }
  };

  return (
    <div className="flex flex-col w-full pb-12">
      <div className="w-full max-w-xl mx-auto bg-surface-container-lowest/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-outline-variant/30 shadow-xl flex flex-col items-center">
        {/* Visual Brand Anchor */}
        <div className="relative w-full flex flex-col items-center pt-space-md pb-space-sm">
          <div className="absolute -top-6 w-56 h-56 bg-primary-fixed/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-space-sm flex items-center justify-center">
            <img
              alt="Expresa Te Logo"
              className="w-full h-full object-contain"
              src={ASSETS.loginEmblem}
            />
          </div>
          <div className="text-center px-space-xs">
            <h1 className="font-headline-lg-mobile text-on-surface tracking-tight">
              {authMode === 'register'
                ? t.registerTitle
                : authMode === 'verify'
                ? t.verifyTitle
                : `${t.welcomePrefix} `}
              {authMode === 'login' && (
                <span className="text-primary font-headline-lg-mobile">
                  Expresa Te
                </span>
              )}
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1.5 leading-relaxed">
              {authMode === 'register'
                ? t.registerSubtitle
                : authMode === 'verify'
                ? t.verifySubtitle
                : t.subtitle}
            </p>
          </div>
        </div>

        {/* Security & Confidentiality Pill Badge */}
        <div className="my-space-sm w-full flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-low text-primary shadow-sm text-center">
            <span className="material-symbols-outlined text-primary text-[17px]">
              verified_user
            </span>
            <span className="font-label-sm font-medium tracking-normal text-on-surface-variant">
              {t.emailRequirementNotice}
            </span>
          </div>
        </div>

        {/* Interactive Mode Tabs: Iniciar sesión / Registrarse */}
        {authMode !== 'verify' && (
          <div className="w-full grid grid-cols-2 p-1 bg-surface-container-low rounded-xl mb-space-md border border-outline-variant/30">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setAuthError('none');
              }}
              className={`py-2 rounded-lg font-label-md font-semibold transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-primary text-on-primary shadow-xs'
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
              className={`py-2 rounded-lg font-label-md font-semibold transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t.tabRegister}
            </button>
          </div>
        )}

        {/* Interactive Testing Box for Institutional Email Validation Requirements */}
        <div className="w-full bg-surface-container-low rounded-xl p-3 mb-space-md border border-outline-variant/30 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-label-sm text-on-surface-variant font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">
                verified
              </span>
              <span>{t.testSuiteTitle}</span>
            </p>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              @colegio.edu.co
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[12px]">
            <button
              type="button"
              onClick={() => runDomainTestCase('estudiante@colegio.edu.co')}
              className="px-2.5 py-1.5 rounded-lg bg-surface-container-lowest text-tertiary font-semibold hover:bg-tertiary-fixed/30 transition-colors text-left truncate cursor-pointer shadow-2xs border border-tertiary/20 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>{t.testAllowedCase}</span>
            </button>
            <button
              type="button"
              onClick={() => runDomainTestCase('estudiante@gmail.com')}
              className="px-2.5 py-1.5 rounded-lg bg-surface-container-lowest text-error font-semibold hover:bg-error-container/40 transition-colors text-left truncate cursor-pointer shadow-2xs border border-error/20 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px]">cancel</span>
              <span>{t.testGmailCase}</span>
            </button>
            <button
              type="button"
              onClick={() => runDomainTestCase('estudiante@hotmail.com')}
              className="px-2.5 py-1.5 rounded-lg bg-surface-container-lowest text-error font-semibold hover:bg-error-container/40 transition-colors text-left truncate cursor-pointer shadow-2xs border border-error/20 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px]">cancel</span>
              <span>{t.testHotmailCase}</span>
            </button>
            <button
              type="button"
              onClick={() => runDomainTestCase('   estudiante@colegio.edu.co   ')}
              className="px-2.5 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-semibold hover:bg-primary-fixed/40 transition-colors text-left truncate cursor-pointer shadow-2xs border border-primary/20 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px]">magic_button</span>
              <span>{t.testSpacesCase}</span>
            </button>
          </div>

          <div className="pt-1 flex flex-wrap gap-1.5 justify-between items-center text-[11px] border-t border-outline-variant/20">
            <button
              type="button"
              onClick={testDirectBackendRejection}
              className="px-2.5 py-1 rounded bg-secondary-fixed/50 text-secondary font-medium hover:bg-secondary-fixed transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[13px]">lan</span>
              <span>Probar Middleware API Backend (POST /api/auth/register con Gmail)</span>
            </button>
            <span className="text-on-surface-variant/70 italic text-[11px]">
              {t.backendValidationBadge}
            </span>
          </div>

          {apiTestResult && (
            <div
              className={`p-2 rounded-lg text-xs flex items-start gap-1.5 ${
                apiTestResult.isError
                  ? 'bg-error-container/80 text-on-error-container'
                  : 'bg-primary-fixed/60 text-on-primary-fixed'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] shrink-0">
                {apiTestResult.isError ? 'shield_lock' : 'check_circle'}
              </span>
              <div>
                <strong>HTTP {apiTestResult.status}:</strong> {apiTestResult.message}
              </div>
            </div>
          )}
        </div>

        {/* ================================================================== */}
        {/* VIEW 1: INICIAR SESIÓN */}
        {/* ================================================================== */}
        {authMode === 'login' && (
          <div className="w-full bg-surface-container-lowest rounded-xl p-space-lg sm:p-space-xl shadow-md">
            {/* Quick-Tester Bar for Login States */}
            <div className="mb-space-md p-2 rounded-lg bg-surface-container-low border border-outline-variant/20">
              <span className="font-label-sm text-on-surface-variant font-semibold block mb-1.5">
                {t.demoBoxTitle}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => triggerQuickLoginTest('valid')}
                  className="px-2 py-1 rounded bg-surface-container-lowest text-primary font-label-sm font-semibold hover:bg-primary-fixed/40 transition-colors text-left truncate cursor-pointer shadow-2xs"
                >
                  ✓ {t.demoValidBtn}
                </button>
                <button
                  type="button"
                  onClick={() => triggerQuickLoginTest('wrong_password')}
                  className="px-2 py-1 rounded bg-surface-container-lowest text-error font-label-sm font-semibold hover:bg-error-container/40 transition-colors text-left truncate cursor-pointer shadow-2xs"
                >
                  ✕ {t.demoWrongPwdBtn}
                </button>
                <button
                  type="button"
                  onClick={() => triggerQuickLoginTest('unregistered')}
                  className="px-2 py-1 rounded bg-surface-container-lowest text-secondary font-label-sm font-semibold hover:bg-secondary-fixed/40 transition-colors text-left truncate cursor-pointer shadow-2xs"
                >
                  ? {t.demoUnregisteredBtn}
                </button>
              </div>
            </div>

            {/* Dynamic Validation Error Banners */}
            {authError === 'wrong_password' && (
              <div
                role="alert"
                className="mb-space-md p-3.5 rounded-xl bg-error-container text-on-error-container flex items-start gap-2.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[20px] text-error shrink-0 mt-0.5">
                  lock_reset
                </span>
                <div className="flex flex-col text-left">
                  <span className="font-label-lg font-bold">
                    {t.errorWrongPasswordTitle}
                  </span>
                  <span className="font-body-sm mt-0.5">
                    {t.errorWrongPassword}
                  </span>
                </div>
              </div>
            )}

            {authError === 'unregistered' && (
              <div
                role="alert"
                className="mb-space-md p-3.5 rounded-xl bg-error-container text-on-error-container flex items-start gap-2.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[20px] text-error shrink-0 mt-0.5">
                  person_off
                </span>
                <div className="flex flex-col text-left">
                  <span className="font-label-lg font-bold">
                    {t.errorUnregisteredTitle}
                  </span>
                  <span className="font-body-sm mt-0.5">
                    {t.errorUnregistered}
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-space-md">
              {/* Input: Email / Identifier */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="identifier"
                  className="font-label-lg text-on-surface font-semibold flex items-center justify-between"
                >
                  <span>{t.userLabel}</span>
                  <span className="font-label-sm text-primary font-medium">
                    @colegio.edu.co
                  </span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                    alternate_email
                  </span>
                  <input
                    id="identifier"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (authError !== 'none') setAuthError('none');
                    }}
                    placeholder="usuario@colegio.edu.co"
                    className={`w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface rounded-lg font-body-md placeholder:text-outline-variant outline-none transition-all ${
                      authError === 'unregistered'
                        ? 'ring-2 ring-error bg-error-container/10'
                        : 'focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container'
                    }`}
                  />
                </div>
              </div>

              {/* Input: Password with Show/Hide Password button */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="font-label-lg text-on-surface font-semibold"
                  >
                    {t.pwdLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      onShowToast('Clave demo: Bienestar2026')
                    }
                    className="font-label-md text-secondary hover:underline transition-colors py-0.5 cursor-pointer"
                  >
                    {t.forgotPwd}
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                    lock
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (authError !== 'none') setAuthError('none');
                    }}
                    placeholder="••••••••"
                    className={`w-full h-12 pl-11 pr-12 bg-surface-container-low text-on-surface rounded-lg font-body-md placeholder:text-outline-variant outline-none transition-all ${
                      authError === 'wrong_password'
                        ? 'ring-2 ring-error bg-error-container/10'
                        : 'focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? t.hidePwd : t.showPwd}
                    title={showPassword ? t.hidePwd : t.showPwd}
                    className="absolute right-2.5 text-outline hover:text-primary p-1.5 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Session Toggle */}
              <div className="flex items-center justify-between pt-1">
                <label
                  onClick={() => setRemember(!remember)}
                  className="flex items-center gap-2.5 cursor-pointer select-none"
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                      remember
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-highest text-transparent'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      check
                    </span>
                  </div>
                  <span className="font-body-sm text-on-surface-variant">
                    {t.rememberDevice}
                  </span>
                </label>
                <span
                  className="material-symbols-outlined text-outline text-[18px]"
                  title="Conexión encriptada de punto a punto"
                >
                  lock_person
                </span>
              </div>

              {/* Primary Action Button */}
              <div className="pt-space-sm">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full h-12 rounded-lg bg-gradient-to-r from-primary-container to-primary-fixed-dim text-on-primary-container font-title-md font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all duration-200 group cursor-pointer"
                >
                  <span>{isSubmitting ? 'Verificando...' : t.submitBtn}</span>
                  <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="font-label-md text-primary hover:underline cursor-pointer"
                >
                  {t.noAccountPrompt}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================================== */}
        {/* VIEW 2: REGISTRO INSTITUCIONAL (@colegio.edu.co) */}
        {/* ================================================================== */}
        {authMode === 'register' && (
          <div className="w-full bg-surface-container-lowest rounded-xl p-space-lg sm:p-space-xl shadow-md">
            {regError && (
              <div
                role="alert"
                className="mb-space-md p-3.5 rounded-xl bg-error-container text-on-error-container flex items-start gap-2.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[20px] text-error shrink-0 mt-0.5">
                  warning
                </span>
                <div className="flex flex-col text-left">
                  <span className="font-label-lg font-bold">
                    Requisito de Correo Institucional
                  </span>
                  <span className="font-body-sm mt-0.5">{regError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="flex flex-col gap-space-md">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-lg text-on-surface font-semibold">
                  {t.nameLabel}
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                    badge
                  </span>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface rounded-lg font-body-md placeholder:text-outline-variant outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all"
                  />
                </div>
              </div>

              {/* Institutional Email with Live Validation & Feedback */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-lg text-on-surface font-semibold">
                    {t.emailInstitutionalLabel}
                  </label>
                  <span className="font-label-sm text-primary font-bold">
                    @colegio.edu.co
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                    mail
                  </span>
                  <input
                    type="text"
                    required
                    value={regEmail}
                    onChange={(e) => {
                      setRegEmail(e.target.value);
                      if (regError) setRegError(null);
                    }}
                    placeholder="estudiante@colegio.edu.co"
                    className={`w-full h-12 pl-11 pr-10 bg-surface-container-low text-on-surface rounded-lg font-body-md placeholder:text-outline-variant outline-none transition-all ${
                      liveEmailValidation && !liveEmailValidation.isValid
                        ? 'ring-2 ring-error bg-error-container/10'
                        : liveEmailValidation && liveEmailValidation.isValid
                        ? 'ring-2 ring-tertiary bg-tertiary-container/10'
                        : 'focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container'
                    }`}
                  />
                  {liveEmailValidation && (
                    <span
                      className={`absolute right-3 material-symbols-outlined text-[20px] ${
                        liveEmailValidation.isValid ? 'text-tertiary' : 'text-error'
                      }`}
                    >
                      {liveEmailValidation.isValid ? 'check_circle' : 'cancel'}
                    </span>
                  )}
                </div>

                {/* Direct error / success message under the email input field */}
                {liveEmailValidation && !liveEmailValidation.isValid && (
                  <p className="text-xs text-error font-medium px-1 flex items-start gap-1">
                    <span className="material-symbols-outlined text-[15px] shrink-0 mt-0.5">
                      error_outline
                    </span>
                    <span>{liveEmailValidation.error}</span>
                  </p>
                )}

                {liveEmailValidation && liveEmailValidation.isValid && (
                  <p className="text-xs text-tertiary font-semibold px-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      verified_user
                    </span>
                    <span>
                      {lang === 'es'
                        ? '✓ Dominio institucional válido (@colegio.edu.co)'
                        : '✓ Valid institutional domain (@colegio.edu.co)'}
                    </span>
                  </p>
                )}

                {!liveEmailValidation && (
                  <p className="text-[11px] text-on-surface-variant px-1">
                    {t.emailRequirementNotice}
                  </p>
                )}
              </div>

              {/* School Grade */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-lg text-on-surface font-semibold">
                  {t.gradeLabel}
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                    school
                  </span>
                  <input
                    type="text"
                    value={regGrade}
                    onChange={(e) => setRegGrade(e.target.value)}
                    placeholder={t.gradePlaceholder}
                    className="w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface rounded-lg font-body-md placeholder:text-outline-variant outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-lg text-on-surface font-semibold">
                  {t.pwdLabel}
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                    lock
                  </span>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full h-12 pl-11 pr-12 bg-surface-container-low text-on-surface rounded-lg font-body-md placeholder:text-outline-variant outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2.5 text-outline hover:text-primary p-1.5 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showRegPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-lg text-on-surface font-semibold">
                  Confirmar contraseña
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                    lock_clock
                  </span>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    className="w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface rounded-lg font-body-md placeholder:text-outline-variant outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all"
                  />
                </div>
              </div>

              <div className="pt-space-xs">
                <button
                  type="submit"
                  disabled={isSubmitting || (liveEmailValidation !== null && !liveEmailValidation.isValid)}
                  className="w-full h-12 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                  <span>{isSubmitting ? 'Registrando...' : t.registerBtn}</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="font-label-md text-primary hover:underline cursor-pointer"
                >
                  {t.alreadyHaveAccountPrompt}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================================== */}
        {/* VIEW 3: VERIFICACIÓN DE CÓDIGO INSTITUCIONAL (6 DÍGITOS) */}
        {/* ================================================================== */}
        {authMode === 'verify' && (
          <div className="w-full bg-surface-container-lowest rounded-xl p-space-lg sm:p-space-xl shadow-md text-center">
            <div className="w-14 h-14 rounded-full bg-primary-fixed/40 text-primary mx-auto flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[30px]">mark_email_read</span>
            </div>

            <h3 className="font-title-lg text-on-surface font-bold">
              {t.verifyTitle}
            </h3>
            <p className="font-body-sm text-on-surface-variant mt-1">
              {t.verifySubtitle}
            </p>

            <div className="my-3 p-2.5 rounded-lg bg-surface-container-low text-primary font-mono text-sm font-semibold truncate border border-primary/20">
              {verifyEmail}
            </div>

            {lastGeneratedCode && (
              <div className="mb-4 p-2.5 rounded-lg bg-tertiary-container/15 text-tertiary text-xs border border-tertiary/30 text-left">
                <div className="flex items-center gap-1 font-semibold mb-0.5">
                  <span className="material-symbols-outlined text-[16px]">key</span>
                  <span>Código de verificación generado (Simulador de correo):</span>
                </div>
                <div className="font-mono text-lg font-bold tracking-widest text-on-surface text-center py-1">
                  {lastGeneratedCode}
                </div>
                <div className="text-[11px] text-on-surface-variant text-center">
                  {t.codeExpiresNotice}
                </div>
              </div>
            )}

            {verifyError && (
              <div className="mb-3 p-2.5 rounded-lg bg-error-container text-on-error-container text-xs text-left">
                {verifyError}
              </div>
            )}

            <form onSubmit={handleVerifyCode} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-label-sm font-semibold text-on-surface">
                  {t.codeLabel}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                  placeholder={t.codePlaceholder}
                  className="w-full h-12 text-center tracking-[0.3em] font-mono text-xl font-bold bg-surface-container-low text-on-surface rounded-lg outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || verifyCode.length < 6}
                className="w-full h-12 rounded-lg bg-primary text-on-primary font-label-lg font-semibold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer active:scale-98 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>{isSubmitting ? 'Verificando...' : t.verifyBtn}</span>
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                className="text-xs font-semibold text-secondary hover:underline py-1 cursor-pointer"
              >
                {t.resendCodeBtn}
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                Volver a Iniciar sesión
              </button>
            </form>
          </div>
        )}

        {/* Return Navigation Link */}
        <div className="mt-space-lg text-center">
          <button
            type="button"
            onClick={() => onNavigate('inicio')}
            className="inline-flex items-center gap-1.5 font-label-lg text-on-surface-variant hover:text-primary transition-colors py-1 px-3 rounded-full hover:bg-surface-container-low cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            <span>{t.backHome}</span>
          </button>
        </div>

        {/* Soft Ambient Supportive Help Line */}
        <div
          onClick={() => onNavigate('orientacion')}
          className="mt-space-xl w-full bg-surface-container-low rounded-xl p-space-md flex items-center gap-3.5 shadow-sm cursor-pointer hover:bg-surface-container transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0 text-secondary">
            <span className="material-symbols-outlined text-[20px]">
              support_agent
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-label-md text-on-surface font-semibold truncate">
              {t.helpTitle}
            </p>
            <p className="font-body-sm text-on-surface-variant truncate">
              {t.helpSub}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


interface ProfileScreenProps {
  lang: Language;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isLoggedIn: boolean;
  userName: string;
  userEmail: string;
  userGrade: string;
  isVerified?: boolean;
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
  isLoggedIn,
  userName,
  userEmail,
  userGrade,
  isVerified = true,
  onNavigate,
  onUpdateProfile,
  onLogout,
  onDeleteAccount,
  onShowToast,
}) => {
  const t = translations[lang].profile;
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
              className="inline-flex items-center gap-1 font-label-md text-primary font-semibold bg-surface-container-low px-3 py-1.5 rounded-full hover:bg-surface-container transition-colors active:scale-95 cursor-pointer"
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
              className="inline-flex items-center gap-1 font-label-md text-on-primary font-semibold bg-primary px-3 py-1.5 rounded-full hover:opacity-90 transition-colors active:scale-95 cursor-pointer"
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
                className="w-full h-9 px-2.5 rounded-lg bg-surface-container-low text-on-surface font-title-md outline-none ring-2 ring-primary/50"
              />
            ) : (
              <div className="flex items-center gap-space-xs">
                <span className="font-title-md text-on-surface font-semibold truncate">
                  {userName || userEmail.split('@')[0]}
                </span>
                <span className="bg-primary-fixed/40 text-on-primary-fixed-variant font-label-sm px-2 py-0.5 rounded-full">
                  {t.pseudonym}
                </span>
              </div>
            )}
            <p className="font-body-sm text-on-surface-variant truncate mt-0.5">
              {t.confidentialId}: #{confidentialIdNumber}-EST
            </p>
          </div>
        </div>

        <div className="space-y-space-sm pt-space-xs">
          <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low">
            <div className="flex items-center gap-space-sm min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                <span className="material-symbols-outlined text-[18px]">
                  school
                </span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-label-sm text-on-surface-variant">
                  {t.gradeLabel}
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editGrade}
                    onChange={(e) => setEditGrade(e.target.value)}
                    className="w-full h-8 px-2 mt-0.5 rounded bg-surface-container-lowest text-on-surface font-body-sm outline-none ring-1 ring-primary"
                  />
                ) : (
                  <span className="font-body-sm text-on-surface font-medium truncate">
                    {userGrade}
                  </span>
                )}
              </div>
            </div>
            <span className="font-label-sm text-tertiary bg-surface-container-lowest px-2.5 py-1 rounded-full font-medium ml-2">
              {t.activeBadge}
            </span>
          </div>

          <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low">
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
                className={`font-label-sm px-2 py-0.5 rounded-full font-medium ${
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
          className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-surface-container-low text-error hover:bg-error-container/40 active:scale-[0.98] transition-all font-label-lg font-semibold cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          {t.logoutBtn}
        </button>

        <button
          type="button"
          onClick={() => setConfirmModal('delete')}
          className="w-full h-12 flex items-center justify-center gap-2 rounded-xl border border-error/40 bg-error-container/20 text-error hover:bg-error-container/50 active:scale-[0.98] transition-all font-label-lg font-semibold cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">
            delete_forever
          </span>
          {t.deleteAccountBtn}
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
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal('none')}
                className="flex-1 h-11 rounded-xl bg-surface-container text-on-surface font-label-lg font-semibold cursor-pointer"
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
                className="flex-1 h-11 rounded-xl bg-error text-on-error font-label-lg font-semibold shadow-sm cursor-pointer"
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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low text-primary rounded-full font-label-sm font-semibold tracking-wide uppercase">
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
          <div className="flex items-center gap-1.5 px-3 py-1 bg-error-container text-on-error-container rounded-full">
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
          className="w-full h-12 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg font-semibold shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">
            download
          </span>
          <span>{t.downloadBtn}</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="w-full h-12 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-label-lg font-semibold hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">login</span>
          <span>{t.testLoginUnregisteredBtn}</span>
        </button>

        <button
          type="button"
          onClick={onRestoreDemoAccount}
          className="w-full h-11 rounded-lg bg-surface-container-low text-primary font-label-md font-semibold hover:bg-surface-container transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            restore
          </span>
          <span>{t.restoreDemoBtn}</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('inicio')}
          className="w-full h-11 rounded-lg text-on-surface-variant font-label-md hover:text-on-surface transition-all flex items-center justify-center cursor-pointer"
        >
          {t.backHomeBtn}
        </button>
      </div>
    </div>
  );
};
