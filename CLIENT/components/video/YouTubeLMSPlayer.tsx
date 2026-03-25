"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

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
        if (onProgress) onProgress(time, duration);

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
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black overflow-hidden group"
    >
      <div id={`youtube-player-${videoId}`} className="absolute inset-0 w-full h-full pointer-events-none scale-[1.3]"></div>
      
      <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay}>
        <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-black/60 to-transparent flex items-center px-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white font-bold tracking-tight text-lg mb-4">{title}</span>
        </div>

        {!isPlaying && isReady && (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-pulse">
                    <Play className="text-white fill-current translate-x-1" size={32} />
                </div>
            </div>
        )}

        <div className="absolute bottom-0 left-0 w-full p-6 bg-linear-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20" onClick={(e) => e.stopPropagation()}>
          <div className="relative w-full h-1.5 bg-white/20 rounded-full mb-4 overflow-hidden group/bar">
             <div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full z-10 transition-all duration-300" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
             <div className="absolute top-0 left-0 h-full bg-white/30 rounded-full transition-all duration-300" style={{ width: `${(maxTimeViewed / duration) * 100}%` }}></div>
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
                 <button onClick={toggleFullscreen} className="hover:text-emerald-400 transition-colors mr-2">
                    <Maximize size={20} />
                 </button>
                 <span className="hidden sm:inline-block text-[10px] font-black tracking-widest uppercase text-emerald-400 border border-emerald-400/30 px-2 py-1 rounded">Secure Session</span>
                 <div className="w-32 h-8 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-[10px] font-black tracking-widest uppercase">Darul-Quran</div>
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
