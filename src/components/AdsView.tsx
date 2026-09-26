import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PLANS } from '../data/mockData';
import { AdCampaign } from '../types';
import { AdWatchModal } from './AdWatchModal';
import {
  PlayCircle,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  Zap,
  RotateCcw,
  AlertTriangle,
  TrendingUp,
  Youtube,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';

interface AdsViewProps {
  onGoToPlans: () => void;
}

export const AdsView: React.FC<AdsViewProps> = ({ onGoToPlans }) => {
  const {
    activePlan,
    dailyAds,
    simulateNextDay,
    getCampaignForSlot,
    isLoggedIn,
    openAuthModal,
    showToast,
  } = useApp();

  const [activeAdCampaign, setActiveAdCampaign] = useState<{
    adNumber: 1 | 2;
    campaign: AdCampaign;
    reward: number;
  } | null>(null);

  const slot1Campaign = getCampaignForSlot(1);
  const slot2Campaign = getCampaignForSlot(2);

  // Rewards based on active plan (or 0 / plan estimate if no paid plan)
  const ad1Reward = activePlan ? activePlan.ad1Reward : 25;
  const ad2Reward = activePlan ? activePlan.ad2Reward : 25;
  const dailyTarget = activePlan ? activePlan.dailyEarnings : 0;

  const todayEarned =
    (dailyAds.ad1Watched ? ad1Reward : 0) + (dailyAds.ad2Watched ? ad2Reward : 0);

  const completedCount = (dailyAds.ad1Watched ? 1 : 0) + (dailyAds.ad2Watched ? 1 : 0);

  const handleStartAd = (adNumber: 1 | 2) => {
    if (!isLoggedIn) {
      openAuthModal('signup');
      return;
    }

    // User requirement: "Jb plan acctive na kr ly tb tk adds nna dak sakhy"
    if (!activePlan) {
      showToast('ایڈز دیکھنے اور روزانہ ارننگ حاصل کرنے کے لیے پہلے کوئی پلان ایکٹو کریں! (Please activate a plan first)');
      onGoToPlans();
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
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
            <PlayCircle className="w-3.5 h-3.5" />
            Check Daily Ads Earnings (Strictly 2 Ads Per Day)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Daily Sponsored Ads Task (روزانہ ایڈز ٹاسک)
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Watch today's 2 sponsored video ads (10 seconds each) to credit your wallet instantly. Complete both tasks daily to claim your earnings.
          </p>
        </div>

        {/* Status Widget */}
        <div className="mt-6 sm:mt-0 sm:absolute sm:top-8 sm:right-8 flex flex-col items-start sm:items-end gap-2">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left sm:text-right">
            <span className="text-xs text-slate-400">Today's Ads Revenue</span>
            <p className="text-xl font-black text-emerald-400">
              Rs {todayEarned} <span className="text-xs text-slate-400">/ Rs {dailyTarget}</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Progress: <strong>{completedCount} of 2 Ads</strong>
            </p>
          </div>

          <button
            onClick={simulateNextDay}
            className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-semibold px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 transition-all"
            title="Fast-forward to test tomorrow's reset"
          >
            <RotateCcw className="w-3 h-3" />
            Simulate Next Day (Test 2 New Ads)
          </button>
        </div>
      </div>

      {/* Verified YouTube Ads Architecture Banner (Clean Read-Only for Users) */}
      <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-950 to-red-950/30 border border-red-500/30 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold">
              <Youtube className="w-3.5 h-3.5" />
              Verified Daily YouTube Ads (100% تصدیق شدہ ایڈز)
            </div>
            <h3 className="text-lg font-black text-white">
              Daily 2 Sponsored Ads (صرف 10 سیکنڈز ویڈیو دیکھیں اور کمائیں)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              ہر ایڈ کو 10 سیکنڈ تک دیکھیں، ویڈیو مکمل ہونے پر ایک آسان سوال کا جواب دیں اور رقم فوری طور پر اپنے اکاؤنٹ میں حاصل کریں۔
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="text-slate-400">Today's Sponsored Ads:</span>
              <span className="px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-300 font-semibold truncate max-w-xs flex items-center gap-1">
                <Youtube className="w-3 h-3 text-red-500" />
                Slot 1: {slot1Campaign.title}
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold truncate max-w-xs flex items-center gap-1">
                <Youtube className="w-3 h-3 text-red-500" />
                Slot 2: {slot2Campaign.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-center">
              <span className="text-slate-400 block text-[10px]">Today's Status</span>
              <span className={`font-black text-xs ${completedCount === 2 ? 'text-emerald-400' : 'text-blue-400'}`}>
                {completedCount === 2 ? '✓ 2 of 2 Completed' : `${completedCount}/2 Completed`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Notice if Not Logged In */}
      {!isLoggedIn && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Sparkles className="w-4 h-4" />
              Sign Up or Login to Earn
            </div>
            <h4 className="text-sm font-bold text-white">
              ایڈز دیکھ کر ارننگ کرنے کے لیے سائن اپ یا لاگ ان کریں!
            </h4>
            <p className="text-xs text-slate-300">
              نیا اکاؤنٹ بنانے پر 25 روپے فوری ویلکم بونس ملے گا۔
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openAuthModal('signup')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up & Get Rs 25
            </button>
            <button
              onClick={() => openAuthModal('login')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
            >
              Login
            </button>
          </div>
        </div>
      )}

      {/* Plan Required Gate Banner if Logged In but No Active Plan */}
      {isLoggedIn && !activePlan && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border border-amber-500/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              پلان ایکٹو کرنا لازمی ہے (Plan Required to Watch Ads)
            </div>
            <h4 className="text-base sm:text-lg font-black text-white">
              جب تک آپ پلان ایکٹو نہیں کریں گے تب تک ایڈز نہیں دیکھ سکتے!
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              روزانہ کے 2 ایڈز دیکھنے اور روزانہ 50 روپے، 100 روپے یا 150 روپے کی ارننگ حاصل کرنے کیلئے نیچے دیے گئے پلانز (150 روپے، 300 روپے یا 450 روپے) میں سے کوئی ایک پلان ایکٹو کریں۔
            </p>
          </div>

          <button
            onClick={onGoToPlans}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0 active:scale-95"
          >
            <Zap className="w-4 h-4 fill-current" />
            ابھی پلان منتخب اور ایکٹو کریں (Select Plan)
          </button>
        </div>
      )}

      {/* 2 Ads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ad #1 Card */}
        <div
          className={`rounded-2xl p-6 border transition-all ${
            dailyAds.ad1Watched
              ? 'bg-slate-900/60 border-emerald-500/40'
              : !activePlan
              ? 'bg-slate-900/80 border-amber-500/30'
              : 'bg-slate-900 border-slate-700 hover:border-emerald-500/60 shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Task 1 of 2
            </span>

            {dailyAds.ad1Watched ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed
              </span>
            ) : !activePlan ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                <Lock className="w-3.5 h-3.5" />
                Locked (پلان درکار ہے)
              </span>
            ) : (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                10 Seconds Ad
              </span>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-extrabold text-white">Daily Sponsored Ad #1</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Watch this 10-second sponsor showcase and answer a quick human verification question to claim your reward.
            </p>

            {/* Placed Ad Sponsor Info Badge (Read-Only) */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-red-500/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
                  <Youtube className="w-3 h-3 text-red-500" />
                  Official Sponsored Video
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  10s Duration
                </span>
              </div>
              <p className="text-xs font-extrabold text-white truncate">
                {slot1Campaign.title}
              </p>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {slot1Campaign.brand} • {slot1Campaign.tagline}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400">Ad #1 Reward:</span>
                <p className="text-xl font-black text-emerald-400">
                  {activePlan ? `Rs ${ad1Reward} PKR` : 'Rs 25 - Rs 75 PKR'}
                </p>
                {!activePlan && (
                  <span className="text-[10px] text-amber-400 font-semibold block">
                    (پلان ایکٹو کرنے پر فعال ہوگا)
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400">Credit Destination:</span>
                <p className="text-xs font-semibold text-slate-200">Main Wallet Balance</p>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-800">
            {dailyAds.ad1Watched ? (
              <div className="py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs font-bold text-emerald-400">
                ✓ Rs {ad1Reward} Added to Balance Today
              </div>
            ) : !isLoggedIn ? (
              <button
                onClick={() => openAuthModal('signup')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up / Login to Watch Ad #1
              </button>
            ) : !activePlan ? (
              <button
                onClick={onGoToPlans}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Lock className="w-4 h-4" />
                پہلے پلان ایکٹو کریں (Activate Plan to Watch)
              </button>
            ) : (
              <button
                id="btn-watch-ad-1"
                onClick={() => handleStartAd(1)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <PlayCircle className="w-4 h-4" />
                Watch Ad #1 (Earn Rs {ad1Reward})
              </button>
            )}
          </div>
        </div>

        {/* Ad #2 Card */}
        <div
          className={`rounded-2xl p-6 border transition-all ${
            dailyAds.ad2Watched
              ? 'bg-slate-900/60 border-emerald-500/40'
              : !activePlan
              ? 'bg-slate-900/80 border-amber-500/30'
              : 'bg-slate-900 border-slate-700 hover:border-emerald-500/60 shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Task 2 of 2
            </span>

            {dailyAds.ad2Watched ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed
              </span>
            ) : !activePlan ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                <Lock className="w-3.5 h-3.5" />
                Locked (پلان درکار ہے)
              </span>
            ) : (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                10 Seconds Ad
              </span>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-extrabold text-white">Daily Sponsored Ad #2</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete your second daily task to earn the remaining half of your guaranteed daily plan earnings.
            </p>

            {/* Placed Ad Sponsor Info Badge (Read-Only) */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Youtube className="w-3 h-3 text-red-500" />
                  Official Sponsored Video
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  10s Duration
                </span>
              </div>
              <p className="text-xs font-extrabold text-white truncate">
                {slot2Campaign.title}
              </p>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {slot2Campaign.brand} • {slot2Campaign.tagline}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400">Ad #2 Reward:</span>
                <p className="text-xl font-black text-emerald-400">
                  {activePlan ? `Rs ${ad2Reward} PKR` : 'Rs 25 - Rs 75 PKR'}
                </p>
                {!activePlan && (
                  <span className="text-[10px] text-amber-400 font-semibold block">
                    (پلان ایکٹو کرنے پر فعال ہوگا)
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400">Daily Total:</span>
                <p className="text-xs font-semibold text-slate-200">
                  {activePlan ? `Rs ${dailyTarget} / Day` : 'Rs 50 - 150 / Day'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-800">
            {dailyAds.ad2Watched ? (
              <div className="py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs font-bold text-emerald-400">
                ✓ Rs {ad2Reward} Added to Balance Today
              </div>
            ) : !isLoggedIn ? (
              <button
                onClick={() => openAuthModal('signup')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up / Login to Watch Ad #2
              </button>
            ) : !activePlan ? (
              <button
                onClick={onGoToPlans}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Lock className="w-4 h-4" />
                پہلے پلان ایکٹو کریں (Activate Plan to Watch)
              </button>
            ) : (
              <button
                id="btn-watch-ad-2"
                onClick={() => handleStartAd(2)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <PlayCircle className="w-4 h-4" />
                Watch Ad #2 (Earn Rs {ad2Reward})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Daily Completion Celebration Banner */}
      {completedCount === 2 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 text-center space-y-3">
          <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Daily Ad Tasks Finished! You Earned Rs {dailyTarget} Today!
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Your earnings have been added to your wallet. You can withdraw anytime via JazzCash, Easypaisa, OPay, or Card. Next 2 ads will be available tomorrow.
          </p>

          <div className="pt-2">
            <button
              onClick={simulateNextDay}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-400 text-xs font-bold border border-slate-700 transition-all inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Simulate Tomorrow's Reset (Demo Mode)
            </button>
          </div>
        </div>
      )}

      {/* Check Adds Earnings Projection Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-extrabold text-white">
              Check Ads Earnings Breakdown by Plan
            </h3>
          </div>
          <span className="text-xs text-slate-400">2 Months (60 Days) Lifecycle</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Subscription Plan</th>
                <th className="pb-3">Cost</th>
                <th className="pb-3">Ads / Day</th>
                <th className="pb-3">Daily Earnings</th>
                <th className="pb-3">Monthly (30 Days)</th>
                <th className="pb-3 text-right">Total (60 Days)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {PLANS.map((p) => {
                const isCurrent = activePlan?.planId === p.id;
                return (
                  <tr key={p.id} className={isCurrent ? 'bg-emerald-500/10' : ''}>
                    <td className="py-3.5 font-bold text-white flex items-center gap-2">
                      {p.name}
                      {isCurrent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold border border-emerald-500/30">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-slate-300">Rs {p.price}</td>
                    <td className="py-3.5 text-slate-300">
                      2 Ads ({p.ad1Reward} + {p.ad2Reward} Rs)
                    </td>
                    <td className="py-3.5 font-bold text-emerald-400">Rs {p.dailyEarnings}/day</td>
                    <td className="py-3.5 text-slate-300">Rs {(p.dailyEarnings * 30).toLocaleString()}</td>
                    <td className="py-3.5 text-right font-black text-emerald-400">
                      Rs {p.totalReturn.toLocaleString()} PKR
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
