import http from 'http';
import getElevation from './getElevation.js';
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(async (request, response) => {

    if (request.method == 'POST') {

        var body = ''
        request.on('data', function (data) {
            body += data
        })
        request.on('end', async function () {
            const body = JSON.parse(body);
            const coordinates = body.coordinates
            const fileName = body.fileName
            const elevation = await getElevation(coordinates, fileName)
            const result = {
                elevation: elevation || null
            }
            response.writeHead(200, { 'Content-Type': 'text/html' })
            response.write(JSON.stringify(result))
            response.end('')
        })
    } else {
        const result = {
            "data": "Only POST requests are allowed"
        }
        response.writeHead(200, { 'Content-Type': 'text/html' })
        response.write(JSON.stringify(result))
        response.end()
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


