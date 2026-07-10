export const DEFAULT_MODELS = {
  text: 'meta-llama/llama-3.3-70b-instruct:free',
  image: 'gemini-3.1-flash-image-preview',
  music: 'lyria-3-clip-preview',
  video: 'veo-3.1-lite-generate-preview'
} as const;

export const AVAILABLE_MODELS = {
  text: [
    'meta-llama/llama-3.3-70b-instruct:free',
    'google/gemma-3-27b-it:free',
    'mistralai/mistral-7b-instruct:free',
    'deepseek/deepseek-r1:free'
  ],
  image: [
    'gemini-3.1-flash-image-preview',
  ],
  music: [
    'lyria-3-clip-preview',
  ],
  video: [
    'veo-3.1-lite-generate-preview',
  ]
} as const;

export type ModelType = keyof typeof AVAILABLE_MODELS;
