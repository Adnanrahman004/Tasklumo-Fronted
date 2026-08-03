import { useState } from "react";
import {
  Sparkles,
  Clock,
  Award,
  AlertTriangle,
  Trash2,
  CheckCheck,
} from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');`;

const palette = {
  bg: "#0B0B0D",
  card: "#151317",
  cardHover: "#1B181E",
  border: "rgba(255,255,255,0.07)",
  text: "#F2F1EE",
  subtext: "#8C8A91",
  faint: "#5D5B62",
  gold: "#C9A961",
  goldSoft: "rgba(201,169,97,0.14)",
  violet: "#8B7CF6",
  violetSoft: "rgba(139,124,246,0.14)",
  teal: "#3FBFAE",
  tealSoft: "rgba(63,191,174,0.14)",
  danger: "#D9534F",
};

const initialNotifications = [
  {
    id: 1,
    group: "Today",
    type: "welcome",
    title: "Welcome to TaskLumo",
    message:
      "Thanks for joining. Your first project is ready whenever you are.",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    group: "Today",
    type: "deadline",
    title: "Design review due soon",
    message: "\u201CHomepage revamp\u201D is due in 3 hours.",
    time: "45m ago",
    unread: true,
  },
  {
    id: 3,
    group: "Earlier",
    type: "achievement",
    title: "7-day streak reached",
    message: "You've completed tasks seven days in a row. Keep it up.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 4,
    group: "Earlier",
    type: "reminder",
    title: "Weekly planning reminder",
    message: "Set your priorities for next week in under five minutes.",
    time: "2 days ago",
    unread: false,
  },
];

const typeStyles = {
  welcome: { icon: Sparkles, color: palette.gold, soft: palette.goldSoft },
  deadline: {
    icon: AlertTriangle,
    color: palette.danger,
    soft: "rgba(217,83,79,0.14)",
  },
  achievement: { icon: Award, color: palette.teal, soft: palette.tealSoft },
  reminder: { icon: Clock, color: palette.violet, soft: palette.violetSoft },
};

function NotificationCard({ n, onDelete }) {
  const [hover, setHover] = useState(false);
  const meta = typeStyles[n.type];
  const Icon = meta.icon;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? palette.cardHover : palette.card,
        border: `1px solid ${palette.border}`,
        borderLeft: n.unread
          ? `2px solid ${palette.gold}`
          : `1px solid ${palette.border}`,
        borderRadius: "14px",
        padding: "16px 16px 16px 18px",
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        transition: "background 160ms ease, border-color 160ms ease",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "10px",
          background: meta.soft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={17} color={meta.color} strokeWidth={2} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <h2
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "14.5px",
              color: palette.text,
              margin: 0,
            }}
          >
            {n.title}
          </h2>
          {n.unread && (
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: palette.gold,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
          )}
        </div>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            color: palette.subtext,
            margin: "4px 0 0 0",
            lineHeight: 1.5,
          }}
        >
          {n.message}
        </p>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "11.5px",
            color: palette.faint,
            marginTop: 8,
            display: "inline-block",
          }}
        >
          {n.time}
        </span>
      </div>

      <button
        onClick={() => onDelete(n.id)}
        aria-label={`Delete notification: ${n.title}`}
        style={{
          background: "transparent",
          border: "none",
          padding: 8,
          borderRadius: 8,
          cursor: "pointer",
          opacity: hover ? 1 : 0.35,
          transition: "opacity 160ms ease, background 160ms ease",
          flexShrink: 0,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(217,83,79,0.12)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <Trash2 size={15} color={palette.danger} strokeWidth={2} />
      </button>
    </div>
  );
}

export default function Notification() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleDelete = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const groups = ["Today", "Earlier"].filter((g) =>
    notifications.some((n) => n.group === g),
  );
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: palette.bg,
        padding: "32px 20px",
      }}
    >
      <style>{FONT_IMPORT}</style>

      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 22,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h1
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 700,
                  fontSize: "22px",
                  color: palette.text,
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: palette.gold,
                    background: palette.goldSoft,
                    borderRadius: 20,
                    padding: "2px 8px",
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "transparent",
                border: `1px solid ${palette.border}`,
                color: palette.subtext,
                fontFamily: "Inter, sans-serif",
                fontSize: "12.5px",
                fontWeight: 500,
                padding: "7px 12px",
                borderRadius: 20,
                cursor: "pointer",
              }}
            >
              <CheckCheck size={13} />
              Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: palette.faint,
              fontFamily: "Inter, sans-serif",
              fontSize: "13.5px",
            }}
          >
            You're all caught up.
          </div>
        )}

        {groups.map((group) => (
          <div key={group} style={{ marginBottom: 24 }}>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: palette.faint,
                margin: "0 0 10px 4px",
              }}
            >
              {group}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {notifications
                .filter((n) => n.group === group)
                .map((n) => (
                  <NotificationCard key={n.id} n={n} onDelete={handleDelete} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
