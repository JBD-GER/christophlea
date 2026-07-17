"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { wedding } from "@/content/wedding";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function CastleGateTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(motionQuery.matches);
    updateMotionPreference();
    motionQuery.addEventListener("change", updateMotionPreference);
    return () => motionQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const distance = section.offsetHeight - window.innerHeight;
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      setProgress(clamp(-rect.top / Math.max(distance, 1)));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  const effectiveProgress = reducedMotion ? 1 : progress;
  const approach = clamp(effectiveProgress / 0.22);
  const opening = clamp((effectiveProgress - 0.18) / 0.39);
  const travel = clamp((effectiveProgress - 0.46) / 0.3);
  const reveal = clamp((effectiveProgress - 0.64) / 0.28);
  const finalLine = clamp((effectiveProgress - 0.84) / 0.12);

  const sceneStyle = {
    "--gate-open": `${opening}`,
    "--gate-left-angle": `${opening * -82}deg`,
    "--gate-right-angle": `${opening * 82}deg`,
    "--scene-scale": `${1 + approach * 0.045 + travel * 0.075}`,
    "--reveal-opacity": `${0.16 + reveal * 0.84}`,
    "--opening-copy": `${1 - clamp((progress - 0.22) / 0.18)}`,
    "--reveal-copy": `${reveal * (1 - finalLine * 0.8)}`,
    "--final-copy": `${finalLine}`,
    "--light": `${0.15 + travel * 0.85}`,
  } as React.CSSProperties;

  return (
    <section
      id="schlosstor"
      ref={sectionRef}
      className={`gate-sequence ${reducedMotion ? "gate-sequence--reduced" : ""}`}
      aria-label="Der Weg durch das Schlosstor"
    >
      <div className="gate-sequence__sticky" style={sceneStyle}>
        <div className="gate-scene">
          <Image
            className="gate-scene__castle"
            src={wedding.transition.background.src}
            alt=""
            fill
            sizes="100vw"
            quality={85}
            style={{ objectPosition: wedding.transition.background.focalPoint }}
          />
          <Image
            className="gate-scene__reveal"
            src={wedding.transition.revealImage.src}
            alt={wedding.transition.revealImage.alt}
            fill
            sizes="100vw"
            quality={88}
            style={{ objectPosition: wedding.transition.revealImage.focalPoint }}
          />
          <div className="gate-scene__light" aria-hidden="true" />
          <div className="gate-arch" aria-hidden="true">
            <span className="gate-arch__left" />
            <span className="gate-arch__right" />
            <span className="gate-arch__top" />
          </div>

          <div className="gate-door gate-door--left" aria-hidden="true">
            <GateOrnament />
          </div>
          <div className="gate-door gate-door--right" aria-hidden="true">
            <GateOrnament />
          </div>

          <div className="gate-particles" aria-hidden="true">
            {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
          </div>
          <p className="gate-copy gate-copy--opening">{wedding.transition.openingLine}</p>
          <p className="gate-copy gate-copy--reveal">{wedding.transition.revealLine}</p>
          <p className="gate-copy gate-copy--final">{wedding.transition.closingLine}</p>
          <span className="gate-progress" aria-hidden="true"><i style={{ transform: `scaleX(${effectiveProgress})` }} /></span>
        </div>
      </div>
    </section>
  );
}

function GateOrnament() {
  return (
    <span className="gate-ornament">
      <i />
      <b />
      <em />
      <span />
    </span>
  );
}
