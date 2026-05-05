import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Target, 
  Gamepad2, 
  Club, 
  Spade, 
  Heart, 
  Diamond,
  User,
  Menu,
  X,
  MessageCircle,
  Zap,
  Star,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Gift
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Types ---
interface Game {
  id: string;
  title: string;
  category: 'Slots' | 'Roulette' | 'Cards' | 'Live';
  image: string;
  isHot?: boolean;
  jackpot?: string;
}

// --- Mock Data ---
const GAMES: Game[] = [
  { id: '1', title: 'Royal Roulette', category: 'Roulette', image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&q=80&w=800', isHot: true },
  { id: '2', title: 'Mega Slots Platinum', category: 'Slots', image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&q=80&w=800', jackpot: '₨ 2,500,000' },
  { id: '3', title: 'Blackjack Elite', category: 'Cards', image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&q=80&w=800' },
  { id: '4', title: 'Poker Night Live', category: 'Live', image: 'https://images.unsplash.com/photo-1544161442-e3dbd1a4c57c?auto=format&fit=crop&q=80&w=800', isHot: true },
  { id: '5', title: 'Golden Baccarat', category: 'Cards', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487fc2f?auto=format&fit=crop&q=80&w=800' },
  { id: '6', title: 'Diamond Jackpot Slots', category: 'Slots', image: 'https://images.unsplash.com/photo-1518893063132-36e46dbe2428?auto=format&fit=crop&q=80&w=800', jackpot: '₨ 5,000,000' },
];

const CATEGORIES = ['All', 'Slots', 'Roulette', 'Cards', 'Live'];

// --- Components ---

const NavItem = ({ label, href, active }: { label: string; href: string; active?: boolean }) => (
  <a 
    href={href} 
    className={cn(
      "text-sm font-semibold tracking-widest uppercase transition-all hover:text-[#D4AF37] relative group",
      active ? "text-[#D4AF37]" : "text-[#F5F2ED]"
    )}
  >
    {label}
    <span className={cn(
      "absolute -bottom-1 left-0 h-0.5 bg-[#D4AF37] transition-all duration-300",
      active ? "w-full" : "w-0 group-hover:w-full"
    )} />
  </a>
);

const GoldButton = ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button 
    className={cn(
      "gold-gradient px-8 py-3 rounded-full font-bold text-[#050505] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#D4AF37]/20",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

const GameCard = ({ game }: { game: Game }) => (
  <motion.div 
    whileHover={{ y: -10, scale: 1.02 }}
    className="glass-card relative rounded-3xl overflow-hidden aspect-[3/4] group cursor-pointer"
  >
    <img 
      src={game.image} 
      alt={game.title} 
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
    
    <div className="absolute inset-0 p-6 flex flex-col justify-end">
      {game.isHot && (
        <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md flex items-center gap-1 shadow-lg shadow-red-500/40">
          <Zap className="w-3 h-3 fill-white" /> HOT
        </span>
      )}
      {game.jackpot && (
        <span className="absolute top-4 right-4 gold-gradient text-[#050505] text-[10px] font-black px-2 py-1 rounded-md shadow-lg shadow-[#D4AF37]/40">
          JACKPOT: {game.jackpot}
        </span>
      )}
      
      <h3 className="text-xl font-bold font-display group-hover:gold-text transition-all duration-300">{game.title}</h3>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">{game.category}</p>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="mt-4"
      >
        <button className="w-full py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#050505] transition-all">
          Play Now
        </button>
      </motion.div>
    </div>
  </motion.div>
);

export default function App() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const filteredGames = activeCategory === 'All' 
    ? GAMES 
    : GAMES.filter(g => g.category === activeCategory);

  return (
    <div className="min-h-screen selection:bg-[#D4AF37]/30 selection:text-[#050505]">
      {/* --- Cursor Spotlight --- */}
      <div 
        className="fixed inset-0 z-[9999] pointer-events-none opacity-40 mix-blend-screen hidden lg:block"
        style={{
          background: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.15), transparent 80%)`
        }}
      />

      {/* --- Floating WhatsApp --- */}
      <motion.a
        href="https://wa.me/yournumber" // Replace with actual number
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl animate-pulse-whatsapp cursor-pointer"
      >
        <MessageCircle className="text-white w-8 h-8 fill-white" />
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
          99+
        </span>
      </motion.a>

      {/* --- Navbar --- */}
      <nav className={cn(
        "fixed top-0 inset-x-0 z-[1000] transition-all duration-500",
        scrolled ? "bg-black/80 backdrop-blur-2xl border-b border-white/5" : "bg-transparent"
      )}>
        {/* --- Live Win Ticker --- */}
        <div className="bg-[#D4AF37] overflow-hidden py-1">
          <motion.div 
            animate={{ x: [0, -2000] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-12"
          >
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] font-black text-[#050505] uppercase tracking-tighter">
                <Trophy className="w-3 h-3" />
                Arfat Ali just won ₨ 15,000 in Mega Slots!
                <span className="w-1.5 h-1.5 bg-black rounded-full" />
                King88 won ₨ 5,400 in Royal Roulette!
                <span className="w-1.5 h-1.5 bg-black rounded-full" />
                User992 won ₨ 25,000 in Poker!
              </div>
            ))}
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Club className="text-[#D4AF37] w-8 h-8 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
            <span className="text-2xl font-black font-display tracking-tighter gold-text">
              CASINO WORLD
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            <NavItem label="Home" href="#" active />
            <NavItem label="Slots" href="#" />
            <NavItem label="Live Dealer" href="#" />
            <NavItem label="Table Games" href="#" />
            <NavItem label="Promotions" href="#" />
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-sm font-bold uppercase tracking-widest hover:text-[#D4AF37] transition-colors">
              Login
            </button>
            <GoldButton className="hidden sm:block">Join Now</GoldButton>
            <button 
              className="lg:hidden w-10 h-10 flex items-center justify-center"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* --- Mobile Menu --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[2000] bg-[#050505] p-6 lg:hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-2xl font-black font-display gold-text">MENU</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="flex flex-col gap-8">
              {['Home', 'Slots', 'Live Dealer', 'Table Games', 'Promotions'].map(item => (
                <a key={item} href="#" className="text-4xl font-bold font-display hover:gold-text" onClick={() => setMobileMenuOpen(false)}>
                  {item}
                </a>
              ))}
              <div className="pt-8 space-y-4">
                <GoldButton className="w-full py-5 text-xl">Sign Up Free</GoldButton>
                <button className="w-full py-4 border border-white/20 rounded-full font-bold uppercase tracking-widest text-lg">Login</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative">
        {/* --- Global Background Flares --- */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="lighting-flare top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20" />
          <div className="lighting-flare bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20" />
          <div className="lighting-flare top-[40%] left-[20%] w-[30%] h-[30%] bg-pink-600/10 delay-1000" />
        </div>

        {/* --- Hero Section --- */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Animated Background Lights */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 -left-1/4 w-[60%] h-[60%] bg-[#2D0B5A]/30 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-1/4 w-[60%] h-[60%] bg-[#D4AF37]/10 rounded-full blur-[150px] animate-pulse delay-700" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-card border-gold border"
            >
              <Trophy className="w-5 h-5 text-[#D4AF37] animate-bounce" />
              <span className="text-sm font-bold uppercase tracking-widest gold-text">Welcome to the Royal Palace</span>
            </motion.div>

            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="text-6xl md:text-[10rem] font-black font-display leading-[0.85] tracking-tighter"
            >
              ROYAL <br />
              <span className="gold-text gold-glow italic">CASINO</span>
            </motion.h1>

            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-gray-400 text-lg md:text-2xl max-w-2xl mx-auto font-medium"
            >
              Experience the pinnacle of luxury gaming. Secure, fast, and 
              authenticated by the world's leading royal gaming authority.
            </motion.p>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
            >
              <GoldButton className="w-full sm:w-auto px-12 py-5 text-xl">Start Playing Now</GoldButton>
              <button className="flex items-center gap-3 group text-lg font-bold uppercase tracking-widest hover:text-[#D4AF37] transition-all">
                <span className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 group-hover:border-[#D4AF37] transition-all">
                  <ChevronRight className="w-6 h-6" />
                </span>
                View Jackpots
              </button>
            </motion.div>
          </div>

          {/* Floating Card Elements for dynamic vibe */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden hidden xl:block">
            <motion.div 
              animate={{ y: [0, -40, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-1/4 left-10 w-48 h-72 glass-card rounded-[2rem] rotate-[-15deg] opacity-40 border-gold border"
            >
               <div className="absolute inset-x-0 bottom-6 text-center text-[#D4AF37] opacity-20">
                 <Spade className="w-24 h-24 mx-auto" strokeWidth={0.5} />
               </div>
            </motion.div>
            <motion.div 
              animate={{ y: [0, 40, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute bottom-1/4 right-10 w-48 h-72 glass-card rounded-[2rem] rotate-[15deg] opacity-40 border-gold border"
            >
               <div className="absolute inset-x-0 bottom-6 text-center text-red-500 opacity-20">
                 <Heart className="w-24 h-24 mx-auto" strokeWidth={0.5} />
               </div>
            </motion.div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">Scroll to Explore</span>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-[#D4AF37] rounded-full"
            />
          </div>
        </section>

        {/* --- Stats / Why Us --- */}
        <section className="max-w-7xl mx-auto px-6 py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-[#D4AF37]/5 blur-[100px] -z-10" />
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, label: 'Secure Play', desc: 'Curacao Licensed' },
              { icon: Zap, label: 'Fast Withdraw', desc: 'Under 15 Mins' },
              { icon: CreditCard, label: 'Easy Deposit', desc: 'Any Card / Local' },
              { icon: Gift, label: 'VIP Bonus', desc: 'Exclusive Rewards' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-[2rem] text-center space-y-4 hover:border-[#D4AF37]/40 transition-colors"
              >
                <div className="w-16 h-16 gold-gradient rounded-3xl mx-auto flex items-center justify-center -mt-16 shadow-xl shadow-[#D4AF37]/20">
                  <stat.icon className="text-[#050505] w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-wider">{stat.label}</h3>
                <p className="text-gray-500 text-sm">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- Royal VIP Section --- */}
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="glass-card rounded-[4rem] p-12 md:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center gap-20">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-20" />
             <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/10 blur-[120px] rounded-full" />
             
             <div className="relative z-10 lg:w-1/2 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                   <Star className="w-4 h-4 fill-indigo-400" />
                   Exclusive Membership
                </div>
                <h2 className="text-5xl md:text-7xl font-black font-display leading-tight">
                   BECOME A <br />
                   <span className="gold-text">ROYAL VIP</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                   Elevate your gaming experience with personal account managers, 
                   higher withdrawal limits, and invitation-only luxury events.
                </p>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <p className="text-2xl font-bold gold-text">25%</p>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Weekly Cashback</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-2xl font-bold gold-text">Unlimited</p>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Fast Cashouts</p>
                   </div>
                </div>
                <GoldButton className="w-full sm:w-auto px-12">Upgrade My Experience</GoldButton>
             </div>

             <div className="relative lg:w-1/2">
                <motion.div 
                  whileHover={{ rotateY: 15, rotateX: 5 }}
                  className="w-full aspect-[16/10] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-[2rem] border border-gold shadow-2xl p-8 relative z-20 overflow-hidden"
                >
                   <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')] opacity-10" />
                   <div className="flex justify-between items-start">
                      <Club className="w-12 h-12 text-[#D4AF37]" strokeWidth={1} />
                      <div className="text-right">
                         <p className="text-[10px] font-black text-gray-500 tracking-tighter">ROYAL PRIVILEGE</p>
                         <p className="text-xl font-bold font-display tracking-tight uppercase">VIP BLACK CARD</p>
                      </div>
                   </div>
                   <div className="mt-20">
                      <p className="text-xs font-mono text-gray-600 mb-2">MEMBER SINCE 2024</p>
                      <p className="text-4xl font-display font-black tracking-[0.2em] gold-text">ARFAT ALI</p>
                   </div>
                   <div className="absolute bottom-8 right-8 flex gap-2">
                       <Spade className="w-10 h-10 text-gray-800" />
                       <Heart className="w-10 h-10 text-gray-800" />
                   </div>
                </motion.div>
                {/* Visual shadow glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] gold-gradient opacity-10 blur-[80px] rounded-full z-10" />
             </div>
          </div>
        </section>

        {/* --- Games Explorer --- */}
        <section className="bg-[#0A0A0A] py-32 rounded-[4rem] px-6">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl font-bold font-display">THE <span className="gold-text">ARENA</span></h2>
                <p className="text-gray-400 max-w-lg">Choose your battleground. From high-stakes slots to immersive live tables, the palace offers unmatched variety.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all",
                      activeCategory === cat 
                        ? "gold-gradient text-[#050505]" 
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredGames.map((game) => (
                  <motion.div
                    key={game.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <GameCard game={game} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="text-center pt-8">
              <button className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] hover:tracking-[0.5em] transition-all flex items-center gap-4 mx-auto group">
                Load More Games
                <div className="w-12 h-px bg-[#D4AF37] group-hover:w-24 transition-all" />
              </button>
            </div>
          </div>
        </section>

        {/* --- Jackpot Awareness --- */}
        <section className="relative py-40 overflow-hidden">
           <div className="absolute inset-0 bg-[#D4AF37]/5 z-0" />
           <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                 <h2 className="text-6xl md:text-8xl font-black font-display leading-tight">
                    BIGGEST <br />
                    <span className="italic font-normal">JACKPOTS</span> <br />
                    IN PAKISTAN
                 </h2>
                 <p className="text-xl text-gray-400 leading-relaxed">
                    Join thousands of players who have already won millions. Our platform guarantees fair play 
                    using audited RNG systems and instant payouts to local accounts.
                 </p>
                 <div className="flex gap-10">
                    <div>
                       <p className="text-5xl font-black gold-text">99.8%</p>
                       <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mt-2">RTP Return</p>
                    </div>
                    <div className="w-px h-16 bg-white/10" />
                    <div>
                       <p className="text-5xl font-black text-red-500">24/7</p>
                       <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mt-2">Elite Support</p>
                    </div>
                 </div>
              </div>

              <div className="relative">
                 <motion.div 
                   animate={{ rotateY: [0, 360] }}
                   transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                   className="w-full aspect-square rounded-[3rem] glass-card purple-glow border-gold border grid place-items-center relative z-20"
                 >
                    <div className="text-center space-y-2">
                       <Trophy className="w-32 h-32 text-[#D4AF37] mx-auto filter drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]" />
                       <h3 className="text-3xl font-black gold-text">₨ 10,000,000</h3>
                       <p className="text-sm uppercase tracking-widest font-bold text-gray-400">Monthly Grand Pool</p>
                    </div>
                 </motion.div>
                 {/* Decorative background glow */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-600/20 blur-[100px] rounded-full z-10" />
              </div>
           </div>
        </section>

        {/* --- Trust Brands --- */}
        <section className="py-20 border-y border-white/5">
           <div className="max-w-7xl mx-auto px-6 overflow-hidden">
             <motion.div 
               animate={{ x: [0, -1000] }}
               transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
               className="flex gap-20 items-center whitespace-nowrap opacity-30 invert dark:invert-0"
             >
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <ShieldCheck className="w-8 h-8" />
                    <span className="text-2xl font-black italic tracking-tighter">ROYAL CERTIFIED</span>
                  </div>
                ))}
             </motion.div>
           </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-[#050505] pt-32 pb-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Club className="text-[#D4AF37] w-8 h-8" />
                <span className="text-2xl font-black font-display tracking-tighter gold-text">
                  CASINO WORLD
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                The most transparent and luxury gaming experience in Asia. 
                Regulated, secure, and always rewarding.
              </p>
              <div className="flex gap-4">
                <motion.a whileHover={{ y: -5 }} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:border-[#D4AF37]/50"><Heart className="w-4 h-4" /></motion.a>
                <motion.a whileHover={{ y: -5 }} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:border-[#D4AF37]/50"><Spade className="w-4 h-4" /></motion.a>
                <motion.a whileHover={{ y: -5 }} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:border-[#D4AF37]/50"><Club className="w-4 h-4" /></motion.a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold uppercase tracking-widest mb-8">Navigation</h4>
              <ul className="space-y-4 text-gray-500 text-sm font-medium">
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Slots Library</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Live Casino</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Sportsbook</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Crash Games</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Poker Room</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold uppercase tracking-widest mb-8">Resources</h4>
              <ul className="space-y-4 text-gray-500 text-sm font-medium">
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">VIP Program</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Affiliates</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Responsible Gaming</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Payment Methods</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold uppercase tracking-widest mb-8">Subscribe</h4>
              <p className="text-gray-500 text-sm mb-6">Get notified about exclusive royal bonuses and events.</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="royal@luxury.com"
                  className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-sm outline-none focus:border-[#D4AF37] transition-all"
                />
                <button className="absolute right-2 top-2 bottom-2 gold-gradient px-4 rounded-full text-[#050505] text-[10px] font-black uppercase tracking-widest">Join</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5">
            <p className="text-gray-500 text-xs tracking-widest uppercase font-medium">
              © 2024 CASINO WORLD ASIA. BE 18+ RESPONSIBLE.
            </p>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="px-6 py-2 rounded-full glass-card border-gold border flex items-center gap-3"
            >
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Created by</span>
              <span className="text-lg font-black gold-text font-display italic tracking-tight">ARFAT</span>
            </motion.div>

            <div className="flex gap-8 text-xs text-gray-500 font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-[#D4AF37]">Privacy</a>
              <a href="#" className="hover:text-[#D4AF37]">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
