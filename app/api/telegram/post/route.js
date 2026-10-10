import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { getPostSocialImage } from '@/lib/postSocialMetadata';

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
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID;

  if (!supabaseUrl || !supabaseAnonKey || !botToken || !channelId) {
    console.error('Telegram integration is missing required server environment variables.');
    return jsonError('Telegram integration is not configured on the server.', 500);
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
    console.error('Unable to verify Telegram publisher admin access:', adminError.message);
    return jsonError('Unable to verify admin access.', 500);
  }
  if (!isAdmin) {
    return jsonError('Admin access is required to publish to Telegram.', 403);
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
    .select('id, image')
    .eq('id', postId)
    .maybeSingle();

  if (postError) {
    console.error('Unable to load post for Telegram delivery:', postError.message);
    return jsonError('Unable to load the published post.', 500);
  }
  if (!post) {
    return jsonError('The published post could not be found.', 404);
  }

  const postUrl = `https://gameskilu.com/post/${post.id}`;
  const telegramBody = {
    chat_id: channelId,
    photo: getPostSocialImage(post.image),
    caption: postUrl,
  };

  let telegramResponse;
  try {
    telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telegramBody),
      cache: 'no-store',
    });
  } catch {
    console.error('Could not reach the Telegram Bot API.');
    return jsonError('Could not reach the Telegram Bot API. Try again later.', 502);
  }

  const telegramResult = await telegramResponse.json();
  if (!telegramResponse.ok || !telegramResult.ok) {
    const message = telegramResult.description || 'Telegram rejected the post.';
    console.error('Telegram rejected the post:', message);
    return jsonError(message, 502);
  }

  return NextResponse.json({ ok: true });
}
