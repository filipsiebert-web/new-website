import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Lock, 
  LogIn, 
  UserPlus, 
  Loader2, 
  ChefHat, 
  Trash2, 
  RefreshCw 
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AuthSystemProps {
  user: string | null;
  onLogin: (username: string) => void;
  onLogout: () => void;
  isAdmin: boolean;
  currentView: 'recipes' | 'users';
}

export const AuthScreen = ({ onLogin }: { onLogin: (un: string) => void }) => {
  const [isAuthMode, setIsAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    const endpoint = isAuthMode === 'login' ? '/api/login' : '/api/register';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      if (isAuthMode === 'register') {
        alert('Registration successful! Please login.');
        setIsAuthMode('login');
      } else {
        onLogin(data.username);
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f5f5f0] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#5A5A40] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-200 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-neutral-100 p-10 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#5A5A40]/10 text-[#5A5A40] mb-6">
            <ChefHat size={32} />
          </div>
          <h1 className="text-4xl font-serif font-medium mb-3">CulinaryQuest</h1>
          <p className="text-neutral-500">Welcome to your gourmet archive.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#5A5A40] transition-colors" size={18} />
              <input 
                type="text"
                required
                value={authForm.username}
                onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-[#5A5A40]/20 focus:border-[#5A5A40] outline-none transition-all"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#5A5A40] transition-colors" size={18} />
              <input 
                type="password"
                required
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-[#5A5A40]/20 focus:border-[#5A5A40] outline-none transition-all"
                placeholder="Minimum 4 characters"
              />
            </div>
          </div>

          {authError && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
              {authError}
            </motion.div>
          )}

          <button type="submit" disabled={isAuthenticating} className="w-full py-4 bg-[#5A5A40] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50">
            {isAuthenticating ? <Loader2 className="animate-spin" size={20} /> : isAuthMode === 'login' ? <><LogIn size={20} /> Sign In</> : <><UserPlus size={20} /> Join Quest</>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => { setIsAuthMode(isAuthMode === 'login' ? 'register' : 'login'); setAuthError(''); }} className="text-[#5A5A40] font-semibold hover:underline">
            {isAuthMode === 'login' ? "Don't have an account? Join now" : "Already a member? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const AdminUserManagement = () => {
  const [users, setUsers] = useState<{username: string, password: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const sortedUsers = [...users].sort((a, b) => {
    if (a.username === 'Admin') return -1;
    if (b.username === 'Admin') return 1;

    const aFirstChar = a.username.charAt(0);
    const bFirstChar = b.username.charAt(0);
    const isALetter = /[a-zA-Z]/.test(aFirstChar);
    const isBLetter = /[b-zA-Z]/.test(bFirstChar);

    if (isALetter && !isBLetter) return -1;
    if (!isALetter && isBLetter) return 1;

    return a.username.localeCompare(b.username, undefined, { sensitivity: 'base' });
  });

  const handleDeleteConfirm = async () => {
    if (deleteConfirmText.toLowerCase() !== 'yes' || !userToDelete) return;
    try {
      const res = await fetch(`/api/users/${userToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers();
        setUserToDelete(null);
        setDeleteConfirmText('');
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      alert("Error deleting user");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-serif font-medium mb-2">User Directory</h2>
          <p className="text-neutral-500">Secure overview of all registered accounts.</p>
        </div>
        <button onClick={fetchUsers} disabled={isLoading} className="p-3 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors disabled:opacity-50">
          <RefreshCw className={cn("text-[#5A5A40]", isLoading && "animate-spin")} size={20} />
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-100">
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-neutral-400">Username</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-neutral-400">Password</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-neutral-400">Status</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-neutral-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50 text-sm">
            {sortedUsers.map((u, i) => (
              <tr key={u.username} className="hover:bg-[#5A5A40]/5 transition-colors group">
                <td className="px-8 py-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-[#5A5A40]/20 group-hover:text-[#5A5A40] transition-colors"><User size={14} /></div>
                  <span className="font-semibold text-neutral-900">{u.username}</span>
                </td>
                <td className="px-8 py-5"><code className="bg-neutral-100 px-2 py-1 rounded text-xs text-neutral-600 font-mono">{u.password}</code></td>
                <td className="px-8 py-5">
                  <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", u.username === 'Admin' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>
                    {u.username === 'Admin' ? 'Administrator' : 'Active Member'}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  {u.username !== 'Admin' && (
                    <button onClick={() => setUserToDelete(u.username)} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><Trash2 size={32} /></div>
                <h3 className="text-2xl font-serif font-medium mb-2">Delete User?</h3>
                <p className="text-neutral-500">You are about to delete <span className="font-bold text-neutral-900">{userToDelete}</span>.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">Type "yes" to confirm</label>
                  <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleDeleteConfirm()} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none" placeholder='Type "yes"' />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setUserToDelete(null); setDeleteConfirmText(''); }} className="flex-1 py-3 bg-neutral-100 text-neutral-600 rounded-xl font-bold">Cancel</button>
                  <button onClick={handleDeleteConfirm} disabled={deleteConfirmText.toLowerCase() !== 'yes'} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold disabled:opacity-50">Delete</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
