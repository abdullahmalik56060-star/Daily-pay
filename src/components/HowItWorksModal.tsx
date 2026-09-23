import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Zap,
  ArrowDownCircle,
  ArrowUpCircle,
  PlayCircle,
  Sparkles,
  ShieldCheck,
  Code2,
  CheckCircle2,
} from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'userGuide' | 'devGuide'>('userGuide');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">System Guide & Architecture</h3>
              <p className="text-xs text-slate-400">Complete explanation of the earning, deposit, and withdrawal system</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guide Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6">
          <button
            onClick={() => setActiveTab('userGuide')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'userGuide'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. User Operational Guide
          </button>
          <button
            onClick={() => setActiveTab('devGuide')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'devGuide'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            2. Developer Implementation Guide
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 text-xs text-slate-300">
          {activeTab === 'userGuide' ? (
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ArrowDownCircle className="w-4 h-4" />
                  Step 1: Deposit via JazzCash, Easypaisa, OPay, or Card
                </div>
                <p>
                  To subscribe to a plan, go to the <strong>Deposit</strong> tab. Select your desired payment gateway:
                  JazzCash, Easypaisa, OPay System, or Debit/Credit Card. Follow the on-screen account title & number,
                  send money, and enter your Transaction ID (TID). All deposits receive an automatic <strong>+10% bonus</strong>!
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  Step 2: Activate Your 2-Month Plan (60 Days)
                </div>
                <p>Choose from one of the three guaranteed 60-day investment plans:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li>
                    <strong>Plan 1 (Rs 150 PKR):</strong> Active 60 days • Earns <strong>Rs 50/day</strong> (Ad 1: Rs 25,
                    Ad 2: Rs 25) • Total 60-Day Return = <strong>Rs 3,000 PKR</strong>
                  </li>
                  <li>
                    <strong>Plan 2 (Rs 300 PKR):</strong> Active 60 days • Earns <strong>Rs 100/day</strong> (Ad 1: Rs 50,
                    Ad 2: Rs 50) • Total 60-Day Return = <strong>Rs 6,000 PKR</strong>
                  </li>
                  <li>
                    <strong>Plan 3 (Rs 450 PKR):</strong> Active 60 days • Earns <strong>Rs 150/day</strong> (Ad 1: Rs 75,
                    Ad 2: Rs 75) • Total 60-Day Return = <strong>Rs 9,000 PKR</strong>
                  </li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <PlayCircle className="w-4 h-4" />
                  Step 3: Watch Exactly 2 Ads Per Day
                </div>
                <p>
                  Navigate to <strong>Check Ads Earnings</strong>. Each active plan provides strictly 2 ads per day.
                  Watch each 10-second sponsored campaign, answer a quick verification question, and the exact earnings
                  are credited immediately into your wallet!
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <ArrowUpCircle className="w-4 h-4" />
                  Step 4: Withdraw Instant Cash (Active Plan Required & 4-Day Cycle)
                </div>
                <p>
                  <strong>Rule (جب تک کوئی پلان منتخب نہ ہو ودڈرا نہیں ہوگا):</strong> Withdrawals are strictly disabled in Demo Mode until an earning plan is activated. Once Plan 1 (Rs 150), Plan 2 (Rs 300), or Plan 3 (Rs 450) is chosen, you can withdraw between <strong>Rs 500 and Rs 1,000 PKR once every 4 days</strong> to JazzCash, Easypaisa, OPay, or Card with 0% fee!
                </p>
              </div>

              {/* Bonus System Summary */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  Bonus & Referral System Rules
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li><strong>Login App Bonus:</strong> Rs 25 PKR credited automatically upon account creation.</li>
                  <li><strong>Daily Bonus:</strong> Free Rs 5 PKR streak reward every 24 hours.</li>
                  <li><strong>Reference Bonus:</strong> Rs 10 PKR per invited friend. Friends start in Demo Mode (Not Active) and become Active once they choose an earning plan!</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono text-[11px]">
                <h4 className="font-bold text-white font-sans text-xs">Technical Architecture & Logic Flow</h4>
                <p className="text-slate-400 font-sans">
                  Here is how this website was engineered to satisfy all financial criteria:
                </p>
                <div className="space-y-2 text-slate-300">
                  <p className="text-emerald-400">1. State Persistence Layer:</p>
                  <p className="pl-3 text-slate-400">
                    Stores wallet balance, active plan subscription (60 days), 2-ads daily status, deposits,
                    withdrawals, and friend referral statuses in structured localStorage.
                  </p>

                  <p className="text-emerald-400">2. Daily 2-Ad Constraint Engine:</p>
                  <p className="pl-3 text-slate-400">
                    `dailyAds.ad1Watched` and `dailyAds.ad2Watched` tracked against current date string. Dynamically
                    computes rewards: Plan 1 = 25+25 Rs, Plan 2 = 50+50 Rs, Plan 3 = 75+75 Rs.
                  </p>

                  <p className="text-emerald-400">3. Deposit & 10% Bonus Module:</p>
                  <p className="pl-3 text-slate-400">
                    Accepts JazzCash, Easypaisa, OPay, and Card inputs. Calculates `Math.round(amount * 0.10)` bonus and
                    adds both deposit and bonus entries to the ledger.
                  </p>

                  <p className="text-emerald-400">4. Withdrawal Gateway Logic:</p>
                  <p className="pl-3 text-slate-400">
                    Strict plan check: Blocks withdrawals with an error message if `activePlan` is null. When active, enforces withdrawal limits between 500 and 1,000 PKR once every 4 days, checks account credentials, generates a unique receipt reference (`WD-XXXXXX`), and updates balances atomically.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs transition-all"
          >
            Got It, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
