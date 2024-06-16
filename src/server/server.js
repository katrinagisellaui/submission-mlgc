require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require('../services/loadModel');

(async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    const model = await loadModel();
    server.app.model = model;

    server.route(routes);

    server.ext('onPreResponse', ({ response }, h) => {
        if (response.isBoom) {
            const errorResponse = {
                status: 'fail',
                message: response.output.payload.message
            };
            return h.response(errorResponse).code(response.output.statusCode);
        }
        return h.continue;
    });

    await server.start();
    console.log(`Server started at: ${server.info.uri}`);
})();
