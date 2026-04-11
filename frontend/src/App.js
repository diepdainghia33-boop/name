import './index.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Chat from "./pages/Chat";               // default export
import Dashboard from "./pages/Dashboard";    // default export
import AuthPage from "./pages/Login";         // default export
import ForgotPassword from "./pages/ForgotPassword"; // default export

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
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage />} />
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