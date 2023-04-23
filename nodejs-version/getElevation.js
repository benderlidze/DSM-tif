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
        try {
            const [x, y] = proj4(src, dst, [c.lng, c.lat]);
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
            })).catch(err => {
                return {
                    lat: c.lat,
                    lon: c.lng,
                    res: null,
                    error: "Error:" + err
                };
            });
        } catch (err) {
            return {
                lat: c.lat,
                lng: c.lng,
                res: null,
                error: "Coordinates must be finite numbers"
            };
        }
    })

    const res = await Promise.all(promises)

    return res
}

export default getElevation;