import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { getPostShareUrl } from '@/lib/postSocialMetadata';

export const runtime = 'nodejs';

const jsonError = (message, status) =>
  NextResponse.json({ error: message }, { status });

export async function POST(request) {
  const authorization = request.headers.get('authorization');
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!accessToken) {
    return jsonError('Admin authentication is required.', 401);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const graphApiVersion = process.env.FACEBOOK_GRAPH_API_VERSION || 'v24.0';

  if (!supabaseUrl || !supabaseAnonKey || !pageId || !pageAccessToken) {
    console.error('Facebook integration is missing required server environment variables.');
    return jsonError('Facebook integration is not configured on the server.', 500);
  }
  if (!/^v\d+\.\d+$/.test(graphApiVersion)) {
    console.error('Facebook Graph API version has an invalid format.');
    return jsonError('Facebook integration is not configured correctly.', 500);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });

  const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
  if (userError || !user) {
    return jsonError('Admin session is invalid or expired.', 401);
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
  if (adminError) {
    console.error('Unable to verify Facebook publisher admin access:', adminError.message);
    return jsonError('Unable to verify admin access.', 500);
  }
  if (!isAdmin) {
    return jsonError('Admin access is required to publish to Facebook.', 403);
  }

  let requestBody;
  try {
    requestBody = await request.json();
  } catch {
    return jsonError('A valid post ID is required.', 400);
  }

  const postId = Number(requestBody?.postId);
  if (!Number.isSafeInteger(postId) || postId < 1) {
    return jsonError('A valid post ID is required.', 400);
  }

  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('id, title')
    .eq('id', postId)
    .maybeSingle();

  if (postError) {
    console.error('Unable to load post for Facebook delivery:', postError.message);
    return jsonError('Unable to load the published post.', 500);
  }
  if (!post) {
    return jsonError('The published post could not be found.', 404);
  }

  const postUrl = getPostShareUrl(post.id);
  const message = `${(post.title || '').trim() || 'Gaming post'}\n\n${postUrl}`;
  const body = new URLSearchParams({
    access_token: pageAccessToken,
    link: postUrl,
    message,
  });

  let facebookResponse;
  try {
    facebookResponse = await fetch(
      `https://graph.facebook.com/${graphApiVersion}/${encodeURIComponent(pageId)}/feed`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        cache: 'no-store',
      }
    );
  } catch (error) {
    console.error('Facebook delivery request failed:', error.message);
    return jsonError('Could not connect to Facebook. Try again later.', 502);
  }

  let facebookResult;
  try {
    facebookResult = await facebookResponse.json();
  } catch {
    console.error('Facebook returned an unreadable delivery response.');
    return jsonError('Facebook returned an invalid response.', 502);
  }

  if (!facebookResponse.ok || facebookResult.error) {
    const message = facebookResult.error?.message || 'Facebook rejected the post.';
    console.error('Facebook rejected the post:', message);
    return jsonError(message, 502);
  }

  return NextResponse.json({ ok: true, postId: facebookResult.id });
}
