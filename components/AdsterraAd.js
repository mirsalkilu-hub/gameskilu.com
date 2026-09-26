'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraAd() {
  const adRef = useRef(null);

  useEffect(() => {
    if (!adRef.current) return;

    // Kosongkan container sebelum merender ulang
    adRef.current.innerHTML = '';

    // Masukkan konfigurasi iklan Adsterra
    const atOptions = document.createElement('script');
    atOptions.type = 'text/javascript';
    atOptions.innerHTML = `
      atOptions = {
        'key' : 'KODE_KEY_ADSTERRA_ANDA',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    // Masukkan skrip pengpanggil iklan
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//www.highperformanceformat.com/KODE_KEY_ADSTERRA_ANDA/invoke.js';

    adRef.current.appendChild(atOptions);
    adRef.current.appendChild(script);
  }, []);

  return (
    <div className="my-4 flex justify-center text-center">
      <div ref={adRef} />
    </div>
  );
}