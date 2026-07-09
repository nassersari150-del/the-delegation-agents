import { LLMMessage, LLMProvider, LLMResponse, LLMToolCall, LLMToolDefinition } from '../types';

export class ClaudeProvider implements LLMProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateCompletion(
    messages: LLMMessage[],
    tools?: LLMToolDefinition[],
    systemInstruction?: string,
    modelName: string = 'claude-sonnet-4-6'
  ): Promise<LLMResponse> {
    const claudeMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content || ''
      }));

    const body: any = {
      model: modelName,
      max_tokens: 1000,
      messages: claudeMessages,
    };

    if (systemInstruction) {
      body.system = systemInstruction;
    }

    if (tools && tools.length > 0) {
      body.tools = tools.map(t => ({
        name: t.function.name,
        description: t.function.description,
        input_schema: t.function.parameters
      }));
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    let contentStr: string | null = null;
    let toolCalls: LLMToolCall[] = [];

    for (const block of data.content || []) {
      if (block.type === 'text') {
        contentStr = (contentStr || '') + block.text;
      }
      if (block.type === 'tool_use') {
        toolCalls.push({
          id: block.id,
          type: 'function',
          function: {
            name: block.name,
            arguments: JSON.stringify(block.input)
          }
        });
      }
    }

    return {
      content: contentStr,
      tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
      usage: data.usage ? {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens
      } : undefined,
      finishReason: data.stop_reason,
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
