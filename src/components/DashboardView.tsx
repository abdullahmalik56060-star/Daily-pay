import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PLANS, SPONSORED_ADS } from '../data/mockData';
import { AdCampaign } from '../types';
import { AdWatchModal } from './AdWatchModal';
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  PlayCircle,
  CheckCircle2,
  Lock,
  Sparkles,
  TrendingUp,
  Clock,
  Zap,
  ShieldCheck,
  Award,
  ChevronRight,
  HelpCircle,
  MessageCircle,
  Youtube,
  Radio,
  LifeBuoy,
  Megaphone,
  User,
  UserPlus,
  LogIn,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenHowItWorks: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenHowItWorks,
}) => {
  const {
    balance,
    totalEarned,
    totalDeposited,
    totalWithdrawn,
    activePlan,
    dailyAds,
    transactions,
    dailyCheckInClaimed,
    claimDailyCheckIn,
    getCampaignForSlot,
    whatsappLink,
    whatsappLink2,
    whatsappChannelLink,
    youtubeChannelLink,
    adminAnnouncement,
    user,
    isLoggedIn,
    openAuthModal,
    financialSummary,
    openFinanceLedger,
  } = useApp();

  const [activeAdCampaign, setActiveAdCampaign] = useState<{
    adNumber: 1 | 2;
    campaign: AdCampaign;
    reward: number;
  } | null>(null);

  const slot1Campaign = getCampaignForSlot(1);
  const slot2Campaign = getCampaignForSlot(2);

  const ad1Reward = activePlan ? activePlan.ad1Reward : 25;
  const ad2Reward = activePlan ? activePlan.ad2Reward : 25;
  const dailyTarget = activePlan ? activePlan.dailyEarnings : 50;

  const todayEarned =
    (dailyAds.ad1Watched ? ad1Reward : 0) + (dailyAds.ad2Watched ? ad2Reward : 0);
  const adsCompleted = (dailyAds.ad1Watched ? 1 : 0) + (dailyAds.ad2Watched ? 1 : 0);

  const handleStartAd = (adNumber: 1 | 2) => {
    if (!activePlan) {
      onNavigate('plans');
      return;
    }

    const selectedCampaign = getCampaignForSlot(adNumber);
    const reward = adNumber === 1 ? activePlan.ad1Reward : activePlan.ad2Reward;

    setActiveAdCampaign({
      adNumber,
      campaign: selectedCampaign,
      reward,
    });
  };

  return (
    <div className="space-y-8">
      {/* Broadcast Announcement from Admin */}
      {adminAnnouncement && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/70 via-slate-900 to-indigo-950/70 border border-teal-500/30 text-teal-200 text-xs sm:text-sm flex items-start gap-3 shadow-lg animate-in fade-in duration-300">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
            <Megaphone className="w-4 h-4 animate-pulse" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs text-white uppercase tracking-wider">
                ایڈمن کا خصوصی اعلان (Official Notice)
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-teal-500 text-slate-950">
                LATEST
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">{adminAnnouncement}</p>
          </div>
        </div>
      )}

      {/* Welcome & Balance Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Wallet & Quick Actions Card */}
        <div className="lg:col-span-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                  Earning Dashboard
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
                  {user.firstName || user.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal(isLoggedIn ? 'signup' : 'login')}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg transition-all"
                  title="Login or Sign Up with Email, Phone, Password, and Name"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>{isLoggedIn ? 'New Account / Login' : 'Login / Sign Up'}</span>
                </button>
                <button
                  onClick={onOpenHowItWorks}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-all"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Guide
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400 font-medium">Available Wallet Balance</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-extrabold text-emerald-400">Rs</span>
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {balance.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-slate-400">PKR</span>
              </div>
            </div>

            {/* Daily Check-in Streak Claim */}
            {!dailyCheckInClaimed && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">Daily Bonus Ready (+Rs 5 PKR)</span>
                </div>
                <button
                  onClick={claimDailyCheckIn}
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all shadow-sm active:scale-95"
                >
                  Claim Free Rs 5
                </button>
              </div>
            )}

            {/* Demo Mode Notice when no plan is active */}
            {!activePlan && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-300">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Demo Mode:</strong> Login bonus Rs 25 active. جب تک پلان منتخب نہ کریں ودڈرا نہیں ہوگا (Withdrawal locked until a plan is chosen).
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('plans')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] shrink-0 transition-all ml-2"
                >
                  Choose Plan
                </button>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 mt-4 border-t border-slate-800">
            <button
              onClick={onOpenDeposit}
              className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <ArrowDownCircle className="w-4 h-4" />
              Deposit (+10% Bonus)
            </button>

            <button
              onClick={onOpenWithdraw}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <ArrowUpCircle className="w-4 h-4" />
              Withdraw Funds
            </button>

            <button
              onClick={() => onNavigate('plans')}
              className="col-span-2 sm:col-span-1 py-3 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-teal-400 font-bold text-xs border border-slate-700/60 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {activePlan ? 'Manage Plans' : 'Buy Earning Plan'}
            </button>
          </div>
        </div>

        {/* Active Plan Status Card */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Current Subscription
              </span>
              {activePlan ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ACTIVE
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  NO PLAN
                </span>
              )}
            </div>

            {activePlan ? (
              <div className="space-y-3">
                <h3 className="text-xl font-extrabold text-white">{activePlan.planName}</h3>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Daily Earning:</span>
                    <span className="font-bold text-emerald-400">Rs {activePlan.dailyEarnings} / Day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Validity:</span>
                    <span className="font-semibold text-slate-200">2 Months (60 Days)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Days Remaining:</span>
                    <span className="font-bold text-teal-400">{activePlan.daysRemaining} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tasks:</span>
                    <span className="font-semibold text-slate-200">2 Ads Per Day</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white">Start Earning Today</h3>
                <p className="text-xs text-slate-400">
                  Choose Plan 1 (Rs 150), Plan 2 (Rs 300), or Plan 3 (Rs 450) to unlock 2 daily ads for 60 days.
                </p>
                <button
                  onClick={() => onNavigate('plans')}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-4 h-4" />
                  View All 3 Plans
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Payment Channels:</span>
            <span className="font-semibold text-slate-200">JazzCash • OPay • Card</span>
          </div>
        </div>
      </div>

      {/* Today's 2 Ads Task Checklist Highlight */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-extrabold text-white">
                Today's Ad Tasks (Strictly 2 Ads Per Day)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {activePlan
                ? `Earn Rs ${dailyAds.ad1Watched ? 0 : ad1Reward} from Ad #1 + Rs ${
                    dailyAds.ad2Watched ? 0 : ad2Reward
                  } from Ad #2`
                : 'Subscribe to a plan to unlock today’s 2 sponsored video ads.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400">Earned Today: </span>
              <strong className="text-emerald-400">Rs {todayEarned}</strong>
              <span className="text-slate-500"> / Rs {activePlan ? dailyTarget : 0}</span>
            </div>
            <button
              onClick={() => onNavigate('ads')}
              className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-xl transition-all"
            >
              2 Ads Setup
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2 Ad Cards Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ad 1 Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <div className="space-y-1 max-w-[65%]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Ad 1 of 2
                </span>
                <span className="text-xs font-extrabold text-white truncate">
                  {slot1Campaign.brand}: {slot1Campaign.title}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Reward: <strong className="text-emerald-400">Rs {ad1Reward} PKR</strong> (10s view)
              </p>
            </div>

            {dailyAds.ad1Watched ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </span>
            ) : !activePlan ? (
              <button
                onClick={() => onNavigate('plans')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1"
              >
                <Lock className="w-3.5 h-3.5" />
                Locked
              </button>
            ) : (
              <button
                onClick={() => handleStartAd(1)}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <PlayCircle className="w-4 h-4" />
                Watch Ad #1
              </button>
            )}
          </div>

          {/* Ad 2 Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <div className="space-y-1 max-w-[65%]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Ad 2 of 2
                </span>
                <span className="text-xs font-extrabold text-white truncate">
                  {slot2Campaign.brand}: {slot2Campaign.title}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Reward: <strong className="text-emerald-400">Rs {ad2Reward} PKR</strong> (10s view)
              </p>
            </div>

            {dailyAds.ad2Watched ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </span>
            ) : !activePlan ? (
              <button
                onClick={() => onNavigate('plans')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1"
              >
                <Lock className="w-3.5 h-3.5" />
                Locked
              </button>
            ) : (
              <button
                onClick={() => handleStartAd(2)}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <PlayCircle className="w-4 h-4" />
                Watch Ad #2
              </button>
            )}
          </div>
        </div>

        {/* Support & Official Channels Quick Banner */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Daily Pay 24/7 Support Desk (کسٹمر سپورٹ ٹیم)</p>
              <p className="text-[11px] text-slate-400">
                ڈپازٹ، ودڈرا یا یوٹیوب ایڈز کے متعلق کوئی بھی سوال پوچھیں یا فوری واٹس ایپ پر رابطہ کریں۔
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <a
              href={whatsappChannelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-black text-xs transition-all flex items-center gap-1.5 shadow-sm"
              title="Join Official WhatsApp Channel (واٹس ایپ چینل فالو کریں)"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>WhatsApp Channel (چینل)</span>
            </a>
            <button
              onClick={() => onNavigate('support')}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              Ask Support Team
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs transition-all flex items-center gap-1.5"
              title="Instant WhatsApp Helpline 1: 03225290908"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp 1 (03225290908)
            </a>
            <a
              href={whatsappLink2}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold text-xs transition-all flex items-center gap-1.5"
              title="Second WhatsApp Helpline: 03098899212"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp 2 (03098899212)
            </a>
            <a
              href={youtubeChannelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <Youtube className="w-3.5 h-3.5" />
              YouTube Channel
            </a>
          </div>
        </div>
      </div>

      {/* Financial Transparency & Tracking System Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-emerald-950/30 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  فنانشل مانیٹرنگ و ٹرانسپیرنسی سسٹم
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live System
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ڈپازٹ اور ودڈرا کا مکمل حساب: آپ کا ذاتی بیلنس اور لوگوں کے کل موصول شدہ پے آؤٹس
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openFinanceLedger('deposit')}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1"
            >
              <ArrowDownCircle className="w-3.5 h-3.5" />
              <span>ڈپازٹ سسٹم</span>
            </button>
            <button
              type="button"
              onClick={() => openFinanceLedger('withdraw')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1"
            >
              <ArrowUpCircle className="w-3.5 h-3.5" />
              <span>لوگوں کا ودڈرا</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: User's Deposit */}
          <div
            onClick={() => openFinanceLedger('deposit')}
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer transition-all"
          >
            <span className="text-[11px] text-slate-400 font-medium">آپ کا کل ڈپازٹ</span>
            <p className="text-lg font-black text-white mt-1">
              <span className="text-xs text-emerald-400 font-bold mr-1">Rs</span>
              {financialSummary.userTotalDeposited.toLocaleString()}
            </p>
            <span className="text-[10px] text-emerald-400">
              {financialSummary.userDepositCount} بار جمع کیا • +Rs {financialSummary.userTotalBonusOnDeposits} بونس
            </span>
          </div>

          {/* Card 2: Platform Total Deposited */}
          <div
            onClick={() => openFinanceLedger('deposit')}
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-teal-500/40 cursor-pointer transition-all"
          >
            <span className="text-[11px] text-slate-400 font-medium">لوگوں کا کل ڈپازٹ فنڈ</span>
            <p className="text-lg font-black text-teal-300 mt-1">
              <span className="text-xs font-bold mr-1">Rs</span>
              {financialSummary.platformTotalDeposited.toLocaleString()}
            </p>
            <span className="text-[10px] text-slate-400">
              {financialSummary.platformActiveDepositors.toLocaleString()}+ تصدیق شدہ صارفین
            </span>
          </div>

          {/* Card 3: User's Withdrawn */}
          <div
            onClick={() => openFinanceLedger('withdraw')}
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer transition-all"
          >
            <span className="text-[11px] text-slate-400 font-medium">آپ کا کل ودڈرا</span>
            <p className="text-lg font-black text-white mt-1">
              <span className="text-xs text-emerald-400 font-bold mr-1">Rs</span>
              {financialSummary.userTotalWithdrawn.toLocaleString()}
            </p>
            <span className="text-[10px] text-emerald-400">
              منظور شدہ: Rs {financialSummary.userCompletedWithdrawn.toLocaleString()}
            </span>
          </div>

          {/* Card 4: How Much People Have Withdrawn */}
          <div
            onClick={() => openFinanceLedger('withdraw')}
            className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/50 to-slate-950 border border-indigo-500/30 hover:border-indigo-500/60 cursor-pointer transition-all"
          >
            <span className="text-[11px] text-indigo-300 font-bold">لوگوں نے کتنا ودڈرا کر لیا</span>
            <p className="text-lg font-black text-white mt-1">
              <span className="text-xs text-emerald-400 font-bold mr-1">Rs</span>
              {financialSummary.platformTotalWithdrawn.toLocaleString()}
            </p>
            <span className="text-[10px] text-emerald-400 font-semibold">
              100% موصول شدہ (5-7 منٹ گارنٹی)
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-xs text-slate-400">Total Lifetime Earned</p>
          <p className="text-xl font-black text-white mt-1">Rs {totalEarned.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-400 font-medium">From ads & bonuses</span>
        </div>

        <div
          onClick={() => openFinanceLedger('deposit')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">Total Deposited</p>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <p className="text-xl font-black text-white mt-1">Rs {totalDeposited.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-400 font-medium">
            پلیٹ فارم کل: Rs {financialSummary.platformTotalDeposited.toLocaleString()}
          </span>
        </div>

        <div
          onClick={() => openFinanceLedger('withdraw')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">Total Withdrawn</p>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <p className="text-xl font-black text-white mt-1">Rs {totalWithdrawn.toLocaleString()}</p>
          <span className="text-[11px] text-indigo-400 font-medium">
            لوگوں نے نکلوایا: Rs {financialSummary.platformTotalWithdrawn.toLocaleString()}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-xs text-slate-400">Active Plan Duration</p>
          <p className="text-xl font-black text-white mt-1">
            {activePlan ? `${activePlan.daysRemaining} / 60 Days` : '0 Days'}
          </p>
          <span className="text-[11px] text-teal-400 font-medium">2-month validity</span>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-white">Recent Transactions</h3>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold"
          >
            View Full Ledger →
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="py-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                    tx.isCredit
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-indigo-500/10 text-indigo-400'
                  }`}
                >
                  {tx.isCredit ? '+' : '-'}
                </div>
                <div>
                  <p className="font-bold text-slate-200">{tx.title}</p>
                  <p className="text-[11px] text-slate-500">{tx.date}</p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`font-black ${
                    tx.isCredit ? 'text-emerald-400' : 'text-slate-200'
                  }`}
                >
                  {tx.isCredit ? '+' : '-'}Rs {tx.amount} PKR
                </p>
                <span className="text-[10px] text-emerald-400 font-medium uppercase">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ad Watch Modal */}
      {activeAdCampaign && (
        <AdWatchModal
          adNumber={activeAdCampaign.adNumber}
          campaign={activeAdCampaign.campaign}
          rewardAmount={activeAdCampaign.reward}
          onClose={() => setActiveAdCampaign(null)}
          onCompleted={() => setActiveAdCampaign(null)}
        />
      )}
    </div>
  );
};
