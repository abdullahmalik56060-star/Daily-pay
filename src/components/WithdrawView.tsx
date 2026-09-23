import React, { useState, useEffect } from 'react';
import { PAYMENT_METHODS } from '../data/mockData';
import { PaymentMethod, WithdrawalRecord } from '../types';
import { useApp } from '../context/AppContext';
import {
  ArrowUpCircle,
  Check,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Wallet,
  AlertCircle,
  Receipt,
  FileText,
  Clock,
  Lock,
  Sparkles,
  Timer,
  Zap,
  CheckCircle2,
  Tv,
  ExternalLink,
  Eye,
  RefreshCw,
  TrendingUp,
  ChevronRight,
  Users,
  Building2,
} from 'lucide-react';

interface WithdrawViewProps {
  onSuccess?: () => void;
  onGoToDeposit?: () => void;
  onGoToPlans?: () => void;
  onGoToAdmin?: () => void;
  onGoToAds?: () => void;
}

export const WithdrawView: React.FC<WithdrawViewProps> = ({
  onSuccess,
  onGoToDeposit,
  onGoToPlans,
  onGoToAdmin,
  onGoToAds,
}) => {
  const {
    balance,
    activePlan,
    withdrawFunds,
    completeWithdrawalNow,
    withdrawals,
    getWithdrawalCooldown,
    fastForwardDays,
    minWithdrawal,
    maxWithdrawal,
    withdrawalIntervalDays,
    appReserveBalance,
    isAdminLoggedIn,
    approveUserWithdrawal,
    rejectUserWithdrawal,
    admins,
    currentAdminId,
    financialSummary,
    openFinanceLedger,
    communityPayouts,
    totalWithdrawn,
  } = useApp();

  const currentAdmin = admins.find((a) => a.id === currentAdminId) || admins[0];

  const cooldown = getWithdrawalCooldown();
  const isCooldownActive = Boolean(cooldown?.inCooldown);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('jazzcash');
  const [amount, setAmount] = useState<number>(balance >= 500 ? (balance >= 1000 ? 1000 : 500) : 500);
  const [accountTitle, setAccountTitle] = useState<string>('Abdullah Malik');
  const [accountNumber, setAccountNumber] = useState<string>('0300-1234567');
  const [error, setError] = useState<string | null>(null);
  const [completedWithdrawal, setCompletedWithdrawal] = useState<WithdrawalRecord | null>(null);

  const activePendingWithdrawal = withdrawals.find(
    (w) => w.status === 'pending' || w.status === 'processing'
  );

  // Keep completedWithdrawal synchronized with AppContext (e.g. when approved by Admin)
  useEffect(() => {
    if (completedWithdrawal) {
      const match = withdrawals.find((w) => w.id === completedWithdrawal.id || w.referenceId === completedWithdrawal.referenceId);
      if (match) {
        setCompletedWithdrawal(match);
      }
    }
  }, [withdrawals, completedWithdrawal]);

  // Live 5 to 7 minutes delivery countdown (seconds)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(360);

  useEffect(() => {
    const target = completedWithdrawal?.estimatedReceivedTime || activePendingWithdrawal?.estimatedReceivedTime;
    if (!target) return;

    const calcTime = () => {
      const diff = Math.max(0, Math.floor((target - Date.now()) / 1000));
      setRemainingSeconds(diff);
    };
    calcTime();
    const timer = setInterval(calcTime, 1000);
    return () => clearInterval(timer);
  }, [completedWithdrawal?.estimatedReceivedTime, activePendingWithdrawal?.estimatedReceivedTime]);

  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethod)!;

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // USER RULE: "jb tk koi plan chose na kary tb tb withdrawal no"
    if (!activePlan) {
      setError(
        'Withdrawal Locked! جب تک آپ کوئی پلان منتخب نہیں کریں گے تب تک ودڈرا نہیں ہو سکتا (No withdrawal in Demo Mode until an earning plan is activated). Please choose and activate a plan first.'
      );
      return;
    }

    if (isCooldownActive && cooldown) {
      setError(
        `Withdrawal limit: You can only withdraw once every 4 days. Next withdrawal opens in ${cooldown.formatted} (${cooldown.nextAvailableDate}).`
      );
      return;
    }

    if (amount < minWithdrawal) {
      setError(`Minimum withdrawal threshold is Rs ${minWithdrawal} PKR.`);
      return;
    }

    if (amount > maxWithdrawal) {
      setError(`Maximum withdrawal limit is Rs ${maxWithdrawal} PKR per request (4-day cycle limit).`);
      return;
    }

    if (amount > balance) {
      setError(`Insufficient balance. Your current wallet balance is Rs ${balance} PKR.`);
      return;
    }

    if (!accountTitle.trim()) {
      setError('Please enter the account holder name (as per CNIC / bank).');
      return;
    }

    if (!accountNumber.trim()) {
      setError(`Please enter your ${currentMethod.name} account or mobile number.`);
      return;
    }

    const res = withdrawFunds(selectedMethod, amount, accountTitle.trim(), accountNumber.trim());

    if (res.success && res.withdrawal) {
      setCompletedWithdrawal(res.withdrawal);
      if (onSuccess) onSuccess();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
              <ArrowUpCircle className="w-3.5 h-3.5" />
              Official Payout System (4-Day Cycle)
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <Timer className="w-3.5 h-3.5" />
              Received in 5 to 7 Minutes (5 سے 7 منٹ میں وصولی)
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              100% Backed by App Reserve (Rs {appReserveBalance.toLocaleString()} PKR Pool)
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Withdraw Your Daily Earnings
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Payout directly to <strong className="text-white">JazzCash, Easypaisa, OPay System, or Bank Card</strong>.
            Guaranteed transfer received within <strong className="text-emerald-400">5 to 7 minutes</strong>!
            Withdrawal limit is <strong className="text-emerald-400">Rs 500 to Rs 1,000 PKR</strong> once every <strong>4 days</strong> with 0% fee!
          </p>
        </div>

        <div className="mt-6 sm:mt-0 sm:absolute sm:top-8 sm:right-8 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left sm:text-right">
          <span className="text-xs text-slate-400">Available to Withdraw</span>
          <p className="text-2xl font-black text-emerald-400">
            <span className="text-xs text-emerald-400 font-bold mr-1">Rs</span>
            {balance.toLocaleString()}
          </p>
          <div className="text-[11px] text-emerald-400 font-semibold mt-0.5 flex items-center gap-1 justify-start sm:justify-end">
            <Clock className="w-3 h-3" />
            <span>Delivery: 5 - 7 Minutes</span>
          </div>
        </div>
      </div>

      {/* People Total Withdrawals Transparency System Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Stat: How much people have withdrawn */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-emerald-950/40 border border-indigo-500/40 shadow-xl flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>لوگوں کے موصول شدہ ودڈرا کی براہ راست سمری</span>
              </div>
              <h3 className="text-sm font-bold text-slate-300 mt-2">
                لوگوں نے اب تک کتنا ودڈرا کر لیا ہے؟ (Total Withdrawn by People)
              </h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-black text-emerald-400">Rs</span>
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {financialSummary.platformTotalWithdrawn.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-slate-400">PKR کامیابی سے ادا شدہ</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openFinanceLedger('withdraw')}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>لوگوں کے ثبوت دیکھیں</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-slate-800/80">
            یہ رقم پاکستان بھر کے صارفین کو ان کے JazzCash، Easypaisa اور Bank Card اکاؤنٹس میں کامیابی سے ادا کی جا چکی ہے۔
          </p>
        </div>

        {/* User's own total withdrawn */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">آپ کا اپنا کل ودڈرا</span>
              <span className="w-6 h-6 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs">
                <Wallet className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-white mt-1.5">
              <span className="text-xs font-bold text-emerald-400 mr-1">Rs</span>
              {financialSummary.userTotalWithdrawn.toLocaleString()}
            </p>
            <span className="text-[11px] text-emerald-400 font-medium">
              منظور شدہ: Rs {financialSummary.userCompletedWithdrawn.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={() => openFinanceLedger('withdraw')}
            className="w-full mt-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1 border border-slate-700/60"
          >
            <span>میری تمام رسیدیں</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {completedWithdrawal ? (
        /* Official Payout Receipt / Live Status Tracker */
        <div className={`p-6 sm:p-8 rounded-2xl bg-slate-900 border ${
          completedWithdrawal.status === 'completed'
            ? 'border-emerald-500/40'
            : completedWithdrawal.status === 'rejected'
            ? 'border-red-500/40'
            : 'border-amber-500/40'
        } shadow-2xl max-w-xl mx-auto space-y-6 text-center animate-in zoom-in-95 duration-200`}>
          <div className={`w-16 h-16 rounded-full ${
            completedWithdrawal.status === 'completed'
              ? 'bg-emerald-500/20 text-emerald-400'
              : completedWithdrawal.status === 'rejected'
              ? 'bg-red-500/20 text-red-400'
              : 'bg-amber-500/20 text-amber-400 animate-pulse'
          } flex items-center justify-center mx-auto`}>
            {completedWithdrawal.status === 'completed' ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : completedWithdrawal.status === 'rejected' ? (
              <AlertCircle className="w-8 h-8" />
            ) : (
              <Clock className="w-8 h-8 animate-spin" />
            )}
          </div>

          <div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${
              completedWithdrawal.status === 'completed'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : completedWithdrawal.status === 'rejected'
                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}>
              {completedWithdrawal.status === 'completed' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Approved & Paid (ایڈمن نے منظور کر لیا - رقم موصول شدہ)</span>
                </>
              ) : completedWithdrawal.status === 'rejected' ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Rejected & Refunded (درخواست مسترد - رقم والٹ میں واپس)</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>Pending Admin Approval (منتظر ایڈمن منظوری)</span>
                </>
              )}
            </div>

            <h3 className="text-3xl font-black text-white">
              Rs {completedWithdrawal.netAmount.toLocaleString()} PKR
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Beneficiary: <strong className="text-slate-200">{completedWithdrawal.accountTitle}</strong> ({completedWithdrawal.accountNumber})
            </p>
          </div>

          {/* Pending Status Explanation Box */}
          {(completedWithdrawal.status === 'pending' || completedWithdrawal.status === 'processing') && (
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 animate-spin" />
                  ایڈمن منظوری کی حیثیت (Approval Status):
                </span>
                <span className="text-xs font-mono font-black text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                  درخواست موصول ہو گئی
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed text-left">
                آپ کی ودڈرا کی درخواست ایڈمن پینل پر بھیج دی گئی ہے۔ جیسے ہی ایڈمن تصدیق کر کے اپروو کریں گے، فنڈز <strong className="text-emerald-400">ایپ ریزرو والٹ</strong> سے فوری طور پر آپ کے {completedWithdrawal.method.toUpperCase()} اکاؤنٹ میں کریڈٹ کر دیے جائیں گے۔
              </p>

              {/* 4-Step Progress Chain */}
              <div className="grid grid-cols-4 gap-1 pt-1 text-[10px] font-semibold text-left">
                <div className="text-emerald-400 flex flex-col">
                  <span>1. Request</span>
                  <span className="text-[9px] text-emerald-500">✓ Submitted</span>
                </div>
                <div className="text-amber-400 flex flex-col">
                  <span>2. Admin</span>
                  <span className="text-[9px] text-amber-500">In Review...</span>
                </div>
                <div className="text-slate-400 flex flex-col">
                  <span>3. App Reserve</span>
                  <span className="text-[9px] text-slate-500">Auto Payout</span>
                </div>
                <div className="text-slate-400 flex flex-col">
                  <span>4. Received</span>
                  <span className="text-[9px] text-slate-500">5-7 min</span>
                </div>
              </div>
            </div>
          )}

          {/* Balance Deduction Notice */}
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                رقم والٹ بیلنس سے کاٹ لی گئی ہے (Deducted from Wallet)
              </span>
              <span className="text-xs font-mono font-extrabold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                - Rs {completedWithdrawal.amount.toLocaleString()} PKR
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-red-500/20">
              <span className="text-slate-400">نیا والٹ بیلنس (Remaining Balance):</span>
              <span className="font-extrabold text-emerald-400">Rs {balance.toLocaleString()} PKR</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              آپ کی ودڈرا کی گئی رقم آپ کے اکاؤنٹ سے منہا کر دی گئی ہے۔ ایڈمن کے منظور کرتے ہی 5 سے 7 منٹ میں فنڈز آپ کے اکاؤنٹ میں منتقل کر دیے جائیں گے۔
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Receipt Reference:</span>
              <span className="font-mono font-bold text-white">{completedWithdrawal.referenceId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payout Gateway:</span>
              <span className="font-bold text-white uppercase">{completedWithdrawal.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Beneficiary Title:</span>
              <span className="text-slate-200 font-semibold">{completedWithdrawal.accountTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Account Number:</span>
              <span className="font-mono text-slate-200">{completedWithdrawal.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Admin Approval:</span>
              <span className={`font-bold ${completedWithdrawal.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {completedWithdrawal.status === 'completed'
                  ? `Approved by ${completedWithdrawal.approvedBy || 'Admin'}`
                  : 'Pending Admin Verification (منظوری درکار ہے)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Withdrawal Policy:</span>
              <span className="text-amber-400 font-bold">Rs 500 - 1,000 (1 per 4 Days)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Transfer Fee:</span>
              <span className="text-emerald-400 font-bold">Rs 0 (Free Promo)</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
              <span className="text-slate-300">Net Amount:</span>
              <span className="text-emerald-400 font-black">Rs {completedWithdrawal.netAmount} PKR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Request Date:</span>
              <span className="text-slate-300">{completedWithdrawal.date}</span>
            </div>
            {completedWithdrawal.receivedAt && (
              <div className="flex justify-between">
                <span className="text-slate-400">Dispatched Time:</span>
                <span className="text-emerald-400 font-bold">{completedWithdrawal.receivedAt}</span>
              </div>
            )}
            {completedWithdrawal.rejectReason && (
              <div className="flex justify-between text-red-400">
                <span>Reason:</span>
                <span>{completedWithdrawal.rejectReason}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Next Withdrawal Available:</span>
              <span className="font-mono text-amber-300">In 4 Days</span>
            </div>
          </div>

          {/* Direct Admin Control if Admin is logged in or quick navigation */}
          {(completedWithdrawal.status === 'pending' || completedWithdrawal.status === 'processing') && (
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 text-left space-y-3">
              {isAdminLoggedIn ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      ایڈمن کوئیک ایکشن (Admin: {currentAdmin.name})
                    </span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold">
                      لاگ ان ایڈمن اختیارات
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    آپ ایڈمن کے طور پر لاگ ان ہیں۔ صارف نے ودڈرا درخواست کی ہے۔ آپ یہیں سے براہِ راست اس درخواست کو منظور (Approve) یا مسترد کر سکتے ہیں:
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => approveUserWithdrawal(completedWithdrawal.id)}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      منظور کریں اور ادا کریں (Approve & Pay)
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectUserWithdrawal(completedWithdrawal.id, 'تفصیلات نامکمل تھیں')}
                      className="px-3 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-bold transition-all"
                    >
                      مسترد
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                      ایڈمن منظوری کی پالیسی
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      یہ درخواست ایڈمن (حمزہ ملک / 2nd ایڈمن) کو موصول ہو چکی ہے۔ ایڈمن پورٹل میں جا کر اس کی منظوری دی جا سکتی ہے۔
                    </p>
                  </div>
                  {onGoToAdmin && (
                    <button
                      type="button"
                      onClick={onGoToAdmin}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      ایڈمن پورٹل لاگ ان
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={() => setCompletedWithdrawal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs transition-all"
            >
              Close Receipt / واپس جائیں
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Pending Withdrawal Notification Bar */}
          {activePendingWithdrawal && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <p className="font-extrabold text-xs text-white flex items-center gap-1.5">
                    <span>Active Withdrawal: Pending Admin Approval</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                      {activePendingWithdrawal.referenceId}
                    </span>
                  </p>
                  <p className="text-[11px] text-amber-300/90 mt-0.5">
                    Rs {activePendingWithdrawal.netAmount} via {activePendingWithdrawal.method.toUpperCase()} (ایڈمن کے منظور کرتے ہی رقم اکاؤنٹ میں منتقل ہو جائے گی)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCompletedWithdrawal(activePendingWithdrawal)}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
                >
                  View Details / رسید دیکھیں
                </button>
              </div>
            </div>
          )}
          {/* Plan Lock Alert (User rule: jb tk koi plan chose na kary tb tb withdrawal no) */}
          {!activePlan ? (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/30 border border-red-500/30 text-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sm text-red-400">
                  <Lock className="w-5 h-5 shrink-0 animate-bounce" />
                  <span>Withdrawal Locked: Demo Mode (جب تک پلان منتخب نہ ہو ودڈرا نہیں ہوگا)</span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                  No Active Plan
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>جب تک آپ کوئی پلان منتخب نہیں کریں گے تب تک ودڈرا کی اجازت نہیں ہے۔</strong> Withdrawal is strictly locked while in Demo Mode. To withdraw your earnings (Rs 500 to Rs 1,000 PKR), you must choose and activate one of our 60-day earning plans:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col">
                  <span className="font-extrabold text-blue-400">Plan 1: Rs 150</span>
                  <span className="text-[11px] text-slate-400">Earns Rs 50/day (60 Days)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col">
                  <span className="font-extrabold text-emerald-400">Plan 2: Rs 300</span>
                  <span className="text-[11px] text-slate-400">Earns Rs 100/day (60 Days)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col">
                  <span className="font-extrabold text-amber-400">Plan 3: Rs 450</span>
                  <span className="text-[11px] text-slate-400">Earns Rs 150/day (60 Days)</span>
                </div>
              </div>
              {onGoToPlans && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onGoToPlans}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    Choose an Earning Plan Now (پلان منتخب کریں)
                  </button>
                </div>
              )}
            </div>
          ) : isCooldownActive && cooldown ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-200">
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>4-Day Withdrawal Cooldown Active</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                  {cooldown.formatted} Remaining
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Withdrawals are strictly limited between <strong className="text-white">Rs 500 and Rs 1,000 PKR once every 4 days</strong>. Your next withdrawal window opens on <strong className="text-amber-300">{cooldown.nextAvailableDate}</strong>.
              </p>
              <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 text-[11px]">Demo testing helper:</span>
                <button
                  type="button"
                  onClick={() => fastForwardDays(4)}
                  className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 transition-all"
                >
                  Fast-Forward 4 Days (Unlock Now)
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>
                  Active Plan: <strong>{activePlan.planName}</strong> &bull; Withdrawal Status: <strong>Ready & Eligible</strong> (Rs 500 - 1,000 PKR, 1 request per 4 days)
                </span>
              </div>
            </div>
          )}

          {/* App Reserve Liquidity Pool Card (User requirement: app pesy hony chaiya ta ky log withdrawal ly saky) */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                appReserveBalance >= 500
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">ایپ پے آؤٹ والٹ فنڈ (App Reserve Liquidity):</span>
                  <span className={`text-xs font-black font-mono ${appReserveBalance >= 500 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    Rs {appReserveBalance.toLocaleString()} PKR
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {appReserveBalance >= 500
                    ? 'ایپ میں فنڈز موجود ہیں۔ آپ کی درخواست ایڈمن کی منظوری کے بعد فوراً ادا کی جائے گی۔'
                    : 'ایپ ریزرو والٹ میں فی الوقت فنڈز محدود ہیں۔ ایڈمن کے فنڈز ڈپازٹ کرنے کے بعد ودڈرا منظور اور ادا ہوگا۔'}
                </p>
              </div>
            </div>
            <div className="text-[11px] px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-400 font-semibold self-start sm:self-auto shrink-0 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>ایڈمن کی تصدیق کے ساتھ</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Method Selection (Left Column) */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                1. Select Payout Method
              </h3>

              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => {
                        setSelectedMethod(method.id);
                        setError(null);
                      }}
                      className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10'
                          : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                            method.id === 'jazzcash'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : method.id === 'easypaisa'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : method.id === 'opay'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          }`}
                        >
                          {method.id === 'jazzcash' && <Smartphone className="w-5 h-5" />}
                          {method.id === 'easypaisa' && <Wallet className="w-5 h-5" />}
                          {method.id === 'opay' && <CreditCard className="w-5 h-5" />}
                          {method.id === 'card' && <ShieldCheck className="w-5 h-5" />}
                        </div>

                        <div>
                          <h4 className="font-extrabold text-sm text-white">{method.name}</h4>
                          <p className="text-xs text-slate-400">{method.subtitle}</p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-indigo-500 bg-indigo-500 text-slate-950' : 'border-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Withdrawal Rules Card */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2.5 text-slate-400">
                <div className="flex items-center gap-2 font-bold text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Official Withdrawal Policy & Rules
                </div>
                <ul className="list-disc pl-4 space-y-1.5">
                  <li>Withdrawal range: <strong className="text-white">Rs 500 to Rs 1,000 PKR</strong>.</li>
                  <li>Frequency restriction: <strong className="text-white">1 request every 4 days</strong>.</li>
                  <li>Processing period: <strong className="text-emerald-400">Received within 5 to 7 minutes</strong> (5 سے 7 منٹ میں وصولی) directly to your account.</li>
                  <li>0% transaction fee promotion currently enabled.</li>
                  <li>Account title must strictly match your CNIC / SIM owner name.</li>
                </ul>
              </div>
            </div>

            {/* Withdrawal Form (Right Column) */}
            <div className="lg:col-span-7">
              <form onSubmit={handleWithdrawSubmit} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  2. Enter Payout Details ({currentMethod.name})
                </h3>

                {/* Amount Input */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Withdrawal Amount (Rs 500 - Rs 1,000)
                    </label>
                    <span className="text-xs text-slate-400">
                      Wallet: <strong className="text-emerald-400">Rs {balance}</strong>
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      Rs
                    </span>
                    <input
                      type="number"
                      min={minWithdrawal}
                      max={maxWithdrawal}
                      step="50"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-extrabold text-lg focus:outline-none focus:border-indigo-500 transition-all"
                      placeholder="500 - 1000"
                      required
                    />
                  </div>

                  {/* Preset Shortcuts for 500 and 1000 limits */}
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setAmount(500)}
                      className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                        amount === 500
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                      }`}
                    >
                      Rs 500 (Min)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount(1000)}
                      className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                        amount === 1000
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                      }`}
                    >
                      Rs 1,000 (Max)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount(Math.min(maxWithdrawal, Math.max(minWithdrawal, balance)))}
                      className="py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-all"
                    >
                      Max Available
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Limit rule: Minimum <strong className="text-slate-300">Rs 500</strong> &bull; Maximum <strong className="text-slate-300">Rs 1,000</strong> per 4-day cycle.
                  </p>
                </div>

                {/* Account Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Account Title (Receiver Name as registered on CNIC)
                  </label>
                  <input
                    type="text"
                    value={accountTitle}
                    onChange={(e) => setAccountTitle(e.target.value)}
                    placeholder="e.g. Muhammad Ali / Abdullah"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium text-sm focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {currentMethod.name} Mobile Number or Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder={
                      selectedMethod === 'card'
                        ? 'e.g. 16-Digit Card or IBAN Number'
                        : 'e.g. 0300-1234567'
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                {/* Payout Summary Box */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Gross Withdrawal:</span>
                    <span className="font-semibold text-white">Rs {amount} PKR</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Transfer Fee:</span>
                    <span className="font-semibold text-emerald-400">Rs 0 (0% Promo)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Delivery Guarantee:</span>
                    <span className="font-bold text-emerald-400">5 to 7 Minutes (5 سے 7 منٹ)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Frequency Rule:</span>
                    <span className="font-semibold text-amber-400">1 Request Every 4 Days</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-sm">
                    <span className="text-slate-200">Net Amount to Receive:</span>
                    <span className="text-emerald-400 font-black">Rs {amount} PKR</span>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  id="btn-submit-withdraw"
                  disabled={!activePlan || isCooldownActive || balance < minWithdrawal}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 text-white font-black text-sm shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {!activePlan ? (
                    <>
                      <Lock className="w-4 h-4 text-amber-300" />
                      Locked: Choose a Plan to Unlock (پلان منتخب کریں)
                    </>
                  ) : isCooldownActive ? (
                    <>
                      <Clock className="w-4 h-4" />
                      Next Withdrawal Opens in {cooldown?.formatted}
                    </>
                  ) : balance < minWithdrawal ? (
                    <>
                      <ArrowUpCircle className="w-5 h-5" />
                      Minimum Rs {minWithdrawal} Balance Required (Balance: Rs {balance})
                    </>
                  ) : (
                    <>
                      <ArrowUpCircle className="w-5 h-5" />
                      Withdraw Rs {amount} (Receives in 5-7 Mins)
                    </>
                  )}
                </button>

                {!activePlan && onGoToPlans && (
                  <button
                    type="button"
                    onClick={onGoToPlans}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-bold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Go to Plans Page (Plan 150, 300, 450)
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Ads Earning & Admin Approval System Overview */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/40 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>📺 روزانہ ایڈز دیکھ کر کمانے اور ایڈمن اپروول کا نظام</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  Ads Earning & Payout
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                ایڈز واچنگ سے ودڈرا وصولی تک کا 4 مرحلہ وار آسان طریقہ کار
              </p>
            </div>
          </div>
          {onGoToAds && (
            <button
              type="button"
              onClick={onGoToAds}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Tv className="w-4 h-4" />
              <span>ابھی ایڈز دیکھیں (Watch Ads)</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-black flex items-center justify-center text-xs">
              1
            </span>
            <p className="font-bold text-white text-xs">روزانہ 2 ایڈز دیکھیں</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              ہر 24 گھنٹے بعد 2 اشتہارات دیکھیں۔ پلان 150 پر Rs 50، پلان 300 پر Rs 100 اور پلان 450 پر Rs 150 ملتے ہیں۔
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 font-black flex items-center justify-center text-xs">
              2
            </span>
            <p className="font-bold text-white text-xs">رقم والٹ میں جمع</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              ایڈز مکمل ہوتے ہی کمائی سیکنڈوں میں آپ کے والٹ بیلنس میں شامل ہو جاتی ہے جسے آپ مانیٹر کر سکتے ہیں۔
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-black flex items-center justify-center text-xs">
              3
            </span>
            <p className="font-bold text-white text-xs">ودڈرا ریکویسٹ اور کٹوتی</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              جیسے ہی آپ ودڈرا لگائیں گے، اتنی رقم آپ کی ایپ سے فوری کٹ ہو جائے گی اور ایڈمن کو منظوری کا نوٹیفکیشن جائے گا۔
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-xs">
              4
            </span>
            <p className="font-bold text-white text-xs">ایڈمن اپروول اور وصولی</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              ایڈمن اپنے محفوظ پورٹل سے تصدیق کر کے اپروو کرے گا اور 5 سے 7 منٹ میں فنڈز آپ کے اکاؤنٹ میں پہنچ جائیں گے۔
            </p>
          </div>
        </div>
      </div>

      {/* Complete User Withdrawal History & Status Records */}
      {withdrawals.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Receipt className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  آپ کے تمام ودڈرا ریکارڈز اور ایڈمن منظوری کی صورتحال
                </h3>
                <p className="text-xs text-slate-400">
                  Withdrawal Requests & Approval Status History
                </p>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Total: {withdrawals.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">تاریخ (Date)</th>
                  <th className="px-4 py-3">ریفرنس (ID)</th>
                  <th className="px-4 py-3">گیٹ وے (Method)</th>
                  <th className="px-4 py-3">اکاؤنٹ (Account)</th>
                  <th className="px-4 py-3">رقم (Net Amount)</th>
                  <th className="px-4 py-3">ایڈمن اپروول حیثیت (Status)</th>
                  <th className="px-4 py-3 text-right">ایکشن (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {withdrawals.map((item) => {
                  const isPending = item.status === 'pending' || item.status === 'processing';
                  const isCompleted = item.status === 'completed';
                  const isRejected = item.status === 'rejected';

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-300 whitespace-nowrap">
                        {item.referenceId}
                      </td>
                      <td className="px-4 py-3 uppercase font-bold text-slate-200 whitespace-nowrap">
                        {item.method}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-semibold text-white">{item.accountTitle}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{item.accountNumber}</div>
                      </td>
                      <td className="px-4 py-3 font-black text-emerald-400 whitespace-nowrap">
                        Rs {item.netAmount.toLocaleString()} PKR
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-300 border border-amber-500/30 animate-pulse">
                            <Clock className="w-3 h-3 animate-spin" />
                            منتظر ایڈمن منظوری (Pending Approval)
                          </span>
                        ) : isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <Check className="w-3 h-3" />
                            منظور شدہ بذریعہ {item.approvedBy || 'Admin'}
                          </span>
                        ) : isRejected ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-red-500/10 text-red-400 border border-red-500/30">
                            <AlertCircle className="w-3 h-3" />
                            مسترد (ریفنڈ شدہ)
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setCompletedWithdrawal(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          رسید
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
