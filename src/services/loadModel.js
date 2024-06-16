const tf = require('@tensorflow/tfjs-node');

let model;

async function loadModel() {
    if (!model) {
        try {
            model = await tf.loadGraphModel('https://storage.googleapis.com/model_ml_mlgc_katrina/model.json');
            console.log("GraphModel loaded successfully");
        } catch (error) {
            console.error("Error loading the GraphModel:", error);
            throw new Error('Failed to load GraphModel');
        }
    }
    return model;
}

module.exports = loadModel;
