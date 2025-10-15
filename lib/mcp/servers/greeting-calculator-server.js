import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
// Greeting tool schema
const GreetingToolSchema = z.object({
    name: z.string().describe('사용자의 이름'),
    language: z.string().describe('인사할 언어 (예: 한국어, 영어, 일본어, 중국어, 스페인어, 프랑스어, 독일어)')
});
// Greeting messages in different languages
const greetingMessages = {
    '한국어': '안녕하세요',
    '영어': 'Hello',
    '일본어': 'こんにちは',
    '중국어': '你好',
    '스페인어': 'Hola',
    '프랑스어': 'Bonjour',
    '독일어': 'Hallo',
    '이탈리아어': 'Ciao',
    '포르투갈어': 'Olá',
    '러시아어': 'Привет'
};
// Create server instance
const server = new McpServer({
    name: 'greeting-server',
    version: '1.0.0'
});
// Register greeting tool
server.registerTool('greeting', {
    description: '사용자에게 이름과 언어를 입력받아서 해당 언어로 인사를 해주는 도구입니다.',
    inputSchema: {
        name: z.string().describe('사용자의 이름'),
        language: z.string().describe('인사할 언어 (예: 한국어, 영어, 일본어, 중국어, 스페인어, 프랑스어, 독일어)')
    }
}, async ({ name, language }) => {
    try {
        const greeting = greetingMessages[language] || greetingMessages['한국어'];
        const message = `${greeting}, ${name}님!`;
        return {
            content: [
                {
                    type: 'text',
                    text: message
                }
            ]
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
                }
            ],
            isError: true
        };
    }
});
// Register calculator tool
server.registerTool('calculator', {
    description: '두 개의 숫자를 받아서 사칙연산(덧셈, 뺄셈, 곱셈, 나눗셈)을 수행하고 결과를 반환하는 도구입니다.',
    inputSchema: {
        num1: z.number().describe('첫 번째 숫자'),
        num2: z.number().describe('두 번째 숫자'),
        operation: z.enum(['add', 'subtract', 'multiply', 'divide']).describe('수행할 연산 (add: 덧셈, subtract: 뺄셈, multiply: 곱셈, divide: 나눗셈)')
    }
}, async ({ num1, num2, operation }) => {
    try {
        let result;
        let operationText;
        switch (operation) {
            case 'add':
                result = num1 + num2;
                operationText = '덧셈';
                break;
            case 'subtract':
                result = num1 - num2;
                operationText = '뺄셈';
                break;
            case 'multiply':
                result = num1 * num2;
                operationText = '곱셈';
                break;
            case 'divide':
                if (num2 === 0) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: '오류: 0으로 나눌 수 없습니다.'
                            }
                        ],
                        isError: true
                    };
                }
                result = num1 / num2;
                operationText = '나눗셈';
                break;
            default:
                throw new Error('지원하지 않는 연산입니다.');
        }
        const message = `${num1} ${operationText} ${num2} = ${result}`;
        return {
            content: [
                {
                    type: 'text',
                    text: message
                }
            ]
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `계산 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
                }
            ],
            isError: true
        };
    }
});
// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Greeting MCP server started');
}
main().catch(console.error);
