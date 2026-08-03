import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Bot,
  Send,
  Zap,
  Shield,
  Mail,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MessageCircle,
  CircleCheck,
} from "lucide-react";

function SupportChat() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hey! I'm Lumo, your TaskLumo assistant. What can I help you with today?",
      time: "now",
    },
  ]);
  const [tickets, setTickets] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [issueType, setIssueType] = useState("Select Issue Type");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [message, setMessage] = useState("");
  const chatBodyRef = useRef(null);
  const typeIntervalRef = useRef(null);

  const issueList = [
    "Payment Problem",
    "Withdrawal Pending",
    "Task Not Credited",
    "Account Issue",
    "Technical Bug",
    "Referral Problem",
    "Login Problem",
    "Other",
  ];

  const quickReplies = [
    "Withdrawal is pending",
    "Task not credited",
    "Referral bonus missing",
    "Can't log in",
    "App is crashing",
    "How to earn more?",
  ];

  useEffect(() => {
    const el = chatBodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping, typingText]);

  useEffect(() => {
    return () => {
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    };
  }, []);

  // ---------------------------------------------------------------------
  // Knowledge base — add a new { keywords: [...], reply: "..." } object
  // anytime you want Lumo to handle a new topic. Order matters: the first
  // matching entry wins, so keep more specific keywords above generic ones.
  // ---------------------------------------------------------------------
  const knowledgeBase = [
    {
      keywords: ["hi", "hii", "hlo", "hyy", "hello", "hey", "yo", "namaste"],
      reply:
        "Hey! I'm Lumo, your TaskLumo assistant. What can I help you with today — withdrawal, tasks, referrals, or something else?",
    },
    {
      keywords: ["thank", "thanks", "tysm", "thx", "thank you"],
      reply:
        "You're welcome! Happy to help. Let me know if anything else comes up.",
    },
    {
      keywords: ["bye", "goodbye", "see you", "ok bye"],
      reply:
        "Take care! If you need anything later, I'll be right here in this chat.",
    },
    {
      keywords: [
        "withdraw",
        "withdrawl",
        "withdrawal",
        "money not received",
        "payment pending",
        "payment not received",
      ],
      reply:
        "Your withdrawal is usually credited within 24 to 48 hours. Please wait patiently. If there's still an issue after that, feel free to contact our customer support team.",
    },
    {
      keywords: ["minimum withdraw", "min withdraw", "withdrawal limit"],
      reply:
        "The minimum withdrawal amount is ₹100. Once your balance crosses that, the withdraw button unlocks automatically on your Wallet page.",
    },
    {
      keywords: ["upi failed", "upi not working", "upi error", "upi problem"],
      reply:
        "UPI withdrawals can fail if the UPI ID is inactive or the name doesn't match your registered name. Please double-check your UPI ID under Wallet > Saved Payment, and try again.",
    },
    {
      keywords: [
        "payment method",
        "payment options",
        "how to withdraw",
        "paytm",
        "phonepe",
        "google pay",
      ],
      reply:
        "You can withdraw directly to UPI (Google Pay, PhonePe, Paytm) or your linked bank account. Add or update your preferred method under Wallet > Saved Payment.",
    },
    {
      keywords: ["bank", "ifsc", "account number", "wrong account"],
      reply:
        "If you've entered wrong bank details, don't worry — go to Wallet > Add Bank and update them before your next withdrawal request. Already-submitted requests can take 2-3 extra days to correct.",
    },
    {
      keywords: ["otp", "verification code", "code not received"],
      reply:
        "OTPs can take up to 2 minutes to arrive. Please check your SMS/spam folder, ensure good network signal, and tap 'Resend OTP' if it still hasn't arrived after 2 minutes.",
    },
    {
      keywords: ["kyc", "document", "id proof", "verify identity"],
      reply:
        "KYC is required only for withdrawals above ₹5,000. You can upload your ID proof under Profile > Change Password area's linked KYC section — it's usually verified within 24 hours.",
    },
    {
      keywords: [
        "task",
        "credit",
        "coins missing",
        "coins not added",
        "reward not received",
      ],
      reply:
        "Task rewards can take a few minutes to reflect after our ad partner confirms completion. If it's been over an hour, share the task name and your UID so I can check it manually.",
    },
    {
      keywords: ["task expired", "task gone", "task disappeared"],
      reply:
        "Some tasks are time-limited and refresh daily. If a task expired before you could finish it, don't worry — new tasks are added regularly on the Tasks page.",
    },
    {
      keywords: [
        "new task",
        "no tasks",
        "tasks not showing",
        "task list empty",
      ],
      reply:
        "If tasks aren't showing up, try pulling down to refresh the Tasks page or reopening the app. New tasks are added throughout the day, so check back if the list looks empty.",
    },
    {
      keywords: [
        "ads not loading",
        "ad not showing",
        "video not playing",
        "video stuck",
      ],
      reply:
        "Ad and video loading issues are usually caused by a weak connection or an outdated app version. Try switching to Wi-Fi or updating the app from the Play Store, then reopen the task.",
    },
    {
      keywords: [
        "survey disqualified",
        "survey rejected",
        "survey not counting",
      ],
      reply:
        "Surveys sometimes disqualify users based on the advertiser's criteria — this is decided by their system, not us. You won't lose coins for a disqualified survey, and new surveys refresh daily.",
    },
    {
      keywords: [
        "referral",
        "invite",
        "refer a friend",
        "invite code",
        "referral link",
        "share link",
      ],
      reply:
        "Referral bonuses unlock once your friend completes their first task. If they've done that and you still don't see it, send me their referral code and I'll look into it.",
    },
    {
      keywords: ["spin", "lucky spin", "wheel", "how to get spin"],
      reply:
        "You get 1 free Lucky Spin for every friend you refer who joins TaskLumo. Keep inviting friends to keep spinning and winning bonus coins!",
    },
    {
      keywords: [
        "streak",
        "daily bonus",
        "daily reward",
        "streak reset",
        "streak freeze",
      ],
      reply:
        "Your daily streak resets if you miss a day without completing at least one task. Complete one task every day to keep it climbing and unlock bigger streak bonuses.",
    },
    {
      keywords: ["level", "xp", "level up", "experience points"],
      reply:
        "You earn XP by completing tasks, claiming daily bonuses, and spinning the wheel. Every 100 XP takes you up one level, unlocking better rewards over time.",
    },
    {
      keywords: ["leaderboard", "rank", "top earners", "ranking"],
      reply:
        "The leaderboard updates in real time based on total coins earned. Keep completing tasks and referring friends to climb the ranks and earn bonus rewards.",
    },
    {
      keywords: ["badge", "achievement", "trophy"],
      reply:
        "Badges are unlocked automatically as you hit earning milestones. Check your Profile page to see which ones you've already earned and what's coming next.",
    },
    {
      keywords: [
        "login",
        "log in",
        "password",
        "cant sign in",
        "can't sign in",
        "logged out",
        "session expired",
      ],
      reply:
        "Sorry you're having trouble getting in. Try resetting your password from the login screen — if that doesn't work, share your registered email and I'll escalate this to our account team.",
    },
    {
      keywords: ["forgot username", "forgot email", "which email"],
      reply:
        "If you've forgotten which email you signed up with, try checking your inbox for our welcome email, or contact support with any details you remember (name, phone number) and we'll help you recover it.",
    },
    {
      keywords: [
        "change email",
        "update email",
        "change mobile",
        "update number",
      ],
      reply:
        "You can update your registered email or mobile number from Profile > Settings. If that option isn't visible to you, share your current registered email and I'll update it manually.",
    },
    {
      keywords: ["profile picture", "change photo", "update avatar"],
      reply:
        "You can change your profile picture anytime from Profile > Edit Profile. Supported formats are JPG and PNG, up to 5MB.",
    },
    {
      keywords: ["delete account", "remove account", "close account"],
      reply:
        "I'm sorry to see you go. Account deletion permanently removes your coin balance and history. If you'd still like to proceed, confirm your registered email and I'll pass this to our team.",
    },
    {
      keywords: ["fraud", "scam", "spam", "fake", "cheat"],
      reply:
        "Thanks for flagging this — we take fraud reports seriously. Please share as much detail as you can (screenshots, UID involved) and our trust & safety team will investigate within 48 hours.",
    },
    {
      keywords: ["phishing", "suspicious link", "suspicious message"],
      reply:
        "Please don't click links from unknown sources claiming to be TaskLumo. We never ask for your password or OTP over chat or email. Report any suspicious message to us immediately.",
    },
    {
      keywords: ["refund"],
      reply:
        "Coins spent on completed tasks aren't refundable, but if you were charged or deducted incorrectly, share the transaction details and I'll get it reviewed right away.",
    },
    {
      keywords: [
        "crash",
        "not opening",
        "app not working",
        "bug",
        "glitch",
        "freeze",
        "app not installing",
      ],
      reply:
        "Sorry about that. Please try force-closing the app and reopening it, or updating to the latest version from the Play Store. If it still crashes, tell me your phone model and I'll escalate it as a bug.",
    },
    {
      keywords: ["server down", "maintenance", "site down", "app down"],
      reply:
        "We occasionally run short maintenance windows to improve performance — these are usually announced in-app in advance. If the app feels stuck for longer than 30 minutes, let me know and I'll check for you.",
    },
    {
      keywords: ["storage", "app size", "cache", "clear data"],
      reply:
        "If the app feels slow, try clearing its cache from your phone's Settings > Apps > TaskLumo > Storage > Clear Cache. This won't affect your coins or account, only temporary files.",
    },
    {
      keywords: ["vpn", "location", "country", "region locked"],
      reply:
        "Using a VPN can sometimes cause ads and tasks to fail to load correctly, since advertisers target specific regions. For the best experience, please keep VPN off while using the app.",
    },
    {
      keywords: ["notification"],
      reply:
        "You can manage task and reward notifications from your phone's Settings > Apps > TaskLumo > Notifications. Let me know if you're missing reward alerts specifically and I'll check your account.",
    },
    {
      keywords: ["dark mode", "theme", "light mode"],
      reply:
        "TaskLumo currently runs in a dark, easy-on-the-eyes theme by default. A light mode option is on our roadmap — I'll pass along your interest to the product team!",
    },
    {
      keywords: ["language", "hindi", "change language"],
      reply:
        "Right now TaskLumo supports English by default. We're working on adding more language options soon, including Hindi — stay tuned for updates.",
    },
    {
      keywords: ["promo code", "coupon code", "gift code"],
      reply:
        "If you have a promo code, you can redeem it from Wallet > Redeem Code. Codes are case-sensitive and can only be used once per account.",
    },
    {
      keywords: ["update app", "new version", "app version"],
      reply:
        "We regularly roll out updates with new tasks and bug fixes. You can grab the latest version anytime from the Play Store — updating usually resolves most loading issues too.",
    },
    {
      keywords: ["feedback", "suggestion", "feature request"],
      reply:
        "We'd love to hear it! Please share your suggestion here or through the ticket form below, and our product team reviews every piece of feedback we receive.",
    },
    {
      keywords: ["rate the app", "review", "rating"],
      reply:
        "Thank you for considering it! You can rate TaskLumo on the Play Store from your app listing page — it really helps us grow and improve.",
    },
    {
      keywords: ["human", "real person", "agent", "talk to someone"],
      reply:
        "Of course — I can connect you with a human agent. Please raise a formal ticket using the section below and our support team will personally follow up within 24 hours.",
    },
    {
      keywords: ["timing", "working hours", "response time", "how long"],
      reply:
        "Our support team is active 24/7, and most tickets get a first response within 24-48 hours. Payment-related issues are always prioritized.",
    },
    {
      keywords: ["free", "cost", "charge", "paid app"],
      reply:
        "TaskLumo is completely free to use — there are no hidden charges. You earn coins by completing tasks, and withdraw real money once you hit the minimum threshold.",
    },
    {
      keywords: ["how to earn", "earn more", "increase earning", "more coins"],
      reply:
        "The fastest way to earn more is completing daily tasks consistently, keeping your streak alive, spinning the Lucky Wheel, and inviting friends through your referral link.",
    },
    {
      keywords: ["age", "eligibility", "who can use"],
      reply:
        "TaskLumo is available for users aged 18 and above. You'll need a valid email and phone number to sign up and start earning.",
    },
    {
      keywords: ["terms", "terms and conditions", "terms of service"],
      reply:
        "You can read our full Terms and Conditions anytime from the Terms page linked in your Profile or the app footer.",
    },
    {
      keywords: ["privacy", "privacy policy", "data safety", "my data"],
      reply:
        "We take your privacy seriously. You can read exactly what data we collect and how it's used in our Privacy Policy, linked from your Profile page.",
    },
    {
      keywords: ["tax", "tds", "gst", "income tax"],
      reply:
        "Earnings above certain thresholds may be subject to TDS as per Indian tax regulations. Please consult a tax advisor for guidance specific to your situation.",
    },
    {
      keywords: [
        "multiple account",
        "second account",
        "another account",
        "multiple devices",
      ],
      reply:
        "Each user is allowed only one TaskLumo account. Multiple accounts from the same device or details may lead to suspension of all linked accounts and forfeited coins.",
    },
    {
      keywords: [
        "how are you",
        "how r u",
        "how are u",
        "kaise ho",
        "kaisa hai",
      ],
      reply:
        "I'm doing great, thanks for asking! I'm here and ready to help — what's on your mind?",
    },
    {
      keywords: ["what is your name", "who are you", "what's your name"],
      reply:
        "I'm Lumo, the AI assistant built into TaskLumo. I help with withdrawals, tasks, referrals, account issues, and pretty much anything else about the app.",
    },
    {
      keywords: ["good morning"],
      reply:
        "Good morning! Hope you have a great earning day ahead. What can I help you with?",
    },
    {
      keywords: ["good night", "gn"],
      reply:
        "Good night! Rest well — your tasks and streak will be waiting for you tomorrow.",
    },
    {
      keywords: ["good afternoon"],
      reply: "Good afternoon! How can I help you today?",
    },
    {
      keywords: ["good evening"],
      reply: "Good evening! What can I do for you?",
    },
    {
      keywords: ["lol", "haha", "lmao", "funny"],
      reply:
        "Haha, glad you're enjoying the vibe! Let me know if there's anything I can help with.",
    },
    {
      keywords: ["i love you", "love you"],
      reply:
        "That's sweet of you! I'm just an assistant, but I really do want to help make your TaskLumo experience great.",
    },
    {
      keywords: ["what can you do", "what do you do", "your job", "help me"],
      reply:
        "I can help with withdrawals, task issues, referrals, login problems, account settings, XP/streaks, technical bugs, and more. Just tell me what's going on!",
    },
    {
      keywords: [
        "are you real",
        "are you human",
        "are you a bot",
        "are you ai",
      ],
      reply:
        "I'm an AI assistant built specifically for TaskLumo — not a human, but I'm trained to actually solve your issues, not just chat.",
    },
    {
      keywords: ["what is tasklumo", "about tasklumo", "what is this app"],
      reply:
        "TaskLumo is a gamified earning platform where you complete simple tasks — surveys, app installs, games, and more — to earn coins, which you can withdraw as real money.",
    },
    {
      keywords: [
        "why tasklumo",
        "why choose tasklumo",
        "why use tasklumo",
        "why should i use tasklumo",
      ],
      reply:
        "TaskLumo stands out with instant task credits, low ₹100 withdrawal minimum, daily streak bonuses, a Lucky Spin wheel, and real cash payouts via UPI — all backed by verified ad partners.",
    },
    {
      keywords: [
        "tasklumo review",
        "tasklumo trustworthy",
        "tasklumo experience",
      ],
      reply:
        "Thousands of users complete tasks and withdraw earnings on TaskLumo daily. We focus on fast payouts and genuine ad partners to keep the experience reliable.",
    },
    {
      keywords: ["how does it work", "how to use", "how to start"],
      reply:
        "Just head to the Tasks page, pick any available task, complete it as instructed, and coins get credited automatically. Keep your streak alive for bonus rewards!",
    },
    {
      keywords: [
        "is it safe",
        "is it legit",
        "is it trustworthy",
        "genuine app",
      ],
      reply:
        "Yes, TaskLumo is a genuine platform with verified ad partners and secure withdrawals. We never ask for your password or OTP outside the app.",
    },
    {
      keywords: ["contact number", "phone number", "call support"],
      reply:
        "We currently support you over email and this chat — there isn't a phone line yet. Email us at tasklumosupport@gmail.com and we'll get back within 24-48 hours.",
    },
    {
      keywords: ["office", "company address", "where are you located"],
      reply:
        "TaskLumo operates online and primarily supports users through the app and email — we don't have a public walk-in office at the moment.",
    },
    {
      keywords: ["wrong upi", "wrong details", "typo in upi"],
      reply:
        "If you submitted a withdrawal with a typo in your UPI ID, contact support immediately with your correct details — we can usually stop and correct it before processing.",
    },
    {
      keywords: ["how many tasks", "task limit", "daily task limit"],
      reply:
        "There's no fixed daily task limit — complete as many available tasks as you'd like! New ones keep refreshing throughout the day.",
    },
    {
      keywords: ["survey time", "how long survey", "survey length"],
      reply:
        "Survey length varies by provider, usually anywhere from 5 to 20 minutes. The estimated time and reward are always shown before you start.",
    },
    {
      keywords: ["app install task", "install task not working"],
      reply:
        "For install tasks, make sure you install through the link provided in the task and keep the app open for the required time — closing it too early can prevent credit.",
    },
    {
      keywords: ["game task", "play game task", "game not counting"],
      reply:
        "Game tasks usually require reaching a certain level or playing for a set duration. Check the task instructions carefully — partial progress isn't tracked by us, it depends on the game partner.",
    },
    {
      keywords: ["minimum age", "under 18", "am i eligible"],
      reply:
        "TaskLumo requires users to be 18 or older to sign up and withdraw earnings, in line with our eligibility policy.",
    },
    {
      keywords: ["how much can i earn", "max earning", "earning potential"],
      reply:
        "Earnings depend on how many tasks, referrals, and streaks you keep up with — there's no fixed cap, and consistent daily activity earns the most over time.",
    },
    {
      keywords: ["screenshot", "proof of task", "attach image"],
      reply:
        "If you need to share a screenshot for a task or ticket issue, please attach it while raising a formal ticket below so our team can review it properly.",
    },
    {
      keywords: ["email not verified", "verify email", "confirmation email"],
      reply:
        "Check your inbox (and spam folder) for our verification email. If it hasn't arrived in a few minutes, you can request a new one from the login screen.",
    },
    {
      keywords: ["change password", "reset password", "new password"],
      reply:
        "You can reset your password anytime from Profile > Change Password, or use 'Forgot Password' on the login screen if you're logged out.",
    },
    {
      keywords: ["two accounts merge", "merge account", "combine account"],
      reply:
        "Unfortunately accounts can't be merged. Each TaskLumo account is tied individually to one user for security and fairness reasons.",
    },
    {
      keywords: [
        "withdraw failed",
        "transaction failed",
        "money deducted not received",
      ],
      reply:
        "If a withdrawal shows as failed but coins were deducted, don't worry — failed transactions are automatically reversed to your wallet within 24-48 hours.",
    },
    {
      keywords: ["how to contact admin", "talk to admin", "message admin"],
      reply:
        "You can reach our admin/support team by raising a formal ticket below, or emailing tasklumosupport@gmail.com directly.",
    },
    {
      keywords: ["update profile", "edit details", "change name"],
      reply:
        "You can update your name and other profile details from Profile > Edit Profile at any time.",
    },
    {
      keywords: ["thank you so much", "thanks a lot", "appreciate it"],
      reply: "You're very welcome! Always happy to help — reach out anytime.",
    },
    {
      keywords: ["sorry", "my bad", "mistake"],
      reply: "No worries at all! Let's sort it out — what happened?",
    },
    {
      keywords: ["cool", "nice", "great", "awesome"],
      reply:
        "Glad to hear that! Let me know if there's anything else I can help with.",
    },
    {
      keywords: ["what's up", "whats up", "sup"],
      reply:
        "Not much, just here helping TaskLumo users! What's up with you — anything I can help with?",
    },
    {
      keywords: ["joke", "tell me a joke"],
      reply:
        "Here's one: Why did the coin apply for a loan? Because it wanted to make some interest! Anyway, what can I help you with today?",
    },
    {
      keywords: [
        "wallet balance",
        "check balance",
        "my balance",
        "coin balance",
      ],
      reply:
        "You can check your current coin balance anytime on the Wallet page — it updates instantly after every completed task or bonus.",
    },
    {
      keywords: ["convert coins", "coins to rupees", "coin value", "1 coin"],
      reply:
        "Coins are converted to real money at a fixed rate shown on your Wallet page. The exact conversion rate is displayed before you confirm any withdrawal.",
    },
    {
      keywords: [
        "withdrawal history",
        "past withdrawals",
        "previous withdrawal",
      ],
      reply:
        "You can view all your past withdrawal requests and their status under Wallet > Withdrawal History.",
    },
    {
      keywords: [
        "processing time",
        "how long withdrawal take",
        "withdrawal time",
      ],
      reply:
        "Withdrawals are typically processed within 24-48 hours. During high-volume periods, it may occasionally take a bit longer — thanks for your patience!",
    },
    {
      keywords: [
        "daily limit withdraw",
        "how much can i withdraw",
        "max withdrawal",
      ],
      reply:
        "There's no strict maximum withdrawal limit, but very large amounts may require additional KYC verification for security.",
    },
    {
      keywords: ["add upi", "link upi", "new upi id"],
      reply:
        "You can add or update your UPI ID anytime from Wallet > Saved Payment. Make sure the name matches your registered account name.",
    },
    {
      keywords: ["remove payment method", "delete upi", "delete bank"],
      reply:
        "You can remove a saved payment method from Wallet > Saved Payment by selecting it and choosing remove.",
    },
    {
      keywords: ["screen recording", "recording task", "video proof task"],
      reply:
        "Some tasks may ask for a screen recording as proof. Follow the exact instructions shown in that task, and upload it through the ticket form if requested.",
    },
    {
      keywords: ["ad blocker", "adblock", "ads blocked"],
      reply:
        "Please disable any ad blocker or VPN while completing tasks — ad blockers often prevent tasks and rewards from registering correctly.",
    },
    {
      keywords: ["battery saver", "background app", "app killed"],
      reply:
        "If your phone's battery saver closes the app in the background, some tasks may not complete properly. Try disabling battery optimization for TaskLumo in your phone settings.",
    },
    {
      keywords: ["internet slow", "slow loading", "buffering"],
      reply:
        "A weak or unstable internet connection can cause tasks and ads to load slowly or fail. Try switching between Wi-Fi and mobile data to see if it improves.",
    },
    {
      keywords: ["screen not responding", "app frozen", "stuck loading"],
      reply:
        "If the app freezes or gets stuck loading, try force-closing it from your recent apps and reopening. If it persists, let me know your device model.",
    },
    {
      keywords: ["referral code not working", "invalid referral code"],
      reply:
        "Make sure the referral code is entered exactly as shared, with no extra spaces, and only during signup — it can't be added after account creation.",
    },
    {
      keywords: ["how many referrals", "referral limit", "max referrals"],
      reply:
        "There's no cap on referrals — the more friends you invite who complete their first task, the more bonus coins and spins you earn.",
    },
    {
      keywords: ["referral bonus amount", "how much per referral"],
      reply:
        "The referral bonus amount is shown on the Refer & Earn page and may vary occasionally as part of special promotions.",
    },
    {
      keywords: ["daily bonus not received", "missed daily bonus"],
      reply:
        "Daily bonuses must be claimed manually each day from the Home screen — if you forget to tap it, that day's bonus can't be recovered, but your streak stays safe if you complete a task.",
    },
    {
      keywords: ["spin not working", "spin failed", "spin cooldown"],
      reply:
        "Lucky Spin has a cooldown between uses, and you'll need an available spin (earned via referrals) to use it. Check the Home screen for your spin countdown.",
    },
    {
      keywords: ["xp not increasing", "level stuck", "level not updating"],
      reply:
        "XP updates after each completed task, bonus claim, or spin. If it seems stuck, try refreshing the Home page — if it still doesn't update, let me know.",
    },
    {
      keywords: ["app icon missing", "shortcut gone", "app disappeared"],
      reply:
        "If the app icon disappeared from your home screen, it may have been uninstalled accidentally. Reinstall it from the Play Store — your account and coins stay safe.",
    },
    {
      keywords: ["switch phone", "new phone", "changed device"],
      reply:
        "No problem — just log in with your same email and password on the new device, and all your coins, streaks, and history will be right there.",
    },
    {
      keywords: ["lost phone", "phone stolen"],
      reply:
        "If your phone is lost or stolen, reset your password immediately from another device using 'Forgot Password', and contact support to help secure your account.",
    },
    {
      keywords: [
        "hacked",
        "unauthorized login",
        "someone else using my account",
      ],
      reply:
        "If you suspect unauthorized access, reset your password right away and contact support with your registered email — we'll help lock down your account.",
    },
    {
      keywords: ["can i use two devices", "login multiple devices"],
      reply:
        "You can log into your account from multiple devices, but please avoid creating separate accounts — that's against our policy and can lead to suspension.",
    },
    {
      keywords: ["suspended", "banned", "account blocked", "account locked"],
      reply:
        "If your account has been suspended, it's usually due to policy violations like multiple accounts or fraudulent activity. Raise a formal ticket with your details and our team will review it.",
    },
    {
      keywords: ["appeal ban", "unban", "reactivate account"],
      reply:
        "To appeal a suspension, please raise a formal ticket explaining your situation — our trust & safety team reviews every appeal individually.",
    },
    {
      keywords: ["data safe", "is my data secure", "data protection"],
      reply:
        "Yes, your data is stored securely and handled according to our Privacy Policy. We never share your personal information with unauthorized third parties.",
    },
    {
      keywords: ["subscription", "premium plan", "vip membership"],
      reply:
        "TaskLumo doesn't currently have a paid subscription or VIP tier — all task earning features are free for every user.",
    },
    {
      keywords: ["ads too many", "too many ads", "annoying ads"],
      reply:
        "Ads help power the rewards you earn on tasks — we try to keep them balanced, and you can always skip optional ad tasks you're not interested in.",
    },
    {
      keywords: ["app slow", "lagging", "app lag"],
      reply:
        "If the app feels laggy, try clearing cache, freeing up storage space, or updating to the latest version — that resolves most performance issues.",
    },
    {
      keywords: ["can't update app", "update failed", "play store error"],
      reply:
        "If the app won't update, try clearing the Play Store cache or restarting your phone, then attempt the update again from the Play Store.",
    },
    {
      keywords: [
        "email support reply",
        "no reply from support",
        "waiting for reply",
      ],
      reply:
        "Sorry for the wait! Our team replies within 24-48 hours. If it's been longer, please share your ticket ID here so I can follow up.",
    },
    {
      keywords: ["how to raise ticket", "create ticket", "open ticket"],
      reply:
        "Just tap 'Prefer a formal ticket instead?' below, fill in your details and issue, and submit — you'll be able to track it under My Requests.",
    },
    {
      keywords: ["ticket status", "check ticket", "my ticket"],
      reply:
        "You can check the status and admin reply of your submitted tickets anytime by tapping 'My requests' below the ticket form.",
    },
    {
      keywords: ["cancel ticket", "delete ticket", "withdraw ticket"],
      reply:
        "Once submitted, tickets can't be deleted, but if it's no longer relevant, just let us know in a follow-up and we'll close it out.",
    },
    {
      keywords: ["ok", "okay", "alright", "fine"],
      reply: "Got it! Let me know if there's anything else I can help with.",
    },
    {
      keywords: ["yes", "yeah", "yup"],
      reply: "Great, go ahead and tell me more so I can help.",
    },
    {
      keywords: ["no", "nope", "nah"],
      reply: "No worries! Let me know if something else comes up.",
    },
    {
      keywords: ["kya haal hai", "sab badhiya", "theek hu"],
      reply: "Sab badhiya! Bataiye, aapki kis cheez mein madad kar sakta hoon?",
    },
    {
      keywords: ["madad chahiye", "problem hai", "issue hai"],
      reply:
        "Bilkul, batayein aapko exactly kya problem aa rahi hai — main turant help karta hoon.",
    },
  ];

  const getBotReply = (text) => {
    const t = text.toLowerCase();

    let bestMatch = null;
    let bestLength = 0;

    for (const entry of knowledgeBase) {
      for (const k of entry.keywords) {
        const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const pattern = new RegExp(`\\b${escaped}\\b`, "i");
        if (pattern.test(t) && k.length > bestLength) {
          bestMatch = entry;
          bestLength = k.length;
        }
      }
    }

    if (bestMatch) return bestMatch.reply;

    return "Got it — I've noted that down. A support specialist will follow up within 24 hours. You can also raise a formal ticket below to track this request with a reference ID.";
  };

  const typeBotMessage = (fullText) => {
    let i = 0;
    setTypingText("");

    typeIntervalRef.current = setInterval(() => {
      i += 1;
      setTypingText(fullText.slice(0, i));

      if (i >= fullText.length) {
        clearInterval(typeIntervalRef.current);
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: fullText, time: "now" },
        ]);
        setTypingText(null);
      }
    }, 16);
  };

  const submitTicket = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/support/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          uid,
          issueType,
          message,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message);
        return;
      }
      alert("Ticket Submitted Successfully ✅");
      setName("");
      setEmail("");
      setUid("");
      setMessage("");
      setIssueType("Select Issue Type");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const loadMyTickets = async () => {
    if (showRequests) {
      setShowRequests(false);
      return;
    }

    try {
      setLoadingTickets(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/support/my-tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setTickets(data.tickets);
        setShowRequests(true);
      } else {
        alert(data.message || "Could not load your requests");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while loading your requests");
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleSend = (text) => {
    const messageText = text || input;
    if (!messageText.trim() || isTyping || typingText !== null) return;

    setMessages((prev) => [
      ...prev,
      { from: "user", text: messageText, time: "now" },
    ]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      typeBotMessage(getBotReply(messageText));
    }, 3000);
  };

  return (
    <div className="support-wrapper">
      <style>{`
        * { box-sizing: border-box; }

        .support-wrapper {
          min-height: 100vh;
          padding: 16px;
          padding-bottom: 40px;
          color: white;
          font-family: 'Poppins', sans-serif;
          background:
            radial-gradient(circle at top left, rgba(255,140,0,0.18), transparent 25%),
            radial-gradient(circle at bottom right, rgba(250,204,21,0.10), transparent 30%),
            linear-gradient(135deg, #050505 0%, #0a0a0a 45%, #120909 100%);
          -webkit-tap-highlight-color: transparent;
        }

        .support-inner {
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
        }

        .support-wrapper ::selection {
          background: rgba(250,204,21,0.35);
          color: #000;
        }

        .support-wrapper *::-webkit-scrollbar {
          width: 5px;
        }
        .support-wrapper *::-webkit-scrollbar-track {
          background: transparent;
        }
        .support-wrapper *::-webkit-scrollbar-thumb {
          background: rgba(250,204,21,0.35);
          border-radius: 10px;
        }

        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          gap: 10px;
        }

        .top-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .back-btn {
          width: 36px;
          height: 36px;
          border-radius: 11px;
          background: rgba(17,17,17,0.9);
          border: 1px solid rgba(250,204,21,0.16);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          flex-shrink: 0;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }

        .back-btn:active { transform: scale(0.92); }
        .back-btn:hover { border-color: rgba(250,204,21,0.4); }

        .page-title {
          margin: 0;
          font-size: 21px;
          font-weight: 900;
          letter-spacing: -0.3px;
          background: linear-gradient(to right,#ffe27a,#facc15,#ffffff);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 4s linear infinite;
        }

        @keyframes shine {
          to { background-position: 200% center; }
        }

        .status-badge {
          background: rgba(250,204,21,0.10);
          border: 1px solid rgba(250,204,21,0.22);
          padding: 6px 11px;
          border-radius: 20px;
          font-size: 9px;
          color: #facc15;
          font-weight: 700;
          letter-spacing: 0.3px;
          display: flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
          box-shadow: 0 0 14px rgba(250,204,21,0.08);
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 rgba(34,197,94,0.6);
          animation: pulse 1.6s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          70% { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }

        @keyframes cardIn {
          from { opacity:0; transform:translateY(10px); }
          to { opacity:1; transform:translateY(0); }
        }

        @keyframes bubbleIn {
          from { opacity:0; transform:translateY(6px); }
          to { opacity:1; transform:translateY(0); }
        }

        .chat-card {
          position: relative;
          background: linear-gradient(180deg, rgba(20,20,20,0.95), rgba(14,14,14,0.95));
          border: 1px solid rgba(250,204,21,0.14);
          border-radius: 24px;
          overflow: hidden;
          backdrop-filter: blur(18px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.02) inset,
            0 20px 45px rgba(0,0,0,0.45),
            0 0 30px rgba(250,204,21,0.06);
          margin-bottom: 16px;
          animation: cardIn 0.4s ease both;
        }

        .chat-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(250,204,21,0.6), transparent);
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 15px 17px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.015);
        }

        .bot-avatar {
          width: 42px;
          height: 42px;
          border-radius: 13px;
          background: linear-gradient(135deg,#ffe27a,#facc15,#eab308);
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          box-shadow: 0 4px 16px rgba(250,204,21,0.35);
        }

        .online-dot {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid #161616;
        }

        .bot-name {
          font-size: 13.5px;
          font-weight: 800;
          margin: 0;
          letter-spacing: 0.1px;
        }

        .bot-sub {
          font-size: 9.5px;
          color: #b5a26a;
          margin: 3px 0 0;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
        }

        .chat-body {
          padding: 16px 15px 8px;
          height: 340px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .msg-row {
          display: flex;
          animation: bubbleIn 0.25s ease both;
        }

        .msg-row.bot { justify-content: flex-start; }
        .msg-row.user { justify-content: flex-end; }

        .bubble {
          max-width: 82%;
          padding: 10px 13px;
          border-radius: 15px;
          font-size: 11.5px;
          line-height: 17.5px;
        }

        .bubble.bot {
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.07);
          color: #e4e4e7;
          border-bottom-left-radius: 4px;
        }

        .bubble.user {
          background: linear-gradient(135deg,#ffe27a,#facc15,#eab308);
          color: #1a1400;
          font-weight: 600;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 14px rgba(250,204,21,0.25);
        }

        .typing-dots {
          display: flex;
          gap: 3px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          border-bottom-left-radius: 4px;
          width: fit-content;
        }

        .typing-dots span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #a1a1aa;
          animation: bounce 1.2s infinite;
        }

        .thinking-bubble {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 13px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          border-bottom-left-radius: 4px;
          font-size: 10.5px;
          color: #a1a1aa;
          font-weight: 500;
          width: fit-content;
        }

        .thinking-spinner {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          border: 2px solid rgba(250,204,21,0.25);
          border-top-color: #facc15;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .typing-dots.inline {
          display: inline-flex;
          padding: 0;
          background: none;
          border: none;
          border-radius: 0;
          width: auto;
        }

        .typing-dots span:nth-child(2) { animation-delay: 0.15s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.3s; }

        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        .type-cursor {
          display: inline-block;
          width: 2px;
          height: 11px;
          background: #a1a1aa;
          margin-left: 2px;
          vertical-align: middle;
          animation: blink 0.8s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .quick-replies {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          padding: 12px 15px 0;
        }

        .quick-chip {
          background: rgba(250,204,21,0.09);
          border: 1px solid rgba(250,204,21,0.22);
          color: #facc15;
          font-size: 9.5px;
          font-weight: 600;
          padding: 7px 11px;
          border-radius: 999px;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          transition: background 0.15s ease, transform 0.15s ease;
        }

        .quick-chip:hover { background: rgba(250,204,21,0.16); }
        .quick-chip:active { transform: scale(0.95); }

        .chat-input-row {
          display: flex;
          gap: 9px;
          padding: 13px 15px;
          border-top: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.015);
        }

        .chat-input {
          flex: 1;
          min-width: 0;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 13px;
          padding: 11px 14px;
          color: white;
          outline: none;
          font-size: 12px;
          font-family: 'Poppins', sans-serif;
          transition: border-color 0.15s ease, background 0.15s ease;
        }

        .chat-input:focus {
          border-color: rgba(250,204,21,0.4);
          background: rgba(255,255,255,0.06);
        }

        .send-btn {
          width: 42px;
          height: 42px;
          border-radius: 13px;
          background: linear-gradient(135deg,#ffe27a,#facc15,#eab308);
          border: none;
          color: #1a1400;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 4px 14px rgba(250,204,21,0.3);
        }

        .send-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(250,204,21,0.4); }
        .send-btn:active { transform: scale(0.94); }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 16px;
        }

        .info-card {
          background: linear-gradient(180deg, rgba(20,20,20,0.9), rgba(14,14,14,0.9));
          border: 1px solid rgba(250,204,21,0.12);
          border-radius: 15px;
          padding: 13px;
          text-align: center;
          animation: cardIn 0.4s ease both;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }

        .info-card:active { transform: scale(0.97); }

        .info-icon {
          width: 28px;
          height: 28px;
          border-radius: 9px;
          background: rgba(250,204,21,0.12);
          color: #facc15;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 7px;
          box-shadow: 0 0 12px rgba(250,204,21,0.1);
        }

        .info-text {
          font-size: 9.5px;
          color: #d4d4d8;
          font-weight: 600;
          margin: 0;
        }

        .section-card {
          position: relative;
          background: linear-gradient(180deg, rgba(20,20,20,0.9), rgba(14,14,14,0.9));
          border: 1px solid rgba(250,204,21,0.12);
          border-radius: 20px;
          padding: 18px;
          margin-bottom: 16px;
          backdrop-filter: blur(18px);
          animation: cardIn 0.4s ease both;
          box-shadow: 0 14px 30px rgba(0,0,0,0.35);
        }

        .section-card::before {
          content: "";
          position: absolute;
          top: 0; left: 16px; right: 16px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(250,204,21,0.4), transparent);
        }

        .section-title {
          color: #facc15;
          font-size: 15px;
          margin: 0 0 13px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 7px;
          letter-spacing: 0.1px;
        }

        .contact-line {
          color: #d4d4d8;
          font-size: 11.5px;
          line-height: 23px;
          margin: 0;
        }

        .contact-line .val { color: #facc15; font-weight: 700; }

        .ticket-toggle {
          width: 100%;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 15px;
          padding: 14px 15px;
          color: white;
          font-weight: 700;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          transition: border-color 0.15s ease, background 0.15s ease;
        }

        .ticket-toggle:hover {
          border-color: rgba(250,204,21,0.3);
          background: rgba(255,255,255,0.05);
        }

        .ticket-toggle-left {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #facc15;
        }

        .ticket-form {
          margin-top: 15px;
          animation: cardIn 0.3s ease both;
        }

        .field {
          width: 100%;
          padding: 13px 15px;
          border-radius: 13px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.035);
          color: white;
          outline: none;
          margin-bottom: 11px;
          font-size: 11.5px;
          font-family: 'Poppins', sans-serif;
          transition: border-color 0.15s ease, background 0.15s ease;
        }

        .field:focus {
          border-color: rgba(250,204,21,0.4);
          background: rgba(255,255,255,0.05);
        }

        textarea.field { resize: none; line-height: 20px; }

        .form-btn-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .form-btn {
          flex: 1;
          padding: 13px;
          border-radius: 13px;
          font-weight: 800;
          font-size: 11.5px;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          border: none;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .form-btn:active { transform: scale(0.97); }

        .form-btn.primary {
          background: linear-gradient(135deg,#ffe27a,#facc15,#eab308);
          color: #1a1400;
          box-shadow: 0 6px 18px rgba(250,204,21,0.28);
        }

        .form-btn.secondary {
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.09);
          color: white;
        }

        .notice-text {
          color: #d4d4d8;
          font-size: 10.5px;
          line-height: 22px;
          margin: 0;
        }

        .app-footer {
          text-align: center;
          padding: 22px 14px 6px;
        }

        .footer-brand {
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.3px;
          margin: 0 0 6px;
          background: linear-gradient(to right,#ffe27a,#facc15,#ffffff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .footer-tagline {
          font-size: 10px;
          color: #8a8a8f;
          line-height: 17px;
          max-width: 320px;
          margin: 0 auto 14px;
        }

        .footer-links {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }

        .footer-link {
          font-size: 10px;
          color: #d4c98a;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.15s ease;
        }

        .footer-link:hover { color: #facc15; }

        .footer-dot { color: rgba(255,255,255,0.2); font-size: 10px; }

        .footer-copy {
          font-size: 9px;
          color: #5a5a5f;
          margin: 0;
        }
      `}</style>

      <div className="support-inner">
        <div className="top-bar">
          <div className="top-left">
            <Link to="/home" className="back-btn">
              <ArrowLeft size={17} />
            </Link>
            <h1 className="page-title">Support</h1>
          </div>

          <div className="status-badge">
            <span className="pulse-dot" /> 24/7 Active
          </div>
        </div>

        <div className="chat-card">
          <div className="chat-header">
            <div className="bot-avatar">
              <Bot size={20} />
              <span className="online-dot" />
            </div>
            <div>
              <p className="bot-name">Lumo · AI Support</p>
              <p className="bot-sub">
                <Sparkles size={10} /> Usually replies in seconds
              </p>
            </div>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((m, i) => (
              <div className={`msg-row ${m.from}`} key={i}>
                <div className={`bubble ${m.from}`}>{m.text}</div>
              </div>
            ))}

            {isTyping && (
              <div className="msg-row bot">
                <div className="thinking-bubble">
                  <span className="thinking-spinner" />
                  Lumo is thinking
                  <span className="typing-dots inline">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            )}

            {typingText !== null && (
              <div className="msg-row bot">
                <div className="bubble bot">
                  {typingText}
                  <span className="type-cursor" />
                </div>
              </div>
            )}
          </div>

          <div className="quick-replies">
            {quickReplies.map((q, i) => (
              <button
                key={i}
                className="quick-chip"
                onClick={() => handleSend(q)}
                disabled={isTyping || typingText !== null}
                style={{ opacity: isTyping || typingText !== null ? 0.5 : 1 }}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="chat-input-row">
            <input
              className="chat-input"
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isTyping || typingText !== null}
            />
            <button
              className="send-btn"
              onClick={() => handleSend()}
              disabled={isTyping || typingText !== null}
              style={{ opacity: isTyping || typingText !== null ? 0.6 : 1 }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        <div className="info-grid">
          {[
            { icon: Zap, text: "Fast response" },
            { icon: MessageCircle, text: "Withdrawal help" },
            { icon: Shield, text: "Secure support" },
            { icon: CircleCheck, text: "Verified team" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div className="info-card" key={i}>
                <div className="info-icon">
                  <Icon size={13} />
                </div>
                <p className="info-text">{item.text}</p>
              </div>
            );
          })}
        </div>

        <div className="section-card">
          <h2 className="section-title">
            <Mail size={16} /> Contact information
          </h2>
          <p className="contact-line">
            Email: <span className="val">tasklumosupport@gmail.com</span>
          </p>
          <p className="contact-line">
            Support hours: <span className="val">24/7</span>
          </p>
          <p className="contact-line">
            Response time: <span className="val">Within 24-48 hours</span>
          </p>
        </div>

        <div className="section-card">
          <button
            className="ticket-toggle"
            onClick={() => setShowTicketForm(!showTicketForm)}
          >
            <span className="ticket-toggle-left">
              <Clock size={15} /> Prefer a formal ticket instead?
            </span>
            {showTicketForm ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>

          {showTicketForm && (
            <div className="ticket-form">
              <select
                className="field"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
              >
                <option style={{ color: "black" }}>Select Issue Type</option>
                {issueList.map((item, index) => (
                  <option key={index} style={{ color: "black" }}>
                    {item}
                  </option>
                ))}
              </select>

              <input
                className="field"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="field"
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="field"
                type="text"
                placeholder="Your UID (User ID)"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
              />
              <textarea
                className="field"
                placeholder="Describe your issue in detail..."
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <div className="form-btn-row">
                <button className="form-btn primary" onClick={submitTicket}>
                  Submit ticket
                </button>
                <button
                  className="form-btn secondary"
                  onClick={loadMyTickets}
                  disabled={loadingTickets}
                  style={{ opacity: loadingTickets ? 0.6 : 1 }}
                >
                  {loadingTickets
                    ? "Loading..."
                    : showRequests
                      ? "Hide requests"
                      : "My requests"}
                </button>
              </div>
            </div>
          )}

          {showRequests && (
            <div style={{ marginTop: "20px" }}>
              {tickets.length === 0 ? (
                <p style={{ color: "#aaa" }}>No tickets found.</p>
              ) : (
                tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    style={{
                      background: "#171717",
                      border: "1px solid rgba(255,255,255,.08)",
                      borderRadius: "16px",
                      padding: "16px",
                      marginTop: "15px",
                      boxShadow: "0 0 15px rgba(0,0,0,.25)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <h3
                        style={{
                          color: "#FFD54A",
                          margin: 0,
                          fontSize: "18px",
                        }}
                      >
                        {ticket.issueType}
                      </h3>

                      <span
                        style={{
                          padding: "5px 12px",
                          borderRadius: "20px",
                          fontWeight: "bold",
                          fontSize: "12px",
                          background:
                            ticket.status === "Closed"
                              ? "#16a34a"
                              : ticket.status === "In Progress"
                                ? "#2563eb"
                                : "#f59e0b",
                          color: "#fff",
                        }}
                      >
                        {ticket.status}
                      </span>
                    </div>

                    <p
                      style={{
                        color: "#ddd",
                        marginBottom: "15px",
                      }}
                    >
                      {ticket.message}
                    </p>

                    <div
                      style={{
                        background: "#202020",
                        padding: "12px",
                        borderRadius: "10px",
                      }}
                    >
                      <b style={{ color: "#FFD54A" }}>Admin Reply</b>

                      <p
                        style={{
                          color: "#fff",
                          marginTop: "8px",
                          marginBottom: 0,
                        }}
                      >
                        {ticket.adminReply || "Waiting for reply..."}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="section-card">
          <h2 className="section-title">Important notice</h2>
          <p className="notice-text">
            Submit only one request per issue to avoid delays. Ensure all
            information provided is accurate — fake or spam requests may lead to
            account suspension. Payments and rewards depend on verification from
            our advertising partners.
          </p>
        </div>

        <div className="section-card">
          <h2 className="section-title">Support guidelines</h2>
          <p className="notice-text">
            Our team reviews every request carefully. For faster resolution,
            chat with Lumo first — most issues get resolved instantly. Payment
            and account-related issues are prioritized on a high-priority basis.
          </p>
        </div>

        <div className="app-footer">
          <p className="footer-brand">TaskLumo</p>
          <p className="footer-tagline">
            Earn real rewards by completing simple everyday tasks — surveys, app
            installs, games, and more. Trusted by thousands of users across
            India.
          </p>

          <div className="footer-links">
            <Link to="/terms" className="footer-link">
              Terms
            </Link>
            <span className="footer-dot">•</span>
            <Link to="/privacy" className="footer-link">
              Privacy Policy
            </Link>
            <span className="footer-dot">•</span>
            <Link to="/faq" className="footer-link">
              FAQ
            </Link>
            <span className="footer-dot">•</span>
            <a href="mailto:tasklumosupport@gmail.com" className="footer-link">
              Contact Us
            </a>
          </div>

          <p className="footer-copy">
            © {new Date().getFullYear()} TaskLumo. All rights reserved. Made
            with ❤️ in India.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SupportChat;
