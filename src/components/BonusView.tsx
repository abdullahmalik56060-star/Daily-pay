import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Users,
  Copy,
  Check,
  Gift,
  CheckCircle2,
  Share2,
  Calendar,
  Lock,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

export const BonusView: React.FC = () => {
  const {
    user,
    dailyCheckInClaimed,
    claimDailyCheckIn,
    claimReferralBonus,
    loginBonus,
    dailyBonus,
    referralBonus,
    activePlan,
    referralFriends,
    whatsappLink,
    openAuthModal,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [friendPhone, setFriendPhone] = useState('');
  const [friendName, setFriendName] = useState('');
  const [referralFeedback, setReferralFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/?ref=${user.referralCode}`
    : `https://dailypay.pk/?ref=${user.referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const shareText = encodeURIComponent(
      `Join Daily Pay Pakistan and earn daily PKR from mobile! Use my referral code ${user.referralCode} to get Rs 25 Welcome Login Bonus: ${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  const handleSimulateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendPhone || friendPhone.length < 10) return;

    const res = claimReferralBonus(friendPhone, friendName);
    setReferralFeedback({
      success: res.success,
      message: res.message,
    });
    setFriendPhone('');
    setFriendName('');
    setTimeout(() => setReferralFeedback(null), 4000);
  };

  const totalReferralEarnings = referralFriends.length * referralBonus;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <Gift className="w-3.5 h-3.5" />
            Official Bonus & Rewards
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Bonuses & Referral Center
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Free <strong className="text-emerald-400">Login App Bonus (Rs 25)</strong>, free{' '}
            <strong className="text-amber-400">Daily Attendance Bonus (Rs 5)</strong>, and{' '}
            <strong className="text-indigo-400">Reference Bonus (Rs 10)</strong> for every friend you invite.
          </p>
        </div>
      </div>

      {/* Withdrawal Rule Reminder */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <p className="font-extrabold text-white">
              Withdrawal Rule: جب تک کوئی پلان منتخب نہیں کریں گے تب تک ودڈرا نہیں ہو سکتا
            </p>
            <p className="text-slate-400 text-[11px]">
              {activePlan
                ? `Active Plan (${activePlan.planName}) active: Withdrawals unlocked (Rs 500 - 1,000 every 4 days).`
                : 'Choose Plan 1 (Rs 150), Plan 2 (Rs 300), or Plan 3 (Rs 450) to unlock instant JazzCash / OPay cash withdrawals.'}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full font-bold text-[11px] shrink-0 ${
            activePlan
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}
        >
          {activePlan ? 'Withdrawals Enabled ✓' : 'Plan Required to Withdraw'}
        </span>
      </div>

      {/* Primary 3 Bonus Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Login App Bonus (Rs 25) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              <Gift className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">Login App Bonus</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  CREDITED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Every new user gets a free starting balance of Rs 25 PKR upon logging into the application.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Login Bonus:</span>
              <span className="text-lg font-black text-emerald-400">+Rs {loginBonus} PKR</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Automatic credit upon account login</span>
          </div>
        </div>

        {/* 2. Daily Attendance Bonus (Rs 5) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <Calendar className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">Daily Bonus</h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                  EVERY 24H
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Log into the app daily and collect your free attendance streak reward every 24 hours.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Daily Bonus:</span>
              <span className="text-lg font-black text-amber-400">+Rs {dailyBonus} PKR</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            {dailyCheckInClaimed ? (
              <div className="py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Claimed Today (Next in 24h)
              </div>
            ) : (
              <button
                onClick={claimDailyCheckIn}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Claim Today's Rs {dailyBonus} Bonus
              </button>
            )}
          </div>
        </div>

        {/* 3. Reference Bonus (Rs 10) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              <Users className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">Reference Bonus</h3>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold">
                  PER FRIEND
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Share your referral link with friends on WhatsApp or social media and earn Rs 10 per invitation!
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Reward Per Referral:</span>
              <span className="text-lg font-black text-indigo-400">+Rs {referralBonus} PKR</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Total Friends Invited:</span>
            <span className="font-bold text-white">{referralFriends.length} Friends (Rs {totalReferralEarnings})</span>
          </div>
        </div>
      </div>

      {/* Clean Referral Sharing Section (No complex demo mode or activation list) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-lg font-extrabold text-white">Invite Friends & Earn Reference Bonus</h3>
              <p className="text-xs text-slate-400">
                Share your invitation link and get Rs 10 PKR credited directly to your balance for each friend.
              </p>
            </div>
          </div>

          <button
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            Share on WhatsApp
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Referral Link & Code */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Your Exclusive Invitation Link:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('signup', user.referralCode)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-md shadow-emerald-500/20"
                  title="Open Link & Show Login / Sign Up"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Open Link</span>
                  <span>(Login / Sign Up)</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-500">Your Referral Code:</p>
                <p className="font-mono font-extrabold text-emerald-400 text-base mt-0.5">{user.referralCode}</p>
              </div>
              <div>
                <p className="text-slate-500">Reward Per Referral:</p>
                <p className="font-extrabold text-white text-base mt-0.5">Rs 10 PKR</p>
              </div>
              <div>
                <p className="text-slate-500">Total Referrals:</p>
                <p className="font-extrabold text-white text-base mt-0.5">{referralFriends.length}</p>
              </div>
              <div>
                <p className="text-slate-500">Total Bonus Earned:</p>
                <p className="font-extrabold text-emerald-400 text-base mt-0.5">Rs {totalReferralEarnings} PKR</p>
              </div>
            </div>
          </div>

          {/* Quick Simulation / Manual Invite Box */}
          <div className="lg:col-span-5 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Simulate Friend Invitation (+Rs 10)
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Test the referral bonus system by entering a friend's phone number:
              </p>
            </div>

            <form onSubmit={handleSimulateReferral} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  placeholder="Friend Name (e.g. Asad Ali)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={friendPhone}
                  onChange={(e) => setFriendPhone(e.target.value)}
                  placeholder="Phone Number (e.g. 0300-1122334)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {referralFeedback && (
                <p
                  className={`text-xs font-semibold ${
                    referralFeedback.success ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {referralFeedback.message}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                Invite Friend (+Rs 10 Instant Bonus)
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
