import client from '../dist/api_client.js';
export declare namespace completion {
    /** Models represents the set of models that can be used. */
    enum Model {
        MetaLlama38BInstruct = "Meta-Llama-38B-Instruct",
        NousHermesLlama213B = "Nous-Hermes-Llama-213B",
        Hermes2ProMistral7B = "Hermes-2-Pro-Mistral-7B",
        NeuralChat7B = "Neural-Chat-7B",
        Yi34BChat = "Yi-34B-Chat",
        DeepseekCoder67BInstruct = "deepseek-coder-6.7b-instruct"
    }
    /** Choice represents a choice for the completion call. */
    interface Choice {
        text: string;
        index: number;
        status: string;
        model: Model;
    }
    /** Completion represents the result for the completion call. */
    interface Completion {
        id: string;
        object: string;
        created: number;
        choices: Choice[];
    }
    /** Client provides access to the completion api. */
    class Client extends client.Client {
        /** Completion retrieve text completions based on the provided input. */
        Completion(model: Model, maxTokens: number, temperature: number, prompt: string): Promise<[Completion, client.Error | null]>;
    }
}
export default completion;
//# sourceMappingURL=api_completion.d.ts.map