import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Zenda — Gestão inteligente para barbearias e salões";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #27272a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "linear-gradient(135deg, #a1a1aa, #71717a)",
            marginBottom: 40,
          }}
        >
          <span
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "#09090b",
              fontStyle: "italic",
            }}
          >
            Z
          </span>
        </div>

        <h1
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "#fafafa",
            textAlign: "center",
            lineHeight: 1.1,
            margin: 0,
            padding: "0 80px",
          }}
        >
          Zenda
        </h1>

        <p
          style={{
            fontSize: 28,
            color: "#a1a1aa",
            textAlign: "center",
            margin: 0,
            marginTop: 20,
            padding: "0 80px",
          }}
        >
          Gestão inteligente para barbearias e salões
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 48,
          }}
        >
          {["Agenda", "Clientes", "Pagamentos", "Equipe"].map((item) => (
            <span
              key={item}
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#71717a",
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: 9999,
                padding: "8px 20px",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
