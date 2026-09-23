import React, { useState } from 'react';
import { PLANS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { PlanId } from '../types';
import {
  Check,
  Zap,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  AlertCircle,
} from 'lucide-react';

interface PlansViewProps {
  onOpenDeposit: () => void;
  onGoToAds: () => void;
}

export const PlansView: React.FC<PlansViewProps> = ({ onOpenDeposit, onGoToAds }) => {
  const { balance, activePlan, buyPlan } = useApp();
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId | null>(null);
  const [confirmingPlanId, setConfirmingPlanId] = useState<PlanId | null>(null);

  const handleSubscribe = (planId: PlanId) => {
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) return;

    if (balance < plan.price) {
      setConfirmingPlanId(null);
      onOpenDeposit();
      return;
    }

    const res = buyPlan(planId);
    setConfirmingPlanId(null);
    if (res.success) {
      onGoToAds();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5" />
            Guaranteed 2-Month Active Earning Plans (60 Days)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Select Your Daily Ads Earning Plan
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            All plans remain <strong className="text-emerald-400">active for 2 months (60 days)</strong>. Each plan gives
            you exactly <strong className="text-emerald-400">2 ads daily</strong> to watch. Earnings are credited
            directly to your wallet balance for immediate withdrawal via JazzCash, Easypaisa, OPay, or Card!
          </p>
        </div>

        {/* Quick balance indicator */}
        <div className="mt-6 sm:mt-0 sm:absolute sm:top-8 sm:right-8 p-4 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-sm text-left">
          <p className="text-xs text-slate-400 font-medium">Your Current Wallet</p>
          <p className="text-xl font-black text-white">
            <span className="text-xs text-emerald-400 font-bold mr-1">Rs</span>
            {balance.toLocaleString()}
          </p>
          <button
            onClick={onOpenDeposit}
            className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1"
          >
            + Deposit funds
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* The 3 Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrentlyActive = activePlan?.planId === plan.id;
          const hasEnoughBalance = balance >= plan.price;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 transition-all duration-200 border flex flex-col justify-between ${
                isCurrentlyActive
                  ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10'
                  : plan.popular
                  ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg'
                  : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800'
              }`}
            >
              {/* Badges */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                    plan.popular
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {plan.badge}
                </span>

                {isCurrentlyActive && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Current Plan
                  </span>
                )}
              </div>

              {/* Plan Title & Pricing */}
              <div>
                <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.tagline}</p>

                <div className="mt-4 pb-4 border-b border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold text-slate-400">Rs</span>
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-xs text-slate-400 font-semibold">/ 2 Months</span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-medium mt-1">
                    Total 60-Day Return: <strong>Rs {plan.totalReturn.toLocaleString()} PKR</strong>
                  </p>
                </div>

                {/* Key Breakdown Details */}
                <div className="py-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Daily Earning:</span>
                    <span className="font-bold text-emerald-400 text-sm">Rs {plan.dailyEarnings} / Day</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Daily Ad Tasks:</span>
                    <span className="font-bold text-slate-200">2 Ads per day</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Ad #1 Reward:</span>
                      <span className="font-bold text-teal-400">Rs {plan.ad1Reward} PKR</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Ad #2 Reward:</span>
                      <span className="font-bold text-teal-400">Rs {plan.ad2Reward} PKR</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Plan Validity:</span>
                    <span className="font-bold text-slate-200">2 Months (60 Days)</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400">Withdrawal:</span>
                    <span className="font-bold text-slate-200">JazzCash, Easypaisa, OPay</span>
                  </div>
                </div>
              </div>

              {/* Call to Action Button */}
              <div className="pt-4 mt-auto">
                {isCurrentlyActive ? (
                  <button
                    onClick={onGoToAds}
                    className="w-full py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-extrabold text-xs border border-emerald-500/40 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Watch Today's 2 Ads
                  </button>
                ) : confirmingPlanId === plan.id ? (
                  <div className="space-y-2">
                    <p className="text-[11px] text-center text-slate-300">
                      Confirm purchasing {plan.name} for <strong>Rs {plan.price}</strong>?
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        className="py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs transition-all"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmingPlanId(null)}
                        className="py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    id={`btn-buy-${plan.id}`}
                    onClick={() => {
                      if (!hasEnoughBalance) {
                        onOpenDeposit();
                      } else {
                        setConfirmingPlanId(plan.id);
                      }
                    }}
                    className={`w-full py-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
                      plan.popular
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {hasEnoughBalance ? (
                      <>
                        <Zap className="w-4 h-4" />
                        Activate for Rs {plan.price}
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        Deposit to Activate (Rs {plan.price})
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Transparent Math Explanation Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Transparent Earnings Formula (How Much You Earn)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="font-bold text-slate-200">1st Plan (Rs 150)</p>
            <p className="text-slate-400 mt-1">Cost: Rs 150 one-time</p>
            <p className="text-slate-400">Daily: 2 Ads (Rs 25 + Rs 25) = Rs 50/day</p>
            <p className="text-emerald-400 font-bold mt-2">60 Days = Rs 3,000 PKR Total</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="font-bold text-slate-200">2nd Plan (Rs 300)</p>
            <p className="text-slate-400 mt-1">Cost: Rs 300 one-time</p>
            <p className="text-slate-400">Daily: 2 Ads (Rs 50 + Rs 50) = Rs 100/day</p>
            <p className="text-emerald-400 font-bold mt-2">60 Days = Rs 6,000 PKR Total</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="font-bold text-slate-200">3rd Plan (Rs 450)</p>
            <p className="text-slate-400 mt-1">Cost: Rs 450 one-time</p>
            <p className="text-slate-400">Daily: 2 Ads (Rs 75 + Rs 75) = Rs 150/day</p>
            <p className="text-emerald-400 font-bold mt-2">60 Days = Rs 9,000 PKR Total</p>
          </div>
        </div>
      </div>
    </div>
  );
};
