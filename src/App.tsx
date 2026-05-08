import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChefHat, 
  Clock, 
  Users, 
  Flame, 
  ChevronRight, 
  ArrowLeft, 
  Sparkles, 
  Loader2,
  UtensilsCrossed,
  LogOut
} from 'lucide-react';
import { Recipe } from './types';
import { INITIAL_RECIPES } from './constants';
import { generateRecipe } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AuthScreen, AdminUserManagement } from '../account_creation/AuthSystem';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiInput, setAiInput] = useState('');
  
  // Auth states
  const [user, setUser] = useState<string | null>(() => {
    return sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
  });
  
  // Admin states
  const [currentView, setCurrentView] = useState<'recipes' | 'users'>('recipes');

  const isAdmin = user === 'Admin';

  const onLogin = (username: string) => {
    setUser(username);
    if (username === 'Admin') {
      sessionStorage.setItem('currentUser', username);
    } else {
      localStorage.setItem('currentUser', username);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    setCurrentView('recipes');
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [recipes, searchQuery]);

  const handleAiGenerate = async () => {
    if (!aiInput.trim()) return;
    setIsGenerating(true);
    try {
      const newRecipe = await generateRecipe(aiInput);
      if (newRecipe) {
        setRecipes(prev => [newRecipe, ...prev]);
        setSelectedRecipe(newRecipe);
        setAiInput('');
      } else {
        alert("Sorry, I couldn't cook up that recipe. Try another dish!");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) {
    return <AuthScreen onLogin={onLogin} />;
  }

  return (
    <div className="min-h-screen">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#5A5A40]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/10 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
      </div>

      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
           <h1 className="text-xl font-serif font-bold text-[#5A5A40]">CulinaryQuest</h1>
           {isAdmin && (
             <div className="flex bg-neutral-100 p-1 rounded-xl">
                <button 
                  onClick={() => setCurrentView('recipes')}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                    currentView === 'recipes' ? "bg-white shadow-sm text-[#5A5A40]" : "text-neutral-500 hover:text-neutral-700"
                  )}
                >
                  Recipes
                </button>
                <button 
                  onClick={() => setCurrentView('users')}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                    currentView === 'users' ? "bg-white shadow-sm text-[#5A5A40]" : "text-neutral-500 hover:text-neutral-700"
                  )}
                >
                  Users
                </button>
             </div>
           )}
        </div>
        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm border border-neutral-200 px-4 py-2 rounded-full">
           <div className="w-8 h-8 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] flex items-center justify-center font-bold text-xs">
              {user.charAt(0).toUpperCase()}
           </div>
           <span className="text-sm font-medium text-neutral-600">Hi, <span className="text-neutral-900">{user}</span></span>
           <div className="w-[1px] h-4 bg-neutral-200" />
           <button 
            onClick={handleLogout}
            className="text-neutral-400 hover:text-red-500 transition-colors"
            title="Logout"
           >
            <LogOut size={18} />
           </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {user && isAdmin && currentView === 'users' ? (
            <AdminUserManagement />
          ) : !selectedRecipe ? (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: 'circOut' }}
            >
              {/* Header */}
              <header className="mb-16 text-center">
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] mb-6"
                >
                  <ChefHat size={16} />
                  <span className="text-xs uppercase tracking-[0.2em] font-semibold">The Gourmet Archive</span>
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-serif font-medium tracking-tight mb-8">
                  Find your next <br />
                  <span className="italic text-[#5A5A40]">culinary</span> quest.
                </h1>
                
                {/* Search & AI Bar */}
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#5A5A40] transition-colors" size={20} />
                    <input 
                      type="text"
                      placeholder="Search classics or categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#5A5A40]/20 focus:border-[#5A5A40] outline-none transition-all text-lg"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
                      <input 
                        type="text"
                        placeholder="Or ask AI to generate any recipe (e.g. 'Vegan Pad Thai')"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAiGenerate()}
                        className="w-full pl-12 pr-4 py-3 bg-[#5A5A40]/5 border border-[#5A5A40]/10 rounded-xl focus:ring-2 focus:ring-[#5A5A40]/20 focus:border-[#5A5A40] outline-none transition-all"
                      />
                    </div>
                    <button 
                      onClick={handleAiGenerate}
                      disabled={isGenerating || !aiInput.trim()}
                      className={cn(
                        "px-6 py-3 bg-[#5A5A40] text-white rounded-xl font-medium flex items-center gap-2 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none",
                        isGenerating && "animate-pulse"
                      )}
                    >
                      {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <UtensilsCrossed size={18} />}
                      <span>Architect</span>
                    </button>
                  </div>
                </div>
              </header>


              {/* Recipe Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRecipes.map((recipe, idx) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedRecipe(recipe)}
                    className="group cursor-pointer bg-white rounded-[2rem] overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    <div className="aspect-[4/5] overflow-hidden relative">
                      <img 
                        src={recipe.image} 
                        alt={recipe.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-[#5A5A40]">
                        {recipe.category}
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-4 text-neutral-400 text-xs mb-3">
                        <span className="flex items-center gap-1.5"><Clock size={12} /> {recipe.prepTime}</span>
                        <span className="flex items-center gap-1.5"><Flame size={12} /> {recipe.difficulty}</span>
                      </div>
                      <h3 className="text-2xl font-serif font-medium mb-3 group-hover:text-[#5A5A40] transition-colors">{recipe.name}</h3>
                      <p className="text-neutral-500 text-sm line-clamp-2 leading-relaxed">{recipe.description}</p>
                      <div className="mt-6 flex items-center gap-2 text-[#5A5A40] font-semibold text-sm">
                        View Recipe <ChevronRight size={16} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredRecipes.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-neutral-400 text-lg">No recipes found. Try asking the Recipe Architect!</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-4xl mx-auto"
            >
              {/* Detail View */}
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="mb-8 flex items-center gap-2 text-neutral-500 hover:text-[#5A5A40] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center group-hover:border-[#5A5A40] group-hover:bg-[#5A5A40]/5 transition-all">
                  <ArrowLeft size={20} />
                </div>
                <span className="font-medium">Back to archive</span>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="sticky top-12"
                >
                  <img 
                    src={selectedRecipe.image} 
                    alt={selectedRecipe.name}
                    className="w-full aspect-[3/4] object-cover rounded-[2.5rem] shadow-2xl"
                  />
                  
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-neutral-100 flex flex-col items-center">
                      <Clock size={20} className="text-[#5A5A40] mb-2" />
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Total Time</span>
                      <span className="font-medium">{selectedRecipe.cookTime}</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-neutral-100 flex flex-col items-center">
                      <Users size={20} className="text-[#5A5A40] mb-2" />
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Servings</span>
                      <span className="font-medium">{selectedRecipe.servings}</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-neutral-100 flex flex-col items-center">
                      <Flame size={20} className="text-[#5A5A40] mb-2" />
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Difficulty</span>
                      <span className="font-medium">{selectedRecipe.difficulty}</span>
                    </div>
                  </div>
                </motion.div>

                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#5A5A40] mb-4 block">{selectedRecipe.category}</span>
                    <h2 className="text-5xl font-serif font-medium mb-6 leading-tight">{selectedRecipe.name}</h2>
                    <p className="text-neutral-500 text-lg leading-relaxed mb-12">
                      {selectedRecipe.description}
                    </p>
                  </motion.div>

                  <div className="space-y-12">
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-neutral-200 pb-2">Ingredients</h3>
                      <ul className="space-y-4">
                        {selectedRecipe.ingredients.map((ing, i) => (
                          <li key={i} className="flex justify-between items-center group">
                            <span className="text-neutral-700">{ing.item}</span>
                            <span className="w-12 h-[1px] bg-neutral-100 flex-1 mx-4" />
                            <span className="font-medium text-[#5A5A40]">{ing.amount}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.section>

                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-neutral-200 pb-2">Preparation</h3>
                      <div className="space-y-8">
                        {selectedRecipe.steps.map((step, i) => (
                          <div key={i} className="flex gap-6">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#5A5A40] text-white flex items-center justify-center font-bold text-sm">
                              {i + 1}
                            </div>
                            <div>
                              <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                              <p className="text-neutral-600 leading-relaxed italic">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.section>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-neutral-200 text-center">
        <div className="font-serif italic text-neutral-400">
          Crafted for the culinary curious.
        </div>
      </footer>
    </div>
  );
}
