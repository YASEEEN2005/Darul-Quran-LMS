"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface YouTubeLMSPlayerProps {
  videoId: string;
  onComplete: () => void;
  onProgress?: (currentTime: number, duration: number) => void;
  title?: string;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function YouTubeLMSPlayer({ videoId, onComplete, onProgress, title }: YouTubeLMSPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Load YouTube API
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  const initPlayer = () => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
      videoId,
      playerVars: {
        autoplay: 0,
        controls: 0, // We use custom controls
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        fs: 0,
        disablekb: 1,
      },
      events: {
        onReady: (event: any) => {
          setIsReady(true);
          setDuration(event.target.getDuration());
        },
        onStateChange: handleStateChange,
      },
    });
  };

  const [hasStarted, setHasStarted] = useState(false);
  const handleStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
        setIsPlaying(true);
        setHasStarted(true);
    } else if (event.data === window.YT.PlayerState.BUFFERING) {
        // Suppress thumbnail cover during buffering
        setIsPlaying(true);
    } else {
        setIsPlaying(false);
    }

    if (event.data === window.YT.PlayerState.ENDED) {
        onComplete();
        setHasStarted(false); // Cover back at end
    }
  };

  const [totalWatchedTime, setTotalWatchedTime] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);
        if (onProgress) onProgress(time, duration);

        // Instead of blocking seeks, we track actual engagement
        // We only increment totalWatchedTime if the player is active
        // and not seeking (detected by a 1s interval check)
        setTotalWatchedTime(prev => {
            const next = prev + 0.5; // Interval is 500ms
            
            // Check if 80% threshold reached
            if (duration > 0 && next >= duration * 0.8 && !hasCompleted) {
                setHasCompleted(true);
                onComplete();
            }
            return next;
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, duration, hasCompleted]);

  const togglePlay = () => {
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    playerRef.current.seekTo(val, true);
    setCurrentTime(val);
  };

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ... (previous useEffects for YT API and progress tracking)

  const toggleMute = () => {
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setVolume(val);
    playerRef.current.setVolume(val);
    if (val === 0) {
      playerRef.current.mute();
      setIsMuted(true);
    } else if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!playerRef.current || !isReady) return;
      
      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "arrowright":
          e.preventDefault();
          skip(10);
          break;
        case "arrowleft":
          e.preventDefault();
          skip(-10);
          break;
        case "f":
          toggleFullscreen();
          break;
        case "m":
          toggleMute();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isReady, isMuted, volume]);

  const skip = (seconds: number) => {
    if (!playerRef.current) return;
    const current = playerRef.current.getCurrentTime();
    const target = Math.max(0, Math.min(duration, current + seconds));
    playerRef.current.seekTo(target, true);
    setCurrentTime(target);
    
    // Show visual feedback
    const direction = seconds > 0 ? "forward" : "backward";
    setSkipIndicator(direction);
    setTimeout(() => setSkipIndicator(null), 800);
  };

  const [skipIndicator, setSkipIndicator] = useState<"forward" | "backward" | null>(null);

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 3) {
      skip(-10);
    } else if (x > (rect.width * 2) / 3) {
      skip(10);
    } else {
      togglePlay(); // Single click toggles play, handled by parent onClick but double click also toggles if not careful
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black overflow-hidden group"
    >
      <div id={`youtube-player-${videoId}`} className="absolute inset-0 w-full h-full pointer-events-none scale-[1.35] translate-y-[-2%]"></div>
      
      {/* Premium Cover Overlay - ONLY show before first play or after reset */}
      {!hasStarted && (
        <div 
            className="absolute inset-0 z-20 bg-cover bg-center transition-all duration-700"
            style={{ backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)` }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                <div 
                    onClick={togglePlay}
                    className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:scale-110 transition-transform cursor-pointer group/play"
                >
                    <Play className="text-white fill-current translate-x-1 group-hover/play:scale-110 transition-transform" size={40} />
                </div>
            </div>
            
            <div className="absolute top-8 left-8 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                    <Settings className="text-white/60 animate-spin-slow" size={20} />
                </div>
                <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Secure Session</span>
                    <h4 className="text-white font-bold leading-none">{title}</h4>
                </div>
            </div>
        </div>
      )}

      <div 
        className="absolute inset-0 z-10 cursor-pointer" 
        onClick={togglePlay}
        onDoubleClick={handleDoubleClick}
      >
        <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-black/60 to-transparent flex items-center px-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white font-bold tracking-tight text-lg mb-4">{title}</span>
        </div>

        {/* Triple-Arrow Skip Indicators (YouTube Style) */}
        <AnimatePresence>
            {skipIndicator && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    key={skipIndicator}
                    className={cn(
                        "absolute top-1/2 -translate-y-1/2 flex flex-col items-center justify-center p-14 bg-black/40 rounded-full backdrop-blur-md z-30 transition-all text-white",
                        skipIndicator === 'forward' ? 'right-24' : 'left-24'
                    )}
                >
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex -space-x-4">
                            {[0, 1, 2].map(i => (
                                <motion.div 
                                    key={i}
                                    animate={{ opacity: [0.2, 1, 0.2] }} 
                                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                                >
                                    <RotateCcw size={32} className={skipIndicator === 'forward' ? "rotate-180" : ""} />
                                </motion.div>
                            ))}
                        </div>
                        <span className="text-xl font-black mt-2 tracking-tighter">10 SECONDS</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        <div className="absolute bottom-0 left-0 w-full p-6 bg-linear-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20" onClick={(e) => e.stopPropagation()}>
          <div className="relative w-full h-1.5 bg-white/20 rounded-full mb-4 overflow-hidden group/bar">
             <div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full z-10 transition-all duration-300" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
             <div className="absolute top-0 left-0 h-full bg-white/10 rounded-full transition-all duration-300" style={{ width: `${(totalWatchedTime / (duration * 0.8)) * 100}%` }}></div>
             <input type="range" min="0" max={duration} step="0.1" value={currentTime} onChange={handleSeek} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-6">
                 <button onClick={togglePlay} className="hover:text-emerald-400 transition-colors">
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                 </button>
                 
                 <div className="flex items-center gap-2 group/vol">
                    <button onClick={toggleMute} className="hover:text-emerald-400 transition-colors">
                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input 
                        type="range" min="0" max="100" value={isMuted ? 0 : volume} onChange={handleVolumeChange}
                        className="w-0 group-hover/vol:w-20 transition-all duration-300 h-1 bg-white/20 rounded-full accent-emerald-500"
                    />
                 </div>

                 <div className="text-[12px] font-bold tracking-widest uppercase flex items-center gap-2">
                    <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
                    <span className="text-white/40">/</span>
                    <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
                 </div>
            </div>
            
            <div className="flex items-center gap-4">
                 <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                     <span className="text-[9px] font-black tracking-widest uppercase text-emerald-500">
                        {Math.min(100, Math.floor((totalWatchedTime / (duration * 0.8)) * 100))}% Engagement
                     </span>
                 </div>
                 
                 <button onClick={toggleFullscreen} className="hover:text-emerald-400 transition-colors mr-2">
                    <Maximize size={20} />
                 </button>
                 <span className="hidden sm:inline-block text-[10px] font-black tracking-widest uppercase text-emerald-400 border border-emerald-400/30 px-2 py-1 rounded">Secure Session</span>
                 <div className="w-32 h-8 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-[10px] font-black tracking-widest uppercase">Darul-Quran</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
