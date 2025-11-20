export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING', // Reading file
  PROCESSING = 'PROCESSING', // Sending to Gemini
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export enum ConversionMode {
  PRESERVE_LAYOUT = 'PRESERVE_LAYOUT', // الاحتفاظ بالتنسيق
  OPTIMIZE_EDITING = 'OPTIMIZE_EDITING', // تحسين قابلية التحرير
  TEXT_ONLY = 'TEXT_ONLY' // استخراج النص فقط
}

export interface ConversionResult {
  fileName: string;
  content: string; // HTML content string
}

export interface FileData {
  name: string;
  type: string;
  size: number;
  base64: string;
}