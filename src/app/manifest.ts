import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Café Jamestine",
    short_name: "Jamestine",
    description: "Personal specialty-coffee tracking.",
    start_url: "/",
    display: "standalone",
    // Landscape-first: brew mode is read from an eye-level mount, so never lock to portrait.
    orientation: "any",
    background_color: "#fcfbfa",
    theme_color: "#fcfbfa",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
