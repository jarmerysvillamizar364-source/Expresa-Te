/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import {
  PhoneCall,
  X,
  ShieldCheck,
  MessageCircle,
  ExternalLink,
  Clock,
  Heart,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Language } from '../data/translations';

interface EmergencyHelplineModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenGuidance?: () => void;
}

export const EmergencyHelplineModal: React.FC<EmergencyHelplineModalProps> = ({
  isOpen,
  onClose,
  lang,
  onOpenGuidance,
}) => {
  const isEs = lang === 'es';

  // Handle ESC key
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

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-fade-in overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-500/30 rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 my-auto text-left relative overflow-hidden"
      >
        {/* Glow ambient background aura */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0 shadow-md shadow-rose-500/10">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  {isEs ? 'Canal Oficial de Emergencia 24/7' : 'Official 24/7 Crisis Helpline'}
                </span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              </div>
              <h2 id="emergency-modal-title" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {isEs ? 'Línea 106: El Poder de Ser Escuchado' : 'Line 106: Mental Health Support'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isEs ? 'Cerrar ventana' : 'Close window'}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description & Official Verification */}
        <div className="space-y-3 relative z-10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            {isEs
              ? 'La Línea 106 es un canal institucional gratuito y confidencial de la Secretaría Distrital de Salud de Bogotá y entidades de salud pública en Colombia. Ofrece atención psicológica inmediata y contención socioemocional 24 horas al día, 7 días a la semana, para niños, niñas, adolescentes y jóvenes.'
              : 'Line 106 is a verified, free, and strictly confidential public mental health helpline in Colombia. Professional psychologists are available 24/7 for children, teens, and youth in crisis, anxiety, or grief.'}
          </p>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-slate-950/80 border border-rose-200 dark:border-rose-500/20 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-rose-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white">24 Horas al Día</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Todos los días del año</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-slate-950/80 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white">100% Gratuita</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Desde cualquier móvil</p>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Action Buttons */}
        <div className="space-y-3 pt-1 relative z-10">
          {/* 1. Direct Phone Call (Compatible with all mobile devices) */}
          <a
            href="tel:106"
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-rose-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <PhoneCall className="w-5 h-5 fill-current" />
            <span>{isEs ? 'Llamar Gratis al 106 Ahora' : 'Call Toll-Free 106 Now'}</span>
          </a>

          {/* 2. Official WhatsApp Chat */}
          <a
            href="https://wa.me/573007548933?text=Hola,%20necesito%20orientación%20y%20apoyo%20emocional"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isEs ? 'Escribir por WhatsApp: 300 754 8933' : 'Chat via WhatsApp: +57 300 754 8933'}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          {/* 3. School Counselor Guidance Fallback */}
          {onOpenGuidance && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenGuidance();
              }}
              className="w-full h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              <span>{isEs ? 'O solicitar cita con Orientación del Colegio' : 'Or book an appointment with school counselor'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 text-center flex items-center justify-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          <span>{isEs ? 'No estás solo(a). Hay un equipo humano listo para escucharte.' : 'You are not alone. Professional help is always one tap away.'}</span>
        </div>
      </div>
    </div>
  );
};
