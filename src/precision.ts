import { Geometry, Position } from "geojson";

/**
 * Reduce the precision of geometry coordinates
 *
 * @param geometry
 * @param precision A positive integer specifying coordinate precision
 * @param extrasPrecision A positive integer specifying extra coordinate precision for things like the z value when the coordinate is [longitude, latitude, elevation].
 * @returns {Geometry}
 */
export function reducePrecision(
  geometry: Geometry,
  precision: number,
  extrasPrecision: number
): Geometry {
  function point(p: Position) {
    return p.map(function (e, index) {
      if (index < 2) {
        return parseFloat(e.toFixed(precision));
      } else {
        return parseFloat(e.toFixed(extrasPrecision));
      }
    });
  }

  function multi(l: Position[]) {
    return l.map(point);
  }

  function poly(p: Position[][]) {
    return p.map(multi);
  }

  function multiPoly(m: Position[][][]) {
    return m.map(poly);
  }

  function geometryParse(obj: Geometry) {
    switch (obj.type) {
      case "Point":
        obj.coordinates = point(obj.coordinates);
        return obj;
      case "LineString":
      case "MultiPoint":
        obj.coordinates = multi(obj.coordinates);
        return obj;
      case "Polygon":
      case "MultiLineString":
        obj.coordinates = poly(obj.coordinates);
        return obj;
      case "MultiPolygon":
        obj.coordinates = multiPoly(obj.coordinates);
        return obj;
      case "GeometryCollection":
        obj.geometries = obj.geometries.map(geometryParse);
        return obj;
      default:
        throw new Error("unknown geometry type");
    }
  }

  if (!geometry) {
    return geometry;
  }

  return geometryParse(geometry);
}
