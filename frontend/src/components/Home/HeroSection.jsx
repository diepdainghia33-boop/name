import Navbar from "./Navbar";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "../ui/button";

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: prefersReducedMotion ? 0 : 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          className="absolute -left-24 top-[-10rem] h-[26rem] w-[26rem] rounded-full bg-primary/10 blur-[160px]"
          animate={prefersReducedMotion ? { opacity: 0.6 } : { opacity: [0.5, 0.85, 0.5], scale: [1, 1.05, 1] }}
          transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-6rem] top-[2rem] h-[18rem] w-[18rem] rounded-full bg-white/[0.05] blur-[120px]"
          animate={prefersReducedMotion ? { opacity: 0.4 } : { opacity: [0.3, 0.6, 0.3], y: [0, 12, 0] }}
          transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Navbar />

      <motion.div
        className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-20 text-center sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="bg-[linear-gradient(223deg,#E8E8E9_0%,#3A7BBF_104.15%)] bg-clip-text text-[clamp(5rem,16vw,14.5rem)] font-normal leading-[1.02] tracking-[-0.024em] text-transparent"
          style={{ fontFamily: "'General Sans', 'Geist Sans', sans-serif" }}
        >
          Grow
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-5 max-w-md text-center text-lg leading-8 text-hero-sub opacity-80"
        >
          The most powerful AI ever deployed
          <br />
          in talent acquisition
        </motion.p>

        <motion.div variants={itemVariants} className="mb-[66px] mt-10">
          <Button
            to="/signup"
            variant="heroSecondary"
            className="!px-[29px] !py-[24px] text-base shadow-[0_18px_36px_rgba(0,0,0,0.22)]"
          >
            Schedule a Consult
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
