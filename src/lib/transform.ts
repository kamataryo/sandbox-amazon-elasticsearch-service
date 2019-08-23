export const transform = (input: GeoJSON.Feature<GeoJSON.Point>) => {
  return {
    ...input,
    geometry: {
      ...input.geometry,
      coordinates: {
        lon: input.geometry.coordinates[0],
        lat: input.geometry.coordinates[1]
      }
    }
  }
}
