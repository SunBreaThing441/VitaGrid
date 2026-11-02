import React, { Fragment, useEffect, useContext, useState } from "react";
import OrderSuccessMessage from "./OrderSuccessMessage";
import { HomeContext } from "./";
import { sliderImages } from "../../admin/dashboardAdmin/Action";
import { prevSlide, nextSlide } from "./Mixins";

const apiURL = process.env.REACT_APP_API_URL;

const Slider = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    sliderImages(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSlides = data.sliderImages ? data.sliderImages.length : 0;

  return (
    <Fragment>
      <OrderSuccessMessage />
      <div className="relative mt-2 mb-8 rounded-2xl overflow-hidden vg-glass-card border border-cyan-500/30 shadow-2xl">
        {/* Dynamic Image or Futuristic Fallback Banner */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gradient-to-r from-gray-950 via-slate-900 to-cyan-950/60 overflow-hidden">
          {totalSlides > 0 && (
            <img
              className="w-full h-full object-cover opacity-35 mix-blend-luminosity scale-105 transition-transform duration-700 ease-out"
              src={`${apiURL}/uploads/customize/${data.sliderImages[slide].slideImage}`}
              alt="VitaGrid Mission Banner"
            />
          )}

          {/* Cyber Scanning Lines Overlay */}
          <div className="absolute inset-0 vg-cyber-grid opacity-40 pointer-events-none"></div>

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 z-10">
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="vg-pulse-beacon"></span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                UNESCO Humanitarian Protocol #418-VITA
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight max-w-3xl leading-tight">
              Rapid Ischemic Transit & <span className="vg-text-gradient-cyan">Global Organ Allocation</span>
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-2xl font-sans leading-relaxed">
              Eliminating manual communication bottlenecks. Connecting hypothermic organ banks with transplant centers in sub-second precision across registered regional hubs.
            </p>

            {/* Live Metrics Row */}
            <div className="mt-6 flex flex-wrap gap-4 sm:gap-6 font-mono text-xs">
              <div className="px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-700/60 flex items-center space-x-2">
                <span className="text-slate-400">ISCHEMIA_TOLERANCE:</span>
                <span className="text-cyan-400 font-bold">REAL-TIME TELEMETRY</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-700/60 flex items-center space-x-2">
                <span className="text-slate-400">DISPATCH_CLEARANCE:</span>
                <span className="text-emerald-400 font-bold">&lt; 15 MINS</span>
              </div>
              <div className="hidden sm:flex px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-700/60 items-center space-x-2">
                <span className="text-slate-400">CROSSMATCH_VALIDATION:</span>
                <span className="text-indigo-400 font-bold">100% SECURE</span>
              </div>
            </div>
          </div>

          {/* Carousel Navigation Arrows */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={() => prevSlide(totalSlides, slide, setSlide)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 transition-all"
                aria-label="Previous Slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => nextSlide(totalSlides, slide, setSlide)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 transition-all"
                aria-label="Next Slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Slider;
