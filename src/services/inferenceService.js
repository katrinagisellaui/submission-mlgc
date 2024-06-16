const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, image) {
    try {
        const buffer = await streamToBuffer(image);
        const tensor = tf.node.decodeJpeg(buffer)
                          .resizeNearestNeighbor([224, 224])
                          .expandDims()
                          .toFloat();
        const prediction = model.predict(tensor);
        const scores = await prediction.data();
        
        let predict = "";
        if (scores[0] > 0.50) { 
            predict = "Cancer";
        } else {
            predict = "Non-cancer";
        }

        return {
            label: predict,
            confidenceScore: scores[0] * 100, 
            suggestion: 'Consult a doctor now!'
        };
    } catch (error) {
        throw new Error('Failed to make prediction: ' + error.message);
    }
}

async function streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

module.exports = predictClassification;

