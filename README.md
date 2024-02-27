# geojson-toolkit[alpha]

an interactive cli/library toolkit to interact with geojson via cli, primary for optimization, mapbox-prefer format

## rationale

- reduce size 50% by removing precision from 15 to 6 in some polygon geojson.
- remove/split properties that are not used.
- add `index` property to each feature for mapbox-prefer format. reduce frontend processing time.
- compression with gzip(`.gz`) or zstd (`.zst`) for smaller file size.

## MVP concept

given a geojson file, the toolkit will create a set of geojson combined a set of operations.

given `input.geojson`

| operation                                 | description                         | file_example_name                                                                             |
| ----------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------- |
| reduce precision to 6 precision or ~10 cm | reduce the precision of coordinates | `input.10cm.geojson`                                                                          |
| split properties                          | split properties that are not used. | `input.10cm.noproperty.geojson`, `input.propertyonly.geojson`, `input.10cm.indexonly.geojson` |
| add index                                 | add index property to each feature  | `input.10cm.index.geojson`                                                                    |
| compression                               | compress with gzip and zstd         | `_all_above_.geojson.gz`, `_all_above_.geojson.zst`                                           |

## Usage

```sh
npm i -g geojson-toolkit

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
- `-C, --compress`: Compress by gzip.
- `-O, --out <path>`: Output file path.
- `-h, --help`: display help for command

## other tools

- [geojson-precision](https://github.com/jczaplew/geojson-precision) - a cli tool to reduce the precision of coordinates in a geojson file. npm, 6yrs old last commit
- [geojson-pick](https://github.com/node-geojson/geojson-pick) - a cli tool to pick properties from a geojson file. npm, 10yrs old last commit
