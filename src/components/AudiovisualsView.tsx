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
  Maximize2,
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
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Heart,
  ShieldAlert,
  Users,
  Compass,
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

  // Data states
  const [resources, setResources] = useState<AudiovisualResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<AudiovisualFormat | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<AudiovisualCategory | 'all'>('all');

  // Active viewing window
  const [activeResource, setActiveResource] = useState<AudiovisualResource | null>(null);
  const [viewerMode, setViewerMode] = useState<'embed' | 'interactive'>('embed');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progress, setProgress] = useState<number>(20);
  const [activeTab, setActiveTab] = useState<'takeaways' | 'transcript' | 'slides'>('takeaways');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [mediaPlaybackError, setMediaPlaybackError] = useState<boolean>(false);

  // Future Admin Content Management Modal state
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<AudiovisualCategory>('emociones');
  const [newFormat, setNewFormat] = useState<AudiovisualFormat>('video');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDuration, setNewDuration] = useState('4:00 min');
  const [newTakeawaysText, setNewTakeawaysText] = useState('');
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  const viewerRef = useRef<HTMLDivElement>(null);

  // Fetch resources on mount or when filters change
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

      // If active resource is not set, set the first highlighted or first item
      if (!activeResource && result.resources.length > 0) {
        setActiveResource(result.resources[0]);
      }
    } catch (err: any) {
      console.error('[AudiovisualsView] Error loading resources:', err);
      setError(
        isEs
          ? 'Hubo un inconveniente al cargar el catálogo multimedia. Se muestran los recursos locales.'
          : 'Unable to sync multimedia catalog from server. Local cache is displayed.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedCategory, selectedFormat]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchResources();
    }, 280);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Interactive video progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && viewerMode === 'interactive' && activeResource?.format === 'video') {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 400 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, viewerMode, playbackSpeed, activeResource]);

  const handleSelectResource = (res: AudiovisualResource) => {
    setActiveResource(res);
    setProgress(15);
    setIsPlaying(false);
    setMediaPlaybackError(false);
    setActiveSlideIndex(0);
    setActiveTab(res.format === 'presentacion' ? 'slides' : 'takeaways');

    // Scroll viewer into view smoothly
    if (viewerRef.current) {
      viewerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFormat('all');
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
        duration: newDuration.trim() || '4:00 min',
        mediaUrl: newMediaUrl.trim(),
        author: newAuthor.trim() || (isStaff ? `${userName} (Orientación)` : 'Equipo de Orientación Escolar'),
        description: newDescription.trim() || 'Recurso educativo audiovisual para el bienestar escolar.',
        takeaways: takeawaysList.length > 0 ? takeawaysList : ['Comprender la técnica y aplicarla en el aula'],
      });

      onShowToast(isEs ? '¡Recurso audiovisual agregado exitosamente!' : 'Audiovisual resource added successfully!');
      setShowAdminModal(false);
      // Reset form
      setNewTitle('');
      setNewMediaUrl('');
      setNewDescription('');
      setNewTakeawaysText('');
      // Reload resources
      fetchResources();
      setActiveResource(created);
    } catch (err: any) {
      onShowToast(err.message || 'Error al guardar recurso');
    } finally {
      setIsSubmittingNew(false);
    }
  };

  // Category definitions with user-friendly labels
  const categoriesList: Array<{ id: AudiovisualCategory | 'all'; label: string; icon: any }> = [
    { id: 'all', label: isEs ? 'Todos los Temas' : 'All Topics', icon: Compass },
    { id: 'estres', label: isEs ? 'Manejo del Estrés' : 'Stress Management', icon: Sparkles },
    { id: 'autoestima', label: isEs ? 'Autoestima & Resiliencia' : 'Self-Esteem', icon: Heart },
    { id: 'emociones', label: isEs ? 'Emociones & Calma' : 'Emotions & Calming', icon: BookOpen },
    { id: 'autocuidado', label: isEs ? 'Autocuidado Diario' : 'Daily Self-Care', icon: RotateCcw },
    { id: 'convivencia', label: isEs ? 'Convivencia Pacífica (Ley 1620)' : 'Coexistence', icon: Users },
    { id: 'conflictos', label: isEs ? 'Resolución de Conflictos' : 'Conflict Resolution', icon: Compass },
    { id: 'acoso', label: isEs ? 'Prevención del Acoso' : 'Bullying Prevention', icon: ShieldAlert },
    { id: 'comunicacion', label: isEs ? 'Comunicación Asertiva' : 'Assertive Communication', icon: FileText },
  ];

  // Format definitions
  const formatsList: Array<{ id: AudiovisualFormat | 'all'; label: string; icon: any }> = [
    { id: 'all', label: isEs ? 'Todos los Formatos' : 'All Formats', icon: Layers },
    { id: 'video', label: isEs ? 'Videos' : 'Videos', icon: Film },
    { id: 'presentacion', label: isEs ? 'Presentaciones' : 'Slide Decks', icon: FileText },
    { id: 'infografia', label: isEs ? 'Infografías' : 'Infographics', icon: Info },
    { id: 'audio', label: isEs ? 'Audios Guiados' : 'Guided Audio', icon: Headphones },
  ];

  return (
    <div className="w-full space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* ==================================================================== */}
      {/* 1. TOP HEADER & BREADCRUMB ZONE */}
      {/* ==================================================================== */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            {/* Breadcrumb navigation */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={() => onNavigate(isLoggedIn ? 'inicio' : 'login')}
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
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-teal-700 dark:text-cyan-300 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-xs">
                <Film className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 dark:text-cyan-400">
                    {isEs ? 'Espacio Institucional Oficial' : 'Official School Hub'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {isEs ? 'Validado por Psicología' : 'Psychology Verified'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {isEs ? 'Audiovisuales & Educación Emocional' : 'Audiovisuals & Emotional Education'}
                </h1>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {isEs
                ? 'Videos, presentaciones, infografías y audios de bienestar emocional y orientación escolar. Explora recursos para el manejo del estrés, autoestima, resolución de conflictos y convivencia pacífica.'
                : 'Educational videos, slides, infographics, and mindfulness audio for school wellness and guidance.'}
            </p>
          </div>

          {/* Action buttons (Admin Add Resource + Back/Login) */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
            {/* Content Admin Button: Available for orientation/psychology staff or future preview */}
            <button
              type="button"
              onClick={() => setShowAdminModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              title={isEs ? 'Administración de recursos audiovisuales' : 'Manage media resources'}
            >
              <Plus className="w-4 h-4" />
              <span>{isEs ? 'Agregar Recurso' : 'Add Resource'}</span>
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-cyan-400" />
                <span>{isEs ? 'Hablar con Orientador' : 'Talk with Counselor'}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. MAIN ACTIVE VIEWING WINDOW (Ventana de visualización amplia)     */}
      {/* ==================================================================== */}
      {activeResource && (
        <section
          ref={viewerRef}
          aria-label={isEs ? 'Ventana de visualización multimedia' : 'Media viewer window'}
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
              {activeResource.isDemo && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  {isEs ? 'Demostrativo Institucional' : 'Demo Resource'}
                </span>
              )}

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
                    {isEs ? 'Video Embebido' : 'Embed'}
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
                    {isEs ? 'Modo Guiado' : 'Interactive'}
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setActiveResource(null)}
                title={isEs ? 'Cerrar visualizador' : 'Close viewer'}
                className="w-8 h-8 rounded-lg bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Media Stage: Video player, Slide deck, Infographic zoom, or Audio Player */}
          <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
            {mediaPlaybackError ? (
              <div className="p-6 text-center space-y-3 max-w-md">
                <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-base font-bold text-white">
                  {isEs ? 'Error al reproducir el recurso externo' : 'Error playing external media'}
                </h3>
                <p className="text-xs text-slate-300">
                  {isEs
                    ? 'No se pudo conectar con la fuente multimedia. Puedes cambiar al modo interactivo o reintentar.'
                    : 'Could not connect with external stream. You can switch to interactive mode or retry.'}
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
                    {isEs ? 'Ver en Modo Guiado' : 'View Interactive'}
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
                /* YouTube / Safe Institutional Embed Player (No autoplay audio) */
                <iframe
                  src={`${activeResource.mediaUrl}?rel=0&modestbranding=1`}
                  title={activeResource.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={() => setMediaPlaybackError(true)}
                />
              ) : (
                /* Native Interactive Player with Complete Controls */
                <div className="relative w-full h-full flex flex-col justify-between">
                  <img
                    src={activeResource.thumbnail}
                    alt={activeResource.title}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      isPlaying ? 'opacity-85' : 'opacity-65'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40" />

                  {/* Big Play/Pause Button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_35px_rgba(20,184,166,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      title={isPlaying ? 'Pausar' : 'Reproducir'}
                    >
                      {isPlaying ? (
                        <Pause className="w-9 h-9 fill-current" />
                      ) : (
                        <Play className="w-9 h-9 fill-current translate-x-0.5" />
                      )}
                    </button>
                    <span className="text-xs sm:text-sm font-bold text-white drop-shadow-md">
                      {isPlaying
                        ? isEs ? 'Reproduciendo lección guiada...' : 'Playing guided lesson...'
                        : isEs ? 'Click para iniciar lección' : 'Click to start lesson'}
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

                    {/* Button Bar */}
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
                          {String(Math.floor(((progress / 100) * 240) % 60)).padStart(2, '0')} / {activeResource.duration}
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
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          HD 1080p
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : activeResource.format === 'presentacion' ? (
              /* Interactive Slide Viewer */
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
              /* High-Resolution Infographic Zoom Viewer */
              <div className="relative w-full h-full bg-slate-900 flex items-center justify-center p-4 overflow-auto">
                <img
                  src={activeResource.thumbnail}
                  alt={activeResource.title}
                  className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-white">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>{isEs ? 'Infografía educativa oficial' : 'Official educational infographic'}</span>
                </div>
              </div>
            ) : (
              /* Guided Audio Player with Relaxing Ambience */
              <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-tr from-slate-900 via-teal-950 to-slate-950 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Headphones className="w-4 h-4" />
                    {isEs ? 'Cápsula de Audio Guiado' : 'Guided Audio Capsule'}
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
                    Tu navegador no soporta el reproductor de audio HTML5.
                  </audio>
                </div>

                <div className="text-center text-[11px] text-slate-400">
                  {isEs ? 'Usa audífonos para una experiencia de sonido inmersiva.' : 'Use headphones for optimal experience.'}
                </div>
              </div>
            )}
          </div>

          {/* Details, Takeaways & Transcript Tabs */}
          <div className="p-5 sm:p-6 space-y-4 bg-slate-50/60 dark:bg-slate-900/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-teal-700 dark:text-cyan-400 uppercase tracking-wider">
                  {activeResource.author}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {activeResource.title}
                </h3>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-1.5 shrink-0">
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
              {activeResource.description}
            </p>

            {/* Tab Body */}
            {activeTab === 'takeaways' ? (
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
            ) : (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "{activeResource.transcript || (isEs ? 'Este recurso cuenta con resumen didáctico en sus puntos clave.' : 'Summary available in key takeaways.')}"
              </div>
            )}

            {/* Guidance Callout */}
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
      {/* 3. SEARCH & CATEGORIES FILTERS BAR                                   */}
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
              placeholder={isEs ? 'Buscar por tema, técnica, estrés, acoso o autor...' : 'Search by topic, keyword, or author...'}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
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

          {/* Formats Tabs */}
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

        {/* Categories Pills */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              {isEs ? 'Temas:' : 'Topics:'}
            </span>
            {categoriesList.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap text-xs ${
                    active
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xs font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. RESOURCES GRID CATALOG                                            */}
      {/* ==================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {isEs ? 'Catálogo Multimedia Institucional' : 'Institutional Multimedia Catalog'}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
              {resources.length}
            </span>
          </div>

          {(searchQuery || selectedCategory !== 'all' || selectedFormat !== 'all') && (
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

        {/* Loading State Skeleton */}
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
        ) : resources.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {isEs ? 'No se encontraron recursos' : 'No resources found'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {isEs
                  ? 'No hay materiales que coincidan con la búsqueda actual. Prueba con otros términos o limpia los filtros.'
                  : 'No materials match the current filters. Try other keywords or reset your filters.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer shadow-xs"
            >
              {isEs ? 'Ver todos los recursos' : 'Show all resources'}
            </button>
          </div>
        ) : (
          /* Grid of Resources */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resources.map((item) => {
              const isSelected = activeResource?.id === item.id;
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
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Play badge */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                            isSelected
                              ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-400/30'
                              : 'bg-white/90 text-slate-900 group-hover:bg-cyan-400 group-hover:text-slate-950'
                          }`}
                        >
                          {item.format === 'video' ? (
                            <Play className="w-5 h-5 fill-current translate-x-0.5" />
                          ) : item.format === 'presentacion' ? (
                            <FileText className="w-5 h-5" />
                          ) : item.format === 'infografia' ? (
                            <Info className="w-5 h-5" />
                          ) : (
                            <Headphones className="w-5 h-5" />
                          )}
                        </div>
                      </div>

                      {/* Duration / Format Pill */}
                      <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold">
                        {item.duration}
                      </div>

                      {/* Format Badge Top Left */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-teal-600/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                          {item.format}
                        </span>
                        {item.isDemo && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                            Demo
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content text */}
                    <div className="p-4 sm:p-5 space-y-2">
                      <span className="text-[11px] font-bold text-teal-700 dark:text-cyan-400 uppercase tracking-wider block">
                        {item.categoryLabel}
                      </span>
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
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] font-normal truncate max-w-[180px]">
                      {item.author}
                    </span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>{isSelected ? (isEs ? 'Viendo ahora' : 'Viewing') : (isEs ? 'Abrir recurso' : 'Open')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 5. FUTURE ADMIN CONTENT MANAGEMENT MODAL                             */}
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
                    {isEs ? 'Agregar Recurso Audiovisual' : 'Add Audiovisual Resource'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isEs
                      ? 'Conectado a la API institucional `/api/audiovisuales`'
                      : 'Connected to institutional API `/api/audiovisuales`'}
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
                  {isEs ? 'Título del recurso:' : 'Title:'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={isEs ? 'Ej: Manejo de la Frustración en el Aula' : 'E.g. Managing Classroom Frustration'}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                    {isEs ? 'Tema / Categoría:' : 'Category:'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as AudiovisualCategory)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="emociones">Emociones & Calma</option>
                    <option value="estres">Manejo del Estrés</option>
                    <option value="autoestima">Autoestima & Resiliencia</option>
                    <option value="autocuidado">Autocuidado Diario</option>
                    <option value="convivencia">Convivencia Pacífica</option>
                    <option value="conflictos">Resolución de Conflictos</option>
                    <option value="acoso">Prevención del Acoso</option>
                    <option value="comunicacion">Comunicación Asertiva</option>
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
                    {isEs ? 'Enlace multimedia (URL o YouTube):' : 'Media URL (or YouTube):'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... o URL de video"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                    {isEs ? 'Duración estimada:' : 'Estimated Duration:'}
                  </label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="Ej: 5:00 min o 6 láminas"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                  {isEs ? 'Autor o dependencia responsable:' : 'Author:'}
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder={isEs ? 'Equipo de Orientación Escolar' : 'School Counseling Team'}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                  {isEs ? 'Descripción del recurso:' : 'Description:'}
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
                  {isEs ? 'Puntos clave (uno por línea):' : 'Key takeaways (one per line):'}
                </label>
                <textarea
                  rows={3}
                  value={newTakeawaysText}
                  onChange={(e) => setNewTakeawaysText(e.target.value)}
                  placeholder={isEs ? "Punto 1: Identificar la causa\nPunto 2: Respirar profundamente\nPunto 3: Pedir ayuda" : "Point 1: Identify triggers..."}
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
                  {isSubmittingNew ? (isEs ? 'Guardando...' : 'Saving...') : (isEs ? 'Guardar en la Plataforma' : 'Save Resource')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
