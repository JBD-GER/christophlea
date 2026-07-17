"use client";

import { useEffect, useRef, useState } from "react";
import { wedding } from "@/content/wedding";

const VOLUME_STORAGE_KEY = "lea-christoph-player-volume";

export function FloatingAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeFrameRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.65);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [ready, setReady] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const songAvailable = Boolean(wedding.audio.songSrc);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = window.localStorage.getItem(VOLUME_STORAGE_KEY);
      if (stored !== null) {
        const parsed = Number(stored);
        if (Number.isFinite(parsed)) setVolume(Math.min(1, Math.max(0, parsed)));
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !ready || !songAvailable) return;
    audio.volume = volume;
    audio.muted = muted;
  }, [muted, ready, songAvailable, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !ready || !songAvailable) return;
    const attempt = audio.play();
    if (!attempt) return;
    attempt
      .then(() => {
        setPlaying(true);
        setNeedsGesture(false);
      })
      .catch(() => {
        setPlaying(false);
        setNeedsGesture(true);
      });
  }, [ready, songAvailable]);

  useEffect(() => () => {
    if (fadeFrameRef.current) window.cancelAnimationFrame(fadeFrameRef.current);
  }, []);

  const fadeToVolume = (target: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeFrameRef.current) window.cancelAnimationFrame(fadeFrameRef.current);
    const startedAt = performance.now();
    const startVolume = audio.volume;
    const tick = (now: number) => {
      const ratio = Math.min(1, (now - startedAt) / 850);
      audio.volume = startVolume + (target - startVolume) * ratio;
      if (ratio < 1) fadeFrameRef.current = window.requestAnimationFrame(tick);
    };
    fadeFrameRef.current = window.requestAnimationFrame(tick);
  };

  const start = async (withFade = false) => {
    const audio = audioRef.current;
    if (!audio || !songAvailable) return;
    if (withFade) audio.volume = 0;
    try {
      await audio.play();
      setPlaying(true);
      setNeedsGesture(false);
      setManuallyPaused(false);
      if (withFade) fadeToVolume(volume);
    } catch {
      setPlaying(false);
      setNeedsGesture(true);
    }
  };

  const pause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setPlaying(false);
    setNeedsGesture(false);
    setManuallyPaused(true);
  };

  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (audioRef.current) audioRef.current.muted = nextMuted;
  };

  const changeVolume = (nextVolume: number) => {
    setVolume(nextVolume);
    setMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = nextVolume;
      audioRef.current.muted = false;
    }
    window.localStorage.setItem(VOLUME_STORAGE_KEY, String(nextVolume));
  };

  if (!songAvailable) {
    return <aside className="audio-player audio-player--unavailable">Unser Lied wird noch ergänzt</aside>;
  }

  return (
    <aside className={`audio-player ${needsGesture ? "audio-player--prompt" : ""}`} aria-label="Musikplayer">
      <audio
        ref={audioRef}
        src={wedding.audio.songSrc ?? undefined}
        preload="metadata"
        loop={wedding.audio.loop}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {needsGesture && !manuallyPaused ? (
        <button className="audio-player__start" type="button" onClick={() => start(true)}>
          <PlayIcon />
          <span>
            <small>Für diesen Moment</small>
            Unsere Musik starten
          </span>
        </button>
      ) : (
        <>
          <button
            className="audio-player__play"
            type="button"
            onClick={() => playing ? pause() : start(true)}
            aria-label={playing ? "Musik pausieren" : "Musik abspielen"}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <div className="audio-player__title">
            <span>{wedding.audio.title}</span>
            <small>{playing ? "wird abgespielt" : manuallyPaused ? "pausiert" : wedding.audio.artist}</small>
          </div>
          <span className={`equalizer ${playing && !muted ? "equalizer--active" : ""}`} aria-hidden="true">
            <i /><i /><i /><i />
          </span>
          <button className="audio-player__mute" type="button" onClick={toggleMute} aria-label={muted ? "Ton einschalten" : "Ton stummschalten"}>
            {muted ? <MutedIcon /> : <VolumeIcon />}
          </button>
          <label className="audio-player__volume">
            <span className="sr-only">Lautstärke</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={(event) => changeVolume(Number(event.target.value))}
              aria-label="Lautstärke"
            />
          </label>
        </>
      )}
    </aside>
  );
}

function PlayIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z" /></svg>;
}

function PauseIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z" /></svg>;
}

function VolumeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Zm12-1c1.4 1.2 1.4 6.8 0 8" /></svg>;
}

function MutedIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Zm12 1 4 4m0-4-4 4" /></svg>;
}
