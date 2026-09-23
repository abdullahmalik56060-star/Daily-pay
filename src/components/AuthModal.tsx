import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  UserCheck,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Gift,
  LogIn,
  UserPlus,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  referralCode?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup',
  referralCode = '',
}) => {
  const {
    loginUser,
    registerUser,
    whatsappLink,
    loginBonus,
    user,
    isLoggedIn,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Sign up fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [refCodeInput, setRefCodeInput] = useState(referralCode);

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Feedback & error states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (referralCode) {
      setRefCodeInput(referralCode);
      setMode('signup');
    }
  }, [referralCode]);

  useEffect(() => {
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [mode]);

  if (!isOpen) return null;

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!firstName.trim()) {
      setErrorMsg('پہلا نام (First Name / 1st Name) درج کرنا لازمی ہے۔');
      return;
    }
    if (!lastName.trim()) {
      setErrorMsg('دوسرا نام (2nd Name / Last Name) درج کرنا لازمی ہے۔');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('درست ای میل ایڈریس درج کریں۔ (Valid email required)');
      return;
    }
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('درست موبائل فون نمبر درج کریں۔ (مثال: 03001234567)');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('پاس ورڈ کم از کم 4 حروف کا ہونا چاہیے۔ (Password must be at least 4 characters)');
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      setErrorMsg('پاس ورڈ میچ نہیں کر رہے! براہ کرم دونوں خانوں میں ایک جیسا پاس ورڈ لکھیں۔');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = registerUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        referralCode: refCodeInput.trim() || undefined,
      });

      setIsSubmitting(false);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginIdentifier.trim()) {
      setErrorMsg('ای میل یا موبائل فون نمبر درج کرنا لازمی ہے۔ (Email or Phone is required)');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('پاس ورڈ درج کریں۔ (Password is required)');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = loginUser(loginIdentifier.trim(), loginPassword);
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  const handleQuickDemoFill = () => {
    setLoginIdentifier('03001234567');
    setLoginPassword('password123');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-7 overflow-hidden my-auto max-h-[92vh] overflow-y-auto">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-52 h-52 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-52 h-52 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/25 shrink-0">
            <span className="text-2xl font-black tracking-tighter">DP</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                DailyPay Pakistan
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {mode === 'signup'
                ? 'نیا اکاؤنٹ بنائیں اور روزانہ پیسے کمائیں (Sign Up & Earn)'
                : 'اپنے اکاؤنٹ میں داخل ہوں (Login to Dashboard)'}
            </p>
          </div>
        </div>

        {/* Referral Welcome Notification Banner */}
        {refCodeInput && mode === 'signup' && (
          <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in slide-in-from-top-2">
            <Gift className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
            <div className="flex-1">
              <p className="font-bold text-white">ریفرل لنک کے ذریعے دعوت موصول ہوئی!</p>
              <p className="text-[11px] text-emerald-300/90">
                دعوت کوڈ: <span className="font-mono font-bold text-emerald-400">{refCodeInput}</span> • اکاؤنٹ بناتے ہی <strong>Rs {loginBonus} PKR</strong> ویلکم بونس ملے گا۔
              </p>
            </div>
          </div>
        )}

        {/* Tabs Switcher: Sign Up vs Login */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up (نیا اکاؤنٹ)</span>
            <span className="hidden sm:inline text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/30 text-slate-950 font-black">
              +Rs {loginBonus}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              mode === 'login'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Login (لاگ ان)</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ===================== SIGN UP FORM ===================== */}
        {mode === 'signup' ? (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            {/* 1st Name & 2nd Name row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1st Name (پہلا نام) <span className="text-rose-400">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Abdullah"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>2nd Name (دوسرا نام) <span className="text-rose-400">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Malik"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Email Address (ای میل ایڈریس) <span className="text-rose-400">*</span></span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. abdullah@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Mobile Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Phone Number (موبائل نمبر) <span className="text-rose-400">*</span></span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 03001234567"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Password (پاس ورڈ) <span className="text-rose-400">*</span></span>
                </span>
                <span className="text-[10px] text-slate-400">کم از کم 4 حروف</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="اپنا پاس ورڈ درج کریں"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-teal-400" />
                  <span>Confirm Password (پاس ورڈ تصدیق کریں)</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="پاس ورڈ دوبارہ درج کریں"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Referral Code (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span>Referral Code (ریفرل کوڈ - اختیاری)</span>
                </span>
                {refCodeInput && (
                  <span className="text-[10px] text-emerald-400 font-bold">کوڈ لاگو ہے</span>
                )}
              </label>
              <input
                type="text"
                value={refCodeInput}
                onChange={(e) => setRefCodeInput(e.target.value)}
                placeholder="e.g. DP-786"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors uppercase"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>سائن اپ کریں اور Rs {loginBonus} مفت حاصل کریں</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            {/* Toggle to Login */}
            <p className="text-center text-xs text-slate-400 pt-2">
              پہلے سے اکاؤنٹ موجود ہے؟{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-emerald-400 font-bold hover:underline"
              >
                یہاں لاگ ان کریں (Login)
              </button>
            </p>
          </form>
        ) : (
          /* ===================== LOGIN FORM ===================== */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email or Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Email or Phone (ای میل یا فون نمبر) <span className="text-rose-400">*</span></span>
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="مثال: 03001234567 یا user@dailypay.pk"
                className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                آپ اپنے رجسٹرڈ ای میل یا 11 ہندسوں والے فون نمبر سے لاگ ان کر سکتے ہیں۔
              </p>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Password (پاس ورڈ) <span className="text-rose-400">*</span></span>
                </label>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-teal-400 hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" /> بھول گئے؟ سپورٹ
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="اپنا پاس ورڈ لکھیں"
                  className="w-full pl-3.5 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Login Option */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-300 block">ڈیمو ٹیسٹ اکاؤنٹ:</span>
                <span className="text-[10px] text-slate-400 font-mono">03001234567 • pass: password123</span>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition-all border border-slate-700"
              >
                Auto Fill
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>لاگ ان کریں (Login to Dashboard)</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            {/* Toggle to Signup */}
            <p className="text-center text-xs text-slate-400 pt-2">
              ابھی اکاؤنٹ نہیں بنایا؟{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-emerald-400 font-bold hover:underline"
              >
                یہاں نیا اکاؤنٹ بنائیں (Sign Up)
              </button>
            </p>
          </form>
        )}

        {/* Currently Logged In badge if already logged in */}
        {isLoggedIn && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>فی الوقت لاگ ان صارف: <strong className="text-white">{user.name}</strong></span>
            <span className="text-[10px] text-emerald-400 font-bold">Active Session</span>
          </div>
        )}
      </div>
    </div>
  );
};
