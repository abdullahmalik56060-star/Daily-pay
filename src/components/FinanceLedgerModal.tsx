import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Wallet,
  Building2,
  TrendingUp,
  Receipt,
  X,
  ExternalLink,
  ChevronRight,
  Smartphone,
  CreditCard,
  AlertCircle,
} from 'lucide-react';

export const FinanceLedgerModal: React.FC = () => {
  const {
    isFinanceLedgerOpen,
    closeFinanceLedger,
    financeLedgerTab,
    setFinanceLedgerTab,
    financialSummary,
    deposits,
    withdrawals,
    communityPayouts,
    communityDeposits,
    user,
  } = useApp();

  if (!isFinanceLedgerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black shadow-inner">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  فنانشل ٹریکنگ و شفافیت سسٹم
                </h3>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Ledger
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ڈپازٹ اور ودڈرا کا مکمل حساب کتاب: آپ کا ریکارڈ اور لوگوں کا کل پے آؤٹ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeFinanceLedger}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Switch */}
        <div className="px-5 pt-4 pb-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setFinanceLedgerTab('deposit')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              financeLedgerTab === 'deposit'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 hover:bg-slate-850 text-slate-300 border border-slate-800'
            }`}
          >
            <ArrowDownCircle className="w-4 h-4" />
            <span>1. ڈپازٹ سسٹم (آپ کا اور لوگوں کا کل ڈپازٹ)</span>
          </button>

          <button
            type="button"
            onClick={() => setFinanceLedgerTab('withdraw')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              financeLedgerTab === 'withdraw'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900/80 hover:bg-slate-850 text-slate-300 border border-slate-800'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4" />
            <span>2. ودڈرا سسٹم (لوگوں نے اب تک کتنا ودڈرا کیا)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {financeLedgerTab === 'deposit' ? (
            /* TAB 1: DEPOSITS SYSTEM */
            <div className="space-y-6">
              {/* Highlight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* User Personal Deposit Total */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400">آپ کا کل ڈپازٹ</span>
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                      <ArrowDownCircle className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-white mt-2">
                    <span className="text-sm font-bold text-emerald-400 mr-1">Rs</span>
                    {financialSummary.userTotalDeposited.toLocaleString()}
                  </p>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>ڈپازٹ کی تعداد: {financialSummary.userDepositCount} بار</span>
                    <span className="text-emerald-400 font-bold">+{financialSummary.userTotalBonusOnDeposits} بونس</span>
                  </div>
                </div>

                {/* Platform Total Deposited by People */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-teal-300">لوگوں کا کل ڈپازٹ فنڈ</span>
                    <span className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs">
                      <Building2 className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-white mt-2">
                    <span className="text-sm font-bold text-teal-400 mr-1">Rs</span>
                    {financialSummary.platformTotalDeposited.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    تمام پاکستانی صارفین کا کل جمع شدہ فنڈ
                  </p>
                </div>

                {/* Active Depositors count */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-cyan-300">کل ڈپازٹرز</span>
                    <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs">
                      <Users className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-white mt-2">
                    {financialSummary.platformActiveDepositors.toLocaleString()}+
                  </p>
                  <p className="text-[11px] text-emerald-400 font-medium mt-1">
                    تصدیق شدہ ممبرز (JazzCash / EasyPaisa)
                  </p>
                </div>
              </div>

              {/* User Personal Deposit History Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-black text-white">
                      آپ کا انفرادی ڈپازٹ ریکارڈ ({user.firstName || user.name})
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    ریکارڈز: {deposits.length}
                  </span>
                </div>

                {deposits.length === 0 ? (
                  <div className="py-6 text-center space-y-2">
                    <p className="text-xs text-slate-400">
                      آپ نے ابھی تک کوئی رقم ڈپازٹ نہیں کی ہے۔ پلان خریدنے کے لیے ڈپازٹ کریں۔
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                        <tr>
                          <th className="px-3 py-2.5">تاریخ (Date)</th>
                          <th className="px-3 py-2.5">طریقہ (Method)</th>
                          <th className="px-3 py-2.5">بھیجنے والا اکاؤنٹ</th>
                          <th className="px-3 py-2.5">TID / ٹرانزیکشن ID</th>
                          <th className="px-3 py-2.5">جمع رقم</th>
                          <th className="px-3 py-2.5">10% بونس</th>
                          <th className="px-3 py-2.5">کل کریڈٹ</th>
                          <th className="px-3 py-2.5">حیثیت</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {deposits.map((dep) => (
                          <tr key={dep.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="px-3 py-2.5 text-slate-300 whitespace-nowrap">{dep.date}</td>
                            <td className="px-3 py-2.5 font-bold uppercase text-white whitespace-nowrap">
                              {dep.method}
                            </td>
                            <td className="px-3 py-2.5 text-slate-300 font-mono whitespace-nowrap">
                              {dep.senderNumber}
                            </td>
                            <td className="px-3 py-2.5 font-mono text-emerald-400 font-bold whitespace-nowrap">
                              {dep.transactionId}
                            </td>
                            <td className="px-3 py-2.5 font-bold text-white whitespace-nowrap">
                              Rs {dep.amount}
                            </td>
                            <td className="px-3 py-2.5 font-bold text-emerald-400 whitespace-nowrap">
                              +Rs {dep.bonusAmount}
                            </td>
                            <td className="px-3 py-2.5 font-black text-emerald-300 whitespace-nowrap">
                              Rs {dep.totalCredited}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" />
                                تصدیق شدہ
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Public Live Feed of Recent Community Deposits */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-black text-white">
                      پاکستان بھر سے لوگوں کے حالیہ ڈپازٹ (Live Public Deposit Stream)
                    </h4>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                    Real-time
                  </span>
                </div>

                <div className="divide-y divide-slate-800/60 max-h-56 overflow-y-auto">
                  {communityDeposits.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                          <ArrowDownCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white">{item.userName}</span>
                            <span className="text-[11px] text-slate-400 font-mono">({item.phoneMasked})</span>
                            <span className="text-[10px] text-slate-500">• {item.city}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            بذریعہ <strong className="uppercase text-slate-300">{item.method}</strong> • TID: {item.trxId}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-black text-emerald-400">
                          +Rs {item.amount} PKR
                        </p>
                        <span className="text-[10px] text-slate-400">{item.timeAgo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: WITHDRAWAL SYSTEM - PEOPLE PAYOUTS */
            <div className="space-y-6">
              {/* Highlight Banner: How much money people have withdrawn */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950/60 border border-indigo-500/40 relative overflow-hidden">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    لوگوں کو 100% بروقت ادائیگی (5 سے 7 منٹ میں ترسیل)
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    لوگوں نے اب تک کتنا ودڈرا کر لیا ہے؟
                  </h3>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-xl font-bold text-emerald-400">Rs</span>
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                      {financialSummary.platformTotalWithdrawn.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-slate-300">PKR کامیابی سے ادا شدہ</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    Daily Pay کے ذریعے پاکستان بھر میں لوگوں نے یہ رقم اپنے <strong>JazzCash، Easypaisa اور Bank Card</strong> اکاؤنٹس میں 5 سے 7 منٹ کے اندر حاصل کی ہے۔
                  </p>
                </div>
              </div>

              {/* Sub-KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* My Total Withdrawn */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">آپ کا اپنا کل ودڈرا</span>
                    <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">
                      <Wallet className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-2xl font-black text-white mt-2">
                    <span className="text-sm font-bold text-emerald-400 mr-1">Rs</span>
                    {financialSummary.userTotalWithdrawn.toLocaleString()}
                  </p>
                  <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                    <span>درخواستیں: {financialSummary.userWithdrawalCount}</span>
                    <span className="text-emerald-400 font-bold">
                      منظور شدہ: Rs {financialSummary.userCompletedWithdrawn}
                    </span>
                  </div>
                </div>

                {/* Today's paid out */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">آج کی کل ادائیگیاں</span>
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                      <Clock className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-2xl font-black text-emerald-400 mt-2">
                    <span className="text-sm font-bold mr-1">Rs</span>
                    {financialSummary.platformTodayPayouts.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    آج کے دن لوگوں کو موصول شدہ رقم
                  </p>
                </div>

                {/* Delivery Guarantee */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">ترسیل کی رفتار</span>
                    <span className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-2xl font-black text-teal-300 mt-2">
                    5 سے 7 منٹ
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    ایڈمن منظوری کے بعد گارنٹیڈ وصولی
                  </p>
                </div>
              </div>

              {/* Public Live Proofs Table of People Who Withdrew */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-black text-white">
                      لوگوں نے جو ودڈرا وصول کیے (حالیہ عوامی تصدیقی ثبوت)
                    </h4>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    100% Paid Proofs
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      <tr>
                        <th className="px-3 py-2.5">صارف کا نام (Name)</th>
                        <th className="px-3 py-2.5">شہر (City)</th>
                        <th className="px-3 py-2.5">فون نمبر (Phone)</th>
                        <th className="px-3 py-2.5">گیٹ وے (Method)</th>
                        <th className="px-3 py-2.5">وصول شدہ رقم (Payout)</th>
                        <th className="px-3 py-2.5">وقت (Time)</th>
                        <th className="px-3 py-2.5">حیثیت (Status)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {communityPayouts.map((proof) => (
                        <tr key={proof.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="px-3 py-2.5 font-bold text-white whitespace-nowrap">
                            {proof.userName}
                          </td>
                          <td className="px-3 py-2.5 text-slate-300 whitespace-nowrap">
                            {proof.city}
                          </td>
                          <td className="px-3 py-2.5 font-mono text-slate-400 whitespace-nowrap">
                            {proof.phoneMasked}
                          </td>
                          <td className="px-3 py-2.5 font-extrabold uppercase text-slate-200 whitespace-nowrap">
                            {proof.method}
                          </td>
                          <td className="px-3 py-2.5 font-black text-emerald-400 whitespace-nowrap">
                            Rs {proof.amount.toLocaleString()} PKR
                          </td>
                          <td className="px-3 py-2.5 text-slate-400 whitespace-nowrap">
                            {proof.timeAgo}
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" />
                              ادا شدہ (Paid)
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* User's Personal Withdrawals Records */}
              {withdrawals.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-indigo-400" />
                      آپ کے اپنے ودڈرا کی تفصیلات
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">
                      کل: {withdrawals.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {withdrawals.map((w) => (
                      <div
                        key={w.id}
                        className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{w.accountTitle}</span>
                            <span className="font-mono text-slate-400">({w.accountNumber})</span>
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              {w.method}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            ریفرنس: <span className="font-mono font-bold text-slate-300">{w.referenceId}</span> • تاریخ: {w.date}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-black text-emerald-400">Rs {w.netAmount.toLocaleString()}</p>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                              w.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : w.status === 'rejected'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-amber-500/20 text-amber-300 animate-pulse'
                            }`}
                          >
                            {w.status === 'completed'
                              ? 'منظور شدہ اور ادا شدہ'
                              : w.status === 'rejected'
                              ? 'مسترد'
                              : 'زیرِ جائزہ (Pending)'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              100% شفاف لیجر سسٹم: تمام ڈپازٹس اور ودڈرا براہِ راست محفوظ سرور سے تصدیق شدہ ہیں
            </span>
          </div>

          <button
            type="button"
            onClick={closeFinanceLedger}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
          >
            بند کریں (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
