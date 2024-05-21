import client from '../dist/api_client.js';
export declare namespace injection {
    /** Check represents the result for the injection call. */
    interface Check {
        probability: number;
        index: number;
        status: string;
    }
    /** Injection represents the result for the injection call. */
    interface Injection {
        id: string;
        object: string;
        created: number;
        checks: Check[];
    }
    /** Client provides access to the injection api. */
    class Client extends client.Client {
        /** Injection detects potential prompt injection attacks in a given prompt. */
        Injection(prompt: string): Promise<[Injection, client.Error | null]>;
    }
}
export default injection;
//# sourceMappingURL=api_injection.d.ts.map