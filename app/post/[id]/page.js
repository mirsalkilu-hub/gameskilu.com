import Link from 'next/link';
import Image from 'next/image';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, CalendarDays, Download, Gamepad2, Newspaper, Play, Share2 } from 'lucide-react';
import PostViewStats from '@/components/PostViewStats';
import { getPostShareUrl, getPostSocialImage } from '@/lib/postSocialMetadata';
import { getYouTubeEmbedUrl } from '@/lib/youtube';
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
  const imageAlt = post.title || 'gameskilu.com post';
  const url = getPostShareUrl(post.id);

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
      images: [{ url: image, secureUrl: image, alt: imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: image, alt: imageAlt }],
    },
  };
}

export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  const title = post.title || 'Gaming post';
  const shareUrl = getPostShareUrl(post.id);
  const shareText = `Check out this post on gameskilu.com: ${title}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(post.youtube_url);
  const postDate = post.date ? new Date(`${post.date}T00:00:00`) : null;
  const formattedDate = postDate && !Number.isNaN(postDate.getTime())
    ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(postDate)
    : null;

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

      <main className="relative mx-auto w-full max-w-7xl flex-1 overflow-hidden px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-36 h-96 w-96 rounded-full bg-cyan-500/[0.07] blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-[40rem] h-96 w-96 rounded-full bg-purple-500/[0.07] blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/" className="transition hover:text-cyan-300">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="max-w-[65vw] truncate text-slate-300">{post.category || (post.type === 'game' ? 'Download Game' : 'Gaming News')}</span>
          </nav>

          <article className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-[0_30px_100px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.03] sm:rounded-[2rem]">
            <header className="relative isolate flex min-h-[410px] items-end overflow-hidden bg-gradient-to-br from-slate-900 via-cyan-950 to-purple-950 sm:min-h-[520px]">
              {post.image && (
                <Image
                  src={post.image}
                  alt={title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 1152px"
                  className="-z-20 object-cover"
                  priority
                />
              )}
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/10" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/70 via-slate-950/10 to-purple-950/10" />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />

              <div className="w-full space-y-5 p-5 sm:p-10 lg:p-14">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] shadow-lg backdrop-blur-md sm:text-[11px] ${
                    post.type === 'game'
                      ? 'border-purple-300/30 bg-purple-500/20 text-purple-100'
                      : 'border-cyan-300/30 bg-cyan-500/20 text-cyan-100'
                  }`}>
                    {post.type === 'game' ? <Gamepad2 className="h-3.5 w-3.5" /> : <Newspaper className="h-3.5 w-3.5" />}
                    {post.category || (post.type === 'game' ? 'Download Game' : 'Gaming News')}
                  </span>
                  {(post.game_genre || post.gameGenre) && (
                    <span className="rounded-full border border-white/15 bg-black/30 px-3.5 py-1.5 text-[10px] font-bold text-slate-200 backdrop-blur-md sm:text-[11px]">
                      {post.game_genre || post.gameGenre}
                    </span>
                  )}
                  {formattedDate && (
                    <time dateTime={post.date} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-3.5 py-1.5 text-[10px] font-semibold text-slate-200 backdrop-blur-md sm:text-[11px]">
                      <CalendarDays className="h-3.5 w-3.5 text-cyan-300" />
                      {formattedDate}
                    </time>
                  )}
                </div>

                <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-cyan-200/80 sm:text-xs">
                  {post.type === 'game' ? 'Game spotlight' : 'Latest gaming stories'}
                </p>
                <h1 className="max-w-4xl text-3xl font-black leading-[1.08] tracking-tight text-white [text-wrap:balance] drop-shadow-lg sm:text-5xl lg:text-6xl">
                  {title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="inline-flex rounded-xl border border-white/10 bg-slate-950/55 px-3.5 py-2.5 backdrop-blur-md">
                    <PostViewStats postId={post.id} initialClickCount={post.click_count} />
                  </div>
                  {youtubeEmbedUrl && (
                    <a href="#post-video" className="inline-flex items-center gap-2 rounded-xl border border-rose-300/25 bg-rose-500/15 px-4 py-3 text-xs font-bold text-rose-100 backdrop-blur-md transition hover:border-rose-300/50 hover:bg-rose-500/25">
                      <Play className="h-3.5 w-3.5 fill-current" /> Watch trailer
                    </a>
                  )}
                </div>
              </div>
            </header>
          <div className="grid gap-7 p-4 sm:p-8 lg:grid-cols-[minmax(0,1fr)_290px] lg:gap-10 lg:p-10">
              <div className="min-w-0 space-y-7 sm:space-y-8">
                {youtubeEmbedUrl && (
                  <section id="post-video" className="scroll-mt-24 overflow-hidden rounded-2xl border border-rose-400/20 bg-slate-950 shadow-xl shadow-black/25">
                    <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3.5 sm:px-5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/15 text-rose-300">
                          <Play className="h-4 w-4 fill-current" />
                        </span>
                        <div>
                          <h2 className="text-sm font-bold text-white">Watch the video</h2>
                          <p className="text-[11px] text-slate-500">Trailer and gameplay</p>
                        </div>
                      </div>
                      <span className="rounded-full border border-rose-300/15 bg-rose-400/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest text-rose-200">YouTube</span>
                    </div>
                    <div className="aspect-video bg-black">
                      <iframe
                        src={youtubeEmbedUrl}
                        title={`${title} YouTube video`}
                        className="h-full w-full"
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </section>
                )}

                {post.content && (
                  <section className="rounded-2xl border border-white/[0.07] bg-slate-950/40 p-5 sm:p-8">
                    <div className="mb-5 flex items-center gap-3 border-b border-white/[0.06] pb-4">
                      <span className="h-8 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-purple-500" />
                      <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-cyan-300">Inside the story</p>
                        <h2 className="mt-1 text-lg font-extrabold text-white">About this post</h2>
                      </div>
                    </div>
                    <div className="space-y-4 break-words text-[15px] leading-8 text-slate-300 sm:text-base sm:leading-[2rem]">
                      {post.content.split(/\n\s*\n/).map((paragraph, index) => (
                        <p key={`${index}-${paragraph.slice(0, 20)}`} className="whitespace-pre-wrap">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                )}

                {post.specs && (
                  <section className="rounded-2xl border border-purple-400/15 bg-gradient-to-br from-purple-950/30 to-slate-950/70 p-5 sm:p-7">
                    <div className="mb-5 flex items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
                      <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-purple-300/80">Can your PC run it?</p>
                        <h2 className="mt-1 flex items-center gap-2 text-lg font-extrabold text-white">
                          <Gamepad2 className="h-4 w-4 text-purple-300" /> Minimum PC specs
                        </h2>
                      </div>
                      <span className="rounded-full border border-purple-300/15 bg-purple-400/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-purple-200">Requirements</span>
                    </div>
                    <dl className="grid gap-3 sm:grid-cols-2">
                      {[
                        ['OS', post.specs.os],
                        ['CPU', post.specs.cpu],
                        ['RAM', post.specs.ram],
                        ['GPU', post.specs.gpu],
                        ['Storage', post.specs.storage],
                      ].filter(([, value]) => value).map(([label, value]) => (
                        <div key={label} className="rounded-xl border border-white/[0.06] bg-slate-900/80 p-3.5 transition hover:border-purple-300/20">
                          <dt className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-purple-300">{label}</dt>
                          <dd className="mt-1.5 break-words text-sm font-medium text-slate-200">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                )}
              </div>

              <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
                {(post.download_url || post.downloadUrl) && (
                  <section className="relative overflow-hidden rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-950/70 via-slate-900 to-purple-950/50 p-5 shadow-lg shadow-cyan-950/20">
                    <div aria-hidden="true" className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />
                    <div className="relative">
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-cyan-300">
                        {post.type === 'game' ? 'Ready to play?' : 'Continue reading'}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">
                        {post.type === 'game' ? 'Get the game and jump into your next adventure.' : 'Visit the original article or source for more information.'}
                      </p>
                      <a
                        href={post.download_url || post.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500 px-4 py-3 text-center text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-cyan-500/15 transition hover:-translate-y-0.5 hover:brightness-110"
                      >
                        {post.type === 'game' ? <Download className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                        {post.type === 'game' ? 'Download game' : 'Read full article'}
                      </a>
                      <p className="mt-3 text-center text-[10px] text-slate-500">Opens in a new tab</p>
                    </div>
                  </section>
                )}

                <section className="rounded-2xl border border-white/[0.07] bg-slate-950/50 p-5">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-cyan-300" />
                    <h2 className="text-sm font-bold text-white">Share this post</h2>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">Send this gaming post to your friends.</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <a className="rounded-xl border border-white/[0.07] bg-slate-900 px-3 py-2.5 text-center text-xs font-semibold text-slate-300 transition hover:border-blue-400/40 hover:text-white" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a className="rounded-xl border border-white/[0.07] bg-slate-900 px-3 py-2.5 text-center text-xs font-semibold text-slate-300 transition hover:border-sky-400/40 hover:text-white" href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`} target="_blank" rel="noopener noreferrer">X / Twitter</a>
                    <a className="rounded-xl border border-white/[0.07] bg-slate-900 px-3 py-2.5 text-center text-xs font-semibold text-slate-300 transition hover:border-emerald-400/40 hover:text-white" href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                    <a className="rounded-xl border border-white/[0.07] bg-slate-900 px-3 py-2.5 text-center text-xs font-semibold text-slate-300 transition hover:border-cyan-400/40 hover:text-white" href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`} target="_blank" rel="noopener noreferrer">Telegram</a>
                  </div>
                </section>
              </aside>
            </div>
          </article>
        </div>
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
