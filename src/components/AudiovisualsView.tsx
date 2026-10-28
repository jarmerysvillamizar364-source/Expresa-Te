/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Search,
  Filter,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  Layers,
  FileText,
  Headphones,
  Info,
  AlertTriangle,
  Heart,
  ShieldAlert,
  Users,
  Compass,
  GraduationCap,
  Brain,
  Sprout,
  Smile,
  MessageCircle,
  Check,
  Languages,
  Subtitles,
  Share2,
  Bookmark,
  ExternalLink,
  Flame,
  Zap,
} from 'lucide-react';
import type {
  AudiovisualResource,
  AudiovisualCategory,
  AudiovisualFormat,
} from '../types/audiovisual.ts';
import { audiovisualService } from '../services/audiovisualService.ts';
import { Language } from '../data/translations.ts';

interface AudiovisualsViewProps {
  lang: Language;
  isLoggedIn: boolean;
  userRole?: string;
  userName?: string;
  onNavigate: (screen: string) => void;
  onShowToast: (msg: string) => void;
}

export const AudiovisualsView: React.FC<AudiovisualsViewProps> = ({
  lang,
  isLoggedIn,
  userRole,
  userName,
  onNavigate,
  onShowToast,
}) => {
  const isEs = lang === 'es';
  const isStaff = userRole === 'orientador' || userRole === 'psicologo' || userRole === 'administrativo';

  // Catalog state
  const [resources, setResources] = useState<AudiovisualResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<AudiovisualCategory | 'all'>('all');
  const [selectedFormat, setSelectedFormat] = useState<AudiovisualFormat | 'all'>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  // Favorites state (Persisted in localStorage)
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('expresa_te_fav_videos');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Error reading favorites from localStorage', e);
      }
    }
    return ['av-salud-mental-adolescente', 'av-autoestima-mario-alonso'];
  });

  // Active viewing window
  const [activeResource, setActiveResource] = useState<AudiovisualResource | null>(null);
  const [viewerMode, setViewerMode] = useState<'embed' | 'interactive'>('embed');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progress, setProgress] = useState<number>(25);
  const [activeTab, setActiveTab] = useState<'takeaways' | 'transcript' | 'pedagogy' | 'slides'>('takeaways');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [mediaPlaybackError, setMediaPlaybackError] = useState<boolean>(false);

  // Admin New Resource Modal state
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<AudiovisualCategory>('salud_mental');
  const [newFormat, setNewFormat] = useState<AudiovisualFormat>('video');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newInstitution, setNewInstitution] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDuration, setNewDuration] = useState('6:00 min');
  const [newTakeawaysText, setNewTakeawaysText] = useState('');
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  const viewerRef = useRef<HTMLDivElement>(null);

  // Sync favorites with localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('expresa_te_fav_videos', JSON.stringify(favorites));
      } catch (e) {
        console.warn('Error saving favorites to localStorage', e);
      }
    }
  }, [favorites]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((favId) => favId !== id) : [...prev, id];
      onShowToast(
        exists
          ? (isEs ? 'Video eliminado de favoritos' : 'Video removed from favorites')
          : (isEs ? 'Video guardado en favoritos ❤️' : 'Video added to favorites ❤️')
      );
      return next;
    });
  };

  // Fetch resources from service
  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await audiovisualService.getResources({
        search: searchQuery,
        category: selectedCategory,
        format: selectedFormat,
      });
      setResources(result.resources);

      // Default active resource if none selected
      if (!activeResource && result.resources.length > 0) {
        const recommended = result.resources.find((r) => r.isRecommended) || result.resources[0];
        setActiveResource(recommended);
      }
    } catch (err: any) {
      console.error('[AudiovisualsView] Error loading resources:', err);
      setError(
        isEs
          ? 'Hubo un inconveniente al cargar el catálogo multimedia institucional.'
          : 'Unable to load institutional multimedia catalog.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedCategory, selectedFormat]);

  // Debounced search query
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchResources();
    }, 280);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Simulated playback timer for interactive mode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && viewerMode === 'interactive' && activeResource?.format === 'video') {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 400 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, viewerMode, playbackSpeed, activeResource]);

  const handleSelectResource = (res: AudiovisualResource, autoPlay: boolean = false) => {
    setActiveResource(res);
    setProgress(15);
    setIsPlaying(autoPlay);
    setMediaPlaybackError(false);
    setActiveSlideIndex(0);
    setActiveTab(res.format === 'presentacion' ? 'slides' : 'takeaways');

    // Scroll to viewer smoothly
    if (viewerRef.current) {
      viewerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleCardPlay = (e: React.MouseEvent, res: AudiovisualResource) => {
    e.stopPropagation();
    if (activeResource?.id === res.id) {
      setIsPlaying(!isPlaying);
    } else {
      handleSelectResource(res, true);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFormat('all');
    setShowOnlyFavorites(false);
  };

  const handleShareResource = (res: AudiovisualResource) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast(
        isEs
          ? `Enlace a "${res.title}" copiado al portapapeles`
          : `Link to "${res.title}" copied to clipboard`
      );
    } else {
      onShowToast(res.title);
    }
  };

  const handleCreateResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMediaUrl.trim()) {
      onShowToast(isEs ? 'El título y el enlace multimedia son obligatorios' : 'Title and media URL are required');
      return;
    }

    setIsSubmittingNew(true);
    try {
      const takeawaysList = newTakeawaysText
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean);

      const created = await audiovisualService.createResource({
        title: newTitle.trim(),
        category: newCategory,
        format: newFormat,
        duration: newDuration.trim() || '5:00 min',
        mediaUrl: newMediaUrl.trim(),
        author: newAuthor.trim() || (isStaff ? `${userName} (Orientación)` : 'Equipo de Orientación Escolar'),
        institutionSource: newInstitution.trim() || 'Proyecto Educativo Institucional Expresa Te',
        audioLanguage: 'Español (Nativo)',
        hasSubtitles: true,
        pedagogicalGoal: 'Refuerzo de habilidades emocionales y de convivencia escolar.',
        description: newDescription.trim() || 'Recurso educativo audiovisual para el bienestar escolar.',
        takeaways: takeawaysList.length > 0 ? takeawaysList : ['Comprender la técnica y aplicarla en el aula'],
      });

      onShowToast(isEs ? '¡Recurso audiovisual agregado exitosamente!' : 'Audiovisual resource added successfully!');
      setShowAdminModal(false);
      setNewTitle('');
      setNewMediaUrl('');
      setNewInstitution('');
      setNewDescription('');
      setNewTakeawaysText('');
      fetchResources();
      setActiveResource(created);
    } catch (err: any) {
      onShowToast(err.message || 'Error al guardar recurso');
    } finally {
      setIsSubmittingNew(false);
    }
  };

  // The complete list of categories requested by the user
  const categoriesList: Array<{ id: AudiovisualCategory | 'all'; label: string; icon: any }> = [
    { id: 'all', label: isEs ? 'Todos los Videos' : 'All Videos', icon: Compass },
    { id: 'salud_mental', label: isEs ? 'Salud Mental' : 'Mental Health', icon: Brain },
    { id: 'bienestar_emocional', label: isEs ? 'Bienestar Emocional' : 'Emotional Wellness', icon: Sparkles },
    { id: 'autocuidado', label: isEs ? 'Autocuidado' : 'Self-Care', icon: Sprout },
    { id: 'autoestima', label: isEs ? 'Autoestima' : 'Self-Esteem', icon: Heart },
    { id: 'emociones', label: isEs ? 'Manejo de Emociones' : 'Emotion Management', icon: Smile },
    { id: 'ansiedad_estres', label: isEs ? 'Ansiedad y Estrés' : 'Anxiety & Stress', icon: Zap },
    { id: 'relaciones', label: isEs ? 'Relaciones Saludables' : 'Healthy Relationships', icon: MessageCircle },
    { id: 'convivencia', label: isEs ? 'Amistad & Convivencia' : 'Friendship & Coexistence', icon: Users },
    { id: 'acoso', label: isEs ? 'Prevención del Acoso' : 'Bullying Prevention', icon: ShieldAlert },
    { id: 'comunicacion', label: isEs ? 'Comunicación Asertiva' : 'Assertive Communication', icon: FileText },
    { id: 'orientacion', label: isEs ? 'Orientación Estudiantil' : 'Student Guidance', icon: GraduationCap },
  ];

  // Formats definition
  const formatsList: Array<{ id: AudiovisualFormat | 'all'; label: string; icon: any }> = [
    { id: 'all', label: isEs ? 'Todos los Formatos' : 'All Formats', icon: Layers },
    { id: 'video', label: isEs ? 'Videos' : 'Videos', icon: Film },
    { id: 'presentacion', label: isEs ? 'Presentaciones' : 'Slides', icon: FileText },
    { id: 'infografia', label: isEs ? 'Infografías' : 'Infographics', icon: Info },
    { id: 'audio', label: isEs ? 'Audios Guiados' : 'Guided Audio', icon: Headphones },
  ];

  // Filtered displayed resources (taking into account showOnlyFavorites)
  const displayedResources = showOnlyFavorites
    ? resources.filter((r) => favorites.includes(r.id))
    : resources;

  // List of recommended videos for the featured carousel section
  const recommendedVideos = resources.filter((r) => r.isRecommended || r.youtubeId);

  // Safe embed URL with Spanish parameters
  const embedUrlWithParams = activeResource?.mediaUrl
    ? `${activeResource.mediaUrl}?hl=es&cc_lang_pref=es&cc_load_policy=1&rel=0&modestbranding=1&playsinline=1`
    : '';

  return (
    <div className="w-full space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* ==================================================================== */}
      {/* 1. TOP HEADER & BREADCRUMB ZONE */}
      {/* ==================================================================== */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={() => onNavigate(isLoggedIn ? (isStaff ? 'panel-orientador' : 'inicio') : 'login')}
                className="hover:text-teal-600 dark:hover:text-cyan-400 cursor-pointer flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isLoggedIn ? (isEs ? 'Inicio' : 'Home') : (isEs ? 'Acceso' : 'Login')}</span>
              </button>
              <span>/</span>
              <span className="text-teal-700 dark:text-cyan-400 font-bold">
                {isEs ? 'Centro de Audiovisuales' : 'Audiovisual Media Hub'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-700 dark:text-cyan-300 border border-teal-500/30 flex items-center justify-center shrink-0 shadow-xs">
                <Film className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 dark:text-cyan-400">
                    {isEs ? 'Portal Institucional Oficial' : 'Official School Hub'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>{isEs ? 'Audio en Español 100% Verificado' : '100% Verified Spanish Audio'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-teal-800 dark:text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                    <Subtitles className="w-3 h-3 text-teal-600 dark:text-cyan-400" />
                    <span>{isEs ? 'Subtítulos en Español' : 'Subtitles ES'}</span>
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                  {isEs ? 'Audiovisuales & Bienestar Emocional' : 'Audiovisuals & Emotional Wellness'}
                </h1>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {isEs
                ? 'Videos educativos reales en español de instituciones y profesionales de la salud mental. Explora recursos sobre salud mental, autoestima, autocuidado, manejo de emociones, relaciones saludables, convivencia escolar y prevención del acoso escolar.'
                : 'Verified educational videos in Spanish on mental health, self-care, self-esteem, healthy relationships, school coexistence, and bullying prevention.'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
            {/* Favorites filter toggle */}
            <button
              type="button"
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 border ${
                showOnlyFavorites
                  ? 'bg-rose-500 text-white border-rose-500 shadow-rose-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-rose-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-current text-white' : 'text-rose-500'}`} />
              <span>{isEs ? 'Mis Favoritos' : 'My Favorites'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                showOnlyFavorites ? 'bg-white/20 text-white' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}>
                {favorites.length}
              </span>
            </button>

            {/* Add Resource Button */}
            <button
              type="button"
              onClick={() => setShowAdminModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              title={isEs ? 'Agregar recurso audiovisual' : 'Add media resource'}
            >
              <Plus className="w-4 h-4" />
              <span>{isEs ? 'Agregar Video' : 'Add Video'}</span>
            </button>

            {!isLoggedIn ? (
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                <span>{isEs ? 'Iniciar Sesión' : 'Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('orientacion')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-slate-700 text-teal-800 dark:text-cyan-300 border border-teal-200 dark:border-cyan-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-cyan-400" />
                <span>{isEs ? 'Hablar con Orientación' : 'Talk with Guidance'}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. MAIN ACTIVE INTEGRATED VIDEO PLAYER WINDOW                        */}
      {/* ==================================================================== */}
      {activeResource && (
        <section
          ref={viewerRef}
          aria-label={isEs ? 'Reproductor de video integrado' : 'Integrated media player'}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/30 rounded-3xl overflow-hidden shadow-xl dark:shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-all"
        >
          {/* Top Viewer Control Bar */}
          <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
              <div className="truncate">
                <span className="text-[11px] font-bold text-teal-700 dark:text-cyan-400 uppercase tracking-wider block">
                  {activeResource.categoryLabel}
                </span>
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                  {activeResource.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Favorite button in player */}
              <button
                type="button"
                onClick={() => toggleFavorite(activeResource.id)}
                title={favorites.includes(activeResource.id) ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                className="w-8 h-8 rounded-lg bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${
                    favorites.includes(activeResource.id)
                      ? 'fill-rose-500 text-rose-500'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                />
              </button>

              {/* Audio language badge */}
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                <Languages className="w-3 h-3 text-emerald-500" />
                <span>{activeResource.audioLanguage || 'Español'}</span>
              </span>

              {/* Player Mode Switcher */}
              {activeResource.format === 'video' && (
                <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg text-[11px]">
                  <button
                    type="button"
                    onClick={() => setViewerMode('embed')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                      viewerMode === 'embed'
                        ? 'bg-cyan-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isEs ? 'Video Oficial' : 'Official Embed'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewerMode('interactive')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                      viewerMode === 'interactive'
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isEs ? 'Modo Guiado' : 'Guided Player'}
                  </button>
                </div>
              )}

              {/* Share button */}
              <button
                type="button"
                onClick={() => handleShareResource(activeResource)}
                title={isEs ? 'Compartir recurso' : 'Share resource'}
                className="w-8 h-8 rounded-lg bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Close viewer button */}
              <button
                type="button"
                onClick={() => setActiveResource(null)}
                title={isEs ? 'Cerrar reproductor' : 'Close player'}
                className="w-8 h-8 rounded-lg bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Media Stage */}
          <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
            {mediaPlaybackError ? (
              <div className="p-6 text-center space-y-3 max-w-md">
                <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-base font-bold text-white">
                  {isEs ? 'Conexión con el reproductor externo' : 'External player status'}
                </h3>
                <p className="text-xs text-slate-300">
                  {isEs
                    ? 'Si tu conexión escolar tiene filtros para streaming externo, puedes activar el Modo Guiado con los puntos clave y guion didáctico.'
                    : 'If external streaming is restricted, switch to our interactive Guided Mode.'}
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMediaPlaybackError(false);
                      setViewerMode('interactive');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold cursor-pointer"
                  >
                    {isEs ? 'Activar Modo Guiado' : 'Switch to Guided Mode'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaPlaybackError(false)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold cursor-pointer"
                  >
                    {isEs ? 'Reintentar' : 'Retry'}
                  </button>
                </div>
              </div>
            ) : activeResource.format === 'video' ? (
              viewerMode === 'embed' ? (
                /* YouTube Official Educational Video Embed with Spanish Subtitles & UI */
                <iframe
                  key={activeResource.id}
                  src={embedUrlWithParams}
                  title={activeResource.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onError={() => setMediaPlaybackError(true)}
                />
              ) : (
                /* Custom Guided Player with Complete Play/Pause & Scrub Controls */
                <div className="relative w-full h-full flex flex-col justify-between">
                  <img
                    src={activeResource.thumbnail}
                    alt={activeResource.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/src/assets/images/video_stop_technique_1792612453981.jpg';
                    }}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      isPlaying ? 'opacity-85' : 'opacity-65'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/50" />

                  {/* Big Play/Pause Center Button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_35px_rgba(20,184,166,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-cyan-400/30"
                      title={isPlaying ? 'Pausar video' : 'Reproducir video'}
                    >
                      {isPlaying ? (
                        <Pause className="w-9 h-9 fill-current" />
                      ) : (
                        <Play className="w-9 h-9 fill-current translate-x-0.5" />
                      )}
                    </button>
                    <span className="text-xs sm:text-sm font-bold text-white drop-shadow-md">
                      {isPlaying
                        ? isEs ? 'Reproduciendo lección guiada en español...' : 'Playing lesson in Spanish...'
                        : isEs ? 'Click para reproducir lección' : 'Click to play lesson'}
                    </span>
                  </div>

                  {/* Bottom Controls Bar */}
                  <div className="relative z-10 p-4 bg-gradient-to-t from-black/95 to-transparent flex flex-col gap-2">
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

                    {/* Controls Row */}
                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="hover:text-cyan-400 transition-colors cursor-pointer"
                          title={isPlaying ? 'Pausar' : 'Reproducir'}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setProgress(0)}
                          title={isEs ? 'Reiniciar video' : 'Restart video'}
                          className="hover:text-cyan-400 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsMuted(!isMuted)}
                          className="hover:text-cyan-400 transition-colors cursor-pointer"
                          title={isMuted ? 'Activar sonido' : 'Silenciar'}
                        >
                          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <span className="font-mono text-[11px] text-slate-300">
                          {Math.floor((progress / 100) * 5)}:
                          {String(Math.floor(((progress / 100) * 300) % 60)).padStart(2, '0')} / {activeResource.duration}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Speed Selector */}
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
                          Audio ES Verificado
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : activeResource.format === 'presentacion' ? (
              /* Slide Deck Viewer */
              <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold">
                    <FileText className="w-4 h-4" />
                    <span>
                      {isEs ? 'Diapositiva' : 'Slide'} {(activeSlideIndex || 0) + 1} de {activeResource.slides?.length || 4}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{activeResource.author}</span>
                </div>

                <div className="my-auto py-4 px-2 sm:px-8 space-y-4 text-center max-w-2xl mx-auto">
                  <h3 className="text-lg sm:text-2xl font-black text-cyan-300">
                    {activeResource.slides?.[activeSlideIndex]?.title || activeResource.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {activeResource.slides?.[activeSlideIndex]?.content || activeResource.description}
                  </p>
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-200 font-semibold inline-block">
                    💡 {activeResource.slides?.[activeSlideIndex]?.keyIdea || 'Aplica este concepto en tu rutina diaria.'}
                  </div>
                </div>

                {/* Slide Controls */}
                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <button
                    type="button"
                    disabled={activeSlideIndex <= 0}
                    onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold cursor-pointer transition-all"
                  >
                    ← {isEs ? 'Anterior' : 'Previous'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    {(activeResource.slides || [1, 2, 3, 4]).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveSlideIndex(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                          activeSlideIndex === i ? 'bg-cyan-400 w-6' : 'bg-slate-700 hover:bg-slate-500'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={activeSlideIndex >= (activeResource.slides?.length || 4) - 1}
                    onClick={() => setActiveSlideIndex((prev) => Math.min((activeResource.slides?.length || 4) - 1, prev + 1))}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer transition-all disabled:opacity-40"
                  >
                    {isEs ? 'Siguiente' : 'Next'} →
                  </button>
                </div>
              </div>
            ) : activeResource.format === 'infografia' ? (
              /* Infographic Viewer */
              <div className="relative w-full h-full bg-slate-900 flex items-center justify-center p-4 overflow-auto">
                <img
                  src={activeResource.thumbnail}
                  alt={activeResource.title}
                  className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-white">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>{isEs ? 'Infografía educativa oficial' : 'Educational infographic'}</span>
                </div>
              </div>
            ) : (
              /* Guided Audio Player */
              <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-tr from-slate-900 via-teal-950 to-slate-950 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Headphones className="w-4 h-4" />
                    {isEs ? 'Cápsula de Audio Guiado' : 'Guided Audio'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{activeResource.duration}</span>
                </div>

                <div className="text-center space-y-3 max-w-md mx-auto my-auto">
                  <div className="w-16 h-16 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(20,184,166,0.3)]">
                    <Headphones className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{activeResource.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeResource.description}</p>

                  <audio
                    controls
                    className="w-full mt-4 filter invert-[0.9] dark:invert-0"
                    src={activeResource.mediaUrl}
                    preload="none"
                  >
                    Tu navegador no soporta el reproductor de audio.
                  </audio>
                </div>

                <div className="text-center text-[11px] text-slate-400">
                  {isEs ? 'Usa audífonos para una experiencia inmersiva y relajante.' : 'Use headphones for optimal experience.'}
                </div>
              </div>
            )}
          </div>

          {/* Details, Tabs & Takeaways */}
          <div className="p-5 sm:p-6 space-y-4 bg-slate-50/60 dark:bg-slate-900/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-teal-700 dark:text-cyan-400 uppercase tracking-wider">
                    {activeResource.author}
                  </span>
                  {activeResource.institutionSource && (
                    <>
                      <span className="text-slate-400">·</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {activeResource.institutionSource}
                      </span>
                    </>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {activeResource.title}
                </h3>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
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
                <button
                  type="button"
                  onClick={() => setActiveTab('pedagogy')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'pedagogy'
                      ? 'bg-cyan-500 text-slate-950 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{isEs ? 'Ficha Pedagógica' : 'Pedagogy'}</span>
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeResource.description}
            </p>

            {/* Tab Body */}
            {activeTab === 'takeaways' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {activeResource.takeaways.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{point}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'transcript' && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed space-y-2">
                <div className="flex items-center gap-2 not-italic font-bold text-teal-700 dark:text-cyan-400 text-xs">
                  <Languages className="w-4 h-4" />
                  <span>{isEs ? 'Transcripción y mensaje en español:' : 'Verified Spanish transcript message:'}</span>
                </div>
                <p>"{activeResource.transcript || (isEs ? 'Este video cuenta con resumen didáctico estructurado en sus puntos clave.' : 'Summary available in key takeaways.')}"</p>
              </div>
            )}

            {activeTab === 'pedagogy' && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                      Idioma de Locución
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      {activeResource.audioLanguage || 'Español (Nativo)'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                      Subtítulos en Español
                    </span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                      <Subtitles className="w-3.5 h-3.5" />
                      {isEs ? 'Español (CC) Habilitado' : 'Spanish CC Enabled'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                      Institución Emisora
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white truncate block">
                      {activeResource.institutionSource || 'Aprendemos Juntos · BBVA'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-slate-800 dark:text-slate-200">
                  <span className="font-bold text-teal-800 dark:text-cyan-300 block mb-1">
                    {isEs ? 'Objetivo Pedagógico para Estudiantes:' : 'Pedagogical Goal:'}
                  </span>
                  <p className="leading-relaxed">
                    {activeResource.pedagogicalGoal || (isEs ? 'Aportar herramientas de autorregulación emocional, resiliencia y resolución pacífica de diferencias en el ámbito escolar.' : 'Promote student emotional well-being and positive school climate.')}
                  </p>
                </div>
              </div>
            )}

            {/* Confidential Counseling Callout */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-emerald-500/10 p-4 rounded-2xl border border-teal-500/20">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="text-xs text-slate-800 dark:text-slate-200">
                  {isEs
                    ? '¿Te gustaría hablar sobre este tema con orientación escolar o psicología?'
                    : 'Would you like to explore this topic further with guidance counselors?'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(isLoggedIn ? 'orientacion' : 'login')}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-xs"
              >
                <span>{isLoggedIn ? (isEs ? 'Solicitar Orientación' : 'Request Guidance') : (isEs ? 'Iniciar Sesión' : 'Sign In')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* 3. VIDEOS RECOMENDADOS (Featured Recommendations Carousel)          */}
      {/* ==================================================================== */}
      {!showOnlyFavorites && recommendedVideos.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {isEs ? 'Videos Recomendados de Orientación Escolar' : 'Recommended Guidance Videos'}
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isEs ? 'Selección del equipo de orientación' : 'Curated by counseling team'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedVideos.slice(0, 4).map((rec) => {
              const isSelected = activeResource?.id === rec.id;
              const isFav = favorites.includes(rec.id);

              return (
                <div
                  key={rec.id}
                  onClick={() => handleSelectResource(rec)}
                  className={`group rounded-2xl overflow-hidden border p-3 bg-white dark:bg-slate-900 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-500 ring-2 ring-cyan-400/40 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 hover:shadow-md'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                      <img
                        src={rec.thumbnail}
                        alt={rec.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/src/assets/images/video_stop_technique_1792612453981.jpg';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-bold">
                        {rec.duration}
                      </div>

                      {/* Favorite button */}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(rec.id, e)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                        title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                      </button>

                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-600/90 text-white text-[10px] font-bold flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" />
                        <span>Español</span>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 fill-current translate-x-0.5" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-cyan-400 block truncate">
                        {rec.categoryLabel}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-teal-700 dark:group-hover:text-cyan-300 transition-colors">
                        {rec.title}
                      </h4>
                    </div>
                  </div>

                  <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                      {rec.author}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleToggleCardPlay(e, rec)}
                      className="font-bold text-teal-700 dark:text-cyan-400 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>{isSelected && isPlaying ? (isEs ? 'Pausar' : 'Pause') : (isEs ? 'Ver video' : 'Watch')}</span>
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* 4. SEARCH, FORMATS & THE CATEGORY FILTERS                           */}
      {/* ==================================================================== */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Real-time search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEs ? 'Buscar por título, tema, estrés, autoestima, acoso...' : 'Search by title, topic, stress, self-esteem, bullying...'}
              className="w-full h-10 pl-10 pr-9 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Formats Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {formatsList.map((f) => {
              const active = selectedFormat === f.id;
              const IconComp = f.icon;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFormat(f.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                    active
                      ? 'bg-cyan-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Filter Buttons */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              {isEs ? 'Categorías:' : 'Categories:'}
            </span>
            {categoriesList.map((cat) => {
              const active = selectedCategory === cat.id;
              const IconComp = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (showOnlyFavorites) setShowOnlyFavorites(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap text-xs active:scale-95 ${
                    active
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xs font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. FULL CATALOG GRID & EMPTY STATE                                   */}
      {/* ==================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {showOnlyFavorites
                ? isEs ? 'Mis Videos Guardados en Favoritos' : 'My Saved Favorite Videos'
                : isEs ? 'Catálogo de Videos y Recursos Educativos' : 'Educational Videos & Media Catalog'}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
              {displayedResources.length}
            </span>
          </div>

          {(searchQuery || selectedCategory !== 'all' || selectedFormat !== 'all' || showOnlyFavorites) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-teal-600 dark:text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isEs ? 'Restablecer filtros' : 'Reset filters'}</span>
            </button>
          )}
        </div>

        {/* Loading state skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((sk) => (
              <div
                key={sk}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 animate-pulse"
              >
                <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : displayedResources.length === 0 ? (
          /* Informative Empty State */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mx-auto">
              {showOnlyFavorites ? <Heart className="w-8 h-8 text-rose-500" /> : <Search className="w-8 h-8" />}
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {showOnlyFavorites
                  ? isEs ? 'Aún no tienes videos guardados en favoritos' : 'No favorites saved yet'
                  : isEs ? 'No se encontraron videos para tu búsqueda' : 'No videos found'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {showOnlyFavorites
                  ? isEs
                    ? 'Haz clic en el icono del corazón ❤️ en cualquier video para guardarlo aquí y consultarlo cuando lo necesites.'
                    : 'Click the heart icon on any video to bookmark it here for later.'
                  : isEs
                  ? 'No hay materiales que coincidan con los filtros seleccionados. Prueba con otros términos o limpia la búsqueda para ver todo el catálogo.'
                  : 'No media matches your search criteria. Try adjusting keywords or clear filters.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs cursor-pointer shadow-xs transition-all"
            >
              {isEs ? 'Ver todos los videos' : 'Show all videos'}
            </button>
          </div>
        ) : (
          /* Grid of Video Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedResources.map((item) => {
              const isSelected = activeResource?.id === item.id;
              const isItemPlaying = isSelected && isPlaying;
              const isFav = favorites.includes(item.id);

              return (
                <article
                  key={item.id}
                  onClick={() => handleSelectResource(item)}
                  className={`group rounded-3xl overflow-hidden border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-cyan-500 ring-2 ring-cyan-400/40 shadow-xl shadow-cyan-500/10'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 hover:shadow-lg'
                  }`}
                >
                  <div>
                    {/* Thumbnail banner */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/src/assets/images/video_stop_technique_1792612453981.jpg';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Favorite Button on Card */}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer z-10"
                        title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                      >
                        <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                      </button>

                      {/* Play / Pause button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={(e) => handleToggleCardPlay(e, item)}
                          title={isItemPlaying ? 'Pausar video' : 'Reproducir video'}
                          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-400/30'
                              : 'bg-white/95 text-slate-900 group-hover:bg-cyan-400 group-hover:text-slate-950'
                          }`}
                        >
                          {isItemPlaying ? (
                            <Pause className="w-5 h-5 fill-current" />
                          ) : item.format === 'video' ? (
                            <Play className="w-5 h-5 fill-current translate-x-0.5" />
                          ) : item.format === 'presentacion' ? (
                            <FileText className="w-5 h-5" />
                          ) : item.format === 'infografia' ? (
                            <Info className="w-5 h-5" />
                          ) : (
                            <Headphones className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Duration badge */}
                      <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold">
                        {item.duration}
                      </div>

                      {/* Verified Spanish Audio Badge */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          <span>Español</span>
                        </span>
                        {item.isRecommended && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                            Recomendado
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content text */}
                    <div className="p-4 sm:p-5 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-teal-700 dark:text-cyan-400 uppercase tracking-wider truncate">
                          {item.categoryLabel}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium shrink-0">
                          {item.format}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-teal-700 dark:group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Card bottom bar */}
                  <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-cyan-400">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] font-normal truncate max-w-[170px]">
                      {item.author}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleToggleCardPlay(e, item)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
                    >
                      <span>
                        {isItemPlaying
                          ? (isEs ? 'Pausar' : 'Pause')
                          : isSelected
                          ? (isEs ? 'Viendo ahora' : 'Viewing')
                          : (isEs ? 'Reproducir' : 'Play')}
                      </span>
                      {isItemPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 6. ADMIN ADD VIDEO MODAL                                             */}
      {/* ==================================================================== */}
      {showAdminModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-700 dark:text-cyan-300 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {isEs ? 'Agregar Video o Recurso en Español' : 'Add Spanish Video Resource'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isEs
                      ? 'Integrado directamente a la API `/api/audiovisuales`'
                      : 'Directly integrated with `/api/audiovisuales`'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
            </div>

            <form onSubmit={handleCreateResourceSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                  {isEs ? 'Título del video:' : 'Title:'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={isEs ? 'Ej: Manejo de la Frustración y el Enojo en la Escuela' : 'E.g. Managing Frustration'}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                    {isEs ? 'Categoría Oficial:' : 'Category:'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as AudiovisualCategory)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="salud_mental">Salud Mental</option>
                    <option value="bienestar_emocional">Bienestar Emocional</option>
                    <option value="autocuidado">Autocuidado</option>
                    <option value="autoestima">Autoestima</option>
                    <option value="emociones">Manejo de Emociones</option>
                    <option value="ansiedad_estres">Ansiedad y Estrés</option>
                    <option value="relaciones">Relaciones Saludables</option>
                    <option value="convivencia">Amistad & Convivencia Escolar</option>
                    <option value="acoso">Prevención del Acoso</option>
                    <option value="comunicacion">Comunicación Asertiva</option>
                    <option value="orientacion">Orientación Estudiantil</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                    {isEs ? 'Formato del recurso:' : 'Format:'}
                  </label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as AudiovisualFormat)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="video">Video (YouTube / Directo)</option>
                    <option value="presentacion">Presentación / Diapositivas</option>
                    <option value="infografia">Infografía</option>
                    <option value="audio">Audio Guiado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                    {isEs ? 'Enlace de YouTube o video (Audio en español):' : 'YouTube or media URL (Spanish audio):'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                    {isEs ? 'Duración:' : 'Duration:'}
                  </label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="Ej: 6:30 min"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                    {isEs ? 'Autor / Ponente:' : 'Author:'}
                  </label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder={isEs ? 'Ej: Dr. Especialista en Psicología' : 'Author or Specialist'}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                    {isEs ? 'Institución emisora:' : 'Institution:'}
                  </label>
                  <input
                    type="text"
                    value={newInstitution}
                    onChange={(e) => setNewInstitution(e.target.value)}
                    placeholder={isEs ? 'Ej: Aprendemos Juntos · BBVA' : 'Institution source'}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                  {isEs ? 'Descripción del video:' : 'Description:'}
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder={isEs ? 'Breve resumen pedagógico del contenido...' : 'Short educational summary...'}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                  {isEs ? 'Puntos clave pedagógicos (uno por línea):' : 'Key takeaways (one per line):'}
                </label>
                <textarea
                  rows={3}
                  value={newTakeawaysText}
                  onChange={(e) => setNewTakeawaysText(e.target.value)}
                  placeholder={isEs ? "Paso 1: Identificar el detonante emocional\nPaso 2: Realizar 3 respiraciones lentas\nPaso 3: Comunicar de forma asertiva" : "Key point 1...\nKey point 2..."}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  {isEs ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNew}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {isSubmittingNew ? (isEs ? 'Guardando...' : 'Saving...') : (isEs ? 'Guardar en la Plataforma' : 'Save Video')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
