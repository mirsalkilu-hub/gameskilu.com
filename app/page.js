'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Gamepad2, 
  Download, 
  Lock, 
  User, 
  LogOut, 
  Plus, 
  Trash2, 
  Search, 
  Cpu, 
  Menu, 
  X,
  Star,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles,
  Flame,
  ChevronRight,
  TrendingUp,
  Loader2,
  Edit3,
  Save,
  Share2,
  Send,
  MessageCircle,
  Copy,
  Check,
  LayoutDashboard,
  FileText,
  Tag,
  Image as ImageIcon,
  HardDrive,
  Monitor,
  Activity,
  Layers
} from 'lucide-react';

export default function GamePortal() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('public');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // State Modal Edit Post
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState(null);

  // State Hero Switcher
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);

  // State Salin Pautan
  const [copiedId, setCopiedId] = useState(null);

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // State Form New Post
  const [newPost, setNewPost] = useState({
    title: '',
    category: 'News',
    gameGenre: 'Action',
    type: 'news',
    image: '',
    content: '',
    downloadUrl: '',
    os: '',
    cpu: '',
    ram: '',
    gpu: '',
    storage: ''
  });

  // FETCH DATA
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const featuredPosts = posts.slice(0, 3);
  const currentHero = featuredPosts[activeHeroIdx] || featuredPosts[0];

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'K@ira123') {
      setIsLoggedIn(true);
      setCurrentView('admin-dashboard');
      setLoginError('');
      setLoginForm({ username: '', password: '' });
    } else {
      setLoginError('Invalid Username or Password!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('public');
  };

  // FUNGSI PERKONGSIAN SOSIAL MEDIA
  const handleShare = (platform, post, e) => {
    if (e) e.stopPropagation();
    
    // Pautan asas ke laman web / postingan
    const shareUrl = encodeURIComponent(window.location.origin + '?post=' + post.id);
    const shareText = encodeURIComponent(`Lihat postingan ini di gameskilu.com: ${post.title}`);

    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        window.open(url, '_blank', 'width=600,height=400');
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
        window.open(url, '_blank', 'width=600,height=400');
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;
        window.open(url, '_blank');
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${shareUrl}&text=${shareText}`;
        window.open(url, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(window.location.origin + '?post=' + post.id);
        setCopiedId(post.id);
        setTimeout(() => setCopiedId(null), 2000);
        break;
      default:
        break;
    }
  };

  // TAMBAH POSTINGAN KE SUPABASE
  const handleCreatePost = async (e) => {
    e.preventDefault();

    const postPayload = {
      title: newPost.title,
      category: newPost.category,
      game_genre: newPost.gameGenre,
      type: newPost.type,
      date: new Date().toISOString().split('T')[0],
      image: newPost.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      content: newPost.content,
      download_url: newPost.type === 'game' ? newPost.downloadUrl : '',
      specs: newPost.type === 'game' ? {
        os: newPost.os || 'Windows 10/11 64-bit',
        cpu: newPost.cpu || 'Intel Core i5 / AMD Ryzen 5',
        ram: newPost.ram || '16 GB RAM',
        gpu: newPost.gpu || 'NVIDIA GTX 1660 / AMD RX 580',
        storage: newPost.storage || '50 GB SSD'
      } : null,
      rating: 5.0
    };

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([postPayload])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setPosts([data[0], ...posts]);
        setActiveHeroIdx(0);
        setNewPost({
          title: '',
          category: 'News',
          gameGenre: 'Action',
          type: 'news',
          image: '',
          content: '',
          downloadUrl: '',
          os: '',
          cpu: '',
          ram: '',
          gpu: '',
          storage: ''
        });
        alert('Post published successfully to Supabase!');
      }
    } catch (err) {
      alert('Failed to save post: ' + err.message);
    }
  };

  // MODAL EDIT
  const handleOpenEditModal = (post) => {
    setEditingPost(post);
    setEditForm({
      id: post.id,
      title: post.title || '',
      category: post.category || 'News',
      gameGenre: post.game_genre || post.gameGenre || 'Action',
      type: post.type || 'news',
      image: post.image || '',
      content: post.content || '',
      downloadUrl: post.download_url || post.downloadUrl || '',
      rating: post.rating || 5.0,
      os: post.specs?.os || '',
      cpu: post.specs?.cpu || '',
      ram: post.specs?.ram || '',
      gpu: post.specs?.gpu || '',
      storage: post.specs?.storage || ''
    });
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    const updatedPayload = {
      title: editForm.title,
      category: editForm.category,
      game_genre: editForm.gameGenre,
      type: editForm.type,
      image: editForm.image,
      content: editForm.content,
      download_url: editForm.type === 'game' ? editForm.downloadUrl : '',
      rating: Number(editForm.rating) || 5.0,
      specs: editForm.type === 'game' ? {
        os: editForm.os || 'Windows 10/11 64-bit',
        cpu: editForm.cpu || 'Intel Core i5 / AMD Ryzen 5',
        ram: editForm.ram || '16 GB RAM',
        gpu: editForm.gpu || 'NVIDIA GTX 1660 / AMD RX 580',
        storage: editForm.storage || '50 GB SSD'
      } : null
    };

    try {
      const { error } = await supabase
        .from('posts')
        .update(updatedPayload)
        .eq('id', editForm.id);

      if (error) throw error;

      setPosts(posts.map(p => p.id === editForm.id ? { ...p, ...updatedPayload } : p));
      setEditingPost(null);
      alert('Post updated successfully!');
    } catch (err) {
      alert('Failed to update post: ' + err.message);
    }
  };

  const handleDeletePost = async (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setPosts(posts.filter(post => post.id !== id));
      } catch (err) {
        alert('Failed to delete post: ' + err.message);
      }
    }
  };

  const filteredPosts = posts.filter(post => {
    const genre = post.game_genre || post.gameGenre || '';
    const matchesCategory = selectedCategory === 'All' || 
      (selectedCategory === 'News' && post.type === 'news') ||
      (selectedCategory === 'Download Game' && post.type === 'game') ||
      genre.toLowerCase().includes(selectedCategory.toLowerCase());
    
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black flex flex-col justify-between">
      <div>
        {/* NAVBAR */}
        <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('public')}>
                <div className="bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-2 rounded-xl shadow-lg shadow-cyan-500/30">
                  <Gamepad2 className="w-6 h-6 text-black" />
                </div>
                <span className="text-xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 bg-clip-text text-transparent">
                  gameskilu<span className="text-white">.com</span>
                </span>
              </div>

              <div className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => setCurrentView('public')}
                  className={`hover:text-cyan-400 transition-colors font-semibold ${currentView === 'public' ? 'text-cyan-400' : 'text-slate-300'}`}
                >
                  Home
                </button>
                
                {isLoggedIn ? (
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setCurrentView('admin-dashboard')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md border border-cyan-500/50 bg-cyan-950/30 text-cyan-400 hover:bg-cyan-900/50 transition`}
                    >
                      <User className="w-4 h-4" /> Admin Dashboard
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-md transition"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setCurrentView('admin-login')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold shadow-lg shadow-cyan-500/20 transition transform active:scale-95"
                  >
                    <Lock className="w-4 h-4" /> Admin Login
                  </button>
                )}
              </div>

              <div className="md:hidden">
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-slate-300 hover:text-white focus:outline-none"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-3">
              <button 
                onClick={() => { setCurrentView('public'); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 text-slate-300 hover:text-cyan-400 font-semibold"
              >
                Home
              </button>
              {isLoggedIn ? (
                <>
                  <button 
                    onClick={() => { setCurrentView('admin-dashboard'); setMobileMenuOpen(false); }}
                    className="block w-full text-left py-2 text-cyan-400 font-semibold"
                  >
                    Admin Dashboard
                  </button>
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="block w-full text-left py-2 text-rose-400 font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { setCurrentView('admin-login'); setMobileMenuOpen(false); }}
                  className="block w-full text-center py-2 bg-cyan-500 text-black font-bold rounded-lg"
                >
                  Admin Login
                </button>
              )}
            </div>
          )}
        </nav>

        {/* CONTENT ROUTER */}
        {currentView === 'public' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {currentHero && (
              <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-900/90 shadow-2xl shadow-cyan-950/60 min-h-[460px] flex flex-col justify-between group">
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img 
                    src={currentHero.image} 
                    alt={currentHero.title} 
                    className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700 brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40"></div>
                </div>

                <div className="relative z-10 p-6 md:p-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> {currentHero.category || 'FEATURED'}
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 bg-black/40 px-3 py-1 rounded-full border border-white/10">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Safe & Verified Files
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-300 bg-black/50 px-3.5 py-1.5 rounded-full border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="font-semibold">gameskilu.com CDN Online</span>
                  </div>
                </div>

                <div className="relative z-10 px-6 md:px-12 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4 text-left">
                    <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-widest">
                      <Flame className="w-4 h-4 text-amber-400" /> Featured Release • {currentHero.game_genre || currentHero.gameGenre || 'GAMING'}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none drop-shadow-md">
                      {currentHero.title}
                    </h1>

                    <p className="text-slate-300 text-sm md:text-base max-w-2xl font-medium leading-relaxed drop-shadow line-clamp-2">
                      {currentHero.content}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-3">
                      <button 
                        onClick={() => setSelectedPost(currentHero)}
                        className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-black text-sm shadow-xl shadow-cyan-500/30 transition-all flex items-center gap-2"
                      >
                        <Download className="w-4 h-4 fill-black" /> {currentHero.type === 'game' ? 'Get Game / Read Review' : 'Read Article'}
                      </button>

                      <div className="flex items-center gap-4 text-xs font-bold text-slate-300 bg-slate-900/80 px-4 py-3 rounded-xl border border-white/10 backdrop-blur-md">
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span>{currentHero.rating ? Number(currentHero.rating).toFixed(1) : '5.0'} / 5.0</span>
                        </div>
                        <span className="text-slate-600">|</span>
                        <span className="text-cyan-400">{currentHero.specs?.storage || 'Verified Content'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Quick Featured Switcher
                    </p>
                    <div className="space-y-2">
                      {featuredPosts.map((item, idx) => (
                        <div 
                          key={item.id}
                          onClick={() => setActiveHeroIdx(idx)}
                          className={`p-3 rounded-xl cursor-pointer border transition-all duration-300 flex items-center gap-3 backdrop-blur-md ${
                            activeHeroIdx === idx 
                              ? 'bg-cyan-500/20 border-cyan-400/80 shadow-lg shadow-cyan-500/10' 
                              : 'bg-slate-950/60 border-white/10 hover:bg-slate-900/80'
                          }`}
                        >
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-xs font-bold truncate ${activeHeroIdx === idx ? 'text-cyan-300' : 'text-slate-200'}`}>
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 block truncate">{item.game_genre || item.gameGenre || item.category}</span>
                          </div>
                          <ChevronRight className={`w-4 h-4 ${activeHeroIdx === idx ? 'text-cyan-400' : 'text-slate-600'}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative z-10 bg-slate-950/80 border-t border-white/10 px-6 py-3 flex flex-wrap items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1.5 font-bold text-slate-300">
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> High-Speed Mirror Links
                    </span>
                    <span className="hidden md:inline-flex items-center gap-1.5 text-slate-400">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Full Specs & Install Guides
                    </span>
                  </div>
                  <div className="text-[11px] text-cyan-400 font-semibold tracking-wide">
                    gameskilu.com • Official Gaming Portal
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {['All', 'News', 'Download Game', 'RPG', 'FPS'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === cat 
                        ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search news / games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-cyan-400 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-xs font-semibold text-slate-400">Connecting to Supabase Database...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <div 
                    key={post.id} 
                    className="bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 flex flex-col group shadow-xl"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold shadow-md ${
                          post.type === 'game' ? 'bg-purple-600 text-white' : 'bg-cyan-500 text-black'
                        }`}>
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span className="text-cyan-400 font-semibold">{post.game_genre || post.gameGenre}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                          {post.content}
                        </p>
                      </div>

                      {/* BAHAGIAN KONGSI SOSIAL MEDIA & BACA DENGAN TELITI */}
                      <div className="pt-4 border-t border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                            <Star className="w-4 h-4 fill-amber-400" />
                            <span>{post.rating ? Number(post.rating).toFixed(1) : '5.0'}</span>
                          </div>

                          <button 
                            onClick={() => setSelectedPost(post)}
                            className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                          >
                            Read More <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* BUTANG BAGIKAN KE SOSIAL MEDIA */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-slate-400 text-xs">
                          <span className="text-[11px] font-medium flex items-center gap-1 text-slate-400">
                            <Share2 className="w-3.5 h-3.5 text-cyan-400" /> Bagikan:
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={(e) => handleShare('facebook', post, e)}
                              className="p-1.5 bg-slate-950 hover:bg-blue-600 hover:text-white rounded-lg transition text-slate-300"
                              title="Bagikan ke Facebook"
                            >
                              <span className="font-bold text-xs px-0.5">fb</span>
                            </button>
                            <button 
                              onClick={(e) => handleShare('twitter', post, e)}
                              className="p-1.5 bg-slate-950 hover:bg-sky-500 hover:text-white rounded-lg transition text-slate-300"
                              title="Bagikan ke Twitter / X"
                            >
                              <span className="font-bold text-xs px-0.5">X</span>
                            </button>
                            <button 
                              onClick={(e) => handleShare('whatsapp', post, e)}
                              className="p-1.5 bg-slate-950 hover:bg-emerald-600 hover:text-white rounded-lg transition text-slate-300"
                              title="Bagikan ke WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={(e) => handleShare('telegram', post, e)}
                              className="p-1.5 bg-slate-950 hover:bg-cyan-600 hover:text-white rounded-lg transition text-slate-300"
                              title="Bagikan ke Telegram"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={(e) => handleShare('copy', post, e)}
                              className="p-1.5 bg-slate-950 hover:bg-cyan-500 hover:text-black rounded-lg transition text-slate-300"
                              title="Salin Pautan"
                            >
                              {copiedId === post.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        )}

        {/* LOGIN VIEW */}
        {currentView === 'admin-login' && (
          <div className="max-w-md mx-auto px-4 py-16">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-block p-3 bg-cyan-500/10 rounded-full border border-cyan-500/30 mb-2">
                  <Lock className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Admin Login - gameskilu.com</h2>
                <p className="text-xs text-slate-400">Enter your credentials to manage portal content</p>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-950/50 border border-rose-500/50 rounded-lg text-xs text-rose-300">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
                  <input 
                    type="text" 
                    required
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                  <input 
                    type="password" 
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold rounded-lg shadow-lg shadow-cyan-500/20 transition"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ADMIN DASHBOARD VIEW (DIPERBAIKI) */}
        {currentView === 'admin-dashboard' && isLoggedIn && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* DASHBOARD HEADER */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-cyan-500/30 p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-cyan-950/40">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest">
                    <LayoutDashboard className="w-4 h-4" /> Management Console
                  </div>
                  <h1 className="text-3xl font-black text-white tracking-tight">
                    Administrator <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Dashboard</span>
                  </h1>
                  <p className="text-slate-400 text-sm">
                    Kelola berita, pembaruan game, dan link unduhan gameskilu.com secara real-time.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Session: Active Admin</span>
                  </div>
                  
                </div>
              </div>

              {/* STATS SUMMARY BAR */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/80">
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80 flex items-center gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">{posts.length}</div>
                    <div className="text-xs text-slate-400 font-medium">Total Konten Terpublikasi</div>
                  </div>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80 flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">
                      {posts.filter(p => p.type === 'game').length}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">Game Downloads</div>
                  </div>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80 flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">
                      {posts.filter(p => p.type === 'news').length}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">Gaming News</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CREATE POST FORM DENGAN INPUT GPU DAN STORAGE */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/30">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Buat Postingan Baru</h2>
                    <p className="text-xs text-slate-400">Tambahkan berita atau tautan download game ke Supabase</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 hidden sm:inline-block">
                  Auto-Sync Ready
                </span>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-cyan-400" /> Post Title
                    </label>
                    <input 
                      type="text" 
                      required
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      placeholder="e.g. EA Sports FC 25 Releasing Soon..."
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" /> Content Type
                    </label>
                    <select 
                      value={newPost.type}
                      onChange={(e) => setNewPost({
                        ...newPost, 
                        type: e.target.value,
                        category: e.target.value === 'game' ? 'Download Game' : 'News'
                      })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition cursor-pointer"
                    >
                      <option value="news">Gaming News</option>
                      <option value="game">Download Game</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-cyan-400" /> Game Genre / Sub-category
                    </label>
                    <input 
                      type="text" 
                      required
                      value={newPost.gameGenre}
                      onChange={(e) => setNewPost({...newPost, gameGenre: e.target.value})}
                      placeholder="RPG, Action, Open World, ETC"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> Image Cover URL
                    </label>
                    <input 
                      type="text" 
                      value={newPost.image}
                      onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition"
                    />
                  </div>
                </div>

                {/* AREA SPESIFIKASI GAME */}
                {newPost.type === 'game' && (
                  <div className="p-5 bg-slate-950 rounded-2xl border border-purple-500/30 space-y-4 shadow-lg shadow-purple-950/20">
                    <div className="flex items-center gap-2 border-b border-purple-500/20 pb-3">
                      <Cpu className="w-4 h-4 text-purple-400" />
                      <h3 className="text-xs font-black text-purple-400 uppercase tracking-wider">
                        Download Settings & PC Specifications
                      </h3>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">Download Link URL</label>
                      <input 
                        type="url" 
                        required={newPost.type === 'game'}
                        value={newPost.downloadUrl}
                        onChange={(e) => setNewPost({...newPost, downloadUrl: e.target.value})}
                        placeholder="https://..."
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <Monitor className="w-3 h-3 text-purple-400" /> OS
                        </label>
                        <input 
                          type="text" 
                          placeholder="Win 11 64-bit" 
                          value={newPost.os}
                          onChange={(e) => setNewPost({...newPost, os: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-purple-400" /> CPU
                        </label>
                        <input 
                          type="text" 
                          placeholder="i5 / Ryzen 5" 
                          value={newPost.cpu}
                          onChange={(e) => setNewPost({...newPost, cpu: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <Activity className="w-3 h-3 text-purple-400" /> RAM
                        </label>
                        <input 
                          type="text" 
                          placeholder="16 GB" 
                          value={newPost.ram}
                          onChange={(e) => setNewPost({...newPost, ram: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <Zap className="w-3 h-3 text-purple-400" /> GPU
                        </label>
                        <input 
                          type="text" 
                          placeholder="GTX 1660" 
                          value={newPost.gpu}
                          onChange={(e) => setNewPost({...newPost, gpu: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <HardDrive className="w-3 h-3 text-purple-400" /> Storage
                        </label>
                        <input 
                          type="text" 
                          placeholder="50 GB SSD" 
                          value={newPost.storage}
                          onChange={(e) => setNewPost({...newPost, storage: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Content / Description</label>
                  <textarea 
                    rows="4"
                    required
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="Tulis ulasan berita lengkap atau panduan instalasi..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition leading-relaxed"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end">
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" /> Publish Post to Supabase
                  </button>
                </div>
              </form>
            </div>

            {/* TABEL MANAJEMEN POSTINGAN */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" /> Active Content Library
                  </h2>
                  <p className="text-xs text-slate-400">Daftar postingan aktif yang tersimpan di database Supabase</p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-mono">
                  Total Items: {posts.length}
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/40">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">Post Detail</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Genre</th>
                      <th className="p-4">Publish Date</th>
                      <th className="p-4 text-center w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {posts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-500 text-xs font-medium">
                          Belum ada postingan yang dibuat.
                        </td>
                      </tr>
                    ) : (
                      posts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/40 transition-colors group">
                          <td className="p-4">
                            <div className="flex items-center gap-3 max-w-md">
                              <img 
                                src={p.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f'} 
                                alt={p.title} 
                                className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-slate-800"
                              />
                              <div className="min-w-0">
                                <h4 className="font-bold text-white truncate text-xs sm:text-sm group-hover:text-cyan-400 transition-colors">
                                  {p.title}
                                </h4>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                  {p.content}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                              p.type === 'game' 
                                ? 'bg-purple-950/80 text-purple-300 border border-purple-500/30' 
                                : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                            }`}>
                              {p.type === 'game' ? <Download className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                              {p.category}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-slate-400 font-semibold">
                            {p.game_genre || p.gameGenre || '-'}
                          </td>
                          <td className="p-4 text-xs text-slate-400 font-mono">
                            {p.date}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleOpenEditModal(p)}
                                className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl transition-all duration-200 active:scale-95"
                                title="Edit Post"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button 
                                onClick={() => handleDeletePost(p.id)}
                                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition-all duration-200 active:scale-95"
                                title="Delete Post"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* MODAL EDIT POST */}
        {editingPost && editForm && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-cyan-500/40 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl shadow-cyan-950/80 flex flex-col relative max-h-[90vh]">
              
              <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">Edit Post</h3>
                </div>
                <button 
                  onClick={() => setEditingPost(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdatePost} className="p-6 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Post Title</label>
                  <input 
                    type="text" 
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Category / Type</label>
                    <select 
                      value={editForm.type}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        type: e.target.value,
                        category: e.target.value === 'game' ? 'Download Game' : 'News'
                      })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="news">Gaming News</option>
                      <option value="game">Download Game</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Game Genre</label>
                    <input 
                      type="text" 
                      value={editForm.gameGenre}
                      onChange={(e) => setEditForm({ ...editForm, gameGenre: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Image URL</label>
                    <input 
                      type="text" 
                      value={editForm.image}
                      onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Rating (1.0 - 5.0)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={editForm.rating}
                      onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {editForm.type === 'game' && (
                  <div className="p-4 bg-slate-950 rounded-xl border border-purple-500/20 space-y-3">
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                      Download Settings & Specs
                    </h4>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Download Link</label>
                      <input 
                        type="url" 
                        value={editForm.downloadUrl}
                        onChange={(e) => setEditForm({ ...editForm, downloadUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <input 
                        type="text" 
                        placeholder="OS" 
                        value={editForm.os}
                        onChange={(e) => setEditForm({ ...editForm, os: e.target.value })}
                        className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                      />
                      <input 
                        type="text" 
                        placeholder="CPU" 
                        value={editForm.cpu}
                        onChange={(e) => setEditForm({ ...editForm, cpu: e.target.value })}
                        className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                      />
                      <input 
                        type="text" 
                        placeholder="RAM" 
                        value={editForm.ram}
                        onChange={(e) => setEditForm({ ...editForm, ram: e.target.value })}
                        className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                      />
                      <input 
                        type="text" 
                        placeholder="GPU" 
                        value={editForm.gpu}
                        onChange={(e) => setEditForm({ ...editForm, gpu: e.target.value })}
                        className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                      />
                      <input 
                        type="text" 
                        placeholder="Storage" 
                        value={editForm.storage}
                        onChange={(e) => setEditForm({ ...editForm, storage: e.target.value })}
                        className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Content / Description</label>
                  <textarea 
                    rows="4"
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setEditingPost(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DETAIL MODAL DENGAN BUTANG KONGSI */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
            <div className="bg-slate-900/95 border border-cyan-500/30 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl shadow-cyan-950/80 flex flex-col relative max-h-[92vh]">
              
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-slate-950/70 hover:bg-rose-600/90 border border-white/10 text-slate-300 hover:text-white rounded-full transition-all duration-300 backdrop-blur-md shadow-lg group"
                title="Close"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-cyan-500/30 [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                  <img 
                    src={selectedPost.image} 
                    alt={selectedPost.title} 
                    className="w-full h-full object-cover object-center scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-transparent to-transparent"></div>

                  <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-3 z-10">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg border backdrop-blur-md ${
                        selectedPost.type === 'game' 
                          ? 'bg-purple-600/80 border-purple-400/50 text-white shadow-purple-500/20' 
                          : 'bg-cyan-500/80 border-cyan-400/50 text-black shadow-cyan-500/20'
                      }`}>
                        {selectedPost.category || 'Post Detail'}
                      </span>

                      {(selectedPost.game_genre || selectedPost.gameGenre) && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-slate-200 bg-black/60 border border-white/10 backdrop-blur-md">
                          🎮 {selectedPost.game_genre || selectedPost.gameGenre}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                      <span>🗓️</span> {selectedPost.date || '2026-09-26'}
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                    {selectedPost.title}
                  </h2>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span className="text-sm">{selectedPost.rating ? Number(selectedPost.rating).toFixed(1) : '5.0'} / 5.0</span>
                      </div>
                      <span className="text-slate-700">•</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" /> Verified Safe & Tested
                      </span>
                    </div>

                    {/* BUTANG KONGSI MEDIA SOSIAL DI DALAM MODAL */}
                    <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Share2 className="w-3.5 h-3.5 text-cyan-400" /> Kongsi:
                      </span>
                      <button 
                        onClick={(e) => handleShare('facebook', selectedPost, e)}
                        className="px-2 py-1 bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition"
                      >
                        Facebook
                      </button>
                      <button 
                        onClick={(e) => handleShare('twitter', selectedPost, e)}
                        className="px-2 py-1 bg-slate-900 hover:bg-sky-500 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition"
                      >
                        X
                      </button>
                      <button 
                        onClick={(e) => handleShare('whatsapp', selectedPost, e)}
                        className="px-2 py-1 bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition"
                      >
                        WhatsApp
                      </button>
                      <button 
                        onClick={(e) => handleShare('telegram', selectedPost, e)}
                        className="px-2 py-1 bg-slate-900 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition"
                      >
                        Telegram
                      </button>
                      <button 
                        onClick={(e) => handleShare('copy', selectedPost, e)}
                        className="px-2 py-1 bg-slate-900 hover:bg-cyan-500 hover:text-black text-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        {copiedId === selectedPost.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Salin
                      </button>
                    </div>
                  </div>

                  <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
                    {selectedPost.content?.split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>

                  {selectedPost.specs && (
                    <div className="p-5 sm:p-6 bg-slate-950/80 rounded-2xl border border-cyan-500/20 shadow-inner space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <h4 className="text-xs sm:text-sm font-extrabold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-cyan-400" /> System Requirements (PC)
                        </h4>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Minimum Specs</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-300">
                        <div className="flex items-start gap-2.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                          <span className="text-cyan-400 font-bold">OS:</span>
                          <span className="text-slate-200 font-medium">{selectedPost.specs.os || 'Windows 10/11 (64-bit)'}</span>
                        </div>
                        <div className="flex items-start gap-2.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                          <span className="text-cyan-400 font-bold">CPU:</span>
                          <span className="text-slate-200 font-medium">{selectedPost.specs.cpu || 'Intel Core i5 / AMD Ryzen 5'}</span>
                        </div>
                        <div className="flex items-start gap-2.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                          <span className="text-cyan-400 font-bold">RAM:</span>
                          <span className="text-slate-200 font-medium">{selectedPost.specs.ram || '8 GB RAM'}</span>
                        </div>
                        <div className="flex items-start gap-2.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                          <span className="text-cyan-400 font-bold">GPU:</span>
                          <span className="text-slate-200 font-medium">{selectedPost.specs.gpu || 'NVIDIA GTX 1060 / AMD RX 580'}</span>
                        </div>
                        <div className="sm:col-span-2 flex items-start gap-2.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                          <span className="text-cyan-400 font-bold">Storage:</span>
                          <span className="text-slate-200 font-medium">{selectedPost.specs.storage || '50 GB available space'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {(selectedPost.download_url || selectedPost.downloadUrl) && (
                    <div className="pt-2">
                      <a 
                        href={selectedPost.download_url || selectedPost.downloadUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group relative flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-black text-base rounded-2xl shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 transform active:scale-[0.99] overflow-hidden"
                      >
                        <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                        <Download className="w-5 h-5 fill-black group-hover:animate-bounce" /> 
                        <span>DOWNLOAD GAME NOW</span>
                      </a>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800/80 mt-16 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('public')}>
                <div className="bg-gradient-to-tr from-cyan-500 to-purple-600 p-1.5 rounded-lg">
                  <Gamepad2 className="w-5 h-5 text-black" />
                </div>
                <span className="text-lg font-black tracking-wider bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  gameskilu<span className="text-white">.com</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your premier source for gaming news and safe, fast, and trusted PC game downloads.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h3>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => setCurrentView('public')} className="hover:text-cyan-400 transition">Home</button></li>
                <li><button onClick={() => setSelectedCategory('News')} className="hover:text-cyan-400 transition">Latest Gaming News</button></li>
                <li><button onClick={() => setSelectedCategory('Download Game')} className="hover:text-cyan-400 transition">Download PC Games</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Popular Categories</h3>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => setSelectedCategory('RPG')} className="hover:text-cyan-400 transition">RPG Games</button></li>
                <li><button onClick={() => setSelectedCategory('FPS')} className="hover:text-cyan-400 transition">FPS Games</button></li>
                <li><button onClick={() => setSelectedCategory('Open World')} className="hover:text-cyan-400 transition">Open World</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Admin Portal</h3>
              <p className="text-xs text-slate-400">
                Access the admin dashboard to update or publish new gaming content.
              </p>
              {!isLoggedIn ? (
                <button 
                  onClick={() => setCurrentView('admin-login')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400 rounded-md transition"
                >
                  <Lock className="w-3.5 h-3.5" /> Admin Login
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentView('admin-dashboard')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950 border border-cyan-500/40 text-xs font-semibold text-cyan-400 rounded-md transition"
                >
                  <User className="w-3.5 h-3.5" /> Admin Dashboard
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-slate-800/60 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} gameskilu.com. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}