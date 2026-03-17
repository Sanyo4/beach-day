import { useState, useEffect, useRef } from "react";
import { meta, stops, costs, totalCost, rules } from "./data.js";

/* ── keyframe animations (injected once) ── */
const keyframes = `
@keyframes float1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(12px, -8px) rotate(15deg); }
}
@keyframes float2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-10px, -12px) rotate(-20deg); }
}
@keyframes float3 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(8px, -6px) rotate(10deg); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes waveDrift {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes bgWave1 {
  0%, 100% { d: path("M0,12 C80,18 160,4 240,12 C320,20 400,6 480,12 C560,18 640,4 720,12 L720,40 L0,40 Z"); }
  50% { d: path("M0,14 C80,6 160,20 240,14 C320,8 400,18 480,14 C560,8 640,20 720,14 L720,40 L0,40 Z"); }
}
@keyframes bgWave2 {
  0%, 100% { d: path("M0,16 C100,22 200,10 360,16 C520,22 620,10 720,16 L720,40 L0,40 Z"); }
  50% { d: path("M0,18 C100,10 200,22 360,18 C520,10 620,22 720,18 L720,40 L0,40 Z"); }
}
@keyframes bgWave3 {
  0%, 100% { d: path("M0,20 C120,26 240,14 360,20 C480,26 600,14 720,20 L720,40 L0,40 Z"); }
  50% { d: path("M0,22 C120,14 240,26 360,22 C480,14 600,26 720,22 L720,40 L0,40 Z"); }
}
`;

/* ── shared style constants ── */
const font = "'Nunito', 'Segoe UI', sans-serif";
const colors = {
  bg: "#FFF8F0",
  headerGreen: "#A8D8B9",
  textDark: "#5C4A3A",
  textMid: "#8B7D6B",
  textLight: "#A89F95",
  leafGreen: "#7BC47F",
  bellYellow: "#F4D35E",
  cardBg: "#FFFEFB",
  shadow: "0 2px 12px rgba(92,74,58,0.08)",
};

/* ── tiny SVG icons ── */
const LeafSVG = ({ size = 24, color = "#7BC47F", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill={color} fillOpacity="0.2"/>
  </svg>
);

const ShellSVG = ({ size = 20, color = "#F4A261", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.15"/>
    <path d="M12 2c0 5.523 3 10 3 10s-3 4.477-3 10" stroke={color} strokeWidth="1" fill="none"/>
    <path d="M12 2c0 5.523-3 10-3 10s3 4.477 3 10" stroke={color} strokeWidth="1" fill="none"/>
    <path d="M2 12h20" stroke={color} strokeWidth="1"/>
  </svg>
);

const ChevronSVG = ({ expanded }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{
    transition: "transform 0.3s ease",
    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
    flexShrink: 0,
  }}>
    <path d="M6 8l4 4 4-4" stroke={colors.textMid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── Wave component for header ── */
const WaveSVG = () => (
  <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{
    position: "absolute", bottom: -1, left: 0, width: "200%", height: 40,
    animation: "waveDrift 8s linear infinite",
  }}>
    <path d="M0,20 C150,50 350,0 600,20 C850,40 1050,0 1200,20 L1200,60 L0,60 Z" fill={colors.bg} opacity="0.7"/>
    <path d="M0,30 C200,55 400,10 600,30 C800,50 1000,10 1200,30 L1200,60 L0,60 Z" fill={colors.bg}/>
  </svg>
);

/* ── Header ── */
function Header() {
  return (
    <div style={{
      position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${colors.headerGreen}, #8EC5A0)`,
      padding: "28px 20px 48px", textAlign: "center",
    }}>
      {/* Floating decorations */}
      <LeafSVG size={28} style={{ position: "absolute", top: 18, left: "12%", opacity: 0.5, animation: "float1 6s ease-in-out infinite" }} />
      <LeafSVG size={22} color="#8EC5A0" style={{ position: "absolute", top: 32, right: "15%", opacity: 0.4, animation: "float2 7s ease-in-out infinite" }} />
      <ShellSVG size={18} style={{ position: "absolute", top: 16, right: "30%", opacity: 0.35, animation: "float3 5s ease-in-out infinite" }} />

      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{
          display: "inline-block", background: "rgba(255,255,255,0.25)", borderRadius: 20,
          padding: "4px 14px", fontSize: 11, fontWeight: 700, color: "#fff",
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10,
          fontFamily: font,
        }}>
          You're invited
        </div>
        <h1 style={{
          fontFamily: font, fontSize: 28, fontWeight: 900, color: "#fff",
          margin: "4px 0 6px", letterSpacing: "-0.3px",
          textShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}>
          A Day at the Beach!
        </h1>
        <div style={{
          fontFamily: font, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)",
        }}>
          {meta.date}
        </div>
      </div>

      <WaveSVG />
    </div>
  );
}

/* ── Info strip (horizontal scrollable badges) ── */
function InfoStrip() {
  const badges = [
    { icon: "🌤️", label: meta.weather, sub: meta.temp },
    { icon: "🌊", label: `Low tide ${meta.tideLow}`, sub: null },
    { icon: "🌅", label: `Sunset ${meta.sunset}`, sub: null },
    { icon: "☀️", label: `Sunrise ${meta.sunrise}`, sub: meta.daylight },
  ];

  return (
    <div style={{
      display: "flex", gap: 8, overflowX: "auto", padding: "16px 16px 4px",
      maxWidth: 480, margin: "0 auto", WebkitOverflowScrolling: "touch",
      scrollbarWidth: "none",
    }}>
      {badges.map((b, i) => (
        <div key={i} style={{
          flex: "0 0 auto", background: colors.cardBg, borderRadius: 14,
          padding: "8px 12px", display: "flex", alignItems: "center", gap: 8,
          boxShadow: colors.shadow, border: "1px solid rgba(92,74,58,0.06)",
          minWidth: 0,
        }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>{b.icon}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: colors.textDark, whiteSpace: "nowrap" }}>{b.label}</div>
            {b.sub && <div style={{ fontFamily: font, fontSize: 10, color: colors.textMid, whiteSpace: "nowrap" }}>{b.sub}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Meeting card ── */
function MeetingCard() {
  return (
    <div style={{
      maxWidth: 480, margin: "14px auto 0", padding: "0 16px",
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${colors.bellYellow}40, ${colors.bellYellow}20)`,
        border: `1.5px solid ${colors.bellYellow}`,
        borderRadius: 16, padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <span style={{ fontSize: 24, flexShrink: 0 }}>🚉</span>
        <div>
          <div style={{ fontFamily: font, fontSize: 14, fontWeight: 800, color: colors.textDark }}>
            Meet at {meta.meetPlace}
          </div>
          <div style={{ fontFamily: font, fontSize: 12, color: colors.textMid, marginTop: 2 }}>
            {meta.meetTime} · No booking needed · Buy tickets on the day or TfW app
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Stop card ── */
function StopCard({ stop, index, expanded, onToggle, visible }) {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [expanded]);

  const hasDetails = stop.description || (stop.tips && stop.tips.length > 0) || stop.quote;

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
    }}>
      <div
        onClick={hasDetails ? onToggle : undefined}
        style={{
          background: colors.cardBg,
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: colors.shadow,
          border: stop.highlight ? `2px solid ${colors.bellYellow}` : "1px solid rgba(92,74,58,0.06)",
          cursor: hasDetails ? "pointer" : "default",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={e => { if (hasDetails) { e.currentTarget.style.transform = "scale(1.01)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(92,74,58,0.12)"; }}}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = colors.shadow; }}
      >
        {/* Color strip */}
        <div style={{ height: 4, background: stop.accent }} />

        {/* Collapsed header */}
        <div style={{
          display: "flex", alignItems: "center", padding: "12px 14px",
          gap: 12,
        }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>{stop.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: font, fontSize: 14, fontWeight: 800, color: colors.textDark,
              display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
            }}>
              {stop.title}
              {stop.highlight && (
                <span style={{
                  fontSize: 10, fontWeight: 700, background: `${colors.bellYellow}40`,
                  color: "#8B6914", borderRadius: 8, padding: "2px 8px",
                  whiteSpace: "nowrap",
                }}>golden hour ✨</span>
              )}
            </div>
            <div style={{
              fontFamily: font, fontSize: 11, color: colors.textMid, marginTop: 2,
              display: "flex", gap: 8, flexWrap: "wrap",
            }}>
              <span style={{ fontWeight: 700, color: stop.accent }}>{stop.time}</span>
              <span>·</span>
              <span>{stop.duration}</span>
            </div>
          </div>
          {hasDetails && <ChevronSVG expanded={expanded} />}
        </div>

        {/* Expandable content */}
        <div style={{
          maxHeight: expanded ? contentHeight : 0,
          opacity: expanded ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
        }}>
          <div ref={contentRef} style={{ padding: "0 14px 14px" }}>
            {/* Divider */}
            <div style={{ height: 1, background: `${stop.accent}30`, marginBottom: 12 }} />

            {/* Description */}
            {stop.description && (
              <p style={{
                fontFamily: font, fontSize: 12.5, color: colors.textDark,
                lineHeight: 1.6, marginBottom: 12,
              }}>
                {stop.description}
              </p>
            )}

            {/* Tips bulletin board */}
            {stop.tips && stop.tips.length > 0 && (
              <div style={{
                background: `${stop.accent}15`,
                borderRadius: 12, padding: "10px 12px", marginBottom: 12,
                borderLeft: `3px solid ${stop.accent}`,
              }}>
                <div style={{
                  fontFamily: font, fontSize: 10, fontWeight: 800, color: stop.accent,
                  textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6,
                }}>
                  Tips
                </div>
                {stop.tips.map((tip, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 6, marginBottom: i < stop.tips.length - 1 ? 5 : 0,
                    fontFamily: font, fontSize: 11.5, color: colors.textDark, lineHeight: 1.5,
                  }}>
                    <LeafSVG size={14} color={stop.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Worth it quote */}
            {stop.quote && (
              <div style={{
                fontFamily: font, fontSize: 12, fontStyle: "italic",
                color: colors.textMid, lineHeight: 1.5,
                padding: "8px 12px",
                background: `${colors.bellYellow}15`,
                borderRadius: 10,
                borderLeft: `3px solid ${colors.bellYellow}`,
              }}>
                "{stop.quote}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Timeline connector ── */
function TimelineDot({ accent }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "0 0 0 28px", height: 16,
    }}>
      <div style={{
        width: 2, height: 16, background: `linear-gradient(${accent}60, ${accent}20)`,
        borderRadius: 1,
      }} />
    </div>
  );
}

/* ── Cost breakdown ── */
function CostBreakdown({ expanded, onToggle }) {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) setContentHeight(contentRef.current.scrollHeight);
  }, [expanded]);

  return (
    <div style={{
      background: colors.cardBg, borderRadius: 18, overflow: "hidden",
      boxShadow: colors.shadow, border: "1px solid rgba(92,74,58,0.06)",
      cursor: "pointer",
    }} onClick={onToggle}>
      <div style={{ height: 4, background: colors.bellYellow }} />
      <div style={{
        display: "flex", alignItems: "center", padding: "12px 14px", gap: 12,
      }}>
        <span style={{ fontSize: 22 }}>💰</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: font, fontSize: 14, fontWeight: 800, color: colors.textDark }}>
            Cost Per Person
          </div>
          <div style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: colors.bellYellow, marginTop: 1 }}>
            {totalCost}
          </div>
        </div>
        <ChevronSVG expanded={expanded} />
      </div>

      <div style={{
        maxHeight: expanded ? contentHeight : 0,
        opacity: expanded ? 1 : 0,
        overflow: "hidden",
        transition: "max-height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
      }}>
        <div ref={contentRef} style={{ padding: "0 14px 14px" }}>
          <div style={{ height: 1, background: `${colors.bellYellow}30`, marginBottom: 10 }} />
          {costs.map((c, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              fontFamily: font, fontSize: 12, color: colors.textDark,
              marginBottom: 6, lineHeight: 1.4,
            }}>
              <span>{c.item}</span>
              <span style={{ fontWeight: 700, color: colors.textMid, flexShrink: 0, marginLeft: 8 }}>{c.amount}</span>
            </div>
          ))}
          <div style={{
            borderTop: `1.5px solid ${colors.bellYellow}40`, paddingTop: 8, marginTop: 4,
            display: "flex", justifyContent: "space-between", fontFamily: font,
            fontSize: 14, fontWeight: 800, color: colors.textDark,
          }}>
            <span>Total</span>
            <span style={{ color: "#D4890A" }}>{totalCost}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Transport info ── */
function TransportInfo() {
  return (
    <div style={{
      background: colors.cardBg, borderRadius: 18, overflow: "hidden",
      boxShadow: colors.shadow, border: "1px solid rgba(92,74,58,0.06)",
      padding: "14px 16px",
      display: "flex", alignItems: "flex-start", gap: 12,
    }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>🚆</span>
      <div>
        <div style={{ fontFamily: font, fontSize: 13, fontWeight: 800, color: colors.textDark, marginBottom: 4 }}>
          Transport for Wales
        </div>
        <div style={{ fontFamily: font, fontSize: 11.5, color: colors.textMid, lineHeight: 1.6 }}>
          All trains run every ~30 mins. No booking needed — buy on the day or use the TfW app. Check <span style={{ fontWeight: 700, color: colors.leafGreen }}>tfw.wales</span> for live times.
        </div>
      </div>
    </div>
  );
}

/* ── Tide warning ── */
function TideWarning() {
  return (
    <div style={{
      background: `${colors.bellYellow}18`,
      border: `1.5px solid ${colors.bellYellow}80`,
      borderRadius: 16, padding: "12px 14px",
      display: "flex", alignItems: "flex-start", gap: 10,
    }}>
      <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.3 }}>🌊</span>
      <div style={{ fontFamily: font, fontSize: 11.5, color: "#8B6914", lineHeight: 1.6 }}>
        <strong>Tide note:</strong> {meta.tideWarning}
      </div>
    </div>
  );
}

/* ── Rules card ── */
function RulesCard() {
  return (
    <div style={{
      background: colors.cardBg, borderRadius: 18, overflow: "hidden",
      boxShadow: colors.shadow, border: "1px solid rgba(92,74,58,0.06)",
    }}>
      <div style={{ height: 4, background: colors.headerGreen }} />
      <div style={{ padding: "12px 14px" }}>
        <div style={{
          fontFamily: font, fontSize: 14, fontWeight: 800, color: colors.textDark,
          marginBottom: 10, display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 18 }}>📋</span> The Rules
        </div>
        {rules.map((rule, i) => (
          <div key={i} style={{
            display: "flex", gap: 8, marginBottom: i < rules.length - 1 ? 8 : 0,
            fontFamily: font, fontSize: 12, color: colors.textDark, lineHeight: 1.5,
          }}>
            <span style={{ color: colors.bellYellow, fontWeight: 800, flexShrink: 0 }}>✦</span>
            <span>{rule}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Animated sea background ── */
function SeaBackground() {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0, overflow: "hidden",
    }}>
      {/* Subtle repeating wave layers at the bottom */}
      <svg viewBox="0 0 720 40" preserveAspectRatio="none" style={{
        position: "absolute", bottom: 0, left: 0, width: "100%", height: 80, opacity: 0.06,
      }}>
        <path d="M0,12 C80,18 160,4 240,12 C320,20 400,6 480,12 C560,18 640,4 720,12 L720,40 L0,40 Z"
          fill={colors.headerGreen} style={{ animation: "bgWave1 6s ease-in-out infinite" }} />
      </svg>
      <svg viewBox="0 0 720 40" preserveAspectRatio="none" style={{
        position: "absolute", bottom: 0, left: 0, width: "100%", height: 60, opacity: 0.05,
      }}>
        <path d="M0,16 C100,22 200,10 360,16 C520,22 620,10 720,16 L720,40 L0,40 Z"
          fill="#7EC8E3" style={{ animation: "bgWave2 8s ease-in-out infinite" }} />
      </svg>
      <svg viewBox="0 0 720 40" preserveAspectRatio="none" style={{
        position: "absolute", bottom: 0, left: 0, width: "100%", height: 45, opacity: 0.04,
      }}>
        <path d="M0,20 C120,26 240,14 360,20 C480,26 600,14 720,20 L720,40 L0,40 Z"
          fill="#A8D8B9" style={{ animation: "bgWave3 10s ease-in-out infinite" }} />
      </svg>
      {/* Very faint top shimmer */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: "40%",
        background: "linear-gradient(180deg, rgba(168,216,185,0.03) 0%, transparent 100%)",
      }} />
    </div>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <div style={{
      textAlign: "center", padding: "24px 16px 32px", position: "relative",
    }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 12, opacity: 0.4 }}>
        <LeafSVG size={18} color={colors.leafGreen} />
        <ShellSVG size={16} color={colors.textLight} />
        <LeafSVG size={16} color={colors.leafGreen} style={{ transform: "scaleX(-1)" }} />
      </div>
      <div style={{ fontFamily: font, fontSize: 11, color: colors.textLight, lineHeight: 1.6 }}>
        tfw.wales · tidetimes.org.uk/penarth-tide-times
      </div>
    </div>
  );
}

/* ── Main app ── */
export default function BeachDayApp() {
  const [expandedStop, setExpandedStop] = useState(null);
  const [visibleStops, setVisibleStops] = useState([]);
  const [costExpanded, setCostExpanded] = useState(false);

  useEffect(() => {
    stops.forEach((_, i) => {
      setTimeout(() => setVisibleStops(v => [...v, i]), 200 + i * 100);
    });
  }, []);

  return (
    <div style={{
      fontFamily: font,
      background: colors.bg,
      minHeight: "100vh",
      position: "relative",
    }}>
      <style>{keyframes}</style>
      <SeaBackground />

      <div style={{ position: "relative", zIndex: 1 }}>
      <Header />
      <InfoStrip />
      <MeetingCard />

      {/* Tide warning */}
      <div style={{ maxWidth: 480, margin: "14px auto 0", padding: "0 16px" }}>
        <TideWarning />
      </div>

      {/* Timeline with stop cards */}
      <div style={{ maxWidth: 480, margin: "16px auto 0", padding: "0 16px" }}>
        {stops.map((stop, i) => (
          <div key={i}>
            <StopCard
              stop={stop}
              index={i}
              expanded={expandedStop === i}
              onToggle={() => setExpandedStop(expandedStop === i ? null : i)}
              visible={visibleStops.includes(i)}
            />
            {i < stops.length - 1 && (
              <TimelineDot accent={stop.accent} />
            )}
          </div>
        ))}
      </div>

      {/* Cost + Transport */}
      <div style={{
        maxWidth: 480, margin: "16px auto 0", padding: "0 16px",
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        <CostBreakdown expanded={costExpanded} onToggle={() => setCostExpanded(!costExpanded)} />
        <RulesCard />
        <TransportInfo />
      </div>

      <Footer />
      </div>
    </div>
  );
}
