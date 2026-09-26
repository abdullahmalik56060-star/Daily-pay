import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  ShieldCheck,
  Zap,
  ArrowDownCircle,
  ArrowUpCircle,
  PlayCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Radio,
  Youtube,
  CreditCard,
  Smartphone,
  Wallet,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface HomeSeoContentProps {
  onNavigate: (tab: string) => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

export const HomeSeoContent: React.FC<HomeSeoContentProps> = ({
  onNavigate,
  onOpenDeposit,
  onOpenWithdraw,
}) => {
  const {
    whatsappLink,
    whatsappLink2,
    whatsappChannelLink,
    youtubeChannelLink,
  } = useApp();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is Daily Pay Ads Earning and how do I earn?',
      a: 'Daily Pay Ads Earning is an online advertising engagement platform designed for users seeking structured daily activities in Pakistan. Members with an active 2-month subscription plan view 2 sponsored advertisements each day. When the ad timer completes, the reward is automatically credited directly to your platform wallet balance.',
    },
    {
      q: 'What payment methods are supported for deposits and withdrawals?',
      a: 'We support trusted payment gateways widely used across Pakistan: JazzCash (Mobile Account & *786#), Easypaisa, OPay System, and Debit/Credit Cards. Deposits are credited after submitting your Transaction ID (TID), and withdrawals are sent directly to your registered JazzCash, Easypaisa, or OPay account.',
    },
    {
      q: 'How long do plans last and how many ads do I watch per day?',
      a: 'Every active plan on Daily Pay Ads Earning is valid for 60 days (2 months). Each plan requires viewing exactly 2 sponsored ads every 24 hours. The Starter Plan pays Rs 25 per ad (Rs 50/day), Standard Plan pays Rs 50 per ad (Rs 100/day), and Premium Pro Plan pays Rs 75 per ad (Rs 150/day).',
    },
    {
      q: 'Is there a referral bonus or check-in incentive?',
      a: 'Yes. In addition to daily ad rewards, the platform includes a daily check-in reward, a registration bonus for new verified members, an automatic +10% bonus on deposits, and a referral program allowing you to earn commissions when invited friends activate plans.',
    },
  ];

  return (
    <section
      aria-labelledby="seo-main-heading"
      className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-12 text-slate-200 mt-6"
    >
      {/* 1. H1 & Introduction */}
      <div className="space-y-4 border-b border-slate-800/80 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified Earning Portal
        </div>

        <h1
          id="seo-main-heading"
          className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight"
        >
          Daily Pay Ads Earning
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
          Welcome to <strong className="text-white font-bold">Daily Pay Ads Earning</strong>, an online earning platform that provides transparent daily ad-viewing opportunities, 2-month subscription tiers, and local payment integration for users in Pakistan. Our platform enables registered members to activate fixed 60-day plans, view two curated sponsored advertisements per day, and track their daily earnings, bonuses, deposits, and withdrawals with complete real-time ledger transparency.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('plans')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-extrabold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4" />
            Explore 2-Month Plans
          </button>
          <button
            onClick={onOpenDeposit}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
            Deposit Funds
          </button>
          <button
            onClick={onOpenWithdraw}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <ArrowUpCircle className="w-4 h-4 text-indigo-400" />
            Withdraw Earnings
          </button>
        </div>
      </div>

      {/* 2. "How It Works" Section with 5 Simple Steps */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-extrabold">
                1-5
              </span>
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Five simple steps to get started with Daily Pay Ads Earning
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 self-start sm:self-auto">
            5 Simple Steps
          </span>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Step 1 */}
          <li className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-3 relative group hover:border-emerald-500/40 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Step 01
                </span>
                <CheckCircle2 className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-sm font-extrabold text-white">Create an Account</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sign up quickly with your full name, email address, mobile number, and a secure password. If invited by a friend, enter their referral code.
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-800/60">
              Free registration
            </span>
          </li>

          {/* Step 2 */}
          <li className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-3 relative group hover:border-teal-500/40 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                  Step 02
                </span>
                <Layers className="w-4 h-4 text-slate-600 group-hover:text-teal-400 transition-colors" />
              </div>
              <h3 className="text-sm font-extrabold text-white">Select a 2-Month Plan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose an investment tier that fits your budget: Starter (150 PKR), Standard (300 PKR), or Premium Pro (450 PKR). All plans feature a 60-day validity.
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-800/60">
              60-day duration
            </span>
          </li>

          {/* Step 3 */}
          <li className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-3 relative group hover:border-cyan-500/40 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  Step 03
                </span>
                <ArrowDownCircle className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h3 className="text-sm font-extrabold text-white">Deposit & Verify TID</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Send payment through JazzCash, Easypaisa, OPay, or Card. Submit your transaction ID (TID) to have your balance credited with an automatic bonus.
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-800/60">
              JazzCash • Easypaisa • OPay • Card
            </span>
          </li>

          {/* Step 4 */}
          <li className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-3 relative group hover:border-blue-500/40 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  Step 04
                </span>
                <PlayCircle className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className="text-sm font-extrabold text-white">Watch 2 Daily Ads</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log in every day to view your 2 assigned sponsored advertising campaigns. Watch each ad to completion to claim your daily wallet earnings.
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-800/60">
              2 ads per 24 hours
            </span>
          </li>

          {/* Step 5 */}
          <li className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-3 relative group hover:border-indigo-500/40 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  Step 05
                </span>
                <ArrowUpCircle className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </div>
              <h3 className="text-sm font-extrabold text-white">Withdraw Your Funds</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Submit a withdrawal request to your designated JazzCash, Easypaisa, or OPay number. Track status live in your account transaction history.
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-800/60">
              Direct mobile payouts
            </span>
          </li>
        </ol>
      </div>

      {/* 3. "Plans & Payment Information" Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Wallet className="w-6 h-6 text-emerald-400" />
              Plans & Payment Information
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Available 2-month plans and supported Pakistani payment gateways
            </p>
          </div>
          <button
            onClick={() => onNavigate('plans')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 self-start sm:self-auto flex items-center gap-1"
          >
            Compare All Plans in Detail →
          </button>
        </div>

        {/* The 3 Real Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Starter Plan */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/50 transition-all space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Starter Tier
              </span>
              <span className="text-xs text-slate-400">60 Days</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Starter Plan</h3>
              <p className="text-xs text-slate-400">Ideal for beginners starting with daily ads</p>
            </div>
            <div className="pt-2 border-t border-slate-800/80">
              <p className="text-2xl font-black text-white">
                Rs 150 <span className="text-xs font-normal text-slate-400">PKR</span>
              </p>
            </div>
            <ul className="text-xs space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>2 Ads per day</strong> (Ad 1: Rs 25, Ad 2: Rs 25)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Rs 50 PKR</strong> daily earnings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Rs 3,000 PKR</strong> total 60-day potential</span>
              </li>
            </ul>
          </div>

          {/* Standard Plan */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border-2 border-emerald-500/40 hover:border-emerald-500 transition-all space-y-4 relative shadow-lg shadow-emerald-500/5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Most Popular
              </span>
              <span className="text-xs text-slate-400">60 Days</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Standard Plan</h3>
              <p className="text-xs text-slate-400">Double your daily returns with 2 fast ads</p>
            </div>
            <div className="pt-2 border-t border-slate-800/80">
              <p className="text-2xl font-black text-emerald-400">
                Rs 300 <span className="text-xs font-normal text-slate-400">PKR</span>
              </p>
            </div>
            <ul className="text-xs space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>2 Ads per day</strong> (Ad 1: Rs 50, Ad 2: Rs 50)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Rs 100 PKR</strong> daily earnings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Rs 6,000 PKR</strong> total 60-day potential</span>
              </li>
            </ul>
          </div>

          {/* Premium Pro Plan */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 transition-all space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Maximum Profit
              </span>
              <span className="text-xs text-slate-400">60 Days</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Premium Pro Plan</h3>
              <p className="text-xs text-slate-400">Maximum daily return & highest ad rewards</p>
            </div>
            <div className="pt-2 border-t border-slate-800/80">
              <p className="text-2xl font-black text-white">
                Rs 450 <span className="text-xs font-normal text-slate-400">PKR</span>
              </p>
            </div>
            <ul className="text-xs space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>2 Ads per day</strong> (Ad 1: Rs 75, Ad 2: Rs 75)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Rs 150 PKR</strong> daily earnings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Rs 9,000 PKR</strong> total 60-day potential</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            Accepted Payment Channels & Verification
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Daily Pay Ads Earning accepts deposits through major Pakistani mobile accounts and cards. After sending money, enter the required Transaction ID (TID) to initiate instant review:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/90 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-red-400">
                <Smartphone className="w-3.5 h-3.5" />
                JazzCash
              </div>
              <p className="text-[11px] text-slate-400">Dial *786# or use the JazzCash mobile application to transfer.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/90 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <Wallet className="w-3.5 h-3.5" />
                Easypaisa
              </div>
              <p className="text-[11px] text-slate-400">Telenor Microfinance Bank App with instant 3737 TID confirmation.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/90 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-400">
                <Smartphone className="w-3.5 h-3.5" />
                OPay System
              </div>
              <p className="text-[11px] text-slate-400">OPay digital wallet transfer and QR scan with sequence code tracking.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/90 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-purple-400">
                <CreditCard className="w-3.5 h-3.5" />
                Debit / Credit Card
              </div>
              <p className="text-[11px] text-slate-400">Visa, Mastercard & UnionPay cards supported for direct digital top-up.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Frequently Asked Questions (FAQ) Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-emerald-400" />
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Clear answers to the most common questions about Daily Pay Ads Earning
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">4 Common Questions</span>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-900/60 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-extrabold text-white">
                    {faq.q}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Support / Contact Section */}
      <div className="space-y-6 border-t border-slate-800/80 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-emerald-400" />
              Support & Contact Information
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Get direct assistance with your account, deposits, withdrawals, or plan subscriptions
            </p>
          </div>
          <button
            onClick={() => onNavigate('support')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-all self-start sm:self-auto"
          >
            Open Support Portal →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Helpline 1 */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-2 group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Primary Helpline
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-sm font-extrabold text-white mt-2">WhatsApp Helpline 1</h3>
              <p className="text-xs text-slate-400">0322-5290908</p>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 pt-2 border-t border-slate-800/60">
              <MessageCircle className="w-3.5 h-3.5" />
              Chat on WhatsApp
            </span>
          </a>

          {/* Helpline 2 */}
          <a
            href={whatsappLink2}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-teal-500/50 transition-all flex flex-col justify-between space-y-2 group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                  Secondary Helpline
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition-colors" />
              </div>
              <h3 className="text-sm font-extrabold text-white mt-2">WhatsApp Helpline 2</h3>
              <p className="text-xs text-slate-400">0309-8899212</p>
            </div>
            <span className="text-[11px] text-teal-400 font-semibold flex items-center gap-1 pt-2 border-t border-slate-800/60">
              <MessageCircle className="w-3.5 h-3.5" />
              Chat on WhatsApp
            </span>
          </a>

          {/* Official Channel */}
          <a
            href={whatsappChannelLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-2 group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Official Channel
                </span>
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-sm font-extrabold text-white mt-2">WhatsApp Channel</h3>
              <p className="text-xs text-slate-400">Official updates & announcements</p>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 pt-2 border-t border-slate-800/60">
              Follow Channel
            </span>
          </a>

          {/* YouTube Channel */}
          <a
            href={youtubeChannelLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-red-500/50 transition-all flex flex-col justify-between space-y-2 group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                  Video Guides
                </span>
                <Youtube className="w-3.5 h-3.5 text-red-400" />
              </div>
              <h3 className="text-sm font-extrabold text-white mt-2">YouTube Official</h3>
              <p className="text-xs text-slate-400">Video tutorials & platform proofs</p>
            </div>
            <span className="text-[11px] text-red-400 font-semibold flex items-center gap-1 pt-2 border-t border-slate-800/60">
              Watch on YouTube
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
