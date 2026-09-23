import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { AdsView } from './components/AdsView';
import { PlansView } from './components/PlansView';
import { DepositView } from './components/DepositView';
import { WithdrawView } from './components/WithdrawView';
import { TransactionsView } from './components/TransactionsView';
import { BonusView } from './components/BonusView';
import { SupportView } from './components/SupportView';
import { AdminPortalView } from './components/AdminPortalView';
import { HowItWorksModal } from './components/HowItWorksModal';
import { SocialLinksModal } from './components/SocialLinksModal';
import { AuthModal } from './components/AuthModal';
import { FinanceLedgerModal } from './components/FinanceLedgerModal';
import {
  ShieldCheck,
  RotateCcw,
  Sparkles,
  HelpCircle,
  AlertCircle,
  X,
  CreditCard,
  MessageCircle,
  Youtube,
  Settings,
  Radio,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isSocialLinksModalOpen, setIsSocialLinksModalOpen] = useState<boolean>(false);

  const {
    toastMessage,
    resetAllData,
    whatsappLink,
    whatsappLink2,
    whatsappChannelLink,
    youtubeChannelLink,
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    referralCodeParam,
    openAuthModal,
    isLoggedIn,
    user,
    logoutUser,
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openDepositModal={() => setActiveTab('deposit')}
        openWithdrawModal={() => setActiveTab('withdraw')}
        openHowItWorks={() => setIsHowItWorksOpen(true)}
        openSocialLinksModal={() => setIsSocialLinksModalOpen(true)}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenDeposit={() => setActiveTab('deposit')}
            onOpenWithdraw={() => setActiveTab('withdraw')}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
          />
        )}

        {activeTab === 'ads' && <AdsView onGoToPlans={() => setActiveTab('plans')} />}

        {activeTab === 'plans' && (
          <PlansView
            onOpenDeposit={() => setActiveTab('deposit')}
            onGoToAds={() => setActiveTab('ads')}
          />
        )}

        {activeTab === 'deposit' && (
          <DepositView onSuccess={() => {}} />
        )}

        {activeTab === 'withdraw' && (
          <WithdrawView
            onSuccess={() => {}}
            onGoToDeposit={() => setActiveTab('deposit')}
            onGoToPlans={() => setActiveTab('plans')}
            onGoToAdmin={() => setActiveTab('admin')}
            onGoToAds={() => setActiveTab('ads')}
          />
        )}

        {activeTab === 'history' && <TransactionsView />}

        {activeTab === 'bonus' && <BonusView />}

        {activeTab === 'support' && (
          <SupportView onOpenSocialLinksModal={() => setIsSocialLinksModalOpen(true)} />
        )}

        {activeTab === 'admin' && <AdminPortalView />}
      </main>

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold shadow-2xl flex items-center gap-3 backdrop-blur-md max-w-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="leading-snug">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* How It Works Guide Modal */}
      {isHowItWorksOpen && (
        <HowItWorksModal onClose={() => setIsHowItWorksOpen(false)} />
      )}

      {/* Social & Support Links Management Modal */}
      {isSocialLinksModalOpen && (
        <SocialLinksModal onClose={() => setIsSocialLinksModalOpen(false)} />
      )}

      {/* User Login & Sign Up Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
        referralCode={referralCodeParam}
      />

      {/* Financial Transparency & Ledger System Modal */}
      <FinanceLedgerModal />

      {/* Bottom Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">DailyPay</span>
            <span>•</span>
            <span>2-Month Plans: 150, 300, 450 PKR</span>
            <span>•</span>
            <span>JazzCash • Easypaisa • OPay • Card</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setActiveTab('support')}
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Support Team
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('admin')}
              className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 font-bold"
              title="2-Admin Management Dashboard & Payout Liquidity Vault"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Portal (2 Admins)
            </button>
            <span>•</span>
            <a
              href={whatsappChannelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20"
              title="Official WhatsApp Channel (واٹس ایپ چینل)"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              WhatsApp Channel
            </a>
            <span>•</span>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
              title="WhatsApp Helpline 1: 0322-5290908"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              WhatsApp 1 (03225290908)
            </a>
            <span>•</span>
            <a
              href={whatsappLink2}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1"
              title="WhatsApp Helpline 2: 0309-8899212"
            >
              <MessageCircle className="w-3.5 h-3.5 text-teal-400" />
              WhatsApp 2 (03098899212)
            </a>
            <span>•</span>
            <a
              href={youtubeChannelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <Youtube className="w-3.5 h-3.5" />
              YouTube Channel
            </a>
            <span>•</span>
            <button
              onClick={() => setIsSocialLinksModalOpen(true)}
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 font-semibold bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700"
              title="Paste WhatsApp Channel or Support Links"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              Paste WhatsApp Link
            </button>
            <span>•</span>
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              How It Works
            </button>
            <span>•</span>
            <button
              onClick={resetAllData}
              className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
              title="Reset state to initial sample demo"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Demo
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
