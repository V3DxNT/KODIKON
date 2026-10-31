"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/**
 * Detects whether the current environment supports SVG displacement backdrop-filter.
 * Chromium on desktop supports SVG backdrop filters; Firefox and Safari use the frosted fallback.
 */
function supportsSvgBackdrop(): boolean {
  if (typeof navigator === "undefined" || typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  const chromium = /(Chrome|Chromium)\/\d+/.test(ua) && !/Firefox|FxiOS|CriOS|EdgiOS/.test(ua);
  const transparencyOk = !window.matchMedia("(prefers-reduced-transparency: reduce)").matches;
  return chromium && transparencyOk;
}

/**
 * Builds a dynamic displacement map for a rounded rectangle.
 * Generates an SVG feImage data URL where the RGB channels encode edge normal vectors
 * for physical chromatic refraction (dispersion at the rims).
 */
function buildDisplacementMap(
  w: number,
  h: number,
  radius: number,
  bezel: number
): string {
  const W = Math.max(2, Math.round(w));
  const H = Math.max(2, Math.round(h));
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) return "";

  const img = ctx.createImageData(W, H);
  const hw = W / 2;
  const hh = H / 2;
  const r = Math.min(radius, hw, hh);

  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const x = i + 0.5 - hw;
      const y = j + 0.5 - hh;
      const qx = Math.abs(x) - (hw - r);
      const qy = Math.abs(y) - (hh - r);
      const ox = Math.max(qx, 0);
      const oy = Math.max(qy, 0);
      const sd = Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r;
      const d = -sd;

      let nx = 0;
      let ny = 0;
      let mag = 0;

      if (d > 0 && d < bezel) {
        if (qx > 0 && qy > 0) {
          const l = Math.hypot(qx, qy) || 1;
          nx = (qx / l) * Math.sign(x);
          ny = (qy / l) * Math.sign(y);
        } else if (qx > qy) {
          nx = Math.sign(x);
        } else {
          ny = Math.sign(y);
        }
        const t = d / bezel;
        mag = Math.pow(1 - t, 2.4);
      }

      const k = (j * W + i) * 4;
      img.data[k] = 128 + nx * mag * 127;
      img.data[k + 1] = 128 + ny * mag * 127;
      img.data[k + 2] = 128;
      img.data[k + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

export type GlassProps = {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** Corner radius in px used for the displacement map (matches border radius). */
  radius?: number;
  /** Width of the refracting rim in px. Default: 18 */
  bezel?: number;
  /** Displacement strength in px. Default: 44 */
  strength?: number;
  /** Blur radius for frosted backdrop fallback (in px). Default: 20 */
  blur?: number;
  /** Opacity / intensity scale for glass tint (0 to 1). Default: 1 */
  intensity?: number;
  /** Set to false for frosted-only glass without chromatic displacement. */
  refract?: boolean;
  glassRef?: React.MutableRefObject<HTMLDivElement | null>;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "style" | "className" | "children">;

/**
 * Liquid Glass Component
 * Apple HIG-inspired control layer surface that renders true SVG chromatic refraction
 * in Chromium and an elegant frosted fallback (blur + saturate) across all other engines.
 */
export function Glass({
  className = "",
  style,
  children,
  radius = 9999,
  bezel = 18,
  strength = 44,
  blur = 20,
  intensity = 1,
  refract = true,
  glassRef,
  ...rest
}: GlassProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      ref.current = node;
      if (glassRef) glassRef.current = node;
    },
    [glassRef]
  );

  const rawId = useId();
  const id = `px-glass-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [map, setMap] = useState<{ w: number; h: number; url: string } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !refract || !supportsSvgBackdrop()) return;

    let raf = 0;
    let last = "";

    const build = () => {
      raf = 0;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const key = `${w}x${h}`;
      if (!w || !h || key === last) return;
      last = key;
      setMap({
        w,
        h,
        url: buildDisplacementMap(
          w,
          h,
          Math.min(radius, h / 2, w / 2),
          Math.min(bezel, h / 2, w / 2)
        ),
      });
    };

    const ro = new ResizeObserver(() => {
      if (!raf) raf = requestAnimationFrame(build);
    });

    ro.observe(el);
    build();

    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [refract, radius, bezel]);

  const on = !!map?.url;

  return (
    <div
      ref={setRef}
      className={`px-liquid-glass ${className}`}
      data-refract={on || undefined}
      style={
        on
          ? {
              ...style,
              backdropFilter: `url(#${id})`,
              WebkitBackdropFilter: `url(#${id})`,
            }
          : style
      }
      {...rest}
    >
      {on && map && (
        <svg
          className="px-liquid-glass-svg pointer-events-none absolute h-0 w-0 overflow-hidden"
          width="0"
          height="0"
          aria-hidden="true"
          focusable="false"
        >
          <filter
            id={id}
            x="0"
            y="0"
            width={map.w}
            height={map.h}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={map.url}
              x="0"
              y="0"
              width={map.w}
              height={map.h}
              preserveAspectRatio="none"
              result="map"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={strength}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dr"
            />
            <feColorMatrix
              in="dr"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="r"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={strength * 0.93}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dg"
            />
            <feColorMatrix
              in="dg"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="g"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={strength * 0.86}
              xChannelSelector="R"
              yChannelSelector="G"
              result="db"
            />
            <feColorMatrix
              in="db"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="b"
            />
            <feBlend in="r" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b" mode="screen" result="rgb" />
            <feGaussianBlur in="rgb" stdDeviation="0.7" result="soft" />
            <feColorMatrix in="soft" type="saturate" values="1.35" />
          </filter>
        </svg>
      )}
      {children}
    </div>
  );
}
