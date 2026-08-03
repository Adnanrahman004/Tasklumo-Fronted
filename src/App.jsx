import { BrowserRouter, Routes, Route } from "react-router-dom";

// USER PAGES
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import Referral from "./pages/Referral";
import SupportChat from "./pages/SupportChat";
import LuckySpin from "./pages/LuckySpin";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import About from "./pages/About";
import Support from "./pages/Support";
import Faq from "./pages/Faq";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Notification from "./pages/Notification";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* User Pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/support-chat" element={<SupportChat />} />
        <Route path="/lucky-spin" element={<LuckySpin />} />

        {/* Information */}
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Support />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
