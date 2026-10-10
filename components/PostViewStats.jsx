'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const getClickCount = (value) => Math.max(0, Number(value) || 0);

export default function PostViewStats({ postId, initialClickCount }) {
  const [clickCount, setClickCount] = useState(getClickCount(initialClickCount));
  const hasRecordedView = useRef(false);

  useEffect(() => {
    if (hasRecordedView.current) return;
    hasRecordedView.current = true;

    const recordView = async () => {
      const { data, error } = await supabase.rpc('increment_post_click_count', {
        target_post_id: postId,
      });

      if (error) {
        console.error('Error recording post view:', error.message);
        return;
      }

      const updatedCount = Number(data);
      if (Number.isFinite(updatedCount)) setClickCount(updatedCount);
    };

    recordView();
  }, [postId]);

  const rating = Math.min(5, 4 + clickCount / 100);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
      <span className="font-semibold text-amber-300">★ {rating.toFixed(2)} / 5.00</span>
      <span>{new Intl.NumberFormat('id-ID').format(clickCount)} views</span>
    </div>
  );
}
