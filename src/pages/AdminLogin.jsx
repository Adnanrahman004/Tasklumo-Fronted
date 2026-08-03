import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/adminApi";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await adminLogin({
        email,
        password,
      });

      localStorage.setItem("adminToken", res.data.token);

      alert("Login Successful");

      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
      }}
    >
      <form
        onSubmit={login}
        style={{
          width: 350,
          padding: 30,
          background: "#1e293b",
          borderRadius: 12,
        }}
      >
        <h2 style={{ color: "#fff", textAlign: "center" }}>Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 20,
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 15,
          }}
        />

        <button
          style={{
            width: "100%",
            padding: 12,
            marginTop: 20,
            cursor: "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Please Wait..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
