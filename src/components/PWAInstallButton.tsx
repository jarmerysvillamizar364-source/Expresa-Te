import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../data/translations';

interface PWAInstallButtonProps {
  lang: Language;
  variant?: 'header' | 'banner' | 'card' | 'menu';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  lang,
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // If already running standalone, suppress
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  const isEs = lang === 'es';

  // Render variant
  let buttonContent = null;

  if (variant === 'header') {
    buttonContent = (
      <button
        type="button"
        onClick={handleInstallClick}
        aria-label={isEs ? 'Instalar aplicación en dispositivo' : 'Install app on device'}
        className="h-10 px-3.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 active:scale-[0.98] transition-all font-label-md font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 border border-primary/20"
      >
        <span className="material-symbols-outlined text-[20px]">
          install_mobile
        </span>
        <span className="hidden sm:inline">
          {isEs ? 'Instalar App' : 'Install App'}
        </span>
      </button>
    );
  } else if (variant === 'banner') {
    buttonContent = (
      <div className="w-full bg-gradient-to-r from-primary/10 via-primary-container/30 to-secondary-container/20 rounded-2xl p-4 sm:p-5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[26px]">
              phone_iphone
            </span>
          </div>
          <div>
            <h4 className="font-title-md font-bold text-on-surface">
              {isEs ? 'Instala Expresa Te en tu celular o computador' : 'Install Expresa Te on your device'}
            </h4>
            <p className="font-body-sm text-on-surface-variant">
              {isEs
                ? 'Accede más rápido, sin barras del navegador y consulta recursos aún sin conexión.'
                : 'Access faster, standalone experience without browser bars, and view cached resources offline.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleInstallClick}
          className="h-11 px-5 rounded-xl bg-primary text-on-primary font-label-lg font-bold shadow-sm hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">
            download
          </span>
          <span>{isEs ? 'Instalar Ahora' : 'Install Now'}</span>
        </button>
      </div>
    );
  } else {
    // Menu or card variant
    buttonContent = (
      <button
        type="button"
        onClick={handleInstallClick}
        className="w-full h-11 px-4 rounded-xl bg-surface-container-low text-primary font-label-md font-bold hover:bg-surface-container active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[20px]">
            install_mobile
          </span>
          <span>{isEs ? 'Instalar Aplicación (PWA)' : 'Install Application (PWA)'}</span>
        </div>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
          chevron_right
        </span>
      </button>
    );
  }

  return (
    <>
      {buttonContent}

      {/* Manual Installation Guide Modal */}
      {showGuideModal && (
        <div
          onClick={() => setShowGuideModal(false)}
          className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 shadow-2xl flex flex-col gap-5 border border-outline-variant/30"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[26px]">
                    app_shortcut
                  </span>
                </div>
                <div>
                  <h3 className="font-title-lg font-bold text-on-surface">
                    {isEs ? 'Instalar Expresa Te' : 'Install Expresa Te'}
                  </h3>
                  <p className="font-body-sm text-on-surface-variant">
                    {isEs ? 'Aplicación Web Progresiva (PWA)' : 'Progressive Web App'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-9 h-9 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            {isIOS ? (
              <div className="bg-surface-container-low rounded-xl p-4 space-y-3">
                <p className="font-label-md font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    apple
                  </span>
                  {isEs ? 'Instrucciones para iPhone / iPad (Safari)' : 'iPhone / iPad (Safari) instructions'}
                </p>
                <ol className="font-body-md text-on-surface-variant space-y-2 list-decimal list-inside pl-1 leading-relaxed">
                  <li>
                    {isEs ? (
                      <>Toca el botón <strong>Compartir</strong> (ícono de cuadro con flecha hacia arriba) en la barra de Safari.</>
                    ) : (
                      <>Tap the <strong>Share</strong> button (square icon with arrow up) in Safari toolbar.</>
                    )}
                  </li>
                  <li>
                    {isEs ? (
                      <>Desliza hacia abajo y presiona <strong>"Agregar a la pantalla de inicio"</strong>.</>
                    ) : (
                      <>Scroll down and tap <strong>"Add to Home Screen"</strong>.</>
                    )}
                  </li>
                  <li>
                    {isEs ? (
                      <>Toca <strong>Agregar</strong> en la esquina superior derecha.</>
                    ) : (
                      <>Tap <strong>Add</strong> in the top right corner.</>
                    )}
                  </li>
                </ol>
              </div>
            ) : (
              <div className="bg-surface-container-low rounded-xl p-4 space-y-3">
                <p className="font-label-md font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    devices
                  </span>
                  {isEs ? 'Instrucciones para Android / Chrome / Edge' : 'Android / Chrome / Edge instructions'}
                </p>
                <ol className="font-body-md text-on-surface-variant space-y-2 list-decimal list-inside pl-1 leading-relaxed">
                  <li>
                    {isEs ? (
                      <>Presiona el menú de <strong>tres puntos (⋮)</strong> en tu navegador.</>
                    ) : (
                      <>Tap the <strong>three dots menu (⋮)</strong> in your browser.</>
                    )}
                  </li>
                  <li>
                    {isEs ? (
                      <>Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a pantalla principal"</strong>.</>
                    ) : (
                      <>Select <strong>"Install app"</strong> or <strong>"Add to home screen"</strong>.</>
                    )}
                  </li>
                  <li>
                    {isEs ? (
                      <>Confirma la instalación para disfrutar de acceso instantáneo.</>
                    ) : (
                      <>Confirm installation for immediate full-screen access.</>
                    )}
                  </li>
                </ol>
              </div>
            )}

            <div className="flex items-center gap-2 text-tertiary font-label-sm p-3 bg-tertiary/10 rounded-lg">
              <span className="material-symbols-outlined text-[18px]">
                verified_user
              </span>
              <span>
                {isEs
                  ? 'No consume almacenamiento adicional y se actualiza automáticamente.'
                  : 'Zero heavy downloads; stays seamlessly updated in real time.'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full h-11 px-5 rounded-xl bg-primary text-on-primary font-label-lg font-bold shadow-sm hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              {isEs ? 'Entendido' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
