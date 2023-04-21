import { fromArrayBuffer } from 'geotiff'
import proj4 from 'proj4';
import fs from 'fs';

// Define the source and target coordinate systems
const src = proj4.defs('EPSG:4326'); // Geographic coordinates (latitude and longitude)
const dst = proj4.defs('EPSG:4326'); // Web Mercator projection

(async function () {

    const buffer = fs.readFileSync("teste.tif");
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    const tiff = await fromArrayBuffer(arrayBuffer)
    const image = await tiff.getImage();
    const metadata = await image.getFileDirectory();
    const { lng, lat } = { lat: -22.832906062124344, lng: -47.66755677759648 }
    // Convert the latitude and longitude coordinates to projected coordinates
    const [x, y] = proj4(src, dst, [lng, lat]);
    // Calculate the pixel coordinates corresponding to the projected coordinates
    const [pixelX, pixelY] = [
        Math.round((x - metadata.ModelTiepoint[3]) / metadata.ModelPixelScale[0]),
        Math.round((metadata.ModelTiepoint[4] - y) / metadata.ModelPixelScale[1])
    ];
    // Get the elevation data at the pixel coordinates
    const data = await image.readRasters({
        window: [pixelX, pixelY, pixelX + 1, pixelY + 1],
        interleave: true
    });
    // Print the elevation data
    console.log(data[0]);
    return data[0]
})();
