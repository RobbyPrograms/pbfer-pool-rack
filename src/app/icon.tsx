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
          background: "#0A0A0B",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 18,
            height: 16,
            border: "2px solid #FF5A1F",
            clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
          }}
        />
      </div>
    ),
    size,
  );
}
