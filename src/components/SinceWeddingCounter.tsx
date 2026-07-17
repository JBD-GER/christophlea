"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/content/wedding";

type Elapsed = { days: number; hours: number; minutes: number; seconds: number };
const emptyElapsed: Elapsed = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function calculateElapsed(now: number): Elapsed {
  const weddingTime = new Date(wedding.wedding.dateTime).getTime();
  const totalSeconds = Math.max(0, Math.floor((now - weddingTime) / 1000));
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function SinceWeddingCounter() {
  const [elapsed, setElapsed] = useState<Elapsed>(emptyElapsed);

  useEffect(() => {
    const update = () => setElapsed(calculateElapsed(Date.now()));
    update();
    const interval = window.setInterval(update, 1_000);
    return () => window.clearInterval(interval);
  }, []);

  const values = [
    [elapsed.days.toLocaleString("de-DE"), "Tage"],
    [String(elapsed.hours).padStart(2, "0"), "Stunden"],
    [String(elapsed.minutes).padStart(2, "0"), "Minuten"],
    [String(elapsed.seconds).padStart(2, "0"), "Sekunden"],
  ] as const;

  return (
    <section className="counter-section" id="seit-unserem-ja" aria-labelledby="counter-title">
      <div className="counter-section__ornament" aria-hidden="true">18</div>
      <div className="counter-section__inner">
        <p className="counter-section__eyebrow">18 · 07 · 2025</p>
        <h2 id="counter-title">{wedding.counter.title}</h2>
        <p className="counter-section__intro">{wedding.counter.intro}</p>
        <time className="sr-only" dateTime={wedding.wedding.dateTime}>
          Hochzeit am {wedding.wedding.dateLabel} um {wedding.wedding.timeLabel}
        </time>
        <div className="counter" aria-label="Vergangene Zeit seit unserem Ja-Wort">
          {values.map(([value, label]) => (
            <div className="counter__unit" key={label}>
              <span className="counter__number">{value}</span>
              <span className="counter__label">{label}</span>
            </div>
          ))}
        </div>
        <p className="counter-section__body">{wedding.counter.body}</p>
      </div>
    </section>
  );
}
