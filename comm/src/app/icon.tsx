import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ff7a5c",
          color: "#ffffff",
          fontSize: 22,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
          letterSpacing: "-0.05em",
        }}
      >
        a
      </div>
    ),
    { ...size },
  );
}
