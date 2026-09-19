"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const EASE = [0.22, 1, 0.36, 1] as const;

const INTRO_SKIP_SECONDS = 20;

export default function HeroVideo() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { language } = useLanguage();
  const isEn = language === "ENG";

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 120);
    return () => clearTimeout(t);
  }, []);

  /** Skip intro: set start time when metadata loads */
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = INTRO_SKIP_SECONDS;
    }
  };

  /** When video loops, skip intro again */
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime < INTRO_SKIP_SECONDS) {
      videoRef.current.currentTime = INTRO_SKIP_SECONDS;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted((prev) => !prev);
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-[#07121f]"
      style={{ height: "80svh", minHeight: "600px" }}
    >
      {/* ── Video / image background ── */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center ken-burns"
          style={{
            backgroundImage:
              "url('/images/figma_hero_poster.webp')",
          }}
        />
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/figma_hero_poster.webp"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,20,42,0.25)_0%,_rgba(6,20,42,0.75)_100%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#07121f] to-transparent pointer-events-none" />

      {/* ── Content — bottom-anchored ── */}
      <div
        className="relative z-10 h-full flex flex-col justify-end pb-16 lg:pb-20 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1536px] mx-auto w-full"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.6s 0.2s ease",
        }}
      >
        <div className="space-y-6 max-w-2xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
            className="eyebrow text-[#c5a968] text-[11px]"
          >
            Design · Precision · Performance
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
            className="font-bold text-[32px] sm:text-[40px] md:text-[48px] xl:text-[54px] leading-[1.1] text-white tracking-tight"
          >
            {isEn ? "Where Architecture Meets Technology." : "Kiến tạo không gian, nâng tầm chuẩn mực cửa."}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
            className="text-[14px] md:text-[15px] text-white/70 font-sans leading-relaxed max-w-lg"
          >
            {isEn
              ? "From iconic landmarks to meticulous door systems — discover Eurowindow's journey of innovation."
              : "Từ những công trình biểu tượng đến từng chi tiết hệ cửa — khám phá hành trình kiến tạo của Eurowindow."}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.62 }}
            className="flex flex-col sm:flex-row gap-3 pt-2"
          >
            <Link
              href="/san-pham"
              className="inline-flex items-center justify-center gap-2.5 bg-[#c5a968] hover:bg-[#b5964f] text-[#0a1f3c] font-bold text-[11px] uppercase tracking-[0.18em] px-7 py-3.5 rounded-full transition-all duration-300 group w-fit shadow-lg shadow-[#c5a968]/25"
            >
              {isEn ? "View Products" : "Xem sản phẩm"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/lien-he"
              className="inline-flex items-center justify-center gap-2.5 border border-white/30 hover:border-white/70 text-white font-bold text-[11px] uppercase tracking-[0.18em] px-7 py-3.5 rounded-full transition-all duration-300 group w-fit backdrop-blur-sm"
            >
              {isEn ? "Contact Us" : "Liên hệ tư vấn"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Gold divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isLoaded ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.75 }}
            style={{ originX: 0 }}
            className="h-px w-24 bg-[#c5a968]/50"
          />
        </div>
      </div>

      {/* ── Floating trust badge ── */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={isLoaded ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
        className="absolute right-6 lg:right-10 bottom-16 lg:bottom-20 z-20"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 text-right">
          <p className="text-[9px] font-bold text-white/60 uppercase tracking-[0.18em]">
            {isEn ? "Over 20 Years Experience" : "Hơn 20 năm kinh nghiệm"}
          </p>
          <p className="text-[13px] font-extrabold text-white mt-0.5">
            {isEn ? "5,000+ Projects" : "10.000+ Công trình"}
          </p>
        </div>
      </motion.div>

      {/* ── Mute / unmute toggle ── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.0 }}
        onClick={toggleMute}
        aria-label={isMuted ? (isEn ? "Unmute sound" : "Bật âm thanh") : (isEn ? "Mute sound" : "Tắt âm thanh")}
        className="absolute left-6 lg:left-10 bottom-16 lg:bottom-20 z-20 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
      >
        {isMuted ? (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-9.536a5 5 0 000 7.072" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </motion.button>

      {/* ── Gold progress bar at bottom ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 4.0, ease: "linear", delay: 0.5 }}
          style={{ originX: 0 }}
          className="h-full bg-gradient-to-r from-[#c5a968] to-[#e8d08a]"
        />
      </div>
    </section>
  );
}
