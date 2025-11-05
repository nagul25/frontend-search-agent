export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  files?: UploadedFile[];
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

export interface ChatRequest {
  message: string;
  files?: File[];
}

export interface ChatResponse {
  message: string;
  status: "success" | "error";
  error?: string;
}

export type QueryRequestResponseType = {
  message: string;
  rag_response?: {
    question: string;
    answer: string;
    metadata?: Record<string, unknown>;
    sources?: Array<Record<string, unknown>>;
  };
  upload_info?: {
    message: string;
    uploaded_files: Array<Record<string, unknown>>;
  };
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
