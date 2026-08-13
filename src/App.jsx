import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// USER PAGES
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Wallet from "./pages/Wallet";
import Profile from "./pages/profile";
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

// PROTECTED ROUTE
import ProtectedRoute from "./components/ProtectedRoute";

import OfferwallPage from "./pages/OfferwallPage";

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

        {/* Protected User Pages */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/referral"
          element={
            <ProtectedRoute>
              <Referral />
            </ProtectedRoute>
          }
        />

        <Route
          path="/support-chat"
          element={
            <ProtectedRoute>
              <SupportChat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lucky-spin"
          element={
            <ProtectedRoute>
              <LuckySpin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />

        {/* Public Information Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Support />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        <Route path="/offerwall" element={<OfferwallPage />} />

        {/* Admin */}
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Invalid URL redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
