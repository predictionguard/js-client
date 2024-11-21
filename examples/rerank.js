import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PREDICTIONGUARD_API_KEY);

async function Rerank() {
    const input = {
        model: 'bge-reranker-v2-m3',
        query: 'What is Deep Learning?',
        documents: ['Deep Learning is not pizza.', 'Deep Learning is pizza.'],
        returnDocuments: true,
    };

    var [result, err] = await client.Rerank(input);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.results[0].relevance_score);
}

Rerank();
