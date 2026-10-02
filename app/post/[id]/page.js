import { cache } from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import SharedPostRedirect from '@/components/SharedPostRedirect';

const defaultImage = 'https://gameskilu.com/og-default.png?v=2';

const getPost = cache(async (id) => {
  if (!/^\d+$/.test(id)) return null;

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, content, image')
    .eq('id', Number(id))
    .maybeSingle();

  if (error) {
    console.error('Unable to load shared post metadata:', error.message);
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
  const image = post.image || defaultImage;
  const url = `https://gameskilu.com/post/${post.id}`;

  return {
    title,
    description,
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

export default async function SharedPostPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  return <SharedPostRedirect postId={post.id} title={post.title || 'Shared post'} />;
}