// Generate random coordinates within a radius of a center point
export function generateRandomCoordinate(
  centerLat: number,
  centerLon: number,
  radiusKm: number = 5
) {
  const earthRadiusKm = 6371
  const radiusRadians = radiusKm / earthRadiusKm
  const angle = Math.random() * 2 * Math.PI
  const distance = Math.random() * radiusRadians

  const latitude =
    Math.asin(
      Math.sin((centerLat * Math.PI) / 180) * Math.cos(distance) +
        Math.cos((centerLat * Math.PI) / 180) *
          Math.sin(distance) *
          Math.cos(angle)
    ) *
    (180 / Math.PI)

  const longitude =
    ((centerLon * Math.PI) / 180 +
      Math.atan2(
        Math.sin(angle) *
          Math.sin(distance) *
          Math.cos((centerLat * Math.PI) / 180),
        Math.cos(distance) -
          Math.sin((centerLat * Math.PI) / 180) *
            Math.sin((latitude * Math.PI) / 180)
      )) *
    (180 / Math.PI)

  return { latitude, longitude }
}
