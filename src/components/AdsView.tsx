import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PLANS } from '../data/mockData';
import { AdCampaign } from '../types';
import { AdWatchModal } from './AdWatchModal';
import { AdPlacementManagerModal } from './AdPlacementManagerModal';
import {
  PlayCircle,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  Zap,
  RotateCcw,
  Calendar,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Settings,
  Edit3,
  Tv,
  Layers,
  Youtube,
  Image as ImageIcon,
} from 'lucide-react';

interface AdsViewProps {
  onGoToPlans: () => void;
}

export const AdsView: React.FC<AdsViewProps> = ({ onGoToPlans }) => {
  const { activePlan, dailyAds, simulateNextDay, getCampaignForSlot } = useApp();

  const [activeAdCampaign, setActiveAdCampaign] = useState<{
    adNumber: 1 | 2;
    campaign: AdCampaign;
    reward: number;
  } | null>(null);

  const [isAdManagerOpen, setIsAdManagerOpen] = useState<boolean>(false);
  const [managerSlot, setManagerSlot] = useState<1 | 2>(1);

  const slot1Campaign = getCampaignForSlot(1);
  const slot2Campaign = getCampaignForSlot(2);

  // Rewards based on active plan
  const ad1Reward = activePlan ? activePlan.ad1Reward : 25;
  const ad2Reward = activePlan ? activePlan.ad2Reward : 25;
  const dailyTarget = activePlan ? activePlan.dailyEarnings : 50;

  const todayEarned =
    (dailyAds.ad1Watched ? ad1Reward : 0) + (dailyAds.ad2Watched ? ad2Reward : 0);

  const completedCount = (dailyAds.ad1Watched ? 1 : 0) + (dailyAds.ad2Watched ? 1 : 0);

  const handleStartAd = (adNumber: 1 | 2) => {
    if (!activePlan) {
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

  const handleOpenManagerForSlot = (slot: 1 | 2) => {
    setManagerSlot(slot);
    setIsAdManagerOpen(true);
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
            Daily Sponsored Ads Task
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Watch today's 2 short ads (10 seconds each) to credit your wallet instantly. Earnings are determined by your
            active 2-month plan.
          </p>
        </div>

        {/* Status Widget */}
        <div className="mt-6 sm:mt-0 sm:absolute sm:top-8 sm:right-8 flex flex-col items-start sm:items-end gap-2">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left sm:text-right">
            <span className="text-xs text-slate-400">Today's Ads Revenue</span>
            <p className="text-xl font-black text-emerald-400">
              Rs {todayEarned} <span className="text-xs text-slate-400">/ Rs {activePlan ? dailyTarget : 0}</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Progress: <strong>{completedCount} of 2 Ads</strong>
            </p>
          </div>

          <button
            onClick={simulateNextDay}
            className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-semibold px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            Simulate Next Day (Test 2 New Ads)
          </button>
        </div>
      </div>

      {/* Ad Placement Architecture Card (YouTube Ads System) */}
      <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-950 to-red-950/30 border border-red-500/30 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold">
              <Youtube className="w-3.5 h-3.5" />
              YouTube Ads Link System (یوٹیوب ایڈز کا لنک لگانے کی جگہ)
            </div>
            <h3 className="text-lg font-black text-white">
              Daily 2 YouTube Ads Management (یوٹیوب ویڈیو لنکس سیٹ کریں)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              صارفین کے لیے روزانہ کے 2 یوٹیوب ایڈز کا لنک یہاں لگائیں۔ آپ یوٹیوب ویڈیو کا لنک (URL) پیسٹ کریں اور محفوظ کریں، صارف 10 سیکنڈ تک ویڈیو دیکھ کر سوال کا جواب دے گا اور ارننگ حاصل کرے گا۔
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="text-slate-400">Current YouTube Ads:</span>
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

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-open-ad-manager"
              type="button"
              onClick={() => handleOpenManagerForSlot(1)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/20 transition-all flex items-center gap-2 active:scale-95"
            >
              <Youtube className="w-4 h-4 text-white" />
              Paste YouTube Ad Links (یوٹیوب ایڈ لگائیں)
            </button>
          </div>
        </div>
      </div>

      {/* No Plan Warning Banner */}
      {!activePlan && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-300">No Active Earning Plan Detected</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Subscribe to Plan 1 (Rs 150 = Rs 50/day), Plan 2 (Rs 300 = Rs 100/day), or Plan 3 (Rs 450 = Rs 150/day)
                to unlock and earn from daily ads for 2 months.
              </p>
            </div>
          </div>

          <button
            onClick={onGoToPlans}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all whitespace-nowrap shadow-md"
          >
            Choose a Plan Now
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
              ? 'bg-slate-900/40 border-slate-800'
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

            {/* Placed Ad Sponsor Info Badge */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-red-500/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
                  <Youtube className="w-3 h-3 text-red-500" />
                  YouTube Ad Link in Slot #1
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenManagerForSlot(1)}
                  className="text-[11px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 hover:underline"
                >
                  <Edit3 className="w-3 h-3" />
                  Paste / Change YouTube Ad
                </button>
              </div>
              <p className="text-xs font-extrabold text-white truncate">
                {slot1Campaign.title}
              </p>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {slot1Campaign.videoUrl || slot1Campaign.tagline}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400">Ad #1 Reward:</span>
                <p className="text-xl font-black text-emerald-400">Rs {ad1Reward} PKR</p>
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
            ) : !activePlan ? (
              <button
                onClick={onGoToPlans}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                Activate Plan to Unlock Ad #1
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
              ? 'bg-slate-900/40 border-slate-800'
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

            {/* Placed Ad Sponsor Info Badge */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Youtube className="w-3 h-3 text-red-500" />
                  YouTube Ad Link in Slot #2
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenManagerForSlot(2)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline"
                >
                  <Edit3 className="w-3 h-3" />
                  Paste / Change YouTube Ad
                </button>
              </div>
              <p className="text-xs font-extrabold text-white truncate">
                {slot2Campaign.title}
              </p>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {slot2Campaign.videoUrl || slot2Campaign.tagline}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400">Ad #2 Reward:</span>
                <p className="text-xl font-black text-emerald-400">Rs {ad2Reward} PKR</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400">Daily Total:</span>
                <p className="text-xs font-semibold text-slate-200">Rs {dailyTarget} / Day</p>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-800">
            {dailyAds.ad2Watched ? (
              <div className="py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs font-bold text-emerald-400">
                ✓ Rs {ad2Reward} Added to Balance Today
              </div>
            ) : !activePlan ? (
              <button
                onClick={onGoToPlans}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                Activate Plan to Unlock Ad #2
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
            Your earnings have been added to your wallet. You can withdraw anytime via JazzCash, Easypaisa, OPay, or Card.
            Next 2 ads will be available tomorrow.
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
                <th className="pb-3">Daily Ads</th>
                <th className="pb-3">Per Ad Reward</th>
                <th className="pb-3">Daily Earnings</th>
                <th className="pb-3">30 Days (1 Mo)</th>
                <th className="pb-3 text-right">60 Days (Total)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {PLANS.map((p) => {
                const isSelected = activePlan?.planId === p.id;
                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-emerald-500/10 font-medium text-emerald-300' : 'text-slate-300'
                    }`}
                  >
                    <td className="py-3.5 font-bold flex items-center gap-2">
                      {p.name}
                      {isSelected && (
                        <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-extrabold">
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-slate-200">Rs {p.price}</td>
                    <td className="py-3.5">2 Ads/day</td>
                    <td className="py-3.5 font-mono">
                      Rs {p.ad1Reward} + Rs {p.ad2Reward}
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

      {/* Ad Placement & Setup Manager Modal (Jahan Ad Lagany Hain) */}
      {isAdManagerOpen && (
        <AdPlacementManagerModal
          initialSlot={managerSlot}
          onClose={() => setIsAdManagerOpen(false)}
          onTestWatchAd={(campaign, slot) => {
            setIsAdManagerOpen(false);
            setActiveAdCampaign({
              adNumber: slot,
              campaign,
              reward: slot === 1 ? ad1Reward : ad2Reward,
            });
          }}
        />
      )}
    </div>
  );
};
