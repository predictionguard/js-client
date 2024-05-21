import chat from './api_chat.ts';
import completion from './api_completion.ts';
import factuality from './api_factuality.ts';
import health from './api_health.ts';
import injection from './api_injection.ts';
import replacepi from './api_replacepi.ts';
import toxicity from './api_toxicity.ts';
import translate from './api_translate.ts';

export module api {
    export class Client {
        public Chat;
        public Completion;
        public Factuality;
        public HealthCheck;
        public Injection;
        public ReplacePI;
        public Toxicity;
        public Translate;

        // ---------------------------------------------------------------------

        constructor(url: string, apiKey: string) {
            this.Chat = new chat.Client(url, apiKey);
            this.Completion = new completion.Client(url, apiKey);
            this.Factuality = new factuality.Client(url, apiKey);
            this.HealthCheck = new health.Client(url, apiKey);
            this.Injection = new injection.Client(url, apiKey);
            this.ReplacePI = new replacepi.Client(url, apiKey);
            this.Toxicity = new toxicity.Client(url, apiKey);
            this.Translate = new translate.Client(url, apiKey);
        }
    }
}

export default api;
