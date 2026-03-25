"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface YouTubeLMSPlayerProps {
  videoId: string;
  onComplete: () => void;
  title?: string;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function YouTubeLMSPlayer({ videoId, onComplete, title }: YouTubeLMSPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [maxTimeViewed, setMaxTimeViewed] = useState(0);
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
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          } else {
            setIsPlaying(false);
          }

          if (event.data === window.YT.PlayerState.ENDED) {
            onComplete();
          }
        },
      },
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);

        // Prevent skipping ahead
        if (time > maxTimeViewed + 2) {
          playerRef.current.seekTo(maxTimeViewed, true);
        } else if (time > maxTimeViewed) {
          setMaxTimeViewed(time);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, maxTimeViewed]);

  const togglePlay = () => {
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (val <= maxTimeViewed) {
      playerRef.current.seekTo(val, true);
      setCurrentTime(val);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black overflow-hidden group"
    >
      <div id={`youtube-player-${videoId}`} className="absolute inset-0 w-full h-full pointer-events-none scale-[1.3]"></div>
      
      {/* Overlay to catch clicks and provide branding */}
      <div 
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={togglePlay}
      >
        {/* Top Gradient */}
        <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-black/60 to-transparent flex items-center px-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white font-bold tracking-tight text-lg mb-4">{title}</span>
        </div>

        {/* Big Play/Pause Indicator (Central) */}
        {!isPlaying && isReady && (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-pulse">
                    <Play className="text-white fill-current translate-x-1" size={32} />
                </div>
            </div>
        )}

        {/* Bottom Controls */}
        <div 
            className="absolute bottom-0 left-0 w-full p-6 bg-linear-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20"
            onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Bar */}
          <div className="relative w-full h-1.5 bg-white/20 rounded-full mb-4 overflow-hidden group/bar">
             <div 
                className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full z-10 transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100}%` }}
             ></div>
             <div 
                className="absolute top-0 left-0 h-full bg-white/30 rounded-full transition-all duration-300"
                style={{ width: `${(maxTimeViewed / duration) * 100}%` }}
             ></div>
             <input 
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
             />
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-6">
                 <button onClick={togglePlay} className="hover:text-emerald-400 transition-colors">
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                 </button>
                 <div className="text-[12px] font-bold tracking-widest uppercase flex items-center gap-2">
                    <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
                    <span className="text-white/40">/</span>
                    <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
                 </div>
            </div>
            
            <div className="flex items-center gap-4">
                 <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 border border-emerald-400/30 px-2 py-1 rounded">Secure Session</span>
                 <div className="w-32 h-8 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-[10px] font-black tracking-widest uppercase">
                    Darul-Quran
                 </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skipping Denied Toast inside player */}
      {currentTime < maxTimeViewed - 5 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10 z-30 animate-in fade-in zoom-in">
              Skipping ahead is restricted. Complete the lesson to advance.
          </div>
      )}
    </div>
  );
}
