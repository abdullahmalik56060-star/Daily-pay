import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, Key, ArrowRight, UserCheck, Sparkles, AlertCircle } from 'lucide-react';

interface AdminLoginGateProps {
  onSuccess?: () => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({ onSuccess }) => {
  const { admins, adminLogin, currentAdminId } = useApp();

  const [selectedAdminId, setSelectedAdminId] = useState<'admin_1' | 'admin_2'>('admin_1');
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedAdmin = admins.find((a) => a.id === selectedAdminId) || admins[0];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pin.trim()) {
      setError('برائے مہربانی اپنا 4 ہندسوں والا پن کوڈ درج کریں۔ (Please enter 4-digit PIN)');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = adminLogin(selectedAdminId, pin.trim());
      setIsLoading(false);
      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        setError(res.message);
      }
    }, 250);
  };

  const handleQuickDemoFill = (adminId: 'admin_1' | 'admin_2') => {
    const target = admins.find((a) => a.id === adminId);
    if (target) {
      setSelectedAdminId(adminId);
      setPin(target.pin || (adminId === 'admin_1' ? '0675' : '0021'));
      setError(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 animate-in fade-in duration-300">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg">
            <Lock className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>محفوظ ایڈمن تصدیق (Admin Access Control)</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            2 Admins Management Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            ایپ فنڈنگ (پیسے ڈالنے کا آپشن) اور لائیو یوزر الرٹس صرف ایڈمنز کے لیے مختص ہیں۔ عام صارفین کو یہ کنٹرولز نظر نہیں آئیں گے۔
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Admin Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Select Controlling Admin Profile (ایڈمن منتخب کریں):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {admins.map((admin) => {
                const isSelected = admin.id === selectedAdminId;
                return (
                  <button
                    key={admin.id}
                    type="button"
                    onClick={() => {
                      setSelectedAdminId(admin.id);
                      setPin('');
                      setError(null);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${admin.avatarColor} flex items-center justify-center text-white font-black text-xs shadow shrink-0`}
                      >
                        {admin.id === 'admin_1' ? 'A1' : 'A2'}
                      </div>
                      <div className="min-w-0">
                        <p className={`font-bold text-sm truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {admin.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{admin.title}</p>
                        <p className="text-[10px] text-indigo-400 font-mono mt-0.5">{admin.phone}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PIN Input Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">
                Enter 4-Digit Security PIN (ایڈمن پن کوڈ درج کریں):
              </label>
              <span className="text-[11px] text-slate-400">
                Default: {selectedAdminId === 'admin_1' ? '0675' : '0021'}
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Key className="w-4 h-4" />
              </div>
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="درج کریں 4 ہندسوں کا پن (e.g. 0675)"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-center text-lg tracking-widest font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                autoFocus
              />
            </div>
          </div>

          {/* Quick Demo Autofill Helper */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick Demo PIN:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('admin_1')}
                className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-[11px] font-bold transition-all border border-indigo-500/30"
              >
                Hamza Malik (0675)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('admin_2')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold transition-all border border-slate-700"
              >
                Admin 2 (0021)
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>لاگ ان ایڈمن پینل (Unlock Admin Controls)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500">
            Security Protected • Restricted to authorized platform administrators Hamza Malik & Co-Admin.
          </p>
        </div>
      </div>
    </div>
  );
};
