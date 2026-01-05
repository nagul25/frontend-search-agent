import axios from 'axios';
import type {
  ChatRequest,
  ApiResponse,
  QueryRequestResponseType,
  ValidateAssessmentResponseType,
} from '../types';

// Vite only exposes env vars that start with VITE_
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  timeout: 300000, // 5 minutes
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
  async sendMessage(request: ChatRequest): Promise<QueryRequestResponseType> {
    const formData = new FormData();
    formData.append('query', request.message);

    if (request.files && request.files.length > 0) {
      request.files.forEach((file) => {
        formData.append(`files`, file);
      });
    }

    try {
      const response = await apiClient.post('/query', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('API Response:', response.data.data);
      return response.data?.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async validateAssessment(request: ChatRequest): Promise<ValidateAssessmentResponseType> {
    const threadId = sessionStorage.getItem('threadId');
    const formData = new FormData();
    formData.append('prompt', request.message);
    console.log('thread id: ', threadId);
    if (threadId && threadId.length > 0 && threadId !== 'undefined') {
      formData.append('thread_id', threadId || '');
    }

    if (request.files && request.files.length > 0) {
      request.files.forEach((file) => {
        formData.append(`files`, file);
      });
    }
    console.log('form data: ', formData);
    try {
      delete apiClient.defaults.headers.post['Content-Type'];
      delete apiClient.defaults.headers.common['Content-Type'];

      const response = await apiClient.post('/analyse', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('API Response:', response.data.data);
      if (!threadId) {
        sessionStorage.setItem('threadId', response.data.data.thread_id);
      }
      return response.data?.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
};

export const healthCheck = async (): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.get('/health');
    return response;
  } catch (error) {
    console.error('Error performing health check:', error);
    throw error;
  }
};

export default apiClient;
