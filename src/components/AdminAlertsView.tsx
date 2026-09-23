import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserLiveAlert } from '../types';
import {
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Trash2,
  CheckCheck,
  CheckCircle2,
  Clock,
  ArrowUpCircle,
  ArrowDownCircle,
  PlayCircle,
  ShieldCheck,
  User,
  Phone,
  Wallet,
  Sparkles,
  ExternalLink,
  Radio,
  X,
  Zap,
} from 'lucide-react';

export const AdminAlertsView: React.FC = () => {
  const {
    userAlerts,
    dismissUserAlert,
    markAlertsAsRead,
    clearAllUserAlerts,
    unreadAlertsCount,
    triggerSoundAlert,
    soundAlertsEnabled,
    setSoundAlertsEnabled,
    approveUserWithdrawal,
    approveUserDeposit,
    withdrawals,
    deposits,
    showToast,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'withdrawal' | 'deposit' | 'ad_watch' | 'plan_buy'>('all');

  const filteredAlerts = userAlerts.filter((alert) => {
    if (activeFilter === 'all') return true;
    return alert.type === activeFilter;
  });

  const withdrawalCount = userAlerts.filter((a) => a.type === 'withdrawal').length;
  const depositCount = userAlerts.filter((a) => a.type === 'deposit').length;
  const adWatchCount = userAlerts.filter((a) => a.type === 'ad_watch').length;

  const handleTestSound = () => {
    triggerSoundAlert();
    showToast('🔔 ٹیسٹ نوٹیفکیشن بیپ پلے کی گئی ہے (Test notification chime played)');
  };

  const handleQuickApproveWithdrawal = (alert: UserLiveAlert) => {
    if (!alert.targetId) {
      showToast('No withdrawal reference found.');
      return;
    }
    const res = approveUserWithdrawal(alert.targetId);
    if (res.success) {
      dismissUserAlert(alert.id);
    }
  };

  const handleQuickApproveDeposit = (alert: UserLiveAlert) => {
    if (!alert.targetId) {
      showToast('No deposit reference found.');
      return;
    }
    const res = approveUserDeposit(alert.targetId);
    if (res.success) {
      dismissUserAlert(alert.id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 shadow-lg">
              {unreadAlertsCount > 0 ? (
                <BellRing className="w-6 h-6 animate-bounce" />
              ) : (
                <Bell className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Radio className="w-3 h-3 animate-pulse text-red-400" />
                  LIVE USER TRACKER
                </span>
                {unreadAlertsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500 text-white animate-pulse">
                    {unreadAlertsCount} NEW
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                صارفین کی لائیو سرگرمیاں اور الرٹ سسٹم (Live User Activity Center)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                جب بھی کوئی صارف نیا ودڈرا لگائے، پیسے جمع کرے، یا ایڈ دیکھے، آپ کو فوراً آواز اور الرٹ کے ذریعے پتہ چلے گا تاکہ آپ بروقت ادائیگیاں کر سکیں۔
              </p>
            </div>
          </div>

          {/* Sound Settings & Batch Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => {
                const nextState = !soundAlertsEnabled;
                setSoundAlertsEnabled(nextState);
                showToast(nextState ? '🔔 نوٹیفکیشن آواز فعال کر دی گئی ہے' : '🔕 نوٹیفکیشن آواز بند کر دی گئی ہے');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                soundAlertsEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Toggle sound chime for user actions"
            >
              {soundAlertsEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              <span>آواز الرٹ: {soundAlertsEnabled ? 'آن (ON)' : 'آف (OFF)'}</span>
            </button>

            {/* Test Sound Button */}
            <button
              type="button"
              onClick={handleTestSound}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700"
              title="Test web audio chime"
            >
              🔊 ٹیسٹ بیپ
            </button>

            {/* Mark All as Read */}
            {unreadAlertsCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  markAlertsAsRead();
                  showToast('تمام الرٹس پڑھ لیے گئے ہیں۔');
                }}
                className="px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                سب پڑھیں
              </button>
            )}

            {/* Clear All */}
            {userAlerts.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('کیا آپ تمام پرانے الرٹس صاف کرنا چاہتے ہیں؟')) {
                    clearAllUserAlerts();
                    showToast('تمام الرٹس صاف کر دیے گئے۔');
                  }
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 transition-colors"
                title="Clear all alerts"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-white text-slate-950 shadow'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>تمام سرگرمیاں (All)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {userAlerts.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('withdrawal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'withdrawal'
                ? 'bg-red-500 text-white shadow'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ArrowUpCircle className="w-3.5 h-3.5 text-red-400" />
            <span>ودڈرا کی درخواستیں (Withdrawals)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-950/60 text-red-300">
              {withdrawalCount === 0 ? '00' : withdrawalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('deposit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'deposit'
                ? 'bg-purple-500 text-white shadow'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ArrowDownCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>ڈپازٹس (Deposits)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-950/60 text-purple-300">
              {depositCount === 0 ? '00' : depositCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('ad_watch')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'ad_watch'
                ? 'bg-blue-500 text-white shadow'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>اشتہارات دیکھیں (Ads Watched)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-950/60 text-blue-300">
              {adWatchCount === 0 ? '00' : adWatchCount}
            </span>
          </button>
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800/80 text-slate-500 flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-300">کوئی نیا الرٹ موجود نہیں</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              جب بھی کوئی صارف ودڈرا کی درخواست دے گا یا ایپ میں کوئی ایکشن لے گا تو فوراً یہاں الرٹ ظاہر ہوگا۔
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isWithdrawal = alert.type === 'withdrawal';
            const isDeposit = alert.type === 'deposit';
            const isAd = alert.type === 'ad_watch';
            const isPlan = alert.type === 'plan_buy';

            return (
              <div
                key={alert.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  !alert.read
                    ? 'bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/5'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left info */}
                  <div className="flex items-start gap-3.5">
                    {/* Icon Badge */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                        isWithdrawal
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : isDeposit
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : isAd
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {isWithdrawal && <ArrowUpCircle className="w-5 h-5" />}
                      {isDeposit && <ArrowDownCircle className="w-5 h-5" />}
                      {isAd && <PlayCircle className="w-5 h-5" />}
                      {isPlan && <Sparkles className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-white">{alert.title}</span>
                        {!alert.read && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-indigo-500 text-white">
                            NEW
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{alert.details}</p>

                      {/* User & Financial Details Strip */}
                      <div className="flex items-center gap-3 flex-wrap pt-1 text-xs text-slate-400">
                        {alert.userName && (
                          <span className="flex items-center gap-1 text-slate-300 font-semibold">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            {alert.userName}
                          </span>
                        )}
                        {alert.userPhone && (
                          <span className="flex items-center gap-1 font-mono text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            {alert.userPhone}
                          </span>
                        )}
                        {alert.paymentMethod && (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium">
                            {alert.paymentMethod}
                          </span>
                        )}
                        {alert.amount !== undefined && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black text-xs">
                            Rs {alert.amount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                    {/* Direct Withdrawal Approval button */}
                    {isWithdrawal && alert.targetId && (
                      <button
                        type="button"
                        onClick={() => handleQuickApproveWithdrawal(alert)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black shadow-md shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-1"
                        title="Deduct from app reserve and mark withdrawal paid"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>منظور کریں (Pay Now)</span>
                      </button>
                    )}

                    {/* Direct Deposit Approval button */}
                    {isDeposit && alert.targetId && (
                      <button
                        type="button"
                        onClick={() => handleQuickApproveDeposit(alert)}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1"
                        title="Approve user deposit and credit user balance"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ڈپازٹ اوکے کریں</span>
                      </button>
                    )}

                    {/* Dismiss alert button */}
                    <button
                      type="button"
                      onClick={() => dismissUserAlert(alert.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="Dismiss alert"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
