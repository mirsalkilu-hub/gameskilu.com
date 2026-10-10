export const DEFAULT_POST_SOCIAL_IMAGE = 'https://gameskilu.com/og-default.png?v=2';
export const POST_SITE_ORIGIN = 'https://gameskilu.com';

export function getPostShareUrl(postId) {
  return new URL(`/post/${encodeURIComponent(postId)}`, POST_SITE_ORIGIN).toString();
}

export function getPostSocialImage(image) {
  if (typeof image !== 'string' || !image.trim()) return DEFAULT_POST_SOCIAL_IMAGE;

  try {
    const url = new URL(image, POST_SITE_ORIGIN);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return DEFAULT_POST_SOCIAL_IMAGE;
    }
    return url.toString();
  } catch {
    return DEFAULT_POST_SOCIAL_IMAGE;
  }
}
