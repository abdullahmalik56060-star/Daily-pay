import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const USER_STORES_FILE = path.join(DATA_DIR, 'user_stores.json');
const WITHDRAWALS_FILE = path.join(DATA_DIR, 'withdrawals.json');
const DEPOSITS_FILE = path.join(DATA_DIR, 'deposits.json');

function readJsonSafe<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e);
  }
  return fallback;
}

function writeJsonSafe(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(`Error writing ${filePath}:`, e);
  }
}

const getTodayDateStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API routes and Health checks
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Handle robots.txt for search engines/crawlers
  app.get('/robots.txt', (_req, res) => {
    res.type('text/plain').send('User-agent: *\nDisallow:\n');
  });

  // 1. User Registration endpoint
  app.post('/api/auth/register', (req, res) => {
    const { firstName, lastName, email, phone, password, referralCode } = req.body;
    const fName = (firstName || '').trim();
    const lName = (lastName || '').trim();
    const fullName = `${fName} ${lName}`.trim() || fName;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim();

    if (!fName) {
      return res.status(400).json({ success: false, message: 'پہلا نام (First Name) درج کرنا لازمی ہے۔' });
    }
    if (!lName) {
      return res.status(400).json({ success: false, message: 'دوسرا نام (Last Name) درج کرنا لازمی ہے۔' });
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return res.status(400).json({ success: false, message: 'درست ای میل ایڈریس درج کریں۔' });
    }
    const digits = cleanPhone.replace(/[^0-9]/g, '');
    if (digits.length < 10) {
      return res.status(400).json({ success: false, message: 'درست موبائل فون نمبر درج کریں۔ (مثال: 03001234567)' });
    }
    if (!password || password.length < 4) {
      return res.status(400).json({ success: false, message: 'پاس ورڈ کم از کم 4 حروف کا ہونا چاہیے۔' });
    }

    const users = readJsonSafe<any[]>(USERS_FILE, []);
    const duplicate = users.some(
      (u) =>
        (u.email && u.email.toLowerCase() === cleanEmail) ||
        (u.phone && u.phone.replace(/[^0-9]/g, '').endsWith(digits.slice(-10)))
    );

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: 'یہ ای میل یا فون نمبر پہلے سے رجسٹرڈ ہے۔ براہ کرم لاگ ان کریں۔ (Already registered, please login)',
      });
    }

    const newUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newCode = `DP-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = getTodayDateStr();

    const newUser = {
      id: newUserId,
      firstName: fName,
      lastName: lName,
      name: fullName,
      email: cleanEmail,
      phone: cleanPhone,
      password,
      referralCode: newCode,
      referredBy: (referralCode || '').trim() || undefined,
      joinedDate: today,
    };

    users.unshift(newUser);
    writeJsonSafe(USERS_FILE, users);

    // Create personal, completely isolated initial user store
    const userStores = readJsonSafe<Record<string, any>>(USER_STORES_FILE, {});
    const initialUserData = {
      balance: 25,
      totalEarned: 25,
      totalDeposited: 0,
      totalWithdrawn: 0,
      activePlan: null,
      dailyAds: {
        date: today,
        ad1Watched: false,
        ad2Watched: false,
      },
      dailyCheckInClaimed: false,
      transactions: [
        {
          id: `tx-welcome-${Date.now()}`,
          type: 'signup_bonus',
          title: 'Welcome Sign-up Bonus',
          amount: 25,
          isCredit: true,
          date: new Date().toLocaleDateString('en-PK', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: 'success',
          details: `Free welcome signup bonus (Rs 25 PKR) credited for ${fullName}`,
          userId: newUserId,
        },
      ],
      deposits: [],
      withdrawals: [],
      referralFriends: [],
      supportMessages: [],
    };

    userStores[newUserId] = initialUserData;
    writeJsonSafe(USER_STORES_FILE, userStores);

    const safeUser = { ...newUser };
    delete (safeUser as any).password;

    res.json({
      success: true,
      message: 'اکاؤنٹ کامیابی سے بن گیا اور 25 روپے ویلکم بونس والٹ میں شامل کر دیا گیا۔',
      user: safeUser,
      token: newUserId,
      data: initialUserData,
    });
  });

  // 2. User Login endpoint
  app.post('/api/auth/login', (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'ای میل/فون نمبر اور پاس ورڈ درج کریں۔' });
    }

    const cleanIdent = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/[^0-9]/g, '');

    const users = readJsonSafe<any[]>(USERS_FILE, []);
    const matchedUser = users.find((u) => {
      const emailMatch = u.email && u.email.toLowerCase() === cleanIdent;
      const uDigits = (u.phone || '').replace(/[^0-9]/g, '');
      const phoneMatch =
        cleanDigits.length >= 10 &&
        (uDigits.endsWith(cleanDigits.slice(-10)) || cleanDigits.endsWith(uDigits.slice(-10)));
      return emailMatch || phoneMatch;
    });

    if (!matchedUser) {
      return res.status(404).json({
        success: false,
        message: 'اکاؤنٹ موجود نہیں ہے۔ برائے مہربانی نیا اکاؤنٹ بنائیں (Sign Up کریں۔)',
      });
    }

    if (matchedUser.password !== password) {
      return res.status(401).json({ success: false, message: 'غلط پاس ورڈ! براہ کرم درست پاس ورڈ درج کریں۔' });
    }

    const userStores = readJsonSafe<Record<string, any>>(USER_STORES_FILE, {});
    let userData = userStores[matchedUser.id];
    if (!userData) {
      const today = getTodayDateStr();
      userData = {
        balance: 25,
        totalEarned: 25,
        totalDeposited: 0,
        totalWithdrawn: 0,
        activePlan: null,
        dailyAds: { date: today, ad1Watched: false, ad2Watched: false },
        dailyCheckInClaimed: false,
        transactions: [],
        deposits: [],
        withdrawals: [],
        referralFriends: [],
        supportMessages: [],
      };
      userStores[matchedUser.id] = userData;
      writeJsonSafe(USER_STORES_FILE, userStores);
    }

    const safeUser = { ...matchedUser };
    delete (safeUser as any).password;

    res.json({
      success: true,
      message: `خوش آمدید ${matchedUser.firstName}! آپ کامیابی سے لاگ ان ہو چکے ہیں۔`,
      user: safeUser,
      token: matchedUser.id,
      data: userData,
    });
  });

  // 3. Get User Profile and isolated Data
  app.get('/api/user/data/:userId', (req, res) => {
    const { userId } = req.params;
    const users = readJsonSafe<any[]>(USERS_FILE, []);
    const user = users.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userStores = readJsonSafe<Record<string, any>>(USER_STORES_FILE, {});
    const userData = userStores[userId] || {
      balance: 0,
      totalEarned: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      activePlan: null,
      dailyAds: { date: getTodayDateStr(), ad1Watched: false, ad2Watched: false },
      dailyCheckInClaimed: false,
      transactions: [],
      deposits: [],
      withdrawals: [],
      referralFriends: [],
      supportMessages: [],
    };

    const safeUser = { ...user };
    delete (safeUser as any).password;

    res.json({ success: true, user: safeUser, data: userData });
  });

  // 4. Sync User Data (strictly scoped to this userId)
  app.post('/api/user/sync/:userId', (req, res) => {
    const { userId } = req.params;
    const updateData = req.body;

    const userStores = readJsonSafe<Record<string, any>>(USER_STORES_FILE, {});
    const current = userStores[userId] || {};

    userStores[userId] = {
      ...current,
      ...updateData,
    };
    writeJsonSafe(USER_STORES_FILE, userStores);

    res.json({ success: true });
  });

  // 5. Platform Withdrawals (for Admin and syncing)
  app.get('/api/withdrawals', (_req, res) => {
    const withdrawals = readJsonSafe<any[]>(WITHDRAWALS_FILE, []);
    res.json({ success: true, withdrawals });
  });

  app.post('/api/withdrawals', (req, res) => {
    const withdrawal = req.body;
    if (!withdrawal || !withdrawal.id) {
      return res.status(400).json({ success: false, message: 'Invalid withdrawal payload' });
    }

    const withdrawals = readJsonSafe<any[]>(WITHDRAWALS_FILE, []);
    const existingIdx = withdrawals.findIndex((w) => w.id === withdrawal.id || w.referenceId === withdrawal.referenceId);
    if (existingIdx >= 0) {
      withdrawals[existingIdx] = withdrawal;
    } else {
      withdrawals.unshift(withdrawal);
    }
    writeJsonSafe(WITHDRAWALS_FILE, withdrawals);

    // Also update user's store
    if (withdrawal.userId) {
      const userStores = readJsonSafe<Record<string, any>>(USER_STORES_FILE, {});
      const uStore = userStores[withdrawal.userId];
      if (uStore) {
        uStore.withdrawals = uStore.withdrawals || [];
        const uIdx = uStore.withdrawals.findIndex((w: any) => w.id === withdrawal.id || w.referenceId === withdrawal.referenceId);
        if (uIdx >= 0) {
          uStore.withdrawals[uIdx] = withdrawal;
        } else {
          uStore.withdrawals.unshift(withdrawal);
        }
        writeJsonSafe(USER_STORES_FILE, userStores);
      }
    }

    res.json({ success: true, withdrawal });
  });

  app.post('/api/withdrawals/status', (req, res) => {
    const { withdrawalId, status, rejectReason, approvedBy } = req.body;
    const withdrawals = readJsonSafe<any[]>(WITHDRAWALS_FILE, []);
    const target = withdrawals.find((w) => w.id === withdrawalId || w.referenceId === withdrawalId);

    if (!target) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }

    target.status = status;
    if (rejectReason) target.rejectReason = rejectReason;
    if (approvedBy) target.approvedBy = approvedBy;
    if (status === 'completed') {
      target.receivedAt = new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
    }
    writeJsonSafe(WITHDRAWALS_FILE, withdrawals);

    // Update in user store & refund if rejected
    if (target.userId) {
      const userStores = readJsonSafe<Record<string, any>>(USER_STORES_FILE, {});
      const uStore = userStores[target.userId];
      if (uStore) {
        if (uStore.withdrawals) {
          uStore.withdrawals = uStore.withdrawals.map((w: any) =>
            w.id === withdrawalId || w.referenceId === withdrawalId
              ? { ...w, status, rejectReason, approvedBy, receivedAt: target.receivedAt }
              : w
          );
        }
        if (status === 'rejected') {
          // Refund balance to user
          uStore.balance = (uStore.balance || 0) + (target.amount || 0);
          uStore.totalWithdrawn = Math.max(0, (uStore.totalWithdrawn || 0) - (target.amount || 0));
        }
        writeJsonSafe(USER_STORES_FILE, userStores);
      }
    }

    res.json({ success: true, withdrawal: target });
  });

  // 6. Platform Deposits
  app.get('/api/deposits', (_req, res) => {
    const deposits = readJsonSafe<any[]>(DEPOSITS_FILE, []);
    res.json({ success: true, deposits });
  });

  app.post('/api/deposits', (req, res) => {
    const deposit = req.body;
    const deposits = readJsonSafe<any[]>(DEPOSITS_FILE, []);
    const existingIdx = deposits.findIndex((d) => d.id === deposit.id || d.transactionId === deposit.transactionId);
    if (existingIdx >= 0) {
      deposits[existingIdx] = deposit;
    } else {
      deposits.unshift(deposit);
    }
    writeJsonSafe(DEPOSITS_FILE, deposits);

    // Also update user's store
    if (deposit.userId) {
      const userStores = readJsonSafe<Record<string, any>>(USER_STORES_FILE, {});
      const uStore = userStores[deposit.userId];
      if (uStore) {
        uStore.deposits = uStore.deposits || [];
        const uIdx = uStore.deposits.findIndex((d: any) => d.id === deposit.id || d.transactionId === deposit.transactionId);
        if (uIdx >= 0) {
          uStore.deposits[uIdx] = deposit;
        } else {
          uStore.deposits.unshift(deposit);
        }
        writeJsonSafe(USER_STORES_FILE, userStores);
      }
    }

    res.json({ success: true, deposit });
  });

  // 7. Admin Registered Users list (clean, no passwords)
  app.get('/api/admin/users', (_req, res) => {
    const users = readJsonSafe<any[]>(USERS_FILE, []);
    const safeUsers = users.map((u) => {
      const copy = { ...u };
      delete copy.password;
      return copy;
    });
    res.json({ success: true, users: safeUsers });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
