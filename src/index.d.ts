declare module "@mapbox/geojsonhint" {
  interface ErrorHint {
    message: string;
    line: number;
    level?: "message";
  }

  interface HintOptions {
    noDuplicateMembers?: boolean;
    precisionWarning?: boolean;
    ignoreRightHandRule?: boolean;
  }

  function hint(data: string | object, options?: HintOptions): ErrorHint[];

  export { hint };
}
