
        // Default coordinates (India center)
const defaultLat = 20.5937;
const defaultLng = 78.9629;

// Check if the map div exists on this page
if (document.getElementById("map")) {

  const map = L.map("map").setView([defaultLat, defaultLng], 5);
  const coordinates = JSON.stringify(
    defaultLat,defaultLng
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    minZoom: 2,
    maxZoom: 18
  }).addTo(map);
  
}


        