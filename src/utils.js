export const inBounds = (point, bounds) => {
  const eastBound = point.lng < bounds.maxLng;
  const westBound = point.lng > bounds.minLng;
  let inLong;

  if (bounds.maxLng < bounds.minLng) {
    inLong = eastBound || westBound;
  } else {
    inLong = eastBound && westBound;
  }

  const inLat = point.lat > bounds.minLat && point.lat < bounds.maxLat;
  return inLat && inLong;
};
