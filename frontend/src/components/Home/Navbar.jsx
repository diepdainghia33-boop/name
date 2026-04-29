import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { Button } from "../ui/button";

const navItems = [
  { label: "Features", chevron: true },
  { label: "Solutions", chevron: false },
  { label: "Plans", chevron: false },
  { label: "Learning", chevron: true },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const menuTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.24, ease: [0.16, 1, 0.3, 1] };

  return (
    <header className="relative z-30 w-full px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link to="/" className="flex shrink-0 items-center">
          <img src={logo} alt="Architect AI" className="h-8 w-auto select-none" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-2 lg:flex">
          {navItems.map((item) => (
            <motion.button
              key={item.label}
              type="button"
              whileHover={prefersReducedMotion ? undefined : { y: -1 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-base text-foreground/90 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span>{item.label}</span>
              {item.chevron ? <ChevronDown className="h-4 w-4" /> : null}
            </motion.button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            to="/signup"
            variant="heroSecondary"
            size="sm"
            className="hidden !rounded-full !px-4 !py-2 text-base sm:inline-flex"
          >
            Sign Up
          </Button>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navbar"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-white/[0.03] text-foreground/90 transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="mt-[3px] h-px w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            id="mobile-navbar"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={menuTransition}
            className="lg:hidden"
          >
            <div className="mt-4 rounded-[28px] border border-white/8 bg-white/[0.02] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4 pb-4">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-foreground/40">
                    Navigation
                  </p>
                  <p className="mt-1 text-sm text-foreground/70">
                    Explore the product
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/60 text-foreground/80 transition-colors hover:bg-white/[0.06]"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/50 px-4 py-3 text-left text-[15px] text-foreground/90 transition-colors hover:border-white/15 hover:bg-white/[0.05] active:scale-[0.99]"
                  >
                    <span>{item.label}</span>
                    {item.chevron ? <ChevronDown className="h-4 w-4 opacity-60" /> : null}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <Button
                  to="/signup"
                  variant="heroSecondary"
                  className="w-full !rounded-2xl !px-5 !py-3 text-base"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
