function Notification({ message }) {
  const isMobile = window.innerWidth < 768;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,

        background: "rgba(34,197,94,0.15)",

        border: "1px solid rgba(34,197,94,0.35)",

        backdropFilter: "blur(18px)",

        borderRadius: "16px",

        padding: isMobile ? "12px 14px" : "14px 16px",

        minWidth: isMobile ? "220px" : "250px",

        boxShadow: "0 0 25px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            fontSize: isMobile ? "18px" : "20px",
          }}
        >
          ✅
        </div>

        <div>
          <h3
            style={{
              margin: 0,
              color: "white",

              fontSize: isMobile ? "12px" : "13px",

              fontWeight: "700",
            }}
          >
            {message}
          </h3>

          <p
            style={{
              margin: 0,
              marginTop: "3px",
              color: "#a1a1aa",

              fontSize: isMobile ? "10px" : "11px",
            }}
          >
            TaskLumo Notification
          </p>
        </div>
      </div>
    </div>
  );
}

export default Notification;
