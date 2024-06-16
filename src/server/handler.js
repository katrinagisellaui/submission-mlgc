const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const Boom = require('@hapi/boom');
const storeData = require('../services/storeData');

const { Firestore } = require('@google-cloud/firestore');

const getPredictionHistories = async (request, h) => {
    const db = new Firestore({projectId: 'submissionmlgc-katrinagisella'});
    const predictCollection = db.collection('predictions');

    try {
        const snapshot = await predictCollection.get();
        const histories = snapshot.docs.map(doc => ({
            id: doc.id,
            history: doc.data()
        }));

        return h.response({
            status: 'success',
            data: histories
        });
    } catch (error) {
        console.error('Error fetching prediction histories:', error);
        return h.response({
            status: 'fail',
            message: 'Failed to fetch prediction histories'
        }).code(500);
    }
};

async function postPredictHandler(request, h) {
    const { image } = request.payload;

    if (!image || image.bytes > 1000000) {
        return Boom.payloadTooLarge('Payload content length greater than maximum allowed: 1000000');
    }

    try {
        const { model } = request.server.app;
        const { confidenceScore, label, suggestion } = await predictClassification(model, image);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            "id": id,
            "result": label,
            "suggestion": suggestion,
            "createdAt": createdAt
        };

        await storeData(id, data);

        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data
        }).code(201);
    } catch (error) {
        console.error('Error during prediction:', error);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi'
        }).code(400);
    }
}

module.exports = {postPredictHandler, getPredictionHistories};

