import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const brands = ["Vortex", "Nimbus", "Prysma", "Cirrus", "Kynder", "Halcyn"];

function BrandMark({ brand }) {
  return (
    <span className="liquid-glass flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-semibold text-foreground">
      {brand.charAt(0)}
    </span>
  );
}

export default function SocialProofSection() {
  const videoRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    let rafId = 0;
    let timeoutId = 0;
    let cancelled = false;

    const playVideo = () => {
      const promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(() => {});
      }
    };

    const updateOpacity = () => {
      if (cancelled || !video) return;

      const duration = video.duration;
      const currentTime = video.currentTime;

      if (Number.isFinite(duration) && duration > 0) {
        const fadeWindow = 0.5;
        let opacity = 1;

        if (currentTime < fadeWindow) {
          opacity = currentTime / fadeWindow;
        } else if (currentTime > duration - fadeWindow) {
          opacity = Math.max(0, (duration - currentTime) / fadeWindow);
        }

        video.style.opacity = String(opacity);
      }

      rafId = window.requestAnimationFrame(updateOpacity);
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        video.currentTime = 0;
        playVideo();
      }, 100);
    };

    const handleLoaded = () => {
      playVideo();
      rafId = window.requestAnimationFrame(updateOpacity);
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadedmetadata", handleLoaded);

    if (video.readyState >= 1) {
      handleLoaded();
    } else {
      video.style.opacity = "0";
    }

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, []);

  const duplicatedBrands = [...brands, ...brands];

  const contentVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 18 },
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
    <motion.section
      className="relative w-full overflow-hidden"
      variants={contentVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 0 }}
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260308_114720_3dabeb9e-2c39-4907-b747-bc3544e2d5b7.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="relative z-10 flex flex-col items-center gap-20 px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="h-40 w-full" />

        <motion.div
          className="flex w-full max-w-5xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"
          variants={contentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <p className="shrink-0 whitespace-nowrap text-sm text-foreground/50">
            Relied on by brands
            <br />
            across the globe
          </p>

          <div className="w-full overflow-hidden rounded-[28px] border border-white/6 bg-white/[0.02] px-5 py-4 backdrop-blur-sm [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex w-max animate-marquee gap-16 will-change-transform">
              {duplicatedBrands.map((brand, index) => (
                <div key={`${brand}-${index}`} className="flex items-center gap-3">
                  <BrandMark brand={brand} />
                  <span className="text-base font-semibold text-foreground">{brand}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
