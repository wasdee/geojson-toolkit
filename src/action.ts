import fs from "fs";
import path from "path";
import geojsonhint from "@mapbox/geojsonhint";
import { type OptionValues } from "commander";
import type { FeatureCollection, Geometry } from "geojson";
import { reducePrecision } from "./precision";

export const action = async (geoJsonInput: string, options: OptionValues) => {
  console.log("input:", geoJsonInput);
  console.log("options:", options);

  const precision: number | undefined = options.precision;
  const extraPrecision: number = options.extraPrecision || precision;
  const isSplit: boolean = options.split || false;
  const splitIndex: boolean = options.splitIndex || false;
  const out = geoJsonInput.replace(
    path.extname(geoJsonInput),
    `.p${precision}e${extraPrecision}.geojson`
  );
  const precisionOut = out.replace(path.extname(out), ".properties.geojson");

  let geoJson: FeatureCollection<Geometry | null> = JSON.parse(
    fs.readFileSync(geoJsonInput, "utf-8")
  );

  // validate geojson
  const errors = geojsonhint.hint(geoJson);
  if (errors.length > 0) {
    throw new Error("GeoJSON errors: " + errors);
  }

  const geoJsonProperties = structuredClone(geoJson);

  geoJson.features.map((feature, index) => {
    if (precision && feature.geometry) {
      feature.geometry = reducePrecision(
        feature.geometry,
        precision,
        extraPrecision
      );
    }

    if (isSplit) {
      geoJsonProperties.features[index].geometry = null;

      if (splitIndex) {
        geoJsonProperties.features[index].properties = Object.assign(
          {
            idx: index,
          },
          feature.properties
        );
        feature.properties = {
          idx: index,
        };
      } else {
        geoJsonProperties.features[index].properties = feature.properties;
        feature.properties = {};
      }
    }
  });

  fs.writeFileSync(out, JSON.stringify(geoJson));
  console.log("created", out);

  if (isSplit) {
    fs.writeFileSync(precisionOut, JSON.stringify(geoJsonProperties));
    console.log("created", precisionOut);
  }
};
