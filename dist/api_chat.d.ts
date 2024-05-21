import client from '../dist/api_client.js';
export declare namespace chat {
    /** Models represents the set of models that can be used. */
    enum Model {
        MetaLlama38BInstruct = "Meta-Llama-38B-Instruct",
        NousHermesLlama213B = "Nous-Hermes-Llama-213B",
        Hermes2ProMistral7B = "Hermes-2-Pro-Mistral-7B",
        NeuralChat7B = "Neural-Chat-7B",
        Yi34BChat = "Yi-34B-Chat",
        DeepseekCoder67BInstruct = "deepseek-coder-6.7b-instruct"
    }
    /** Role represents the set of roles that can be used. */
    enum Role {
        User = "user",
        Assistant = "assistant"
    }
    /** Message represents the role of the sender and the content to process. */
    interface Message {
        role: Role;
        content: string;
    }
    /** Choice represents a choice for the chat call. */
    interface Choice {
        index: number;
        message: Message;
        status: string;
    }
    /** Chat represents the result for the chat call. */
    interface Chat {
        id: string;
        object: string;
        created: number;
        model: Model;
        choices: Choice[];
    }
    /** Client provides access to the chat apis. */
    class Client extends client.Client {
        /** chat generates chat completions based on a conversation history. */
        Chat(model: Model, maxTokens: number, temperature: number, messages: Message[]): Promise<[Chat, client.Error | null]>;
    }
}
export default chat;
//# sourceMappingURL=api_chat.d.ts.map