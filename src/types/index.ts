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

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
