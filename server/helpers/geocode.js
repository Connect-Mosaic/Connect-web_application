// helpers/geocode.js
import fetch from "node-fetch";
import config from "../configs/config.js";

export async function geocodeAddress(address) {
    console.log("[geocodeAddress] called with address:", address);

    try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${config.mapboxToken}`;
        const safeUrl = url.replace(/access_token=[^&]+/, "access_token=[REDACTED]");
        console.debug("[geocodeAddress] Request URL:", safeUrl);

        const res = await fetch(url);
        console.debug("[geocodeAddress] HTTP status:", res.status);

        const data = await res.json();
        console.debug("[geocodeAddress] Response received");

        if (!data.features || data.features.length === 0) {
            console.log("[geocodeAddress] No features found for address:", address);
            return null;
        }

        const [lng, lat] = data.features[0].center;
        const fullAddress = data.features[0].place_name;

        console.log("[geocodeAddress] Success:", { lat, lng, fullAddress });

        return {
            lat,
            lng,
            fullAddress
        };

    } catch (err) {
        console.error("[geocodeAddress] Geocode error:", err);
        return null;
    }
}
