import './index.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { settingsApi } from "./api/settings.api";

// Pages
import Chat from "./pages/Chat";               // default export
import Dashboard from "./pages/Dashboard";    // default export
import AuthPage from "./pages/Login";         // default export
import ForgotPassword from "./pages/ForgotPassword"; // default export
import RegisterPage from "./pages/Register";

// Home Components
import Navbar from "./components/Home/Navbar";
import Hero from "./components/Home/Hero";
import Features from "./components/Home/Features";
import Process from "./components/Home/Process";  // sửa đường dẫn thừa
import CTA from "./components/Home/CTA";
import Footer from "./components/Home/Footer";
import Analytics from './pages/Analytics';
import SettingsPage from "./pages/SettingsPage";
function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Process />
      <CTA />
      <Footer />
    </>
  );
}

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchAndApplySettings = async () => {
      try {
        const response = await settingsApi.getPreferences();
        const prefs = response.data.preferences;
        if (prefs && prefs.ui_prefs && prefs.ui_prefs.fontSize) {
          const size = prefs.ui_prefs.fontSize;
          const html = document.documentElement;
          html.classList.remove('font-size-small', 'font-size-medium', 'font-size-large', 'font-size-xlarge');
          html.classList.add(`font-size-${size}`);
        }
      } catch (error) {
        console.error("Failed to load global settings:", error);
      }
    };
    fetchAndApplySettings();
  }, []);

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;