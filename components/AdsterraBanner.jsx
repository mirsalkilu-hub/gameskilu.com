"use client";

import { useEffect, useRef } from "react";

export default function AdsterraBanner() {
  const adRef = useRef(null);

  useEffect(() => {
    // Pastikan script hanya dipanggil sekali di browser
    if (adRef.current && !adRef.current.firstChild) {
      const confScript = document.createElement("script");
      const invokeScript = document.createElement("script");

      // Konfigurasi Banner Adsterra (Sesuaikan nilai key, format, height, width dari Adsterra Anda)
      confScript.type = "text/javascript";
      confScript.text = `
        atOptions = {
          'key' : '80bb8b39622cb8541d677c75167d703d',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      `;

      // Adsterra trigger script
      invokeScript.type = "text/javascript";
      invokeScript.src = "https://awkwardmonopoly.com/80bb8b39622cb8541d677c75167d703d/invoke.js";

      // Append the scripts to the container div
      adRef.current.appendChild(confScript);
      adRef.current.appendChild(invokeScript);
    }
  }, []);

  return (
    <div className="flex justify-center items-center my-6 overflow-hidden">
      <div ref={adRef} />
    </div>
  );
}