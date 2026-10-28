import React, { useEffect, useRef, useState } from 'react';
import { ASSETS, Language, translations } from '../data/translations';
import {
  BreathingPhase,
  playOvenTimerBeep,
  COMPLETION_MESSAGE_ES,
  COMPLETION_MESSAGE_EN,
} from '../utils/breathingEngine';

interface ScreenProps {
  lang: Language;
  onNavigate: (screen: string) => void;
  onShowToast: (msg: string) => void;
}

export interface ResourceItem {
  id: string;
  title: string;
  format: 'video' | 'audio' | 'infografia' | 'guia';
  category: 'ansiedad' | 'academico' | 'convivencia' | 'emociones';
  duration: string;
  image: string;
  embedUrl?: string;
  desc: string;
  takeaways: string[];
  transcript?: string;
  author: string;
}

export const ResourcesScreen: React.FC<ScreenProps> = ({
  lang,
  onNavigate,
  onShowToast,
}) => {
  const t = translations[lang].resources;
  const isEs = lang === 'es';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'video' | 'audio' | 'infografia'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ansiedad' | 'academico' | 'convivencia' | 'emociones'>('all');
  const [activeMedia, setActiveMedia] = useState<ResourceItem | null>(null);

  // Video player interactive & embed state
  const [videoPlayerMode, setVideoPlayerMode] = useState<'embed' | 'interactive'>('embed');
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(25);
  const [audioProgress, setAudioProgress] = useState(15);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && activeMedia) {
      interval = setInterval(() => {
        if (activeMedia.format === 'video') {
          setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 1));
        } else if (activeMedia.format === 'audio') {
          setAudioProgress((prev) => (prev >= 100 ? 0 : prev + 1));
        }
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeMedia]);

  const resources: ResourceItem[] = [
    {
      id: 'video-stop',
      title: isEs ? 'Técnica STOP y Regulación Emocional (Marian Rojas-Estapé)' : 'STOP Technique for Emotional Regulation',
      format: 'video',
      category: 'emociones',
      duration: '6:40 min',
      image: ASSETS.videoStop,
      embedUrl: 'https://www.youtube-nocookie.com/embed/Dm9Wcfqa220',
      desc: isEs
        ? 'Aprende los cuatro pasos de la técnica STOP con la psiquiatra Marian Rojas para frenar impulsos, regular el cortisol y responder con claridad.'
        : 'Master the 4 steps of the STOP technique to pause impulsive reactions, soothe your nervous system, and respond calmly.',
      author: isEs ? 'Dra. Marian Rojas-Estapé · Aprendemos Juntos' : 'Dr. Marian Rojas-Estapé',
      takeaways: isEs
        ? [
            'S (Stop / Para): Haz un alto inmediato antes de responder con enojo o miedo.',
            'T (Take a breath / Toma aire): Realiza 3 respiraciones diafragmáticas lentas.',
            'O (Observe / Observa): Identifica qué emoción sientes en tu cuerpo sin juzgarla.',
            'P (Proceed / Procede): Elige con serenidad tu siguiente acción constructiva.',
          ]
        : [
            'S (Stop): Pause immediately before reacting with anger or panic.',
            'T (Take a breath): Take 3 slow, deep abdominal breaths.',
            'O (Observe): Notice the sensations in your body without judgment.',
            'P (Proceed): Choose your next step with composure and intention.',
          ],
      transcript: isEs
        ? 'Cuando vivimos una situación que percibimos como amenaza —un examen difícil, una discusión o el miedo al rechazo—, nuestro cerebro activa el sistema simpático y libera cortisol y adrenalina. La clave para desactivar esta cascada no es pelearnos con la emoción, sino observarla, respirar despacio y entender que ninguna emoción dura para siempre si no la alimentamos con pensamientos catastróficos.'
        : 'When stress escalates, our amygdala takes charge. Pausing for 30 seconds enables the prefrontal cortex to regain equilibrium. Inhale slowly and relax your shoulders. Labeling your emotion reduces its biological arousal significantly.',
    },
    {
      id: 'video-exam',
      title: isEs ? 'Manejo de la Ansiedad ante Evaluaciones y Bloqueo Mental' : 'Managing Exam Anxiety & Cognitive Overload',
      format: 'video',
      category: 'academico',
      duration: '7:15 min',
      image: ASSETS.videoExam,
      embedUrl: 'https://www.youtube-nocookie.com/embed/f69n5VQLIQw',
      desc: isEs
        ? 'Estrategias de neurociencia con el Dr. Mario Alonso Puig para vencer el bloqueo mental, transformar el miedo al error y rendir al máximo.'
        : 'Neuroscience-backed strategies to overcome mental blocks, structure study sessions, and stay grounded during test day.',
      author: isEs ? 'Dr. Mario Alonso Puig · Aprendemos Juntos' : 'Dr. Mario Alonso Puig',
      takeaways: isEs
        ? [
            'Tener la mente en blanco no es falta de capacidad, sino una sobrecarga temporal de cortisol.',
            'Exhalaciones prolongadas de 60 segundos antes de comenzar la prueba bajan la frecuencia cardíaca.',
            'Lectura panorámica: Responde primero lo que sabes con certeza para afianzar confianza.',
            'Sustituye mentalmente el "no soy capaz" por "estoy preparado para responder paso a paso".',
          ]
        : [
            'Study in 25-minute Pomodoro intervals with 5-minute movement pauses.',
            'Systematic desensitization: Practice timed mini-quizzes without devices.',
            'Pre-exam grounding: 2 minutes of rhythmic breathing before opening the exam.',
            'Answer high-confidence questions first to build momentum and calm dopamine.',
          ],
      transcript: isEs
        ? 'El miedo al error paraliza la creatividad y la memoria de trabajo. Cuando sientas que la ansiedad te abruma antes de una prueba, suelta el bolígrafo, apoya ambos pies en el suelo y recuerda que una calificación es solo una medida de un momento puntual, jamás un límite de tu potencial de aprendizaje.'
        : 'A blank mind during exams is an acute stress reaction, not a lack of knowledge. If your heart races, plant both feet firmly on the ground, set your pen down for 15 seconds, and exhale longer than you inhale.',
    },
    {
      id: 'video-coexistence',
      title: isEs ? 'Prevención del Acoso Escolar: Romper la Ley del Silencio (Ley 1620)' : 'Assertive Communication & Peaceful Coexistence',
      format: 'video',
      category: 'convivencia',
      duration: '5:25 min',
      image: ASSETS.videoCoexistence,
      embedUrl: 'https://www.youtube-nocookie.com/embed/gODzdiZ4Gj8',
      desc: isEs
        ? 'Testimonio y pautas de acción sobre el rol vital de los compañeros observadores para frenar el acoso escolar y acudir a Orientación Escolar.'
        : 'Learn how to set firm, respectful boundaries, resolve peer conflicts, and stand as an active positive ally against bullying.',
      author: isEs ? 'Iñaki Zubizarreta · Actuamos Contra el Bullying' : 'Anti-Bullying Campaign',
      takeaways: isEs
        ? [
            'El acoso escolar vive del silencio de los testigos; no celebrar burlas desactiva al intimidador.',
            'Diferenciar entre desacuerdo puntual y acoso escolar repetitivo (Ley 1620).',
            'Reportar a Orientación Escolar no es delatar: es salvar la dignidad y vida de un compañero.',
            'Ruta institucional segura: Orientación escolar escucha sin exponer a quien consulta.',
          ]
        : [
            'Assertive formula: "When [action occurs], I feel [emotion] and I need [clear request]".',
            'Distinguish between healthy disagreement and recurring intimidation.',
            'The observer ally: Never reinforce bullying; report discreetly through safe school channels.',
            'Institutional safety route: Counselors handle all conversations confidentially.',
          ],
      transcript: isEs
        ? 'El acoso se alimenta del miedo del que lo sufre y del silencio cómplice de los que miran. Si eres testigo de un maltrato o burla continua hacia alguien de tu salón, tu voz puede salvarle. No te quedes callado: acude a un orientador o usa el canal seguro de Expresa Te.'
        : 'Assertiveness is neither aggression nor passivity. It is standing up for yourself while maintaining respect for others. State clearly and serenely: "I do not appreciate that tone. Let us speak with respect."',
    },
    {
      id: 'infographic-scale',
      title: isEs ? 'Termómetro Emocional: Reconocimiento y Niveles de Alerta' : 'Emotional Thermometer: Awareness & Regulation Levels',
      format: 'infografia',
      category: 'emociones',
      duration: 'Lectura visual',
      image: ASSETS.infographicEmotional,
      desc: isEs
        ? 'Guía infográfica interactiva para identificar en qué zona de activación te encuentras (Verde, Amarilla, Naranja o Roja) y qué herramienta aplicar.'
        : 'Interactive visual guide to determine your emotional activation zone and choose the right grounding response.',
      author: isEs ? 'Departamento de Bienestar' : 'Wellbeing Department',
      takeaways: isEs
        ? [
            'Zona Verde (Calma): Mente receptiva y pulso relajado. Ideal para aprender y convivir.',
            'Zona Amarilla (Inquietud): Tensión leve o dispersión. Requiere pausa activa de 2 minutos.',
            'Zona Naranja (Ansiedad / Enojo): Pulso alto y pensamiento acelerado. Aplicar técnica 4-7-8.',
            'Zona Roja (Crisis / Bloqueo): Sensación de desborde. Acude a Orientación o llama a la Línea 106.',
          ]
        : [
            'Green Zone (Calm): Open, receptive mind. Optimal for learning and social engagement.',
            'Yellow Zone (Restless): Mild tension or distractibility. Take a 2-minute stretch.',
            'Orange Zone (Anxiety / Anger): Elevated heart rate. Engage 4-7-8 rhythmic breathing.',
            'Red Zone (Crisis): Overwhelm. Seek guidance staff immediately or call Line 106.',
          ],
    },
    {
      id: 'audio-meditation',
      title: isEs ? 'Meditación Guiada: Descompresión de Fin de Jornada' : 'Guided Meditation: End-of-Day Decompression',
      format: 'audio',
      category: 'ansiedad',
      duration: '5:20 min',
      image: ASSETS.recBreathing,
      desc: isEs
        ? 'Audioguía con voz relajante y música ambiental suave para soltar el cansancio de las clases y reiniciar tu mente.'
        : 'Gentle voice meditation with ambient soundscapes to release school tension and reset your mind.',
      author: isEs ? 'Orientación Escolar' : 'School Counseling',
      takeaways: isEs
        ? [
            'Liberación de contracturas en cuello, mandíbula y trapecio.',
            'Visualización de un espacio de calma personal.',
            'Transición consciente de la jornada escolar al descanso en casa.',
          ]
        : [
            'Progressive release of jaw, neck, and shoulder tightness.',
            'Visualization of a secure, personal mental haven.',
            'Smooth transition from academic demands into restful home space.',
          ],
    },
    {
      id: 'audio-podcast',
      title: isEs ? 'Podcast Breve: ¿Qué pasa cuando vas a orientación escolar?' : 'Short Podcast: What Happens in School Guidance?',
      format: 'audio',
      category: 'emociones',
      duration: '4:40 min',
      image: ASSETS.recSupport,
      desc: isEs
        ? 'Conversación cercana con el equipo de psicología desmitificando la consulta: confidencialidad, empatía y acompañamiento sin juicios.'
        : 'Demystifying the school counselor appointment: confidentiality, warmth, and supportive listening.',
      author: isEs ? 'Gabinete de Psicología' : 'Psychology Office',
      takeaways: isEs
        ? [
            'No necesitas tener un "gran problema" para acudir; conversar siempre aclara.',
            'Garantía estricta de confidencialidad y sigilo profesional.',
            'Tú decides el ritmo de la conversación; nadie te forzará a hablar de lo que no desees.',
          ]
        : [
            'You do not need a crisis to consult; talking early brings clarity.',
            'Guaranteed professional ethics and confidential records.',
            'You control the pace; you share only what feels comfortable.',
          ],
    },
  ];

  // Filtered resources
  const filtered = resources.filter((r) => {
    const matchFormat = selectedFormat === 'all' || r.format === selectedFormat;
    const matchCat = selectedCategory === 'all' || r.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.desc.toLowerCase().includes(q) ||
      r.author.toLowerCase().includes(q);
    return matchFormat && matchCat && matchQuery;
  });

  return (
    <div className="flex flex-col w-full space-y-10 pb-16 animate-fade-in text-left">
      {/* 1. Hero Banner: Audiovisual & Educational Hub */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-highest p-6 sm:p-10 border border-outline-variant/30 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="material-symbols-outlined text-[18px]">smart_display</span>
            <span>{isEs ? 'Centro de Educación Emocional & Audiovisuales' : 'Emotional Education & Audiovisual Hub'}</span>
          </div>
          <h1 className="font-headline-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {isEs ? 'Recursos Audiovisuales para tu Bienestar' : 'Audiovisual Resources for Your Wellbeing'}
          </h1>
          <p className="font-body-md text-slate-700 dark:text-slate-300 leading-relaxed">
            {isEs
              ? 'Videos pedagógicos, masterclasses interactivas, audioguías de meditación e infografías diseñadas para ayudarte a comprender tus emociones y fortalecer tu convivencia escolar.'
              : 'Educational videos, masterclasses, guided relaxation audios, and clear infographics crafted to help you understand emotions and thrive at school.'}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-container-lowest text-primary shadow-2xs border border-outline-variant/30 font-label-md font-bold">
            <span className="material-symbols-outlined text-[18px] text-tertiary">verified</span>
            <span>{isEs ? 'Material Oficial Validado' : 'Validated Guidance Material'}</span>
          </div>
          <span className="text-xs text-on-surface-variant">
            {isEs ? 'Acceso libre, pedagógico y 100% confidencial' : 'Free, educational and confidential'}
          </span>
        </div>
      </section>

      {/* 2. Interactive Search & Multi-format Filter Controls */}
      <section className="bg-surface-container-lowest p-4 sm:p-5 rounded-3xl border border-outline-variant/30 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-lg">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEs ? 'Buscar por tema, técnica o palabra clave...' : 'Search topics, techniques, keywords...'}
            className="w-full h-11 pl-11 pr-4 bg-surface-container-low text-on-surface placeholder:text-outline-variant font-body-md rounded-xl border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all"
          />
        </div>

        {/* Format Segmented Filter Bar (Zero-pill button controls) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 p-1 bg-surface-container-low rounded-2xl border border-outline-variant/20">
          {[
            { id: 'all' as const, label: isEs ? 'Todos' : 'All', icon: 'grid_view' },
            { id: 'video' as const, label: isEs ? 'Videos' : 'Videos', icon: 'smart_display' },
            { id: 'audio' as const, label: isEs ? 'Audios' : 'Audios', icon: 'headphones' },
            { id: 'infografia' as const, label: isEs ? 'Infografías' : 'Infographics', icon: 'image' },
          ].map((fmt) => {
            const active = selectedFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setSelectedFormat(fmt.id)}
                className={`flex items-center gap-1.5 h-9 px-3.5 rounded-xl font-label-sm font-bold transition-all cursor-pointer whitespace-nowrap active:scale-[0.98] ${
                  active
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">{fmt.icon}</span>
                <span>{fmt.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Category Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-bold text-on-surface-variant whitespace-nowrap mr-1">
          {isEs ? 'Temática:' : 'Topic:'}
        </span>
        {[
          { id: 'all' as const, label: isEs ? 'Todas las temáticas' : 'All topics' },
          { id: 'emociones' as const, label: isEs ? 'Inteligencia Emocional' : 'Emotional Intelligence' },
          { id: 'ansiedad' as const, label: isEs ? 'Ansiedad y Calma' : 'Anxiety & Calm' },
          { id: 'academico' as const, label: isEs ? 'Estrés Académico' : 'Academic Focus' },
          { id: 'convivencia' as const, label: isEs ? 'Convivencia & Asertividad' : 'Coexistence & Peer Care' },
        ].map((c) => {
          const active = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`h-8 px-3 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-primary-fixed/50 text-primary font-bold border border-primary/30'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* 4. Multi-Column Grid of Enriched Audiovisual Resources */}
      {filtered.length === 0 ? (
        <div className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant/30 text-center flex flex-col items-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[24px]">search_off</span>
          </div>
          <h3 className="font-title-md font-bold text-on-surface">
            {isEs ? 'No se encontraron recursos' : 'No resources found'}
          </h3>
          <p className="text-xs text-on-surface-variant">
            {isEs
              ? 'Prueba con otra palabra clave o selecciona "Todos" en los filtros.'
              : 'Try different keywords or reset filter options.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedFormat('all');
              setSelectedCategory('all');
            }}
            className="h-9 px-4 rounded-xl bg-primary text-on-primary text-xs font-bold cursor-pointer"
          >
            {isEs ? 'Restablecer filtros' : 'Reset filters'}
          </button>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <article
              key={item.id}
              onClick={() => {
                setActiveMedia(item);
                setIsPlaying(false);
                setVideoProgress(15);
                setAudioProgress(10);
              }}
              className="group bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/30 shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all flex flex-col justify-between cursor-pointer"
            >
              {/* Media Preview Card */}
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-surface-container-high">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle contrast scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Play / Inspect overlay icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[26px]">
                        {item.format === 'video'
                          ? 'play_arrow'
                          : item.format === 'audio'
                          ? 'volume_up'
                          : 'visibility'}
                      </span>
                    </div>
                  </div>

                  {/* Media duration / format badge */}
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">
                      {item.format === 'video' ? 'movie' : item.format === 'audio' ? 'mic' : 'photo_library'}
                    </span>
                    <span>{item.duration}</span>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-5 space-y-2.5">
                  {/* Clean unboxed metadata with bullet separator (zero-pill constitution) */}
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                    <span className="text-primary font-bold capitalize">{item.format}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.author}</span>
                  </div>

                  <h3 className="font-title-md font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="font-body-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-5 pb-5 pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs font-bold text-primary">
                <span>{item.format === 'video' ? 'Ver video interactivo' : item.format === 'audio' ? 'Escuchar meditación' : 'Ver infografía'}</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* 5. Support Callout: Route to School Guidance */}
      <section className="relative overflow-hidden bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-high rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">support_agent</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-title-lg font-bold text-on-surface">
              {isEs ? '¿Quieres profundizar con un profesional?' : 'Would you like to talk with a counselor?'}
            </h3>
            <p className="font-body-sm text-on-surface-variant max-w-xl leading-relaxed">
              {isEs
                ? 'Los recursos audiovisuales son formativos. Si estás pasando por un momento difícil, nuestro equipo de orientación escolar te escucha de forma confidencial.'
                : 'Educational tools provide insight. If you are facing a difficult period, our school counseling team offers confidential support.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('orientacion')}
          className="h-11 px-5 rounded-xl bg-secondary text-on-secondary font-label-md font-bold shadow-xs hover:bg-secondary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[19px]">forum</span>
          <span>{isEs ? 'Solicitar cita privada' : 'Book confidential appointment'}</span>
        </button>
      </section>

      {/* ==================================================================== */}
      {/* INTERACTIVE MEDIA VIEWER MODAL */}
      {/* ==================================================================== */}
      {activeMedia && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => {
            setActiveMedia(null);
            setIsPlaying(false);
          }}
          className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30 flex flex-col text-left animate-scale-in"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-low">
              <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  {activeMedia.format === 'video'
                    ? 'smart_display'
                    : activeMedia.format === 'audio'
                    ? 'headphones'
                    : 'image'}
                </span>
                <span className="uppercase tracking-wider font-bold text-primary">
                  {activeMedia.format}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeMedia.duration}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveMedia(null);
                  setIsPlaying(false);
                }}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Scrollable Media Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Media Player Area */}
              {activeMedia.format === 'video' && (
                <div className="space-y-3">
                  {/* Mode switcher bar */}
                  {activeMedia.embedUrl && (
                    <div className="flex items-center justify-between pb-1 text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {isEs ? 'Reproductor Multimedia' : 'Media Player'}
                      </span>
                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => setVideoPlayerMode('embed')}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                            videoPlayerMode === 'embed'
                              ? 'bg-cyan-500 text-slate-950 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {isEs ? 'Video Embebido' : 'Embed Player'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoPlayerMode('interactive')}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                            videoPlayerMode === 'interactive'
                              ? 'bg-emerald-500 text-slate-950 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {isEs ? 'Modo Guiado' : 'Guided Player'}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-md flex items-center justify-center">
                    {videoPlayerMode === 'embed' && activeMedia.embedUrl ? (
                      <iframe
                        src={`${activeMedia.embedUrl}?hl=es&cc_lang_pref=es&cc_load_policy=1&rel=0&playsinline=1&autoplay=1`}
                        title={activeMedia.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        <img
                          src={activeMedia.image}
                          alt={activeMedia.title}
                          className={`w-full h-full object-cover transition-opacity duration-300 ${
                            isPlaying ? 'opacity-85' : 'opacity-70'
                          }`}
                        />

                        {/* Active playback visual overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              const next = !isPlaying;
                              setIsPlaying(next);
                              onShowToast(next ? 'Reproduciendo video...' : 'Video en pausa');
                            }}
                            className="w-16 h-16 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[36px]">
                              {isPlaying ? 'pause' : 'play_arrow'}
                            </span>
                          </button>
                        </div>

                        {/* Video Player Controls Bar */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-1.5">
                          {/* Scrub bar */}
                          <div
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const clickX = e.clientX - rect.left;
                              const pct = Math.round((clickX / rect.width) * 100);
                              setVideoProgress(pct);
                            }}
                            className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer overflow-hidden"
                          >
                            <div
                              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all"
                              style={{ width: `${videoProgress}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-white text-[11px] font-mono">
                            <div className="flex items-center gap-2">
                              <span>
                                {Math.floor((videoProgress / 100) * 4)}:
                                {String(Math.floor(((videoProgress / 100) * 255) % 60)).padStart(2, '0')}
                              </span>
                              <span>/</span>
                              <span>{activeMedia.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px] text-white">volume_up</span>
                              <span className="text-[10px] font-sans font-bold bg-white/20 px-1.5 py-0.5 rounded">
                                HD 1080p
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeMedia.format === 'audio' && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-fixed/30 to-secondary-fixed/20 border border-primary/20 space-y-4">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        const next = !isPlaying;
                        setIsPlaying(next);
                        onShowToast(next ? 'Reproduciendo audio...' : 'Audio en pausa');
                      }}
                      className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer shrink-0"
                    >
                      <span className="material-symbols-outlined text-[32px]">
                        {isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-primary block">
                        {isEs ? 'Audioguía Guiada' : 'Guided Audio'}
                      </span>
                      <h4 className="font-title-md font-bold text-on-surface truncate">
                        {activeMedia.title}
                      </h4>
                      <span className="text-xs text-on-surface-variant font-mono">
                        {Math.floor((audioProgress / 100) * 5)}:{String(Math.floor(((audioProgress / 100) * 320) % 60)).padStart(2, '0')} / {activeMedia.duration}
                      </span>
                    </div>
                  </div>

                  {/* Audio Waveform Simulator */}
                  <div className="flex items-center gap-1 h-8 pt-1">
                    {[40, 65, 80, 50, 90, 75, 45, 100, 60, 85, 40, 70, 95, 55, 80, 65, 90, 45, 60, 80, 50, 75, 85, 60].map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          (i / 24) * 100 <= audioProgress ? 'bg-primary' : 'bg-outline-variant/40'
                        }`}
                        style={{ height: isPlaying ? `${Math.max(20, (h * Math.sin(i + audioProgress)) % 100)}%` : `${h * 0.4}%` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeMedia.format === 'infografia' && (
                <div className="space-y-3">
                  <div className="rounded-2xl overflow-hidden border border-outline-variant/30 shadow-md bg-white">
                    <img
                      src={activeMedia.image}
                      alt={activeMedia.title}
                      className="w-full h-auto object-contain max-h-[380px] mx-auto"
                    />
                  </div>
                </div>
              )}

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-on-surface">
                  {activeMedia.title}
                </h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  {activeMedia.desc}
                </p>
              </div>

              {/* Practical Takeaways / Steps */}
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-3">
                <h4 className="font-title-sm font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check_circle
                  </span>
                  <span>{isEs ? 'Puntos clave y aplicación práctica:' : 'Key takeaways & practical steps:'}</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-on-surface leading-relaxed">
                  {activeMedia.takeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Transcript drawer if available */}
              {activeMedia.transcript && (
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
                  <span className="font-label-sm font-bold text-on-surface-variant uppercase tracking-wider block">
                    {isEs ? 'Transcripción pedagógica:' : 'Educational transcript:'}
                  </span>
                  <p className="text-xs text-on-surface-variant italic leading-relaxed">
                    "{activeMedia.transcript}"
                  </p>
                </div>
              )}
            </div>

            {/* Modal Bottom Close */}
            <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-medium">
                {isEs ? 'Expresa Te • Material Formativo' : 'Expresa Te • Educational Asset'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveMedia(null);
                  setIsPlaying(false);
                }}
                className="h-10 px-5 rounded-xl bg-primary text-on-primary font-label-md font-bold cursor-pointer hover:bg-primary/95 transition-colors"
              >
                {isEs ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SELF-CARE CENTER: STRICTLY LIVE INTERACTIVE TOOLS (ZERO DUPLICATION)
// ============================================================================
export const SelfCareScreen: React.FC<ScreenProps> = ({
  lang,
  onShowToast,
}) => {
  const isEs = lang === 'es';

  // Active tool tab: 'breathing' | 'grounding' | 'pomodoro' | 'journal'
  const [activeTool, setActiveTool] = useState<'breathing' | 'grounding' | 'pomodoro' | 'journal'>('breathing');

  // 1. BREATHING TRAINER STATE (STRICT 4-7-8 SINGLE CYCLE, ZERO INFINITE LOOP, OVEN BEEP ON COMPLETION)
  const [breathingMode, setBreathingMode] = useState<'478' | 'box'>('478');
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>('idle');
  const [timerSeconds, setTimerSeconds] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(0.7);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or resume audio context safely on user gesture
  const initAudio = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          audioCtxRef.current = new AudioCtxClass();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
    } catch {
      // AudioContext unavailable or restricted
    }
  };

  // Stop breathing manually (does NOT play completion beep)
  const stopBreathing = (reason: 'cancel' | 'switchMode' = 'cancel') => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setBreathingPhase('idle');
    setTimerSeconds(4);
    if (reason === 'cancel') {
      onShowToast(isEs ? 'Ejercicio detenido.' : 'Exercise paused.');
    }
  };

  // Start breathing (strictly single 19s sequence for 4-7-8)
  const startBreathing = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    initAudio();
    setBreathingPhase('inhale');
    setTimerSeconds(4);
    onShowToast(isEs ? 'Respiración iniciada. Inhala suavemente por la nariz.' : 'Breathing started. Inhale gently through your nose.');
  };

  // Single-cycle countdown effect
  useEffect(() => {
    // When idle or completed, do not run timers
    if (breathingPhase === 'idle' || breathingPhase === 'completed') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // prev === 1 -> phase transition
        if (breathingMode === '478') {
          if (breathingPhase === 'inhale') {
            setBreathingPhase('hold');
            return 7;
          } else if (breathingPhase === 'hold') {
            setBreathingPhase('exhale');
            return 8;
          } else if (breathingPhase === 'exhale') {
            // STRICT COMPLETION: end of 8s exhale (total 19s)
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            setBreathingPhase('completed');

            // Play oven-like timer finish beep if sound enabled
            if (soundEnabled) {
              playOvenTimerBeep(soundVolume, audioCtxRef.current);
            }

            onShowToast(isEs ? COMPLETION_MESSAGE_ES : COMPLETION_MESSAGE_EN);
            return 0;
          }
        } else {
          // Box 4-4-4-4
          if (breathingPhase === 'inhale') {
            setBreathingPhase('hold');
            return 4;
          } else if (breathingPhase === 'hold') {
            setBreathingPhase('exhale');
            return 4;
          } else if (breathingPhase === 'exhale') {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            setBreathingPhase('completed');
            if (soundEnabled) {
              playOvenTimerBeep(soundVolume, audioCtxRef.current);
            }
            onShowToast(isEs ? COMPLETION_MESSAGE_ES : COMPLETION_MESSAGE_EN);
            return 0;
          }
        }
        return prev;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [breathingPhase, breathingMode, soundEnabled, soundVolume, isEs, onShowToast]);

  // Clean unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // 2. 5-4-3-2-1 GROUNDING STATE
  const [groundingChecks, setGroundingChecks] = useState<Record<number, boolean>>({});
  const toggleGrounding = (idx: number) => {
    setGroundingChecks((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const groundingSteps = [
    { num: 5, label: isEs ? '5 cosas que puedas VER a tu alrededor (fíjate en colores, sombras, detalles)' : '5 things you can SEE around you (look for textures, colors)' },
    { num: 4, label: isEs ? '4 cosas que puedas TOCAR o sentir físicamente (la tela de tu ropa, la mesa, tus pies)' : '4 things you can physically TOUCH (your clothes, chair, feet on ground)' },
    { num: 3, label: isEs ? '3 sonidos que puedas ESCUCHAR (el viento, una voz distante, tu respiración)' : '3 sounds you can HEAR right now (wind, footsteps, distant hum)' },
    { num: 2, label: isEs ? '2 aromas que puedas OLER o evocar mentalmente (menta, lluvia fresca)' : '2 scents you can SMELL or recall in your mind' },
    { num: 1, label: isEs ? '1 cualidad o pensamiento positivo sobre ti mismo ("Soy capaz", "Estoy a salvo")' : '1 positive thought or affirmation about yourself' },
  ];

  // 3. POMODORO STUDY TIMER STATE
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<'study' | 'rest'>('study');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pomodoroRunning) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => {
          if (prev <= 1) {
            const nextMode = pomodoroMode === 'study' ? 'rest' : 'study';
            setPomodoroMode(nextMode);
            onShowToast(nextMode === 'rest' ? '¡Tiempo de estudio cumplido! Tómate 5 minutos de pausa activa.' : 'Pausa finalizada. ¡A estudiar con foco!');
            return nextMode === 'rest' ? 5 * 60 : 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomodoroRunning, pomodoroMode]);

  const formatPomoTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // 4. EMOTIONAL JOURNAL STATE
  const [journalText, setJournalText] = useState('');
  const [journalFeedback, setJournalFeedback] = useState<string | null>(null);

  const handleReleaseJournal = () => {
    if (!journalText.trim()) return;
    setJournalFeedback(
      isEs
        ? '🌱 Has liberado este pensamiento de tu mente. Reconocer lo que sientes es el primer paso hacia la calma.'
        : '🌱 You have cleared this thought from your mind. Giving words to feelings is the path to serenity.'
    );
    setJournalText('');
    setTimeout(() => setJournalFeedback(null), 6000);
  };

  return (
    <div className="flex flex-col w-full space-y-10 pb-16 animate-fade-in text-left">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-highest p-6 sm:p-10 border border-outline-variant/30 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="material-symbols-outlined text-[18px]">self_improvement</span>
            <span>{isEs ? 'Centro de Autocuidado y Prácticas Activas' : 'Self-Care Center & Live Practice'}</span>
          </div>
          <h1 className="font-headline-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {isEs ? 'Herramientas Prácticas para el Día a Día' : 'Daily Practical Grounding Tools'}
          </h1>
          <p className="font-body-md text-slate-700 dark:text-slate-300 leading-relaxed">
            {isEs
              ? 'Espacio interactivo de entrenamiento: respiración guiada, anclaje sensorial, temporizador de estudio y descarga mental confidencial.'
              : 'Interactive wellbeing workshop: paced breathing, sensory grounding, study focus timer, and private mental release.'}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-container-lowest text-primary shadow-2xs border border-outline-variant/30 font-label-md font-bold shrink-0">
          <span className="material-symbols-outlined text-[18px] text-tertiary">spa</span>
          <span>{isEs ? 'A tu Propio Ritmo' : 'At Your Own Pace'}</span>
        </div>
      </section>

      {/* 2. Tool Navigation Tabs (Clean segmented control, zero pills) */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/30 shadow-2xs">
        {[
          { id: 'breathing' as const, label: isEs ? '1. Respiración Rítmica' : '1. Rhythmic Breathing', icon: 'air' },
          { id: 'grounding' as const, label: isEs ? '2. Anclaje Sensorial 5-4-3-2-1' : '2. 5-4-3-2-1 Grounding', icon: 'nature_people' },
          { id: 'pomodoro' as const, label: isEs ? '3. Temporizador de Foco 25/5' : '3. Focus Timer 25/5', icon: 'timer' },
          { id: 'journal' as const, label: isEs ? '4. Diario de Descarga' : '4. Private Vent Journal', icon: 'edit_note' },
        ].map((tab) => {
          const active = activeTool === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTool(tab.id)}
              className={`flex items-center gap-2 h-11 px-4 rounded-xl font-label-md font-bold transition-all cursor-pointer whitespace-nowrap active:scale-[0.98] ${
                active
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================================================================== */}
      {/* TOOL 1: RESPIRACIÓN RÍTMICA GUIADA EN VIVO */}
      {/* ================================================================== */}
      {activeTool === 'breathing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-surface-container-lowest p-6 sm:p-10 rounded-3xl border border-outline-variant/30 shadow-xs">
          <div className="lg:col-span-7 space-y-5">
            {/* Mode selection buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  stopBreathing('switchMode');
                  setBreathingMode('478');
                }}
                className={`h-9 px-4 rounded-xl font-label-sm font-bold transition-all cursor-pointer ${
                  breathingMode === '478'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {isEs ? 'Técnica 4-7-8 (Calma profunda • 19s)' : '4-7-8 Method (Deep Calm • 19s)'}
              </button>
              <button
                type="button"
                onClick={() => {
                  stopBreathing('switchMode');
                  setBreathingMode('box');
                }}
                className={`h-9 px-4 rounded-xl font-label-sm font-bold transition-all cursor-pointer ${
                  breathingMode === 'box'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {isEs ? 'Respiración en Caja 4-4-4-4 (Foco)' : 'Box Breathing 4-4-4-4 (Focus)'}
              </button>
            </div>

            <h2 className="text-2xl font-bold text-on-surface">
              {breathingMode === '478'
                ? (isEs ? 'Relajación y Descompresión Rápida (4-7-8)' : 'Deep Rhythmic Relaxation (4-7-8)')
                : (isEs ? 'Enfoque y Regulación del Estrés (4-4-4-4)' : 'Stress Stabilization (Box 4-4-4-4)')}
            </h2>

            <p className="font-body-md text-on-surface-variant leading-relaxed">
              {breathingMode === '478'
                ? (isEs
                    ? 'Inhala por la nariz durante 4 segundos, mantén el aire 7 segundos y exhala suavemente por la boca durante 8 segundos (19s en total). Esta cadencia estimula el nervio vago y desacelera el ritmo cardíaco.'
                    : 'Inhale through your nose for 4s, hold for 7s, and exhale gently for 8s (19s total). This pattern stimulates the vagus nerve and slows your heart rate.')
                : (isEs
                    ? 'Inhala en 4s, sostén en 4s, exhala en 4s y descansa en 4s. Es la técnica utilizada para despejar la mente antes de rendir exámenes o hablar en público.'
                    : 'Inhale 4s, hold 4s, exhale 4s, and pause 4s. Used to stabilize composure before exams or presentations.')}
            </p>

            {/* Sound controls panel (soundEnabled + soundVolume + test button) */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    initAudio();
                    setSoundEnabled(!soundEnabled);
                  }}
                  className={`h-9 px-3 rounded-xl font-label-sm font-bold flex items-center gap-2 cursor-pointer transition-colors ${
                    soundEnabled
                      ? 'bg-tertiary-container text-on-tertiary-container'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                  title={soundEnabled ? (isEs ? 'Silenciar sonido de horno' : 'Mute oven beep') : (isEs ? 'Activar sonido de horno' : 'Enable oven beep')}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {soundEnabled ? 'volume_up' : 'volume_off'}
                  </span>
                  <span>{soundEnabled ? (isEs ? 'Pitido fin: Activado' : 'End beep: On') : (isEs ? 'Pitido fin: Silenciado' : 'End beep: Muted')}</span>
                </button>

                {soundEnabled && (
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="font-medium">{Math.round(soundVolume * 100)}%</span>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={soundVolume}
                      onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                      className="w-20 accent-primary cursor-pointer"
                      aria-label={isEs ? 'Volumen del sonido' : 'Sound volume'}
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  initAudio();
                  playOvenTimerBeep(soundVolume, audioCtxRef.current);
                  onShowToast(isEs ? 'Reproduciendo pitido de horno de prueba' : 'Playing oven timer test beep');
                }}
                className="h-9 px-3 rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">microwave</span>
                <span>{isEs ? 'Probar pitido' : 'Test beep'}</span>
              </button>
            </div>

            {/* Completion Banner */}
            {breathingPhase === 'completed' && (
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-700 flex items-start gap-3 text-teal-900 dark:text-teal-200 animate-fade-in shadow-xs">
                <span className="material-symbols-outlined text-teal-600 dark:text-teal-400 text-[24px] shrink-0 mt-0.5">
                  task_alt
                </span>
                <div className="space-y-0.5">
                  <p className="font-bold text-sm">
                    {isEs ? COMPLETION_MESSAGE_ES : COMPLETION_MESSAGE_EN}
                  </p>
                  <p className="text-xs text-teal-800 dark:text-teal-300/90">
                    {isEs
                      ? 'Has completado los 19 segundos del ciclo. Puedes descansar o iniciar una nueva secuencia cuando lo desees.'
                      : 'You completed the 19-second cycle. Rest or start another sequence whenever you are ready.'}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {(breathingPhase === 'inhale' || breathingPhase === 'hold' || breathingPhase === 'exhale') ? (
                <button
                  type="button"
                  onClick={() => stopBreathing('cancel')}
                  className="h-12 px-6 rounded-xl bg-rose-600 text-white font-label-lg font-bold shadow-sm hover:bg-rose-700 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[22px]">stop</span>
                  <span>{isEs ? 'Detener ejercicio' : 'Stop exercise'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startBreathing}
                  className="h-12 px-6 rounded-xl bg-primary text-on-primary font-label-lg font-bold shadow-sm hover:opacity-95 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {breathingPhase === 'completed' ? 'replay' : 'play_arrow'}
                  </span>
                  <span>
                    {isEs ? 'Iniciar respiración asistida' : 'Start paced breathing'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Animated visual orb with strict 4s expansion / 7s hold / 8s shrink */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-3xl border border-outline-variant/20 text-center">
            <div className="relative w-52 h-52 flex items-center justify-center mb-4">
              {/* Outer pulsing ring */}
              <div
                className={`absolute inset-0 rounded-full bg-primary/20 ${
                  breathingPhase === 'inhale'
                    ? 'scale-125 opacity-80'
                    : breathingPhase === 'hold'
                    ? 'scale-125 opacity-70'
                    : breathingPhase === 'exhale'
                    ? 'scale-95 opacity-30'
                    : breathingPhase === 'completed'
                    ? 'scale-100 opacity-60 bg-teal-400/20'
                    : 'scale-90 opacity-40'
                }`}
                style={{
                  transition:
                    breathingPhase === 'inhale'
                      ? 'transform 4000ms cubic-bezier(0.4, 0, 0.2, 1), opacity 4000ms ease'
                      : breathingPhase === 'hold'
                      ? 'none'
                      : breathingPhase === 'exhale'
                      ? 'transform 8000ms cubic-bezier(0.4, 0, 0.2, 1), opacity 8000ms ease'
                      : 'transform 600ms ease, opacity 600ms ease',
                }}
              />

              {/* Main interactive orb */}
              <div
                className={`w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-lg select-none ${
                  breathingPhase === 'completed'
                    ? 'bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-teal-500/30'
                    : 'bg-gradient-to-tr from-primary to-primary-container text-on-primary'
                }`}
                style={{
                  transform:
                    breathingPhase === 'inhale'
                      ? 'scale(1.28)'
                      : breathingPhase === 'hold'
                      ? 'scale(1.28)'
                      : breathingPhase === 'exhale'
                      ? 'scale(0.95)'
                      : 'scale(1.0)',
                  transition:
                    breathingPhase === 'inhale'
                      ? 'transform 4000ms cubic-bezier(0.4, 0, 0.2, 1)'
                      : breathingPhase === 'hold'
                      ? 'none'
                      : breathingPhase === 'exhale'
                      ? 'transform 8000ms cubic-bezier(0.4, 0, 0.2, 1)'
                      : 'transform 600ms ease',
                }}
              >
                {breathingPhase === 'completed' ? (
                  <>
                    <span className="material-symbols-outlined text-[36px]">check_circle</span>
                    <span className="text-xs uppercase font-extrabold tracking-wider mt-1">
                      {isEs ? '¡Completado!' : 'Completed!'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-extrabold font-mono tabular-nums">
                      {breathingPhase === 'idle' ? '4s' : `${timerSeconds}s`}
                    </span>
                    <span className="text-xs uppercase font-bold tracking-wider mt-1">
                      {breathingPhase === 'inhale'
                        ? (isEs ? 'Inhala' : 'Inhale')
                        : breathingPhase === 'hold'
                        ? (isEs ? 'Mantén' : 'Hold')
                        : breathingPhase === 'exhale'
                        ? (isEs ? 'Exhala' : 'Exhale')
                        : (isEs ? 'Listo' : 'Ready')}
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm font-semibold text-on-surface mb-1">
              {breathingPhase === 'inhale'
                ? (isEs ? 'Inhala suavemente' : 'Inhale gently')
                : breathingPhase === 'hold'
                ? (isEs ? 'Mantén la respiración' : 'Hold your breath')
                : breathingPhase === 'exhale'
                ? (isEs ? 'Exhala lentamente' : 'Exhale slowly')
                : breathingPhase === 'completed'
                ? (isEs ? 'Respiración completada. Tómate un momento para relajarte' : 'Breathing completed. Take a moment to relax')
                : (isEs ? 'Secuencia 4-7-8 (19 segundos)' : '4-7-8 Sequence (19 seconds)')}
            </p>

            <span className="text-xs text-on-surface-variant font-medium">
              {breathingPhase === 'inhale' || breathingPhase === 'hold' || breathingPhase === 'exhale'
                ? (isEs ? 'Sigue la expansión y contracción del círculo' : 'Follow the rhythmic visual expansion')
                : breathingPhase === 'completed'
                ? (isEs ? 'Haz clic en el botón para iniciar otra secuencia' : 'Click the button to start another sequence')
                : (isEs ? 'Presiona el botón para comenzar el ciclo' : 'Press start to begin the cycle')}
            </span>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TOOL 2: ANCLAJE SENSORIAL 5-4-3-2-1 */}
      {/* ================================================================== */}
      {activeTool === 'grounding' && (
        <div className="bg-surface-container-lowest p-6 sm:p-10 rounded-3xl border border-outline-variant/30 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-on-surface">
              {isEs ? 'Técnica de Conexión a Tierra 5-4-3-2-1' : '5-4-3-2-1 Sensory Grounding Technique'}
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              {isEs
                ? 'Cuando sientas que tus pensamientos van a mil por hora o la ansiedad te desborda, utiliza tus 5 sentidos para volver al momento presente. Marca cada paso a medida que lo completes:'
                : 'When your thoughts spiral or anxiety feels overpowering, engage your 5 physical senses to anchor yourself in the present. Check each step as you complete it:'}
            </p>
          </div>

          <div className="space-y-3">
            {groundingSteps.map((step, idx) => {
              const isDone = Boolean(groundingChecks[idx]);
              return (
                <div
                  key={step.num}
                  onClick={() => toggleGrounding(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                    isDone
                      ? 'bg-primary-fixed/20 border-primary/40 text-on-surface shadow-2xs'
                      : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/30 text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold font-mono text-sm shrink-0 transition-colors ${
                        isDone
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {step.num}
                    </div>
                    <span className={`text-sm sm:text-base font-medium leading-relaxed ${isDone ? 'line-through opacity-75' : ''}`}>
                      {step.label}
                    </span>
                  </div>

                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 transition-colors ${
                    isDone ? 'bg-primary border-primary text-on-primary' : 'border-outline-variant text-transparent'
                  }`}>
                    <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-medium">
              {Object.values(groundingChecks).filter(Boolean).length} de 5 pasos completados
            </span>
            <button
              type="button"
              onClick={() => {
                setGroundingChecks({});
                onShowToast(isEs ? 'Ejercicio reiniciado' : 'Exercise reset');
              }}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              {isEs ? 'Reiniciar checklist' : 'Reset checklist'}
            </button>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TOOL 3: TEMPORIZADOR DE ESTUDIO Y PAUSA (POMODORO) */}
      {/* ================================================================== */}
      {activeTool === 'pomodoro' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-surface-container-lowest p-6 sm:p-10 rounded-3xl border border-outline-variant/30 shadow-xs">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {pomodoroMode === 'study'
                ? (isEs ? 'Bloque de Estudio Productivo' : 'Focused Study Block')
                : (isEs ? 'Pausa Activa de Descompresión' : 'Active Rest Break')}
            </span>
            <h2 className="text-2xl font-bold text-on-surface">
              {isEs ? 'Gestión Saludable del Tiempo de Estudio' : 'Healthy Study Time Management'}
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              {isEs
                ? 'El cerebro humano retiene mucho mejor la información cuando alterna 25 minutos de concentración intensa sin celular con 5 minutos de descanso activo (estiramiento, hidratación o vista al horizonte).'
                : 'Cognitive retention peaks when alternating 25 minutes of deep focus without digital distractions and 5 minutes of physical movement, water, or looking at the horizon.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPomodoroRunning(!pomodoroRunning)}
                className="h-12 px-6 rounded-xl bg-primary text-on-primary font-label-lg font-bold shadow-sm hover:opacity-95 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {pomodoroRunning ? 'pause' : 'play_arrow'}
                </span>
                <span>{pomodoroRunning ? (isEs ? 'Pausar temporizador' : 'Pause timer') : (isEs ? 'Iniciar bloque de 25 min' : 'Start 25 min block')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPomodoroRunning(false);
                  setPomodoroSeconds(25 * 60);
                  setPomodoroMode('study');
                }}
                className="h-12 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md font-bold border border-outline-variant/30 cursor-pointer transition-colors"
              >
                {isEs ? 'Reiniciar' : 'Reset'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-surface-container-low rounded-3xl border border-outline-variant/20 text-center">
            <span className="text-6xl font-extrabold font-mono tabular-nums text-on-surface tracking-tight mb-2">
              {formatPomoTime(pomodoroSeconds)}
            </span>
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg ${
              pomodoroMode === 'study' ? 'bg-primary-fixed/40 text-primary' : 'bg-secondary-fixed text-secondary'
            }`}>
              {pomodoroMode === 'study' ? (isEs ? '25 min Foco Activo' : '25 min Deep Focus') : (isEs ? '5 min Descanso' : '5 min Rest')}
            </span>
            <p className="text-xs text-on-surface-variant mt-4 max-w-xs leading-relaxed">
              {pomodoroMode === 'study'
                ? (isEs ? 'Aleja las notificaciones de redes sociales durante este intervalo.' : 'Keep notifications muted during this interval.')
                : (isEs ? '¡Pausa activa! Levántate, bebe agua y estira tus brazos.' : 'Active break! Stand up, stretch, and hydrate.')}
            </p>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TOOL 4: DIARIO DE DESCARGA EMOCIONAL CONFIDENCIAL */}
      {/* ================================================================== */}
      {activeTool === 'journal' && (
        <div className="bg-surface-container-lowest p-6 sm:p-10 rounded-3xl border border-outline-variant/30 shadow-xs space-y-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-on-surface">
              {isEs ? 'Diario Privado de Desahogo y Gratitud' : 'Private Journal of Release & Gratitude'}
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              {isEs
                ? 'Escribe libremente lo que hoy te preocupa, te enoja o algo que agradeces. Este texto vive exclusivamente en tu navegador y no se envía a ningún servidor.'
                : 'Write freely about what bothers you, excites you, or what you are grateful for today. This text stays strictly on your browser and is never stored on servers.'}
            </p>
          </div>

          {journalFeedback && (
            <div className="p-4 rounded-2xl bg-primary-fixed/20 border border-primary/30 text-on-surface text-sm flex items-center gap-3 animate-fade-in">
              <span className="material-symbols-outlined text-primary text-[22px] shrink-0">spa</span>
              <span>{journalFeedback}</span>
            </div>
          )}

          <div className="relative">
            <textarea
              rows={5}
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder={isEs ? 'Escribe aquí lo que necesitas soltar hoy...' : 'Write whatever you need to get off your chest...'}
              className="w-full p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <span className="text-xs text-on-surface-variant">
              {isEs ? '100% privado • Se borra al presionar "Soltar pensamiento"' : '100% private • Cleared upon pressing "Release thought"'}
            </span>
            <button
              type="button"
              disabled={!journalText.trim()}
              onClick={handleReleaseJournal}
              className="h-11 px-5 rounded-xl bg-primary text-on-primary font-label-md font-bold shadow-xs hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[19px]">air</span>
              <span>{isEs ? 'Soltar y liberar pensamiento' : 'Release thought & breathe'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
