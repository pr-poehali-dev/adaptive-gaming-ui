import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (el: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const GoogleSignInButton = () => {
  const { googleClientId, loginWithCredential } = useAuth();
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!googleClientId || !btnRef.current) return;

    let cancelled = false;

    const tryInit = () => {
      if (cancelled) return;
      if (!window.google?.accounts?.id) {
        setTimeout(tryInit, 200);
        return;
      }
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response: { credential: string }) => {
          loginWithCredential(response.credential).catch(() => {});
        },
      });
      if (btnRef.current) {
        window.google.accounts.id.renderButton(btnRef.current, {
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          text: 'signin_with',
        });
      }
    };

    tryInit();
    return () => {
      cancelled = true;
    };
  }, [googleClientId, loginWithCredential]);

  if (!googleClientId) return null;

  return <div ref={btnRef} className="[color-scheme:normal]" />;
};

export default GoogleSignInButton;
