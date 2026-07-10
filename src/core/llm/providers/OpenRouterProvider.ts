import { LLMMessage, LLMProvider, LLMResponse, LLMToolCall, LLMToolDefinition } from '../types';

export class OpenRouterProvider implements LLMProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateCompletion(
    messages: LLMMessage[],
    tools?: LLMToolDefinition[],
    systemInstruction?: string,
    modelName: string = 'meta-llama/llama-3.3-70b-instruct:free'
  ): Promise<LLMResponse> {
    const msgs: any[] = [];

    if (systemInstruction) {
      msgs.push({ role: 'system', content: systemInstruction });
    }

    for (const m of messages.filter(m => m.role !== 'system')) {
      msgs.push({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content || ''
      });
    }

    const body: any = {
      model: modelName,
      max_tokens: 1000,
      messages: msgs,
    };

    if (tools && tools.length > 0) {
      body.tools = tools.map(t => ({
        type: 'function',
        function: {
          name: t.function.name,
          description: t.function.description,
          parameters: t.function.parameters
        }
      }));
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://nassersari150-del.github.io',
        'X-Title': 'Republique IA'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    const choice = data.choices?.[0];
    const msg = choice?.message;

    let toolCalls: LLMToolCall[] = [];
    if (msg?.tool_calls) {
      toolCalls = msg.tool_calls.map((tc: any) => ({
        id: tc.id,
        type: 'function',
        function: {
          name: tc.function.name,
          arguments: tc.function.arguments
        }
      }));
    }

    return {
      content: msg?.content || null,
      tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      } : undefined,
      finishReason: choice?.finish_reason,
      raw: data,
      request: body
    };
  }

  async generateImage(): Promise<{ data: string; usage?: any }> {
    return { data: '' };
  }

  async generateAudio(): Promise<{ data: string; usage?: any }> {
    return { data: '' };
  }

  async generateVideo(): Promise<{ videoUrl: string; usage?: any }> {
    return { videoUrl: '' };
  }
}
