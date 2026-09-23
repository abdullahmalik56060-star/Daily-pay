import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  PlayCircle,
  Calendar,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  Youtube,
  Radio,
  LifeBuoy,
  Lock,
  BellRing,
  LogOut,
  User,
  UserPlus,
  LogIn,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openDepositModal: () => void;
  openWithdrawModal: () => void;
  openHowItWorks: () => void;
  openSocialLinksModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openDepositModal,
  openWithdrawModal,
  openHowItWorks,
  openSocialLinksModal,
}) => {
  const {
    balance,
    activePlan,
    dailyAds,
    simulateNextDay,
    whatsappLink,
    whatsappChannelLink,
    youtubeChannelLink,
    appReserveBalance,
    isAdminLoggedIn,
    unreadAlertsCount,
    adminLogout,
    admins,
    currentAdminId,
    withdrawals,
    user,
    isLoggedIn,
    logoutUser,
    openAuthModal,
    loginBonus,
  } = useApp();

  const activeAdmin = admins.find((a) => a.id === currentAdminId) || admins[0];

  const adsWatchedCount = (dailyAds.ad1Watched ? 1 : 0) + (dailyAds.ad2Watched ? 1 : 0);
  const pendingWithdrawalsCount = withdrawals.filter(
    (w) => w.status === 'pending' || w.status === 'processing'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <span className="text-xl font-extrabold tracking-tighter">DP</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  DailyPay
                </span>
                <span className="hidden xs:inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Pakistan Ads & Earning Platform</p>
            </div>
          </div>

          {/* Center Info: Active Plan & Daily Ads status */}
          <div className="hidden md:flex items-center gap-3">
            {activePlan ? (
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-semibold">{activePlan.planName}</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400 font-medium">Rs {activePlan.dailyEarnings}/day</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{activePlan.daysRemaining}d left</span>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('plans')}
                className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/20 transition-all font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" />
                No Active Plan - Activate for Rs 150
              </button>
            )}

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <PlayCircle className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-400">Today Ads:</span>
              <span className={`font-bold ${adsWatchedCount === 2 ? 'text-emerald-400' : 'text-blue-400'}`}>
                {adsWatchedCount}/2 Completed
              </span>
            </div>
          </div>

          {/* Right Actions & Balance */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wallet Balance Widget */}
            <div className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Balance</p>
                <p className="text-sm sm:text-base font-extrabold text-white leading-tight">
                  <span className="text-emerald-400 text-xs font-semibold mr-1">Rs</span>
                  {balance.toLocaleString()}
                </p>
              </div>
            </div>

            {/* User Account / Auth Actions */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs shadow-inner">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                  title={`Logged in as ${user.name} (${user.email || user.phone}). Click to view or switch account.`}
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-[11px]">
                    {user.firstName ? user.firstName.charAt(0) : user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline font-bold text-white max-w-[100px] truncate">
                    {user.firstName || user.name.split(' ')[0]}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={logoutUser}
                  title="Log Out (لاگ آؤٹ کریں)"
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                  <span className="hidden md:inline text-[9px] px-1 py-0.2 rounded-full bg-slate-950/20 font-black">
                    +Rs {loginBonus}
                  </span>
                </button>
              </div>
            )}

            {/* Quick Action: Deposit */}
            <button
              id="nav-deposit-btn"
              onClick={openDepositModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              <ArrowDownCircle className="w-4 h-4" />
              Deposit
            </button>

            {/* Quick Action: Withdraw */}
            <button
              id="nav-withdraw-btn"
              onClick={openWithdrawModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all active:scale-95"
            >
              <ArrowUpCircle className="w-4 h-4" />
              Withdraw
            </button>

            {/* Simulate Next Day Tool (Convenient demo testing) */}
            <button
              id="nav-next-day-btn"
              onClick={simulateNextDay}
              title="Fast-forward to tomorrow to reset daily ads and check-in"
              className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700/60 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden lg:inline text-[11px]">Next Day</span>
            </button>

            {/* Direct WhatsApp Channel Link Shortcut */}
            <a
              href={whatsappChannelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1.5"
              title="Official WhatsApp Channel (واٹس ایپ چینل فالو کریں)"
            >
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="hidden xl:inline text-xs font-bold text-emerald-300">WA Channel</span>
            </a>

            {/* Direct WhatsApp Link Shortcut */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all"
              title="Official WhatsApp Support"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* Direct YouTube Channel Link Shortcut */}
            <a
              href={youtubeChannelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-all"
              title="Official YouTube Channel"
            >
              <Youtube className="w-4 h-4" />
            </a>

            {/* How It Works Button */}
            <button
              onClick={openHowItWorks}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              title="How does this platform work?"
            >
              <HelpCircle className="w-4 h-4 text-slate-300" />
            </button>

            {/* Admin Portal Button - Protected & Discreet */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                    activeTab === 'admin'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/20'
                      : 'bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border-indigo-500/40'
                  }`}
                  title="2-Admin Management Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline font-black">{activeAdmin.name.split(' ')[0]} (Admin)</span>
                  <span className="sm:hidden font-bold">Admin</span>
                  {pendingWithdrawalsCount > 0 ? (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-500 text-slate-950 animate-pulse flex items-center gap-0.5">
                      <span>{pendingWithdrawalsCount} WD</span>
                    </span>
                  ) : unreadAlertsCount > 0 ? (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-red-500 text-white animate-pulse">
                      {unreadAlertsCount}
                    </span>
                  ) : null}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    adminLogout();
                    setActiveTab('dashboard');
                  }}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 transition-all"
                  title="Lock Admin Portal & Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('admin')}
                className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  pendingWithdrawalsCount > 0
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm animate-pulse'
                    : 'text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800'
                }`}
                title={
                  pendingWithdrawalsCount > 0
                    ? `Admin: ${pendingWithdrawalsCount} pending withdrawal request(s) awaiting approval!`
                    : 'Admin Security Portal'
                }
              >
                <Lock className={`w-3.5 h-3.5 ${pendingWithdrawalsCount > 0 ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="hidden sm:inline text-[11px]">Admin</span>
                {pendingWithdrawalsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-500 text-slate-950">
                    {pendingWithdrawalsCount} WD
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar border-t border-slate-800/60">
          <button
            id="tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Dashboard
          </button>

          <button
            id="tab-ads"
            onClick={() => setActiveTab('ads')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'ads'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Check Ads Earnings
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'ads' ? 'bg-slate-950/30 text-slate-950' : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {adsWatchedCount}/2
            </span>
          </button>

          <button
            id="tab-plans"
            onClick={() => setActiveTab('plans')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'plans'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Subscription Plans
          </button>

          <button
            id="tab-deposit"
            onClick={() => setActiveTab('deposit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'deposit'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Deposit & Bonus
          </button>

          <button
            id="tab-withdraw"
            onClick={() => setActiveTab('withdraw')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'withdraw'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Withdraw (JazzCash / OPay)
          </button>

          <button
            id="tab-history"
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Transaction History
          </button>

          <button
            id="tab-bonus"
            onClick={() => setActiveTab('bonus')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'bonus'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Bonuses & Referrals
          </button>

          <button
            id="tab-support"
            onClick={() => setActiveTab('support')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'support'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            Support Team (کسٹمر سپورٹ)
          </button>

          {isAdminLoggedIn && (
            <button
              id="tab-admin"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>2 Admins (ایڈمن پورٹل)</span>
              {unreadAlertsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-red-500 text-white font-black animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold">
                Rs {appReserveBalance.toLocaleString()}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
