import { useState, useEffect } from "react";

const stops = [
  { time: "12:30pm", bg: "#e8f7fc", col: "#7ec8e3", icon: "🚉", title: "Meet at Cardiff Central", desc: "Depart on the direct train to Barry Island — 30 minutes, runs every 30 mins. Grab snacks on the platform.", highlight: false },
  { time: "1:00pm",  bg: "#fef3e8", col: "#f4a261", icon: "🎡", title: "Barry Island", desc: "Chips on the sea wall. Walk Whitmore Bay. Lean into the full British seaside chaos. Skip Marco's — try Boofy's.", highlight: false },
  { time: "2:00pm",  bg: "#fffbe8", col: "#f4c842", icon: "🪨", title: "Cold Knap Beach", desc: "20 min walk west along the coast path. Pebble beach, rock pools at low tide, and actual Roman scheduled monument ruins just sitting there.", highlight: false },
  { time: "3:00pm",  bg: "#eaf7ef", col: "#a8d8b9", icon: "🍺", title: "The Goodsheds, Barry", desc: "Converted shipping container street food market. Craft beer. Rooftop terrace. Decompress and debrief.", highlight: false },
  { time: "4:30pm",  bg: "#f2eefb", col: "#c9b8e8", icon: "🚆", title: "Train to Penarth", desc: "Via Cardiff Central. ~40 mins total. Arrive at Penarth cliff gardens by 5:15pm.", highlight: false },
  { time: "5:15pm",  bg: "#fef6e4", col: "#fde68a", icon: "🌅", title: "Penarth Cliff Gardens", desc: "Best sunset spot near Cardiff — headland faces due west over the Bristol Channel. 45 minutes of golden hour before the main event.", highlight: false },
  { time: "6:21pm",  bg: "#fff3f0", col: "#f4a261", icon: "☀️", title: "Sunset", desc: "Sun sets over the Bristol Channel. 11 hours 56 mins of daylight ends here. Worth every minute of the journey.", highlight: true },
  { time: "7:00pm",  bg: "#eaf7ef", col: "#a8d8b9", icon: "🏠", title: "Train Home", desc: "11 minutes back to Cardiff Central. Evening free!", highlight: false },
];

const Wave = ({ yOffset, amplitude, frequency, phase, color, opacity }) => {
  const width = 600;
  const points = [];
  for (let x = 0; x <= width; x += 4) {
    const y = yOffset + amplitude * Math.sin(((frequency * x + phase) * Math.PI) / 180);
    points.push(`${x},${y}`);
  }
  points.push(`${width},100`, `0,100`);
  return <polygon points={points.join(" ")} fill={color} opacity={opacity} />;
};

export default function BeachInvite() {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    stops.forEach((_, i) => {
      setTimeout(() => setVisible((v) => [...v, i]), 150 + i * 80);
    });
  }, []);

  return (
    <div style={{ fontFamily: "'Segoe UI', Helvetica, sans-serif", background: "linear-gradient(180deg,#c8eafb 0%,#dff3ff 35%,#fef6e4 100%)", minHeight: "100vh", paddingBottom: 32 }}>

      {/* Header */}
      <div style={{ position: "relative", overflow: "hidden", height: 88, background: "linear-gradient(180deg,#7ec8e3,#a8d8ea)" }}>
        <svg viewBox="0 0 600 88" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, width: "100%", height: "100%" }}>
          <Wave yOffset={55} amplitude={12} frequency={1.8} phase={0}   color="#fef6e4" opacity={1} />
          <Wave yOffset={65} amplitude={8}  frequency={2.2} phase={80}  color="#e8f7fc" opacity={0.5} />
        </svg>
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", paddingTop: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "white", letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.92 }}>
            You're invited · Wednesday 18 March 2026
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "white", marginTop: 4, letterSpacing: "-0.3px" }}>
            A Day at the Beach! 🌊
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 14px" }}>

        {/* Subtitle */}
        <div style={{ textAlign: "center", margin: "14px 0 10px", fontSize: 12, color: "#5a7a7a", letterSpacing: "0.04em" }}>
          Meet at Cardiff Central · 12:30pm · Barry Island · Cold Knap · Penarth
        </div>

        {/* Tide warning */}
        <div style={{ background: "#fffbe8", border: "1.5px solid #f4c842", borderRadius: 10, padding: "9px 13px", marginBottom: 12, display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span style={{ fontSize: 15, flexShrink: 0, lineHeight: 1.4 }}>⚠️</span>
          <div style={{ fontSize: 11.5, color: "#7a5c00", lineHeight: 1.5 }}>
            <strong>Tide note:</strong> Low tide 1:17pm — Cold Knap rock pools at their best in the afternoon. High tide rises fast from 2pm so don't paddle too far!
          </div>
        </div>

        {/* Itinerary stops */}
        <div>
          {stops.map((stop, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "stretch", background: "white",
                borderRadius: 14, overflow: "hidden", marginBottom: 8,
                boxShadow: "0 2px 10px rgba(100,170,210,0.10)",
                border: stop.highlight ? "1.5px solid #f4c842" : "1.5px solid transparent",
                opacity: visible.includes(i) ? 1 : 0,
                transform: visible.includes(i) ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
              }}
            >
              <div style={{ width: 7, flexShrink: 0, background: stop.col, borderRadius: "14px 0 0 14px" }} />
              <div style={{ width: 62, flexShrink: 0, background: stop.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 4px", borderRight: `1px solid ${stop.col}40` }}>
                <div style={{ fontSize: 18, lineHeight: 1 }}>{stop.icon}</div>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: stop.col, marginTop: 4, textAlign: "center", lineHeight: 1.2 }}>{stop.time}</div>
              </div>
              <div style={{ padding: "10px 14px", flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#2d6a6a", marginBottom: 3 }}>
                  {stop.title}
                  {stop.highlight && (
                    <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, background: "#fff3cd", color: "#7a5c00", borderRadius: 4, padding: "2px 6px" }}>golden hour</span>
                  )}
                </div>
                <div style={{ fontSize: 11.5, color: "#5a7a7a", lineHeight: 1.5 }}>{stop.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Cost + Rules */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
          <div style={{ background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 10px rgba(100,170,210,0.10)" }}>
            <div style={{ background: "#7ec8e3", padding: "7px 12px" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "white", letterSpacing: "0.06em", textTransform: "uppercase" }}>💰 Cost per person</span>
            </div>
            <div style={{ padding: "10px 12px" }}>
              {[["Trains (all)", "~£9"], ["Chips + lunch", "~£15"], ["Drinks", "~£8"]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#5a7a7a", marginBottom: 5 }}>
                  <span>{l}</span><span style={{ fontWeight: 600, color: "#7ec8e3" }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #e8f7fc", paddingTop: 6, marginTop: 2, display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, color: "#2d6a6a" }}>
                <span>Total</span><span style={{ color: "#f4a261" }}>~£32</span>
              </div>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 10px rgba(100,170,210,0.10)" }}>
            <div style={{ background: "#a8d8b9", padding: "7px 12px" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "white", letterSpacing: "0.06em", textTransform: "uppercase" }}>📋 The rules</span>
            </div>
            <div style={{ padding: "10px 12px" }}>
              {[
                "Someone MUST find the Roman ruins at Cold Knap.",
                "Chips at Barry. Non-negotiable.",
                "Stay for the full sunset at 6:21pm.",
                "Shoes you don't mind getting wet.",
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 6, fontSize: 11, color: "#5a7a7a", marginBottom: 5, lineHeight: 1.4 }}>
                  <span style={{ color: "#f4a261", fontWeight: 700, flexShrink: 0 }}>✦</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: "#7ec8e3", borderRadius: 12, padding: 9, marginTop: 12, textAlign: "center", fontSize: 11, color: "white" }}>
          No booking needed · tfw.wales for train times · tidetimes.org.uk/penarth-tide-times
        </div>
      </div>
    </div>
  );
}