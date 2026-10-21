import React, { useEffect, useState } from 'react';
import { Language, translations } from '../data/translations';

interface ScreenProps {
  lang: Language;
  onNavigate: (screen: string) => void;
  onShowToast: (msg: string) => void;
}

export const ResourcesScreen: React.FC<ScreenProps> = ({
  lang,
  onNavigate,
  onShowToast,
}) => {
  const t = translations[lang].resources;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedResource, setSelectedResource] = useState<{
    title: string;
    tag: string;
    desc: string;
    duration: string;
    icon: string;
    details?: string[];
  } | null>(null);

  const categories = [
    { id: 'all', icon: 'apps', label: t.catAll },
    { id: 'ansiedad', icon: 'air', label: t.catAnxiety },
    { id: 'academico', icon: 'school', label: t.catAcademic },
    { id: 'convivencia', icon: 'diversity_1', label: t.catCoexistence },
    { id: 'emociones', icon: 'sentiment_satisfied', label: t.catEmotions },
  ];

  const resourcesList = [
    {
      id: 'ansiedad',
      cat: 'ansiedad',
      icon: 'air',
      iconBg: 'bg-primary-fixed/40 text-primary',
      tag: t.c1Tag,
      tagColor: 'text-primary',
      duration: '4 min',
      title: t.c1Title,
      desc: t.c1Desc,
      footIcon: 'verified_user',
      footColor: 'text-tertiary',
      footText: t.c1Foot,
      details: [
        'Respiración diafragmática en 4 tiempos.',
        'Escaneo corporal para liberar tensión en cuello y hombros.',
        'Técnica de la burbuja mental para observar pensamientos sin juzgarlos.',
      ],
    },
    {
      id: 'academico',
      cat: 'academico',
      icon: 'menu_book',
      iconBg: 'bg-secondary-fixed text-secondary',
      tag: t.c2Tag,
      tagColor: 'text-secondary',
      duration: '6 min',
      title: t.c2Title,
      desc: t.c2Desc,
      footIcon: 'tips_and_updates',
      footColor: 'text-secondary',
      footText: t.c2Foot,
      details: [
        'Técnica Pomodoro: 25 minutos de estudio + 5 minutos de pausa activa.',
        'Matriz de priorización para entregas y exámenes.',
        'Estrategias para combatir la procrastinación académica.',
      ],
    },
    {
      id: 'convivencia',
      cat: 'convivencia',
      icon: 'groups_3',
      iconBg: 'bg-tertiary-fixed text-tertiary',
      tag: t.c3Tag,
      tagColor: 'text-tertiary',
      duration: '5 min',
      title: t.c3Title,
      desc: t.c3Desc,
      footIcon: 'security',
      footColor: 'text-tertiary',
      footText: t.c3Foot,
      details: [
        'Comunicación asertiva para poner límites respetuosos.',
        'Cómo actuar si eres testigo de acoso escolar.',
        'Pasos seguros para acudir al comité de convivencia.',
      ],
    },
    {
      id: 'emociones',
      cat: 'emociones',
      icon: 'self_improvement',
      iconBg: 'bg-primary-fixed/30 text-primary',
      tag: t.c4Tag,
      tagColor: 'text-primary',
      duration: '8 min',
      title: t.c4Title,
      desc: t.c4Desc,
      footIcon: 'favorite',
      footColor: 'text-primary',
      footText: t.c4Foot,
      details: [
        'Identificación y validación de las emociones primarias.',
        'Técnica STOP: Parar, Tomar aire, Observar y Proceder.',
        'Diario de gratitud y autoreflexión.',
      ],
    },
  ];

  const filtered = resourcesList.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.cat === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="flex flex-col w-full space-y-10 pb-12">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-highest p-6 sm:p-10 border border-outline-variant/30 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <span className="material-symbols-outlined text-[16px]">
              auto_stories
            </span>
            <span>
              {t.badge}
            </span>
          </div>
          <h1 className="font-headline-lg font-bold text-on-surface tracking-tight">
            {t.title}
          </h1>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-container-lowest text-primary font-label-md font-bold shadow-2xs border border-outline-variant/30">
          <span className="material-symbols-outlined text-[18px] text-tertiary">
            verified
          </span>
          <span>{lang === 'es' ? 'Acceso libre y confidencial' : 'Free & confidential'}</span>
        </div>
      </section>

      {/* 2. Web Search & Category Filter Bar */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-surface-container-lowest p-3.5 sm:p-4 rounded-3xl border border-outline-variant/30 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full h-11 pl-11 pr-4 bg-surface-container-low text-on-surface placeholder:text-outline-variant font-body-md rounded-xl border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 h-10 px-4 rounded-xl font-label-md font-bold whitespace-nowrap transition-all cursor-pointer active:scale-[0.98] ${
                  active
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Resource Cards Multi-Column Responsive Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="group bg-surface-container-lowest rounded-3xl p-6 sm:p-7 border border-outline-variant/30 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-xs`}
                >
                  <span className="material-symbols-outlined text-[30px]">
                    {item.icon}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-label-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-surface-container-low ${item.tagColor}`}
                  >
                    {item.tag}
                  </span>
                  <span className="font-label-sm text-outline flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-full">
                    <span className="material-symbols-outlined text-[14px]">
                      schedule
                    </span>
                    {item.duration}
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-on-surface group-hover:text-primary transition-colors">
                  {item.title}
                </h2>
                <p className="font-body-md text-on-surface-variant leading-relaxed mt-2">
                  {item.desc}
                </p>
              </div>

              {/* Bullet previews */}
              {item.details && (
                <ul className="space-y-1.5 pt-2">
                  {item.details.map((bullet, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-xs text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined text-[15px] text-primary">
                        check_circle
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm">
                <span
                  className={`material-symbols-outlined text-[18px] ${item.footColor}`}
                >
                  {item.footIcon}
                </span>
                <span className="font-medium">{item.footText}</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSelectedResource({
                    title: item.title,
                    tag: item.tag,
                    desc: item.desc,
                    duration: item.duration,
                    icon: item.icon,
                    details: item.details,
                  })
                }
                className="h-10 px-4 rounded-xl font-label-md font-bold bg-primary text-on-primary hover:bg-primary/95 shadow-xs active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>{t.viewResource}</span>
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* 4. Bottom Support Card (Orientation Counselor Assistance) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-high rounded-3xl p-6 sm:p-10 border border-outline-variant/30 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[28px]">
              chat_bubble_outline
            </span>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-headline-sm font-bold text-on-surface">
              {t.notFoundTitle}
            </h3>
            <p className="font-body-md text-on-surface-variant max-w-xl leading-relaxed">
              {t.notFoundDesc}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('orientacion')}
          className="h-12 px-6 rounded-xl bg-secondary text-on-secondary font-label-lg font-bold shadow-xs hover:bg-secondary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px]">send</span>
          <span>{t.talkCounselor}</span>
        </button>
      </section>

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div
          onClick={() => setSelectedResource(null)}
          className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm font-bold uppercase tracking-wider">
                  {selectedResource.tag}
                </span>
                <span className="font-label-sm text-outline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    schedule
                  </span>
                  {selectedResource.duration}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedResource(null)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-on-surface">
                {selectedResource.title}
              </h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                {selectedResource.desc}
              </p>
            </div>

            {selectedResource.details && (
              <div className="p-4 rounded-2xl bg-surface-container-low space-y-2.5 border border-outline-variant/30">
                <span className="font-label-md font-bold text-on-surface block">
                  {lang === 'es' ? 'Puntos clave y pasos prácticos:' : 'Key points & practice steps:'}
                </span>
                <ul className="space-y-2">
                  {selectedResource.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                      <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                        check
                      </span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedResource(null)}
                className="flex-1 h-12 rounded-2xl bg-surface-container text-on-surface font-label-lg font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                {translations[lang].selfcare.modalBack}
              </button>
              <button
                type="button"
                onClick={() => {
                  onShowToast(`${lang === 'es' ? 'Comenzando práctica' : 'Starting practice'}: ${selectedResource.title}`);
                  setSelectedResource(null);
                }}
                className="flex-1 h-12 rounded-2xl bg-primary text-on-primary font-label-lg font-bold shadow-md shadow-primary/20 hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">
                  play_arrow
                </span>
                <span>{translations[lang].selfcare.modalStartNow}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const SelfCareScreen: React.FC<ScreenProps> = ({
  lang,
  onShowToast,
}) => {
  const t = translations[lang].selfcare;
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalActivity, setModalActivity] = useState<{
    title: string;
    detail: string;
  } | null>(null);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timerSeconds, setTimerSeconds] = useState(4);

  // 4-7-8 Breathing Cycle Simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (breathingActive) {
      timer = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev > 1) return prev - 1;
          if (breathingPhase === 'inhale') {
            setBreathingPhase('hold');
            return 7;
          } else if (breathingPhase === 'hold') {
            setBreathingPhase('exhale');
            return 8;
          } else {
            setBreathingPhase('inhale');
            return 4;
          }
        });
      }, 1000);
    } else {
      setBreathingPhase('inhale');
      setTimerSeconds(4);
    }
    return () => clearInterval(timer);
  }, [breathingActive, breathingPhase]);

  const activities = [
    {
      id: 1,
      category: 'mente',
      title: t.a1Title,
      tag: t.a1Tag,
      desc: t.a1Desc,
      detail: t.a1Detail,
      icon: 'air',
      iconBg: 'bg-primary-fixed/40 text-primary',
    },
    {
      id: 2,
      category: 'mente',
      title: t.a2Title,
      tag: t.a2Tag,
      desc: t.a2Desc,
      detail: t.a2Detail,
      icon: 'visibility',
      iconBg: 'bg-secondary-fixed text-secondary',
    },
    {
      id: 3,
      category: 'rutinas',
      title: t.a3Title,
      tag: t.a3Tag,
      desc: t.a3Desc,
      detail: t.a3Detail,
      icon: 'schedule',
      iconBg: 'bg-tertiary-fixed text-tertiary',
    },
    {
      id: 4,
      category: 'rutinas',
      title: t.a4Title,
      tag: t.a4Tag,
      desc: t.a4Desc,
      detail: t.a4Detail,
      icon: 'water_drop',
      iconBg: 'bg-secondary-fixed/50 text-secondary',
    },
    {
      id: 5,
      category: 'reflexion',
      title: t.a5Title,
      tag: t.a5Tag,
      desc: t.a5Desc,
      detail: t.a5Detail,
      icon: 'favorite',
      iconBg: 'bg-primary-fixed/30 text-primary',
    },
  ];

  const filtered = activities.filter(
    (a) => activeFilter === 'all' || a.category === activeFilter
  );

  return (
    <div className="flex flex-col w-full space-y-10 pb-12">
      {/* 1. Header Banner with Interactive 4-7-8 Breathing Orb */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-highest p-6 sm:p-10 border border-outline-variant/30 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <span className="material-symbols-outlined text-[16px]">eco</span>
            <span>
              {t.badge}
            </span>
          </div>
          <h1 className="font-headline-lg font-bold text-on-surface tracking-tight">
            {t.title}
          </h1>
          <p className="font-body-md text-on-surface-variant leading-relaxed max-w-xl">
            {t.subtitle}
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => {
                setBreathingActive(!breathingActive);
                onShowToast(
                  !breathingActive
                    ? 'Iniciando técnica 4-7-8 de relajación profunda'
                    : 'Pausa completada'
                );
              }}
              className="h-12 px-6 rounded-xl bg-primary text-on-primary font-label-lg font-bold shadow-sm hover:opacity-95 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[20px]">
                {breathingActive ? 'pause' : 'play_arrow'}
              </span>
              <span>{breathingActive ? 'Detener ejercicio' : 'Probar respiración 4-7-8'}</span>
            </button>
          </div>
        </div>

        {/* Breathing Visual Orb */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-2xs flex flex-col items-center text-center">
          <span className="font-title-md font-bold text-on-surface mb-1">
            {t.breatheTitle}
          </span>
          <span className="font-body-sm text-on-surface-variant mb-6">
            {t.breatheSub}
          </span>

          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            <div
              className={`absolute inset-0 rounded-full bg-primary/20 transition-all duration-1000 ${
                breathingActive && breathingPhase === 'inhale'
                  ? 'scale-125 opacity-80'
                  : breathingActive && breathingPhase === 'hold'
                  ? 'scale-110 opacity-60'
                  : 'scale-90 opacity-40'
              }`}
            ></div>
            <div
              className={`w-28 h-28 rounded-full bg-gradient-to-tr from-primary to-primary-container text-on-primary flex flex-col items-center justify-center shadow-md transition-transform duration-1000 ${
                breathingActive && breathingPhase === 'inhale'
                  ? 'scale-115'
                  : breathingActive && breathingPhase === 'hold'
                  ? 'scale-105'
                  : 'scale-95'
              }`}
            >
              <span className="text-xl font-extrabold">{timerSeconds}s</span>
              <span className="text-xs uppercase font-bold tracking-wider mt-0.5">
                {breathingPhase === 'inhale'
                  ? 'Inhala'
                  : breathingPhase === 'hold'
                  ? 'Mantén'
                  : 'Exhala'}
              </span>
            </div>
          </div>

          <span className="text-xs text-on-surface-variant font-medium">
            {breathingActive
              ? 'Sigue el ritmo visual del círculo para sincronizar tu respiración'
              : 'Presiona el botón para iniciar la guía de respiración rítmica'}
          </span>
        </div>
      </section>

      {/* 2. Category Filter Bar */}
      <section className="flex items-center gap-2 overflow-x-auto pb-1 bg-surface-container-lowest p-2.5 rounded-2xl border border-outline-variant/30 shadow-2xs">
        {[
          { id: 'all', label: t.filterAll, icon: 'apps' },
          { id: 'mente', label: t.filterMind, icon: 'self_improvement' },
          { id: 'rutinas', label: t.filterRoutines, icon: 'schedule' },
          { id: 'reflexion', label: t.filterReflection, icon: 'favorite' },
        ].map((tab) => {
          const active = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-2 h-10 px-4 rounded-xl font-label-md font-bold transition-all cursor-pointer whitespace-nowrap active:scale-[0.98] ${
                active
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </section>

      {/* 3. Multi-Column Responsive Activities Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="group bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-2xs hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center shadow-xs`}
                >
                  <span className="material-symbols-outlined text-[26px]">
                    {item.icon}
                  </span>
                </div>
                <span className="text-xs font-bold text-primary">
                  {item.tag}
                </span>
              </div>

              <div>
                <h2 className="font-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                  {item.title}
                </h2>
                <p className="font-body-sm text-on-surface-variant leading-relaxed mt-2">
                  {item.desc}
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-outline-variant/20 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setModalActivity({
                    title: item.title,
                    detail: item.detail,
                  })
                }
                className="w-full h-10 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label-md font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98] whitespace-nowrap"
              >
                <span>{t.viewActivity}</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* 4. Sensory Grounding Interactive Box */}
      <section className="bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-high rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[26px]">
              visibility
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-on-surface">
              {lang === 'es' ? 'Técnica de Anclaje Sensorial 5-4-3-2-1' : '5-4-3-2-1 Grounding Technique'}
            </h3>
            <p className="font-body-sm text-on-surface-variant">
              {lang === 'es' ? 'Excelente para momentos de sobrecarga o nerviosismo en clase.' : 'Great for moments of sensory overload or classroom nervousness.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {[
            { num: '5', label: lang === 'es' ? 'Cosas que ves' : 'Things you see', icon: 'visibility' },
            { num: '4', label: lang === 'es' ? 'Cosas que tocas' : 'Things you touch', icon: 'touch_app' },
            { num: '3', label: lang === 'es' ? 'Cosas que oyes' : 'Things you hear', icon: 'hearing' },
            { num: '2', label: lang === 'es' ? 'Cosas que hueles' : 'Things you smell', icon: 'air' },
            { num: '1', label: lang === 'es' ? 'Cosa que agradeces' : 'Thing you are thankful for', icon: 'favorite' },
          ].map((step, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 flex flex-col items-center text-center gap-1.5 shadow-xs"
            >
              <span className="text-2xl font-extrabold text-primary">{step.num}</span>
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                {step.icon}
              </span>
              <span className="text-xs font-bold text-on-surface leading-tight mt-1">
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Activity Detail Modal */}
      {modalActivity && (
        <div
          onClick={() => setModalActivity(null)}
          className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 flex flex-col gap-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">
                  self_improvement
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalActivity(null)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-on-surface">
                {modalActivity.title}
              </h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                {modalActivity.detail}
              </p>
            </div>

            <div className="p-4 bg-surface-container-low rounded-2xl flex items-center gap-3 text-primary font-label-md border border-outline-variant/30">
              <span className="material-symbols-outlined text-[20px] text-tertiary">
                verified_user
              </span>
              <span className="font-medium">{t.privateNote}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalActivity(null)}
                className="flex-1 h-11 px-5 rounded-xl bg-surface-container text-on-surface font-label-lg font-bold hover:bg-surface-container-high active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                {t.modalBack}
              </button>
              <button
                type="button"
                onClick={() => {
                  onShowToast(`${t.beginActivity}: ${modalActivity.title}`);
                  setModalActivity(null);
                }}
                className="flex-1 h-11 px-5 rounded-xl bg-primary text-on-primary font-label-lg font-bold shadow-md shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[20px]">
                  play_arrow
                </span>
                <span>{t.modalStartNow}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
