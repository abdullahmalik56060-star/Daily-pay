import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Plan,
  PlanId,
  UserSubscription,
  PaymentMethod,
  DepositRecord,
  WithdrawalRecord,
  Transaction,
  UserProfile,
  RegisteredUser,
  DailyAdStatus,
  AdCampaign,
  ReferralFriend,
  SupportMessage,
  AdminProfile,
  AdminReserveInjection,
  AdminActivityLog,
  UserLiveAlert,
  UserVisitorLog,
  UserAnalyticsData,
  CommunityPayoutProof,
  CommunityDepositProof,
  SystemFinancialSummary,
} from '../types';
import {
  PLANS,
  SPONSORED_ADS,
  DEFAULT_COMMUNITY_PAYOUTS,
  DEFAULT_COMMUNITY_DEPOSITS,
} from '../data/mockData';

export const LOGIN_BONUS = 25; // Login app bonus: Rs 25 PKR
export const DAILY_BONUS = 5; // Daily check-in bonus: Rs 5 PKR
export const REFERRAL_BONUS = 10; // Reference bonus: Rs 10 PKR per active friend

interface AppContextType {
  balance: number;
  totalEarned: number;
  totalDeposited: number;
  totalWithdrawn: number;
  // Platform & Community Financial System
  platformTotalDeposited: number;
  platformTotalWithdrawn: number;
  platformActiveDepositors: number;
  platformTodayPayouts: number;
  communityPayouts: CommunityPayoutProof[];
  communityDeposits: CommunityDepositProof[];
  financialSummary: SystemFinancialSummary;
  isFinanceLedgerOpen: boolean;
  setIsFinanceLedgerOpen: (open: boolean) => void;
  financeLedgerTab: 'deposit' | 'withdraw';
  setFinanceLedgerTab: (tab: 'deposit' | 'withdraw') => void;
  openFinanceLedger: (tab?: 'deposit' | 'withdraw') => void;
  closeFinanceLedger: () => void;
  activePlan: UserSubscription | null;
  dailyAds: DailyAdStatus;
  adCampaigns: AdCampaign[];
  user: UserProfile;
  // User Authentication & Registration System
  isLoggedIn: boolean;
  loginUser: (identifier: string, password: string) => { success: boolean; message: string };
  registerUser: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    referralCode?: string;
  }) => { success: boolean; message: string };
  logoutUser: () => void;
  registeredUsers: RegisteredUser[];
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  referralCodeParam: string;
  openAuthModal: (mode?: 'login' | 'signup', refCode?: string) => void;
  closeAuthModal: () => void;
  transactions: Transaction[];
  deposits: DepositRecord[];
  withdrawals: WithdrawalRecord[];
  referralFriends: ReferralFriend[];
  dailyCheckInClaimed: boolean;
  whatsappLink: string;
  setWhatsappLink: (link: string) => void;
  whatsappLink2: string;
  setWhatsappLink2: (link: string) => void;
  whatsappChannelLink: string;
  setWhatsappChannelLink: (link: string) => void;
  youtubeChannelLink: string;
  setYoutubeChannelLink: (link: string) => void;
  supportMessages: SupportMessage[];
  sendSupportMessage: (payload: {
    name: string;
    phone: string;
    subject: string;
    message: string;
  }) => { success: boolean; id: string; reply: string };
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // 2 Admins System & App Reserve Liquidity Funding (Protected for Admins Only)
  admins: AdminProfile[];
  currentAdminId: 'admin_1' | 'admin_2';
  currentAdmin: AdminProfile;
  switchAdmin: (adminId: 'admin_1' | 'admin_2', pin?: string) => { success: boolean; message: string };
  updateAdminProfile: (adminId: 'admin_1' | 'admin_2', updates: Partial<AdminProfile>) => void;
  appReserveBalance: number;
  adminInjections: AdminReserveInjection[];
  injectAppReserveFunds: (amount: number, method: string, note?: string) => { success: boolean; message: string };
  adminLogs: AdminActivityLog[];
  approveUserWithdrawal: (withdrawalId: string) => { success: boolean; message: string };
  rejectUserWithdrawal: (withdrawalId: string, reason?: string) => { success: boolean; message: string };
  approveUserDeposit: (depositId: string) => { success: boolean; message: string };
  // Admin Auth Gate (Protected - regular users cannot access without PIN)
  isAdminLoggedIn: boolean;
  adminLogin: (adminId: 'admin_1' | 'admin_2', pin: string) => { success: boolean; message: string };
  adminLogout: () => void;
  adminLoginModalOpen: boolean;
  setAdminLoginModalOpen: (open: boolean) => void;
  // Real-time User Tracking & Alerts ("jb koi user aye/kare to pata chaly")
  userAlerts: UserLiveAlert[];
  dismissUserAlert: (id: string) => void;
  markAlertsAsRead: () => void;
  clearAllUserAlerts: () => void;
  unreadAlertsCount: number;
  triggerSoundAlert: () => void;
  soundAlertsEnabled: boolean;
  setSoundAlertsEnabled: (enabled: boolean) => void;
  // User Analytics & Visitors (Protected - visible to Admin only, hidden from users)
  userAnalytics: UserAnalyticsData;
  recordVisitorLog: (action: string, city?: string, device?: string) => void;
  resetHiddenAnalyticsToZero: () => void;
  // Public Announcement from Admin to all users
  adminAnnouncement: string | null;
  setAdminAnnouncement: (msg: string | null) => void;
  // Actions
  buyPlan: (planId: PlanId) => { success: boolean; message: string };
  depositFunds: (
    method: PaymentMethod,
    amount: number,
    senderNumber: string,
    transactionId: string
  ) => { success: boolean; message: string; deposit: DepositRecord };
  withdrawFunds: (
    method: PaymentMethod,
    amount: number,
    accountTitle: string,
    accountNumber: string
  ) => { success: boolean; message: string; withdrawal?: WithdrawalRecord };
  completeWithdrawalNow: (withdrawalId?: string) => void;
  watchAd: (adNumber: 1 | 2) => { success: boolean; reward: number; message: string };
  saveAdCampaign: (campaign: AdCampaign) => void;
  resetAdCampaigns: () => void;
  getCampaignForSlot: (slot: 1 | 2) => AdCampaign;
  claimDailyCheckIn: () => { success: boolean; amount: number; message: string };
  claimReferralBonus: (friendPhone: string, friendName?: string) => { success: boolean; amount: number; message: string };
  inviteFriend: (friendPhone: string, friendName?: string) => { success: boolean; message: string };
  activateFriendPlan: (friendId: string, planName?: string) => { success: boolean; message: string };
  simulateNextDay: () => void;
  fastForwardDays: (days?: number) => void;
  getWithdrawalCooldown: () => {
    inCooldown: boolean;
    remainingDays: number;
    remainingHours: number;
    remainingMinutes: number;
    formatted: string;
    nextAvailableDate: string;
  } | null;
  resetAllData: () => void;
  minWithdrawal: number;
  maxWithdrawal: number;
  withdrawalIntervalDays: number;
  loginBonus: number;
  dailyBonus: number;
  referralBonus: number;
}

export const MIN_WITHDRAWAL = 500;
export const MAX_WITHDRAWAL = 1000;
export const WITHDRAWAL_INTERVAL_DAYS = 4;
export const WITHDRAWAL_INTERVAL_MS = 4 * 24 * 60 * 60 * 1000;

const STORAGE_KEY = 'dailypay_earnings_state_v2';

const getTodayDateStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const todayStr = getTodayDateStr();

  // Initial State Loading from LocalStorage
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_balance`);
    return saved !== null ? Number(saved) : LOGIN_BONUS; // default 25 PKR login/app bonus!
  });

  const [totalEarned, setTotalEarned] = useState<number>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_totalEarned`);
    return saved !== null ? Number(saved) : LOGIN_BONUS;
  });

  const [totalDeposited, setTotalDeposited] = useState<number>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_totalDeposited`);
    return saved !== null ? Number(saved) : 0;
  });

  const [totalWithdrawn, setTotalWithdrawn] = useState<number>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_totalWithdrawn`);
    return saved !== null ? Number(saved) : 0;
  });

  const [activePlan, setActivePlan] = useState<UserSubscription | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_activePlan`);
    return saved ? JSON.parse(saved) : null;
  });

  const [dailyAds, setDailyAds] = useState<DailyAdStatus>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_dailyAds`);
    if (saved) {
      const parsed: DailyAdStatus = JSON.parse(saved);
      if (parsed.date === todayStr) {
        return parsed;
      }
    }
    return {
      date: todayStr,
      ad1Watched: false,
      ad2Watched: false,
    };
  });

  const [dailyCheckInClaimed, setDailyCheckInClaimed] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_checkin_${todayStr}`);
    return saved === 'true';
  });

  const [adCampaigns, setAdCampaigns] = useState<AdCampaign[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_adCampaigns`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return SPONSORED_ADS;
      }
    }
    return SPONSORED_ADS;
  });

  const DEFAULT_REGISTERED_USERS: RegisteredUser[] = [
    {
      id: 'usr_default_1',
      firstName: 'Abdullah',
      lastName: 'Malik',
      name: 'Abdullah Malik',
      email: 'user@dailypay.pk',
      phone: '03001234567',
      password: 'password123',
      referralCode: 'DP-786',
      joinedDate: '2026-09-10',
    },
    {
      id: 'usr_default_2',
      firstName: 'Hamza',
      lastName: 'Ali',
      name: 'Hamza Ali',
      email: 'hamza@dailypay.pk',
      phone: '03225290908',
      password: 'password123',
      referralCode: 'DP-1002',
      joinedDate: '2026-09-15',
    },
  ];

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_registeredUsers`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_REGISTERED_USERS;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_isLoggedIn`);
    return saved !== null ? saved === 'true' : true;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      name: 'Abdullah Malik',
      firstName: 'Abdullah',
      lastName: 'Malik',
      phone: '03001234567',
      email: 'user@dailypay.pk',
      password: 'password123',
      referralCode: 'DP-786',
      joinedDate: '2026-09-10',
    };
  });

  // URL query parameter referral & auth detection
  const [referralCodeParam, setReferralCodeParam] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('ref') || params.get('referral') || '';
    } catch {
      return '';
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const hasRef = !!(params.get('ref') || params.get('referral'));
      const hasAuth = !!(params.get('auth') || params.get('action'));
      return hasRef || hasAuth;
    } catch {
      return false;
    }
  });

  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('auth') === 'login' || params.get('action') === 'login') return 'login';
      return 'signup';
    } catch {
      return 'signup';
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_transactions`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'tx-welcome-1',
        type: 'signup_bonus',
        title: 'App Login / Sign-up Bonus',
        amount: LOGIN_BONUS,
        isCredit: true,
        date: new Date().toLocaleDateString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'success',
        details: 'Free login app bonus (Rs 25 PKR) credited into wallet',
      },
    ];
  });

  const [deposits, setDeposits] = useState<DepositRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_deposits`);
    return saved ? JSON.parse(saved) : [];
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_withdrawals`);
    return saved ? JSON.parse(saved) : [];
  });

  // Base platform community benchmarks (PKR)
  const PLATFORM_BASE_DEPOSITED = 2845000;
  const PLATFORM_BASE_WITHDRAWN = 1468500;

  const [communityPayouts, setCommunityPayouts] = useState<CommunityPayoutProof[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_communityPayouts`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_COMMUNITY_PAYOUTS;
  });

  const [communityDeposits, setCommunityDeposits] = useState<CommunityDepositProof[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_communityDeposits`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_COMMUNITY_DEPOSITS;
  });

  const [isFinanceLedgerOpen, setIsFinanceLedgerOpen] = useState<boolean>(false);
  const [financeLedgerTab, setFinanceLedgerTab] = useState<'deposit' | 'withdraw'>('deposit');

  const openFinanceLedger = (tab: 'deposit' | 'withdraw' = 'deposit') => {
    setFinanceLedgerTab(tab);
    setIsFinanceLedgerOpen(true);
  };

  const closeFinanceLedger = () => {
    setIsFinanceLedgerOpen(false);
  };

  // Referral friends list (Friends stay in demo mode until they choose a plan)
  const [referralFriends, setReferralFriends] = useState<ReferralFriend[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_referralFriends`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [
      {
        id: 'ref-1',
        name: 'Ali Khan',
        phone: '0301-4455667',
        joinedDate: '2026-09-12',
        status: 'active',
        planName: 'Plan 1 (Rs 150)',
        bonusEarned: REFERRAL_BONUS,
      },
      {
        id: 'ref-2',
        name: 'Usman Tariq',
        phone: '0322-9988771',
        joinedDate: '2026-09-14',
        status: 'demo_inactive',
        bonusEarned: 0,
      },
      {
        id: 'ref-3',
        name: 'Hamza Bilal',
        phone: '0345-1122334',
        joinedDate: '2026-09-14',
        status: 'demo_inactive',
        bonusEarned: 0,
      },
    ];
  });

  // WhatsApp and YouTube Channel Link states
  const [whatsappLink, setWhatsappLinkState] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_whatsappLink`);
    // Migrate to requested primary helpline 03225290908 if empty, dummy, or old 03249154224
    if (!saved || saved.includes('03001234567') || saved.includes('923001234567') || saved.includes('03249154224') || saved.includes('923249154224')) {
      return 'https://wa.me/923225290908';
    }
    return saved;
  });

  const [whatsappLink2, setWhatsappLink2State] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_whatsappLink2`);
    // Secondary helpline 03098899212
    if (!saved) {
      return 'https://wa.me/923098899212';
    }
    return saved;
  });

  const [whatsappChannelLink, setWhatsappChannelLinkState] = useState<string>(() => {
    return (
      localStorage.getItem(`${STORAGE_KEY}_whatsappChannelLink`) ||
      'https://whatsapp.com/channel/0029Vb3xXYZ_DailyPayOfficial'
    );
  });

  const [youtubeChannelLink, setYoutubeChannelLinkState] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_youtubeChannelLink`) || 'https://www.youtube.com/@DailyPayPakistan';
  });

  const setWhatsappLink = (link: string) => {
    let cleanLink = link.trim();
    if (/^03[0-9]{9}$/.test(cleanLink)) {
      cleanLink = `https://wa.me/92${cleanLink.substring(1)}`;
    }
    setWhatsappLinkState(cleanLink);
    localStorage.setItem(`${STORAGE_KEY}_whatsappLink`, cleanLink);
    showToast('WhatsApp Helpline #1 (03225290908) updated!');
  };

  const setWhatsappLink2 = (link: string) => {
    let cleanLink = link.trim();
    if (/^03[0-9]{9}$/.test(cleanLink)) {
      cleanLink = `https://wa.me/92${cleanLink.substring(1)}`;
    }
    setWhatsappLink2State(cleanLink);
    localStorage.setItem(`${STORAGE_KEY}_whatsappLink2`, cleanLink);
    showToast('WhatsApp Helpline #2 (03098899212) updated!');
  };

  const setWhatsappChannelLink = (link: string) => {
    let cleanLink = link.trim();
    if (cleanLink && !cleanLink.startsWith('http://') && !cleanLink.startsWith('https://')) {
      cleanLink = `https://${cleanLink}`;
    }
    setWhatsappChannelLinkState(cleanLink);
    localStorage.setItem(`${STORAGE_KEY}_whatsappChannelLink`, cleanLink);
    showToast('WhatsApp چینل کا لنک کامیابی سے محفوظ کر دیا گیا ہے!');
  };

  const setYoutubeChannelLink = (link: string) => {
    const cleanLink = link.trim();
    setYoutubeChannelLinkState(cleanLink);
    localStorage.setItem(`${STORAGE_KEY}_youtubeChannelLink`, cleanLink);
    showToast('Official YouTube channel link updated successfully!');
  };

  // Support Team Messages
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_supportMessages`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [
      {
        id: 'sup-init-1',
        ticketId: 'TKT-9482',
        name: 'Abdullah Malik',
        phone: '0300-1234567',
        subject: 'General Welcome & Help',
        message: 'Assalam o Alaikum, mujhe janna hai ke ads dekh kar daily kitni earning ho sakti hai?',
        date: 'Today, 10:30 AM',
        status: 'replied',
        reply:
          'Walekum Assalam! Plan 1 (Rs 150) se daily Rs 50 (25+25 Rs), Plan 2 (Rs 300) se daily Rs 100, aur Plan 3 (Rs 450) se daily Rs 150 earning hoti hai. Daily sirf 2 YouTube ads dekhni hoti hain. Koi bhi masla ho to aap humare WhatsApp par bhi rabta kar sakte hain!',
        repliedAt: 'Today, 10:32 AM',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_supportMessages`, JSON.stringify(supportMessages));
  }, [supportMessages]);

  const sendSupportMessage = (payload: {
    name: string;
    phone: string;
    subject: string;
    message: string;
  }) => {
    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toLocaleDateString('en-PK', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let autoReply =
      'Shukriya! Aap ka message Daily Pay Customer Support Team ko mil gaya hai. Hamare representative bohot jald aap ke number par rabta karenge. Agar urgent ho to aap direct WhatsApp par bhi message kar sakte hain!';

    const lower = (payload.message + ' ' + payload.subject).toLowerCase();
    if (lower.includes('withdraw') || lower.includes('paisa') || lower.includes('jazzcash') || lower.includes('opay')) {
      autoReply =
        'Withdrawal Information: Withdrawals JazzCash, Easypaisa, OPay aur Card par available hain. Minimum Rs 500 se Rs 1,000 tak har 4 din bad withdraw kar sakte hain. Request submit hone ke 5 se 7 minute ke andar raqam aap ke account mein received ho jati hai! Note: Withdrawal ke liye pehle koi earning plan (150, 300, 450) lena zaroori hai.';
    } else if (lower.includes('deposit') || lower.includes('plan') || lower.includes('buy')) {
      autoReply =
        'Deposit & Plan Help: JazzCash (03706486965 - Naveed Ahmad), Easypaisa (03174679161 - tanveer ahmad) ya OPay (03098899212 - shamshad akhtar) par payment bhej kar TID copy karein. Deposit par 10% extra bonus milta hai!';
    } else if (lower.includes('add') || lower.includes('ad') || lower.includes('video') || lower.includes('youtube')) {
      autoReply =
        'YouTube Ads Task: Rozana strictly 2 YouTube sponsored ads dekhni hoti hain (10 seconds view). Video dekhne ke bad aasan sawal ka jawab dein aur apna daily reward wallet me hasil karein.';
    }

    const newMsg: SupportMessage = {
      id: `sup-${Date.now()}`,
      ticketId,
      name: payload.name.trim() || 'User',
      phone: payload.phone.trim(),
      subject: payload.subject.trim() || 'General Inquiry',
      message: payload.message.trim(),
      date: now,
      status: 'replied',
      reply: autoReply,
      repliedAt: now,
    };

    setSupportMessages((prev) => [newMsg, ...prev]);
    showToast(`Support Ticket ${ticketId} created! Support team replied.`);

    return {
      success: true,
      id: newMsg.id,
      reply: autoReply,
    };
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'signup', refCode?: string) => {
    if (refCode) {
      setReferralCodeParam(refCode);
    }
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginUser = (identifier: string, pass: string): { success: boolean; message: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhoneDigits = cleanId.replace(/[^0-9]/g, '');

    // Search for match in registered users
    const matchedUser = registeredUsers.find((u) => {
      const uEmail = (u.email || '').toLowerCase().trim();
      const uPhoneDigits = (u.phone || '').replace(/[^0-9]/g, '');
      const emailMatches = uEmail === cleanId;
      const phoneMatches =
        cleanPhoneDigits.length >= 10 &&
        (uPhoneDigits.endsWith(cleanPhoneDigits.slice(-10)) || cleanPhoneDigits.endsWith(uPhoneDigits.slice(-10)));
      return emailMatches || phoneMatches;
    });

    if (matchedUser) {
      if (matchedUser.password && matchedUser.password !== pass) {
        return { success: false, message: 'غلط پاس ورڈ! براہ کرم درست پاس ورڈ درج کریں۔' };
      }
      const updatedProfile: UserProfile = {
        name: matchedUser.name,
        firstName: matchedUser.firstName,
        lastName: matchedUser.lastName,
        email: matchedUser.email,
        phone: matchedUser.phone,
        password: matchedUser.password,
        referralCode: matchedUser.referralCode,
        joinedDate: matchedUser.joinedDate,
      };
      setUser(updatedProfile);
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(updatedProfile));
      setIsLoggedIn(true);
      localStorage.setItem(`${STORAGE_KEY}_isLoggedIn`, 'true');
      showToast(`خوش آمدید ${matchedUser.firstName}! آپ کامیابی سے لاگ ان ہو چکے ہیں۔`);
      return { success: true, message: `خوش آمدید ${matchedUser.firstName}!` };
    }

    // Friendly auto-account creation/demo login if credentials look valid
    if (identifier.trim().length >= 4 && pass.length >= 4) {
      const isEmail = identifier.includes('@');
      const prefix = isEmail ? identifier.split('@')[0] : 'Member';
      const capName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      const newRegUser: RegisteredUser = {
        id: `usr_${Date.now()}`,
        firstName: capName,
        lastName: 'User',
        name: `${capName} User`,
        email: isEmail ? identifier.trim() : `${cleanPhoneDigits || 'user'}@dailypay.pk`,
        phone: !isEmail ? identifier.trim() : '03001234567',
        password: pass,
        referralCode: `DP-${Math.floor(1000 + Math.random() * 9000)}`,
        joinedDate: getTodayDateStr(),
      };
      const updatedList = [newRegUser, ...registeredUsers];
      setRegisteredUsers(updatedList);
      localStorage.setItem(`${STORAGE_KEY}_registeredUsers`, JSON.stringify(updatedList));

      const updatedProfile: UserProfile = {
        name: newRegUser.name,
        firstName: newRegUser.firstName,
        lastName: newRegUser.lastName,
        email: newRegUser.email,
        phone: newRegUser.phone,
        password: newRegUser.password,
        referralCode: newRegUser.referralCode,
        joinedDate: newRegUser.joinedDate,
      };
      setUser(updatedProfile);
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(updatedProfile));
      setIsLoggedIn(true);
      localStorage.setItem(`${STORAGE_KEY}_isLoggedIn`, 'true');
      showToast(`خوش آمدید ${updatedProfile.name}!`);
      return { success: true, message: `خوش آمدید ${updatedProfile.name}!` };
    }

    return {
      success: false,
      message: 'درست ای میل یا فون نمبر اور پاس ورڈ درج کریں، یا Sign Up پر جا کر نیا اکاؤنٹ بنائیں۔',
    };
  };

  const registerUser = (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    referralCode?: string;
  }): { success: boolean; message: string } => {
    const fName = data.firstName.trim();
    const lName = data.lastName.trim();
    const fullName = `${fName} ${lName}`.trim() || fName;
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPhone = data.phone.trim();

    if (!fName) {
      return { success: false, message: 'پہلا نام (First Name) درج کرنا لازمی ہے۔' };
    }
    if (!lName) {
      return { success: false, message: 'دوسرا نام (2nd Name) درج کرنا لازمی ہے۔' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'درست ای میل ایڈریس درج کریں۔ (Valid email required)' };
    }
    const digits = cleanPhone.replace(/[^0-9]/g, '');
    if (digits.length < 10) {
      return { success: false, message: 'درست موبائل فون نمبر درج کریں۔ (مثال: 03001234567)' };
    }
    if (!data.password || data.password.length < 4) {
      return { success: false, message: 'پاس ورڈ کم از کم 4 حروف کا ہونا چاہیے۔' };
    }

    // Check duplicate
    const duplicate = registeredUsers.some(
      (u) =>
        u.email.toLowerCase() === cleanEmail ||
        u.phone.replace(/[^0-9]/g, '').endsWith(digits.slice(-10))
    );
    if (duplicate) {
      return {
        success: false,
        message: 'یہ ای میل یا فون نمبر پہلے سے رجسٹرڈ ہے۔ براہ کرم لاگ ان کریں۔ (Already registered, please login)',
      };
    }

    const newCode = `DP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRegUser: RegisteredUser = {
      id: `usr_${Date.now()}`,
      firstName: fName,
      lastName: lName,
      name: fullName,
      email: cleanEmail,
      phone: cleanPhone,
      password: data.password,
      referralCode: newCode,
      joinedDate: getTodayDateStr(),
    };

    const updatedUsers = [newRegUser, ...registeredUsers];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem(`${STORAGE_KEY}_registeredUsers`, JSON.stringify(updatedUsers));

    const newProfile: UserProfile = {
      name: fullName,
      firstName: fName,
      lastName: lName,
      email: cleanEmail,
      phone: cleanPhone,
      password: data.password,
      referralCode: newCode,
      referredBy: data.referralCode?.trim() || undefined,
      joinedDate: getTodayDateStr(),
    };
    setUser(newProfile);
    localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(newProfile));
    setIsLoggedIn(true);
    localStorage.setItem(`${STORAGE_KEY}_isLoggedIn`, 'true');

    // Credit Welcome Signup Bonus Rs 25
    setBalance((prev) => prev + LOGIN_BONUS);
    setTotalEarned((prev) => prev + LOGIN_BONUS);
    const bonusTx: Transaction = {
      id: `tx-welcome-${Date.now()}`,
      type: 'signup_bonus',
      title: 'Welcome Sign-up Bonus',
      amount: LOGIN_BONUS,
      isCredit: true,
      date: new Date().toLocaleDateString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'success',
      details: `Free welcome signup bonus (Rs ${LOGIN_BONUS} PKR) credited for ${fullName}`,
    };
    setTransactions((prev) => [bonusTx, ...prev]);

    if (data.referralCode?.trim()) {
      showToast(`🎉 مبارک ہو ${fName}! آپ کو ریفرل کوڈ کے تحت 25 روپے ویلکم بونس مل گیا!`);
    } else {
      showToast(`🎉 مبارک ہو ${fName}! آپ کا اکاؤنٹ بن گیا اور 25 روپے ویلکم بونس والٹ میں شامل ہو گیا!`);
    }

    return {
      success: true,
      message: `اکاؤنٹ بن گیا اور 25 روپے ویلکم بونس شامل کر دیا گیا۔`,
    };
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    localStorage.setItem(`${STORAGE_KEY}_isLoggedIn`, 'false');
    showToast('آپ کامیابی سے لاگ آؤٹ ہو چکے ہیں۔');
  };

  // 2 Admins System Configuration
  const DEFAULT_ADMINS: AdminProfile[] = [
    {
      id: 'admin_1',
      name: 'Hamza Malik',
      title: 'Admin 1 (Primary Owner)',
      phone: '03225290908',
      whatsapp: 'https://wa.me/923225290908',
      avatarColor: 'from-emerald-500 to-teal-600',
      pin: '0675',
      active: true,
    },
    {
      id: 'admin_2',
      name: 'Co-Owner Admin 2',
      title: 'Admin 2 (Co-Partner & Finance)',
      phone: '03098899212',
      whatsapp: 'https://wa.me/923098899212',
      avatarColor: 'from-indigo-500 to-purple-600',
      pin: '0021',
      active: true,
    },
  ];

  const [admins, setAdmins] = useState<AdminProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_admins`);
    if (saved) {
      try {
        const parsed: AdminProfile[] = JSON.parse(saved);
        // Ensure Admin 1 name is Hamza Malik with PIN 0675 and updated helpline 03225290908
        return parsed.map((a) => {
          if (a.id === 'admin_1') {
            return {
              ...a,
              name: 'Hamza Malik',
              pin: '0675',
              phone: a.phone === '03249154224' ? '03225290908' : (a.phone || '03225290908'),
              whatsapp: (a.whatsapp && (a.whatsapp.includes('9154224') || a.whatsapp.includes('03249154224')))
                ? 'https://wa.me/923225290908'
                : (a.whatsapp || 'https://wa.me/923225290908'),
            };
          }
          if (a.id === 'admin_2') {
            return {
              ...a,
              pin: '0021',
            };
          }
          return a;
        });
      } catch {}
    }
    return DEFAULT_ADMINS;
  });

  const [currentAdminId, setCurrentAdminId] = useState<'admin_1' | 'admin_2'>('admin_1');

  const currentAdmin = useMemo(() => {
    return admins.find((a) => a.id === currentAdminId) || admins[0];
  }, [admins, currentAdminId]);

  // App Reserve Pool for user ads earning payouts (User requirement: "as app my ham pesy dal saky ky koi jb band adds dak kr kamay to withdraw kr sakhy")
  const [appReserveBalance, setAppReserveBalance] = useState<number>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_appReserveBalance`);
    return saved !== null ? Number(saved) : 50000; // Rs 50,000 initial liquidity vault
  });

  const [adminInjections, setAdminInjections] = useState<AdminReserveInjection[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_adminInjections`);
    if (saved) {
      try {
        const parsed: AdminReserveInjection[] = JSON.parse(saved);
        return parsed.map((inj) =>
          inj.adminId === 'admin_1' && inj.adminName === 'Abdullah Malik'
            ? { ...inj, adminName: 'Hamza Malik' }
            : inj
        );
      } catch {}
    }
    return [
      {
        id: 'inj-init-1',
        adminId: 'admin_1',
        adminName: 'Hamza Malik',
        amount: 50000,
        method: 'JazzCash Business Reserve',
        date: 'Yesterday, 04:00 PM',
        timestamp: Date.now() - 86400000,
        note: 'Initial liquidity reserve funded by Hamza Malik (Admin 1) so users can withdraw their ads earnings smoothly',
      },
    ];
  });

  const [adminLogs, setAdminLogs] = useState<AdminActivityLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_adminLogs`);
    if (saved) {
      try {
        const parsed: AdminActivityLog[] = JSON.parse(saved);
        return parsed.map((l) =>
          l.adminId === 'admin_1' && l.adminName === 'Abdullah Malik'
            ? { ...l, adminName: 'Hamza Malik' }
            : l
        );
      } catch {}
    }
    return [
      {
        id: 'log-init-1',
        adminId: 'admin_1',
        adminName: 'Hamza Malik',
        action: 'App Reserve Liquidity Funded',
        details: 'Admin 1 (Hamza Malik) funded Rs 50,000 into App Payout Reserve Vault.',
        date: 'Yesterday',
        timestamp: Date.now() - 86400000,
      },
      {
        id: 'log-init-2',
        adminId: 'admin_2',
        adminName: 'Co-Owner Admin 2',
        action: 'Admin 2 Active',
        details: 'Co-Admin 2 (03098899212) linked to platform controls.',
        date: 'Yesterday',
        timestamp: Date.now() - 80000000,
      },
    ];
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_admins`, JSON.stringify(admins));
  }, [admins]);

  // Admin Login Session State (Admin options are hidden from regular users)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_admin_logged_in`) === 'true';
  });

  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState<boolean>(false);

  // Sound alert preference
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_sound_alerts`) !== 'false';
  });

  // Admin Broadcast Announcement (shows on users' screen)
  const [adminAnnouncement, setAdminAnnouncement] = useState<string | null>(() => {
    return (
      localStorage.getItem(`${STORAGE_KEY}_announcement`) ||
      'ایپ میں فنڈز اور لیکیویڈیٹی موجود ہے، آپ سب روزانہ اشتہارات دیکھ کر 5 سے 7 منٹ میں ودڈرا حاصل کر سکتے ہیں!'
    );
  });

  // Live User Activity & Alerts (Admin only - set to empty so alerts counter starts at 00)
  const [userAlerts, setUserAlerts] = useState<UserLiveAlert[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_userAlerts`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && !parsed.some((a) => a.id?.startsWith('alert-init-'))) {
          return parsed;
        }
      } catch {}
    }
    return [];
  });

  // User Traffic & Analytics (Protected - visible to Admin only, hidden from users)
  // "User ko jo chezz nazar na ay un sab ko 00 karo" -> All hidden metrics initialized to 0 / 00
  const [userAnalytics, setUserAnalytics] = useState<UserAnalyticsData>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_userAnalytics`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If it contains the old mock data (1482 users, 395 visitors), reset completely to 00
        if (parsed.totalUsers === 1482 || parsed.todayVisitors === 395) {
          return {
            totalUsers: 0,
            todayVisitors: 0,
            onlineNow: 0,
            newUsersToday: 0,
            totalAdsWatched: 0,
            activePlanSubscribers: {
              plan150: 0,
              plan300: 0,
              plan450: 0,
            },
            visitorLogs: [],
          };
        }
        return parsed;
      } catch {}
    }
    return {
      totalUsers: 0,
      todayVisitors: 0,
      onlineNow: 0,
      newUsersToday: 0,
      totalAdsWatched: 0,
      activePlanSubscribers: {
        plan150: 0,
        plan300: 0,
        plan450: 0,
      },
      visitorLogs: [],
    };
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_userAnalytics`, JSON.stringify(userAnalytics));
  }, [userAnalytics]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_userAlerts`, JSON.stringify(userAlerts));
  }, [userAlerts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sound_alerts`, soundAlertsEnabled.toString());
  }, [soundAlertsEnabled]);

  useEffect(() => {
    if (adminAnnouncement) {
      localStorage.setItem(`${STORAGE_KEY}_announcement`, adminAnnouncement);
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_announcement`);
    }
  }, [adminAnnouncement]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_appReserveBalance`, appReserveBalance.toString());
  }, [appReserveBalance]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_adminInjections`, JSON.stringify(adminInjections));
  }, [adminInjections]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_adminLogs`, JSON.stringify(adminLogs));
  }, [adminLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_balance`, balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_totalEarned`, totalEarned.toString());
  }, [totalEarned]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_totalDeposited`, totalDeposited.toString());
  }, [totalDeposited]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_totalWithdrawn`, totalWithdrawn.toString());
  }, [totalWithdrawn]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_referralFriends`, JSON.stringify(referralFriends));
  }, [referralFriends]);

  useEffect(() => {
    if (activePlan) {
      localStorage.setItem(`${STORAGE_KEY}_activePlan`, JSON.stringify(activePlan));
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_activePlan`);
    }
  }, [activePlan]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_dailyAds`, JSON.stringify(dailyAds));
  }, [dailyAds]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_transactions`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_deposits`, JSON.stringify(deposits));
  }, [deposits]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_withdrawals`, JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_adCampaigns`, JSON.stringify(adCampaigns));
  }, [adCampaigns]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_communityPayouts`, JSON.stringify(communityPayouts));
  }, [communityPayouts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_communityDeposits`, JSON.stringify(communityDeposits));
  }, [communityDeposits]);

  // Financial system metrics calculation
  const financialSummary: SystemFinancialSummary = useMemo(() => {
    const userTotalBonusOnDeposits = deposits.reduce((sum, d) => sum + (d.bonusAmount || 0), 0);
    const userCompletedWithdrawn = withdrawals
      .filter((w) => w.status === 'completed')
      .reduce((sum, w) => sum + w.netAmount, 0);
    const userPendingWithdrawn = withdrawals
      .filter((w) => w.status === 'pending' || w.status === 'processing')
      .reduce((sum, w) => sum + w.netAmount, 0);

    return {
      userTotalDeposited: totalDeposited,
      userDepositCount: deposits.length,
      userTotalBonusOnDeposits,
      userTotalWithdrawn: totalWithdrawn,
      userWithdrawalCount: withdrawals.length,
      userCompletedWithdrawn,
      userPendingWithdrawn,
      platformTotalDeposited: PLATFORM_BASE_DEPOSITED + totalDeposited,
      platformTotalWithdrawn: PLATFORM_BASE_WITHDRAWN + totalWithdrawn,
      platformActiveDepositors: 4128 + (deposits.length > 0 ? 1 : 0),
      platformTodayPayouts: 74500 + totalWithdrawn,
    };
  }, [totalDeposited, totalWithdrawn, deposits, withdrawals]);

  // Note: Withdrawals strictly require Admin Approval ("jb log withdrawal ly wo request sambit kary or admin approve kary per withdrawal ho")
  // Automatically persists withdrawals


  const completeWithdrawalNow = (withdrawalId?: string) => {
    const nowStr = new Date().toLocaleDateString('en-PK', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let foundTarget: WithdrawalRecord | null = null;
    setWithdrawals((prev) => {
      let changed = false;
      const next = prev.map((w) => {
        if ((withdrawalId && w.id === withdrawalId) || (!withdrawalId && w.status === 'processing')) {
          changed = true;
          foundTarget = w;
          return {
            ...w,
            status: 'completed' as const,
            receivedAt: nowStr,
          };
        }
        return w;
      });
      return changed ? next : prev;
    });

    if (foundTarget) {
      const ref = (foundTarget as WithdrawalRecord).referenceId;
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.referenceId === ref || (tx.type === 'withdrawal' && tx.status === 'processing')
            ? { ...tx, status: 'success' as const }
            : tx
        )
      );
      showToast(
        `🎉 Payout Received! Rs ${(foundTarget as WithdrawalRecord).netAmount} received into ${(foundTarget as WithdrawalRecord).method.toUpperCase()} account (Transferred in 5-7 minutes).`
      );
    }
  };

  // 2 Admins Operations & App Funding Handlers
  const switchAdmin = (adminId: 'admin_1' | 'admin_2', pin?: string) => {
    const target = admins.find((a) => a.id === adminId);
    if (!target) return { success: false, message: 'Admin not found.' };

    if (pin && target.pin && target.pin !== pin) {
      return { success: false, message: 'Incorrect PIN code for this admin.' };
    }

    setCurrentAdminId(adminId);
    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}`,
      adminId,
      adminName: target.name,
      action: 'Session Switched (ایڈمن کنٹرول)',
      details: `${target.name} (${target.title}) took active admin controls.`,
      date: 'Just now',
      timestamp: Date.now(),
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast(`Active admin switched to: ${target.name} (${target.title})`);
    return { success: true, message: `Switched to ${target.name}` };
  };

  const updateAdminProfile = (adminId: 'admin_1' | 'admin_2', updates: Partial<AdminProfile>) => {
    setAdmins((prev) =>
      prev.map((a) => (a.id === adminId ? { ...a, ...updates } : a))
    );
    showToast(`Admin profile updated successfully!`);
  };

  const injectAppReserveFunds = (amount: number, method: string, note?: string) => {
    if (amount <= 0) {
      return { success: false, message: 'Please enter a valid amount greater than 0.' };
    }

    const currentAdminObj = admins.find((a) => a.id === currentAdminId) || admins[0];
    const nowStr = new Date().toLocaleDateString('en-PK', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newInjection: AdminReserveInjection = {
      id: `inj-${Date.now()}`,
      adminId: currentAdminObj.id,
      adminName: currentAdminObj.name,
      amount,
      method,
      date: nowStr,
      timestamp: Date.now(),
      note: note || `Added by ${currentAdminObj.name} via ${method}`,
    };

    setAppReserveBalance((prev) => prev + amount);
    setAdminInjections((prev) => [newInjection, ...prev]);

    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}`,
      adminId: currentAdminObj.id,
      adminName: currentAdminObj.name,
      action: 'App Funded (پیسے ڈالے گئے)',
      details: `Rs ${amount.toLocaleString()} PKR deposited into App Reserve by ${currentAdminObj.name} via ${method}.`,
      date: 'Just now',
      timestamp: Date.now(),
    };
    setAdminLogs((prev) => [newLog, ...prev]);

    showToast(
      `💰 App Funded! Rs ${amount.toLocaleString()} PKR successfully added to App Reserve Pool by ${currentAdminObj.name}. Users can withdraw smoothly!`
    );

    return { success: true, message: `Rs ${amount} injected into App Reserve Pool.` };
  };

  const approveUserWithdrawal = (withdrawalId: string) => {
    const currentAdminObj = admins.find((a) => a.id === currentAdminId) || admins[0];
    const target = withdrawals.find((w) => w.id === withdrawalId || w.referenceId === withdrawalId);
    if (!target) {
      return { success: false, message: 'Withdrawal request not found.' };
    }

    if (target.status === 'completed') {
      return { success: false, message: 'یہ ودڈرا پہلے ہی منظور اور ادا شدہ ہے۔' };
    }

    // CRITICAL USER REQUIREMENT:
    // "withdraw ly ny ky liya app pesy hony chaiya asa option do ky ham admin app pesy daly per log withdrawal ly sakhy"
    if (appReserveBalance < target.netAmount) {
      const msg = `⚠️ ایپ کے پے آؤٹ والٹ میں فنڈز ناکافی ہیں! صارف کو Rs ${target.netAmount.toLocaleString()} ادا کرنے ہیں جبکہ موجودہ ریزرو Rs ${appReserveBalance.toLocaleString()} ہے۔ برائے مہربانی پہلے ایڈمن پورٹل سے 'ایپ میں فنڈز جمع کروائیں' کے ذریعے رقم ڈالیں، پھر اپروو کریں۔`;
      showToast(msg);
      return {
        success: false,
        message: msg,
      };
    }

    let approvedAmount = target.netAmount;
    let approvedMethod = target.method.toUpperCase();
    let approvedUserTitle = target.accountTitle;

    setWithdrawals((prev) =>
      prev.map((w) => {
        if (w.id === withdrawalId || w.referenceId === withdrawalId) {
          return {
            ...w,
            status: 'completed',
            approvedBy: currentAdminObj.name,
            receivedAt: new Date().toLocaleDateString('en-PK', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        }
        return w;
      })
    );

    setTransactions((prev) =>
      prev.map((tx) =>
        tx.referenceId === withdrawalId || tx.id === withdrawalId
          ? { ...tx, status: 'success' }
          : tx
      )
    );

    // Deduct payout from App Reserve Pool
    setAppReserveBalance((prev) => Math.max(0, prev - approvedAmount));

    // Update community public proofs
    setCommunityPayouts((prev) =>
      prev.map((p) =>
        p.trxId === target.referenceId || p.id === target.id || p.id === withdrawalId
          ? { ...p, status: 'paid', timeAgo: 'ابھی ابھی (منظور شدہ)' }
          : p
      )
    );

    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}`,
      adminId: currentAdminObj.id,
      adminName: currentAdminObj.name,
      action: 'Withdrawal Approved & Paid (منظور اور ادا شدہ)',
      details: `${currentAdminObj.name} verified & dispatched Rs ${approvedAmount} to ${approvedUserTitle} (${approvedMethod}) from App Reserve.`,
      date: 'Just now',
      timestamp: Date.now(),
    };
    setAdminLogs((prev) => [newLog, ...prev]);

    showToast(`✅ Withdrawal of Rs ${approvedAmount} approved & paid from App Reserve by ${currentAdminObj.name}!`);
    return { success: true, message: `Withdrawal marked as sent and received.` };
  };

  const rejectUserWithdrawal = (withdrawalId: string, reason?: string) => {
    const currentAdminObj = admins.find((a) => a.id === currentAdminId) || admins[0];
    const target = withdrawals.find((w) => w.id === withdrawalId || w.referenceId === withdrawalId);
    if (!target) return { success: false, message: 'Withdrawal request not found.' };

    if (target.status === 'completed') {
      return { success: false, message: 'Cannot reject an already completed withdrawal.' };
    }

    setWithdrawals((prev) =>
      prev.map((w) => {
        if (w.id === withdrawalId || w.referenceId === withdrawalId) {
          return {
            ...w,
            status: 'rejected',
            rejectReason: reason || 'Rejected by Admin. Amount refunded.',
          };
        }
        return w;
      })
    );

    // Refund amount back to user's wallet
    setBalance((prev) => prev + target.amount);
    setTotalWithdrawn((prev) => Math.max(0, prev - target.amount));

    setTransactions((prev) =>
      prev.map((tx) =>
        tx.referenceId === withdrawalId || tx.id === withdrawalId
          ? {
              ...tx,
              status: 'failed',
              details: reason ? `Rejected by Admin: ${reason}` : 'Rejected by Admin. Amount refunded to wallet.',
            }
          : tx
      )
    );

    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}`,
      adminId: currentAdminObj.id,
      adminName: currentAdminObj.name,
      action: 'Withdrawal Rejected & Refunded (درخواست مسترد اور رقم واپس)',
      details: `${currentAdminObj.name} rejected withdrawal of Rs ${target.amount} for ${target.accountTitle}. Amount refunded back to user wallet.`,
      date: 'Just now',
      timestamp: Date.now(),
    };
    setAdminLogs((prev) => [newLog, ...prev]);

    showToast(`❌ Withdrawal rejected by ${currentAdminObj.name}. Rs ${target.amount} refunded to user wallet.`);
    return { success: true, message: `Withdrawal rejected and refunded.` };
  };

  const approveUserDeposit = (depositId: string) => {
    const currentAdminObj = admins.find((a) => a.id === currentAdminId) || admins[0];
    let credited = 0;
    let depMethod = '';

    setDeposits((prev) =>
      prev.map((d) => {
        if (d.id === depositId || d.transactionId === depositId) {
          credited = d.totalCredited;
          depMethod = d.method.toUpperCase();
          return { ...d, status: 'completed' };
        }
        return d;
      })
    );

    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}`,
      adminId: currentAdminObj.id,
      adminName: currentAdminObj.name,
      action: 'Deposit Approved',
      details: `${currentAdminObj.name} confirmed user deposit of Rs ${credited} via ${depMethod}.`,
      date: 'Just now',
      timestamp: Date.now(),
    };
    setAdminLogs((prev) => [newLog, ...prev]);

    showToast(`✅ Deposit of Rs ${credited} approved by ${currentAdminObj.name}!`);
    return { success: true, message: `Deposit approved.` };
  };

  // Synthesize soft notification chime
  const triggerSoundAlert = () => {
    if (!soundAlertsEnabled) return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {}
  };

  // Record a real-time event so admin sees when any user acts
  const recordUserAlert = (
    alertData: Omit<UserLiveAlert, 'id' | 'timestamp' | 'date' | 'isRead'>
  ) => {
    const now = Date.now();
    const newAlert: UserLiveAlert = {
      ...alertData,
      id: `alert-${now}-${Math.floor(Math.random() * 10000)}`,
      timestamp: now,
      date: new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    setUserAlerts((prev) => [newAlert, ...prev.slice(0, 49)]);
    triggerSoundAlert();
  };

  const recordVisitorLog = (action: string, city: string = 'Lahore', device: string = 'Android App') => {
    const now = Date.now();
    const newLog: UserVisitorLog = {
      id: `vlog-${now}-${Math.floor(Math.random() * 1000)}`,
      userName: user.name || 'User',
      userPhone: user.phone || '0300-*******',
      city,
      device,
      action,
      timestamp: now,
      date: 'Just now',
    };
    setUserAnalytics((prev) => ({
      ...prev,
      todayVisitors: prev.todayVisitors + 1,
      visitorLogs: [newLog, ...prev.visitorLogs.slice(0, 39)],
    }));
  };

  const resetHiddenAnalyticsToZero = () => {
    const zeroState: UserAnalyticsData = {
      totalUsers: 0,
      todayVisitors: 0,
      onlineNow: 0,
      newUsersToday: 0,
      totalAdsWatched: 0,
      activePlanSubscribers: {
        plan150: 0,
        plan300: 0,
        plan450: 0,
      },
      visitorLogs: [],
    };
    setUserAnalytics(zeroState);
    localStorage.setItem(`${STORAGE_KEY}_userAnalytics`, JSON.stringify(zeroState));
    setUserAlerts([]);
    localStorage.setItem(`${STORAGE_KEY}_userAlerts`, JSON.stringify([]));
    showToast('صارفین سے پوشیدہ تمام خفیہ کاؤنٹرز 00 پر سیٹ کر دیے گئے ہیں (Reset all hidden metrics to 00)');
  };

  const adminLogin = (adminId: 'admin_1' | 'admin_2', pin: string) => {
    const target = admins.find((a) => a.id === adminId);
    if (!target) return { success: false, message: 'Admin profile not found.' };

    if (target.pin && target.pin !== pin.trim()) {
      return {
        success: false,
        message: 'غلط پن کوڈ! برائے مہربانی درست ایڈمن پن درج کریں۔ (Incorrect PIN)',
      };
    }

    setCurrentAdminId(adminId);
    setIsAdminLoggedIn(true);
    localStorage.setItem(`${STORAGE_KEY}_admin_logged_in`, 'true');

    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}`,
      adminId,
      adminName: target.name,
      action: 'Admin Logged In',
      details: `${target.name} unlocked admin management portal.`,
      date: 'Just now',
      timestamp: Date.now(),
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast(`خوش آمدید ${target.name}! ایڈمن سیشن فعال ہو گیا ہے۔`);
    return { success: true, message: `Welcome ${target.name}!` };
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(`${STORAGE_KEY}_admin_logged_in`);
    showToast('ایڈمن موڈ بند کر دیا گیا ہے۔ (Admin logged out)');
  };

  const dismissUserAlert = (id: string) => {
    setUserAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const markAlertsAsRead = () => {
    setUserAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  const clearAllUserAlerts = () => {
    setUserAlerts([]);
  };

  const unreadAlertsCount = useMemo(() => {
    return userAlerts.filter((a) => !a.isRead).length;
  }, [userAlerts]);

  // 1. Buy Plan action
  const buyPlan = (planId: PlanId) => {
    const selectedPlan = PLANS.find((p) => p.id === planId);
    if (!selectedPlan) {
      return { success: false, message: 'Plan not found.' };
    }

    if (balance < selectedPlan.price) {
      const shortage = selectedPlan.price - balance;
      return {
        success: false,
        message: `Insufficient balance! You need Rs ${shortage} more. Please deposit via JazzCash, Easypaisa, OPay, or Card first.`,
      };
    }

    // Deduct cost
    const newBalance = balance - selectedPlan.price;
    setBalance(newBalance);

    // Calculate dates (60 days = 2 months)
    const activatedAt = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + selectedPlan.durationDays);

    const newSub: UserSubscription = {
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      activatedAt: activatedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      daysRemaining: selectedPlan.durationDays,
      dailyEarnings: selectedPlan.dailyEarnings,
      ad1Reward: selectedPlan.ad1Reward,
      ad2Reward: selectedPlan.ad2Reward,
    };

    setActivePlan(newSub);

    // Add transaction
    const newTx: Transaction = {
      id: `tx-plan-${Date.now()}`,
      type: 'plan_purchase',
      title: `Subscribed to ${selectedPlan.name} (${selectedPlan.price} PKR)`,
      amount: selectedPlan.price,
      isCredit: false,
      date: new Date().toLocaleDateString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'success',
      details: `Active for 2 months (60 days) - Daily 2 ads (Rs ${selectedPlan.ad1Reward} + Rs ${selectedPlan.ad2Reward} = Rs ${selectedPlan.dailyEarnings}/day)`,
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Successfully subscribed to ${selectedPlan.name}! 2 daily ads unlocked.`);

    // Record live alert for admins
    recordUserAlert({
      type: 'plan_buy',
      title: `⭐ نیا پلان ایکٹیو کیا گیا (${selectedPlan.name})`,
      userName: user.name,
      userPhone: user.phone,
      amount: selectedPlan.price,
      details: `صارف ${user.name} نے Rs ${selectedPlan.price} ادا کر کے ${selectedPlan.name} 60 دنوں کیلئے فعال کیا ہے۔`,
    });

    recordVisitorLog(
      `صارف نے ${selectedPlan.name} (Rs ${selectedPlan.price}) ایکٹیو کیا`,
      'Islamabad',
      'Android App'
    );

    return {
      success: true,
      message: `Plan activated! You can now watch 2 ads daily to earn Rs ${selectedPlan.dailyEarnings} per day for 2 months.`,
    };
  };

  // 2. Deposit Funds action with 10% Deposit Bonus (Limits: Rs 150, 300, 450)
  const depositFunds = (
    method: PaymentMethod,
    amount: number,
    senderNumber: string,
    transactionId: string
  ) => {
    if (amount < 150) {
      return {
        success: false,
        message: 'کم از کم رقم جمع کرنے کی حد 150 روپے ہے۔ پلانز کے مطابق آپشنز: 150، 300، 450 روپے ہیں۔ (Minimum deposit is Rs 150. Options: Rs 150, Rs 300, Rs 450).',
        deposit: null as any,
      };
    }
    if (!transactionId.trim()) {
      return { success: false, message: 'Please enter Transaction ID (TID / TRX ID).', deposit: null as any };
    }

    // Bonus Calculation: 10% Deposit Bonus!
    const bonusPercent = 10;
    const bonusAmount = Math.round((amount * bonusPercent) / 100);
    const totalCredit = amount + bonusAmount;

    const newDeposit: DepositRecord = {
      id: `DEP-${Date.now().toString().slice(-6)}`,
      method,
      amount,
      bonusAmount,
      totalCredited: totalCredit,
      senderNumber,
      transactionId,
      date: new Date().toLocaleDateString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
    };

    setDeposits((prev) => [newDeposit, ...prev]);
    setBalance((prev) => prev + totalCredit);
    setTotalDeposited((prev) => prev + amount);
    if (bonusAmount > 0) {
      setTotalEarned((prev) => prev + bonusAmount);
    }

    // Transactions log
    const depositTx: Transaction = {
      id: `tx-dep-${Date.now()}`,
      type: 'deposit',
      title: `Deposit via ${method.toUpperCase()} (${newDeposit.id})`,
      amount,
      isCredit: true,
      date: newDeposit.date,
      status: 'success',
      method,
      referenceId: transactionId,
      details: `TID: ${transactionId} | Sender: ${senderNumber}`,
    };

    const bonusTx: Transaction = {
      id: `tx-bon-${Date.now()}`,
      type: 'deposit_bonus',
      title: `10% Deposit Bonus (${method.toUpperCase()})`,
      amount: bonusAmount,
      isCredit: true,
      date: newDeposit.date,
      status: 'success',
      details: `Extra Rs ${bonusAmount} deposit bonus credited`,
    };

    setTransactions((prev) => [bonusTx, depositTx, ...prev]);
    showToast(`Deposit Approved! Rs ${amount} + Rs ${bonusAmount} bonus credited to your wallet.`);

    // Add to Community Public Deposits Feed
    const newDepositProof: CommunityDepositProof = {
      id: `cdep-${Date.now()}`,
      userName: user.firstName || user.name || 'آپ (User)',
      phoneMasked: senderNumber && senderNumber.length >= 7 ? `${senderNumber.slice(0, 4)}***${senderNumber.slice(-3)}` : '0300***123',
      amount,
      bonusAmount,
      method,
      city: 'Live Member',
      timeAgo: 'ابھی ابھی (Just now)',
      trxId: transactionId,
    };
    setCommunityDeposits((prev) => [newDepositProof, ...prev.slice(0, 19)]);

    // Record live alert for admins
    recordUserAlert({
      type: 'deposit',
      title: '📥 نیا ڈپازٹ وصول ہوا',
      userName: user.name || 'User',
      userPhone: senderNumber,
      amount,
      method,
      details: `صارف ${user.name} (${senderNumber}) نے Rs ${amount} بھیجے بذریعہ ${method.toUpperCase()}۔ TID: ${transactionId}`,
    });

    recordVisitorLog(
      `صارف نے Rs ${amount.toLocaleString()} ڈپازٹ جمع کیے بذریعہ ${method.toUpperCase()} (10% بونس شامل)`,
      'Karachi',
      'Android App'
    );

    return {
      success: true,
      message: `Deposit of Rs ${amount} confirmed with Rs ${bonusAmount} extra bonus!`,
      deposit: newDeposit,
    };
  };

  // Cooldown calculator for 4-day withdrawal limit
  const getWithdrawalCooldown = () => {
    if (withdrawals.length === 0) return null;
    const latest = withdrawals[0];
    const withdrawTimestamp =
      latest.timestamp || (latest.date ? new Date(latest.date).getTime() : 0);
    if (!withdrawTimestamp || isNaN(withdrawTimestamp)) return null;

    const timePassed = Date.now() - withdrawTimestamp;
    if (timePassed < WITHDRAWAL_INTERVAL_MS) {
      const remainingMs = WITHDRAWAL_INTERVAL_MS - timePassed;
      const remainingDays = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
      const remainingHours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const remainingMinutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));

      const nextDate = new Date(withdrawTimestamp + WITHDRAWAL_INTERVAL_MS);
      const nextAvailableDate = nextDate.toLocaleDateString('en-PK', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const formatted =
        remainingDays > 0
          ? `${remainingDays}d ${remainingHours}h`
          : `${remainingHours}h ${remainingMinutes}m`;

      return {
        inCooldown: true,
        remainingDays,
        remainingHours,
        remainingMinutes,
        formatted,
        nextAvailableDate,
      };
    }

    return null;
  };

  // 3. Withdraw Funds action (Enforced: Min Rs 500, Max Rs 1,000, 1 withdrawal every 4 days)
  const withdrawFunds = (
    method: PaymentMethod,
    amount: number,
    accountTitle: string,
    accountNumber: string
  ) => {
    // User restriction: "jb tk koi plan chose na kary tb tb withdrawal no"
    if (!activePlan) {
      return {
        success: false,
        message:
          'Withdrawal Locked! جب تک آپ کوئی پلان منتخب نہیں کریں گے تب تک ودڈرا نہیں ہو سکتا (Withdrawals are strictly locked in Demo Mode until an earning plan is activated). Please choose Plan 1 (Rs 150), Plan 2 (Rs 300), or Plan 3 (Rs 450) first.',
      };
    }

    if (amount < MIN_WITHDRAWAL) {
      return { success: false, message: `Minimum withdrawal amount is Rs ${MIN_WITHDRAWAL} PKR.` };
    }
    if (amount > MAX_WITHDRAWAL) {
      return {
        success: false,
        message: `Maximum withdrawal limit is Rs ${MAX_WITHDRAWAL} PKR per 4-day cycle.`,
      };
    }
    if (amount > balance) {
      return { success: false, message: `Insufficient balance! You only have Rs ${balance} in your wallet.` };
    }
    if (!accountTitle.trim() || !accountNumber.trim()) {
      return { success: false, message: 'Please provide valid account title and number.' };
    }

    const cooldown = getWithdrawalCooldown();
    if (cooldown && cooldown.inCooldown) {
      return {
        success: false,
        message: `Withdrawal limit: Allowed once every 4 days. Next withdrawal available in ${cooldown.formatted} (${cooldown.nextAvailableDate}).`,
      };
    }

    // 0% promotional withdrawal fee
    const fee = 0;
    const netAmount = amount - fee;
    const referenceId = `WD-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowTime = Date.now();
    // 5 to 7 minutes delivery guarantee (estimated ~6 minutes)
    const estimatedMinutes = 6;
    const estimatedReceivedTime = nowTime + estimatedMinutes * 60 * 1000;

    const newWithdrawal: WithdrawalRecord = {
      id: referenceId,
      method,
      amount,
      fee,
      netAmount,
      accountTitle,
      accountNumber,
      date: new Date().toLocaleDateString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      timestamp: nowTime,
      status: 'pending', // User requirement: "jb log withdrawal ly wo request sambit kary or admin approve kary per withdrawal ho"
      referenceId,
      estimatedMinutes,
      estimatedReceivedTime,
    };

    setBalance((prev) => {
      const nextBal = Math.max(0, prev - amount);
      localStorage.setItem(`${STORAGE_KEY}_balance`, nextBal.toString());
      return nextBal;
    });
    setTotalWithdrawn((prev) => {
      const nextWd = prev + amount;
      localStorage.setItem(`${STORAGE_KEY}_totalWithdrawn`, nextWd.toString());
      return nextWd;
    });
    setWithdrawals((prev) => [newWithdrawal, ...prev]);

    const tx: Transaction = {
      id: `tx-wd-${Date.now()}`,
      type: 'withdrawal',
      title: `Withdrawal via ${method.toUpperCase()} (${referenceId})`,
      amount,
      isCredit: false,
      date: newWithdrawal.date,
      status: 'pending',
      method,
      referenceId,
      details: `Rs ${amount} والٹ سے کاٹ لی گئی ہے۔ ایڈمن منظوری پر 5 سے 7 منٹ میں اکاؤنٹ میں پہنچ جائے گی: ${accountTitle} (${accountNumber})`,
    };

    setTransactions((prev) => [tx, ...prev]);
    showToast(`ودڈرا جمع ہو گیا! Rs ${amount} والٹ سے کاٹ لی گئی ہے اور ایڈمن منظوری کے بعد 5 سے 7 منٹ میں رقم منتقل کر دی جائے گی۔`);

    // Add to Community Public Payouts Feed
    const newPayoutProof: CommunityPayoutProof = {
      id: `cpay-${Date.now()}`,
      userName: accountTitle || 'صارف (User)',
      phoneMasked: accountNumber && accountNumber.length >= 7 ? `${accountNumber.slice(0, 4)}***${accountNumber.slice(-3)}` : '0300***123',
      amount: netAmount,
      method,
      city: 'Live Member',
      timeAgo: 'ابھی ابھی (درخواست دی گئی)',
      trxId: referenceId,
      status: 'processing',
    };
    setCommunityPayouts((prev) => [newPayoutProof, ...prev.slice(0, 19)]);

    // Record live alert for admins
    recordUserAlert({
      type: 'withdrawal',
      title: '🚨 نئی ودڈرا درخواست (ایڈمن منظوری درکار ہے)',
      userName: accountTitle,
      userPhone: accountNumber,
      amount: netAmount,
      method,
      targetId: referenceId,
      details: `صارف ${accountTitle} (${accountNumber}) نے Rs ${netAmount.toLocaleString()} ودڈرا کی درخواست جمع کروائی ہے۔ ایڈمن منظوری پر ایپ ریزرو سے رقم ادا ہوگی۔ ریفرنس: ${referenceId}`,
    });

    recordVisitorLog(
      `صارف نے Rs ${netAmount.toLocaleString()} ودڈرا لگایا بذریعہ ${method.toUpperCase()} (والٹ سے رقم کاٹ لی گئی)`,
      'Lahore',
      'Android App'
    );

    return {
      success: true,
      message: `Withdrawal request submitted! آپ کی Rs ${netAmount} کی درخواست ایڈمن کو ارسال کر دی گئی ہے۔ ایڈمن کے منظور کرتے ہی رقم منتقل ہو جائے گی۔`,
      withdrawal: newWithdrawal,
    };
  };

  // 4. Watch Ad action (Daily limit: 2 ads per day)
  const watchAd = (adNumber: 1 | 2) => {
    if (!activePlan) {
      return {
        success: false,
        reward: 0,
        message: 'No active plan! Please subscribe to Plan 1 (150 Rs), Plan 2 (300 Rs), or Plan 3 (450 Rs) first to earn from ads.',
      };
    }

    if (adNumber === 1 && dailyAds.ad1Watched) {
      return { success: false, reward: 0, message: 'Ad 1 already completed for today!' };
    }

    if (adNumber === 2 && dailyAds.ad2Watched) {
      return { success: false, reward: 0, message: 'Ad 2 already completed for today!' };
    }

    // Determine reward based on active plan and ad number
    // Plan 1 (150): Ad 1 = 25 Rs, Ad 2 = 25 Rs (Total 50 Rs)
    // Plan 2 (300): Ad 1 = 50 Rs, Ad 2 = 50 Rs (Total 100 Rs)
    // Plan 3 (450): Ad 1 = 75 Rs, Ad 2 = 75 Rs (Total 150 Rs)
    const reward = adNumber === 1 ? activePlan.ad1Reward : activePlan.ad2Reward;

    const newDailyAds: DailyAdStatus = {
      ...dailyAds,
      date: todayStr,
      ad1Watched: adNumber === 1 ? true : dailyAds.ad1Watched,
      ad1EarnedAt: adNumber === 1 ? new Date().toISOString() : dailyAds.ad1EarnedAt,
      ad2Watched: adNumber === 2 ? true : dailyAds.ad2Watched,
      ad2EarnedAt: adNumber === 2 ? new Date().toISOString() : dailyAds.ad2EarnedAt,
    };

    setDailyAds(newDailyAds);
    setBalance((prev) => prev + reward);
    setTotalEarned((prev) => prev + reward);

    const tx: Transaction = {
      id: `tx-ad-${Date.now()}`,
      type: 'ad_earning',
      title: `Ad #${adNumber} Completed (${activePlan.planName})`,
      amount: reward,
      isCredit: true,
      date: new Date().toLocaleDateString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'success',
      details: `Daily task reward: Rs ${reward} credited immediately to your balance`,
    };

    setTransactions((prev) => [tx, ...prev]);
    showToast(`Congratulations! Rs ${reward} earned from Ad #${adNumber}!`);

    // Record live alert for admins
    recordUserAlert({
      type: 'ad_watch',
      title: `📺 اشتہار #${adNumber} دیکھا گیا`,
      userName: user.name,
      userPhone: user.phone,
      amount: reward,
      details: `صارف ${user.name} نے ایڈ #${adNumber} دیکھ کر Rs ${reward} روزانہ کمائی حاصل کی۔`,
    });

    setUserAnalytics((prev) => ({
      ...prev,
      totalAdsWatched: prev.totalAdsWatched + 1,
    }));

    recordVisitorLog(
      `صارف نے اشتہار #${adNumber} دیکھا (+Rs ${reward} PKR حاصل کیے)`,
      'Faisalabad',
      'Android App'
    );

    return {
      success: true,
      reward,
      message: `Great job! Rs ${reward} has been added to your balance.`,
    };
  };

  // 4b. Ad Placement & Campaign Management (Daily 2 Ads Setup System)
  const saveAdCampaign = (updatedCampaign: AdCampaign) => {
    setAdCampaigns((prev) => {
      const exists = prev.some((c) => c.id === updatedCampaign.id);
      if (exists) {
        return prev.map((c) => (c.id === updatedCampaign.id ? updatedCampaign : c));
      }
      return [...prev, updatedCampaign];
    });
    showToast(`Saved Ad for Daily Task #${updatedCampaign.adIndex}: ${updatedCampaign.brand}`);
  };

  const resetAdCampaigns = () => {
    setAdCampaigns(SPONSORED_ADS);
    localStorage.removeItem(`${STORAGE_KEY}_adCampaigns`);
    showToast('Restored default 2 daily sponsored ads.');
  };

  const getCampaignForSlot = (slot: 1 | 2): AdCampaign => {
    const slotCampaigns = adCampaigns.filter((c) => c.adIndex === slot);
    return slotCampaigns[0] || SPONSORED_ADS.find((c) => c.adIndex === slot) || SPONSORED_ADS[0];
  };

  // 5. Daily Check-in Claim (Daily bonus: Rs 5)
  const claimDailyCheckIn = () => {
    if (dailyCheckInClaimed) {
      return { success: false, amount: 0, message: 'You have already claimed today’s check-in bonus!' };
    }

    const checkInBonus = DAILY_BONUS; // Rs 5 PKR
    setBalance((prev) => prev + checkInBonus);
    setTotalEarned((prev) => prev + checkInBonus);
    setDailyCheckInClaimed(true);
    localStorage.setItem(`${STORAGE_KEY}_checkin_${todayStr}`, 'true');

    const tx: Transaction = {
      id: `tx-checkin-${Date.now()}`,
      type: 'daily_bonus',
      title: 'Daily Attendance Bonus',
      amount: checkInBonus,
      isCredit: true,
      date: new Date().toLocaleDateString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'success',
      details: 'Daily attendance streak reward (Rs 5 PKR)',
    };

    setTransactions((prev) => [tx, ...prev]);
    showToast(`Claimed! Daily check-in bonus of Rs ${checkInBonus} added to balance.`);

    return {
      success: true,
      amount: checkInBonus,
      message: `Daily check-in reward Rs ${checkInBonus} credited!`,
    };
  };

  // 6. Referral Management: Friend joins in Demo Mode (Not Active until they choose a plan)
  const inviteFriend = (friendPhone: string, friendName?: string) => {
    if (!friendPhone || friendPhone.length < 10) {
      return { success: false, message: 'Please enter a valid phone number (minimum 10 digits).' };
    }

    const cleanPhone = friendPhone.trim();
    const name = friendName?.trim() || `Friend ${referralFriends.length + 1}`;

    const newFriend: ReferralFriend = {
      id: `ref-${Date.now()}`,
      name,
      phone: cleanPhone,
      joinedDate: new Date().toLocaleDateString('en-PK', { month: 'short', day: 'numeric' }),
      status: 'demo_inactive', // In Demo Mode: NOT active until they choose a plan!
      bonusEarned: 0,
    };

    setReferralFriends((prev) => [newFriend, ...prev]);
    showToast(`Friend Invited! ${name} joined in Demo Mode (Not Active until a plan is chosen).`);

    return {
      success: true,
      message: `${name} (${cleanPhone}) invited in Demo Mode! Friend will become Active once they choose a plan.`,
    };
  };

  // Simulate friend choosing a plan (Activates friend and awards Rs 10 reference bonus)
  const activateFriendPlan = (friendId: string, planName: string = 'Plan 1 (Rs 150)') => {
    const friend = referralFriends.find((f) => f.id === friendId);
    if (!friend) {
      return { success: false, message: 'Friend record not found.' };
    }
    if (friend.status === 'active') {
      return { success: false, message: 'This friend is already active and bonus was already credited!' };
    }

    setReferralFriends((prev) =>
      prev.map((f) =>
        f.id === friendId
          ? {
              ...f,
              status: 'active',
              planName,
              bonusEarned: REFERRAL_BONUS,
            }
          : f
      )
    );

    setBalance((prev) => prev + REFERRAL_BONUS);
    setTotalEarned((prev) => prev + REFERRAL_BONUS);

    const tx: Transaction = {
      id: `tx-ref-${Date.now()}`,
      type: 'referral_bonus',
      title: `Referral Bonus: ${friend.name} Activated Plan`,
      amount: REFERRAL_BONUS,
      isCredit: true,
      date: new Date().toLocaleDateString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'success',
      details: `${friend.name} chose ${planName}. Rs ${REFERRAL_BONUS} reference bonus credited to your wallet!`,
    };

    setTransactions((prev) => [tx, ...prev]);
    showToast(`Friend Activated! ${friend.name} chose ${planName}. +Rs ${REFERRAL_BONUS} referral bonus added!`);

    return {
      success: true,
      message: `Success! ${friend.name} chose ${planName}. Rs ${REFERRAL_BONUS} reference bonus credited!`,
    };
  };

  const claimReferralBonus = (friendPhone: string, friendName?: string) => {
    if (!friendPhone || friendPhone.length < 10) {
      return { success: false, amount: 0, message: 'Please enter a valid phone number (minimum 10 digits).' };
    }

    const cleanPhone = friendPhone.trim();
    const name = friendName?.trim() || `Friend ${referralFriends.length + 1}`;

    const newFriend: ReferralFriend = {
      id: `ref-${Date.now()}`,
      name,
      phone: cleanPhone,
      joinedDate: new Date().toLocaleDateString('en-PK', { month: 'short', day: 'numeric' }),
      status: 'active',
      bonusEarned: REFERRAL_BONUS,
    };

    setReferralFriends((prev) => [newFriend, ...prev]);
    setBalance((prev) => prev + REFERRAL_BONUS);
    setTotalEarned((prev) => prev + REFERRAL_BONUS);

    const tx: Transaction = {
      id: `tx-ref-${Date.now()}`,
      type: 'referral_bonus',
      title: `Reference Bonus: ${name} Joined`,
      amount: REFERRAL_BONUS,
      isCredit: true,
      date: new Date().toLocaleDateString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'success',
      details: `Referral bonus of Rs ${REFERRAL_BONUS} PKR credited for inviting ${name} (${cleanPhone})`,
    };

    setTransactions((prev) => [tx, ...prev]);
    showToast(`Referral Bonus! Rs ${REFERRAL_BONUS} credited for inviting ${name}!`);

    return {
      success: true,
      amount: REFERRAL_BONUS,
      message: `Success! Rs ${REFERRAL_BONUS} PKR reference bonus credited for inviting ${name}!`,
    };
  };

  // 7. Simulate Next Day (Testing convenience so user doesn't have to wait 24h)
  const simulateNextDay = () => {
    setDailyAds({
      date: todayStr,
      ad1Watched: false,
      ad2Watched: false,
    });
    setDailyCheckInClaimed(false);
    localStorage.removeItem(`${STORAGE_KEY}_checkin_${todayStr}`);
    if (activePlan) {
      setActivePlan((prev) =>
        prev
          ? {
              ...prev,
              daysRemaining: Math.max(0, prev.daysRemaining - 1),
            }
          : null
      );
    }
    // Also advance 1 day on withdrawal cooldown for seamless testing
    setWithdrawals((prev) =>
      prev.map((w) => ({
        ...w,
        timestamp: (w.timestamp || Date.now()) - 24 * 60 * 60 * 1000,
      }))
    );
    showToast('Simulated Next Day! Ads, daily bonus, and 1 day on withdrawal cycle advanced.');
  };

  // Fast-forward withdrawal cooldown by specified days (defaults to 4 days)
  const fastForwardDays = (days: number = 4) => {
    setWithdrawals((prev) =>
      prev.map((w) => ({
        ...w,
        timestamp: (w.timestamp || Date.now()) - days * 24 * 60 * 60 * 1000,
      }))
    );
    showToast(`Fast-forwarded ${days} days! Next withdrawal unlocked.`);
  };

  // 8. Reset to default demo state
  const resetAllData = () => {
    localStorage.clear();
    setBalance(LOGIN_BONUS);
    setTotalEarned(LOGIN_BONUS);
    setTotalDeposited(0);
    setTotalWithdrawn(0);
    setActivePlan(null);
    setDailyAds({
      date: todayStr,
      ad1Watched: false,
      ad2Watched: false,
    });
    setDailyCheckInClaimed(false);
    setDeposits([]);
    setWithdrawals([]);
    setAdCampaigns(SPONSORED_ADS);
    setReferralFriends([
      {
        id: 'ref-1',
        name: 'Ali Khan',
        phone: '0301-4455667',
        joinedDate: '2026-09-12',
        status: 'active',
        planName: 'Plan 1 (Rs 150)',
        bonusEarned: REFERRAL_BONUS,
      },
      {
        id: 'ref-2',
        name: 'Usman Tariq',
        phone: '0322-9988771',
        joinedDate: '2026-09-14',
        status: 'demo_inactive',
        bonusEarned: 0,
      },
      {
        id: 'ref-3',
        name: 'Hamza Bilal',
        phone: '0345-1122334',
        joinedDate: '2026-09-14',
        status: 'demo_inactive',
        bonusEarned: 0,
      },
    ]);
    setTransactions([
      {
        id: 'tx-welcome-1',
        type: 'signup_bonus',
        title: 'App Login / Sign-up Bonus',
        amount: LOGIN_BONUS,
        isCredit: true,
        date: new Date().toLocaleDateString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'success',
        details: 'Free login app bonus (Rs 25 PKR) credited into wallet',
      },
    ]);
    showToast('App state reset to fresh default demo.');
  };

  const contextValue = useMemo(
    () => ({
      balance,
      totalEarned,
      totalDeposited,
      totalWithdrawn,
      // Platform & Community Financial System
      platformTotalDeposited: financialSummary.platformTotalDeposited,
      platformTotalWithdrawn: financialSummary.platformTotalWithdrawn,
      platformActiveDepositors: financialSummary.platformActiveDepositors,
      platformTodayPayouts: financialSummary.platformTodayPayouts,
      communityPayouts,
      communityDeposits,
      financialSummary,
      isFinanceLedgerOpen,
      setIsFinanceLedgerOpen,
      financeLedgerTab,
      setFinanceLedgerTab,
      openFinanceLedger,
      closeFinanceLedger,
      activePlan,
      dailyAds,
      adCampaigns,
      user,
      // User Authentication & Registration System
      isLoggedIn,
      loginUser,
      registerUser,
      logoutUser,
      registeredUsers,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authModalMode,
      setAuthModalMode,
      referralCodeParam,
      openAuthModal,
      closeAuthModal,
      transactions,
      deposits,
      withdrawals,
      referralFriends,
      dailyCheckInClaimed,
      whatsappLink,
      setWhatsappLink,
      whatsappLink2,
      setWhatsappLink2,
      whatsappChannelLink,
      setWhatsappChannelLink,
      youtubeChannelLink,
      setYoutubeChannelLink,
      supportMessages,
      sendSupportMessage,
      toastMessage,
      showToast,
      // 2 Admins & App Reserve Liquidity System
      admins,
      currentAdminId,
      currentAdmin,
      switchAdmin,
      updateAdminProfile,
      appReserveBalance,
      adminInjections,
      injectAppReserveFunds,
      adminLogs,
      approveUserWithdrawal,
      rejectUserWithdrawal,
      approveUserDeposit,
      // Admin Auth Gate (Protected - regular users cannot access without PIN)
      isAdminLoggedIn,
      adminLogin,
      adminLogout,
      adminLoginModalOpen,
      setAdminLoginModalOpen,
      // Real-time User Tracking & Alerts ("jb koi user aye/kare to pata chaly")
      userAlerts,
      dismissUserAlert,
      markAlertsAsRead,
      clearAllUserAlerts,
      unreadAlertsCount,
      triggerSoundAlert,
      soundAlertsEnabled,
      setSoundAlertsEnabled,
      // User Analytics & Visitors (Protected - visible to Admin only, hidden from users)
      userAnalytics,
      recordVisitorLog,
      resetHiddenAnalyticsToZero,
      // Public Announcement from Admin to all users
      adminAnnouncement,
      setAdminAnnouncement,
      // Actions
      buyPlan,
      depositFunds,
      withdrawFunds,
      completeWithdrawalNow,
      watchAd,
      saveAdCampaign,
      resetAdCampaigns,
      getCampaignForSlot,
      claimDailyCheckIn,
      claimReferralBonus,
      inviteFriend,
      activateFriendPlan,
      simulateNextDay,
      fastForwardDays,
      getWithdrawalCooldown,
      resetAllData,
      minWithdrawal: MIN_WITHDRAWAL,
      maxWithdrawal: MAX_WITHDRAWAL,
      withdrawalIntervalDays: WITHDRAWAL_INTERVAL_DAYS,
      loginBonus: LOGIN_BONUS,
      dailyBonus: DAILY_BONUS,
      referralBonus: REFERRAL_BONUS,
    }),
    [
      balance,
      totalEarned,
      totalDeposited,
      totalWithdrawn,
      activePlan,
      dailyAds,
      adCampaigns,
      user,
      transactions,
      deposits,
      withdrawals,
      referralFriends,
      dailyCheckInClaimed,
      whatsappLink,
      whatsappLink2,
      youtubeChannelLink,
      supportMessages,
      toastMessage,
      admins,
      currentAdminId,
      currentAdmin,
      appReserveBalance,
      adminInjections,
      adminLogs,
      isAdminLoggedIn,
      adminLoginModalOpen,
      userAlerts,
      unreadAlertsCount,
      soundAlertsEnabled,
      adminAnnouncement,
      userAnalytics,
      isLoggedIn,
      registeredUsers,
      isAuthModalOpen,
      authModalMode,
      referralCodeParam,
      communityPayouts,
      communityDeposits,
      financialSummary,
      isFinanceLedgerOpen,
      financeLedgerTab,
    ]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
