"use client";

import { motion, useReducedMotion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------
   Hero isometrik MIB Chemicals — ALUR MAKLON (zig-zag, bukan baris).

   Material mengalir berurutan namun jalurnya berkelok maju-mundur di
   ruang isometrik, jadi terasa seperti denah pabrik 3D:
     Bahan mentah → 01 Formulasi → 02 Bahan Baku → 03 Produksi
     → 04 Quality Control → 05 Pengemasan → Produk jadi

   Sumbu alur dipetakan ke arah iso (1,−1) (= horizontal di layar),
   sementara kedalaman (FACT) dipetakan ke arah iso (1,1). Tiap stasiun
   maju/mundur bergantian; reaktor "Produksi" paling depan & dominan.
   Sebutir material berjalan di pipeline dan berubah warna tahap demi
   tahap; tiap stasiun menyala saat dilewati. Geometri statis & terkunci;
   hanya material, denyut, grafik monitoring & kelap-kelip yang animasi.
------------------------------------------------------------------- */

const VB_W = 540;
const VB_H = 340;
const OX = 270;
const OY = 172;

const G = 48; // langkah sepanjang sumbu alur (horizontal di layar)
const AMP = 30; // amplitudo zig-zag (kedalaman)
const FACT = [0.5, -1, 1, -1, 0.5]; // pola kedalaman tiap stasiun
const FO = 30; // offset pipeline ke depan mesin
const PZ = 6; // ketinggian pipeline
const FLOW_D = 7.2; // durasi satu material menempuh seluruh lini (detik)

// proyeksi isometrik 2:1 → koordinat layar [x, y]
function proj(x: number, y: number, z = 0): [number, number] {
  return [OX + (x - y) * 0.866, OY + (x + y) * 0.5 - z];
}
function P(x: number, y: number, z = 0) {
  const [px, py] = proj(x, y, z);
  return `${px.toFixed(1)},${py.toFixed(1)}`;
}
// (s,p) → titik iso: s = posisi sepanjang alur, p = kedalaman
function sp(s: number, p: number): [number, number] {
  return [s + p, -s + p];
}

/* ---- cuboid isometrik ---- */
type Box = { ox: number; oy: number; oz: number; w: number; d: number; h: number };
function boxAt(x: number, y: number, w: number, h: number): Box {
  return { ox: x - w / 2, oy: y - w / 2, oz: 0, w, d: w, h };
}
function topFace(b: Box) {
  const z = b.oz + b.h;
  return `${P(b.ox, b.oy, z)} ${P(b.ox + b.w, b.oy, z)} ${P(b.ox + b.w, b.oy + b.d, z)} ${P(b.ox, b.oy + b.d, z)}`;
}
function rightFace(b: Box) {
  const x = b.ox + b.w;
  return `${P(x, b.oy, b.oz + b.h)} ${P(x, b.oy + b.d, b.oz + b.h)} ${P(x, b.oy + b.d, b.oz)} ${P(x, b.oy, b.oz)}`;
}
function leftFace(b: Box) {
  const y = b.oy + b.d;
  return `${P(b.ox, y, b.oz + b.h)} ${P(b.ox + b.w, y, b.oz + b.h)} ${P(b.ox + b.w, y, b.oz)} ${P(b.ox, y, b.oz)}`;
}
function topCenter(b: Box): [number, number] {
  return proj(b.ox + b.w / 2, b.oy + b.d / 2, b.oz + b.h);
}
function footShadow(b: Box) {
  const c = proj(b.ox + b.w / 2, b.oy + b.d / 2, 0);
  return { cx: c[0], cy: c[1], rx: (b.w + b.d) * 0.42, ry: (b.w + b.d) * 0.21 };
}

function IsoBox({ b, accent = "#b6e26a" }: { b: Box; accent?: string }) {
  return (
    <g>
      <polygon points={leftFace(b)} fill="url(#face-left)" />
      <polygon points={rightFace(b)} fill="url(#face-right)" />
      <polygon points={topFace(b)} fill="url(#face-top)" />
      <polygon points={topFace(b)} fill="none" stroke={accent} strokeWidth={1} strokeLinejoin="round" opacity={0.7} />
    </g>
  );
}

function Icon({ kind }: { kind: string }) {
  switch (kind) {
    case "flask":
      return <path d="M -3 -7 H 3 M -2 -7 V -2 L -6 6 H 6 L 2 -2 V -7 M -4 3 H 4" />;
    case "drop":
      return <path d="M 0 -7 C 5 -1 6 3 0 7 C -6 3 -5 -1 0 -7 Z M 0 1 a 2 2 0 0 0 0 4" />;
    case "react":
      return (
        <>
          <path d="M 6 -1 A 6.5 6.5 0 1 0 5 4" />
          <path d="M 6 -6 L 6 -1 L 1 -1" />
          <circle cx="0" cy="0" r="1.4" />
        </>
      );
    case "check":
      return (
        <>
          <circle cx="0" cy="0" r="7.5" />
          <path d="M -3.6 0 L -1 2.8 L 4 -3.2" />
        </>
      );
    case "box":
      return <path d="M -7 -4 L 0 -8 L 7 -4 L 7 5 L 0 9 L -7 5 Z M -7 -4 L 0 0 L 7 -4 M 0 0 V 9" />;
    default:
      return null;
  }
}

function poly(points: [number, number, number][]) {
  const s = points.map((p) => proj(p[0], p[1], p[2]));
  const d = s.map((c, i) => `${i ? "L" : "M"} ${c[0].toFixed(1)} ${c[1].toFixed(1)}`).join(" ");
  return { d, xs: s.map((c) => c[0]), ys: s.map((c) => c[1]) };
}

const RAW = "#9aa6b2";
const RAW2 = "#b0b86a";
const MID = "#8ec63f";
const DONE = "#588425";
const ICON_STROKE = "#16240c";

/* satu butir material: posisi diikat ke SATU nilai animasi (t) lalu
   dipetakan ke titik di path pipa via getPointAtLength → cx & cy tak
   mungkin desync, jadi selalu menempel di conveyor. */
function FlowMaterial({
  pathEl,
  length,
  arcTimes,
  fillKeys,
  rKeys,
  delay,
}: {
  pathEl: SVGPathElement;
  length: number;
  arcTimes: number[];
  fillKeys: string[];
  rKeys: number[];
  delay: number;
}) {
  const t = useMotionValue(0);
  useEffect(() => {
    const controls = animate(t, 1, { duration: FLOW_D, ease: "linear", repeat: Infinity, delay });
    return () => controls.stop();
  }, [t, delay]);
  const cx = useTransform(t, (v) => pathEl.getPointAtLength(v * length).x);
  const cy = useTransform(t, (v) => pathEl.getPointAtLength(v * length).y);
  const r = useTransform(t, arcTimes, rKeys);
  const fill = useTransform(t, arcTimes, fillKeys);
  const opacity = useTransform(t, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);
  return <motion.circle cx={cx} cy={cy} r={r} fill={fill} opacity={opacity} filter="url(#glow)" />;
}

const STATION_DEFS = [
  { no: "01", name: "Formulasi", w: 40, h: 44, icon: "flask" },
  { no: "02", name: "Bahan Baku", w: 40, h: 42, icon: "drop" },
  { no: "03", name: "Produksi", w: 58, h: 54, icon: "react", main: true },
  { no: "04", name: "Quality Control", w: 40, h: 46, icon: "check" },
  { no: "05", name: "Pengemasan", w: 42, h: 40, icon: "box" },
];

export function HeroManufacturingVisual() {
  const reduce = useReducedMotion();

  // referensi ke path pipa (untuk getPointAtLength material)
  const pipeRef = useRef<SVGPathElement>(null);
  const [pipeEl, setPipeEl] = useState<SVGPathElement | null>(null);
  const [pipeLen, setPipeLen] = useState(0);
  useEffect(() => {
    if (pipeRef.current) {
      setPipeEl(pipeRef.current);
      setPipeLen(pipeRef.current.getTotalLength());
    }
  }, []);

  // posisi tiap stasiun pada alur zig-zag
  const stations = STATION_DEFS.map((d, i) => {
    const s = (i - 2) * G;
    const p = AMP * FACT[i];
    const [x, y] = sp(s, p);
    return { ...d, idx: i, s, p, x, y, box: boxAt(x, y, d.w, d.h) };
  });

  // pangkal (bahan mentah) & ujung (produk jadi)
  const sIn = -2.85 * G;
  const sOut = 2.85 * G;
  const pEnd = AMP * 0.5;
  const [xIn, yIn] = sp(sIn, pEnd);
  const [xOut, yOut] = sp(sOut, pEnd);

  // pipeline berurutan: mentah → tiap stasiun (di depannya) → produk
  const frontOf = (x: number, y: number): [number, number, number] => [x + FO, y + FO, PZ];
  const pipeIso: [number, number, number][] = [frontOf(xIn, yIn), ...stations.map((s) => frontOf(s.x, s.y)), frontOf(xOut, yOut)];
  const pipe = poly(pipeIso);

  const fillKeys = [RAW, RAW, RAW2, MID, MID, DONE, DONE];
  const rKeys = [3, 3.4, 3.6, 4.2, 4.2, 4.4, 4.4];
  // fraksi panjang-busur tiap titik pipa → perubahan warna/ukuran pas di stasiun
  const arcTimes = (() => {
    const seg: number[] = [];
    let total = 0;
    for (let i = 1; i < pipe.xs.length; i++) {
      const l = Math.hypot(pipe.xs[i] - pipe.xs[i - 1], pipe.ys[i] - pipe.ys[i - 1]);
      seg.push(l);
      total += l;
    }
    const out = [0];
    let acc = 0;
    for (const l of seg) {
      acc += l;
      out.push(acc / total);
    }
    return out;
  })();

  // drum bahan mentah
  const dC = proj(xIn, yIn, 26);
  const dB = proj(xIn, yIn, 0);
  const dR = 17;
  const drx = 1.225 * dR;
  const dry = 0.707 * dR;

  // kotak produk jadi
  const outBox = boxAt(xOut, yOut, 40, 34);

  // urutan gambar mesin: dari belakang (x+y kecil) ke depan (x+y besar)
  const drawOrder = [...stations].sort((a, b) => a.x + a.y - (b.x + b.y));

  // platform parallelogram di bawah alur
  const sLo = sIn - 14;
  const sHi = sOut + 14;
  const pLo = -AMP - 18;
  const pHi = AMP + 22;
  const plat = [sp(sLo, pLo), sp(sHi, pLo), sp(sHi, pHi), sp(sLo, pHi)].map(([x, y]) => P(x, y, 0)).join(" ");

  return (
    <div className="relative mx-auto aspect-[27/17] w-full max-w-[560px]" aria-hidden>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="face-top" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0" stopColor="#a6dc56" />
            <stop offset="1" stopColor="#6fa12f" />
          </linearGradient>
          <linearGradient id="face-right" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#56842a" />
            <stop offset="1" stopColor="#33501a" />
          </linearGradient>
          <linearGradient id="face-left" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a4414" />
            <stop offset="1" stopColor="#16240c" />
          </linearGradient>
          <linearGradient id="ridge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8ec63f" stopOpacity="0.12" />
            <stop offset="0.5" stopColor="#8ec63f" />
            <stop offset="1" stopColor="#588425" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="ridge-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8ec63f" stopOpacity="0.14" />
            <stop offset="1" stopColor="#8ec63f" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="pipe-flow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#cbd5c0" />
            <stop offset="0.5" stopColor="#8ec63f" />
            <stop offset="1" stopColor="#588425" />
          </linearGradient>
          <radialGradient id="panel" cx="0.5" cy="0.4" r="0.75">
            <stop offset="0" stopColor="#0c1207" />
            <stop offset="1" stopColor="#16240c" />
          </radialGradient>
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* bayangan dasar + platform iso */}
        <ellipse cx={OX} cy={OY + 56} rx={250} ry={58} fill="#16240c" opacity={0.09} />
        <polygon points={plat} fill="none" stroke="#588425" strokeWidth={1} strokeDasharray="2 7" opacity={0.18} />

        {/* grafik monitoring (latar, di belakang reaktor) */}
        <g filter="url(#glow)">
          <motion.g
            initial={false}
            animate={reduce ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d={`M ${OX - 92} ${OY - 28} C ${OX - 52} ${OY - 32} ${OX - 30} ${OY - 88} ${OX} ${OY - 118} C ${OX + 30} ${OY - 88} ${OX + 52} ${OY - 32} ${OX + 92} ${OY - 28} Z`}
              fill="url(#ridge-fill)"
            />
            <motion.path
              d={`M ${OX - 92} ${OY - 28} C ${OX - 52} ${OY - 32} ${OX - 30} ${OY - 88} ${OX} ${OY - 118} C ${OX + 30} ${OY - 88} ${OX + 52} ${OY - 32} ${OX + 92} ${OY - 28}`}
              fill="none"
              stroke="url(#ridge)"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeDasharray="3 9"
              initial={{ strokeDashoffset: 0 }}
              animate={reduce ? undefined : { strokeDashoffset: -24 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.g>
        </g>

        {/* drum bahan mentah */}
        <g>
          <ellipse {...footShadow(boxAt(xIn, yIn, dR * 2, 0))} fill="#16240c" opacity={0.12} />
          <path
            d={`M ${dB[0] - drx} ${dB[1]} L ${dC[0] - drx} ${dC[1]} A ${drx} ${dry} 0 0 0 ${dC[0] + drx} ${dC[1]} L ${dB[0] + drx} ${dB[1]} A ${drx} ${dry} 0 0 1 ${dB[0] - drx} ${dB[1]} Z`}
            fill="#5d6a55"
          />
          <ellipse cx={dC[0]} cy={dC[1]} rx={drx} ry={dry} fill="#7f8c73" stroke="#9aa6b2" strokeWidth={1} />
          <ellipse cx={dC[0]} cy={dC[1]} rx={drx * 0.5} ry={dry * 0.5} fill="#3c463a" opacity={0.5} />
        </g>

        {/* bayangan kaki mesin */}
        <g fill="#16240c" opacity={0.12}>
          {stations.map((s) => (
            <ellipse key={`fs${s.no}`} {...footShadow(s.box)} />
          ))}
          <ellipse {...footShadow(outBox)} />
        </g>

        {/* stasiun (statis) — digambar belakang→depan */}
        {drawOrder.map((s) => {
          const tc = topCenter(s.box);
          const tDelay = ((s.idx + 1) / (pipeIso.length - 1)) * FLOW_D;
          return (
            <g key={s.no}>
              <IsoBox b={s.box} />

              {s.main && (
                <>
                  {(() => {
                    const rf = (u: number, v: number) => proj(s.box.ox + s.box.w, s.box.oy + u, v);
                    const bars = [12, 24, 16, 30].map((v, bi) => ({ u: 12 + bi * 11, v }));
                    return (
                      <>
                        <polygon
                          points={`${rf(7, 9).join(",")} ${rf(50, 9).join(",")} ${rf(50, 40).join(",")} ${rf(7, 40).join(",")}`}
                          fill="url(#panel)"
                          stroke="#3c5c1c"
                          strokeWidth={1}
                        />
                        {bars.map((bar, bi) => {
                          const bot = rf(bar.u, 13);
                          const top = rf(bar.u, 13 + bar.v);
                          return <line key={bi} x1={bot[0]} y1={bot[1]} x2={top[0]} y2={top[1]} stroke="#8ec63f" strokeWidth={2.8} strokeLinecap="round" opacity={0.85} />;
                        })}
                      </>
                    );
                  })()}
                </>
              )}

              {!reduce && (
                <motion.ellipse
                  cx={tc[0]}
                  cy={tc[1]}
                  rx={dry * 0.8}
                  ry={dry * 0.46}
                  fill="none"
                  stroke="#8ec63f"
                  strokeWidth={1.6}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [0.5, 2.1], opacity: [0.85, 0] }}
                  transition={{ duration: 1.3, repeat: Infinity, repeatDelay: FLOW_D - 1.3, delay: tDelay, ease: "easeOut" }}
                  style={{ transformOrigin: `${tc[0]}px ${tc[1]}px` }}
                />
              )}

              <g transform={`translate(${tc[0]}, ${tc[1] - 1})`} fill="none" stroke={ICON_STROKE} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.62}>
                <Icon kind={s.icon} />
              </g>
            </g>
          );
        })}

        {/* kotak produk jadi */}
        <g>
          <IsoBox b={outBox} />
          <g transform={`translate(${topCenter(outBox)[0]}, ${topCenter(outBox)[1] - 1})`} fill="none" stroke={ICON_STROKE} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.6}>
            <path d="M -3.6 0 L -1 2.8 L 4 -3.2" />
          </g>
        </g>

        {/* riser tipis: pipeline ke muka tiap mesin (di depan) */}
        {stations.map((s) => {
          const a = proj(s.x + FO, s.y + FO, PZ);
          const b = proj(s.box.ox + s.box.w, s.box.oy + s.box.d, 0);
          return <line key={`r${s.no}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#44601c" strokeWidth={1.3} opacity={0.45} />;
        })}

        {/* pipeline (DI DEPAN mesin) */}
        <path ref={pipeRef} d={pipe.d} fill="none" stroke="#33501a" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <path d={pipe.d} fill="none" stroke="#8ec63f" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />
        {!reduce && (
          <motion.path
            d={pipe.d}
            fill="none"
            stroke="url(#pipe-flow)"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeDasharray="2 12"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -28 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* MATERIAL mengalir & berubah warna — selalu menempel di pipa */}
        {reduce
          ? pipe.xs.map((x, i) => <circle key={`m${i}`} cx={x} cy={pipe.ys[i]} r={rKeys[i]} fill={fillKeys[i]} />)
          : pipeEl &&
            [0, FLOW_D / 2].map((delay, i) => (
              <FlowMaterial key={`mat${i}`} pathEl={pipeEl} length={pipeLen} arcTimes={arcTimes} fillKeys={fillKeys} rKeys={rKeys} delay={delay} />
            ))}

        {/* kelap-kelip aksen */}
        {[
          [110, 80],
          [438, 70],
          [496, 150],
          [44, 150],
        ].map(([cx, cy], i) =>
          reduce ? (
            <circle key={`t${i}`} cx={cx} cy={cy} r={2.2} fill="#8ec63f" opacity={0.5} />
          ) : (
            <motion.circle
              key={`t${i}`}
              cx={cx}
              cy={cy}
              r={2.2}
              fill="#8ec63f"
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            />
          )
        )}
      </svg>
    </div>
  );
}
