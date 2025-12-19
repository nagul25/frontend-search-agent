import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Paperclip } from 'lucide-react';
import FileUpload from './FileUpload';
import type { Message, UploadedFile } from '../types';
import { chatService } from '../services/api';
import { ChatTextInput } from '../molecules';
import styles from '../styles/ChatInterface.module.css';
import AssistantMarkdownMessage from '../molecules/AssistantMarkdown';

const AssessmentBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setUploadedFiles([]);
    setShowFileUpload(false);
    setIsLoading(true);

    try {
      const {message, assessment} = await chatService.validateAssessment({
        message: inputValue,
        files: uploadedFiles.map(file => file.file),
      });
      console.log("Chat Response: ", message);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assessment || message || "No response from assistant.",
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleFileUpload = () => {
    setShowFileUpload(!showFileUpload);
    setUploadedFiles([]);
  };

  return (
    <div className={styles.chatInterface}>
      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.welcomeMessage}>
            <Bot size={48} className={styles.welcomeIcon} />
            <h2>Welcome to Triple A Assessment Assistant</h2>
            <p>Start a conversation by typing your message below. You can also upload files to get help with documents, images, or other content.</p>
          </div>
        ) : (
          <div className={styles.messages}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${styles[message.role]}`}
              >
                <div className={styles.messageAvatar}>
                  {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={styles.messageContent}>
                  <div className={`${styles.textLayer}`}>
                    <div className={`${styles.messageText}`}>
                      <div className={styles.textMessageWrapper}>
                        {message.role === 'assistant' 
                          ? <AssistantMarkdownMessage content={message.content} />
                          : message.content
                        }
                      </div>
                    </div>
                  </div>
                  <div className={styles.messageExtras}>
                    {message.files && message.files.length > 0 && (
                      <div className={styles.messageFiles}>
                        <Paperclip size={16} />
                        <span>{message.files.length} file(s) attached</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.messageTimestamp}>
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={styles.messageAvatar}>
                  <Bot size={20} />
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        {showFileUpload && (
          <div className={styles.fileUploadSection}>
            <FileUpload
              files={uploadedFiles}
              onFilesChange={setUploadedFiles}
              onToggleFileDrop={toggleFileUpload}
            />
          </div>
        )}
        <ChatTextInput inputValue={inputValue} onChange={setInputValue} onSend={handleSendMessage} toggleFileUpload={toggleFileUpload} />
      </div>
    </div>
  );
};

export default AssessmentBot;
