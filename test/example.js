import mockServer from 'mockttp';
import fetch from 'node-fetch';
import assert from 'assert';

const proxy = mockServer.getLocal({
    cors: true,
    debug: false,
    recordTraffic: false,
});

describe('Mockttp', () => {
    before(() =>
        (function () {
            console.log('START');
            proxy.start(7334);

            proxy.forGet('/mocked-path').thenCallback((request) => ({
                status: 200,
                headers: {
                    'content-type': 'text/plain',
                },
                body: 'A mocked response',
            }));
        })()
    );
    after(() =>
        (function () {
            console.log('STOP');
            proxy.stop();
        })()
    );

    it('lets you mock requests, and assert on the results', async () => {
        const response = await fetch('http://localhost:7334/mocked-path', {
            method: 'get',
        });

        const v = await response.text();

        console.log('*****> ' + response.status);
        console.log('*****> ' + v);

        // Assert on the results
        assert.equal(v, 'A mocked response');
    });
});
