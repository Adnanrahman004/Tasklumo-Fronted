import { Link } from "react-router-dom";
import { useState, useRef, useEffect, useCallback, memo } from "react";
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
  AlertCircle,
} from "lucide-react";

// Lumo knowledge base.
// Add a new { keywords: [...], reply: "..." } object anytime you want Lumo to
// handle a new topic. The LONGEST matching keyword wins, so specific phrases
// automatically beat generic words like "task" or "no".

const knowledgeBase = [
  {
    keywords: ["hi", "hii", "hlo", "hyy", "hello", "hey", "yo", "namaste"],
    reply:
      "Hey! I'm Lumo, your TaskNiri assistant. What can I help you with today — withdrawal, tasks, referrals, or something else?",
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
    keywords: ["new task", "no tasks", "tasks not showing", "task list empty"],
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
    keywords: ["survey disqualified", "survey rejected", "survey not counting"],
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
      "You get 1 free Lucky Spin for every friend you refer who joins TaskNiri. Keep inviting friends to keep spinning and winning bonus coins!",
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
      "Please don't click links from unknown sources claiming to be TaskNiri. We never ask for your password or OTP over chat or email. Report any suspicious message to us immediately.",
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
      "If the app feels slow, try clearing its cache from your phone's Settings > Apps > TaskNiri > Storage > Clear Cache. This won't affect your coins or account, only temporary files.",
  },
  {
    keywords: ["vpn", "location", "country", "region locked"],
    reply:
      "Using a VPN can sometimes cause ads and tasks to fail to load correctly, since advertisers target specific regions. For the best experience, please keep VPN off while using the app.",
  },
  {
    keywords: ["notification"],
    reply:
      "You can manage task and reward notifications from your phone's Settings > Apps > TaskNiri > Notifications. Let me know if you're missing reward alerts specifically and I'll check your account.",
  },
  {
    keywords: ["dark mode", "theme", "light mode"],
    reply:
      "TaskNiri currently runs in a dark, easy-on-the-eyes theme by default. A light mode option is on our roadmap — I'll pass along your interest to the product team!",
  },
  {
    keywords: ["language", "hindi", "change language"],
    reply:
      "Right now TaskNiri supports English by default. We're working on adding more language options soon, including Hindi — stay tuned for updates.",
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
      "Thank you for considering it! You can rate TaskNiri on the Play Store from your app listing page — it really helps us grow and improve.",
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
      "TaskNiri is completely free to use — there are no hidden charges. You earn coins by completing tasks, and withdraw real money once you hit the minimum threshold.",
  },
  {
    keywords: ["how to earn", "earn more", "increase earning", "more coins"],
    reply:
      "The fastest way to earn more is completing daily tasks consistently, keeping your streak alive, spinning the Lucky Wheel, and inviting friends through your referral link.",
  },
  {
    keywords: ["age", "eligibility", "who can use"],
    reply:
      "TaskNiri is available for users aged 18 and above. You'll need a valid email and phone number to sign up and start earning.",
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
      "Each user is allowed only one TaskNiri account. Multiple accounts from the same device or details may lead to suspension of all linked accounts and forfeited coins.",
  },
  {
    keywords: ["how are you", "how r u", "how are u", "kaise ho", "kaisa hai"],
    reply:
      "I'm doing great, thanks for asking! I'm here and ready to help — what's on your mind?",
  },
  {
    keywords: ["what is your name", "who are you", "what's your name"],
    reply:
      "I'm Lumo, the AI assistant built into TaskNiri. I help with withdrawals, tasks, referrals, account issues, and pretty much anything else about the app.",
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
  { keywords: ["good evening"], reply: "Good evening! What can I do for you?" },
  {
    keywords: ["lol", "haha", "lmao", "funny"],
    reply:
      "Haha, glad you're enjoying the vibe! Let me know if there's anything I can help with.",
  },
  {
    keywords: ["i love you", "love you"],
    reply:
      "That's sweet of you! I'm just an assistant, but I really do want to help make your TaskNiri experience great.",
  },
  {
    keywords: ["what can you do", "what do you do", "your job", "help me"],
    reply:
      "I can help with withdrawals, task issues, referrals, login problems, account settings, XP/streaks, technical bugs, and more. Just tell me what's going on!",
  },
  {
    keywords: ["are you real", "are you human", "are you a bot", "are you ai"],
    reply:
      "I'm an AI assistant built specifically for TaskNiri — not a human, but I'm trained to actually solve your issues, not just chat.",
  },
  {
    keywords: ["what is taskNiri", "about taskNiri", "what is this app"],
    reply:
      "TaskNiri is a gamified earning platform where you complete simple tasks — surveys, app installs, games, and more — to earn coins, which you can withdraw as real money.",
  },
  {
    keywords: [
      "why taskNiri",
      "why choose taskNiri",
      "why use taskNiri",
      "why should i use taskNiri",
    ],
    reply:
      "TaskNiri stands out with instant task credits, low ₹100 withdrawal minimum, daily streak bonuses, a Lucky Spin wheel, and real cash payouts via UPI — all backed by verified ad partners.",
  },
  {
    keywords: [
      "taskNiri review",
      "taskNiri trustworthy",
      "taskNiri experience",
    ],
    reply:
      "Thousands of users complete tasks and withdraw earnings on TaskNiri daily. We focus on fast payouts and genuine ad partners to keep the experience reliable.",
  },
  {
    keywords: ["how does it work", "how to use", "how to start"],
    reply:
      "Just head to the Tasks page, pick any available task, complete it as instructed, and coins get credited automatically. Keep your streak alive for bonus rewards!",
  },
  {
    keywords: ["is it safe", "is it legit", "is it trustworthy", "genuine app"],
    reply:
      "Yes, TaskNiri is a genuine platform with verified ad partners and secure withdrawals. We never ask for your password or OTP outside the app.",
  },
  {
    keywords: ["contact number", "phone number", "call support"],
    reply:
      "We currently support you over email and this chat — there isn't a phone line yet. Email us at tasklumosupport@gmail.com and we'll get back within 24-48 hours.",
  },
  {
    keywords: ["office", "company address", "where are you located"],
    reply:
      "TaskNiri operates online and primarily supports users through the app and email — we don't have a public walk-in office at the moment.",
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
      "TaskNiri requires users to be 18 or older to sign up and withdraw earnings, in line with our eligibility policy.",
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
      "Unfortunately accounts can't be merged. Each TaskNiri account is tied individually to one user for security and fairness reasons.",
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
      "Not much, just here helping TaskNiri users! What's up with you — anything I can help with?",
  },
  {
    keywords: ["joke", "tell me a joke"],
    reply:
      "Here's one: Why did the coin apply for a loan? Because it wanted to make some interest! Anyway, what can I help you with today?",
  },
  {
    keywords: ["wallet balance", "check balance", "my balance", "coin balance"],
    reply:
      "You can check your current coin balance anytime on the Wallet page — it updates instantly after every completed task or bonus.",
  },
  {
    keywords: ["convert coins", "coins to rupees", "coin value", "1 coin"],
    reply:
      "Coins are converted to real money at a fixed rate shown on your Wallet page. The exact conversion rate is displayed before you confirm any withdrawal.",
  },
  {
    keywords: ["withdrawal history", "past withdrawals", "previous withdrawal"],
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
      "If your phone's battery saver closes the app in the background, some tasks may not complete properly. Try disabling battery optimization for TaskNiri in your phone settings.",
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
    keywords: ["hacked", "unauthorized login", "someone else using my account"],
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
      "TaskNiri doesn't currently have a paid subscription or VIP tier — all task earning features are free for every user.",
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

const FALLBACK_REPLY =
  "Got it — I've noted that down. A support specialist will follow up within 24 hours. You can also raise a formal ticket below to track this request with a reference ID.";

// Regexes are compiled ONCE at module load (not on every message / render).
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const RULES = knowledgeBase.flatMap((entry) =>
  entry.keywords.map((k) => ({
    re: new RegExp(`\\b${escapeRegExp(k)}\\b`, "i"),
    len: k.length,
    reply: entry.reply,
  })),
);

function getBotReply(text) {
  let best = null;
  for (const rule of RULES) {
    if ((!best || rule.len > best.len) && rule.re.test(text)) best = rule;
  }
  return best ? best.reply : FALLBACK_REPLY;
}

const API_BASE = "https://tasklumo-backend.vercel.app/api/support";
const SUPPORT_EMAIL = "tasklumosupport@gmail.com";

const ISSUE_LIST = [
  "Payment Problem",
  "Withdrawal Pending",
  "Task Not Credited",
  "Account Issue",
  "Technical Bug",
  "Referral Problem",
  "Login Problem",
  "Other",
];

const QUICK_REPLIES = [
  "Withdrawal is pending",
  "Task not credited",
  "Referral bonus missing",
  "Can't log in",
  "App is crashing",
  "How to earn more?",
];

const INFO_ITEMS = [
  { icon: Zap, text: "Fast response" },
  { icon: MessageCircle, text: "Withdrawal help" },
  { icon: Shield, text: "Secure support" },
  { icon: CircleCheck, text: "Verified team" },
];

const THINK_DELAY = 900; // ms Lumo "thinks" before typing
const TYPE_CPS = 100; // characters typed per second

const STYLES = `
  .support-wrapper *, .support-wrapper *::before, .support-wrapper *::after { box-sizing: border-box; }

  .support-wrapper {
    /* ===== Theme tokens: milky white + green + black text ===== */
    --bg: #F2F5F3;
    --surface-top: #FDFEFD;
    --surface-bottom: #F3F7F4;
    --surface-soft: #F6F9F6;
    --brand: #16a34a;
    --brand-dark: #15803d;
    --brand-deep: #166534;
    --brand-light: #22c55e;
    --brand-tint: #dcfce7;
    --brand-tint-border: #86efac;
    --ink: #111827;
    --text-soft: #1f2937;
    --text-muted: #4b5563;
    --text-dim: #6b7280;
    --border: #dbe5dd;
    --border-strong: #bcc8c0;
    --field-border: #b6c3ba;
    --btn-gradient: linear-gradient(135deg, #159a46 0%, #15803d 60%, #166534 100%);
    --shadow-card: 0 1px 3px rgba(17,24,39,0.05), 0 12px 30px rgba(17,24,39,0.06);
    --shadow-green: 0 6px 18px rgba(22,163,74,0.30);
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
    --gutter: clamp(14px, 4vw, 40px);

    min-height: 100vh;
    min-height: 100dvh;
    padding: max(16px, env(safe-area-inset-top)) var(--gutter)
      max(40px, env(safe-area-inset-bottom));
    color: var(--ink);
    color-scheme: light;
    font-family: 'Poppins', sans-serif;
    background:
      radial-gradient(circle at top left, rgba(34,197,94,0.14), transparent 28%),
      radial-gradient(circle at bottom right, rgba(22,163,74,0.10), transparent 32%),
      linear-gradient(135deg, #F8FBF9 0%, #F2F5F3 50%, #ECF3EE 100%);
    background-attachment: fixed;
    -webkit-tap-highlight-color: transparent;
    -webkit-text-size-adjust: 100%;
  }

  .support-inner { width: 100%; max-width: 520px; margin: 0 auto; }

  .support-wrapper ::selection { background: rgba(34,197,94,0.30); color: #111827; }

  .support-wrapper * { scrollbar-width: thin; scrollbar-color: rgba(22,163,74,0.45) transparent; }
  .support-wrapper *::-webkit-scrollbar { width: 5px; }
  .support-wrapper *::-webkit-scrollbar-track { background: transparent; }
  .support-wrapper *::-webkit-scrollbar-thumb { background: rgba(22,163,74,0.45); border-radius: 10px; }

  .support-wrapper button:focus-visible,
  .support-wrapper a:focus-visible,
  .support-wrapper input:focus-visible,
  .support-wrapper select:focus-visible,
  .support-wrapper textarea:focus-visible {
    outline: 2px solid var(--brand);
    outline-offset: 2px;
  }

  /* ===== Layout ===== */
  .top-bar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: clamp(14px, 2vw, 22px);
    gap: 10px;
  }
  .top-left { display: flex; align-items: center; gap: 10px; min-width: 0; }

  .support-layout { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0; }
  .col-chat, .col-info { min-width: 0; }

  @media (min-width: 640px) { .support-inner { max-width: 720px; } }

  @media (min-width: 1024px) {
    .support-inner { max-width: 1180px; }
    .support-layout {
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
      gap: 22px;
      align-items: start;
    }
    .col-chat { position: sticky; top: 16px; }
  }
  @media (min-width: 1440px) { .support-inner { max-width: 1280px; } }

  /* ===== Top bar ===== */
  .back-btn {
    width: 38px; height: 38px;
    border-radius: 11px;
    background: #FCFDFC;
    border: 1px solid var(--border-strong);
    color: var(--brand-dark);
    display: flex; align-items: center; justify-content: center;
    text-decoration: none;
    flex-shrink: 0;
    box-shadow: 0 1px 3px rgba(17,24,39,0.06);
    transition: transform 0.2s var(--ease), border-color 0.2s ease;
  }
  .back-btn:active { transform: scale(0.92); }

  .page-title {
    margin: 0;
    font-size: clamp(21px, 1vw + 17px, 28px);
    font-weight: 900;
    letter-spacing: -0.3px;
    background: linear-gradient(to right, #15803d, #111827);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .status-badge {
    background: var(--brand-tint);
    border: 1px solid var(--brand-tint-border);
    padding: 7px 12px;
    border-radius: 20px;
    font-size: 11px;
    color: var(--brand-deep);
    font-weight: 700;
    letter-spacing: 0.3px;
    display: flex; align-items: center; gap: 6px;
    white-space: nowrap;
  }
  .pulse-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--brand-light);
    animation: pulse 1.6s infinite;
  }
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.55); }
    70% { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
    100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
  }

  @keyframes cardIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes bubbleIn { from { opacity: 0; transform: translateY(6px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

  /* ===== Chat card ===== */
  .chat-card {
    position: relative;
    display: flex; flex-direction: column;
    background: linear-gradient(180deg, var(--surface-top), var(--surface-bottom));
    border: 1px solid var(--border);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: var(--shadow-card);
    margin-bottom: 16px;
    animation: cardIn 0.45s var(--ease) both;
  }
  .chat-card::before {
    content: "";
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(22,163,74,0.7), transparent);
  }
  @media (min-width: 1024px) {
    .chat-card { height: min(740px, calc(100dvh - 120px)); min-height: 520px; margin-bottom: 0; }
  }

  .chat-header {
    display: flex; align-items: center; gap: 12px;
    padding: 15px 18px;
    border-bottom: 1px solid var(--border);
    background: rgba(22,163,74,0.04);
    flex-shrink: 0;
  }
  .bot-avatar {
    width: 44px; height: 44px;
    border-radius: 13px;
    background: var(--btn-gradient);
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    position: relative;
    box-shadow: 0 4px 14px rgba(22,163,74,0.35);
  }
  .online-dot {
    position: absolute; bottom: -1px; right: -1px;
    width: 11px; height: 11px; border-radius: 50%;
    background: var(--brand-light); border: 2px solid #fff;
  }
  .bot-name { font-size: 14.5px; font-weight: 800; margin: 0; letter-spacing: 0.1px; color: var(--ink); }
  .bot-sub {
    font-size: 11.5px; color: var(--text-muted);
    margin: 3px 0 0;
    display: flex; align-items: center; gap: 4px; font-weight: 500;
  }
  .bot-sub svg { color: var(--brand-dark); }

  .chat-body {
    padding: 16px 16px 8px;
    height: clamp(300px, 50dvh, 460px);
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    display: flex; flex-direction: column; gap: 11px;
  }
  @media (min-width: 1024px) {
    .chat-body { height: auto; flex: 1 1 auto; min-height: 0; padding: 20px 20px 10px; gap: 13px; }
  }

  .msg-row { display: flex; animation: bubbleIn 0.3s var(--ease) both; }
  .msg-row.bot { justify-content: flex-start; }
  .msg-row.user { justify-content: flex-end; }

  .bubble {
    max-width: 85%;
    padding: 10px 14px;
    border-radius: 16px;
    font-size: clamp(13px, 0.3vw + 12px, 14.5px);
    line-height: 1.6;
    overflow-wrap: anywhere;
    word-break: break-word;
  }
  @media (min-width: 1024px) { .bubble { max-width: 78%; } }

  .bubble.bot {
    background: #FFFFFF;
    border: 1px solid var(--border);
    color: var(--ink);
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 3px rgba(17,24,39,0.05);
  }
  .bubble.user {
    background: var(--btn-gradient);
    color: #fff;
    font-weight: 600;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 14px rgba(22,163,74,0.28);
  }

  .thinking-bubble {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 14px;
    background: var(--surface-soft);
    border: 1px solid var(--border);
    border-radius: 14px; border-bottom-left-radius: 4px;
    font-size: 12.5px; color: var(--text-muted); font-weight: 500;
    width: fit-content;
  }
  .thinking-spinner {
    width: 12px; height: 12px; border-radius: 50%;
    border: 2px solid rgba(22,163,74,0.25);
    border-top-color: var(--brand);
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .typing-dots { display: inline-flex; gap: 3px; }
  .typing-dots span {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--brand);
    animation: bounce 1.2s infinite;
  }
  .typing-dots span:nth-child(2) { animation-delay: 0.15s; }
  .typing-dots span:nth-child(3) { animation-delay: 0.3s; }
  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
    30% { transform: translateY(-4px); opacity: 1; }
  }

  .type-cursor {
    display: inline-block; width: 2px; height: 13px;
    background: var(--brand-dark); margin-left: 2px; vertical-align: middle;
    animation: blink 0.8s infinite;
  }
  @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }

  .quick-replies {
    display: flex; gap: 8px;
    padding: 12px 16px 2px;
    overflow-x: auto;
    flex-shrink: 0;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .quick-replies::-webkit-scrollbar { display: none; }
  @media (min-width: 640px) {
    .quick-replies { flex-wrap: wrap; overflow-x: visible; padding: 12px 18px 2px; }
  }
  .quick-chip {
    flex-shrink: 0;
    background: var(--brand-tint);
    border: 1px solid var(--brand-tint-border);
    color: var(--brand-deep);
    font-size: 12px; font-weight: 700;
    padding: 8px 13px;
    border-radius: 999px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    white-space: nowrap;
    transition: background 0.2s ease, transform 0.2s var(--ease), opacity 0.2s ease;
  }
  .quick-chip:active:not(:disabled) { transform: scale(0.95); }
  .quick-chip:disabled { cursor: not-allowed; opacity: 0.5; }

  .chat-input-row {
    display: flex; gap: 10px;
    padding: 13px 16px max(13px, env(safe-area-inset-bottom));
    border-top: 1px solid var(--border);
    background: rgba(22,163,74,0.04);
    flex-shrink: 0;
    margin-top: 10px;
  }
  .chat-input {
    flex: 1; min-width: 0;
    background: #FFFFFF;
    border: 1px solid var(--field-border);
    border-radius: 13px;
    padding: 12px 14px;
    color: var(--ink);
    outline: none;
    font-size: 16px; /* 16px stops iOS zoom-on-focus */
    font-family: 'Poppins', sans-serif;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .chat-input::placeholder { color: var(--text-dim); }
  .chat-input:focus { border-color: rgba(22,163,74,0.8); box-shadow: 0 0 0 3px rgba(34,197,94,0.15); }
  .chat-input:disabled { opacity: 0.7; background: var(--surface-soft); }

  .send-btn {
    width: 46px; height: 46px;
    border-radius: 13px;
    background: var(--btn-gradient);
    border: none; color: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0;
    transition: transform 0.2s var(--ease), box-shadow 0.2s ease, opacity 0.2s ease;
    box-shadow: var(--shadow-green);
  }
  .send-btn:active:not(:disabled) { transform: scale(0.94); }
  .send-btn:disabled { cursor: not-allowed; opacity: 0.5; }

  /* ===== Info grid ===== */
  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 16px;
  }
  @media (min-width: 640px) { .info-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; } }

  .info-card {
    background: linear-gradient(180deg, var(--surface-top), var(--surface-bottom));
    border: 1px solid var(--border);
    border-radius: 15px;
    padding: 14px 10px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(17,24,39,0.05);
    animation: cardIn 0.45s var(--ease) both;
    transition: transform 0.25s var(--ease), border-color 0.25s ease, box-shadow 0.25s ease;
  }
  .info-card:active { transform: scale(0.97); }
  .info-icon {
    width: 30px; height: 30px; border-radius: 9px;
    background: var(--brand-tint); color: var(--brand-dark);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 8px;
  }
  .info-text { font-size: 12px; color: var(--text-soft); font-weight: 600; margin: 0; }

  /* ===== Section cards ===== */
  .section-card {
    position: relative;
    background: linear-gradient(180deg, var(--surface-top), var(--surface-bottom));
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: clamp(16px, 2vw, 22px);
    margin-bottom: 16px;
    animation: cardIn 0.45s var(--ease) both;
    box-shadow: var(--shadow-card);
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
  }
  .col-info > .section-card:last-child { margin-bottom: 0; }
  @media (max-width: 1023px) { .col-info > .section-card:last-child { margin-bottom: 16px; } }

  .section-title {
    color: var(--brand-dark);
    font-size: clamp(15px, 0.4vw + 14px, 17px);
    margin: 0 0 12px;
    font-weight: 800;
    display: flex; align-items: center; gap: 8px;
    letter-spacing: 0.1px;
  }
  .contact-line { color: var(--text-soft); font-size: 13px; line-height: 1.9; margin: 0; overflow-wrap: anywhere; }
  .contact-line .val { color: var(--brand-dark); font-weight: 700; }

  .ticket-toggle {
    width: 100%;
    background: var(--surface-soft);
    border: 1px solid var(--border-strong);
    border-radius: 15px;
    padding: 14px 15px;
    color: var(--ink); font-weight: 700; font-size: 13.5px;
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    text-align: left;
    transition: border-color 0.2s ease, background 0.2s ease;
  }
  .ticket-toggle-left { display: flex; align-items: center; gap: 8px; color: var(--brand-dark); }

  .ticket-form { margin-top: 15px; animation: cardIn 0.35s var(--ease) both; }

  .field {
    display: block;
    width: 100%;
    padding: 13px 15px;
    border-radius: 13px;
    border: 1px solid var(--field-border);
    background: #FFFFFF;
    color: var(--ink);
    outline: none;
    margin-bottom: 11px;
    font-size: 16px; /* no iOS zoom */
    font-family: 'Poppins', sans-serif;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .field::placeholder { color: var(--text-dim); }
  .field:focus { border-color: rgba(22,163,74,0.8); box-shadow: 0 0 0 3px rgba(34,197,94,0.15); }
  select.field {
    appearance: none; -webkit-appearance: none; padding-right: 38px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2315803d' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
    background-repeat: no-repeat; background-position: right 14px center;
  }
  textarea.field { resize: vertical; min-height: 110px; line-height: 1.55; }

  @media (min-width: 640px) {
    .chat-input, .field { font-size: 14px; }
    .ticket-toggle { font-size: 14px; }
  }

  .form-btn-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .form-btn {
    flex: 1 1 140px;
    padding: 13px;
    border-radius: 13px;
    font-weight: 800; font-size: 13.5px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    border: none;
    transition: transform 0.2s var(--ease), box-shadow 0.2s ease, opacity 0.2s ease, border-color 0.2s ease;
  }
  .form-btn:active:not(:disabled) { transform: scale(0.97); }
  .form-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .form-btn.primary { background: var(--btn-gradient); color: #fff; box-shadow: var(--shadow-green); }
  .form-btn.secondary {
    background: var(--surface-soft);
    border: 1px solid var(--border-strong);
    color: var(--brand-deep);
  }

  .form-status {
    display: flex; align-items: flex-start; gap: 8px;
    padding: 10px 12px;
    border-radius: 12px;
    font-size: 12.5px; line-height: 1.5;
    margin-bottom: 12px;
    animation: cardIn 0.3s var(--ease) both;
  }
  .form-status svg { flex-shrink: 0; margin-top: 2px; }
  .form-status.error { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; }
  .form-status.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: var(--brand-deep); }

  /* Ticket list */
  .tickets { margin-top: 18px; }
  .tickets-empty { color: var(--text-muted); font-size: 13px; margin: 0; }
  .ticket-item {
    background: var(--surface-soft);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 16px;
    margin-top: 14px;
    animation: cardIn 0.35s var(--ease) both;
  }
  .ticket-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
  .ticket-type { color: var(--brand-dark); margin: 0; font-size: 16px; font-weight: 800; }
  .ticket-status {
    padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 12px;
    background: #fef3c7; color: #92400e; border: 1px solid #fcd34d;
  }
  .ticket-status.closed { background: var(--brand-tint); color: var(--brand-deep); border-color: var(--brand-tint-border); }
  .ticket-status.progress { background: #dbeafe; color: #1d4ed8; border-color: #93c5fd; }
  .ticket-msg { color: var(--text-soft); font-size: 13.5px; line-height: 1.6; margin: 0 0 14px; overflow-wrap: anywhere; }
  .ticket-reply { background: #FFFFFF; border: 1px solid var(--border); padding: 12px; border-radius: 10px; }
  .ticket-reply b { color: var(--brand-dark); font-size: 13px; }
  .ticket-reply p { color: var(--ink); font-size: 13.5px; line-height: 1.6; margin: 8px 0 0; overflow-wrap: anywhere; }

  .notice-text { color: var(--text-soft); font-size: 13px; line-height: 1.8; margin: 0; }

  /* ===== Footer ===== */
  .app-footer {
    text-align: center;
    padding: clamp(22px, 3vw, 36px) 14px 6px;
    margin-top: clamp(8px, 2vw, 24px);
    border-top: 1px solid var(--border-strong);
  }
  .footer-brand {
    font-size: 17px; font-weight: 900; letter-spacing: 0.3px; margin: 0 0 8px;
    background: linear-gradient(to right, #15803d, #111827);
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .footer-tagline { font-size: 12px; color: var(--text-muted); line-height: 1.7; max-width: 380px; margin: 0 auto 14px; }
  .footer-links { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 6px 10px; margin-bottom: 14px; }
  .footer-link { font-size: 12px; color: var(--brand-dark); text-decoration: none; font-weight: 700; padding: 4px 2px; transition: color 0.2s ease; }
  .footer-dot { color: #9ca3af; font-size: 11px; }
  .footer-copy { font-size: 11px; color: var(--text-dim); margin: 0; }

  /* Hover only on devices that really hover */
  @media (hover: hover) {
    .back-btn:hover { border-color: rgba(34,197,94,0.7); transform: translateY(-1px); }
    .quick-chip:hover:not(:disabled) { background: #bbf7d0; transform: translateY(-1px); }
    .send-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(22,163,74,0.40); }
    .ticket-toggle:hover { border-color: rgba(34,197,94,0.7); background: var(--brand-tint); }
    .form-btn.primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(22,163,74,0.40); }
    .form-btn.secondary:hover:not(:disabled) { border-color: rgba(34,197,94,0.7); background: var(--brand-tint); }
    .info-card:hover { transform: translateY(-3px); border-color: rgba(34,197,94,0.5); box-shadow: 0 10px 28px rgba(34,197,94,0.12); }
    .section-card:hover { border-color: rgba(34,197,94,0.4); box-shadow: 0 10px 28px rgba(34,197,94,0.10); }
    .footer-link:hover { color: var(--brand-deep); text-decoration: underline; }
  }

  /* ===== EXTRA RESPONSIVE + SMOOTHNESS LAYER ===== */
  .support-wrapper {
    padding-left: max(var(--gutter), env(safe-area-inset-left));
    padding-right: max(var(--gutter), env(safe-area-inset-right));
    overflow-x: clip;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  .section-title { text-wrap: balance; }
  .notice-text, .footer-tagline { text-wrap: pretty; }
  .col-info > :nth-child(1) { animation-delay: 0.04s; }
  .col-info > :nth-child(2) { animation-delay: 0.08s; }
  .col-info > :nth-child(3) { animation-delay: 0.12s; }
  .col-info > :nth-child(4) { animation-delay: 0.16s; }
  .col-info > :nth-child(5) { animation-delay: 0.20s; }

  /* Tablets (portrait iPad, Android tablets, foldables opened) */
  @media (min-width: 640px) and (max-width: 1023px) {
    .chat-body { height: clamp(380px, 50dvh, 560px); }
    .bubble { max-width: 80%; }
  }

  /* Small phones */
  @media (max-width: 379px) {
    .support-wrapper { --gutter: 12px; }
    .page-title { font-size: 20px; }
    .status-badge { font-size: 10px; padding: 6px 9px; gap: 5px; }
    .chat-header { padding: 12px 14px; }
    .bot-avatar { width: 40px; height: 40px; }
    .chat-body { padding: 12px 12px 6px; }
    .bubble { max-width: 92%; padding: 9px 12px; }
    .quick-replies { padding: 10px 12px 2px; }
    .quick-chip { font-size: 11.5px; padding: 7px 11px; }
    .chat-input-row { padding-left: 12px; padding-right: 12px; gap: 8px; }
    .info-grid { gap: 8px; }
    .info-card { padding: 12px 8px; }
    .section-card { border-radius: 16px; padding: 14px; }
    .form-btn { flex-basis: 100%; }
    .footer-links { gap: 4px 8px; }
  }
  /* Very narrow screens (Galaxy Fold cover, 280-320px) */
  @media (max-width: 319px) {
    .status-badge { display: none; }
    .info-grid { grid-template-columns: minmax(0, 1fr); }
    .bot-sub { display: none; }
  }

  /* Touch devices: comfortable tap targets */
  @media (pointer: coarse) {
    .quick-chip { min-height: 40px; }
    .back-btn { width: 42px; height: 42px; }
    .send-btn { width: 48px; height: 48px; }
    .ticket-toggle { min-height: 48px; }
    .form-btn { min-height: 46px; }
    .footer-link { padding: 8px 4px; }
  }

  /* Phones in landscape: two columns, chat fills the screen height */
  @media (orientation: landscape) and (max-height: 520px) and (max-width: 1023px) {
    .support-wrapper { padding-top: max(8px, env(safe-area-inset-top)); }
    .top-bar { margin-bottom: 8px; }
    .support-inner { max-width: none; }
    .support-layout { grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 16px; align-items: start; }
    .col-chat { position: sticky; top: 8px; }
    .chat-card { height: calc(100dvh - 76px); min-height: 260px; margin-bottom: 0; }
    .chat-body { height: auto; flex: 1 1 auto; min-height: 0; }
    .chat-header { padding: 10px 16px; }
    .info-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  /* Short laptop screens (768px-high laptops with browser bars) */
  @media (min-width: 1024px) and (max-height: 720px) {
    .chat-card { height: calc(100dvh - 96px); min-height: 400px; }
    .chat-header { padding: 11px 16px; }
  }

  /* Large monitors */
  @media (min-width: 1920px) {
    .support-inner { max-width: 1480px; }
    .support-layout { gap: 28px; }
    .chat-card { height: min(820px, calc(100dvh - 130px)); }
    .bubble { font-size: 15.5px; }
    .section-title { font-size: 18px; }
    .contact-line, .notice-text { font-size: 14px; }
    .chat-input, .field { font-size: 15px; }
    .quick-chip { font-size: 13px; }
    .info-text { font-size: 13px; }
  }
  /* 4K / ultra-wide */
  @media (min-width: 2560px) {
    .support-inner { max-width: 1760px; }
    .chat-card { height: min(920px, calc(100dvh - 150px)); }
    .page-title { font-size: 34px; }
    .bubble { font-size: 17px; }
    .section-title { font-size: 20px; }
    .contact-line, .notice-text { font-size: 15.5px; }
    .chat-input, .field { font-size: 16px; }
    .footer-tagline { font-size: 14px; max-width: 460px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .support-wrapper *, .support-wrapper *::before, .support-wrapper *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
  }
`;

const statusClass = (status) =>
  status === "Closed" ? "closed" : status === "In Progress" ? "progress" : "";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Chat pieces (memoised so typing never re-renders the rest of page)  */
/* ------------------------------------------------------------------ */

const Message = memo(function Message({ from, text }) {
  return (
    <div className={`msg-row ${from}`}>
      <div className={`bubble ${from}`}>{text}</div>
    </div>
  );
});

const MessageList = memo(function MessageList({ messages }) {
  return messages.map((m) => (
    <Message key={m.id} from={m.from} text={m.text} />
  ));
});

const ThinkingBubble = memo(function ThinkingBubble() {
  return (
    <div className="msg-row bot">
      <div className="thinking-bubble">
        <span className="thinking-spinner" />
        Lumo is thinking
        <span className="typing-dots">
          <span />
          <span />
          <span />
        </span>
      </div>
    </div>
  );
});

// Time-based typing (requestAnimationFrame): same speed on every device,
// and only THIS tiny component re-renders while the reply is typed.
function TypingMessage({ text, onTick, onDone }) {
  const [shown, setShown] = useState(0);
  const onTickRef = useRef(onTick);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onTickRef.current = onTick;
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(text.length);
      onDoneRef.current();
      return undefined;
    }
    let raf;
    let start;
    let last = 0;
    const step = (now) => {
      if (start === undefined) start = now;
      const count = Math.min(
        text.length,
        Math.floor(((now - start) / 1000) * TYPE_CPS),
      );
      if (count !== last) {
        last = count;
        setShown(count);
      }
      if (count >= text.length) {
        onDoneRef.current();
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  useEffect(() => {
    if (onTickRef.current) onTickRef.current();
  }, [shown]);

  return (
    <div className="msg-row bot" aria-hidden="true">
      <div className="bubble bot">
        {text.slice(0, shown)}
        <span className="type-cursor" />
      </div>
    </div>
  );
}

function ChatPanel() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "Hey! I'm Lumo, your TaskNiri assistant. What can I help you with today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState("idle"); // idle | thinking | typing
  const [reply, setReply] = useState("");

  const bodyRef = useRef(null);
  const timerRef = useRef(null);
  const idRef = useRef(2);
  const stickRef = useRef(true);

  const busy = phase !== "idle";

  const scrollToBottom = useCallback((smooth) => {
    const el = bodyRef.current;
    if (!el) return;
    if (smooth) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    else el.scrollTop = el.scrollHeight;
  }, []);

  // Smooth scroll when a message is added or the phase changes
  useEffect(() => {
    scrollToBottom(true);
  }, [messages.length, phase, scrollToBottom]);

  // While typing: stay pinned to bottom unless the user scrolled up to read
  const handleTick = useCallback(() => {
    if (stickRef.current) scrollToBottom(false);
  }, [scrollToBottom]);

  const handleScroll = () => {
    const el = bodyRef.current;
    if (!el) return;
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleSend = (text) => {
    const messageText = (typeof text === "string" ? text : input).trim();
    if (!messageText || busy) return;

    stickRef.current = true;
    setMessages((prev) => [
      ...prev,
      { id: idRef.current++, from: "user", text: messageText },
    ]);
    setInput("");
    setPhase("thinking");

    timerRef.current = setTimeout(() => {
      setReply(getBotReply(messageText));
      setPhase("typing");
    }, THINK_DELAY);
  };

  const handleTypingDone = () => {
    const id = idRef.current++;
    const text = reply;
    setMessages((prev) => [...prev, { id, from: "bot", text }]);
    setReply("");
    setPhase("idle");
  };

  return (
    <div className="chat-card">
      <div className="chat-header">
        <div className="bot-avatar">
          <Bot size={22} />
          <span className="online-dot" />
        </div>
        <div>
          <p className="bot-name">Lumo · AI Support</p>
          <p className="bot-sub">
            <Sparkles size={11} /> Usually replies in seconds
          </p>
        </div>
      </div>

      <div
        className="chat-body"
        ref={bodyRef}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
      >
        <MessageList messages={messages} />
        {phase === "thinking" && <ThinkingBubble />}
        {phase === "typing" && (
          <TypingMessage
            text={reply}
            onTick={handleTick}
            onDone={handleTypingDone}
          />
        )}
      </div>

      <div className="quick-replies">
        {QUICK_REPLIES.map((q) => (
          <button
            key={q}
            type="button"
            className="quick-chip"
            onClick={() => handleSend(q)}
            disabled={busy}
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
          aria-label="Type your message"
          enterKeyHint="send"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          onFocus={() => setTimeout(() => scrollToBottom(false), 300)}
        />
        <button
          type="button"
          className="send-btn"
          aria-label="Send message"
          onClick={() => handleSend()}
          disabled={busy || !input.trim()}
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ticket form (own state: typing in the form never re-renders chat)   */
/* ------------------------------------------------------------------ */

function TicketSection() {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [issueType, setIssueType] = useState("Select Issue Type");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState(null); // { type, text }

  const [tickets, setTickets] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const submitTicket = async () => {
    if (issueType === "Select Issue Type") {
      setFormStatus({ type: "error", text: "Please select an issue type." });
      return;
    }
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormStatus({
        type: "error",
        text: "Please fill in your name, email, and issue description.",
      });
      return;
    }

    try {
      setSubmitting(true);
      setFormStatus(null);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, uid, issueType, message }),
      });
      const data = await res.json();

      if (!data.success) {
        setFormStatus({
          type: "error",
          text: data.message || "Something went wrong. Please try again.",
        });
        return;
      }

      setFormStatus({
        type: "success",
        text: "Ticket submitted successfully ✅",
      });
      setName("");
      setEmail("");
      setUid("");
      setMessage("");
      setIssueType("Select Issue Type");
    } catch (err) {
      console.error(err);
      setFormStatus({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const loadMyTickets = async () => {
    if (showRequests) {
      setShowRequests(false);
      return;
    }
    try {
      setLoadingTickets(true);
      setFormStatus(null);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/my-tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setTickets(data.tickets);
        setShowRequests(true);
      } else {
        setFormStatus({
          type: "error",
          text: data.message || "Could not load your requests.",
        });
      }
    } catch (err) {
      console.error(err);
      setFormStatus({
        type: "error",
        text: "Something went wrong while loading your requests.",
      });
    } finally {
      setLoadingTickets(false);
    }
  };

  return (
    <div className="section-card">
      <button
        type="button"
        className="ticket-toggle"
        aria-expanded={showTicketForm}
        onClick={() => setShowTicketForm((v) => !v)}
      >
        <span className="ticket-toggle-left">
          <Clock size={15} /> Prefer a formal ticket instead?
        </span>
        {showTicketForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showTicketForm && (
        <div className="ticket-form">
          <select
            className="field"
            aria-label="Issue type"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
          >
            <option style={{ color: "black" }}>Select Issue Type</option>
            {ISSUE_LIST.map((item) => (
              <option key={item} style={{ color: "black" }}>
                {item}
              </option>
            ))}
          </select>

          <input
            className="field"
            type="text"
            placeholder="Your Name"
            aria-label="Your name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="field"
            type="email"
            placeholder="Your Email"
            aria-label="Your email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="field"
            type="text"
            placeholder="Your UID (User ID)"
            aria-label="Your UID"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
          />
          <textarea
            className="field"
            placeholder="Describe your issue in detail..."
            aria-label="Describe your issue"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {formStatus && (
            <div className={`form-status ${formStatus.type}`} role="status">
              {formStatus.type === "success" ? (
                <CircleCheck size={15} />
              ) : (
                <AlertCircle size={15} />
              )}
              <span>{formStatus.text}</span>
            </div>
          )}

          <div className="form-btn-row">
            <button
              type="button"
              className="form-btn primary"
              onClick={submitTicket}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit ticket"}
            </button>
            <button
              type="button"
              className="form-btn secondary"
              onClick={loadMyTickets}
              disabled={loadingTickets}
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
        <div className="tickets">
          {tickets.length === 0 ? (
            <p className="tickets-empty">No tickets found.</p>
          ) : (
            tickets.map((ticket) => (
              <div className="ticket-item" key={ticket.id}>
                <div className="ticket-head">
                  <h3 className="ticket-type">{ticket.issueType}</h3>
                  <span
                    className={`ticket-status ${statusClass(ticket.status)}`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <p className="ticket-msg">{ticket.message}</p>
                <div className="ticket-reply">
                  <b>Admin Reply</b>
                  <p>{ticket.adminReply || "Waiting for reply..."}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function SupportChat() {
  return (
    <div className="support-wrapper">
      <style>{STYLES}</style>

      <div className="support-inner">
        {/* ===== Top bar ===== */}
        <div className="top-bar">
          <div className="top-left">
            <Link to="/home" className="back-btn" aria-label="Back to Home">
              <ArrowLeft size={17} />
            </Link>
            <h1 className="page-title">Support</h1>
          </div>
          <div className="status-badge">
            <span className="pulse-dot" /> 24/7 Active
          </div>
        </div>

        <div className="support-layout">
          {/* ===== Left: Chat ===== */}
          <div className="col-chat">
            <ChatPanel />
          </div>

          {/* ===== Right: Info + Ticket ===== */}
          <div className="col-info">
            <div className="info-grid">
              {INFO_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="info-card" key={item.text}>
                    <div className="info-icon">
                      <Icon size={14} />
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
                Email: <span className="val">{SUPPORT_EMAIL}</span>
              </p>
              <p className="contact-line">
                Support hours: <span className="val">24/7</span>
              </p>
              <p className="contact-line">
                Response time: <span className="val">Within 24-48 hours</span>
              </p>
            </div>

            <TicketSection />

            <div className="section-card">
              <h2 className="section-title">Important notice</h2>
              <p className="notice-text">
                Submit only one request per issue to avoid delays. Ensure all
                information provided is accurate — fake or spam requests may
                lead to account suspension. Payments and rewards depend on
                verification from our advertising partners.
              </p>
            </div>

            <div className="section-card">
              <h2 className="section-title">Support guidelines</h2>
              <p className="notice-text">
                Our team reviews every request carefully. For faster resolution,
                chat with Lumo first — most issues get resolved instantly.
                Payment and account-related issues are prioritized on a
                high-priority basis.
              </p>
            </div>
          </div>
        </div>

        {/* ===== Footer ===== */}
        <div className="app-footer">
          <p className="footer-brand">TaskNiri</p>
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
            <a href={`mailto:${SUPPORT_EMAIL}`} className="footer-link">
              Contact Us
            </a>
          </div>

          <p className="footer-copy">
            © {new Date().getFullYear()} TaskNiri. All rights reserved. Made
            with ❤️ in India.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SupportChat;
