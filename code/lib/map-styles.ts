export const mapStyle = {
  version: 8,
  sources: {
    mapbox: {
      type: "raster",
      tiles: [
        "https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
      ],
      tileSize: 512,
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#1a1a1a",
      },
    },
    {
      id: "mapbox-tiles",
      type: "raster",
      source: "mapbox",
      paint: {
        "raster-opacity": 0.3,
        "raster-saturation": -1,
      },
    },
  ],
}

export const EVENT_COLORS = {
  activity: "#F97316", // orange
  transport: "#3B82F6", // blue
  event: "#A855F7", // purple
  space: "#EC4899", // pink
  opportunity: "#EAB308", // yellow
}
