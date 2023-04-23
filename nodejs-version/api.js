
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
            const coordinates = JSON.parse(body);
            const elevation = await getElevation(coordinates)
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

    /*

    let body = `[
        [-47.66755677759648,-22.832906062124344 ],
        [-47.66725677759648,-22.832906062124344 ],
        [-47.66215677759648,-22.832906062124344 ]
    ]
    `;
    req.on('data', chunk => {
        body += JSON.parse(chunk.toString());
    });

    req.on('end', async () => {
        const coordinates = JSON.parse(body);
        console.log('Received POST array:', coordinates);
        const elevation = await getElevation(coordinates)
        console.log('elevation--->', elevation);

        const result = {
            elevation: elevation.map(d => d[0]) || null
        }

        console.log('re', result);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(result));
        res.end();
    });
    */

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


