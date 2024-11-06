# astro-maplibre-template
Basic template for astro and maplibre, with inline, full page, and scrollytelling maps.


## 💻 Commands

All commands are run from the root of the project, from a terminal:

Replace npm with your package manager of choice. `npm`, `pnpm`, `yarn`, `bun`, etc

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run dev:network`     | Starts local dev server on local network         |
| `npm run sync`            | Generates TypeScript types for all Astro modules.|
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run preview:network` | Preview build on local network                   |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run lint`            | Run ESLint                                       |
| `npm run lint:fix`        | Auto-fix ESLint issues                           |

## Inline
Inline maps using MDX are shown in the `inline_maps.mdx` file in `/pages`. Within the `<Container />` object you can use traditional markdown as well as the MDX `Maplibre` object. You can pass styles and layers to the map. It would be good to be able to pass the option to control layer visibility and onClick behavior from the layers arg that's passed in as well, to come.

## Scrollytelling
Uses a YAML convention to pass arguments to the map object. Steps are defined in `pages/scrollytelling_steps.yaml`, which is invoked in `payes/scrolltelling.mdx`. That's where the initial position and map style should be defined. Otherwise text, images, etc. should be defined in the yaml file. I'd like to continue to add features to the steps, including passing the hidden variable, animation control, and more layer control. This is just a matter of copying the mapbox scrollytelling logic over. 


## Full page
Full page maps are shown in the `full_page_map.mdx` file in `/pages`. This is a simple map that takes the same arguments as the inline map, but is rendered as a full page map. Layers are defined in the `_full_map_map_components.yaml` file in the `/components` directory.

### Full page map options

#### Map `Props` Interface

Baseline map options. Note that map layers are added via the `_full_map_map_components.yaml` file.

| Property         | Type          | Required | Description                                                                                                         | Example Value                    |
|------------------|---------------|----------|---------------------------------------------------------------------------------------------------------------------|----------------------------------|
| `latitude`       | `number`      | Yes      | Latitude of the map center.                                                                                         | `40.7128`                        |
| `longitude`      | `number`      | Yes      | Longitude of the map center.                                                                                        | `-74.0060`                       |
| `zoom`           | `number`      | Yes      | Initial zoom level of the map.                                                                                      | `12`                             |
| `mapstyle`       | `string`      | Yes      | URL or style object for MapLibre.                                                                                   | `"mapbox://styles/mapbox/streets-v11"` |
| `container`      | `string`      | Yes      | ID of the container where the map will be rendered.                                                                 | `"map-container"`                |
| `interactive`    | `boolean`     | No       | If `false`, the map will not respond to interaction. Defaults to `true`.                                            | `true`                           |
| `containerstyle` | `string`      | No       | CSS style to apply to the map container.                                                                            | `"height: 100%; width: 100%;"`   |
| `pitch`          | `number`      | No       | Initial pitch (tilt) of the map in degrees.                                                                         | `45`                             |
| `bearing`        | `number`      | No       | Initial bearing (rotation) of the map in degrees.                                                                   | `-30`                            |



#### Layer Options Documentation

| Property     | Type      | Required | Description                                                                                                         | Example Value                                    |
|--------------|-----------|----------|---------------------------------------------------------------------------------------------------------------------|--------------------------------------------------|
| `id`         | `string`  | Yes      | Unique identifier for the layer.                                                                                   | `'bikes'`, `'pizza'`                             |
| `label`      | `string`  | No       | Label for the layer, used for display in UI elements like toggles.                                                 | `'Bike Lanes'`, `'Pizza Places'`                 |
| `toggle`     | `boolean` | No       | Whether this layer can be toggled on or off by the user. Defaults to `true`.                                       | `true`, `false`                                  |
| `visible`    | `boolean` | No       | Initial visibility of the layer. Defaults to `false`.                                                              | `true`, `false`                                  |
| `data-type`  | `string`  | Yes      | Specifies the data type. For now, only `'geojson'` is supported.                                                   | `'geojson'`                                      |
| `layer-type` | `string`  | Yes      | Defines the type of layer, which determines how the data is rendered.                                              | `'line'`, `'circle'`                             |
| `url`        | `string`  | Yes      | URL to the GeoJSON data source for this layer.                                                                     | `'https://data.cityofnewyork.us/resource/mzxg-pwib.geojson?$limit=10000'` |
| `paint`      | `object`  | No       | MapLibre paint properties for styling the layer. Values depend on the `layer-type`.                                | `{ "line-color": "#000000", "line-width": 3 }`   |
| `mouseEvent` | `array`   | No       | Array of events to listen for on this layer, specifying popup content on event.                                    | See detailed `mouseEvent` table below            |

#### `mouseEvent` Content

| Property   | Type         | Required | Description                                                                                                       | Example Value                           |
|------------|--------------|----------|-------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| `type`     | `string`     | Yes      | Type of mouse event to listen for. Options include `"click"`, `"mousemove"`, `"mouseenter"`, `"mouseleave"`.      | `"click"`                               |
| `content`  | `array`      | Yes      | Array of elements to display in the popup. Each item is an object containing a tag (`h1`, `p`, etc.) and content. You can pass multiple tags together to position feature attributes between text, etc. | `[ { "h1": [{ "str": "Feature Info" }] } ]` |


#### `content` Format

Each item in the `content` array in `mouseEvent` consists of a tag and a list of items for that tag. Items can be static strings or dynamic properties.

| Property   | Type          | Required | Description                                      | Example Value                      |
|------------|---------------|----------|--------------------------------------------------|------------------------------------|
| `str`      | `string`      | No       | Static text to display.                          | `"Feature Info"`                   |
| `property` | `string`      | No       | Property key to retrieve from feature properties.| `"dba"`. Must match an attribute name in `features[0].properties`                            |
| `else`     | `string`      | No       | Fallback text if the property value is unavailable. | `"N/A"`                        |
| `href`     | `string`      | No       | Link URL (used only with `<a>` tags).            | `"https://example.com"`            |
| `text`     | `string`      | No       | Text for the link (used only with `<a>` tags).   | `"More info"`                      |
| `src`      | `string`      | No       | Source URL for an image (used only with `<img>` tags). | `"https://example.com/image.png"` |
| `alt`      | `string`      | No       | Alt text for the image (used only with `<img>` tags). | `"Alternative text"`            |

