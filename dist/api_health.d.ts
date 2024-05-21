import client from '../dist/api_client.js';
export declare namespace health {
    /** Client provides access to the health apis. */
    class Client extends client.Client {
        /** HealthCheck validates the PG API Service is available. */
        HealthCheck(): Promise<[string, client.Error | null]>;
    }
}
export default health;
//# sourceMappingURL=api_health.d.ts.map