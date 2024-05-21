import client from '../dist/api_client.js';
export declare namespace toxicity {
    /** Check represents the result for the toxicity call. */
    interface Check {
        score: number;
        index: number;
        status: string;
    }
    /** Toxicity represents the result for the toxicity call. */
    interface Toxicity {
        id: string;
        object: string;
        created: number;
        checks: Check[];
    }
    /** Client provides access to the toxicity api. */
    class Client extends client.Client {
        /** Toxicity checks the toxicity of a given text. */
        Toxicity(text: string): Promise<[Toxicity, client.Error | null]>;
    }
}
export default toxicity;
//# sourceMappingURL=api_toxicity.d.ts.map