const youtubeHosts = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'www.youtube-nocookie.com',
]);

export function getYouTubeEmbedUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;

  let url;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }

  if (!['http:', 'https:'].includes(url.protocol) || !youtubeHosts.has(url.hostname)) {
    return null;
  }

  const segments = url.pathname.split('/').filter(Boolean);
  const videoId = url.hostname === 'youtu.be'
    ? segments[0]
    : ['embed', 'shorts', 'live'].includes(segments[0])
      ? segments[1]
      : url.searchParams.get('v');

  if (!videoId || !/^[\w-]{11}$/.test(videoId)) return null;

  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
}
