import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminProfile, PaymentMethod } from '../types';
import { AdminLoginGate } from './AdminLoginGate';
import { AdminAlertsView } from './AdminAlertsView';
import {
  ShieldCheck,
  Users,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  Clock,
  PlayCircle,
  Key,
  Lock,
  Unlock,
  AlertCircle,
  Sparkles,
  DollarSign,
  Phone,
  Edit3,
  Save,
  MessageCircle,
  ExternalLink,
  History,
  TrendingUp,
  Check,
  Zap,
  Bell,
  BellRing,
  Radio,
  Megaphone,
  LogOut,
  Volume2,
  VolumeX,
  Activity,
  EyeOff,
  MapPin,
  Smartphone,
  RotateCcw,
  X,
  Link2,
  Youtube,
} from 'lucide-react';

export const AdminPortalView: React.FC = () => {
  const {
    admins,
    currentAdminId,
    currentAdmin,
    switchAdmin,
    updateAdminProfile,
    appReserveBalance,
    adminInjections,
    injectAppReserveFunds,
    adminLogs,
    withdrawals,
    deposits,
    approveUserWithdrawal,
    rejectUserWithdrawal,
    approveUserDeposit,
    balance: userBalance,
    totalWithdrawn,
    whatsappLink,
    whatsappLink2,
    setWhatsappLink,
    setWhatsappLink2,
    whatsappChannelLink,
    setWhatsappChannelLink,
    youtubeChannelLink,
    setYoutubeChannelLink,
    adCampaigns,
    saveAdCampaign,
    showToast,
    // Admin Auth & Live Alerts
    isAdminLoggedIn,
    adminLogout,
    userAlerts,
    unreadAlertsCount,
    triggerSoundAlert,
    soundAlertsEnabled,
    setSoundAlertsEnabled,
    adminAnnouncement,
    setAdminAnnouncement,
    userAnalytics,
    resetHiddenAnalyticsToZero,
  } = useApp();

  // Sub-tabs inside Admin Portal
  const [adminSection, setAdminSection] = useState<'alerts' | 'funding' | 'withdrawals' | 'deposits' | 'admins' | 'ads' | 'announcement' | 'links' | 'visitors' | 'logs'>('funding');
  const [withdrawalsTab, setWithdrawalsTab] = useState<'pending' | 'completed' | 'all'>('pending');

  // WhatsApp & Social Links Form State
  const [waChannelAdminInput, setWaChannelAdminInput] = useState<string>(whatsappChannelLink);
  const [wa1AdminInput, setWa1AdminInput] = useState<string>(whatsappLink);
  const [wa2AdminInput, setWa2AdminInput] = useState<string>(whatsappLink2);
  const [ytAdminInput, setYtAdminInput] = useState<string>(youtubeChannelLink);
  const [linksSaveSuccess, setLinksSaveSuccess] = useState<boolean>(false);

  // Announcement edit state
  const [announcementInput, setAnnouncementInput] = useState<string>(adminAnnouncement || '');

  // Withdrawal Reject Modal State
  const [rejectModalWithdrawalId, setRejectModalWithdrawalId] = useState<string | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState<string>('اکاؤنٹ کی تفصیلات نامکمل یا غلط ہیں');

  // App Funding Form State
  const [injectAmount, setInjectAmount] = useState<number>(1000);
  const [injectMethod, setInjectMethod] = useState<string>('JazzCash Business');
  const [injectNote, setInjectNote] = useState<string>('Liquidity fund for ads earnings payout');
  const [isFundingSuccess, setIsFundingSuccess] = useState<boolean>(false);

  // Admin Switcher PIN Modal/State
  const [pinPromptAdminId, setPinPromptAdminId] = useState<'admin_1' | 'admin_2' | null>(null);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Admin Profile Edit State
  const [editingAdminId, setEditingAdminId] = useState<'admin_1' | 'admin_2' | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editTitle, setEditTitle] = useState<string>('');
  const [editPin, setEditPin] = useState<string>('');

  // Ad Video URL Editor State
  const [editingAdIndex, setEditingAdIndex] = useState<1 | 2>(1);
  const [videoUrlInput, setVideoUrlInput] = useState<string>('');
  const [videoTitleInput, setVideoTitleInput] = useState<string>('');

  // If Admin is not authenticated, strictly lock portal so regular users cannot see funding or admin options
  if (!isAdminLoggedIn) {
    return <AdminLoginGate onSuccess={() => setAdminSection('funding')} />;
  }

  // Handle Injecting Money into the App
  const handleInjectFunds = (e: React.FormEvent) => {
    e.preventDefault();
    if (injectAmount <= 0) {
      showToast('Please enter an amount greater than Rs 0.');
      return;
    }

    const res = injectAppReserveFunds(injectAmount, injectMethod, injectNote);
    if (res.success) {
      setIsFundingSuccess(true);
      setTimeout(() => setIsFundingSuccess(false), 3000);
      setInjectNote('Liquidity top-up');
    }
  };

  // Handle Switch Admin Click
  const handleSwitchAdminClick = (targetId: 'admin_1' | 'admin_2') => {
    if (targetId === currentAdminId) return;
    const target = admins.find((a) => a.id === targetId);
    if (!target) return;

    if (target.pin) {
      setPinPromptAdminId(targetId);
      setEnteredPin('');
      setPinError('');
    } else {
      switchAdmin(targetId);
    }
  };

  // Confirm PIN switch
  const handleConfirmPinSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinPromptAdminId) return;

    const res = switchAdmin(pinPromptAdminId, enteredPin.trim());
    if (res.success) {
      setPinPromptAdminId(null);
      setEnteredPin('');
      setPinError('');
    } else {
      setPinError(res.message);
    }
  };

  // Start editing admin profile
  const handleStartEditProfile = (admin: AdminProfile) => {
    setEditingAdminId(admin.id);
    setEditName(admin.name);
    setEditPhone(admin.phone);
    setEditTitle(admin.title);
    setEditPin(admin.pin);
  };

  // Save admin profile
  const handleSaveProfile = (adminId: 'admin_1' | 'admin_2') => {
    updateAdminProfile(adminId, {
      name: editName.trim() || 'Admin',
      phone: editPhone.trim(),
      title: editTitle.trim() || 'Co-Owner',
      pin: editPin.trim() || (adminId === 'admin_1' ? '0675' : '0021'),
      whatsapp: `https://wa.me/92${editPhone.replace(/[^0-9]/g, '').replace(/^92|^0/, '')}`,
    });

    if (adminId === 'admin_1' && editPhone.trim()) {
      setWhatsappLink(editPhone.trim());
    } else if (adminId === 'admin_2' && editPhone.trim()) {
      setWhatsappLink2(editPhone.trim());
    }

    setEditingAdminId(null);
  };

  // Pending items count
  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'processing' || w.status === 'pending');
  const pendingDeposits = deposits.filter((d) => d.status === 'pending');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: 2-Admin Platform Control */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CO-ADMIN PLATFORM DASHBOARD (2 منتظمین پینل)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Platform Management & App Funding Vault
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              یہ پینل 2 مالکان/ایڈمنز کے لیے بنایا گیا ہے تاکہ آپ دونوں مل کر ایپ کو چلائیں، ایپ میں پیسے ڈالیں (Liquidity Reserve) تاکہ لوگ اشتہارات دیکھ کر کما سکیں اور ودڈرا حاصل کر سکیں۔
            </p>
          </div>

          {/* Active Admin Indicator Card & Actions */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 shadow-lg">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${currentAdmin.avatarColor} flex items-center justify-center text-white font-black text-lg shadow-md`}>
                {currentAdmin.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400">
                    Active Controlling Admin
                  </span>
                </div>
                <p className="font-black text-white text-base leading-snug">{currentAdmin.name}</p>
                <p className="text-xs text-slate-400">{currentAdmin.title} • {currentAdmin.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
              <button
                type="button"
                onClick={() => setAdminSection('alerts')}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                title="View live user notifications"
              >
                <BellRing className="w-3.5 h-3.5 animate-pulse" />
                <span>الرٹس ({unreadAlertsCount})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  adminLogout();
                  showToast('ایڈمن موڈ بند کر دیا گیا ہے۔ (Admin logged out)');
                }}
                className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                title="Lock Admin portal and exit to user view"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>لاک / لاگ آؤٹ</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2 Admins Side-by-Side Control Switcher */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {admins.map((admin) => {
            const isActive = admin.id === currentAdminId;
            return (
              <div
                key={admin.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-indigo-900/30 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${admin.avatarColor} flex items-center justify-center text-white font-black text-sm shadow`}
                    >
                      {admin.id === 'admin_1' ? 'A1' : 'A2'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{admin.name}</span>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            ONLINE NOW
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono">{admin.phone} • {admin.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEditProfile(admin)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Edit Admin Contact/PIN"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {!isActive && (
                      <button
                        type="button"
                        onClick={() => handleSwitchAdminClick(admin.id)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                      >
                        <Key className="w-3.5 h-3.5" />
                        Switch to {admin.id === 'admin_1' ? 'Admin 1' : 'Admin 2'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* User Traffic Intelligence Overview (Admin Only - Hidden from Users) */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                User Traffic & Visitors Overview (صارفین کی تعداد اور آمد)
              </h4>
            </div>
            <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-3 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1.5 self-start sm:self-auto">
              <EyeOff className="w-3.5 h-3.5" />
              صرف ایڈمن کے پاس محفوظ - یوزر کو نظر نہیں آتا (Hidden from Users)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-left">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>کل رجسٹرڈ صارفین</span>
                <Users className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <p className="text-2xl font-black text-white mt-1">
                {userAnalytics.totalUsers === 0 ? '00' : userAnalytics.totalUsers.toLocaleString()}
              </p>
              <span className="text-[10px] text-blue-400 font-semibold">
                {userAnalytics.newUsersToday === 0 ? '00 نئے آج آئے' : `+${userAnalytics.newUsersToday} نئے آج آئے`}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-left">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>آج کے وزٹرز (Today)</span>
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-emerald-400 mt-1">
                {userAnalytics.todayVisitors === 0 ? '00' : userAnalytics.todayVisitors.toLocaleString()}
              </p>
              <span className="text-[10px] text-emerald-400 font-semibold">
                {userAnalytics.onlineNow === 0 ? '00 اس وقت لائیو آن لائن' : `${userAnalytics.onlineNow} اس وقت لائیو آن لائن`}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-left">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>دیکھے گئے اشتہارات</span>
                <PlayCircle className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className="text-2xl font-black text-white mt-1">
                {userAnalytics.totalAdsWatched === 0 ? '00' : userAnalytics.totalAdsWatched.toLocaleString()}
              </p>
              <span className="text-[10px] text-purple-400 font-semibold">
                {userAnalytics.totalAdsWatched === 0 ? '00 اشتہار دیکھے گئے' : '2 اشتہار روزانہ'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-left">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>پلان خریدار (150/300/450)</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-white mt-1">
                {(userAnalytics.activePlanSubscribers.plan150 + userAnalytics.activePlanSubscribers.plan300 + userAnalytics.activePlanSubscribers.plan450) === 0
                  ? '00'
                  : (userAnalytics.activePlanSubscribers.plan150 + userAnalytics.activePlanSubscribers.plan300 + userAnalytics.activePlanSubscribers.plan450).toLocaleString()}
              </p>
              <span className="text-[10px] text-amber-400 font-semibold">
                150: {userAnalytics.activePlanSubscribers.plan150 === 0 ? '00' : userAnalytics.activePlanSubscribers.plan150} | 300: {userAnalytics.activePlanSubscribers.plan300 === 0 ? '00' : userAnalytics.activePlanSubscribers.plan300} | 450: {userAnalytics.activePlanSubscribers.plan450 === 0 ? '00' : userAnalytics.activePlanSubscribers.plan450}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* URGENT PENDING WITHDRAWALS SECTION (User Request: "Jb user withdraw kary to admin ko request ay wo approval kary per withdrawal ho") */}
      {pendingWithdrawals.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border-2 border-amber-500/60 shadow-2xl space-y-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 animate-bounce">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500 text-white animate-pulse">
                    {pendingWithdrawals.length} نئی درخواستیں
                  </span>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    فوری ایڈمن منظوری درکار ہے
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                  صارفین کی ودڈرا درخواستیں (Withdrawal Requests Awaiting Your Approval)
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              صارف نے ایڈز دیکھ کر کمائی کا ودڈرا لگایا ہے۔ تصدیق کر کے منظوری (Approve) دیں تاکہ فنڈز منتقل ہوں۔
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingWithdrawals.map((pw) => {
              const hasEnoughReserve = appReserveBalance >= pw.netAmount;
              return (
                <div key={pw.id} className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between gap-3 shadow-lg">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-400">{pw.referenceId}</span>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-slate-800 text-emerald-400 uppercase border border-slate-700">
                        {pw.method}
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">{pw.accountTitle}</p>
                        <p className="text-xs text-slate-400 font-mono">{pw.accountNumber}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-emerald-400">Rs {pw.netAmount.toLocaleString()}</span>
                        <span className="block text-[10px] text-slate-400">{pw.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    {!hasEnoughReserve ? (
                      <div className="flex-1 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-red-400 font-bold">⚠️ ایپ ریزرو میں فنڈز ناکافی ہیں</span>
                        <button
                          type="button"
                          onClick={() => setAdminSection('funding')}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                        >
                          فنڈز ڈالیں
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => approveUserWithdrawal(pw.id)}
                          className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          منظور کریں اور ادا کریں (Approve & Pay)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRejectModalWithdrawalId(pw.id);
                          }}
                          className="px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 text-xs font-bold transition-all"
                        >
                          مسترد
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Admin Section Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-bold no-scrollbar">
        <button
          onClick={() => setAdminSection('visitors')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            adminSection === 'visitors'
              ? 'bg-blue-600 text-white shadow-md font-black'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4 text-cyan-300" />
          <span>👥 User Traffic & Visitors (صارفین کی آمد)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-950 text-blue-300 font-black">
            {userAnalytics.todayVisitors === 0 ? '00' : userAnalytics.todayVisitors} Today
          </span>
        </button>

        <button
          onClick={() => setAdminSection('alerts')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            adminSection === 'alerts'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <BellRing className="w-4 h-4 text-amber-400" />
          <span>🚨 Live User Alerts (یوزر الرٹ سسٹم)</span>
          {unreadAlertsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-black animate-pulse">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminSection('funding')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            adminSection === 'funding'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>App Funding Vault (ایپ میں پیسے ڈالیں)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/40 text-emerald-300 font-black">
            Rs {appReserveBalance.toLocaleString()}
          </span>
        </button>

        <button
          onClick={() => setAdminSection('withdrawals')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            adminSection === 'withdrawals'
              ? 'bg-indigo-500 text-white shadow-md font-extrabold'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <ArrowUpCircle className="w-4 h-4" />
          <span>User Withdrawals (ودڈرا منظوری)</span>
          {pendingWithdrawals.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-slate-950 font-black animate-pulse">
              {pendingWithdrawals.length} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminSection('deposits')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            adminSection === 'deposits'
              ? 'bg-purple-500 text-white shadow-md font-extrabold'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <ArrowDownCircle className="w-4 h-4" />
          <span>User Deposits (پلان ڈپازٹ ٹی آئی ڈی)</span>
          {pendingDeposits.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-slate-950 font-black">
              {pendingDeposits.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminSection('announcement')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            adminSection === 'announcement'
              ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Broadcast Notice (صارفین کے لیے اعلان)</span>
        </button>

        <button
          onClick={() => setAdminSection('links')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            adminSection === 'links'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>WhatsApp Channel & Links (واٹس ایپ چینل لنک)</span>
        </button>

        <button
          onClick={() => setAdminSection('admins')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            adminSection === 'admins'
              ? 'bg-blue-500 text-white shadow-md font-extrabold'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>2 Admins Setup (منتظمین پروفائل)</span>
        </button>

        <button
          onClick={() => setAdminSection('ads')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            adminSection === 'ads'
              ? 'bg-red-500 text-white shadow-md font-extrabold'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <PlayCircle className="w-4 h-4" />
          <span>YouTube Ads & Videos (اشتہارات کنٹرول)</span>
        </button>

        <button
          onClick={() => setAdminSection('logs')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            adminSection === 'logs'
              ? 'bg-slate-200 text-slate-950 shadow-md font-extrabold'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Activity Log (سرگرمی لاگ)</span>
        </button>
      </div>

      {/* SECTION: USER TRAFFIC & VISITORS (USER REQUEST: "kitny user as app a rahy hai ya sab kuch admin ky pas ho user ko nazar na ay") */}
      {adminSection === 'visitors' && (
        <div className="space-y-6">
          {/* Privacy & Confidentiality Guarantee Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-indigo-950/40 border border-amber-500/30 text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-amber-400">
                <EyeOff className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="text-sm font-extrabold uppercase tracking-wide">
                  🔒 ایڈمن رازداری کی ضمانت - صارفین کو ٹریفک نظر نہیں آئے گی (Strictly Admin-Only Visibility)
                </h3>
              </div>
              <button
                type="button"
                onClick={resetHiddenAnalyticsToZero}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-all shadow-sm active:scale-95 self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تمام خفیہ کاؤنٹرز 00 کریں (Reset to 00)</span>
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              آپ کی ہدایت کے مطابق: <strong>کتنے یوزر اس ایپ پر آ رہے ہیں، کیا کر رہے ہیں، اور کتنی ٹریفک ہے، یہ سب کچھ صرف ایڈمن ({currentAdmin.name}) کے پاس محفوظ ہے</strong>۔ کسی عام صارف کو یہ شماریات نظر نہیں آتیں، اور پوشیدہ کاؤنٹرز 00 پر سیٹ ہیں۔
            </p>
          </div>

          {/* 4 Analytics Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-left">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>کل رجسٹرڈ صارفین (Total Users)</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-black text-white">
                {userAnalytics.totalUsers === 0 ? '00' : userAnalytics.totalUsers.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{userAnalytics.newUsersToday === 0 ? '00 نئے صارفین آج شامل ہوئے' : `+${userAnalytics.newUsersToday} نئے صارفین آج شامل ہوئے`}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 text-left">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>آج کے وزٹرز (Today Visitors)</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-emerald-400">
                {userAnalytics.todayVisitors === 0 ? '00' : userAnalytics.todayVisitors.toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-semibold mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{userAnalytics.onlineNow === 0 ? '00 صارفین اس وقت لائیو آن لائن ہیں' : `${userAnalytics.onlineNow} صارفین اس وقت لائیو آن لائن ہیں`}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-left">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>مکمل دیکھے گئے اشتہارات</span>
                <PlayCircle className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-black text-white">
                {userAnalytics.totalAdsWatched === 0 ? '00' : userAnalytics.totalAdsWatched.toLocaleString()}
              </p>
              <p className="text-[11px] text-purple-400 font-semibold mt-2">
                {userAnalytics.totalAdsWatched === 0 ? '00 اشتہار دیکھے گئے' : 'روزانہ 2 اشتہارات فی یوزر'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-left">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>پلان خریدار (150/300/450)</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-black text-white">
                {(userAnalytics.activePlanSubscribers.plan150 + userAnalytics.activePlanSubscribers.plan300 + userAnalytics.activePlanSubscribers.plan450) === 0
                  ? '00'
                  : (userAnalytics.activePlanSubscribers.plan150 + userAnalytics.activePlanSubscribers.plan300 + userAnalytics.activePlanSubscribers.plan450).toLocaleString()}
              </p>
              <p className="text-[11px] text-amber-400 font-semibold mt-2">
                150: {userAnalytics.activePlanSubscribers.plan150 === 0 ? '00' : userAnalytics.activePlanSubscribers.plan150} | 300: {userAnalytics.activePlanSubscribers.plan300 === 0 ? '00' : userAnalytics.activePlanSubscribers.plan300} | 450: {userAnalytics.activePlanSubscribers.plan450 === 0 ? '00' : userAnalytics.activePlanSubscribers.plan450}
              </p>
            </div>
          </div>

          {/* Plan Breakdown Visualizer */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-left space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              پلانز کے مطابق صارفین کی تقسیم (Subscribers per Deposit Plan)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                  <span>پلان 1 (Rs 150 PKR)</span>
                  <span className="font-bold text-emerald-400">
                    {userAnalytics.activePlanSubscribers.plan150 === 0 ? '00' : userAnalytics.activePlanSubscribers.plan150} صارفین
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: userAnalytics.activePlanSubscribers.plan150 > 0 ? '42%' : '0%' }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1.5">کمائی: Rs 40/یومیہ (2 ایڈز)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/20">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                  <span>پلان 2 (Rs 300 PKR)</span>
                  <span className="font-bold text-blue-400">
                    {userAnalytics.activePlanSubscribers.plan300 === 0 ? '00' : userAnalytics.activePlanSubscribers.plan300} صارفین
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: userAnalytics.activePlanSubscribers.plan300 > 0 ? '38%' : '0%' }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1.5">کمائی: Rs 85/یومیہ (2 ایڈز)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/20">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                  <span>پلان 3 (Rs 450 PKR)</span>
                  <span className="font-bold text-purple-400">
                    {userAnalytics.activePlanSubscribers.plan450 === 0 ? '00' : userAnalytics.activePlanSubscribers.plan450} صارفین
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: userAnalytics.activePlanSubscribers.plan450 > 0 ? '20%' : '0%' }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1.5">کمائی: Rs 130/یومیہ (2 ایڈز)</span>
              </div>
            </div>
          </div>

          {/* Incoming Users Live Activity Stream */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  لائیو صارفین کی آمد و سرگرمیاں (Incoming Users Real-Time Stream)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  ہر آنے والے یوزر کی لوکیشن، موبائل ماڈل، اور ایکشن کا مکمل لائیو ریکارڈ:
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                لائیو ٹریکنگ جاری ہے
              </span>
            </div>

            {userAnalytics.visitorLogs.length === 0 ? (
              <div className="py-12 text-center rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 space-y-2">
                <Users className="w-8 h-8 text-slate-600 mx-auto" />
                <h5 className="text-sm font-bold text-slate-300">تمام خفیہ ٹریفک لاگز 00 پر سیٹ ہیں (00 Active Logs)</h5>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  صارفین کے لیے تمام خفیہ شماریات 00 ہیں۔ جیسے ہی کوئی نیا یوزر ایپ پر سرگرمی کرے گا، ایڈمن پینل میں لائیو لاگ بن جائے گا۔
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {userAnalytics.visitorLogs.map((log) => (
                  <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 font-bold shrink-0">
                        <Users className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white">{log.userName}</span>
                          <span className="text-xs font-mono text-slate-400">({log.userPhone})</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            {log.city}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800/60 text-slate-400 flex items-center gap-1">
                            <Smartphone className="w-3 h-3 text-cyan-400" />
                            {log.device}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-400 mt-1 font-medium">
                          {log.action}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono whitespace-nowrap self-end sm:self-auto">
                      {log.date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 0: LIVE USER ALERTS & TRACKER ("jb koi user aye to pata chaly") */}
      {adminSection === 'alerts' && <AdminAlertsView />}

      {/* SECTION 1: APP FUNDING VAULT (USER'S PRIMARY REQUEST: "as app my ham pesy dal saky ky koi jb band adds dak kr kamay to withdraw kr sakhy") */}
      {adminSection === 'funding' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>App Payout Reserve (خزانہ)</span>
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">
                <span className="text-emerald-400 text-lg mr-1 font-bold">Rs</span>
                {appReserveBalance.toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-400 font-medium mt-1">
                100% Ready for User Withdrawals (5-7 Mins)
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Total Injected by Admins</span>
                <TrendingUp className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">
                <span className="text-indigo-400 text-lg mr-1 font-bold">Rs</span>
                {adminInjections.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {adminInjections.length} injections logged by 2 Admins
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Total Dispatched to Users</span>
                <ArrowUpCircle className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">
                <span className="text-purple-400 text-lg mr-1 font-bold">Rs</span>
                {totalWithdrawn.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Ads earnings paid out to JazzCash / Easypaisa
              </p>
            </div>
          </div>

          {/* Inject Money Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Inject Money Into App (ایپ میں پیسے جمع کریں)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add capital into the payout reserve so users can freely withdraw ad earnings.
                  </p>
                </div>
              </div>

              <form onSubmit={handleInjectFunds} className="space-y-4">
                {/* Pre-set Quick Amount Buttons */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Select Funding Amount (پیسے ڈالنے کی حد)
                    </label>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Limits: 500 / 1000 / 2000
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[500, 1000, 2000, 5000, 10000, 25000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setInjectAmount(amt)}
                        className={`py-2 px-1 rounded-xl text-xs font-extrabold border transition-all ${
                          injectAmount === amt
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        Rs {amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Custom Amount to Inject (Rs PKR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                      Rs
                    </span>
                    <input
                      type="number"
                      min="500"
                      step="500"
                      value={injectAmount}
                      onChange={(e) => setInjectAmount(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-extrabold text-lg focus:outline-none focus:border-emerald-500 transition-all"
                      placeholder="e.g. 50000"
                      required
                    />
                  </div>
                </div>

                {/* Source Payment Method */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Funding Source / Bank Method
                  </label>
                  <select
                    value={injectMethod}
                    onChange={(e) => setInjectMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-emerald-500 transition-all"
                  >
                    <option value="JazzCash Business">JazzCash Business Reserve (03706486965)</option>
                    <option value="Easypaisa Merchant">Easypaisa Reserve (03174679161)</option>
                    <option value="OPay Corporate">OPay Corporate Account (03098899212)</option>
                    <option value="Meezan / HBL Bank">Bank Transfer (HBL / Meezan)</option>
                    <option value="Cash Vault Deposit">Cash Liquidity Pool</option>
                  </select>
                </div>

                {/* Memo / Note */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Admin Memo / Note
                  </label>
                  <input
                    type="text"
                    value={injectNote}
                    onChange={(e) => setInjectNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 transition-all"
                    placeholder="e.g. Weekly Ads Liquidity Pool top-up"
                  />
                </div>

                {/* Confirming Admin Info */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Authorizing Admin:</span>
                  </div>
                  <span className="font-bold text-white">
                    {currentAdmin.name} ({currentAdmin.id === 'admin_1' ? 'Admin 1' : 'Admin 2'})
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <ArrowDownCircle className="w-5 h-5" />
                  <span>Inject Rs {injectAmount.toLocaleString()} PKR into App Reserve</span>
                </button>

                {isFundingSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>پیسے کامیابی سے ایپ خزانہ میں جمع ہو گئے! صارفین کے ودڈرا فوری پروسیس ہو سکتے ہیں۔</span>
                  </div>
                )}
              </form>
            </div>

            {/* Injections History Log */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Admin Capital Injections History
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {adminInjections.length} Records
                </span>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {adminInjections.map((inj) => (
                  <div
                    key={inj.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-lg flex items-center justify-center font-black text-[10px] ${
                            inj.adminId === 'admin_1'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-indigo-500/20 text-indigo-400'
                          }`}
                        >
                          {inj.adminId === 'admin_1' ? 'A1' : 'A2'}
                        </span>
                        <span className="font-bold text-white">{inj.adminName}</span>
                      </div>
                      <span className="text-emerald-400 font-extrabold text-sm">
                        +Rs {inj.amount.toLocaleString()} PKR
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Source: {inj.method}</span>
                      <span>{inj.date}</span>
                    </div>

                    {inj.note && (
                      <p className="text-slate-400 text-[11px] italic bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                        "{inj.note}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: USER WITHDRAWALS MANAGEMENT */}
      {adminSection === 'withdrawals' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ArrowUpCircle className="w-5 h-5 text-indigo-400" />
                <span>صارفین کی ودڈرا درخواستیں (Manage User Withdrawals)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                صارفین کی اشتہارات کی کمائی کی ودڈرا درخواستیں یہاں موصول ہوتی ہیں۔ ایڈمن کے اپروو کرنے پر ہی ایپ ریزرو سے رقم منتقل ہوتی ہے۔
              </p>
            </div>
            <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
              <div className="text-right">
                <p className="text-[10px] text-slate-400">ایپ ریزرو بیلنس:</p>
                <p className={`text-sm font-black font-mono ${appReserveBalance > 1000 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  Rs {appReserveBalance.toLocaleString()} PKR
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdminSection('funding')}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>فنڈز جمع کریں</span>
              </button>
            </div>
          </div>

          {/* Sub-tabs Filter */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setWithdrawalsTab('pending')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                withdrawalsTab === 'pending'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>پینڈنگ منظوری (Action Required)</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                withdrawalsTab === 'pending' ? 'bg-slate-950 text-amber-300' : 'bg-slate-900 text-slate-300'
              }`}>
                {withdrawals.filter((w) => w.status === 'pending' || w.status === 'processing').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setWithdrawalsTab('completed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                withdrawalsTab === 'completed'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>منظور شدہ (Paid Payouts)</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                withdrawalsTab === 'completed' ? 'bg-slate-950 text-emerald-300' : 'bg-slate-900 text-slate-300'
              }`}>
                {withdrawals.filter((w) => w.status === 'completed').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setWithdrawalsTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                withdrawalsTab === 'all'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>تمام ریکارڈز ({withdrawals.length})</span>
            </button>
          </div>

          {/* Table or Empty State */}
          {withdrawals.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              کوئی ودڈرا ریکارڈ موجود نہیں۔ جب کوئی صارف اشتہارات دیکھ کر رقم نکالے گا، یہاں نظر آئے گی۔
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
                    <th className="px-4 py-3">Ref ID</th>
                    <th className="px-4 py-3">صارف اور اکاؤنٹ</th>
                    <th className="px-4 py-3">طریقہ کار</th>
                    <th className="px-4 py-3">رقم</th>
                    <th className="px-4 py-3">حیثیت (Status)</th>
                    <th className="px-4 py-3 text-right">ایڈمن ایکشن (Admin Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {withdrawals
                    .filter((w) => {
                      if (withdrawalsTab === 'pending') return w.status === 'pending' || w.status === 'processing';
                      if (withdrawalsTab === 'completed') return w.status === 'completed';
                      return true;
                    })
                    .map((w) => {
                      const isPending = w.status === 'pending' || w.status === 'processing';
                      const isCompleted = w.status === 'completed';
                      const isRejected = w.status === 'rejected';
                      const hasEnoughReserve = appReserveBalance >= w.netAmount;

                      return (
                        <tr key={w.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3.5 font-mono text-slate-300 font-bold">{w.referenceId}</td>
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-white">{w.accountTitle}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{w.accountNumber}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="uppercase font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                              {w.method}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-extrabold text-white">
                            Rs {w.netAmount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5">
                            {isPending ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold text-[10px]">
                                  <Clock className="w-3 h-3 animate-spin text-amber-400" />
                                  منتظر منظوری (Pending Approval)
                                </span>
                                <p className="text-[10px] text-slate-400">{w.date}</p>
                                {!hasEnoughReserve && (
                                  <p className="text-[10px] text-red-400 font-semibold">
                                    ⚠️ ایپ میں فنڈز کم ہیں
                                  </p>
                                )}
                              </div>
                            ) : isCompleted ? (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                                  <Check className="w-3 h-3" />
                                  منظور اور ادا شدہ
                                </span>
                                <p className="text-[10px] text-slate-500">{w.receivedAt || w.date}</p>
                              </div>
                            ) : (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-[10px]">
                                  <AlertCircle className="w-3 h-3" />
                                  مسترد شدہ
                                </span>
                                {w.rejectReason && <p className="text-[10px] text-slate-400">{w.rejectReason}</p>}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            {isPending ? (
                              <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2">
                                {!hasEnoughReserve ? (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setAdminSection('funding')}
                                      className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition-all active:scale-95 flex items-center gap-1"
                                      title="Add funds into App Reserve"
                                    >
                                      <Wallet className="w-3 h-3" />
                                      <span>فنڈز جمع کریں</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => approveUserWithdrawal(w.id)}
                                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed border border-slate-700"
                                      title="Cannot approve until app reserve is funded"
                                    >
                                      اپروو کریں
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => approveUserWithdrawal(w.id)}
                                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95 inline-flex items-center gap-1.5"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>منظور کریں (Approve & Pay)</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setRejectModalWithdrawalId(w.id)}
                                      className="px-2 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 text-xs font-bold transition-all"
                                      title="Reject request and refund to user"
                                    >
                                      مسترد
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-500 text-xs font-semibold">
                                {isCompleted ? '✓ Paid from Reserve' : 'Refunded'}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: USER DEPOSITS & TIDs */}
      {adminSection === 'deposits' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ArrowDownCircle className="w-5 h-5 text-purple-400" />
                <span>User Deposits & Plan Activations (ڈپازٹ منظوری)</span>
              </h3>
              <p className="text-xs text-slate-400">
                صارفین کے بھیجے گئے JazzCash، Easypaisa اور OPay کے ٹرانزیکشن آئی ڈیز (TID) کی تصدیق کریں۔
              </p>
            </div>
          </div>

          {deposits.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              کوئی نیا ڈپازٹ ریکارڈ نہیں ملا۔
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Sender Phone</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">TID / TRX ID</th>
                    <th className="px-4 py-3">Amount + 10% Bonus</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {deposits.map((dep) => (
                    <tr key={dep.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-slate-400">{dep.date}</td>
                      <td className="px-4 py-3 font-bold text-white">{dep.senderNumber}</td>
                      <td className="px-4 py-3 uppercase text-slate-300 font-bold">{dep.method}</td>
                      <td className="px-4 py-3 font-mono text-amber-300 font-bold">{dep.transactionId}</td>
                      <td className="px-4 py-3 font-extrabold text-emerald-400">
                        Rs {dep.amount} + Rs {dep.bonusAmount} ({dep.totalCredited} PKR)
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            dep.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {dep.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {dep.status === 'pending' ? (
                          <button
                            type="button"
                            onClick={() => approveUserDeposit(dep.id)}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve TID</span>
                          </button>
                        ) : (
                          <span className="text-slate-500 text-xs">Approved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: 2 ADMINS TEAM SETUP */}
      {adminSection === 'admins' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>2 Admins Co-Ownership Profile Setup (دو منتظمین کی معلومات)</span>
            </h3>
            <p className="text-xs text-slate-400">
              دونوں مالکان اپنے نام، فون نمبر، واٹس ایپ ہیلپ لائن اور سیکیورٹی پن تبدیل کر سکتے ہیں۔
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${admin.avatarColor} flex items-center justify-center text-white font-black text-lg`}
                    >
                      {admin.id === 'admin_1' ? 'A1' : 'A2'}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-base">{admin.name}</h4>
                      <p className="text-xs text-slate-400">{admin.title}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      admin.id === currentAdminId
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {admin.id === currentAdminId ? 'LOGGED IN' : 'CO-ADMIN'}
                  </span>
                </div>

                <div className="space-y-2 text-xs border-t border-slate-900 pt-3">
                  <div className="flex justify-between text-slate-400">
                    <span>Phone Number:</span>
                    <strong className="text-white font-mono">{admin.phone}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>WhatsApp Helpline:</span>
                    <a
                      href={admin.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      {admin.phone}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Admin Access PIN:</span>
                    <strong className="text-amber-400 font-mono tracking-widest">{admin.pin}</strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartEditProfile(admin)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit {admin.id === 'admin_1' ? 'Admin 1' : 'Admin 2'} Details</span>
                  </button>
                  {admin.id !== currentAdminId && (
                    <button
                      type="button"
                      onClick={() => handleSwitchAdminClick(admin.id)}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Take Active Control</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Edit Admin Modal */}
          {editingAdminId && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-400" />
                  <span>Edit Admin Profile ({editingAdminId === 'admin_1' ? 'Admin 1' : 'Admin 2'})</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone Number (For WhatsApp Helpline)
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="e.g. 03225290908"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Role / Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      4-Digit Admin PIN Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={editPin}
                      onChange={(e) => setEditPin(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono tracking-widest focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingAdminId(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveProfile(editingAdminId)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 4.5: BROADCAST ANNOUNCEMENT TO USERS */}
      {adminSection === 'announcement' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-teal-400" />
              <span>Broadcast Notice to All Users (صارفین کی سکرین پر پیغام نشر کریں)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              یہاں آپ جو بھی پیغام لکھیں گے وہ تمام عام صارفین کی ہوم سکرین اور ڈیش بورڈ پر فوری طور پر ظاہر ہوگا تاکہ وہ باخبر رہیں۔
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Announcement Message (اردو یا انگلش میں پیغام لکھیں):
              </label>
              <textarea
                rows={3}
                value={announcementInput}
                onChange={(e) => setAnnouncementInput(e.target.value)}
                placeholder="مثال: ایپ میں فنڈز اور لیکیویڈیٹی موجود ہے، آپ سب روزانہ اشتہارات دیکھ کر 5 سے 7 منٹ میں ودڈرا حاصل کر سکتے ہیں!"
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setAdminAnnouncement(announcementInput.trim() || null);
                  showToast('اعلان کامیابی سے تمام صارفین کے لیے اپڈیٹ کر دیا گیا ہے!');
                }}
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>نشر کریں (Broadcast to All Users)</span>
              </button>

              {adminAnnouncement && (
                <button
                  type="button"
                  onClick={() => {
                    setAnnouncementInput('');
                    setAdminAnnouncement(null);
                    showToast('اعلان ہٹا دیا گیا ہے۔');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                >
                  اعلان ختم کریں (Remove Notice)
                </button>
              )}
            </div>

            {adminAnnouncement && (
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-start gap-3">
                <Megaphone className="w-4 h-4 shrink-0 mt-0.5 text-teal-400" />
                <div>
                  <span className="font-bold block mb-1">فی الوقت فعال اعلان (Currently Live Preview):</span>
                  <p className="text-slate-200">{adminAnnouncement}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4.6: WHATSAPP CHANNEL & SOCIAL LINKS */}
      {adminSection === 'links' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                <span>WhatsApp Channel & Official Links (واٹس ایپ چینل و لنکس کنٹرول)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                یہاں اپنا واٹس ایپ چینل، ہیلپ لائن نمبرز اور یوٹیوب لنک پیسٹ کریں، یہ پوری ایپ میں ہر یوزر کو فوری طور پر نظر آئیں گے۔
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={waChannelAdminInput}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 flex items-center gap-1.5 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test Channel Link</span>
              </a>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (waChannelAdminInput.trim()) {
                setWhatsappChannelLink(waChannelAdminInput.trim());
              }
              if (wa1AdminInput.trim()) {
                setWhatsappLink(wa1AdminInput.trim());
              }
              if (wa2AdminInput.trim()) {
                setWhatsappLink2(wa2AdminInput.trim());
              }
              if (ytAdminInput.trim()) {
                setYoutubeChannelLink(ytAdminInput.trim());
              }
              setLinksSaveSuccess(true);
              showToast('تمام لنکس اور واٹس ایپ چینل کامیابی سے محفوظ ہو گئے ہیں!');
              setTimeout(() => setLinksSaveSuccess(false), 2000);
            }}
            className="space-y-5"
          >
            {/* PRIMARY: WhatsApp Channel Link */}
            <div className="p-5 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-emerald-300 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>📢 Official WhatsApp Channel Link (واٹس ایپ چینل کا لنک پیسٹ کریں):</span>
                </label>
                {waChannelAdminInput && (
                  <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    Active in App
                  </span>
                )}
              </div>
              <input
                type="text"
                value={waChannelAdminInput}
                onChange={(e) => setWaChannelAdminInput(e.target.value)}
                placeholder="مثال: https://whatsapp.com/channel/... یا گروپ کا لنک"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-200 font-mono text-xs focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                required
              />
              <p className="text-[11px] text-emerald-400/90 leading-relaxed font-medium">
                👉 <strong>یوزرز کہاں دیکھیں گے؟</strong> یہ چینل لنک ایپ کے ٹاپ نیویگیشن، ڈیش بورڈ ہوم پیج، سپورٹ سینٹر، اور باٹم بار پر چمکتا ہوا بٹن بن کر ظاہر ہوگا جس سے یوزرز فوری آپ کا واٹس ایپ چینل جوائن کر سکتے ہیں۔
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* WhatsApp Helpline 1 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Helpline #1 (پہلا نمبر):</span>
                  </label>
                  {wa1AdminInput && (
                    <a
                      href={wa1AdminInput.startsWith('http') ? wa1AdminInput : `https://wa.me/92${wa1AdminInput.replace(/[^0-9]/g, '').replace(/^92|^0/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Test
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={wa1AdminInput}
                  onChange={(e) => setWa1AdminInput(e.target.value)}
                  placeholder="03225290908 یا wa.me لنک"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
                <p className="text-[10px] text-slate-400">
                  Primary Helpline: <strong>0322-5290908</strong>
                </p>
              </div>

              {/* WhatsApp Helpline 2 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-teal-400" />
                    <span>WhatsApp Helpline #2 (دوسرا نمبر):</span>
                  </label>
                  {wa2AdminInput && (
                    <a
                      href={wa2AdminInput.startsWith('http') ? wa2AdminInput : `https://wa.me/92${wa2AdminInput.replace(/[^0-9]/g, '').replace(/^92|^0/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-teal-400 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Test
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={wa2AdminInput}
                  onChange={(e) => setWa2AdminInput(e.target.value)}
                  placeholder="03098899212 یا wa.me لنک"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                  required
                />
                <p className="text-[10px] text-slate-400">
                  Secondary Helpline: <strong>0309-8899212</strong>
                </p>
              </div>
            </div>

            {/* YouTube Channel Link */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Youtube className="w-4 h-4 text-red-500" />
                  <span>Official YouTube Channel Link (یوٹیوب چینل لنک):</span>
                </label>
                {ytAdminInput && (
                  <a
                    href={ytAdminInput}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-red-400 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" /> Test
                  </a>
                )}
              </div>
              <input
                type="text"
                value={ytAdminInput}
                onChange={(e) => setYtAdminInput(e.target.value)}
                placeholder="https://www.youtube.com/@YourChannel"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                required
              />
              <p className="text-[10px] text-slate-400">
                ایپ کے صارفین اس چینل پر جا کر ارننگ ویڈیوز اور ٹیوٹوریلز دیکھیں گے۔
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95"
              >
                {linksSaveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Links Saved Successfully! (لنکس محفوظ ہو گئے)</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-slate-950" />
                    <span>Save All Links (تمام لنکس محفوظ کریں)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 5: YOUTUBE ADS CONTROLLER */}
      {adminSection === 'ads' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-red-400" />
              <span>YouTube Video Ads Settings (اشتہارات تبدیل کریں)</span>
            </h3>
            <p className="text-xs text-slate-400">
              یہاں سے آپ یوٹیوب ویڈیوز کے لنکس، عنوانات، اور سوالات کو تبدیل کر سکتے ہیں جو صارفین روزانہ دیکھتے ہیں۔
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adCampaigns.map((camp, idx) => (
              <div
                key={camp.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 font-extrabold text-xs">
                    Ad Slot #{camp.adIndex}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{camp.brand}</span>
                </div>

                <h4 className="font-bold text-white text-sm">{camp.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{camp.description}</p>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div className="text-slate-400">Current Video URL:</div>
                  <p className="font-mono text-blue-400 truncate">{camp.videoUrl || 'Default YouTube Video'}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newUrl = prompt(`Enter new YouTube Video URL for Ad #${camp.adIndex}:`, camp.videoUrl || '');
                    if (newUrl !== null) {
                      saveAdCampaign({
                        ...camp,
                        videoUrl: newUrl.trim(),
                      });
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update Video URL</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: ACTIVITY AUDIT LOG */}
      {adminSection === 'logs' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-teal-400" />
              <span>Admin Actions Audit Trail (دونوں ایڈمنز کی سرگرمی لاگ)</span>
            </h3>
            <span className="text-xs text-slate-400">{adminLogs.length} events</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {adminLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        log.adminId === 'admin_1'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-indigo-500/20 text-indigo-400'
                      }`}
                    >
                      {log.adminName}
                    </span>
                    <strong className="text-white">{log.action}</strong>
                  </div>
                  <p className="text-slate-400 text-xs">{log.details}</p>
                </div>
                <span className="text-[11px] text-slate-500 whitespace-nowrap">{log.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PIN Prompt Modal when switching admin */}
      {pinPromptAdminId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmPinSwitch}
            className="w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-indigo-500/40 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Enter Admin PIN</h3>
                <p className="text-xs text-slate-400">
                  Switching to {admins.find((a) => a.id === pinPromptAdminId)?.name}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                PIN Code (Default: Admin 1 = 0675, Admin 2 = 0021)
              </label>
              <input
                type="password"
                maxLength={6}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="****"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-center text-xl tracking-widest focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-400 font-semibold">{pinError}</p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPinPromptAdminId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md"
              >
                Unlock & Switch
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Withdrawal Rejection Modal with Safe In-App Confirmation */}
      {rejectModalWithdrawalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                ودڈرا درخواست مسترد کریں (Reject Withdrawal)
              </h4>
              <button
                type="button"
                onClick={() => setRejectModalWithdrawalId(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              درخواست مسترد کرنے کی صورت میں کٹوتی شدہ رقم خود بخود فوری طور پر صارف کے والٹ میں واپس ریفنڈ ہو جائے گی۔
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">مسترد کرنے کی وجہ (Select Reason):</label>
              <select
                value={rejectReasonText}
                onChange={(e) => setRejectReasonText(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500"
              >
                <option value="اکاؤنٹ کی تفصیلات نامکمل یا غلط ہیں">اکاؤنٹ کی تفصیلات نامکمل یا غلط ہیں</option>
                <option value="اکاؤنٹ ٹائٹل اور نمبر آپس میں میچ نہیں ہوئے">اکاؤنٹ ٹائٹل اور نمبر آپس میں میچ نہیں ہوئے</option>
                <option value="جاز کیش / ایزی پیسہ والٹ کی یومیہ حد مکمل ہو چکی ہے">جاز کیش / ایزی پیسہ والٹ کی یومیہ حد مکمل ہو چکی ہے</option>
                <option value="اشتہارات دیکھنے کی یومیہ شرائط نامکمل ہیں">اشتہارات دیکھنے کی یومیہ شرائط نامکمل ہیں</option>
                <option value="صارف سے رابطہ ممکن نہیں ہو سکا">صارف سے رابطہ ممکن نہیں ہو سکا</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  rejectUserWithdrawal(rejectModalWithdrawalId, rejectReasonText);
                  setRejectModalWithdrawalId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                مسترد کریں اور رقم واپس بھیجیں
              </button>
              <button
                type="button"
                onClick={() => setRejectModalWithdrawalId(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                منسوخ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
