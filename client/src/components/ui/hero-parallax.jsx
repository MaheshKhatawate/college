import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * HeroParallax - A lightweight parallax hero inspired by Aceternity's Hero Parallax.
 * Props:
 * - images: Array<{ src: string, alt?: string }>
 * - title: ReactNode
 * - subtitle?: ReactNode
 * - ctas?: ReactNode
 * - className?: string
 */
export default function HeroParallax({
  images = [],
  title,
  subtitle,
  ctas,
  className = '',
  mode = 'grid', // 'grid' | 'single'
  autoplay = true,
  interval = 2500,
}) {
  const containerRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMouse({ x, y });
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  // Auto-advance images in single mode
  useEffect(() => {
    if (mode !== 'single' || images.length <= 1 || !autoplay) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, Math.max(1200, interval));
    return () => clearInterval(id);
  }, [mode, images.length, autoplay, interval]);

  const layers = useMemo(() => {
    // Split images into 3 depth layers: back, mid, front
    const third = Math.ceil(images.length / 3) || 1;
    return [
      images.slice(0, third),
      images.slice(third, third * 2),
      images.slice(third * 2),
    ];
  }, [images]);

  const depthTransforms = [
    (x, y) => `translate3d(${(x - 0.5) * -16}px, ${(y - 0.5) * -12}px, 0) scale(1.02)`,
    (x, y) => `translate3d(${(x - 0.5) * -24}px, ${(y - 0.5) * -16}px, 0) scale(1.03)`,
    (x, y) => `translate3d(${(x - 0.5) * -36}px, ${(y - 0.5) * -24}px, 0) scale(1.05)`,
  ];

  return (
    <section ref={containerRef} className={`relative w-full overflow-hidden ${className}`}>
      {/* Background wash aligned to palette */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, #132a13 0%, #0f1f10 40%, #132a13 100%)" }} />
        <div className="absolute inset-0 opacity-60" style={{
          backgroundImage: `radial-gradient(60% 40% at 20% 20%, rgba(236,243,158,0.10) 0%, rgba(236,243,158,0.0) 60%),
                           radial-gradient(50% 40% at 80% 70%, rgba(144,169,85,0.12) 0%, rgba(144,169,85,0.0) 60%)`
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6">
            {title}
            {subtitle}
            {ctas}
          </div>

          {/* Parallax stage */}
          {/* Visual stage */}
          {mode === 'single' ? (
            <div className="relative h-[340px] sm:h-[420px] md:h-[480px] lg:h-[520px]">
              {images.map((img, i) => (
                <div
                  key={`${img.src}-${i}`}
                  className="absolute inset-0 rounded-2xl overflow-hidden border border-[#ecf39e33] bg-white/5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: `translate3d(${(mouse.x - 0.5) * -24}px, ${(mouse.y - 0.5) * -16}px, 0) scale(${i === active ? 1.02 : 1})`,
                    transition: 'opacity 600ms ease, transform 120ms ease-out',
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt || 'Hero visual'}
                    className="w-full h-full object-cover contrast-110 saturate-125 brightness-105 select-none"
                    loading={i === active ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable="false"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#132a13]/25 to-transparent" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative h-[340px] sm:h-[420px] md:h-[480px] lg:h-[520px]">
              {layers.map((group, i) => (
                <div
                  key={i}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    transform: depthTransforms[i](mouse.x, mouse.y),
                    transition: 'transform 120ms ease-out',
                  }}
                >
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 grid grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                      {group.map((img, idx) => (
                        <div key={idx} className="relative rounded-2xl overflow-hidden border border-[#ecf39e33] bg-white/5 backdrop-blur-xl">
                          <img
                            src={img.src}
                            alt={img.alt || 'Hero visual'}
                            className="w-full h-full object-cover contrast-110 saturate-125 brightness-105"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#132a13]/25 to-transparent" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
