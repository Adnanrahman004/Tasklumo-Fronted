import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// TaskLumo — Admin.jsx (single file, dark theme, JWT auth, no mock data)

const API_BASE_URL = "http://localhost:5000";
const api = axios.create({ baseURL: API_BASE_URL });

const MENU_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "users", label: "Users", icon: "👥" },
  { key: "tasks", label: "Tasks", icon: "✅" },
  { key: "withdrawals", label: "Withdrawals", icon: "💸" },
  { key: "referrals", label: "Referrals", icon: "🔗" },
  { key: "notifications", label: "Notifications", icon: "🔔" },
  { key: "support", label: "Support", icon: "💬" },
];

function decodeJwt(token) {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const fmtDate = (v) =>
  !v || isNaN(new Date(v).getTime())
    ? "—"
    : new Date(v).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
const fmtDateTime = (v) =>
  !v || isNaN(new Date(v).getTime())
    ? "—"
    : new Date(v).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
const pickList = (res) => {
  const d = res.data;
  const l =
    d?.data ||
    d?.users ||
    d?.tasks ||
    d?.withdrawals ||
    d?.referrals ||
    d?.tickets ||
    d;
  return Array.isArray(l) ? l : [];
};

let toastSeq = 0;
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const remove = useCallback(
    (id) => setToasts((p) => p.filter((t) => t.id !== id)),
    [],
  );
  const push = useCallback(
    (message, type = "success") => {
      const id = ++toastSeq;
      setToasts((p) => [...p, { id, message, type }]);
      setTimeout(() => remove(id), 3500);
    },
    [remove],
  );
  return { toasts, push, remove };
}

const Spinner = ({ label = "Loading..." }) => (
  <div className="tl-spinner-wrap">
    <div className="tl-spinner" />
    <span>{label}</span>
  </div>
);
const Empty = ({ text = "Nothing to show yet." }) => (
  <div className="tl-empty">{text}</div>
);
const StatusBadge = ({ status }) => {
  const s = (status || "").toLowerCase();
  const cls = ["active", "approved", "open", "resolved"].includes(s)
    ? "tl-badge-green"
    : ["banned", "rejected", "closed"].includes(s)
      ? "tl-badge-red"
      : "tl-badge-amber";
  return <span className={`tl-badge ${cls}`}>{status || "—"}</span>;
};

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="tl-modal-overlay" onClick={onCancel}>
      <div className="tl-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="tl-modal-actions">
          <button className="tl-btn tl-btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="tl-btn tl-btn-danger" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const { toasts, push, remove } = useToasts();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState({ name: "Admin", email: "" });
  const token = useMemo(() => localStorage.getItem("adminToken"), []);

  useEffect(() => {
    if (!token) return navigate("/admin-login", { replace: true });
    const decoded = decodeJwt(token);
    if (decoded)
      setAdminInfo({
        name: decoded.name || decoded.adminName || "Admin",
        email: decoded.email || decoded.adminEmail || "",
      });

    const reqId = api.interceptors.request.use((c) => {
      c.headers = { ...c.headers, Authorization: `Bearer ${token}` };
      return c;
    });
    const resId = api.interceptors.response.use(
      (r) => r,
      (err) => {
        if (err?.response?.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin-login", { replace: true });
        }
        return Promise.reject(err);
      },
    );
    return () => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login", { replace: true });
  }, [navigate]);
  const onError = useCallback(
    (err, fallback = "Something went wrong. Please try again.") =>
      push(err?.response?.data?.message || err?.message || fallback, "error"),
    [push],
  );
  const currentDate = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [],
  );

  // NOTE: Tasks, Withdrawals, Referrals, Support are temporarily disabled
  // (backend routes for these are not implemented yet — enable once ready).
  const sections = {
    dashboard: <DashboardSection onError={onError} />,
    users: <UsersSection push={push} onError={onError} />,
    tasks: <ComingSoonSection label="Tasks" />,
    withdrawals: <ComingSoonSection label="Withdrawals" />,
    referrals: <ComingSoonSection label="Referrals" />,
    notifications: <NotificationsSection push={push} onError={onError} />,
    support: <ComingSoonSection label="Support" />,
    // Once backend routes are ready, swap the lines above back to:
    // tasks: <TasksSection push={push} onError={onError} />,
    // withdrawals: <WithdrawalsSection push={push} onError={onError} />,
    // referrals: <ReferralsSection onError={onError} />,
    // support: <SupportSection push={push} onError={onError} />,
  };

  return (
    <div className="tl-admin">
      <GlobalStyles />
      <div className="tl-toast-wrap">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`tl-toast tl-toast-${t.type}`}
            onClick={() => remove(t.id)}
          >
            <span className="tl-toast-icon">
              {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {sidebarOpen && (
        <div
          className="tl-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`tl-sidebar ${sidebarOpen ? "tl-sidebar-open" : ""}`}>
        <div className="tl-sidebar-brand">
          <span className="tl-brand-logo">TL</span>
          <span className="tl-brand-name">TaskLumo Admin</span>
        </div>
        <nav className="tl-sidebar-nav">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`tl-nav-item ${activeMenu === item.key ? "tl-nav-item-active" : ""}`}
              onClick={() => {
                setActiveMenu(item.key);
                setSidebarOpen(false);
              }}
            >
              <span className="tl-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="tl-nav-item tl-nav-logout" onClick={logout}>
          <span className="tl-nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </aside>

      <div className="tl-main">
        <header className="tl-navbar">
          <button
            className="tl-hamburger"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <div className="tl-navbar-title">
            {MENU_ITEMS.find((m) => m.key === activeMenu)?.label}
          </div>
          <div className="tl-navbar-right">
            <span className="tl-navbar-date">{currentDate}</span>
            <div className="tl-navbar-admin">
              <div className="tl-admin-avatar">
                {(adminInfo.name || "A").charAt(0).toUpperCase()}
              </div>
              <div className="tl-admin-meta">
                <span className="tl-admin-name">{adminInfo.name}</span>
                <span className="tl-admin-email">{adminInfo.email}</span>
              </div>
            </div>
            <button
              className="tl-btn tl-btn-danger tl-logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </header>
        <main className="tl-content">{sections[activeMenu]}</main>
      </div>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function DashboardSection({ onError }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/dashboard");
      // Backend shape: { success: true, stats: { totalUsers, totalTasks, pendingTasks, totalWithdraws, pendingWithdraws } }
      setData(res.data.stats);
    } catch (err) {
      onError(err, "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Spinner label="Loading dashboard..." />;
  if (!data) return <Empty text="Dashboard data unavailable." />;

  const cards = [
    ["Total Users", data.totalUsers, "👥"],
    ["Total Tasks", data.totalTasks, "📋"],
    ["Pending Tasks", data.pendingTasks, "⏳"],
    ["Total Withdrawals", data.totalWithdraws, "💰"],
    ["Pending Withdrawals", data.pendingWithdraws, "⌛"],
  ];

  // Recent Activity is disabled until the backend sends `recentActivity` in the dashboard response.
  // const recent = data.recentActivity || [];

  return (
    <div>
      <div className="tl-card-grid">
        {cards.map(([label, value, icon]) => (
          <div className="tl-stat-card" key={label}>
            <div className="tl-stat-icon">{icon}</div>
            <div>
              <div className="tl-stat-value">{value ?? 0}</div>
              <div className="tl-stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity panel — re-enable once backend returns `recentActivity` in /api/admin/dashboard
      <div className="tl-panel">
        <h3 className="tl-panel-title">Recent Activity</h3>
        {recent.length === 0 ? <Empty text="No recent activity." /> : (
          <ul className="tl-activity-list">
            {recent.map((a, i) => (
              <li key={a.id || i} className="tl-activity-item">
                <span className="tl-activity-dot" />
                <div><div className="tl-activity-text">{a.message || a.text}</div><div className="tl-activity-time">{fmtDateTime(a.createdAt || a.date)}</div></div>
              </li>
            ))}
          </ul>
        )}
      </div>
      */}
    </div>
  );
}

/* ---------------- Coming Soon placeholder (for sections without backend routes yet) ---------------- */
function ComingSoonSection({ label }) {
  return (
    <div
      className="tl-panel"
      style={{ textAlign: "center", padding: "48px 20px" }}
    >
      <div style={{ fontSize: 32, marginBottom: 12 }}>🚧</div>
      <h3 className="tl-panel-title" style={{ marginBottom: 6 }}>
        {label} — Coming Soon
      </h3>
      <p className="tl-muted" style={{ margin: 0 }}>
        This section will be enabled once the backend API routes for{" "}
        {label.toLowerCase()} are ready.
      </p>
    </div>
  );
}

/* ---------------- Users ---------------- */
function UsersSection({ push, onError }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [confirmUser, setConfirmUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(pickList(await api.get("/api/admin/users")));
    } catch (err) {
      onError(err, "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.name, u.email, u.userId, u.uid, u.referralCode, u.country]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(q)),
    );
  }, [users, search]);

  const runAction = async (type, user) => {
    const uid = user.uid || user.userId || user.id;
    setBusyId(uid);
    try {
      await api.post(`/api/admin/users/${type}`, { uid });
      push(
        `${user.name || "User"} ${type === "ban" ? "banned" : type === "unban" ? "unbanned" : "deleted"}.`,
      );
      await fetchUsers();
    } catch (err) {
      onError(err, `Failed to ${type} user.`);
    } finally {
      setBusyId(null);
      setConfirmUser(null);
    }
  };

  return (
    <div>
      <div className="tl-toolbar">
        <input
          className="tl-input"
          placeholder="Search by name, email, UID, referral code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="tl-btn tl-btn-ghost" onClick={fetchUsers}>
          Refresh
        </button>
      </div>
      {loading ? (
        <Spinner label="Loading users..." />
      ) : filtered.length === 0 ? (
        <Empty text="No users found." />
      ) : (
        <div className="tl-table-wrap">
          <table className="tl-table">
            <thead>
              <tr>
                <th>UID</th>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Country</th>
                <th>Wallet Balance</th>
                <th>Coins</th>
                <th>Referral Code</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const uid = u.uid || u.userId || u.id;
                const banned = (u.status || "").toLowerCase() === "banned";
                return (
                  <tr key={uid}>
                    <td className="tl-mono">{u.uid || "—"}</td>
                    <td className="tl-mono">{u.userId || "—"}</td>
                    <td>{u.name || "—"}</td>
                    <td>{u.email || "—"}</td>
                    <td>{u.country || "—"}</td>
                    <td>₹{Number(u.walletBalance || 0).toFixed(2)}</td>
                    <td>{u.coins ?? 0}</td>
                    <td className="tl-mono">{u.referralCode || "—"}</td>
                    <td>{fmtDate(u.joinDate || u.createdAt)}</td>
                    <td>
                      <StatusBadge
                        status={u.status || (banned ? "Banned" : "Active")}
                      />
                    </td>
                    <td>
                      <div className="tl-row-actions">
                        {banned ? (
                          <button
                            className="tl-btn tl-btn-sm tl-btn-primary"
                            disabled={busyId === uid}
                            onClick={() => runAction("unban", u)}
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            className="tl-btn tl-btn-sm tl-btn-warn"
                            disabled={busyId === uid}
                            onClick={() => runAction("ban", u)}
                          >
                            Ban
                          </button>
                        )}
                        <button
                          className="tl-btn tl-btn-sm tl-btn-danger"
                          disabled={busyId === uid}
                          onClick={() => setConfirmUser(u)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmModal
        open={!!confirmUser}
        title="Delete User"
        message={`Permanently delete ${confirmUser?.name || "this user"}? This cannot be undone.`}
        onCancel={() => setConfirmUser(null)}
        onConfirm={() => runAction("delete", confirmUser)}
      />
    </div>
  );
}

/* ---------------- Generic approve/reject table (Tasks & Withdrawals share this pattern) ---------------- */
function ApprovalTable({
  endpoint,
  title,
  columns,
  rowKey,
  onError,
  push,
  successApprove,
  successReject,
}) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [busyId, setBusyId] = useState(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      setRows(pickList(await api.get(endpoint)));
    } catch (err) {
      onError(err, `Failed to load ${title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  }, [onError]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const runAction = async (type, row) => {
    const id = rowKey(row);
    setBusyId(id);
    try {
      await api.post(`${endpoint}/${type}`, { id, uid: row.uid || row.userId });
      push(type === "approve" ? successApprove : successReject);
      setRows((prev) => prev.filter((r) => rowKey(r) !== id));
    } catch (err) {
      onError(err, `Failed to ${type}.`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="tl-toolbar">
        <h3 className="tl-panel-title" style={{ margin: 0 }}>
          {title}
        </h3>
        <button className="tl-btn tl-btn-ghost" onClick={fetchRows}>
          Refresh
        </button>
      </div>
      {loading ? (
        <Spinner label={`Loading ${title.toLowerCase()}...`} />
      ) : rows.length === 0 ? (
        <Empty text={`No ${title.toLowerCase()}.`} />
      ) : (
        <div className="tl-table-wrap">
          <table className="tl-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const id = rowKey(r);
                return (
                  <tr key={id}>
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={c.mono ? "tl-mono" : undefined}
                      >
                        {c.render ? c.render(r) : (r[c.key] ?? "—")}
                      </td>
                    ))}
                    <td>
                      <div className="tl-row-actions">
                        <button
                          className="tl-btn tl-btn-sm tl-btn-primary"
                          disabled={busyId === id}
                          onClick={() => runAction("approve", r)}
                        >
                          Approve
                        </button>
                        <button
                          className="tl-btn tl-btn-sm tl-btn-danger"
                          disabled={busyId === id}
                          onClick={() => runAction("reject", r)}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TasksSection({ push, onError }) {
  return (
    <ApprovalTable
      endpoint="/api/admin/tasks"
      title="Pending Tasks"
      onError={onError}
      push={push}
      successApprove="Task approved."
      successReject="Task rejected."
      rowKey={(t) => t.id || t.taskId}
      columns={[
        {
          key: "userName",
          label: "User Name",
          render: (t) => t.userName || t.name || "—",
        },
        {
          key: "taskName",
          label: "Task Name",
          render: (t) => t.taskName || t.title || "—",
        },
        {
          key: "proof",
          label: "Task Proof",
          render: (t) =>
            t.taskProof || t.proofUrl ? (
              <a
                href={t.taskProof || t.proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tl-link"
              >
                View Proof
              </a>
            ) : (
              "—"
            ),
        },
        {
          key: "date",
          label: "Date",
          render: (t) => fmtDate(t.date || t.createdAt),
        },
      ]}
    />
  );
}

function WithdrawalsSection({ push, onError }) {
  return (
    <ApprovalTable
      endpoint="/api/admin/withdrawals"
      title="Withdrawal Requests"
      onError={onError}
      push={push}
      successApprove="Withdrawal approved."
      successReject="Withdrawal rejected."
      rowKey={(w) => w.id || w.withdrawalId}
      columns={[
        {
          key: "user",
          label: "User",
          render: (w) => w.userName || w.name || "—",
        },
        {
          key: "amount",
          label: "Amount",
          render: (w) => `₹${Number(w.amount || 0).toFixed(2)}`,
        },
        { key: "bankName", label: "Bank Name" },
        { key: "accountNumber", label: "Account Number", mono: true },
        { key: "ifsc", label: "IFSC", mono: true },
        { key: "upi", label: "UPI", mono: true },
        {
          key: "date",
          label: "Date",
          render: (w) => fmtDate(w.date || w.createdAt),
        },
      ]}
    />
  );
}

/* ---------------- Referrals ---------------- */
function ReferralsSection({ onError }) {
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState([]);

  const fetchReferrals = useCallback(async () => {
    setLoading(true);
    try {
      setReferrals(pickList(await api.get("/api/admin/referrals")));
    } catch (err) {
      onError(err, "Failed to load referrals.");
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  if (loading) return <Spinner label="Loading referrals..." />;
  if (referrals.length === 0)
    return <Empty text="No referral data available." />;

  return (
    <div className="tl-card-list">
      {referrals.map((r, idx) => (
        <div className="tl-panel" key={r.uid || r.userId || idx}>
          <div className="tl-referral-header">
            <div>
              <h3 className="tl-panel-title" style={{ marginBottom: 4 }}>
                {r.name || r.userName || "User"}
              </h3>
              <span className="tl-muted">{r.email || r.uid}</span>
            </div>
            <div className="tl-referral-stats">
              <div>
                <div className="tl-stat-value">{r.referralCount ?? 0}</div>
                <div className="tl-stat-label">Referral Count</div>
              </div>
              <div>
                <div className="tl-stat-value">
                  ₹{Number(r.referralEarnings || 0).toFixed(2)}
                </div>
                <div className="tl-stat-label">Referral Earnings</div>
              </div>
            </div>
          </div>
          {Array.isArray(r.referredUsers) && r.referredUsers.length > 0 ? (
            <div className="tl-table-wrap">
              <table className="tl-table">
                <thead>
                  <tr>
                    <th>Referred User</th>
                    <th>Email</th>
                    <th>Join Date</th>
                  </tr>
                </thead>
                <tbody>
                  {r.referredUsers.map((ru, i) => (
                    <tr key={ru.uid || i}>
                      <td>{ru.name || "—"}</td>
                      <td>{ru.email || "—"}</td>
                      <td>{fmtDate(ru.joinDate || ru.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty text="No referred users yet." />
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------------- Notifications ---------------- */
function NotificationsSection({ push, onError }) {
  const [broadcast, setBroadcast] = useState({ title: "", message: "" });
  const [userMsg, setUserMsg] = useState({ uid: "", title: "", message: "" });
  const [busyBroadcast, setBusyBroadcast] = useState(false);
  const [busyUser, setBusyUser] = useState(false);

  const sendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcast.title.trim() || !broadcast.message.trim())
      return push("Please fill in both title and message.", "error");
    setBusyBroadcast(true);
    try {
      await api.post("/api/admin/notifications/broadcast", broadcast);
      push("Notification sent to all users.");
      setBroadcast({ title: "", message: "" });
    } catch (err) {
      onError(err, "Failed to send broadcast notification.");
    } finally {
      setBusyBroadcast(false);
    }
  };

  const sendToUser = async (e) => {
    e.preventDefault();
    if (!userMsg.uid.trim() || !userMsg.title.trim() || !userMsg.message.trim())
      return push("Please fill in UID, title, and message.", "error");
    setBusyUser(true);
    try {
      await api.post("/api/admin/notifications/user", userMsg);
      push("Notification sent to user.");
      setUserMsg({ uid: "", title: "", message: "" });
    } catch (err) {
      onError(err, "Failed to send notification.");
    } finally {
      setBusyUser(false);
    }
  };

  return (
    <div className="tl-card-list">
      <div className="tl-panel">
        <h3 className="tl-panel-title">Send Notification to All Users</h3>
        <form className="tl-form" onSubmit={sendBroadcast}>
          <label className="tl-label">
            Title
            <input
              className="tl-input"
              value={broadcast.title}
              onChange={(e) =>
                setBroadcast((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Notification title"
            />
          </label>
          <label className="tl-label">
            Message
            <textarea
              className="tl-textarea"
              rows={4}
              value={broadcast.message}
              onChange={(e) =>
                setBroadcast((f) => ({ ...f, message: e.target.value }))
              }
              placeholder="Notification message"
            />
          </label>
          <button
            className="tl-btn tl-btn-primary"
            type="submit"
            disabled={busyBroadcast}
          >
            {busyBroadcast ? "Sending..." : "Send to All Users"}
          </button>
        </form>
      </div>
      <div className="tl-panel">
        <h3 className="tl-panel-title">Send Notification to One User</h3>
        <form className="tl-form" onSubmit={sendToUser}>
          <label className="tl-label">
            User UID
            <input
              className="tl-input"
              value={userMsg.uid}
              onChange={(e) =>
                setUserMsg((f) => ({ ...f, uid: e.target.value }))
              }
              placeholder="Enter user UID"
            />
          </label>
          <label className="tl-label">
            Title
            <input
              className="tl-input"
              value={userMsg.title}
              onChange={(e) =>
                setUserMsg((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Notification title"
            />
          </label>
          <label className="tl-label">
            Message
            <textarea
              className="tl-textarea"
              rows={4}
              value={userMsg.message}
              onChange={(e) =>
                setUserMsg((f) => ({ ...f, message: e.target.value }))
              }
              placeholder="Notification message"
            />
          </label>
          <button
            className="tl-btn tl-btn-primary"
            type="submit"
            disabled={busyUser}
          >
            {busyUser ? "Sending..." : "Send to User"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- Support ---------------- */
function SupportSection({ push, onError }) {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [busyId, setBusyId] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      setTickets(pickList(await api.get("/api/admin/support")));
    } catch (err) {
      onError(err, "Failed to load support tickets.");
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const reply = async (t) => {
    const id = t.id || t.ticketId;
    const message = (drafts[id] || "").trim();
    if (!message) return push("Please write a reply before sending.", "error");
    setBusyId(id);
    try {
      await api.post("/api/admin/support/reply", { ticketId: id, message });
      push("Reply sent.");
      setDrafts((p) => ({ ...p, [id]: "" }));
      await fetchTickets();
    } catch (err) {
      onError(err, "Failed to send reply.");
    } finally {
      setBusyId(null);
    }
  };

  const close = async (t) => {
    const id = t.id || t.ticketId;
    setBusyId(id);
    try {
      await api.post("/api/admin/support/close", { ticketId: id });
      push("Ticket closed.");
      await fetchTickets();
    } catch (err) {
      onError(err, "Failed to close ticket.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="tl-toolbar">
        <h3 className="tl-panel-title" style={{ margin: 0 }}>
          Support Tickets
        </h3>
        <button className="tl-btn tl-btn-ghost" onClick={fetchTickets}>
          Refresh
        </button>
      </div>
      {loading ? (
        <Spinner label="Loading tickets..." />
      ) : tickets.length === 0 ? (
        <Empty text="No support tickets." />
      ) : (
        <div className="tl-card-list">
          {tickets.map((t) => {
            const id = t.id || t.ticketId;
            const closed = (t.status || "").toLowerCase() === "closed";
            return (
              <div className="tl-panel" key={id}>
                <div className="tl-ticket-header">
                  <div>
                    <h4 style={{ margin: "0 0 4px" }}>
                      {t.subject || t.title || "Support Ticket"}
                    </h4>
                    <span className="tl-muted">
                      {t.userName || t.userEmail || t.uid} •{" "}
                      {fmtDateTime(t.createdAt || t.date)}
                    </span>
                  </div>
                  <StatusBadge status={t.status || "Open"} />
                </div>
                <p className="tl-ticket-message">
                  {t.message || t.description}
                </p>
                {Array.isArray(t.replies) && t.replies.length > 0 && (
                  <div className="tl-ticket-replies">
                    {t.replies.map((r, i) => (
                      <div key={i} className="tl-ticket-reply">
                        <strong>Admin:</strong> {r.message}{" "}
                        <span className="tl-muted">
                          ({fmtDateTime(r.date)})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {!closed && (
                  <div className="tl-ticket-actions">
                    <textarea
                      className="tl-textarea"
                      rows={2}
                      placeholder="Type your reply..."
                      value={drafts[id] || ""}
                      onChange={(e) =>
                        setDrafts((p) => ({ ...p, [id]: e.target.value }))
                      }
                    />
                    <div className="tl-row-actions">
                      <button
                        className="tl-btn tl-btn-sm tl-btn-primary"
                        disabled={busyId === id}
                        onClick={() => reply(t)}
                      >
                        Reply
                      </button>
                      <button
                        className="tl-btn tl-btn-sm tl-btn-danger"
                        disabled={busyId === id}
                        onClick={() => close(t)}
                      >
                        Close Ticket
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------- Global styles ---------------- */
function GlobalStyles() {
  return (
    <style>{`
      :root{--tl-bg:#0f1117;--tl-surface:#161922;--tl-surface-2:#1d2129;--tl-border:#272c38;--tl-text:#e7e9ee;--tl-muted:#8b90a0;--tl-primary:#5b6cff;--tl-primary-dark:#4655e0;--tl-green:#22c55e;--tl-red:#ef4444;--tl-amber:#f59e0b;--tl-radius:10px}
      *{box-sizing:border-box}
      .tl-admin{display:flex;min-height:100vh;background:var(--tl-bg);color:var(--tl-text);font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
      .tl-sidebar{width:240px;flex-shrink:0;background:var(--tl-surface);border-right:1px solid var(--tl-border);display:flex;flex-direction:column;padding:20px 14px;position:sticky;top:0;height:100vh}
      .tl-sidebar-brand{display:flex;align-items:center;gap:10px;padding:6px 10px 24px}
      .tl-brand-logo{width:34px;height:34px;border-radius:8px;background:linear-gradient(135deg,var(--tl-primary),#8a5bff);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px}
      .tl-brand-name{font-weight:600;font-size:15px;letter-spacing:.2px}
      .tl-sidebar-nav{display:flex;flex-direction:column;gap:4px;flex:1;overflow-y:auto}
      .tl-nav-item{display:flex;align-items:center;gap:12px;background:transparent;border:none;color:var(--tl-muted);padding:10px 12px;border-radius:var(--tl-radius);font-size:14px;cursor:pointer;text-align:left;width:100%;transition:background .15s,color .15s}
      .tl-nav-item:hover{background:var(--tl-surface-2);color:var(--tl-text)}
      .tl-nav-item-active,.tl-nav-item-active:hover{background:var(--tl-primary);color:#fff}
      .tl-nav-icon{font-size:16px;width:18px;text-align:center}
      .tl-nav-logout{margin-top:12px;border-top:1px solid var(--tl-border);padding-top:16px;color:var(--tl-red)}
      .tl-sidebar-overlay{display:none}
      .tl-main{flex:1;display:flex;flex-direction:column;min-width:0}
      .tl-navbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 24px;background:var(--tl-surface);border-bottom:1px solid var(--tl-border);position:sticky;top:0;z-index:10}
      .tl-navbar-title{font-size:18px;font-weight:600}
      .tl-hamburger{display:none;background:transparent;border:none;color:var(--tl-text);font-size:20px;cursor:pointer}
      .tl-navbar-right{display:flex;align-items:center;gap:18px}
      .tl-navbar-date{color:var(--tl-muted);font-size:13px;white-space:nowrap}
      .tl-navbar-admin{display:flex;align-items:center;gap:10px}
      .tl-admin-avatar{width:36px;height:36px;border-radius:50%;background:var(--tl-primary);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px}
      .tl-admin-meta{display:flex;flex-direction:column;line-height:1.3}
      .tl-admin-name{font-size:13px;font-weight:600}
      .tl-admin-email{font-size:12px;color:var(--tl-muted)}
      .tl-content{padding:24px;overflow-y:auto}
      .tl-btn{border:none;border-radius:8px;padding:9px 16px;font-size:13px;font-weight:600;cursor:pointer;transition:opacity .15s,transform .05s}
      .tl-btn:active{transform:scale(.98)}
      .tl-btn:disabled{opacity:.5;cursor:not-allowed}
      .tl-btn-primary{background:var(--tl-primary);color:#fff}
      .tl-btn-primary:hover:not(:disabled){background:var(--tl-primary-dark)}
      .tl-btn-danger{background:rgba(239,68,68,.15);color:var(--tl-red)}
      .tl-btn-danger:hover:not(:disabled){background:rgba(239,68,68,.25)}
      .tl-btn-warn{background:rgba(245,158,11,.15);color:var(--tl-amber)}
      .tl-btn-warn:hover:not(:disabled){background:rgba(245,158,11,.25)}
      .tl-btn-ghost{background:var(--tl-surface-2);color:var(--tl-text);border:1px solid var(--tl-border)}
      .tl-btn-ghost:hover:not(:disabled){background:#22273299}
      .tl-btn-sm{padding:6px 12px;font-size:12px}
      .tl-card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;margin-bottom:24px}
      .tl-stat-card{background:var(--tl-surface);border:1px solid var(--tl-border);border-radius:var(--tl-radius);padding:18px;display:flex;align-items:center;gap:14px}
      .tl-stat-icon{font-size:22px;width:44px;height:44px;border-radius:10px;background:var(--tl-surface-2);display:flex;align-items:center;justify-content:center;flex-shrink:0}
      .tl-stat-value{font-size:22px;font-weight:700}
      .tl-stat-label{font-size:12.5px;color:var(--tl-muted);margin-top:2px}
      .tl-card-list{display:flex;flex-direction:column;gap:16px}
      .tl-panel{background:var(--tl-surface);border:1px solid var(--tl-border);border-radius:var(--tl-radius);padding:20px;margin-bottom:16px}
      .tl-panel-title{font-size:15px;font-weight:600;margin:0 0 14px}
      .tl-table-wrap{overflow-x:auto;border:1px solid var(--tl-border);border-radius:var(--tl-radius)}
      .tl-table{width:100%;border-collapse:collapse;font-size:13px;min-width:720px}
      .tl-table th,.tl-table td{padding:12px 14px;text-align:left;white-space:nowrap;border-bottom:1px solid var(--tl-border)}
      .tl-table th{background:var(--tl-surface-2);color:var(--tl-muted);font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.4px}
      .tl-table tbody tr:hover{background:rgba(255,255,255,.02)}
      .tl-table tbody tr:last-child td{border-bottom:none}
      .tl-mono{font-family:"SF Mono",Consolas,monospace;font-size:12px;color:var(--tl-muted)}
      .tl-row-actions{display:flex;gap:8px}
      .tl-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;flex-wrap:wrap}
      .tl-input,.tl-textarea{background:var(--tl-surface-2);border:1px solid var(--tl-border);color:var(--tl-text);border-radius:8px;padding:10px 12px;font-size:13px;width:100%;font-family:inherit}
      .tl-input:focus,.tl-textarea:focus{outline:none;border-color:var(--tl-primary)}
      .tl-form{display:flex;flex-direction:column;gap:14px;max-width:480px}
      .tl-label{display:flex;flex-direction:column;gap:6px;font-size:13px;color:var(--tl-muted)}
      .tl-badge{display:inline-block;padding:4px 10px;border-radius:999px;font-size:11.5px;font-weight:600;text-transform:capitalize}
      .tl-badge-green{background:rgba(34,197,94,.15);color:var(--tl-green)}
      .tl-badge-red{background:rgba(239,68,68,.15);color:var(--tl-red)}
      .tl-badge-amber{background:rgba(245,158,11,.15);color:var(--tl-amber)}
      .tl-activity-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px}
      .tl-activity-item{display:flex;gap:12px;align-items:flex-start}
      .tl-activity-dot{width:8px;height:8px;border-radius:50%;background:var(--tl-primary);margin-top:6px;flex-shrink:0}
      .tl-activity-text{font-size:13.5px}
      .tl-activity-time{font-size:12px;color:var(--tl-muted);margin-top:2px}
      .tl-referral-header{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:16px;flex-wrap:wrap}
      .tl-referral-stats{display:flex;gap:24px}
      .tl-muted{color:var(--tl-muted);font-size:12.5px}
      .tl-ticket-header{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:10px}
      .tl-ticket-message{font-size:13.5px;margin:0 0 12px}
      .tl-ticket-replies{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}
      .tl-ticket-reply{background:var(--tl-surface-2);padding:10px 12px;border-radius:8px;font-size:13px}
      .tl-ticket-actions{display:flex;flex-direction:column;gap:10px}
      .tl-spinner-wrap{display:flex;align-items:center;gap:12px;color:var(--tl-muted);padding:40px 0;justify-content:center;font-size:13.5px}
      .tl-spinner{width:20px;height:20px;border-radius:50%;border:2.5px solid var(--tl-border);border-top-color:var(--tl-primary);animation:tl-spin .7s linear infinite}
      @keyframes tl-spin{to{transform:rotate(360deg)}}
      .tl-empty{text-align:center;padding:40px 0;color:var(--tl-muted);font-size:13.5px}
      .tl-link{color:var(--tl-primary);text-decoration:none;font-weight:600}
      .tl-link:hover{text-decoration:underline}
      .tl-toast-wrap{position:fixed;top:20px;right:20px;display:flex;flex-direction:column;gap:10px;z-index:1000}
      .tl-toast{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:8px;font-size:13.5px;font-weight:500;color:#fff;min-width:240px;max-width:360px;box-shadow:0 8px 24px rgba(0,0,0,.35);cursor:pointer;animation:tl-toast-in .2s ease}
      @keyframes tl-toast-in{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
      .tl-toast-success{background:#16a34a}
      .tl-toast-error{background:#dc2626}
      .tl-toast-info{background:#2563eb}
      .tl-toast-icon{font-weight:700}
      .tl-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px}
      .tl-modal{background:var(--tl-surface);border:1px solid var(--tl-border);border-radius:12px;padding:22px;width:100%;max-width:380px}
      .tl-modal h3{margin:0 0 8px;font-size:16px}
      .tl-modal p{margin:0 0 18px;color:var(--tl-muted);font-size:13.5px}
      .tl-modal-actions{display:flex;justify-content:flex-end;gap:10px}
      @media(max-width:900px){
        .tl-sidebar{position:fixed;left:-260px;top:0;z-index:100;transition:left .2s ease;box-shadow:10px 0 30px rgba(0,0,0,.4)}
        .tl-sidebar-open{left:0}
        .tl-sidebar-overlay{display:block;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:90}
        .tl-hamburger{display:block}
        .tl-navbar-date,.tl-admin-meta{display:none}
      }
      @media(max-width:560px){
        .tl-content{padding:16px}
        .tl-navbar{padding:12px 16px}
        .tl-card-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}
        .tl-referral-stats{gap:14px}
        .tl-logout-btn{display:none}
      }
    `}</style>
  );
}
