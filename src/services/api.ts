import axios from "axios";
import type { ChatRequest, ChatResponse, ApiResponse } from "../types";

// Vite only exposes env vars that start with VITE_
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const chatService = {
  async sendMessage(request: ChatRequest): Promise<ApiResponse<ChatResponse>> {
    const formData = new FormData();
    console.log("ChatRequest: ", request);
    formData.append("query", request.message);

    if (request.files && request.files.length > 0) {
      request.files.forEach((file) => {
        formData.append(`files`, file);
      });
    }
    console.log("FormData: ", formData.values());

    try {
      const response = await apiClient.post("/query", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Prompt Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  async sendPrompt(
    payload: Record<string, unknown>
  ): Promise<ApiResponse<unknown>> {
    try {
      const response = await apiClient.post("/query", payload);
      return response.data as ApiResponse<unknown>;
    } catch (error) {
      console.error("Error sending prompt:", error);
      throw error;
    }
  },
};

export const healthCheck = async (): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.get("/health");
    return response;
  } catch (error) {
    console.error("Error performing health check:", error);
    throw error;
  }
};

export default apiClient;
