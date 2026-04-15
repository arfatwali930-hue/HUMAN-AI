import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Languages, 
  Moon, 
  Sun, 
  User, 
  Settings, 
  Sparkles, 
  Book, 
  Copy, 
  Check, 
  LogOut, 
  Phone, 
  Globe, 
  ChevronDown,
  Search,
  Info,
  Zap
} from 'lucide-react';
import { cn } from './lib/utils';
import { LANGUAGES, COUNTRIES } from './constants';
import { humanizeText, getDefinition } from './services/aiService';

// --- Types ---
interface UserData {
  name: string;
  phone: string;
  country: string;
}

interface HumanizedResult {
  text: string;
  highlights: string[];
}

interface Definition {
  word: string;
  partOfSpeech: string;
  definition: string;
  example: string;
}

// --- Components ---

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'outline' }) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20',
    secondary: 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    outline: 'bg-transparent border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
  };

  return (
    <button 
      className={cn(
        'px-4 py-2 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-6', className)}>
    {children}
  </div>
);

export default function App() {
  // --- State ---
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [user, setUser] = useState<UserData | null>(null);
  
  const [inputText, setInputText] = useState('');
  const [outputResult, setOutputResult] = useState<HumanizedResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [searchLang, setSearchLang] = useState('');
  
  const [dictionaryWord, setDictionaryWord] = useState('');
  const [definition, setDefinition] = useState<Definition | null>(null);
  const [isDictLoading, setIsDictLoading] = useState(false);
  
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // --- Effects ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- Handlers ---
  const handleHumanize = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    const result = await humanizeText(inputText, selectedLang.name);
    setOutputResult({
      text: result.humanizedText,
      highlights: result.changedWords || []
    });
    setIsLoading(false);
  };

  const handleDictionaryLookup = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!dictionaryWord.trim()) return;
    setIsDictLoading(true);
    const def = await getDefinition(dictionaryWord);
    setDefinition(def);
    setIsDictLoading(false);
  };

  const handleCopy = () => {
    if (!outputResult) return;
    navigator.clipboard.writeText(outputResult.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLanguages = useMemo(() => {
    return LANGUAGES.filter(l => l.name.toLowerCase().includes(searchLang.toLowerCase()));
  }, [searchLang]);

  // --- Render Helpers ---
  const renderHighlightedText = () => {
    if (!outputResult) return null;
    
    let text = outputResult.text;
    const highlights = outputResult.highlights;
    
    if (!highlights.length) return text;

    // Sort highlights by length descending to avoid partial matches inside longer matches
    const sortedHighlights = [...highlights].sort((a, b) => b.length - a.length);
    
    // Create a regex that matches any of the highlights
    const escapedHighlights = sortedHighlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedHighlights.join('|')})`, 'gi');
    
    const parts = text.split(regex);
    
    return parts.map((part, i) => {
      const isMatch = highlights.some(h => h.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <span 
            key={i} 
            className="humanized-highlight"
            onClick={() => {
              setDictionaryWord(part);
              handleDictionaryLookup();
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500/30">
      {/* --- Navigation --- */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-black/70 border-b border-gray-200 dark:border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              HUMAN AI
            </span>
          </motion.div>

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="w-10 h-10 p-0 rounded-full"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.phone}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-10 h-10 p-0 rounded-full"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="w-5 h-5" />
                </Button>
                <Button 
                  variant="primary" 
                  className="px-4 py-2"
                  onClick={() => setIsLoggedIn(false)}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Button onClick={() => { setShowAuth(true); setAuthMode('signin'); }}>
                <User className="w-4 h-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* --- Hero Section --- */}
        <section className="text-center space-y-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4"
          >
            <Zap className="w-3 h-3" />
            ProMax Ultra Legend Edition
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-bold tracking-tight leading-[1.1]"
          >
            Humanize AI Content <br />
            <span className="text-indigo-600 dark:text-indigo-400 drop-shadow-2xl">Instantly.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Transform robotic AI text into natural, human-like writing. 
            Indistinguishable from human authors, optimized for readability and SEO.
          </motion.p>
        </section>

        {/* --- Main Tool --- */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Area */}
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Zap className="w-4 h-4 text-amber-500" />
                Input Article
              </div>
              <div className="relative">
                <Button 
                  variant="outline" 
                  className="text-xs py-1.5 h-auto"
                  onClick={() => setShowLangMenu(!showLangMenu)}
                >
                  <Globe className="w-3 h-3" />
                  {selectedLang.name}
                  <ChevronDown className="w-3 h-3" />
                </Button>
                
                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="Search 150+ languages..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm outline-none border border-transparent focus:border-indigo-500"
                            value={searchLang}
                            onChange={(e) => setSearchLang(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto p-2">
                        {filteredLanguages.map((lang) => (
                          <button
                            key={lang.code}
                            className={cn(
                              "w-full text-left px-4 py-2 rounded-lg text-sm transition-colors",
                              selectedLang.code === lang.code 
                                ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium" 
                                : "hover:bg-gray-100 dark:hover:bg-gray-700"
                            )}
                            onClick={() => {
                              setSelectedLang(lang);
                              setShowLangMenu(false);
                            }}
                          >
                            {lang.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <textarea 
              className="flex-1 min-h-[400px] bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 outline-none border-2 border-transparent focus:border-indigo-500 transition-all resize-none text-lg leading-relaxed"
              placeholder="Paste your AI-generated article here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {inputText.length} characters | {inputText.split(/\s+/).filter(Boolean).length} words
              </span>
              <Button 
                className="px-8 py-3"
                disabled={!inputText.trim() || isLoading}
                onClick={handleHumanize}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Humanize Now
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Output Area */}
          <Card className="flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <User className="w-4 h-4 text-indigo-500" />
                Humanized Output
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="text-xs py-1.5 h-auto"
                  disabled={!outputResult}
                  onClick={handleCopy}
                >
                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
            
            <div className="flex-1 min-h-[400px] bg-indigo-50/30 dark:bg-indigo-900/10 rounded-2xl p-6 overflow-y-auto text-lg leading-relaxed relative">
              {!outputResult && !isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-4">
                  <Sparkles className="w-12 h-12 opacity-20" />
                  <p>Humanized text will appear here</p>
                </div>
              )}
              
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10">
                  <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
                  <p className="font-medium animate-pulse">Humanizing your content...</p>
                </div>
              )}

              <div className="whitespace-pre-wrap">
                {renderHighlightedText()}
              </div>
            </div>

            {outputResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30"
              >
                <Info className="w-4 h-4 text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Highlighted words have been improved for better flow. Click any word to see its Oxford definition.
                </p>
              </motion.div>
            )}
          </Card>
        </div>

        {/* --- Oxford Dictionary Section --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
              <Book className="text-white w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Oxford Dictionary</h2>
          </div>

          <Card className="max-w-3xl">
            <form onSubmit={handleDictionaryLookup} className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Look up a word..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none border-2 border-transparent focus:border-amber-500 transition-all"
                  value={dictionaryWord}
                  onChange={(e) => setDictionaryWord(e.target.value)}
                />
              </div>
              <Button 
                variant="secondary" 
                className="px-8"
                type="submit"
                disabled={isDictLoading || !dictionaryWord.trim()}
              >
                {isDictLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Search'}
              </Button>
            </form>

            <AnimatePresence mode="wait">
              {definition ? (
                <motion.div 
                  key={definition.word}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{definition.word}</h3>
                    <span className="text-sm font-medium text-gray-400 italic">{definition.partOfSpeech}</span>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-l-4 border-amber-500">
                    <p className="text-lg leading-relaxed mb-4">{definition.definition}</p>
                    <div className="flex gap-2">
                      <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Example:</span>
                      <p className="text-sm text-gray-500 italic">"{definition.example}"</p>
                    </div>
                  </div>
                </motion.div>
              ) : !isDictLoading && (
                <div className="text-center py-12 text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Search for any word to see its definition and usage.</p>
                </div>
              )}
            </AnimatePresence>
          </Card>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-200 dark:border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-600 w-5 h-5" />
            <span className="font-bold tracking-tighter">HUMAN AI</span>
          </div>
          
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-indigo-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-500 transition-colors">API</a>
            <a href="#" className="hover:text-indigo-500 transition-colors">Support</a>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
              Created by <span className="text-indigo-600 dark:text-indigo-400">ARFAT</span>
            </p>
          </div>
        </div>
      </footer>

      {/* --- Auth Modal --- */}
      <AnimatePresence>
        {showAuth && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowAuth(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">
                    {authMode === 'signin' ? 'Welcome Back' : 'Join Human AI'}
                  </h2>
                  <p className="text-gray-500">
                    {authMode === 'signin' ? 'Sign in to continue humanizing' : 'Create an account to get started'}
                  </p>
                </div>

                <div className="space-y-4">
                  {authMode === 'signup' && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="Arfat Ali"
                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 transition-all"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Phone Number</label>
                    <div className="flex gap-2">
                      <select className="w-24 px-3 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 transition-all text-sm">
                        {COUNTRIES.map(c => (
                          <option key={c.code} value={c.dialCode}>{c.code} {c.dialCode}</option>
                        ))}
                      </select>
                      <input 
                        type="tel" 
                        placeholder="300 1234567"
                        className="flex-1 px-5 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full py-4 rounded-2xl text-lg mt-4"
                    onClick={() => {
                      setIsLoggedIn(true);
                      setShowAuth(false);
                      setUser({ name: 'Arfat Ali', phone: '+92 300 1234567', country: 'PK' });
                    }}
                  >
                    {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                  </Button>
                </div>

                <div className="text-center">
                  <button 
                    className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                    onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  >
                    {authMode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Settings Modal --- */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowSettings(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                  <Button variant="ghost" className="w-10 h-10 p-0 rounded-full" onClick={() => setShowSettings(false)}>
                    <Check className="w-5 h-5" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <Moon className="w-5 h-5 text-indigo-500" />
                            <span>Dark Mode</span>
                          </div>
                          <button 
                            className={cn(
                              "w-12 h-6 rounded-full transition-colors relative",
                              isDarkMode ? "bg-indigo-600" : "bg-gray-300"
                            )}
                            onClick={() => setIsDarkMode(!isDarkMode)}
                          >
                            <div className={cn(
                              "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                              isDarkMode ? "left-7" : "left-1"
                            )} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-amber-500" />
                            <span>Auto-Humanize</span>
                          </div>
                          <button className="w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full relative">
                            <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Account</h3>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-semibold">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.phone}</p>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full text-red-500 border-red-500/20 hover:bg-red-500/10">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
