import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionType } from '../types';
import {
  FileText,
  ArrowDownCircle,
  ArrowUpCircle,
  PlayCircle,
  Sparkles,
  Zap,
  Filter,
  Clock,
} from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const { transactions } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'all') return true;
    if (filterType === 'ads') return tx.type === 'ad_earning';
    if (filterType === 'deposit') return tx.type === 'deposit' || tx.type === 'deposit_bonus';
    if (filterType === 'withdraw') return tx.type === 'withdrawal';
    if (filterType === 'plan') return tx.type === 'plan_purchase';
    if (filterType === 'bonus') return tx.type === 'signup_bonus' || tx.type === 'daily_bonus' || tx.type === 'referral_bonus';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Transaction Ledger</h2>
          <p className="text-xs text-slate-400">Complete immutable record of all credits, ad rewards, and payouts</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('ads')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'ads'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
            }`}
          >
            Ads Revenue
          </button>
          <button
            onClick={() => setFilterType('deposit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'deposit'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
            }`}
          >
            Deposits
          </button>
          <button
            onClick={() => setFilterType('withdraw')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'withdraw'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
            }`}
          >
            Withdrawals
          </button>
          <button
            onClick={() => setFilterType('plan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'plan'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
            }`}
          >
            Plans
          </button>
          <button
            onClick={() => setFilterType('bonus')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'bonus'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
            }`}
          >
            Bonuses
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
                <th className="px-5 py-3.5">Type & Description</th>
                <th className="px-5 py-3.5">Reference / Notes</th>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5 text-right">Amount (PKR)</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500 text-xs">
                    No transactions found under this category.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            tx.type === 'ad_earning'
                              ? 'bg-blue-500/10 text-blue-400'
                              : tx.type === 'deposit'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : tx.type === 'withdrawal'
                              ? 'bg-indigo-500/10 text-indigo-400'
                              : tx.type === 'plan_purchase'
                              ? 'bg-purple-500/10 text-purple-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {tx.type === 'ad_earning' && <PlayCircle className="w-4 h-4" />}
                          {tx.type === 'deposit' && <ArrowDownCircle className="w-4 h-4" />}
                          {tx.type === 'withdrawal' && <ArrowUpCircle className="w-4 h-4" />}
                          {tx.type === 'plan_purchase' && <Zap className="w-4 h-4" />}
                          {(tx.type === 'signup_bonus' ||
                            tx.type === 'daily_bonus' ||
                            tx.type === 'referral_bonus' ||
                            tx.type === 'deposit_bonus') && <Sparkles className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs sm:text-sm">{tx.title}</p>
                          <span className="text-[10px] uppercase font-bold text-slate-500">
                            {tx.type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-400 text-xs">
                      {tx.details || (tx.referenceId ? `Ref: ${tx.referenceId}` : '—')}
                    </td>

                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap text-xs">{tx.date}</td>

                    <td className="px-5 py-4 text-right whitespace-nowrap font-bold">
                      <span className={tx.isCredit ? 'text-emerald-400' : 'text-slate-200'}>
                        {tx.isCredit ? '+' : '-'}Rs {tx.amount.toLocaleString()}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      {tx.status === 'processing' ? (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-spin" />
                          Processing (5-7 min)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                          {tx.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
