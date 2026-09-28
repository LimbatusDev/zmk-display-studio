import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { niceView } from "@/lib/displays/nice-view";

export const alt =
  "ZMK Display Studio — custom nice!view artwork, from image to firmware";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const { physical, artwork, statusArea } = niceView;
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "52px 60px",
        background: "#f7f7f2",
        color: "#282b27",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26 }}
      >
        <svg width="38" height="38" viewBox="0 0 38 38">
          <path
            fill="#282b27"
            d="M0 0h10v10H0zM14 0h10v10H14zM0 14h10v10H0zM28 14h10v10H28zM14 28h10v10H14zM28 28h10v10H28z"
          />
          <path
            fill="#9a4b13"
            d="M28 0h10v10H28zM14 14h10v10H14zM0 28h10v10H0z"
          />
        </svg>
        {site.name}
      </div>
      <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", width: 590 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -3,
            }}
          >
            <span>Your nice!view.</span>
            <span style={{ color: "#9a4b13" }}>Your artwork.</span>
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 25,
              lineHeight: 1.5,
              color: "#676b60",
            }}
          >
            Turn an image into custom ZMK display artwork. Preview every pixel.
            Export for your firmware.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              padding: 16,
              border: "2px solid #44483f",
              borderRadius: 14,
              background: "#282b27",
            }}
          >
            <svg
              width={(320 * physical.width) / physical.height}
              height="320"
              viewBox={`0 0 ${physical.width} ${physical.height}`}
            >
              <rect
                width={physical.width}
                height={physical.height}
                fill="#dce3c3"
              />
              <svg
                x={statusArea.physical.x}
                y={statusArea.physical.y}
                width={statusArea.physical.width}
                height={statusArea.physical.height}
                viewBox="0 0 100 30"
              >
                <path
                  stroke="#282b27"
                  strokeWidth="2"
                  d="M8 8h24v13H8zM32 12h4v5h-4M78 5l12 10-12 10V5l12 20M90 5L78 15"
                  fill="none"
                />
                <path
                  fill="#282b27"
                  d="M11 11h15v7H11zM44 10h6v10h-6zM56 10h6v10h-6z"
                />
              </svg>
              <path
                stroke="#282b27"
                d={`M0 ${artwork.physical.y}h${physical.width}`}
              />
              <svg
                x={artwork.physical.x}
                y={artwork.physical.y}
                width={artwork.physical.width}
                height={artwork.physical.height}
                viewBox="0 0 100 200"
                preserveAspectRatio="none"
              >
                <circle cx="73" cy="35" r="12" fill="#f7f7f2" />
                <path fill="#282b27" d="M0 130L40 65l35 65 25-25v95H0z" />
                <path fill="#f7f7f2" d="M40 65l12 35-12-10-10 13-5-14z" />
                <path fill="#829071" d="M0 165l25-30 25 30 25-40 25 30v45H0z" />
                <path fill="#282b27" d="M0 185l20-10 35 15 25-20 20 10v20H0z" />
              </svg>
            </svg>
          </div>
          <span style={{ fontSize: 17, color: "#676b60", letterSpacing: 2 }}>
            {artwork.physical.width} × {artwork.physical.height} PHYSICAL
            ARTWORK
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #dddfd4",
          paddingTop: 24,
          fontSize: 19,
          color: "#676b60",
        }}
      >
        <span>Free · Browser-based · No image uploads</span>
        <span>{new URL(site.url).hostname}</span>
      </div>
    </div>,
    size,
  );
}
