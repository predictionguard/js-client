export declare namespace client {
    interface Error {
        error: string;
    }
    /** Client provides access to make raw http request calls. */
    class Client {
        private url;
        private apiKey;
        constructor(url: string, apiKey: string);
        /** RawDoGet performs a raw GET call. */
        RawDoGet(endpoint: string): Promise<[any, Error | null]>;
        /** RawDoPost performs a raw POST call. */
        RawDoPost(endpoint: string, body: any): Promise<[any, Error | null]>;
    }
}
export default client;
//# sourceMappingURL=api_client.d.ts.map