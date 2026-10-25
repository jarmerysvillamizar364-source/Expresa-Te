import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Search,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Tv,
  Film,
  RotateCcw,
} from 'lucide-react';
import { ASSETS, Language } from '../data/translations';

export interface VideoResource {
  id: string;
  title: string;
  category: 'emociones' | 'ansiedad' | 'convivencia' | 'autocuidado';
  categoryLabel: string;
  duration: string;
  image: string;
  embedUrl: string;
  author: string;
  description: string;
  takeaways: string[];
  transcript: string;
  highlight?: boolean;
}

export const WELLNESS_VIDEOS: VideoResource[] = [
  {
    id: 'video-stop',
    title: 'Técnica STOP para la Regulación Emocional',
    category: 'emociones',
    categoryLabel: 'Inteligencia Emocional & Calma',
    duration: '4:15 min',
    image: ASSETS.videoStop,
    embedUrl: 'https://www.youtube-nocookie.com/embed/fD3lC_d8s6c',
    author: 'Departamento de Psicología Escolar',
    description:
      'Aprende los cuatro pasos de la técnica STOP (Stop, Take a breath, Observe, Proceed) para detener impulsos inmediatos, desactivar la respuesta de lucha o huida y recuperar la calma en momentos de tensión o enojo.',
    takeaways: [
      'S (Stop / Para): Detén cualquier reacción física o verbal antes de que escale.',
      'T (Take a breath / Respira): Realiza 3 respiraciones diafragmáticas lentas llenando el abdomen.',
      'O (Observe / Observa): Identifica qué emoción sientes en tu cuerpo (mandíbula tensa, pulso alto) sin juzgarte.',
      'P (Proceed / Procede): Elige con serenidad tu siguiente acción constructiva y asertiva.',
    ],
    transcript:
      'Hola y bienvenido a este espacio de orientación. Cuando enfrentamos un momento de estrés o enojo intenso, nuestro cerebro límbico activa la amígdala antes de que la razón intervenga. La técnica STOP es un freno de emergencia de 30 segundos. Al inhalar profundamente y nombrar la emoción que sientes, la corteza prefrontal retoma el control y te permite responder con dignidad y calma.',
    highlight: true,
  },
  {
    id: 'video-exam',
    title: 'Manejo de la Ansiedad ante Exámenes y Evaluaciones',
    category: 'ansiedad',
    categoryLabel: 'Estrés Académico & Enfoque',
    duration: '6:30 min',
    image: ASSETS.videoExam,
    embedUrl: 'https://www.youtube-nocookie.com/embed/1ZYbU88VzII',
    author: 'Equipo de Orientación Académica',
    description:
      'Estrategias comprobadas para prevenir la mente en blanco, desensibilizar la prueba, distribuir el estudio mediante bloques Pomodoro y calmar el pulso antes de comenzar a responder.',
    takeaways: [
      'Estudio en intervalos Pomodoro: 25 minutos de concentración absoluta y 5 de pausa activa sin pantallas.',
      'Simulación previa: Realiza mini-cuestionarios en casa bajo condiciones similares al aula.',
      'Anclaje fisiológico: 2 minutos de exhalaciones largas antes de abrir el cuadernillo de preguntas.',
      'Estrategia de barrido: Contesta primero las preguntas seguras para generar inercia y confianza.',
    ],
    transcript:
      'Tener la mente en blanco no significa que no hayas estudiado, sino que tu nivel de cortisol se disparó. Para contrarrestarlo, apoya ambos pies firmes sobre el suelo, suelta el bolígrafo por diez segundos y exhala el doble de lo que inhalas. Esta señal corporal desactiva la alarma del sistema nervioso y despeja tu memoria de trabajo.',
    highlight: true,
  },
  {
    id: 'video-coexistence',
    title: 'Comunicación Asertiva y Convivencia Escolar Pacífica',
    category: 'convivencia',
    categoryLabel: 'Convivencia & Asertividad (Ley 1620)',
    duration: '5:45 min',
    image: ASSETS.videoCoexistence,
    embedUrl: 'https://www.youtube-nocookie.com/embed/jZkq_7ZrnY8',
    author: 'Comité de Convivencia y Mediación',
    description:
      'Cómo expresar desacuerdos y marcar límites firmes sin agresión, cómo actuar como observador activo ante situaciones de intimidación o bullying y cuándo acudir a la ruta institucional.',
    takeaways: [
      'Estructura asertiva: "Cuando ocurre [situación], yo siento [emoción] y solicito [cambio concreto]".',
      'El poder del testigo solidario: No reírse de burlas ajenas y buscar apoyo de orientación.',
      'Diferenciar conflicto de acoso: El acoso es reiterado y asimétrico; requiere activación de protocolo Ley 1620.',
      'Ruta segura y confidencial: Orientación escolar acompaña sin exponer al estudiante.',
    ],
    transcript:
      'Ser asertivo no es agredir ni quedarse callado. Es el punto medio donde defiendes tu valor con serenidad. Cuando un comentario te incomode, mira a la persona a los ojos con postura erguida y di con voz firme: "No me gusta ese trato, hablemos con respeto". La claridad desarma la hostilidad.',
  },
  {
    id: 'video-breathing',
    title: 'Respiración Diafragmática 4-7-8 para la Calma Rápida',
    category: 'ansiedad',
    categoryLabel: 'Ansiedad & Alivio Inmediato',
    duration: '3:50 min',
    image: ASSETS.recBreathing,
    embedUrl: 'https://www.youtube-nocookie.com/embed/LiUnFJ8P4gM',
    author: 'Gabinete de Salud Emocional',
    description:
      'Ejercicio de respiración guiada con compás rítmico para desacelerar taquicardias, disolver la sensación de nudo en la garganta y recuperar el equilibrio fisiológico en menos de 4 minutos.',
    takeaways: [
      'Inhala en 4 tiempos suaves por la nariz expandiendo el abdomen.',
      'Sostén el aire durante 7 tiempos con la lengua apoyada en el paladar superior.',
      'Exhala lentamente por la boca en 8 tiempos con un suave soplido.',
      'Repite de 3 a 4 ciclos seguidos para activar el nervio vago y desacelerar el ritmo cardíaco.',
    ],
    transcript:
      'La respiración 4-7-8 actúa como un tranquilizante natural del sistema nervioso. Practícala antes de dormir, antes de una exposición o cuando sientas inquietud interna. Si sientes mareo leve, vuelve a tu respiración natural.',
  },
  {
    id: 'video-frustration',
    title: 'Cómo Manejar la Frustración y los Días Difíciles',
    category: 'autocuidado',
    categoryLabel: 'Autoestima & Resiliencia',
    duration: '7:10 min',
    image: ASSETS.recSupport,
    embedUrl: 'https://www.youtube-nocookie.com/embed/5F2o3eWp2hU',
    author: 'Psicología y Bienestar Juvenil',
    description:
      'Claves para no sobreidentificarse con un error, entender la curva del aprendizaje escolar y reemplazar la autocrítica destructiva por compasión y perseverancia.',
    takeaways: [
      'Un mal resultado o calificación no define tu valor ni tu capacidad intelectual.',
      'Regla de las 24 horas: Permítete sentir el disgusto y al día siguiente busca soluciones prácticas.',
      'Identifica distorsiones cognitivas: "Todo me sale mal" vs. "Hoy tuve un tropiezo específico".',
      'Pedir ayuda es un acto de valentía y madurez escolar.',
    ],
    transcript:
      'Todos los estudiantes enfrentan materias difíciles, amistades complejas o días donde nada parece salir bien. La resiliencia no es fingir que no te duele; es aceptar la incomodidad presente sabiendo que las emociones son temporales.',
  },
  {
    id: 'video-digital-pause',
    title: 'Pausa Activa y Prevención del Agotamiento Digital',
    category: 'autocuidado',
    categoryLabel: 'Bienestar Digital & Pausa Saludable',
    duration: '4:20 min',
    image: ASSETS.recStudy,
    embedUrl: 'https://www.youtube-nocookie.com/embed/4p5286T_kn0',
    author: 'Promoción de Hábitos Saludables',
    description:
      'Rutina práctica de 4 minutos con ejercicios de liberación ocular, estiramiento cervical y desconexión consciente entre jornadas de estudio y pantallas.',
    takeaways: [
      'Regla 20-20-20: Cada 20 minutos de pantalla, mira un objeto a 6 metros por 20 segundos.',
      'Estiramientos de trapecio y cuello para evitar cefaleas por tensión postural.',
      'Higiene del sueño: Desconecta pantallas al menos 45 minutos antes de acostarte.',
    ],
    transcript:
      'El uso continuo de celulares y computadores sobrecarga los músculos oculares y la atención. Sigue estos 5 movimientos para recargar tu energía y continuar tus actividades escolares con mente despejada.',
  },
];

interface AudiovisualModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialVideoId?: string;
  onNavigateToFullLibrary?: () => void;
  onOpenGuidance?: () => void;
}

export const AudiovisualModal: React.FC<AudiovisualModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialVideoId,
  onNavigateToFullLibrary,
  onOpenGuidance,
}) => {
  const isEs = lang === 'es';
  const [selectedVideo, setSelectedVideo] = useState<VideoResource>(() => {
    if (initialVideoId) {
      const match = WELLNESS_VIDEOS.find((v) => v.id === initialVideoId);
      if (match) return match;
    }
    return WELLNESS_VIDEOS[0];
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playerMode, setPlayerMode] = useState<'embed' | 'interactive'>('embed');

  // Interactive simulated video controls state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(25);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'takeaways' | 'transcript'>('takeaways');

  // Sync selected video if initialVideoId changes
  useEffect(() => {
    if (initialVideoId) {
      const match = WELLNESS_VIDEOS.find((v) => v.id === initialVideoId);
      if (match) setSelectedVideo(match);
    }
  }, [initialVideoId]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Simulate progress when playing in interactive mode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && playerMode === 'interactive') {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 350 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playerMode, playbackSpeed]);

  if (!isOpen) return null;

  // Filter video gallery
  const filteredVideos = WELLNESS_VIDEOS.filter((v) => {
    const matchCat = activeCategory === 'all' || v.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      v.title.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.author.toLowerCase().includes(q) ||
      v.categoryLabel.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  const categories = [
    { id: 'all', label: isEs ? 'Todos los Videos' : 'All Videos' },
    { id: 'emociones', label: isEs ? 'Regulación Emocional' : 'Emotional Regulation' },
    { id: 'ansiedad', label: isEs ? 'Ansiedad & Exámenes' : 'Anxiety & Exams' },
    { id: 'convivencia', label: isEs ? 'Convivencia & Asertividad' : 'Coexistence & Bullying' },
    { id: 'autocuidado', label: isEs ? 'Autocuidado & Bienestar' : 'Self-Care & Wellness' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEs ? 'Centro Audiovisual de Bienestar' : 'Audiovisual Wellness Hub'}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fade-in overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl my-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/30 rounded-3xl shadow-2xl dark:shadow-[0_0_40px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col text-left transition-all max-h-[94vh]"
      >
        {/* ================================================================== */}
        {/* HEADER: Modal Title + Search + Close Button */}
        {/* ================================================================== */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 text-slate-950 flex items-center justify-center shadow-md shadow-cyan-500/20 shrink-0">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-teal-700 dark:text-cyan-400 uppercase tracking-wider">
                  {isEs ? 'Espacio Audiovisual Oficial' : 'Official Media Hub'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {isEs ? 'Audiovisuales & Educación Emocional' : 'Audiovisual & Emotional Education'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto justify-between sm:justify-end">
            <div className="relative flex-1 sm:w-64 max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEs ? 'Buscar video o técnica...' : 'Search video or topic...'}
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              title={isEs ? 'Cerrar reproductor' : 'Close player'}
              className="w-9 h-9 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/* SCROLLABLE BODY: Active Video Player + Details + Gallery */}
        {/* ================================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Featured Player Box */}
          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl relative group">
            {/* Player Switcher Bar (Embed YouTube vs Native Guided Player) */}
            <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2 font-semibold">
                <Tv className="w-4 h-4 text-cyan-400" />
                <span className="truncate">{selectedVideo.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold shrink-0">
                  {selectedVideo.duration}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setPlayerMode('embed')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    playerMode === 'embed'
                      ? 'bg-cyan-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {isEs ? 'Video Oficial Embebido' : 'Official Embed'}
                </button>
                <button
                  type="button"
                  onClick={() => setPlayerMode('interactive')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    playerMode === 'interactive'
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {isEs ? 'Modo Guiado' : 'Guided Mode'}
                </button>
              </div>
            </div>

            {/* Video Viewport */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              {playerMode === 'embed' ? (
                /* Embedded YouTube / Institutional Video Player */
                <iframe
                  src={`${selectedVideo.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                /* Interactive Guided Player with Custom Controls */
                <div className="relative w-full h-full flex flex-col justify-between">
                  <img
                    src={selectedVideo.image}
                    alt={selectedVideo.title}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      isPlaying ? 'opacity-85' : 'opacity-65'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

                  {/* Play / Pause Big Center Button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_35px_rgba(20,184,166,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer group-hover:ring-4 ring-cyan-400/30"
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 sm:w-9 sm:h-9 fill-current" />
                      ) : (
                        <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-current translate-x-0.5" />
                      )}
                    </button>
                    <span className="text-xs sm:text-sm font-bold text-white drop-shadow-md">
                      {isPlaying
                        ? isEs ? 'Reproduciendo lección...' : 'Playing lesson...'
                        : isEs ? 'Click para reproducir' : 'Click to play'}
                    </span>
                  </div>

                  {/* Player Bottom Control Bar */}
                  <div className="relative z-10 p-3 sm:p-4 bg-gradient-to-t from-black/95 to-transparent flex flex-col gap-2">
                    {/* Scrub Progress Bar */}
                    <div
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const pct = Math.round((clickX / rect.width) * 100);
                        setProgress(Math.max(0, Math.min(100, pct)));
                      }}
                      className="w-full h-2 bg-white/20 hover:h-2.5 rounded-full cursor-pointer relative transition-all"
                    >
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all relative"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md" />
                      </div>
                    </div>

                    {/* Bottom Controls */}
                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="hover:text-cyan-400 transition-colors cursor-pointer"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setProgress(0)}
                          title="Reiniciar"
                          className="hover:text-cyan-400 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsMuted(!isMuted)}
                          className="hover:text-cyan-400 transition-colors cursor-pointer"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <span className="font-mono text-[11px] text-slate-300">
                          {Math.floor((progress / 100) * 4)}:
                          {String(Math.floor(((progress / 100) * 240) % 60)).padStart(2, '0')} / {selectedVideo.duration}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Speed selector */}
                        <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5 text-[10px]">
                          {[1, 1.25, 1.5].map((spd) => (
                            <button
                              key={spd}
                              type="button"
                              onClick={() => setPlaybackSpeed(spd)}
                              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                                playbackSpeed === spd ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300'
                              }`}
                            >
                              {spd}x
                            </button>
                          ))}
                        </div>

                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          HD 1080p
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details & Takeaways Card */}
          <div className="bg-slate-50 dark:bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-bold text-teal-700 dark:text-cyan-400 uppercase tracking-wider block">
                  {selectedVideo.author}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {selectedVideo.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('takeaways')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'takeaways'
                      ? 'bg-cyan-500 text-slate-950 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isEs ? 'Puntos Clave' : 'Key Takeaways'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('transcript')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'transcript'
                      ? 'bg-cyan-500 text-slate-950 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isEs ? 'Guía y Guion' : 'Transcript'}</span>
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedVideo.description}
            </p>

            {/* Active Tab Content */}
            {activeTab === 'takeaways' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
                {selectedVideo.takeaways.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{point}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "{selectedVideo.transcript}"
              </div>
            )}

            {/* Support Guidance Callout */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-emerald-500/10 p-3.5 rounded-xl border border-teal-500/20">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="text-xs text-slate-800 dark:text-slate-200">
                  {isEs
                    ? '¿Deseas profundizar sobre este tema con un profesional de la institución?'
                    : 'Would you like to explore this topic further with school guidance staff?'}
                </span>
              </div>
              {onOpenGuidance && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenGuidance();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-xs"
                >
                  <span>{isEs ? 'Hablar con Orientación' : 'Talk with Counselor'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* ================================================================ */}
          {/* VIDEO GALLERY: Select other videos */}
          {/* ================================================================ */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {isEs ? 'Catálogo de Videos de Bienestar' : 'Wellness Video Catalog'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {isEs
                    ? 'Selecciona cualquier cápsula para reproducirla inmediatamente'
                    : 'Click any capsule to play it immediately'}
                </p>
              </div>

              {onNavigateToFullLibrary && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToFullLibrary();
                  }}
                  className="text-xs font-bold text-teal-700 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <span>{isEs ? 'Ver todos los recursos y audios' : 'View all resources & audios'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map((cat) => {
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVideos.map((video) => {
                const isSelected = selectedVideo.id === video.id;
                return (
                  <article
                    key={video.id}
                    onClick={() => {
                      setSelectedVideo(video);
                      setProgress(15);
                      setIsPlaying(true);
                      // Scroll slightly to top of modal if needed
                    }}
                    className={`group rounded-2xl overflow-hidden border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-cyan-500 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/20'
                        : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                        <img
                          src={video.image}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Play Icon Badge */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                              isSelected
                                ? 'bg-cyan-400 text-slate-950'
                                : 'bg-white/90 text-slate-900 group-hover:bg-cyan-400 group-hover:text-slate-950'
                            }`}
                          >
                            <Play className="w-5 h-5 fill-current translate-x-0.5" />
                          </div>
                        </div>

                        {/* Duration Pill */}
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                          {video.duration}
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                            {isEs ? 'Reproduciendo' : 'Playing'}
                          </div>
                        )}
                      </div>

                      {/* Info Content */}
                      <div className="p-3.5 space-y-1.5">
                        <span className="text-[10px] font-bold text-teal-700 dark:text-cyan-400 uppercase tracking-wider block">
                          {video.categoryLabel}
                        </span>
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-teal-700 dark:group-hover:text-cyan-300 transition-colors">
                          {video.title}
                        </h5>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {video.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-cyan-400">
                      <span>{isSelected ? (isEs ? 'Activo en pantalla' : 'Current') : (isEs ? 'Ver video' : 'Play video')}</span>
                      <Play className="w-3.5 h-3.5" />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{isEs ? 'Material validado por psicología escolar' : 'Content validated by school guidance'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold transition-all cursor-pointer"
          >
            {isEs ? 'Cerrar' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
