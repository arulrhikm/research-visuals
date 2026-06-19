import { useState } from "react";

const BLU = "#1a55a0";
const GRN = "#00a878";
const RED = "#d63031";
const PRP = "#6c5ce7";
const ORG = "#e17055";
const GRY = "#95a5a6";
const AN = "#607090";
const W = "#ffffff";

// ========================================================
// TAB 1: TREE VIEW (concrete d=3, m=2 => k=8)
// ========================================================
function TreeView() {
  // d=3, m1=m2=2 => k=8
  // Level 0: 8 parities (computed into workspace w1,w2)
  // Level 1: 4 OR nodes  (stored in s1_1, s1_2 — reused)
  // Level 2: 2 OR nodes  (stored in s2_1, s2_2 — top storage, kept)
  // Root: OR -> target b

  const svgW = 860;
  const svgH = 520;
  const treeL = 180;  // left edge of tree area
  const treeR = svgW - 30;
  const treeMid = (treeL + treeR) / 2;

  // Y positions per level (bottom to top)
  const lvl0Y = 430;
  const lvl1Y = 320;
  const lvl2Y = 210;
  const rootY = 100;

  // Band heights
  const bandH = 80;

  // X positions
  const lvl0X = [0, 1, 2, 3, 4, 5, 6, 7].map(i => treeL + 20 + i * ((treeR - treeL - 40) / 7));
  const lvl1X = [0, 1, 2, 3].map(i => {
    const x1 = lvl0X[i * 2];
    const x2 = lvl0X[i * 2 + 1];
    return (x1 + x2) / 2;
  });
  const lvl2X = [0, 1].map(i => {
    const x1 = lvl1X[i * 2];
    const x2 = lvl1X[i * 2 + 1];
    return (x1 + x2) / 2;
  });
  const rootX = (lvl2X[0] + lvl2X[1]) / 2;

  const edge = (x1, y1, x2, y2, color) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.8} opacity={0.6} />
  );

  const orNode = (x, y, label, color) => (
    <g>
      <rect x={x - 24} y={y - 15} width={48} height={30} rx={6}
        fill={W} stroke={color} strokeWidth={2} />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize={12} fontWeight="700" fontFamily="monospace">{label}</text>
    </g>
  );

  const leaf = (x, y, label) => (
    <g>
      <circle cx={x} cy={y} r={14} fill={W} stroke={GRY} strokeWidth={1.5} />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
        fill="#555" fontSize={9} fontWeight="600" fontFamily="monospace">{label}</text>
    </g>
  );

  // Level info for left-side labels
  const levels = [
    { y: rootY, color: PRP, name: "Root", qubits: "target b", detail: "(final OR)" },
    { y: lvl2Y, color: BLU, name: "Level 2", qubits: "s\u00B2\u2081, s\u00B2\u2082", detail: "r=2 qubits (kept)" },
    { y: lvl1Y, color: GRN, name: "Level 1", qubits: "s\u00B9\u2081, s\u00B9\u2082", detail: "m\u2082=2 qubits (reused)" },
    { y: lvl0Y, color: GRY, name: "Level 0", qubits: "w\u2081, w\u2082", detail: "m\u2081=2 qubits (reused)" },
  ];

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%">
      <rect width={svgW} height={svgH} fill="#fafaf7" rx={8} />

      {/* Horizontal level bands */}
      {levels.map((lv, i) => (
        <g key={`band${i}`}>
          <rect x={treeL - 10} y={lv.y - bandH / 2} width={treeR - treeL + 40} height={bandH}
            rx={6} fill={lv.color} opacity={0.04} />
          <line x1={treeL - 10} y1={lv.y - bandH / 2} x2={treeR + 30} y2={lv.y - bandH / 2}
            stroke={lv.color} strokeWidth={0.5} opacity={0.2} />
        </g>
      ))}

      {/* Left-side labels: level name + qubit mapping */}
      {levels.map((lv, i) => (
        <g key={`lbl${i}`}>
          <text x={12} y={lv.y - 12} fill={lv.color} fontSize={12}
            fontWeight="700" fontFamily="monospace">{lv.name}</text>
          <text x={12} y={lv.y + 4} fill={lv.color} fontSize={10}
            fontFamily="monospace">{lv.qubits}</text>
          <text x={12} y={lv.y + 18} fill={AN} fontSize={9}
            fontStyle="italic" fontFamily="monospace">{lv.detail}</text>
        </g>
      ))}

      {/* Edges: root -> lvl2 */}
      {lvl2X.map((x, i) => (
        <g key={`er${i}`}>{edge(x, lvl2Y - 15, rootX, rootY + 15, PRP)}</g>
      ))}

      {/* Edges: lvl2 -> lvl1 */}
      {[0, 1].map(j => (
        <g key={`e2${j}`}>
          {edge(lvl1X[j * 2], lvl1Y - 15, lvl2X[j], lvl2Y + 15, BLU)}
          {edge(lvl1X[j * 2 + 1], lvl1Y - 15, lvl2X[j], lvl2Y + 15, BLU)}
        </g>
      ))}

      {/* Edges: lvl1 -> lvl0 */}
      {[0, 1, 2, 3].map(i => (
        <g key={`e1${i}`}>
          {edge(lvl0X[i * 2], lvl0Y - 14, lvl1X[i], lvl1Y + 15, GRN)}
          {edge(lvl0X[i * 2 + 1], lvl0Y - 14, lvl1X[i], lvl1Y + 15, GRN)}
        </g>
      ))}

      {/* Leaves (parities) */}
      {lvl0X.map((x, i) => (
        <g key={`lf${i}`}>{leaf(x, lvl0Y, `p${i + 1}`)}</g>
      ))}

      {/* Level-1 OR nodes */}
      {lvl1X.map((x, i) => (
        <g key={`n1${i}`}>{orNode(x, lvl1Y, "OR", GRN)}</g>
      ))}

      {/* Level-2 OR nodes (top storage) */}
      {lvl2X.map((x, i) => (
        <g key={`n2${i}`}>{orNode(x, lvl2Y, "OR", BLU)}</g>
      ))}

      {/* Root */}
      {orNode(rootX, rootY, "OR\u2192b", PRP)}

      {/* Fan-in annotations on edges */}
      <text x={(lvl0X[0] + lvl0X[1]) / 2} y={lvl0Y - 36} textAnchor="middle"
        fill={GRN} fontSize={9} fontFamily="monospace" fontStyle="italic">m1=2</text>
      <text x={(lvl1X[0] + lvl1X[1]) / 2} y={lvl1Y - 36} textAnchor="middle"
        fill={BLU} fontSize={9} fontFamily="monospace" fontStyle="italic">m2=2</text>
      <text x={rootX} y={rootY - 30} textAnchor="middle"
        fill={PRP} fontSize={9} fontFamily="monospace" fontStyle="italic">r=2 inputs</text>

      {/* Summary box at bottom */}
      <rect x={30} y={svgH - 52} width={svgW - 60} height={40} rx={6}
        fill="#f0f0ff" stroke={PRP} strokeWidth={1} />
      <text x={svgW / 2} y={svgH - 38} textAnchor="middle" dominantBaseline="middle"
        fill={BLU} fontSize={11} fontWeight="700" fontFamily="monospace">
        Ancillae = m1 + m2 + r = 2 + 2 + 2 = 6    |    OR gates = 4 + 2 + 1 = 7    |    T-count = O(k) = O(8)
      </text>
      <text x={svgW / 2} y={svgH - 22} textAnchor="middle" dominantBaseline="middle"
        fill={AN} fontSize={10} fontFamily="monospace">
        General: m1 + m2 + ... + m(d-1) + r ancillae.  Set mi=c (const) to get O(log k) = O(log log 1/e).
      </text>
    </svg>
  );
}

// ========================================================
// TAB 2: CIRCUIT VIEW (concrete d=3, m=2 => k=8)
// ========================================================
function CircuitView() {
  const svgW = 1100;
  const svgH = 580;
  const SP = 32;
  const LM = 130;

  // Wires
  const cY = [0, 1, 2].map(i => 70 + i * SP);
  const wY = [0, 1].map(i => cY[2] + 2.4 * SP + i * SP);
  const s1Y = [0, 1].map(i => wY[1] + 2.4 * SP + i * SP);
  const sdY = [0, 1].map(i => s1Y[1] + 2.4 * SP + i * SP);
  const bY = sdY[1] + 2.8 * SP;

  const BW = 44;
  const GAP = 16;

  // Columns (left to right)
  const xX = LM + 16;
  const a1 = xX + 44;
  const a2 = a1 + BW + GAP;
  const a3 = a2 + BW + GAP;
  const a4 = a3 + BW + 28;
  const a5 = a4 + BW + GAP;
  const a6 = a5 + BW + GAP;
  const b1 = a6 + BW + 28;
  const b2 = b1 + BW + GAP;
  const b3 = b2 + BW + 24;
  const cF = svgW - 140;
  const cFx = cF + 56;

  const hCtrl = cY[2] - cY[0] + 20;
  const hW = wY[1] - wY[0] + 20;
  const hS1 = s1Y[1] - s1Y[0] + 20;
  const hSd = sdY[1] - sdY[0] + 20;

  // Band colors
  const bands = [
    { y1: wY[0] - 18, y2: wY[1] + 18, color: GRY },
    { y1: s1Y[0] - 18, y2: s1Y[1] + 18, color: GRN },
    { y1: sdY[0] - 18, y2: sdY[1] + 18, color: BLU },
  ];

  // Primitives
  const hw = (y, color = BLU) => (
    <line x1={LM} y1={y} x2={svgW - 50} y2={y} stroke={color} strokeWidth={1.2} />
  );
  const vd = (x, y1, y2) => (
    <line x1={x} y1={y1} x2={x} y2={y2} stroke="#a8c0dc" strokeWidth={1} strokeDasharray="4,3" />
  );
  const op = (x, y, r = 7) => (
    <g>
      <circle cx={x} cy={y} r={r} fill={W} stroke={BLU} strokeWidth={1.4} />
      <line x1={x - r * 0.5} y1={y} x2={x + r * 0.5} y2={y} stroke={BLU} strokeWidth={1.3} />
      <line x1={x} y1={y - r * 0.5} x2={x} y2={y + r * 0.5} stroke={BLU} strokeWidth={1.3} />
    </g>
  );
  const bx = (x, y, w, h, t, fs = 11) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={W} stroke={BLU} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + 1} textAnchor="middle" dominantBaseline="middle"
        fill={BLU} fontSize={fs} fontWeight="700" fontFamily="monospace">{t}</text>
    </g>
  );
  const note = (x, y, t, fs = 9) => (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
      fill={AN} fontSize={fs} fontStyle="italic" fontFamily="monospace">{t}</text>
  );
  const hdots = (x, y) => (
    <g>
      <circle cx={x - 8} cy={y} r={1.8} fill={AN} />
      <circle cx={x} cy={y} r={1.8} fill={AN} />
      <circle cx={x + 8} cy={y} r={1.8} fill={AN} />
    </g>
  );
  const vdots = (x, y) => (
    <g>
      <circle cx={x} cy={y - 6} r={1.8} fill={AN} />
      <circle cx={x} cy={y} r={1.8} fill={AN} />
      <circle cx={x} cy={y + 6} r={1.8} fill={AN} />
    </g>
  );

  // Bracket: dashed rect with label OUTSIDE on top-left
  const brk = (x1, x2, y1, y2, color, t) => (
    <g>
      <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1}
        rx={6} fill="none" stroke={color} strokeWidth={2} strokeDasharray="8,4" opacity={0.5} />
      <rect x={x1} y={y1 - 16} width={t.length * 6.2 + 12} height={15}
        rx={3} fill={W} stroke={color} strokeWidth={1} opacity={0.9} />
      <text x={x1 + 6} y={y1 - 9} dominantBaseline="middle"
        fill={color} fontSize={9} fontWeight="700" fontFamily="monospace">{t}</text>
    </g>
  );

  // Parity block: tall box on controls, vertical dashed line down, XOR on each workspace wire
  const pBlock = (x, label) => (
    <g>
      {bx(x, cY[0] - 10, BW, hCtrl, label, 10)}
      {vd(x + BW / 2, cY[2] + 10, wY[0] - 8)}
      {wY.map((y, i) => <g key={i}>{op(x + BW / 2, y, 6)}</g>)}
    </g>
  );

  // OR on workspace, output XOR on a storage wire
  const orW = (x, targetY) => (
    <g>
      {bx(x, wY[0] - 10, BW, hW, "OR", 11)}
      {vd(x + BW / 2, wY[1] + 10, targetY - 8)}
      {op(x + BW / 2, targetY, 6)}
    </g>
  );

  // OR on level-1 storage, output XOR on level-2 wire
  const orS1 = (x, targetY) => (
    <g>
      {bx(x, s1Y[0] - 10, BW, hS1, "OR", 11)}
      {vd(x + BW / 2, s1Y[1] + 10, targetY - 8)}
      {op(x + BW / 2, targetY, 6)}
    </g>
  );

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%">
      <rect width={svgW} height={svgH} fill="#fafaf7" rx={8} />

      {/* Level bands */}
      {bands.map((b, i) => (
        <rect key={`cb${i}`} x={LM - 2} y={b.y1} width={svgW - LM - 48} height={b.y2 - b.y1}
          rx={4} fill={b.color} opacity={0.05} />
      ))}

      {/* ── LEFT PANEL: level names + qubit labels ── */}

      {/* Controls */}
      {cY.map((y, i) => (
        <g key={`c${i}`}>
          {hw(y)}
          <text x={LM - 14} y={y} textAnchor="end" dominantBaseline="middle"
            fill={BLU} fontSize={11} fontFamily="monospace">
            {["c\u2081", "c\u2082", "c\u2099\u208B\u2081"][i]}
          </text>
        </g>
      ))}
      {vdots(LM - 14, (cY[1] + cY[2]) / 2)}
      <text x={10} y={(cY[0] + cY[2]) / 2 - 6} fill={BLU} fontSize={10}
        fontWeight="700" fontFamily="monospace">Controls</text>
      <text x={10} y={(cY[0] + cY[2]) / 2 + 8} fill={AN} fontSize={8}
        fontFamily="monospace">(n-1 qubits)</text>

      {/* Workspace */}
      {wY.map((y, i) => (
        <g key={`w${i}`}>
          {hw(y, GRY)}
          <text x={LM - 14} y={y} textAnchor="end" dominantBaseline="middle"
            fill="#666" fontSize={11} fontFamily="monospace">
            {["w\u2081", "w\u2082"][i]}
          </text>
        </g>
      ))}
      <text x={10} y={(wY[0] + wY[1]) / 2 - 6} fill={GRY} fontSize={10}
        fontWeight="700" fontFamily="monospace">Level 0</text>
      <text x={10} y={(wY[0] + wY[1]) / 2 + 8} fill={AN} fontSize={8}
        fontFamily="monospace">m1=2 (reused)</text>

      {/* Level-1 storage */}
      {s1Y.map((y, i) => (
        <g key={`s1${i}`}>
          {hw(y, GRN)}
          <text x={LM - 14} y={y} textAnchor="end" dominantBaseline="middle"
            fill={GRN} fontSize={11} fontFamily="monospace">
            {["s\u00B9\u2081", "s\u00B9\u2082"][i]}
          </text>
        </g>
      ))}
      <text x={10} y={(s1Y[0] + s1Y[1]) / 2 - 6} fill={GRN} fontSize={10}
        fontWeight="700" fontFamily="monospace">Level 1</text>
      <text x={10} y={(s1Y[0] + s1Y[1]) / 2 + 8} fill={AN} fontSize={8}
        fontFamily="monospace">m2=2 (reused)</text>

      {/* Level-2 storage */}
      {sdY.map((y, i) => (
        <g key={`sd${i}`}>
          {hw(y, BLU)}
          <text x={LM - 14} y={y} textAnchor="end" dominantBaseline="middle"
            fill={BLU} fontSize={11} fontFamily="monospace">
            {["s\u00B2\u2081", "s\u00B2\u2082"][i]}
          </text>
        </g>
      ))}
      <text x={10} y={(sdY[0] + sdY[1]) / 2 - 6} fill={BLU} fontSize={10}
        fontWeight="700" fontFamily="monospace">Level 2</text>
      <text x={10} y={(sdY[0] + sdY[1]) / 2 + 8} fill={AN} fontSize={8}
        fontFamily="monospace">r=2 (kept)</text>

      {/* Target */}
      {hw(bY, PRP)}
      <text x={LM - 14} y={bY} textAnchor="end" dominantBaseline="middle"
        fill={PRP} fontSize={13} fontWeight="700" fontFamily="monospace">b</text>
      <text x={10} y={bY} fill={PRP} fontSize={10}
        fontWeight="700" fontFamily="monospace">Target</text>

      {/* ── X gate ── */}
      {bx(xX, cY[0] - 10, 30, hCtrl, "X", 13)}

      {/* ── NESTING BRACKETS (labels above, not inside) ── */}
      {brk(a1 - 10, b3 + 40, cY[0] - 50, sdY[1] + 28, PRP, "FillStorage(2)")}
      {brk(a1 - 6, b2 + BW + 10, cY[0] - 34, s1Y[1] + 22, BLU, "FillStorage(1) + OR + Fill(1)\u2020")}
      {brk(a1 - 2, a3 + BW + 6, wY[0] - 20, s1Y[0] + 16, GRN, "iter 1")}
      {brk(a4 - 2, a6 + BW + 6, wY[0] - 20, s1Y[1] + 16, GRN, "iter 2")}

      {/* ── BATCH 1: W1 → OR → W1† ── */}
      {pBlock(a1, "W\u2081")}
      {orW(a2, s1Y[0])}
      {pBlock(a3, "W\u2081\u2020")}
      {note((a3 + BW + a4) / 2, wY[1] + 16, "w freed")}

      {/* ── BATCH 2: W2 → OR → W2† ── */}
      {pBlock(a4, "W\u2082")}
      {orW(a5, s1Y[1])}
      {pBlock(a6, "W\u2082\u2020")}

      {/* ── OR(s1) → sd_1 ── */}
      {orS1(b1, sdY[0])}

      {/* Fill(1)† */}
      {bx(b2, s1Y[0] - 10, BW + 8, hS1, "Fill(1)\u2020", 9)}

      {/* ... repeat for sd_2 */}
      {hdots(b3, cY[1])}
      {hdots(b3, wY[0])}
      {hdots(b3, s1Y[0])}
      {hdots(b3, sdY[1])}
      {note(b3, sdY[1] + 22, "\u00D72 fills s\u00B2\u2082")}

      {/* ── Final OR(sd) → b ── */}
      {bx(cF, sdY[0] - 10, BW + 4, hSd, "OR", 12)}
      {vd(cF + (BW + 4) / 2, sdY[1] + 10, bY - 9)}
      {op(cF + (BW + 4) / 2, bY, 8)}
      {bx(cFx, bY - 11, 28, 22, "X", 12)}

      {/* Uncompute bar */}
      <line x1={cFx + 36} y1={cY[0] - 44} x2={cFx + 36} y2={sdY[1] + 24}
        stroke="#a8c0dc" strokeWidth={2.5} strokeDasharray="6,4" />
      <text x={cFx + 36} y={sdY[1] + 40} textAnchor="middle" fill={AN}
        fontSize={8} fontStyle="italic" fontFamily="monospace">then reverse</text>

      {/* ── Summary bar ── */}
      <rect x={30} y={bY + 30} width={svgW - 60} height={30} rx={5}
        fill="#f0f0ff" stroke={PRP} strokeWidth={1} />
      <text x={svgW / 2} y={bY + 45} textAnchor="middle" dominantBaseline="middle"
        fill={PRP} fontSize={11} fontWeight="700" fontFamily="monospace">
        {"X \u2192 FillStorage(2) \u2192 OR(s\u00B2 \u2192 b) \u2192 X(b) \u2192 FillStorage(2)\u2020 \u2192 X     Ancillae = 2 + 2 + 2 = 6"}
      </text>
    </svg>
  );
}

// ========================================================
// MAIN APP
// ========================================================
export default function App() {
  const [tab, setTab] = useState("tree");

  return (
    <div style={{ background: "#edebe5", minHeight: "100vh", padding: "20px 16px", fontFamily: "monospace" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", color: BLU, fontSize: 19, margin: "0 0 4px" }}>
          d-Level OR Tree Construction
        </h1>
        <p style={{ textAlign: "center", color: AN, fontSize: 11, marginBottom: 14 }}>
          Concrete example: d=3, m=2, k=8 parities. Ancillae = m1 + m2 + r = 2 + 2 + 2 = 6.
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 14 }}>
          {[
            { key: "tree", label: "Tree View" },
            { key: "circuit", label: "Circuit View" },
            { key: "both", label: "Both" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "7px 18px", fontSize: 12, fontWeight: 700,
              fontFamily: "monospace", cursor: "pointer", borderRadius: 6,
              border: tab === t.key ? `2px solid ${BLU}` : "1.5px solid #bbb",
              background: tab === t.key ? BLU : W, color: tab === t.key ? W : BLU,
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {(tab === "tree" || tab === "both") && (
          <div style={{
            background: W, borderRadius: 12, padding: 14, marginBottom: 14,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #d0d0d0",
          }}>
            <h3 style={{ color: BLU, fontSize: 13, margin: "0 0 8px", textAlign: "center" }}>
              Tree Structure (what FillStorage builds)
            </h3>
            <TreeView />
          </div>
        )}

        {(tab === "circuit" || tab === "both") && (
          <div style={{
            background: W, borderRadius: 12, padding: 14, marginBottom: 14,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #d0d0d0",
            overflowX: "auto",
          }}>
            <h3 style={{ color: BLU, fontSize: 13, margin: "0 0 8px", textAlign: "center" }}>
              Circuit Diagram (how FillStorage executes)
            </h3>
            <CircuitView />
          </div>
        )}

        {/* Explanation */}
        <div style={{
          background: W, borderRadius: 10, padding: 16,
          border: "1px solid #d0d0d0",
        }}>
          <h3 style={{ color: BLU, fontSize: 13, margin: "0 0 10px" }}>Reading the diagrams</h3>
          <div style={{ fontSize: 11, color: "#444", lineHeight: 1.7 }}>
            <p style={{ margin: "0 0 8px" }}>
              <strong>Tree view:</strong> 8 parities at the bottom feed into 4 level-1 OR gates (groups of m1=2),
              which feed into 2 level-2 OR gates (groups of m2=2), which feed into the root OR that writes to the target.
              Dashed brackets show which subtrees correspond to each FillStorage call.
            </p>
            <p style={{ margin: "0 0 8px" }}>
              <strong>Circuit view:</strong> Time flows left to right. Each W_i block computes parities from controls
              into workspace. The OR block combines workspace into a storage qubit. W_i{"\u2020"} uncomputes workspace so
              it can be reused. Colored brackets show the FillStorage nesting.
            </p>
            <p style={{ margin: "0 0 8px" }}>
              <strong>Key insight:</strong> At any instant, only <em>one batch per level</em> is alive.
              Workspace (m1=2 qubits) is reused across all 4 parity batches. Level-1 storage (m2=2 qubits)
              is reused across both level-2 batches. Only the top storage (r=2) accumulates.
            </p>
            <p style={{ margin: 0 }}>
              <strong>General formula:</strong> Ancillae = m1 + m2 + ... + m_{"{d-1}"} + r.
              With constant fan-in m_i = c and d = log_c(k) levels: O(d) = O(log k) = O(log log 1/{"\u03B5"}).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
