export type PlanId = 'plan-150' | 'plan-300' | 'plan-450';

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  price: number; // in PKR (150, 300, 450)
  durationDays: number; // 60 days = 2 months
  dailyEarnings: number; // in PKR (50, 100, 150)
  adsPerDay: number; // 2 ads
  ad1Reward: number; // in PKR (25, 50, 75)
  ad2Reward: number; // in PKR (25, 50, 75)
  totalReturn: number; // 3000, 6000, 9000 PKR
  popular?: boolean;
  accentColor: string;
  badge: string;
}

export interface UserSubscription {
  planId: PlanId;
  planName: string;
  activatedAt: string;
  expiresAt: string;
  daysRemaining: number;
  dailyEarnings: number;
  ad1Reward: number;
  ad2Reward: number;
}

export type PaymentMethod = 'jazzcash' | 'easypaisa' | 'opay' | 'card';

export interface PaymentMethodInfo {
  id: PaymentMethod;
  name: string;
  subtitle: string;
  iconName: string;
  accountTitle: string;
  accountNumber: string;
  instructions: string;
  badgeColor: string;
  bgGradient: string;
}

export interface DepositRecord {
  id: string;
  method: PaymentMethod;
  amount: number;
  bonusAmount: number;
  totalCredited: number;
  senderNumber: string;
  transactionId: string;
  date: string;
  status: 'completed' | 'pending';
}

export interface WithdrawalRecord {
  id: string;
  method: PaymentMethod;
  amount: number;
  fee: number;
  netAmount: number;
  accountTitle: string;
  accountNumber: string;
  date: string;
  timestamp?: number;
  status: 'completed' | 'processing' | 'pending' | 'rejected';
  referenceId: string;
  estimatedMinutes?: number;
  estimatedReceivedTime?: number;
  receivedAt?: string;
  approvedBy?: string;
  rejectReason?: string;
}

export interface CommunityPayoutProof {
  id: string;
  userName: string;
  phoneMasked: string;
  amount: number;
  method: PaymentMethod;
  city: string;
  timeAgo: string;
  trxId: string;
  status: 'paid' | 'processing';
}

export interface CommunityDepositProof {
  id: string;
  userName: string;
  phoneMasked: string;
  amount: number;
  bonusAmount: number;
  method: PaymentMethod;
  city: string;
  timeAgo: string;
  trxId: string;
}

export interface SystemFinancialSummary {
  userTotalDeposited: number;
  userDepositCount: number;
  userTotalBonusOnDeposits: number;
  userTotalWithdrawn: number;
  userWithdrawalCount: number;
  userCompletedWithdrawn: number;
  userPendingWithdrawn: number;
  platformTotalDeposited: number;
  platformTotalWithdrawn: number;
  platformActiveDepositors: number;
  platformTodayPayouts: number;
}

export type TransactionType =
  | 'ad_earning'
  | 'deposit'
  | 'deposit_bonus'
  | 'plan_purchase'
  | 'withdrawal'
  | 'signup_bonus'
  | 'daily_bonus'
  | 'referral_bonus';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  isCredit: boolean;
  date: string;
  status: 'success' | 'processing' | 'pending' | 'failed';
  details?: string;
  method?: PaymentMethod;
  referenceId?: string;
}

export interface AdCampaign {
  id: string;
  adIndex: 1 | 2;
  brand: string;
  title: string;
  tagline: string;
  category: string;
  description: string;
  highlights: string[];
  bannerGradient: string;
  sponsorLogoUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: 'banner' | 'video' | 'image';
  websiteUrl: string;
  durationSeconds: number;
  verificationQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
  };
}

export interface UserProfile {
  name: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email: string;
  password?: string;
  referralCode: string;
  referredBy?: string;
  joinedDate: string;
}

export interface RegisteredUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  referralCode: string;
  joinedDate: string;
}

export interface DailyAdStatus {
  date: string; // YYYY-MM-DD
  ad1Watched: boolean;
  ad1EarnedAt?: string;
  ad2Watched: boolean;
  ad2EarnedAt?: string;
}

export interface ReferralFriend {
  id: string;
  name: string;
  phone: string;
  joinedDate: string;
  status: 'demo_inactive' | 'active';
  planName?: string;
  bonusEarned: number;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  name: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'replied' | 'pending';
  reply?: string;
  repliedAt?: string;
}

export interface AdminProfile {
  id: 'admin_1' | 'admin_2';
  name: string;
  title: string;
  phone: string;
  whatsapp: string;
  avatarColor: string;
  pin: string;
  active: boolean;
}

export interface AdminReserveInjection {
  id: string;
  adminId: 'admin_1' | 'admin_2';
  adminName: string;
  amount: number;
  method: string;
  date: string;
  timestamp: number;
  note?: string;
}

export interface AdminActivityLog {
  id: string;
  adminId: 'admin_1' | 'admin_2';
  adminName: string;
  action: string;
  details: string;
  date: string;
  timestamp: number;
}

export interface UserLiveAlert {
  id: string;
  type: 'withdrawal' | 'deposit' | 'ad_watch' | 'plan_buy' | 'user_joined';
  title: string;
  userName: string;
  userPhone: string;
  amount?: number;
  method?: string;
  details: string;
  date: string;
  timestamp: number;
  isRead: boolean;
  targetId?: string;
}

export interface UserVisitorLog {
  id: string;
  userName: string;
  userPhone: string;
  city: string;
  device: string;
  action: string;
  timestamp: number;
  date: string;
}

export interface UserAnalyticsData {
  totalUsers: number;
  todayVisitors: number;
  onlineNow: number;
  newUsersToday: number;
  totalAdsWatched: number;
  activePlanSubscribers: {
    plan150: number;
    plan300: number;
    plan450: number;
  };
  visitorLogs: UserVisitorLog[];
}
