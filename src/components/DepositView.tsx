import React, { useState } from 'react';
import { PAYMENT_METHODS, PLANS } from '../data/mockData';
import { PaymentMethod } from '../types';
import { useApp } from '../context/AppContext';
import {
  ArrowDownCircle,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Wallet,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Receipt,
  Users,
  Building2,
} from 'lucide-react';

interface DepositViewProps {
  onSuccess?: () => void;
}

export const DepositView: React.FC<DepositViewProps> = ({ onSuccess }) => {
  const {
    balance,
    depositFunds,
    totalDeposited,
    deposits,
    financialSummary,
    openFinanceLedger,
    communityDeposits,
  } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('jazzcash');
  const [amount, setAmount] = useState<number>(150);
  const [senderNumber, setSenderNumber] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);

  const currentMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethod)!;

  // Bonus calculation (10% instant deposit bonus!)
  const bonusPercent = 10;
  const calculatedBonus = Math.round((amount * bonusPercent) / 100);
  const totalReceivable = amount + calculatedBonus;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmitDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (amount < 150) {
      setError('کم از کم رقم جمع کرنے کی حد 150 روپے ہے۔ (Minimum deposit limit is Rs 150. Plan Options: Rs 150, Rs 300, Rs 450).');
      return;
    }

    if (selectedMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        setError('Please enter a valid 16-digit debit or credit card number.');
        return;
      }
      if (!cardExpiry || !cardCvv) {
        setError('Please complete the card expiration date and CVV code.');
        return;
      }
    } else {
      if (!senderNumber || senderNumber.length < 10) {
        setError(`Please enter your sending ${currentMethod.name} account or mobile number.`);
        return;
      }
      if (!transactionId.trim()) {
        setError('Please enter the Transaction ID (TID / TRX ID from SMS or app receipt).');
        return;
      }
    }

    const tid =
      selectedMethod === 'card'
        ? `CARD-${Date.now().toString().slice(-6)}`
        : transactionId.trim().toUpperCase();

    const sender =
      selectedMethod === 'card'
        ? `Card **** ${cardNumber.replace(/\s/g, '').slice(-4)}`
        : senderNumber.trim();

    const res = depositFunds(selectedMethod, amount, sender, tid);

    if (res.success) {
      setSuccessReceipt(res.deposit);
      if (onSuccess) {
        onSuccess();
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Special 10% Extra Deposit Bonus Active
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Deposit Funds & Bonus System
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Deposit to subscribe to Plan 1 (Rs 150), Plan 2 (Rs 300), or Plan 3 (Rs 450). Supported systems:
            <strong className="text-white"> JazzCash, Easypaisa, OPay System, and Cards</strong>.
          </p>
        </div>

        <div className="mt-6 sm:mt-0 sm:absolute sm:top-8 sm:right-8 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left sm:text-right">
          <span className="text-xs text-slate-400">Current Balance</span>
          <p className="text-xl font-black text-white">
            <span className="text-xs text-emerald-400 font-bold mr-1">Rs</span>
            {balance.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-400 font-medium">Instant Wallet Credit</span>
        </div>
      </div>

      {/* Financial System Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">آپ کا کل ڈپازٹ (My Total)</span>
            <p className="text-lg sm:text-xl font-black text-white mt-0.5">
              <span className="text-xs text-emerald-400 font-bold mr-1">Rs</span>
              {financialSummary.userTotalDeposited.toLocaleString()}
            </p>
            <span className="text-[10px] text-emerald-400 font-medium">
              {financialSummary.userDepositCount} بار رقم جمع کی
            </span>
          </div>
          <button
            type="button"
            onClick={() => openFinanceLedger('deposit')}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all flex items-center gap-1"
          >
            <span>ریکارڈ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">لوگوں کا کل ڈپازٹ فنڈ</span>
            <p className="text-lg sm:text-xl font-black text-teal-400 mt-0.5">
              <span className="text-xs font-bold mr-1">Rs</span>
              {financialSummary.platformTotalDeposited.toLocaleString()}
            </p>
            <span className="text-[10px] text-slate-400 font-medium">
              {financialSummary.platformActiveDepositors.toLocaleString()}+ تصدیق شدہ صارفین
            </span>
          </div>
          <button
            type="button"
            onClick={() => openFinanceLedger('deposit')}
            className="px-2.5 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/20 text-xs font-bold transition-all flex items-center gap-1"
          >
            <span>سسٹم</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">لوگوں نے اب تک کتنا ودڈرا کیا</span>
            <p className="text-lg sm:text-xl font-black text-indigo-400 mt-0.5">
              <span className="text-xs font-bold mr-1">Rs</span>
              {financialSummary.platformTotalWithdrawn.toLocaleString()}
            </p>
            <span className="text-[10px] text-emerald-400 font-semibold">
              5 سے 7 منٹ میں 100% ادا شدہ
            </span>
          </div>
          <button
            type="button"
            onClick={() => openFinanceLedger('withdraw')}
            className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-bold transition-all flex items-center gap-1"
          >
            <span>ثبوت</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {successReceipt ? (
        /* Success Receipt Card */
        <div className="p-8 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-2xl max-w-xl mx-auto space-y-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Check className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Deposit Approved & Credited
            </span>
            <h3 className="text-2xl font-black text-white mt-2">
              Rs {successReceipt.totalCredited.toLocaleString()} PKR Added
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              اس ڈپازٹ کی اصل رقم: Rs {successReceipt.amount} + 10% کیش بیک بونس: Rs {successReceipt.bonusAmount}
            </p>
          </div>

          {/* Running Totals and System Breakdown */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2 text-left">
            <div className="flex justify-between items-center">
              <span className="text-emerald-400 font-bold">اس ڈپازٹ کی رقم:</span>
              <span className="font-extrabold text-white">Rs {successReceipt.amount} PKR</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-emerald-400 font-bold">10% بونس کریڈٹ:</span>
              <span className="font-extrabold text-emerald-400">+Rs {successReceipt.bonusAmount} PKR</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-emerald-500/20">
              <span className="text-slate-200 font-bold">آپ کا اب تک کا کل ڈپازٹ:</span>
              <span className="font-black text-white text-sm">
                Rs {financialSummary.userTotalDeposited.toLocaleString()} PKR
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">سسٹم میں تمام صارفین کا کل ڈپازٹ:</span>
              <span className="font-extrabold text-teal-300">
                Rs {financialSummary.platformTotalDeposited.toLocaleString()} PKR
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2.5 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Transaction ID (TID):</span>
              <span className="font-mono font-bold text-white">{successReceipt.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Deposit Method:</span>
              <span className="font-bold text-white uppercase">{successReceipt.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sender Account:</span>
              <span className="text-slate-200">{successReceipt.senderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Deposit Reference:</span>
              <span className="font-mono text-slate-300">{successReceipt.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date & Time:</span>
              <span className="text-slate-300">{successReceipt.date}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setSuccessReceipt(null);
                setTransactionId('');
                setSenderNumber('');
              }}
              className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs transition-all"
            >
              نیا ڈپازٹ کریں (Make Another)
            </button>
            <button
              onClick={() => openFinanceLedger('deposit')}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5 text-emerald-400" />
              <span>مکمل لیجر سسٹم دیکھیں</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Method Selection (Left Column) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              1. Choose Payment Method
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
                        ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/10'
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
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-white">{method.name}</h4>
                          {method.id === 'jazzcash' && (
                            <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.2 rounded font-bold">
                              FAST
                            </span>
                          )}
                          {method.id === 'opay' && (
                            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded font-bold">
                              O-PAY
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{method.subtitle}</p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-emerald-500 bg-emerald-500 text-slate-950' : 'border-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Deposit Limit Presets (Rs 150, Rs 300, Rs 450) */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  Select Deposit Amount (رقم جمع کرنے کی حد):
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Limits: 150 / 300 / 450
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAmount(150)}
                  className={`p-2.5 rounded-lg text-xs font-extrabold border transition-all ${
                    amount === 150
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="block text-sm font-black">Rs 150</span>
                  <span className="block text-[10px] font-normal opacity-80">Plan 1 Limit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAmount(300)}
                  className={`p-2.5 rounded-lg text-xs font-extrabold border transition-all ${
                    amount === 300
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="block text-sm font-black">Rs 300</span>
                  <span className="block text-[10px] font-normal opacity-80">Plan 2 Limit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAmount(450)}
                  className={`p-2.5 rounded-lg text-xs font-extrabold border transition-all ${
                    amount === 450
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="block text-sm font-black">Rs 450</span>
                  <span className="block text-[10px] font-normal opacity-80">Plan 3 Limit</span>
                </button>
              </div>
            </div>
          </div>

          {/* Deposit Form & Details (Right Column) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Account Details Box for JazzCash / Easypaisa / OPay */}
            {selectedMethod !== 'card' && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Official {currentMethod.name} Receiving Account
                    </h4>
                    <p className="text-xs text-slate-400">Send deposit funds to this official account:</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentMethod.badgeColor}`}>
                    {currentMethod.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] uppercase text-slate-400 font-semibold">Account Title</span>
                    <p className="text-sm font-bold text-white mt-0.5">{currentMethod.accountTitle}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-semibold">Account Number</span>
                      <p className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                        {currentMethod.accountNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentMethod.accountNumber, 'accNumber')}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                      title="Copy Account Number"
                    >
                      {copiedField === 'accNumber' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
                  <strong className="text-slate-300">Instructions: </strong>
                  {currentMethod.instructions}
                </div>
              </div>
            )}

            {/* Deposit Form */}
            <form onSubmit={handleSubmitDeposit} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                2. Enter Deposit Details
              </h3>

              {/* Amount Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Deposit Amount (رقم درج کریں)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Min Limit: <strong className="text-emerald-400">Rs 500</strong>
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    Rs
                  </span>
                  <input
                    type="number"
                    min="150"
                    step="50"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-extrabold text-lg focus:outline-none focus:border-emerald-500 transition-all"
                    placeholder="150, 300, or 450"
                    required
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-slate-400">Quick Limits:</span>
                  {[150, 300, 450].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        amount === val
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Rs {val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* 10% Deposit Bonus Preview Badge */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-xs font-bold text-emerald-300">
                      +10% Bonus Reward: <strong>Rs {calculatedBonus} PKR</strong>
                    </p>
                    <p className="text-[11px] text-slate-400">Auto-calculated bonus credited immediately</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400">Total in Wallet:</span>
                  <p className="text-sm font-extrabold text-white">Rs {totalReceivable} PKR</p>
                </div>
              </div>

              {/* Method Specific Fields */}
              {selectedMethod === 'card' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      16-Digit Card Number
                    </label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 •••• •••• 8891"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Sending {currentMethod.name} Mobile Number
                    </label>
                    <input
                      type="text"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="e.g. Apna personal JazzCash / Mobile number enter karein (03XX-XXXXXXX)"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium text-sm focus:outline-none focus:border-emerald-500"
                      required
                    />
                    <p className="text-[11px] text-amber-400/90 mt-1">
                      Dhyan dein: Yahan apna personal number enter karein jis number sy ap ny official {currentMethod.name} ({currentMethod.accountNumber}) par paise send kiye hain.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Transaction ID (TID / TRX ID from SMS receipt)
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. 09384729103 or TID48291"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm uppercase focus:outline-none focus:border-emerald-500"
                      required
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Enter the transaction ID received in confirmation SMS or application screen.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                id="btn-submit-deposit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <ArrowDownCircle className="w-5 h-5" />
                Deposit Rs {amount} (+ Rs {calculatedBonus} Bonus)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* User Deposit History Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-extrabold text-white">
                میرے تمام ڈپازٹ ریکارڈز (My Deposit History & Ledger)
              </h3>
              <p className="text-xs text-slate-400">
                آپ کے اب تک کے تمام جمع کردہ فنڈز، 10% کیش بیک بونس اور چلتا ہوا کل بیلنس
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              کل ڈپازٹ: Rs {financialSummary.userTotalDeposited.toLocaleString()} PKR
            </span>
            <button
              type="button"
              onClick={() => openFinanceLedger('deposit')}
              className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg font-bold transition-all"
            >
              مکمل لیجر →
            </button>
          </div>
        </div>

        {deposits.length === 0 ? (
          <div className="py-8 text-center text-slate-400 space-y-1">
            <p className="text-xs">
              آپ نے ابھی تک کوئی ڈپازٹ جمع نہیں کیا۔ اوپر دیے گئے آپشن سے کم از کم 150 روپے جمع کروائیں۔
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-3.5 py-3">تاریخ (Date)</th>
                  <th className="px-3.5 py-3">طریقہ (Method)</th>
                  <th className="px-3.5 py-3">بھیجنے والا اکاؤنٹ</th>
                  <th className="px-3.5 py-3">TID / ٹرانزیکشن ID</th>
                  <th className="px-3.5 py-3">جمع رقم</th>
                  <th className="px-3.5 py-3">10% بونس</th>
                  <th className="px-3.5 py-3">کل کریڈٹ</th>
                  <th className="px-3.5 py-3">حیثیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {deposits.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="px-3.5 py-3 text-slate-300 whitespace-nowrap">{d.date}</td>
                    <td className="px-3.5 py-3 font-bold uppercase text-white whitespace-nowrap">
                      {d.method}
                    </td>
                    <td className="px-3.5 py-3 font-mono text-slate-300 whitespace-nowrap">
                      {d.senderNumber}
                    </td>
                    <td className="px-3.5 py-3 font-mono text-emerald-400 font-bold whitespace-nowrap">
                      {d.transactionId}
                    </td>
                    <td className="px-3.5 py-3 font-bold text-white whitespace-nowrap">
                      Rs {d.amount}
                    </td>
                    <td className="px-3.5 py-3 font-bold text-emerald-400 whitespace-nowrap">
                      +Rs {d.bonusAmount}
                    </td>
                    <td className="px-3.5 py-3 font-black text-emerald-300 whitespace-nowrap">
                      Rs {d.totalCredited}
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <Check className="w-3 h-3" />
                        کامیاب
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
