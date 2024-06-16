const { postPredictHandler, getPredictionHistories } = require('./handler');

const routes = [
    
        {path: '/predict',
        method: 'POST',
        handler: postPredictHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                maxBytes: 1000000,
                multipart: { output: 'stream' }
            }
        }},
        {
            path: '/predict/histories',
            method: 'GET',
            handler: getPredictionHistories
        }
    
];

module.exports = routes;
