import fs from "fs";
import path from "path";
import geojsonhint from "@mapbox/geojsonhint";
import { type OptionValues } from "commander";
import type { FeatureCollection, Geometry } from "geojson";
import { reducePrecision } from "./precision";

export const action = async (geojson: string, options: OptionValues) => {
  console.log("geojson", geojson);
  console.log("options", options);

  const precision: number | undefined = options.precision;
  const extraPrecision: number | undefined = options.extraPrecision;
  const isSplit: boolean = options.split || false;
  const splitIndex: boolean = options.splitIndex || false;
  const isCompress: boolean = options.compress || false; // TODO: add compress action
  let out: string | undefined = options.out;
  if (!out) {
    out = "out.geojson";
  }

  let geoJSON: FeatureCollection<Geometry | null> = JSON.parse(
    fs.readFileSync(geojson, "utf-8")
  );

  // validate geojson
  const errors = geojsonhint.hint(geoJSON);
  if (errors.length > 0) {
    throw new Error("GeoJSON errors: " + errors);
  }

  const geoJsonProperties = structuredClone(geoJSON);

  geoJSON.features.map((feature, index) => {
    if (precision && feature.geometry) {
      feature.geometry = reducePrecision(
        feature.geometry,
        precision,
        extraPrecision || precision
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

  fs.writeFileSync(out, JSON.stringify(geoJSON));
  console.log("created", out);

  if (isSplit) {
    const precisionOut = out.replace(path.extname(out), ".properties.geojson");

    fs.writeFileSync(precisionOut, JSON.stringify(geoJsonProperties));
    console.log("created", precisionOut);
  }
};
