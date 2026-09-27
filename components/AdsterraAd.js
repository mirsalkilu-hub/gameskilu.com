'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraAd() {
  const adRef = useRef(null);

  useEffect(() => {
    if (!adRef.current || typeof window === 'undefined') return;

    const container = adRef.current;
    container.innerHTML = '';

    const adKey = process.env.NEXT_PUBLIC_ADSTERRA_KEY || 'KODE_KEY_ADSTERRA_ANDA';

    if (!adKey || adKey === 'KODE_KEY_ADSTERRA_ANDA') {
      return;
    }

    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.text = `
      window.atOptions = {
        key: '${adKey}',
        format: 'iframe',
        height: 250,
        width: 300,
        params: {}
      };
    `;

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.async = true;
    invokeScript.src = 'https://www.highperformanceformat.com/' + adKey + '/invoke.js';

    container.appendChild(configScript);
    container.appendChild(invokeScript);

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return (
    <div className="my-4 flex justify-center text-center">
      <div ref={adRef} className="min-h-[250px]" />
    </div>
  );
}