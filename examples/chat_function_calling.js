import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PREDICTIONGUARD_API_KEY);

async function ChatFunctionCalling() {
    // Define the function/tool that the model can call
    const tools = [
        {
            type: 'function',
            function: {
                name: 'get_current_weather',
                description: 'Get the current weather in a given location',
                parameters: {
                    type: 'object',
                    properties: {
                        location: {
                            type: 'string',
                            description: 'The city and state, e.g. San Francisco, CA',
                        },
                        unit: {
                            type: 'string',
                            enum: ['celsius', 'fahrenheit'],
                            description: 'The temperature unit to use',
                        },
                    },
                    required: ['location'],
                },
                strict: false,
            },
        },
        {
            type: 'function',
            function: {
                name: 'get_stock_price',
                description: 'Get the current stock price for a given ticker symbol',
                parameters: {
                    type: 'object',
                    properties: {
                        ticker: {
                            type: 'string',
                            description: 'The stock ticker symbol, e.g. AAPL',
                        },
                    },
                    required: ['ticker'],
                },
            },
        },
    ];

    const input = {
        model: 'Neural-Chat-7B',
        messages: [
            {
                role: pg.Roles.User,
                content: "What's the weather like in San Francisco and what's the current price of Apple stock?",
            },
        ],
        maxCompletionTokens: 1000,
        temperature: 0.1,
        tools: tools,
        toolChoice: 'auto', // Let the model decide which tool to use
        parallelToolCalls: true, // Allow multiple tools to be called at once
    };

    var [result, err] = await client.Chat(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Model:', result.model);
    console.log('Response:', result.choices[0].message.content);

    // Check if the model made any tool calls
    if (result.choices[0].message.toolCalls) {
        console.log('\nTool Calls:');
        for (const toolCall of result.choices[0].message.toolCalls) {
            console.log('  - Function:', toolCall.function.name);
            console.log('    Arguments:', toolCall.function.arguments);
            console.log('    ID:', toolCall.id);
        }
    }

    // Check for reasoning (if using a reasoning model)
    if (result.choices[0].message.reasoning) {
        console.log('\nReasoning:', result.choices[0].message.reasoning);
    }
}

async function ChatSpecificFunctionCall() {
    // Force the model to use a specific function
    const tools = [
        {
            type: 'function',
            function: {
                name: 'calculate_mortgage',
                description: 'Calculate monthly mortgage payment',
                parameters: {
                    type: 'object',
                    properties: {
                        principal: {
                            type: 'number',
                            description: 'The loan amount',
                        },
                        interestRate: {
                            type: 'number',
                            description: 'Annual interest rate as a percentage',
                        },
                        years: {
                            type: 'number',
                            description: 'Loan term in years',
                        },
                    },
                    required: ['principal', 'interestRate', 'years'],
                },
            },
        },
    ];

    const input = {
        model: 'Neural-Chat-7B',
        messages: [
            {
                role: pg.Roles.User,
                content: 'I need to calculate a mortgage for a $500,000 house with 4% interest over 30 years',
            },
        ],
        tools: tools,
        toolChoice: {
            type: 'function',
            function: {
                name: 'calculate_mortgage',
            },
        },
    };

    var [result, err] = await client.Chat(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('\nForced Function Call Example:');
    console.log('Tool Calls:', JSON.stringify(result.choices[0].message.toolCalls, null, 2));
}

// Run the examples
console.log('=== Function Calling Example ===\n');
ChatFunctionCalling()
    .then(() => {
        console.log('\n=== Specific Function Call Example ===\n');
        return ChatSpecificFunctionCall();
    })
    .catch(console.error);
