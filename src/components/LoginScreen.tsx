import React, { useState } from 'react';
import {
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  PhoneCall,
  School,
  UserCheck,
  Search,
  Check,
  AlertCircle,
  HelpCircle,
  UserPlus,
  Building2,
  LockKeyhole,
} from 'lucide-react';
import { ASSETS, Language, translations } from '../data/translations';
import { authService } from '../services/authService';
import { validateAnyEmail } from '../utils/institutionalValidator';
import {
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
  const isEs = lang === 'es';

  // Active tab: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
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

  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  // --------------------------------------------------------------------------
  // DOCUMENT LOOKUP IN INSTITUTIONAL CENSUS
  // --------------------------------------------------------------------------
  const handleVerifyDocument = (docToVerify?: string) => {
    const docQuery = (docToVerify !== undefined ? docToVerify : regDoc).trim();
    setRegError(null);

    if (!docQuery) {
      setDocFeedback({
        status: 'not_found',
        message: isEs
          ? 'Por favor ingresa un número de documento.'
          : 'Please enter an ID document number.',
      });
      setDocValidated(false);
      setCensusRecord(null);
      return;
    }

    const check = authService.verifyCensusDocument(docQuery, regRole);

    if (!check.found || !check.record) {
      setDocFeedback({
        status: 'not_found',
        message: isEs
          ? `El documento ${docQuery} no figura en los registros de ${
              regRole === 'estudiante' ? 'estudiantes' : 'personal administrativo'
            }. Verifica el número e intenta nuevamente.`
          : `ID ${docQuery} was not found in ${
              regRole === 'estudiante' ? 'student' : 'staff'
            } records. Please check the number and try again.`,
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
        message: isEs
          ? '✓ Documento validado en censo oficial. Completa tu correo y contraseña.'
          : '✓ Official census verified. Complete your email and password.',
      });
      setDocValidated(true);
      setCensusRecord(check.record);
    }
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
        isEs
          ? 'Debes ingresar y validar primero tu número de documento escolar.'
          : 'Please verify an ID number registered in the school census first.'
      );
      return;
    }

    const emailValidation = validateAnyEmail(regEmail, lang);
    if (!emailValidation.isValid) {
      setRegError(emailValidation.error || (isEs ? 'Correo electrónico inválido.' : 'Invalid email.'));
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setRegError(
        isEs
          ? 'La contraseña debe tener al menos 6 caracteres.'
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError(
        isEs ? 'Las contraseñas no coinciden.' : 'Passwords do not match.'
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
        setRegError(res.message || (isEs ? 'Error al completar el registro.' : 'Registration error.'));
      }
    } finally {
      setIsSubmittingReg(false);
    }
  };

  const studentRec = censusRecord && censusRecord.rol === 'estudiante' ? (censusRecord as StudentCensusRecord) : null;
  const adminRec = censusRecord && censusRecord.rol === 'administrativo' ? (censusRecord as AdministrativeCensusRecord) : null;

  return (
    <div className="w-full flex items-center justify-center py-6 sm:py-10 lg:py-14 animate-fade-in">
      {/* Background ambient glowing spheres */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-900/60 rounded-full blur-[160px]" />
      </div>

      {/* Main Split Layout Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* ================================================================== */}
        {/* SECCIÓN IZQUIERDA: Presentación e Identidad Institucional */}
        {/* ================================================================== */}
        <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
          
          {/* Título Principal con Degradado Vibrante (Cian / Esmeralda) - Ubicado directamente arriba */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none">
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Expresa Te
              </span>
            </h1>
            <p className="text-lg sm:text-xl font-medium text-slate-200 leading-snug">
              {isEs
                ? 'Portal institucional de bienestar y orientación escolar.'
                : 'Official school wellness and guidance portal.'}
            </p>
          </div>

          {/* Tarjeta/Contenedor visual al centro con Logo y Brillo Suave */}
          <div className="w-full relative group">
            {/* Ambient halo behind container */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="relative p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/40 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center text-center transition-all">
              <div className="relative flex items-center justify-center py-2 px-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-inner mb-4">
                <img
                  alt="Expresa Te Logo Oficial"
                  className="h-16 sm:h-20 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(20,184,166,0.3)]"
                  src={ASSETS.bannerLogo || '/assets/aistudio/image_6440f15d.png'}
                />
              </div>

              {/* Badges de Confianza y Protección */}
              <div className="grid grid-cols-2 gap-2.5 w-full pt-2">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/70 text-left">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate">100% Confidencial</p>
                    <p className="text-[10px] text-slate-400 truncate">Ley 1090 / 1620</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/70 text-left">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate">Acompañamiento</p>
                    <p className="text-[10px] text-slate-400 truncate">Orientación y Psico</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción Institucional */}
          <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed">
            {isEs
              ? 'Espacio confidencial y protegido para la comunidad escolar. Conecta en tiempo real con la comunidad educativa.'
              : 'A confidential and protected space for our school community. Connect in real time with guidance staff.'}
          </p>

          {/* Institutional Trust Footer Indicator */}
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <LockKeyhole className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              {isEs
                ? 'Plataforma protegida con cifrado institucional y validación contra censo de matrícula.'
                : 'Protected platform with institutional encryption and school census verification.'}
            </span>
          </div>
        </div>

        {/* ================================================================== */}
        {/* SECCIÓN DERECHA: Formulario de Login (Glassmorphism Floating Card) */}
        {/* ================================================================== */}
        <div className="lg:col-span-6 w-full flex justify-center">
          <div className="w-full max-w-md relative">
            
            {/* Subtle glow border aura */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500/25 via-teal-500/20 to-emerald-500/25 rounded-3xl blur-md opacity-60" />

            {/* Floating Glassmorphic Card Container */}
            <div className="relative rounded-3xl bg-slate-900/85 border border-slate-800/90 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col gap-6 text-left">
              
              {/* Header de la Tarjeta */}
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  {authMode === 'login'
                    ? 'Ingresa tus credenciales institucionales de acceso'
                    : 'Regístrate validando tu documento con la base escolar'}
                </p>
              </div>

              {/* Pestañas/Tabs: Iniciar sesión / Crear cuenta */}
              <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800/90">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setLoginError(null);
                  }}
                  className={`h-11 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                    authMode === 'login'
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{t.tabLogin}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setRegError(null);
                  }}
                  className={`h-11 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                    authMode === 'register'
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{t.tabRegister}</span>
                </button>
              </div>

              {/* ============================================================== */}
              {/* VISTA 1: FORMULARIO DE INICIO DE SESIÓN */}
              {/* ============================================================== */}
              {authMode === 'login' && (
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  {loginError && (
                    <div
                      role="alert"
                      className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-rose-300 flex items-start gap-3 text-xs sm:text-sm animate-fade-in"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="font-bold text-rose-200">Error de acceso</span>
                        <span className="mt-0.5 text-rose-300/90">{loginError}</span>
                      </div>
                    </div>
                  )}

                  {/* Campo: Correo o Documento */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="login-identifier"
                      className="text-xs font-semibold uppercase tracking-wider text-slate-300"
                    >
                      {isEs ? 'Correo electrónico o número de documento' : 'Email or ID document number'}
                    </label>
                    <div className="relative flex items-center">
                      <CreditCard className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
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
                        className="w-full h-12 pl-11 pr-4 bg-slate-950/80 text-white rounded-xl placeholder:text-slate-500 outline-none border border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Campo: Contraseña */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="login-password"
                        className="text-xs font-semibold uppercase tracking-wider text-slate-300"
                      >
                        {t.pwdLabel}
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium cursor-pointer"
                      >
                        {t.forgotPwd}
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
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
                        className="w-full h-12 pl-11 pr-12 bg-slate-950/80 text-white rounded-xl placeholder:text-slate-500 outline-none border border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all text-sm font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? t.hidePwd : t.showPwd}
                        className="absolute right-2.5 text-slate-400 hover:text-cyan-300 p-2 rounded-lg cursor-pointer transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Recordar en este dispositivo */}
                  <div className="flex items-center justify-between pt-0.5">
                    <label
                      onClick={() => setRemember(!remember)}
                      className="flex items-center gap-2.5 cursor-pointer select-none"
                    >
                      <div
                        className={`w-4.5 h-4.5 rounded-md flex items-center justify-center transition-all border ${
                          remember
                            ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 border-transparent text-slate-950'
                            : 'bg-slate-950 border-slate-700 text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-xs text-slate-300 font-medium">{t.rememberDevice}</span>
                    </label>
                  </div>

                  {/* Botón Principal: Iniciar Sesión -> */}
                  <button
                    type="submit"
                    disabled={isSubmittingLogin}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:via-teal-300 hover:to-emerald-300 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 mt-1 whitespace-nowrap group"
                  >
                    <span>{isSubmittingLogin ? (isEs ? 'Verificando...' : 'Checking...') : 'Iniciar sesión'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Botón secundario para Crear Cuenta */}
                  <div className="pt-2 flex flex-col items-center gap-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setRegError(null);
                      }}
                      className="w-full h-11 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/40 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4 text-cyan-400" />
                      <span>{isEs ? 'Crear cuenta nueva' : 'Create new account'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ============================================================== */}
              {/* VISTA 2: FORMULARIO DE REGISTRO CON CENSO ESCOLAR */}
              {/* ============================================================== */}
              {authMode === 'register' && (
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  {/* Rol: Estudiante / Personal Administrativo */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      {t.roleSelectorTitle}
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setRegRole('estudiante');
                          setDocValidated(false);
                          setCensusRecord(null);
                          setDocFeedback({ status: 'idle', message: '' });
                        }}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                          regRole === 'estudiante'
                            ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-sm'
                            : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/40 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white">
                          <School className="w-4 h-4 text-cyan-400" />
                          <span>{t.roleStudent}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 truncate">
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
                        className={`p-3 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                          regRole === 'administrativo'
                            ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-sm'
                            : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/40 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white">
                          <Building2 className="w-4 h-4 text-emerald-400" />
                          <span>{t.roleAdmin}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 truncate">
                          {t.roleAdminDesc}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Documento y Botón de Búsqueda */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="reg-doc"
                      className="text-xs font-semibold uppercase tracking-wider text-slate-300"
                    >
                      {t.docLabel}
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1 flex items-center">
                        <CreditCard className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
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
                              : 'ej. 5234567001 (Orientación)'
                          }
                          className="w-full h-11 pl-11 pr-3 bg-slate-950/80 text-white rounded-xl placeholder:text-slate-500 outline-none border border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all text-sm font-medium"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleVerifyDocument()}
                        className="px-4 h-11 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-white font-bold text-xs transition-all shrink-0 cursor-pointer border border-slate-700 flex items-center gap-1.5 active:scale-[0.98]"
                      >
                        <Search className="w-4 h-4" />
                        <span>{t.docSearchBtn}</span>
                      </button>
                    </div>

                    {/* Feedback Banner */}
                    {docFeedback.status === 'not_found' && (
                      <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{docFeedback.message}</span>
                      </div>
                    )}

                    {docFeedback.status === 'already_registered' && (
                      <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs flex items-center justify-between gap-2">
                        <span>{docFeedback.message}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('login');
                            setIdentifier(regDoc);
                          }}
                          className="h-7 px-2.5 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer"
                        >
                          Iniciar Sesión
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Ficha oficial validada */}
                  {docValidated && censusRecord && (
                    <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col gap-2 text-left animate-fade-in shadow-inner">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-300">
                          <Check className="w-3.5 h-3.5" />
                          <span>{t.docValidatedBadge}</span>
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                          Doc: {censusRecord.documento}
                        </span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="text-slate-400 font-medium">{t.nameLabel}: </span>
                          <span className="font-bold text-white">{censusRecord.nombreCompleto}</span>
                        </div>
                        {studentRec && (
                          <div>
                            <span className="text-slate-400 font-medium">{t.gradeLabel}: </span>
                            <span className="font-bold text-cyan-300">{studentRec.grado}</span>
                            <span className="text-slate-400"> ({studentRec.sede})</span>
                          </div>
                        )}
                        {adminRec && (
                          <div>
                            <span className="text-slate-400 font-medium">{t.positionLabel}: </span>
                            <span className="font-bold text-emerald-300">{adminRec.cargo} ({adminRec.perfil})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Campos de Correo y Clave */}
                  {docValidated && (
                    <div className="flex flex-col gap-3 animate-fade-in pt-1">
                      {regError && (
                        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <span>{regError}</span>
                        </div>
                      )}

                      {/* Correo */}
                      <div className="flex flex-col gap-1 text-left">
                        <label
                          htmlFor="reg-email"
                          className="text-xs font-semibold uppercase tracking-wider text-slate-300"
                        >
                          {t.emailLabel} (Cualquier proveedor)
                        </label>
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
                          className="w-full h-11 px-4 bg-slate-950/80 text-white rounded-xl placeholder:text-slate-500 outline-none border border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-sm font-medium"
                        />
                      </div>

                      {/* Contraseña */}
                      <div className="flex flex-col gap-1 text-left">
                        <label
                          htmlFor="reg-password"
                          className="text-xs font-semibold uppercase tracking-wider text-slate-300"
                        >
                          {t.pwdLabel}
                        </label>
                        <div className="relative flex items-center">
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
                            className="w-full h-11 pl-4 pr-11 bg-slate-950/80 text-white rounded-xl placeholder:text-slate-500 outline-none border border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-sm font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-2.5 text-slate-400 hover:text-cyan-300 p-2 cursor-pointer"
                          >
                            {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirmar Contraseña */}
                      <div className="flex flex-col gap-1 text-left">
                        <label
                          htmlFor="reg-confirm-password"
                          className="text-xs font-semibold uppercase tracking-wider text-slate-300"
                        >
                          {t.confirmPwdLabel}
                        </label>
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
                          className="w-full h-11 px-4 bg-slate-950/80 text-white rounded-xl placeholder:text-slate-500 outline-none border border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-sm font-medium"
                        />
                      </div>

                      {/* Submit Register */}
                      <button
                        type="submit"
                        disabled={isSubmittingReg}
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 mt-1 whitespace-nowrap"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>{isSubmittingReg ? (isEs ? 'Creando...' : 'Creating...') : t.registerBtn}</span>
                      </button>
                    </div>
                  )}

                  {!docValidated && (
                    <div className="p-3.5 rounded-xl bg-slate-950/50 text-slate-400 text-xs text-center border border-slate-800/80">
                      <p>
                        Ingresa tu número de documento y presiona <strong>&quot;Buscar en censo&quot;</strong> para habilitar el registro con tus datos institucionales.
                      </p>
                    </div>
                  )}

                  <div className="text-center pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setLoginError(null);
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                    >
                      {t.alreadyHaveAccountPrompt}
                    </button>
                  </div>
                </form>
              )}

              {/* Banner de Ayuda Línea 106 en la Tarjeta */}
              <div
                onClick={() =>
                  onShowToast(
                    isEs
                      ? 'Línea 106 de atención y contención emocional disponible 24/7'
                      : 'Line 106 emotional support available 24/7'
                  )
                }
                className="w-full bg-slate-950/60 rounded-2xl p-3 flex items-center justify-between gap-3 border border-rose-500/20 hover:border-rose-500/40 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate">
                      {isEs ? 'Línea 106 de Ayuda Emocional' : 'Crisis Helpline 106'}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {isEs ? 'Acompañamiento gratuito y confidencial' : 'Toll-free 24/7 emotional support'}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full shrink-0">
                  24/7 Gratis
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowForgotModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Recuperación de Acceso Institucional
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Por motivos de seguridad y resguardo de menores en el entorno escolar, puedes restablecer tus credenciales acercándote al Departamento de Orientación y Psicología de la <strong>I.E. Vallejuelos</strong> o consultando tu documento de censo institucional.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 text-xs text-slate-400 space-y-1 border border-slate-800">
              <div className="font-bold text-slate-200">Horario de atención presencial:</div>
              <div>Lunes a Viernes de 7:00 AM a 4:00 PM • Consultorio de Bienestar</div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold text-sm cursor-pointer shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
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
