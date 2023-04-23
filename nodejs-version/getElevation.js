import { fromArrayBuffer } from 'geotiff'
import proj4 from 'proj4';
import fs from 'fs';


async function getElevation(coordsArray) {
    // Define the source and target coordinate systems
    const src = proj4.defs('EPSG:4326'); // Geographic coordinates (latitude and longitude)
    const dst = proj4.defs('EPSG:4326'); // Web Mercator projection

    const buffer = fs.readFileSync("teste.tif");
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    const tiff = await fromArrayBuffer(arrayBuffer)
    const image = await tiff.getImage();
    const metadata = await image.getFileDirectory();

    const promises = coordsArray.map(c => {
        const [x, y] = proj4(src, dst, [c.lat, c.lng]);
        // Calculate the pixel coordinates corresponding to the projected coordinates
        const [pixelX, pixelY] = [
            Math.round((x - metadata.ModelTiepoint[3]) / metadata.ModelPixelScale[0]),
            Math.round((metadata.ModelTiepoint[4] - y) / metadata.ModelPixelScale[1])
        ];
        // Get the elevation data at the pixel coordinates
        return image.readRasters({
            window: [pixelX, pixelY, pixelX + 1, pixelY + 1],
            interleave: true
        }).then(res => ({
            lat: c.lat,
            lon: c.lng,
            res: res[0]
        }))
    })

    const res = await Promise.all(promises)

    return res
}

export default getElevation;