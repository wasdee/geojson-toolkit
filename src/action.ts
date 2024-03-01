import fs from "fs";
import path from "path";
import geojsonhint from "@mapbox/geojsonhint";
import { type OptionValues } from "commander";
import type { FeatureCollection, Geometry } from "geojson";
import { reducePrecision } from "./precision";

export const action = async (geoJsonInput: string, options: OptionValues) => {
  console.log("input:", geoJsonInput);
  console.log("options:", options);

  const precision: number = options.precision || 6;
  const extraPrecision: number = options.extraPrecision || 2;
  const propertySplit: boolean = options.split || true;
  const addIndex: boolean = !options.splitIndex || true;
  const allOut = precision
    ? geoJsonInput.replace(
        path.extname(geoJsonInput),
        `.p${precision}e${extraPrecision}.geojson`
      )
    : geoJsonInput;
  const geometryOut = allOut.replace(path.extname(allOut), ".geom.geojson");
  const precisionOut = allOut.replace(path.extname(allOut), ".properties.geojson");

  let geoJson: FeatureCollection<Geometry | null> = JSON.parse(
    fs.readFileSync(geoJsonInput, "utf-8")
  );

  // validate geojson
  const errors = geojsonhint.hint(geoJson);
  if (errors.length > 0) {
    throw new Error("GeoJSON errors: " + errors);
  }

  const geoJsonGeometryOnly = structuredClone(geoJson);
  const geoJsonPropertyOnly = structuredClone(geoJson);


  geoJson.features.map((feature, index) => {
    if (feature.geometry) {
      feature.geometry = reducePrecision(
        feature.geometry,
        precision,
        extraPrecision
      );
      geoJsonGeometryOnly.features[index].geometry = feature.geometry;
    }
    geoJsonGeometryOnly.features[index].properties = {};


    if (propertySplit) {
      geoJsonPropertyOnly.features[index].geometry = null;

      if (addIndex) {
        feature.properties = geoJsonPropertyOnly.features[index].properties = Object.assign(
          {
            index: index,
          },
          feature.properties
        );

        geoJsonGeometryOnly.features[index].properties = {
            index: index,
        }

      } else {
        geoJsonPropertyOnly.features[index].properties = feature.properties;
      }
    }
  });

  fs.writeFileSync(allOut, JSON.stringify(geoJson));
  console.log("created", allOut);

  fs.writeFileSync(geometryOut, JSON.stringify(geoJsonGeometryOnly));
  console.log("created", geometryOut);

  if (propertySplit) {
    fs.writeFileSync(precisionOut, JSON.stringify(geoJsonPropertyOnly));
    console.log("created", precisionOut);
  }
};
