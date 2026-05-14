import "./index.css";

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { settingsApi } from "./api/settings.api";
import { applyFontSize, loadStoredFontSize, saveStoredFontSize } from "./utils/fontSize";

import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import RegisterPage from "./pages/Register";
import SignupPage from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import Analytics from "./pages/Analytics";
import SettingsPage from "./pages/SettingsPage";

import HeroSection from "./components/Home/HeroSection";
import SocialProofSection from "./components/Home/SocialProofSection";

function Home() {
  return (
    <>
      <HeroSection />
      <SocialProofSection />
    </>
  );
}

function GlobalPreferencesSync() {
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const storedUserRaw = localStorage.getItem("user");
    let storedUser = null;

    if (storedUserRaw) {
      try {
        storedUser = JSON.parse(storedUserRaw);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }

    const token = localStorage.getItem("token");

    if (!token) {
      applyFontSize("medium");
      return undefined;
    }

    const cachedSize = loadStoredFontSize(storedUser);
    if (cachedSize) {
      applyFontSize(cachedSize);
    } else {
      applyFontSize("medium");
    }

    const fetchAndApplySettings = async () => {
      try {
        const response = await settingsApi.getPreferences();
        const prefs = response.data.preferences;
        const fontSize = prefs?.ui_prefs?.fontSize;

        if (!cancelled && fontSize) {
          applyFontSize(fontSize);
          saveStoredFontSize(storedUser, fontSize);
        }
      } catch (error) {
        console.error("Failed to load global settings:", error);
      }
    };

    fetchAndApplySettings();

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <GlobalPreferencesSync />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
