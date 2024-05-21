import client from '../dist/api_client.js';
export declare namespace replacepi {
    /** ReplaceMethod represents the set of replace methods that can be used. */
    enum ReplaceMethod {
        Random = "random",
        Fake = "fake",
        Category = "category",
        Mask = "mask"
    }
    /** Check represents the result for the pii call. */
    interface Check {
        new_prompt: string;
        index: number;
        status: string;
    }
    /** ReplacePI represents the result for the pii call. */
    interface ReplacePI {
        id: string;
        object: string;
        created: number;
        checks: Check[];
    }
    /** Client provides access to the replacepi api. */
    class Client extends client.Client {
        /** ReplacePI replaces personal information such as names, SSNs, and
         * emails in a given text. */
        ReplacePI(prompt: string, replaceMethod: ReplaceMethod): Promise<[ReplacePI, client.Error | null]>;
    }
}
export default replacepi;
//# sourceMappingURL=api_replacepi.d.ts.map