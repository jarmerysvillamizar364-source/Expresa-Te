/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Thermometer,
  Activity,
  Smile,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Heart,
  Droplet,
  Compass,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Maximize2,
  X,
  Share2,
  RefreshCw,
  Sparkles,
  Info,
  PhoneCall,
  UserCheck,
} from 'lucide-react';
import type { AudiovisualResource } from '../types/audiovisual.ts';

export interface EmotionalThermometerViewerProps {
  resource: AudiovisualResource;
  isEs: boolean;
  onNavigate: (screen: string) => void;
  onShowToast: (msg: string) => void;
  onOpenFullModal?: () => void;
}

export type ZoneLevel = 'verde' | 'amarillo' | 'naranja' | 'rojo';

interface ZoneDetail {
  id: ZoneLevel;
  range: string;
  minVal: number;
  maxVal: number;
  name: string;
  badge: string;
  subtitle: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  colorRing: string;
  icon: any;
  bpm: string;
  stateDescription: string;
  somaticSigns: {
    head: string;
    breath: string;
    heart: string;
    muscles: string;
    stomach: string;
  };
  typicalThoughts: string[];
  actionSteps: {
    title: string;
    desc: string;
    icon?: string;
  }[];
  institutionalAction: string;
}

export const THERMOMETER_ZONES: Record<ZoneLevel, ZoneDetail> = {
  verde: {
    id: 'verde',
    range: 'Nivel 0 - 3',
    minVal: 0,
    maxVal: 3,
    name: 'Zona Verde: Calma, Concentración y Regulación',
    badge: 'Zona de Aprendizaje Óptimo',
    subtitle: 'El sistema nervioso parasimpático está al mando. Mente despejada y receptiva.',
    colorBg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    colorBorder: 'border-emerald-500/40',
    colorText: 'text-emerald-700 dark:text-emerald-300',
    colorRing: 'ring-emerald-500',
    icon: Smile,
    bpm: '60 - 75 lpm (Ritmo sereno)',
    stateDescription:
      'Te sientes en paz, con energía equilibrada y capacidad para prestar atención, dialogar con tus compañeros y disfrutar de las clases.',
    somaticSigns: {
      head: 'Pensamientos claros, organizados y flexibles.',
      breath: 'Respiración diafragmática pausada (12 a 16 rpm).',
      heart: 'Latidos estables y tranquilos.',
      muscles: 'Mandíbula suelta, hombros relajados lejos de las orejas.',
      stomach: 'Digestión en calma, sin nudos ni acidez nerviosa.',
    },
    typicalThoughts: [
      '«Puedo concentrarme y avanzar a mi ritmo.»',
      '«Si tengo dudas, puedo preguntar sin miedo.»',
      '«Me siento seguro en este espacio escolar.»',
    ],
    actionSteps: [
      {
        title: 'Mantener hábitos de hidratación',
        desc: 'Toma agua fresca a lo largo de la mañana para mantener la oxigenación cerebral.',
      },
      {
        title: 'Estudio espaciado (Pomodoro)',
        desc: 'Aprovecha tu buena concentración en bloques de 25 minutos con 5 de descanso.',
      },
      {
        title: 'Celebrar tus progresos',
        desc: 'Reconoce el esfuerzo invertido en tus tareas y brinda apoyo a un compañero.',
      },
    ],
    institutionalAction: '¡Excelente momento para aprender, crear y convivir positivamente con tu grupo!',
  },
  amarillo: {
    id: 'amarillo',
    range: 'Nivel 4 - 6',
    minVal: 4,
    maxVal: 6,
    name: 'Zona Amarilla: Alerta Temprana, Tensión e Inquietud',
    badge: 'Señal Temprana de Alerta',
    subtitle: 'Aparece el estrés inicial. El cuerpo avisa que necesita una pausa breve.',
    colorBg: 'bg-amber-500/15 dark:bg-amber-500/20',
    colorBorder: 'border-amber-500/40',
    colorText: 'text-amber-800 dark:text-amber-300',
    colorRing: 'ring-amber-500',
    icon: AlertTriangle,
    bpm: '80 - 95 lpm (Ritmo acelerado)',
    stateDescription:
      'Sientes inquietud, impaciencia, desconcentración o preocupación por una prueba, una entrega o una interacción social.',
    somaticSigns: {
      head: 'Dudas recurrentes («¿y si no alcanzo?», «hay mucho ruido»).',
      breath: 'Respiración algo superficial o contenida.',
      heart: 'Primeras sensaciones de latidos más rápidos.',
      muscles: 'Ceño fruncido, mandíbula apretada, movimiento inquieto de piernas.',
      stomach: 'Sensación leve de mariposas o vacío gástrico.',
    },
    typicalThoughts: [
      '«Esto me está costando más de lo esperado.»',
      '«No quiero que me llamen la atención.»',
      '«Siento que el tiempo se me escapa.»',
    ],
    actionSteps: [
      {
        title: 'Técnica STOP (Paso 1: S - Para)',
        desc: 'Suelta el lápiz o la pantalla durante 30 segundos.',
      },
      {
        title: 'Técnica STOP (Paso 2: T - Toma aire)',
        desc: 'Realiza 3 respiraciones profundas contando mentalmente 1, 2, 3, 4.',
      },
      {
        title: 'Técnica STOP (Paso 3 y 4: O y P - Observa y Procede)',
        desc: 'Nombra la emoción («estoy impaciente») y retoma la tarea más sencilla primero.',
      },
    ],
    institutionalAction: 'Aplica la técnica STOP antes de que la tensión pase al nivel superior.',
  },
  naranja: {
    id: 'naranja',
    range: 'Nivel 7 - 8',
    minVal: 7,
    maxVal: 8,
    name: 'Zona Naranja: Tensión Alta, Frustración y Agitación',
    badge: 'Alta Activación Simpática',
    subtitle: 'La amígdala cerebral se activa. Se dificulta pensar con serenidad.',
    colorBg: 'bg-orange-500/15 dark:bg-orange-500/20',
    colorBorder: 'border-orange-500/40',
    colorText: 'text-orange-800 dark:text-orange-300',
    colorRing: 'ring-orange-500',
    icon: Flame,
    bpm: '100 - 120 lpm (Taquicardia palpable)',
    stateDescription:
      'Ganas de discutir, impulsividad, frustración intensa, calor en el rostro o deseo urgente de salir del aula.',
    somaticSigns: {
      head: 'Pensamientos en espiral («todo me sale mal», «nadie me entiende»).',
      breath: 'Respiración corta, torácica y agitada.',
      heart: 'Latidos fuertes en el pecho o en los oídos.',
      muscles: 'Puños cerrados, hombros levantados, tensión en la nuca.',
      stomach: 'Nudo gástrico cerrado, sensación de sequedad en la boca.',
    },
    typicalThoughts: [
      '«¡No aguanto más esta situación!»',
      '«Voy a explotar si alguien me dice algo.»',
      '«Mejor me voy o no hago nada.»',
    ],
    actionSteps: [
      {
        title: 'Desescalada Fisiológica (Respiración 4-7-8)',
        desc: 'Inhala en 4s, retén suavemente 7s y exhala en 8s soltando el aire con un suspiro.',
      },
      {
        title: 'Pausa de agua fresca',
        desc: 'Bebe un vaso de agua despacio, notando la temperatura en la garganta.',
      },
      {
        title: 'Permiso escolar de 2 minutos',
        desc: 'Pide permiso al docente para lavarte las manos y muñecas con agua fría en el baño.',
      },
    ],
    institutionalAction: 'No tomes decisiones importantes ni discutas en este nivel. Primero calma tu cuerpo.',
  },
  rojo: {
    id: 'rojo',
    range: 'Nivel 9 - 10',
    minVal: 9,
    maxVal: 10,
    name: 'Zona Roja: Crisis, Desborde Emocional o Bloqueo',
    badge: 'Activación Crítica / Desborde',
    subtitle: 'Sobrecarga total del sistema nervioso. Se requiere contención y acompañamiento.',
    colorBg: 'bg-rose-500/15 dark:bg-rose-500/20',
    colorBorder: 'border-rose-500/40',
    colorText: 'text-rose-700 dark:text-rose-300',
    colorRing: 'ring-rose-500',
    icon: ShieldAlert,
    bpm: '> 120 lpm (Hiperactivación)',
    stateDescription:
      'Llanto incontrolable, ataque de pánico, bloqueo mental completo, hiperventilación o ira incontrolable.',
    somaticSigns: {
      head: 'Visión en túnel, desorientación o mareo leve.',
      breath: 'Sensación de asfixia o respiración rápida e incompleta.',
      heart: 'Taquicardia severa y opresión en el pecho.',
      muscles: 'Temblores involuntarios en manos o piernas, rigidez total.',
      stomach: 'Náuseas o sensación de vacío profundo.',
    },
    typicalThoughts: [
      '«No puedo respirar, voy a perder el control.»',
      '«Necesito ayuda ya.»',
      '«No puedo con esto yo solo.»',
    ],
    actionSteps: [
      {
        title: 'Seguridad física y acompañamiento',
        desc: 'Siéntate en un lugar seguro con los pies firmes en el suelo y una mano en el pecho.',
      },
      {
        title: 'No intentar razonar ni debatir',
        desc: 'Tu cerebro está en modo supervivencia; espera a que baje el nivel antes de hablar del problema.',
      },
      {
        title: 'Acudir a Orientación Escolar o Psicología',
        desc: 'Solicita acompañamiento institucional de inmediato o activa la Línea 106 de atención psicológica.',
      },
    ],
    institutionalAction: '¡Estás a salvo! Acude de inmediato al orientador escolar o utiliza los canales seguros de Expresa Te.',
  },
};

export const EmotionalThermometerViewer: React.FC<EmotionalThermometerViewerProps> = ({
  resource,
  isEs,
  onNavigate,
  onShowToast,
  onOpenFullModal,
}) => {
  const [currentLevel, setCurrentLevel] = useState<number>(3); // Default at level 3 (Calm/Transition)
  const [viewMode, setViewMode] = useState<'interactive' | 'mural' | 'graphic'>('interactive');
  const [activeSomaticTab, setActiveSomaticTab] = useState<'head' | 'breath' | 'heart' | 'muscles' | 'stomach'>('breath');
  const [isFullReaderModalOpen, setIsFullReaderModalOpen] = useState(false);

  // Determine active zone based on currentLevel (0-10)
  const activeZoneKey: ZoneLevel =
    currentLevel <= 3 ? 'verde' : currentLevel <= 6 ? 'amarillo' : currentLevel <= 8 ? 'naranja' : 'rojo';

  const zone = THERMOMETER_ZONES[activeZoneKey];
  const IconComp = zone.icon;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast(
        isEs
          ? 'Enlace al Termómetro Emocional copiado al portapapeles'
          : 'Emotional Thermometer link copied'
      );
    } else {
      onShowToast(resource.title);
    }
  };

  return (
    <div className="w-full bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
      {/* ==================================================================== */}
      {/* 1. TOP TOOLBAR: View Switcher, Fullscreen & Badges                  */}
      {/* ==================================================================== */}
      <div className="p-3.5 sm:p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                {isEs ? 'Infografía Dinámica Interactiva' : 'Interactive Dynamic Infographic'}
              </span>
              <span className="px-2 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                100% Español
              </span>
              <span className="hidden sm:inline-block px-2 py-0.2 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium">
                Lectura visual (3 min)
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-white truncate max-w-md">
              {resource.title}
            </h3>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('interactive')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'interactive'
                ? 'bg-cyan-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isEs ? 'Termómetro Dinámico' : 'Dynamic Widget'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('mural')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'mural'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isEs ? 'Guía Mural (3 min)' : 'Mural Guide'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('graphic')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'graphic'
                ? 'bg-teal-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isEs ? 'Lámina Gráfica' : 'Graphic Chart'}
          </button>

          <button
            type="button"
            onClick={() => setIsFullReaderModalOpen(true)}
            title={isEs ? 'Abrir en pantalla completa' : 'Open full view'}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all cursor-pointer ml-1"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. MAIN VIEWER STAGE (Interactive, Mural, or Graphic)                */}
      {/* ==================================================================== */}
      <div className="p-4 sm:p-6 lg:p-8 min-h-[460px] flex flex-col justify-between">
        {viewMode === 'interactive' && (
          <div className="space-y-6 animate-fade-in">
            {/* Zone Quick Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['verde', 'amarillo', 'naranja', 'rojo'] as ZoneLevel[]).map((key) => {
                const z = THERMOMETER_ZONES[key];
                const isActive = activeZoneKey === key;
                const Icon = z.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCurrentLevel(key === 'verde' ? 2 : key === 'amarillo' ? 5 : key === 'naranja' ? 7 : 10)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? `${z.colorBg} ${z.colorBorder} ring-2 ${z.colorRing} shadow-lg scale-[1.02]`
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {z.range}
                      </span>
                      <Icon className={`w-4 h-4 ${z.colorText}`} />
                    </div>
                    <span className={`text-xs font-black line-clamp-1 ${isActive ? z.colorText : 'text-slate-200'}`}>
                      {z.name.split(':')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Thermometer Slider & Level Status Display */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-800 border border-slate-700 text-white">
                      {zone.range}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${zone.colorBg} ${zone.colorText}`}>
                      {zone.badge}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <IconComp className={`w-6 h-6 ${zone.colorText} shrink-0`} />
                    <span>{zone.name}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    {zone.subtitle}
                  </p>
                </div>

                <div className="bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-800 text-center shrink-0 min-w-[130px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Nivel de Activación
                  </span>
                  <div className="text-3xl font-black text-cyan-400 tracking-tight">
                    {currentLevel} <span className="text-sm text-slate-400 font-normal">/ 10</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 block mt-0.5">
                    {zone.bpm}
                  </span>
                </div>
              </div>

              {/* Slider Gauge Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="text-emerald-400">0 · Calma Total</span>
                  <span className="text-amber-400">5 · Alerta</span>
                  <span className="text-orange-400">7 · Tensión</span>
                  <span className="text-rose-400">10 · Crisis</span>
                </div>

                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(Number(e.target.value))}
                    className="w-full h-3.5 bg-gradient-to-r from-emerald-500 via-amber-500 via-orange-500 to-rose-600 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none"
                  />
                </div>

                <p className="text-center text-[11px] text-slate-400 italic">
                  💡 Desliza el control para observar cómo cambian tus señales corporales y qué técnica aplicar.
                </p>
              </div>
            </div>

            {/* Somatic Signals & Practical Steps 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Somatic Signs (El Cuerpo en este nivel) */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <h4 className="font-bold text-sm sm:text-base text-white">
                      Señales en tu Cuerpo (Nivel {currentLevel})
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400">Autobservación</span>
                </div>

                {/* Body Somatic Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: 'breath' as const, label: 'Respiración' },
                    { id: 'heart' as const, label: 'Corazón' },
                    { id: 'head' as const, label: 'Cabeza' },
                    { id: 'muscles' as const, label: 'Músculos' },
                    { id: 'stomach' as const, label: 'Estómago' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveSomaticTab(tab.id)}
                      className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeSomaticTab === tab.id
                          ? 'bg-cyan-500 text-slate-950 shadow-xs'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Active Somatic Detail Card */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                    {activeSomaticTab === 'breath'
                      ? '🫁 Patrón Respiratorio'
                      : activeSomaticTab === 'heart'
                      ? '🫀 Frecuencia Cardíaca'
                      : activeSomaticTab === 'head'
                      ? '🧠 Actividad Mental'
                      : activeSomaticTab === 'muscles'
                      ? '💪 Tensión Muscular'
                      : '⚡ Sensaciones Gástricas'}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {zone.somaticSigns[activeSomaticTab]}
                  </p>
                </div>

                {/* Typical Thoughts in this zone */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Pensamientos comunes en la Zona {zone.range.replace('Nivel ', '')}:
                  </span>
                  <div className="space-y-1">
                    {zone.typicalThoughts.map((thought, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-slate-300 italic bg-slate-950/60 p-2 rounded-xl border border-slate-800/60 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span>{thought}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actionable Coping Tools */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      <h4 className="font-bold text-sm sm:text-base text-white">
                        ¿Qué hacer ahora? (Herramientas Inmediatas)
                      </h4>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold">Paso a Paso</span>
                  </div>

                  <div className="space-y-2.5">
                    {zone.actionSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {idx + 1}
                          </span>
                          <h5 className="font-bold text-white text-xs sm:text-sm">{step.title}</h5>
                        </div>
                        <p className="text-slate-300 pl-7 leading-relaxed">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Institutional Advice callout box */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-emerald-500/10 border border-teal-500/30 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-teal-300 block">Recomendación Institucional:</span>
                    <p className="text-slate-200">{zone.institutionalAction}</p>
                  </div>
                  {activeZoneKey === 'rojo' || activeZoneKey === 'naranja' ? (
                    <button
                      type="button"
                      onClick={() => onNavigate('orientacion')}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shrink-0 cursor-pointer shadow-md transition-all active:scale-95"
                    >
                      Pedir Ayuda
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'mural' && (
          <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="text-center space-y-2 pb-2">
              <h3 className="text-xl sm:text-3xl font-black text-cyan-300">
                Guía Mural Completa: Termómetro Emocional y Señales Corporales
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
                Consulta los 4 niveles de activación en una sola vista estructurada en español. Úsalo para identificar tu estado antes de una clase o examen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['verde', 'amarillo', 'naranja', 'rojo'] as ZoneLevel[]).map((key) => {
                const z = THERMOMETER_ZONES[key];
                const Icon = z.icon;
                return (
                  <div
                    key={key}
                    className={`rounded-3xl p-5 border ${z.colorBg} ${z.colorBorder} space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${z.colorText}`} />
                        <h4 className="font-black text-white text-base">{z.name}</h4>
                      </div>
                      <span className="text-xs font-bold text-slate-300 px-2.5 py-0.5 rounded-full bg-slate-900/80">
                        {z.range}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {z.stateDescription}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-cyan-400 block text-[11px] uppercase">Señales físicas:</span>
                      <p className="text-slate-300">{z.somaticSigns.breath}</p>
                      <p className="text-slate-300">{z.somaticSigns.muscles}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-emerald-400 block text-[11px] uppercase">Estrategia clave:</span>
                      <p className="text-white font-medium">{z.actionSteps[0].title}: {z.actionSteps[0].desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === 'graphic' && (
          <div className="relative w-full flex flex-col items-center justify-center p-2 sm:p-4 animate-fade-in space-y-4">
            <div className="relative max-w-2xl w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 flex items-center justify-center">
              <img
                src={resource.thumbnail}
                alt={resource.title}
                className="w-full h-auto max-h-[500px] object-contain"
              />
              <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 text-xs text-cyan-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Infografía gráfica institucional</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 text-center max-w-lg">
              Esta lámina gráfica complementa el termómetro dinámico interactivo con las proporciones y esquemas visuales de orientación escolar.
            </p>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* 3. FOOTER: Quick Action Buttons & Guidance Trigger                  */}
      {/* ==================================================================== */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Droplet className="w-4 h-4 text-cyan-400" />
          <span>{isEs ? 'Fuente: Departamento de Psicología Institucional Expresa Te' : 'Source: Counseling Department'}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isEs ? 'Compartir' : 'Share'}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('orientacion')}
            className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEs ? 'Consultar con Psicología' : 'Ask Counselor'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. FULL READER MODAL (Focus & Accessibility Mode)                   */}
      {/* ==================================================================== */}
      {isFullReaderModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsFullReaderModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-slate-950 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-auto text-left"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    {isEs ? 'Lectura Visual Completa: Termómetro Emocional' : 'Complete Visual Reading: Emotional Thermometer'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isEs ? 'Escala de 4 zonas con indicadores corporales y protocolo escolar' : '4-Zone Scale with Body Indicators'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFullReaderModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Cards */}
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
              {(['verde', 'amarillo', 'naranja', 'rojo'] as ZoneLevel[]).map((key) => {
                const z = THERMOMETER_ZONES[key];
                const Icon = z.icon;
                return (
                  <div
                    key={key}
                    className={`rounded-2xl p-5 border ${z.colorBg} ${z.colorBorder} space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${z.colorText}`} />
                        <h4 className="font-black text-white text-base sm:text-lg">{z.name}</h4>
                      </div>
                      <span className="text-xs font-bold text-slate-300 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                        {z.range} · {z.bpm}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200">{z.stateDescription}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                        <span className="font-bold text-cyan-400 block uppercase text-[11px]">Señales corporales:</span>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
                          <li>{z.somaticSigns.breath}</li>
                          <li>{z.somaticSigns.heart}</li>
                          <li>{z.somaticSigns.muscles}</li>
                        </ul>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                        <span className="font-bold text-emerald-400 block uppercase text-[11px]">Pasos de acción:</span>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
                          {z.actionSteps.map((step, idx) => (
                            <li key={idx}>
                              <strong>{step.title}:</strong> {step.desc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Línea 106 de orientación escolar disponible las 24 horas.
              </span>
              <button
                type="button"
                onClick={() => setIsFullReaderModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
              >
                Cerrar Lectura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
