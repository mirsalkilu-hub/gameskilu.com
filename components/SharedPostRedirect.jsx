'use client';

import { useEffect } from 'react';

export default function SharedPostRedirect({ postId, title }) {
  const destination = `/?post=${encodeURIComponent(postId)}`;

  useEffect(() => {
    window.location.replace(destination);
  }, [destination]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="max-w-lg text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">gameskilu.com</p>
        <h1 className="mt-4 text-2xl font-black">Opening {title}</h1>
        <p className="mt-2 text-sm text-slate-400">Taking you to the full post.</p>
        <a className="mt-5 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200" href={destination}>
          Continue to the post
        </a>
      </div>
    </main>
  );
}