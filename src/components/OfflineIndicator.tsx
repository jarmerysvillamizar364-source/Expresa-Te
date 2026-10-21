import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Language } from '../data/translations';

interface OfflineIndicatorProps {
  lang: Language;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ lang }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-6 md:right-auto z-50 flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl border border-outline-variant/30 animate-fade-in max-w-md"
    >
      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[20px]">
          cloud_off
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-label-md font-bold leading-tight">
          {lang === 'es' ? 'Modo sin conexión' : 'Offline Mode'}
        </p>
        <p className="font-body-sm text-inverse-on-surface/80 leading-snug">
          {lang === 'es'
            ? 'Los recursos precacheados continúan disponibles para tu consulta.'
            : 'Cached wellness resources remain available for viewing.'}
        </p>
      </div>
    </aside>
  );
};
