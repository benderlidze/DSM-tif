import http from 'http';
import url from 'url';
import getElevation from './getElevation.js';
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(async (req, res) => {
    const queryObject = url.parse(req.url, true).query;

    const lat = queryObject.lat || '';
    const lng = queryObject.lng || '';

    const elevation = await getElevation(+lat, +lng)

    const result = {
        lat,
        lng,
        elevation: elevation || null
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(JSON.stringify(result));
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


