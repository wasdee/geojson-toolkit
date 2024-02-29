# geojson-toolkit[alpha]

an interactive cli/library toolkit to interact with geojson via cli, primary for optimization, mapbox-prefer format

![cover](assets/cover.webp)

## rationale

- reduce size 50% by removing precision from 15 to 6 in some polygon geojson.
- remove/split properties that are not used.
- add `index` property to each feature for mapbox-prefer format. reduce frontend processing time.

## MVP concept

given a geojson file, the toolkit will create a set of geojson combined a set of operations.

given `input.geojson`

| operation                                 | description                         | file_example_name                                     |
| ----------------------------------------- | ----------------------------------- | ----------------------------------------------------- |
| reduce precision to 6 precision or ~10 cm | reduce the precision of coordinates | `input.p6e2.geojson`                                  |
| split properties                          | split properties that are not used. | `input.p6e2.geojson`, `input.p6e2.properties.geojson` |
| add index                                 | add index property to each feature  | `input.p6e2.geojson`                                  |

## Usage

```sh
npm i -g @codustry/geojson-toolkit

geojson-toolkit [options] <geojson>
```

## Arguments

- `geojson`: GeoJSON input file.

## Options

- `-V, --version`: output the version number
- `-P, --precision <precision>`: Set the precision of coordinates.
- `-E, --extraPrecision <precision>`: Set the extra precision for things like the z value when the coordinate is [longitude, latitude, elevation].
- `-S, --split`: Split properties to properties file and remove properties from geojson.
- `-I, --splitIndex`: Apply index properties when splitting properties file.
- `-h, --help`: display help for command

## other tools

- [geojson-precision](https://github.com/jczaplew/geojson-precision) - a cli tool to reduce the precision of coordinates in a geojson file. npm, 6yrs old last commit
- [geojson-pick](https://github.com/node-geojson/geojson-pick) - a cli tool to pick properties from a geojson file. npm, 10yrs old last commit
