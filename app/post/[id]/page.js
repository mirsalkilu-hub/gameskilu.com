import Link from 'next/link';
import Image from 'next/image';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import PostViewStats from '@/components/PostViewStats';
import { getPostSocialImage } from '@/lib/postSocialMetadata';
import { supabase } from '@/lib/supabaseClient';

const getPost = cache(async (id) => {
  if (!/^\d+$/.test(id)) return null;

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', Number(id))
    .maybeSingle();

  if (error) {
    console.error('Unable to load post:', error.message);
    return null;
  }

  return data;
});

const getDescription = (content) => content
  ? content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 200)
  : 'Read the latest gaming news and updates on gameskilu.com.';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return {
      title: 'Post not found | gameskilu.com',
      robots: { index: false, follow: false },
    };
  }

  const title = `${post.title || 'Gaming post'} | gameskilu.com`;
  const description = getDescription(post.content);
  const image = getPostSocialImage(post.image);
  const url = `https://gameskilu.com/post/${post.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      siteName: 'gameskilu.com',
      title,
      description,
      images: [{ url: image, alt: post.title || 'gameskilu.com post' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  const title = post.title || 'Gaming post';
  const shareUrl = `https://gameskilu.com/post/${post.id}`;
  const shareText = `Check out this post on gameskilu.com: ${title}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100 selection:bg-cyan-500 selection:text-black">
      <header className="sticky top-0 z-40 border-b border-cyan-500/20 bg-slate-900/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/gameskilu-mark.svg" alt="" width={40} height={40} className="h-10 w-10" />
            <span className="text-xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 bg-clip-text text-transparent">
              gameskilu<span className="text-white">.com</span>
            </span>
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-cyan-300/40 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 px-3.5 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.25)] transition hover:-translate-y-0.5"
          >
            Home
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-black/30">
          <div className="border-b border-slate-800 px-5 py-5 sm:px-8">
            <Link href="/" className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200">
              &larr; Back to gameskilu.com
            </Link>
          </div>

          {post.image && (
            <div className="relative h-56 bg-slate-800 sm:h-96">
              <Image
                src={post.image}
                alt={title}
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, 896px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            </div>
          )}

          <div className="space-y-6 p-5 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {post.category && (
                <span className={`rounded-full px-3 py-1 font-bold uppercase tracking-wide ${
                  post.type === 'game' ? 'bg-purple-500/20 text-purple-200' : 'bg-cyan-500/20 text-cyan-200'
                }`}>
                  {post.category}
                </span>
              )}
              {(post.game_genre || post.gameGenre) && (
                <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">
                  {post.game_genre || post.gameGenre}
                </span>
              )}
              {post.date && <time className="text-slate-400">{post.date}</time>}
            </div>

            <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              {title}
            </h1>

            <PostViewStats postId={post.id} initialClickCount={post.click_count} />

            {post.content && (
              <div className="whitespace-pre-wrap break-words border-t border-slate-800 pt-6 text-base leading-8 text-slate-300">
                {post.content}
              </div>
            )}

            {post.specs && (
              <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <h2 className="mb-4 text-lg font-bold text-white">Minimum Specs</h2>
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  {[
                    ['OS', post.specs.os],
                    ['CPU', post.specs.cpu],
                    ['RAM', post.specs.ram],
                    ['GPU', post.specs.gpu],
                    ['Storage', post.specs.storage],
                  ].filter(([, value]) => value).map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                      <dt className="font-bold text-cyan-300">{label}</dt>
                      <dd className="mt-1 text-slate-200">{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {(post.download_url || post.downloadUrl) && (
              <a
                href={post.download_url || post.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 px-5 py-4 text-center font-black text-slate-950 transition hover:brightness-110"
              >
                {post.type === 'game' ? 'DOWNLOAD GAME NOW' : 'READ FULL ARTICLE'}
              </a>
            )}

            <section className="border-t border-slate-800 pt-5">
              <h2 className="mb-3 text-sm font-bold text-slate-300">Share this post</h2>
              <div className="flex flex-wrap gap-2 text-sm">
                <a className="rounded-lg bg-slate-800 px-3 py-2 hover:bg-slate-700" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">Facebook</a>
                <a className="rounded-lg bg-slate-800 px-3 py-2 hover:bg-slate-700" href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`} target="_blank" rel="noopener noreferrer">X</a>
                <a className="rounded-lg bg-slate-800 px-3 py-2 hover:bg-slate-700" href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                <a className="rounded-lg bg-slate-800 px-3 py-2 hover:bg-slate-700" href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`} target="_blank" rel="noopener noreferrer">Telegram</a>
              </div>
            </section>
          </div>
        </article>
      </main>

      <footer className="mt-16 border-t border-slate-800/80 bg-slate-900 text-sm text-slate-400">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-4 md:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/gameskilu-mark.svg" alt="" width={32} height={32} className="h-8 w-8" />
                <span className="text-lg font-black tracking-wider bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  gameskilu<span className="text-white">.com</span>
                </span>
              </Link>
              <p className="text-xs leading-relaxed text-slate-400">
                Your premier source for gaming news and safe, fast, and trusted PC game downloads.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">Navigation</h2>
              <ul className="space-y-2 text-xs">
                <li><Link href="/" className="transition hover:text-cyan-400">Home</Link></li>
                <li><Link href="/" className="transition hover:text-cyan-400">Latest Gaming News</Link></li>
                <li><Link href="/" className="transition hover:text-cyan-400">Download PC Games</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">Popular Categories</h2>
              <ul className="space-y-2 text-xs">
                <li><Link href="/" className="transition hover:text-cyan-400">RPG Games</Link></li>
                <li><Link href="/" className="transition hover:text-cyan-400">FPS Games</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">Admin Portal</h2>
              <p className="text-xs text-slate-400">
                Access the admin dashboard to update or publish new gaming content.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-800/60 pt-6 text-xs text-slate-500 md:flex-row">
            <p>© {new Date().getFullYear()} gameskilu.com. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
