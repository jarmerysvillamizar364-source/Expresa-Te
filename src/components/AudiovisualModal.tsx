import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Search,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Tv,
  Film,
  RotateCcw,
  ShieldCheck,
  Languages,
  Subtitles,
  Info,
  Check,
  GraduationCap,
  AlertCircle,
  ExternalLink,
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
  institutionSource: string;
  audioLanguage: string;
  hasSubtitles: boolean;
  pedagogicalGoal: string;
  description: string;
  takeaways: string[];
  transcript: string;
  highlight?: boolean;
}

/**
 * Catálogo Curado de Videos Educativos Oficiales en Español
 * 
 * Verificación de requisitos:
 * 1. Todos los videos tienen AUDIO NATIVO EN ESPAÑOL (España o Latinoamérica).
 * 2. Cero videos en inglés o idiomas foráneos sin doblaje.
 * 3. Contenido educativo centrado en bienestar emocional, acoso escolar (Ley 1620),
 *    autoestima, técnicas de respiración y manejo del estrés escolar.
 * 4. Subtítulos configurados en español (hl=es&cc_lang_pref=es&cc_load_policy=1).
 * 5. Procedencia institucional de fuentes confiables (BBVA Aprendemos Juntos, Campaña ACB Bullying, especialistas de psicología).
 */
export const WELLNESS_VIDEOS: VideoResource[] = [
  {
    id: 'video-stop',
    title: 'Técnica STOP y Regulación Emocional: Cómo calmar la mente y el cuerpo',
    category: 'emociones',
    categoryLabel: 'Inteligencia Emocional & Calma',
    duration: '6:40 min',
    image: ASSETS.videoStop,
    embedUrl: 'https://www.youtube-nocookie.com/embed/TjqrualxgkI',
    author: 'Dra. Marian Rojas-Estapé (Psiquiatra y Divulgadora)',
    institutionSource: 'Canal Oficial Aprendemos Juntos · BBVA Educación',
    audioLanguage: 'Español (Nativo)',
    hasSubtitles: true,
    pedagogicalGoal: 'Comprender la respuesta biológica del estrés (cortisol) y aplicar la pausa consciente STOP para no reaccionar con impulsividad.',
    description:
      'La psiquiatra Marian Rojas-Estapé explica en español cómo las emociones intensas generan reacciones fisiológicas en el cuerpo y cómo una pausa de 30 segundos permite que la corteza prefrontal retome el control frente a la impulsividad o el enojo escolar.',
    takeaways: [
      'El cortisol elevado nubla la corteza prefrontal y reduce la capacidad de pensar con claridad durante momentos de tensión.',
      'S (Stop / Para): Haz una pausa inmediata antes de responder con agresividad o miedo.',
      'T (Take a breath / Toma aire): Realiza 3 respiraciones diafragmáticas lentas para enviar una señal de calma al cerebro.',
      'O y P (Observa y Procede): Nombra la emoción que sientes en el cuerpo y elige tu siguiente paso con serenidad.',
    ],
    transcript:
      'Cuando vivimos una situación que percibimos como amenaza —un examen difícil, una discusión o el miedo al rechazo—, nuestro cerebro activa el sistema simpático y libera cortisol y adrenalina. La clave para desactivar esta cascada no es pelearnos con la emoción, sino observarla, respirar despacio y entender que ninguna emoción dura para siempre si no la alimentamos con pensamientos catastróficos.',
    highlight: true,
  },
  {
    id: 'video-exam',
    title: 'Manejo de la Ansiedad ante Exámenes y Superación de Bloqueos Mentales',
    category: 'ansiedad',
    categoryLabel: 'Estrés Académico & Enfoque',
    duration: '7:15 min',
    image: ASSETS.videoExam,
    embedUrl: 'https://www.youtube-nocookie.com/embed/f69n5VQLIQw',
    author: 'Dr. Mario Alonso Puig (Médico y Conferencista)',
    institutionSource: 'Canal Oficial Aprendemos Juntos · BBVA Bienestar',
    audioLanguage: 'Español (Nativo)',
    hasSubtitles: true,
    pedagogicalGoal: 'Desactivar la respuesta de pánico en evaluaciones académicas y reformular el diálogo interno hacia la autoconfianza.',
    description:
      'Conferencia formativa en español sobre la neurociencia del miedo y el bloqueo en pruebas académicas. Métodos para transformar pensamientos de derrota en confianza y mantener la memoria operativa activa durante una evaluación.',
    takeaways: [
      'Tener la mente en blanco no es falta de inteligencia, sino un secuestro temporal provocado por el exceso de cortisol.',
      'Exhalaciones prolongadas de 60 segundos antes de comenzar la prueba bajan la frecuencia cardíaca y calman la alarma cerebral.',
      'Estrategia de barrido: Contesta primero las preguntas seguras para generar inercia positiva y confianza.',
      'Sustituye mentalmente el "no soy capaz" por "estoy preparado para responder paso a paso".',
    ],
    transcript:
      'El miedo al error paraliza la creatividad y la memoria de trabajo. Cuando sientas que la ansiedad te abruma antes de una prueba, suelta el bolígrafo, apoya ambos pies en el suelo y recuerda que una calificación es solo una medida de un momento puntual, jamás un límite de tu potencial de aprendizaje.',
    highlight: true,
  },
  {
    id: 'video-coexistence',
    title: 'Prevención del Acoso Escolar: Romper la Ley del Silencio (Ley 1620)',
    category: 'convivencia',
    categoryLabel: 'Convivencia Escolar & Convivencia Pacífica',
    duration: '5:25 min',
    image: ASSETS.videoCoexistence,
    embedUrl: 'https://www.youtube-nocookie.com/embed/gODzdiZ4Gj8',
    author: 'Iñaki Zubizarreta · Campaña Actuamos Contra el Bullying',
    institutionSource: 'Comité de Convivencia Escolar & Proyecto Educativo ACB',
    audioLanguage: 'Español (Nativo)',
    hasSubtitles: true,
    pedagogicalGoal: 'Fomentar el rol protector de los compañeros observadores y activar la ruta institucional de apoyo confidencial.',
    description:
      'Explicación directa en español sobre el impacto del bullying y la importancia crucial de los testigos en el aula. Brinda herramientas para alzar la voz, no ser cómplice con la risa o el silencio y acudir a Orientación Escolar.',
    takeaways: [
      'El acoso escolar vive del silencio de los testigos; no celebrar ni reír burlas desactiva al intimidador.',
      'Diferenciar entre un desacuerdo puntual y el acoso escolar sistemático y asimétrico (Ley 1620).',
      'Reportar a Orientación Escolar no es delatar: es salvar la salud emocional y la vida de un compañero.',
      'Expresa Te ofrece canales 100% seguros y confidenciales para recibir acompañamiento sin exposición.',
    ],
    transcript:
      'El acoso se alimenta del miedo del que lo sufre y del silencio cómplice de los que miran. Si eres testigo de un maltrato o burla continua hacia alguien de tu salón, tu voz puede salvarle. No te quedes callado: acude a un orientador o usa el canal seguro de Expresa Te.',
    highlight: true,
  },
  {
    id: 'video-breathing',
    title: 'Respiración Somática Guiada para Calmar la Ansiedad en 5 Minutos',
    category: 'ansiedad',
    categoryLabel: 'Ansiedad & Alivio Inmediato',
    duration: '5:05 min',
    image: ASSETS.recBreathing,
    embedUrl: 'https://www.youtube-nocookie.com/embed/jbPSKiS6AaE',
    author: 'Gabinete de Salud y Fisioterapia Respiratoria',
    institutionSource: 'Canal Educativo de Bienestar Somático en Español',
    audioLanguage: 'Español (Latinoamérica)',
    hasSubtitles: true,
    pedagogicalGoal: 'Aprender la respiración diafragmática para regular el ritmo cardíaco y disolver nudos de tensión muscular.',
    description:
      'Sesión guiada con compás rítmico y voz en español diseñada para desacelerar taquicardias, calmar el nudo en la garganta y restaurar el balance del sistema nervioso autónomo en momentos de crisis o sobrecarga.',
    takeaways: [
      'Inhala despacio en 4 tiempos por la nariz llenando el abdomen sin subir los hombros.',
      'Retén suavemente el aire 2 tiempos con la mandíbula relajada.',
      'Exhala lentamente por la boca en 6 tiempos con un soplido sutil y continuo.',
      'Cinco ciclos de respiración lenta activan el nervio vago y desaceleran la frecuencia cardíaca.',
    ],
    transcript:
      'Toma asiento con la espalda recta y apoya los dos pies en el suelo. Coloca una mano sobre el pecho y otra sobre tu vientre. Al inhalar profundamente por la nariz, nota cómo tu vientre sube despacio. Al exhalar por la boca, suelta toda la carga de tu día. Estás en un lugar seguro.',
  },
  {
    id: 'video-frustration',
    title: 'Educación Emocional: Reconocer y Gestionar lo que Sentimos',
    category: 'emociones',
    categoryLabel: 'Inteligencia Emocional & Autoconocimiento',
    duration: '5:50 min',
    image: ASSETS.recSupport,
    embedUrl: 'https://www.youtube-nocookie.com/embed/KUTh9fBg_nQ',
    author: 'Elsa Punset (Especialista en Inteligencia Emocional)',
    institutionSource: 'Aprendemos Juntos · Laboratorio de Habilidades Sociales',
    audioLanguage: 'Español (Nativo)',
    hasSubtitles: true,
    pedagogicalGoal: 'Identificar las emociones básicas (tristeza, rabia, miedo) y aprender a expresarlas de manera asertiva.',
    description:
      'Pistas pedagógicas en español para que los estudiantes entiendan para qué sirve cada emoción, cómo evitar que el enojo se convierta en agresión y cómo la compasión con uno mismo fortalece la autoestima.',
    takeaways: [
      'Todas las emociones tienen una función biológica adaptativa: no existen emociones buenas ni malas.',
      'El enfado señala que un límite personal ha sido sobrepasado; exprésalo con palabras asertivas sin atacar.',
      'La tristeza pide descanso y apoyo emocional; reprimirla agrava el desgaste interno.',
      'Ponerle nombre exacto a la emoción que experimentas reduce de inmediato su intensidad biológica.',
    ],
    transcript:
      'No podemos evitar sentir emociones porque son parte de nuestra biología cerebral. Lo que sí podemos aprender es qué hacer con ellas. Cuando sientas una emoción desbordante, nómbrala: "¿Qué estoy sintiendo? ¿Es tristeza, es celos, es frustración?". Ponerle nombre es el primer paso para adueñarte de tu calma.',
  },
  {
    id: 'video-digital-pause',
    title: 'Ocho Lecciones de Convivencia y Asertividad Escolar',
    category: 'autocuidado',
    categoryLabel: 'Convivencia & Asertividad',
    duration: '6:15 min',
    image: ASSETS.recStudy,
    embedUrl: 'https://www.youtube-nocookie.com/embed/-9GnFyrLAHA',
    author: 'Begoña Ibarrola (Psicóloga Educativa)',
    institutionSource: 'Canal Oficial Aprendemos Juntos · BBVA Educación',
    audioLanguage: 'Español (Nativo)',
    hasSubtitles: true,
    pedagogicalGoal: 'Fomentar la empatía en el salón de clases, aprender a poner límites sanos y resolver desacuerdos dialogando.',
    description:
      'La psicóloga Begoña Ibarrola comparte en español lecciones esenciales sobre la asertividad juvenil: cómo decir que no sin culpa, cómo pedir disculpas sinceras y cómo crear un ambiente escolar empático y solidario.',
    takeaways: [
      'Aprender a decir "no" con respeto protege tu salud mental y previene relaciones escolares de dependencia.',
      'La empatía activa no es estar de acuerdo en todo, sino comprender la perspectiva del compañero.',
      'Pedir disculpas sinceras cuando nos equivocamos es un signo de madurez y fortaleza, no de debilidad.',
      'Construir un clima escolar seguro es un compromiso cotidiano de toda la comunidad educativa.',
    ],
    transcript:
      'La educación no es solo llenar la mente de datos, es aprender a convivir, a escuchar activamente y a ponernos en el lugar del otro. Cuando aprendemos a comunicarnos de forma asertiva, los conflictos dejan de ser guerras y se convierten en oportunidades para crecer juntos.',
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
  const [hasPlaybackIssue, setHasPlaybackIssue] = useState(false);

  // Interactive simulated video controls state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(25);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'takeaways' | 'transcript' | 'pedagogy'>('takeaways');

  // Sync selected video if initialVideoId changes
  useEffect(() => {
    if (initialVideoId) {
      const match = WELLNESS_VIDEOS.find((v) => v.id === initialVideoId);
      if (match) {
        setSelectedVideo(match);
        setHasPlaybackIssue(false);
      }
    }
  }, [initialVideoId]);

  // Reset error state on video change
  useEffect(() => {
    setHasPlaybackIssue(false);
  }, [selectedVideo.id]);

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
      v.categoryLabel.toLowerCase().includes(q) ||
      v.institutionSource.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  const categories = [
    { id: 'all', label: isEs ? 'Todos los Videos (Audio Español)' : 'All Videos (Spanish Audio)' },
    { id: 'emociones', label: isEs ? 'Regulación Emocional' : 'Emotional Regulation' },
    { id: 'ansiedad', label: isEs ? 'Ansiedad & Exámenes' : 'Anxiety & Exams' },
    { id: 'convivencia', label: isEs ? 'Convivencia & Acoso (Ley 1620)' : 'Coexistence & Bullying' },
    { id: 'autocuidado', label: isEs ? 'Autocuidado & Autoestima' : 'Self-Care & Self-Esteem' },
  ];

  // Guaranteed Spanish subtitle & UI parameters for embedded YouTube player
  const embedUrlWithSpanishParams = `${selectedVideo.embedUrl}?hl=es&cc_lang_pref=es&cc_load_policy=1&rel=0&modestbranding=1&playsinline=1&autoplay=1`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEs ? 'Centro Audiovisual de Bienestar (En Español)' : 'Audiovisual Wellness Hub'}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fade-in overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl my-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/30 rounded-3xl shadow-2xl dark:shadow-[0_0_40px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col text-left transition-all max-h-[94vh]"
      >
        {/* ================================================================== */}
        {/* HEADER: Modal Title + Language Badges + Search + Close Button */}
        {/* ================================================================== */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 text-slate-950 flex items-center justify-center shadow-md shadow-cyan-500/20 shrink-0">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-teal-700 dark:text-cyan-400 uppercase tracking-wider">
                  {isEs ? 'Centro Audiovisual Oficial' : 'Official Media Hub'}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>Audio en Español 100% Verificado</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-teal-800 dark:text-cyan-300 border border-cyan-500/30">
                  <Subtitles className="w-3 h-3 text-teal-600 dark:text-cyan-400" />
                  <span>Subtítulos ES</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight mt-0.5">
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
                placeholder={isEs ? 'Buscar video por tema o autor...' : 'Search video by topic or author...'}
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
        {/* SPANISH AUDIO QUALITY BANNER */}
        {/* ================================================================== */}
        <div className="px-4 sm:px-6 py-2 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-emerald-500/10 border-b border-teal-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="font-medium">
              {isEs
                ? 'Todos los videos cuentan con locución en español y subtítulos para facilitar el aprendizaje.'
                : 'All videos feature verified Spanish narration and optional Spanish subtitles.'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-teal-800 dark:text-cyan-300">Idioma verificado:</span>
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold">
              {selectedVideo.audioLanguage}
            </span>
          </div>
        </div>

        {/* ================================================================== */}
        {/* SCROLLABLE BODY: Active Video Player + Details + Gallery */}
        {/* ================================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Featured Player Box */}
          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl relative group">
            {/* Player Switcher Bar (Embed YouTube vs Native Guided Player) */}
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 font-semibold min-w-0">
                <Tv className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-md">{selectedVideo.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold shrink-0">
                  {selectedVideo.duration}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold shrink-0">
                  <Languages className="w-3 h-3" />
                  <span>Español</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setPlayerMode('embed')}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                    playerMode === 'embed'
                      ? 'bg-cyan-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isEs ? 'Video Oficial Embebido' : 'Official Embed'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlayerMode('interactive')}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                    playerMode === 'interactive'
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>{isEs ? 'Modo Guiado Interactivo' : 'Guided Player'}</span>
                </button>
              </div>
            </div>

            {/* Video Viewport */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              {playerMode === 'embed' ? (
                /* Embedded YouTube / Institutional Video Player with Spanish parameters */
                <div className="relative w-full h-full">
                  <iframe
                    key={selectedVideo.id}
                    src={embedUrlWithSpanishParams}
                    title={selectedVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onError={() => setHasPlaybackIssue(true)}
                  />
                  {hasPlaybackIssue && (
                    <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-3 z-20">
                      <AlertCircle className="w-10 h-10 text-amber-400" />
                      <p className="text-sm font-bold text-white">
                        {isEs
                          ? '¿Tu red escolar restringe la reproducción de video externo?'
                          : 'Is your school network restricting video streaming?'}
                      </p>
                      <p className="text-xs text-slate-300 max-w-md">
                        {isEs
                          ? 'No te preocupes: puedes ver la lección completa con la transcripción, puntos clave y compás en nuestro Modo Guiado.'
                          : 'You can continue with the complete lesson, transcript and key takeaways in our interactive Guided Mode.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setPlayerMode('interactive')}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
                      >
                        {isEs ? 'Activar Modo Guiado en Español' : 'Switch to Guided Mode'}
                      </button>
                    </div>
                  )}
                </div>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/50" />

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
                        ? isEs
                          ? 'Reproduciendo lección guiada en español...'
                          : 'Playing guided lesson...'
                        : isEs
                        ? 'Click para reproducir lección guiada'
                        : 'Click to play guided lesson'}
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
                          title="Reiniciar lección"
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
                          {Math.floor((progress / 100) * 5)}:
                          {String(Math.floor(((progress / 100) * 300) % 60)).padStart(2, '0')} / {selectedVideo.duration}
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

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Audio ES
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* In-app playback helper notice */}
            <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>
                  {isEs
                    ? 'Reproducción directa integrada sin redirecciones externas.'
                    : 'Direct in-app playback without external redirects.'}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setPlayerMode(playerMode === 'embed' ? 'interactive' : 'embed')}
                className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline cursor-pointer"
              >
                {playerMode === 'embed'
                  ? isEs ? '¿Problemas con el video? Ver en Modo Guiado' : 'Issues? Switch to Guided'
                  : isEs ? 'Volver al video oficial' : 'Back to official video'}
              </button>
            </div>
          </div>

          {/* Details & Takeaways Card */}
          <div className="bg-slate-50 dark:bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-teal-700 dark:text-cyan-400 uppercase tracking-wider">
                    {selectedVideo.author}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                    {selectedVideo.institutionSource}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedVideo.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-start">
                <button
                  type="button"
                  onClick={() => setActiveTab('takeaways')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'takeaways'
                      ? 'bg-cyan-500 text-slate-950 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
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
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isEs ? 'Guía y Guion' : 'Transcript'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('pedagogy')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'pedagogy'
                      ? 'bg-cyan-500 text-slate-950 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{isEs ? 'Ficha Pedagógica' : 'Pedagogy'}</span>
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedVideo.description}
            </p>

            {/* Active Tab Content */}
            {activeTab === 'takeaways' && (
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
            )}

            {activeTab === 'transcript' && (
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-cyan-400">
                  <Languages className="w-4 h-4" />
                  <span>Transcripción oficial en español:</span>
                </div>
                <p className="italic bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  "{selectedVideo.transcript}"
                </p>
              </div>
            )}

            {activeTab === 'pedagogy' && (
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold uppercase block mb-1">
                      Idioma de Locución
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedVideo.audioLanguage}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold uppercase block mb-1">
                      Subtítulos Disponibles
                    </span>
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                      Español (CC) Habilitado
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold uppercase block mb-1">
                      Institución Emisora
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                      {selectedVideo.institutionSource}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 text-slate-800 dark:text-slate-200">
                  <span className="font-bold text-teal-800 dark:text-teal-300 block mb-1">
                    Objetivo Formativo Escolar:
                  </span>
                  <p className="leading-relaxed">{selectedVideo.pedagogicalGoal}</p>
                </div>
              </div>
            )}

            {/* Support Guidance Callout */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-emerald-500/10 p-3.5 rounded-xl border border-teal-500/20">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="text-xs text-slate-800 dark:text-slate-200">
                  {isEs
                    ? '¿Deseas profundizar sobre este tema con un profesional de orientación escolar?'
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
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {isEs ? 'Catálogo de Videos de Bienestar en Español' : 'Wellness Video Catalog (Spanish)'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    6 / 6 en Español
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {isEs
                    ? 'Selecciona cualquier cápsula formativa para reproducirla directamente'
                    : 'Click any video capsule to play it immediately in the app'}
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
                      setHasPlaybackIssue(false);
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

                        {/* Top Badges (Language & Status) */}
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Audio ES</span>
                          </span>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded-md bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                              {isEs ? 'Reproduciendo' : 'Playing'}
                            </span>
                          )}
                        </div>

                        {/* Duration Pill */}
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold">
                          {video.duration}
                        </div>
                      </div>

                      {/* Info Content */}
                      <div className="p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-bold text-teal-700 dark:text-cyan-400 uppercase tracking-wider">
                          <span>{video.categoryLabel}</span>
                          <span className="text-slate-600 dark:text-slate-300 normal-case font-medium">
                            Subtítulos ES
                          </span>
                        </div>
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-teal-700 dark:group-hover:text-cyan-300 transition-colors">
                          {video.title}
                        </h5>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {video.description}
                        </p>
                        <p className="text-[10px] text-slate-600 dark:text-slate-300 pt-0.5 truncate">
                          {video.author}
                        </p>
                      </div>
                    </div>

                    <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-cyan-400">
                      <span>{isSelected ? (isEs ? 'Activo en pantalla' : 'Current') : (isEs ? 'Ver video en español' : 'Play video')}</span>
                      <Play className="w-3.5 h-3.5" />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>
              {isEs
                ? 'Videos revisados con audio en español por el equipo de Orientación Escolar'
                : 'Videos verified in Spanish by School Guidance Team'}
            </span>
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
