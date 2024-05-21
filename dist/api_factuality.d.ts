import client from '../dist/api_client.js';
export declare namespace factuality {
    /** Check represents the result for the factuality call. */
    interface Check {
        score: number;
        index: number;
        status: string;
    }
    /** Factuality represents the result for the factuality call. */
    interface Factuality {
        id: string;
        object: string;
        created: number;
        checks: Check[];
    }
    /** Client provides access to the factuality api. */
    class Client extends client.Client {
        /** Factuality checks the factuality of a given text compared to a reference. */
        Factuality(reference: string, text: string): Promise<[Factuality, client.Error | null]>;
    }
}
export default factuality;
//# sourceMappingURL=api_factuality.d.ts.map