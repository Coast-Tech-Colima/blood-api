"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.haversineDistance = void 0;
function haversineDistance(lat1, lon1, lat2, lon2) {
    lat1 = degreesToRadians(lat1);
    lon1 = degreesToRadians(lon1);
    lat2 = degreesToRadians(lat2);
    lon2 = degreesToRadians(lon2);
    const EARTH_RADIUS_IN_KILOMETERS = 6371;
    const deltaLon = lon2 - lon1;
    const deltaLat = lat2 - lat1;
    const a = Math.pow(Math.sin(deltaLat / 2.0), 2) +
        Math.cos(lat1) *
            Math.cos(lat2) *
            Math.pow(Math.sin(deltaLon / 2.0), 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_IN_KILOMETERS * c;
}
exports.haversineDistance = haversineDistance;
/**
 * Converts degrees to radians.
 *
 * @param {number} degrees - The angle in degrees.
 * @return {number} The angle in radians.
 */
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}
//# sourceMappingURL=distance.js.map