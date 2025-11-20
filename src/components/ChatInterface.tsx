import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Paperclip } from 'lucide-react';
import FileUpload from './FileUpload';
import type { Message, UploadedFile } from '../types';
import { chatService } from '../services/api';
import styles from '../styles/ChatInterface.module.css';
import { ChatTextInput } from '../molecules';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showMoreAnswer, setShowMoreAnswer] = useState(false);
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
      const response = await chatService.sendMessage({
        message: inputValue,
        files: uploadedFiles.map(file => file.file),
      });
      console.log("Chat Response: ", response.rag_response?.answer);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.rag_response?.answer || "No response from assistant.",
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

  const formatMessageContent = (content: string): JSX.Element => {
    // Split content into paragraphs
    const paragraphs = content.split(/\n\n+/g);
    
    return (
      <>
        {paragraphs.map((paragraph, index) => {
          const text = paragraph.trim();
          
          // Check if this is a tool entry (starts with "- " and contains multiple " - " separators)
          if (text.startsWith('- ') && text.split(' - ').length > 3) {
            // Split tool attributes by " - "
            const parts = text.split(' - ');
            const firstPart = parts[0].substring(2); // Remove "- " prefix
            
            // Extract just the tool name (before parentheses if present)
            let toolName = firstPart;
            const manufacturerMatch = firstPart.match(/^(.+?)\s*\((.+?)\)$/);
            
            const allAttributes = [];
            
            if (manufacturerMatch) {
              // Tool name without manufacturer
              toolName = manufacturerMatch[1].trim();
              // Add manufacturer as first attribute
              allAttributes.push(`Manufacturer: ${manufacturerMatch[2]}`);
            }
            
            // Add all other attributes
            allAttributes.push(...parts.slice(1).map(attr => attr.trim()));
            
            return (
              <div key={index} className={styles.toolEntry}>
                <div className={styles.toolName}>{toolName}</div>
                <div className={styles.toolAttributes}>
                  {allAttributes.map((attr, attrIndex) => (
                    <div key={attrIndex} className={styles.toolAttribute}>
                      {attr}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          
          // Regular paragraph - check for sentence splits
          const sentences = text.split(/\. (?=[A-Z])/g);
          
          if (sentences.length > 1) {
            return (
              <p key={index} className={styles.messageParagraph}>
                {sentences.map((sentence, sentIndex) => {
                  const trimmedSentence = sentence.trim();
                  const needsPeriod = !trimmedSentence.match(/[.!?]$/);
                  return (
                    <span key={sentIndex}>
                      {trimmedSentence}{needsPeriod ? '.' : ''}{sentIndex < sentences.length - 1 ? ' ' : ''}
                    </span>
                  );
                })}
              </p>
            );
          }
          
          return (
            <p key={index} className={styles.messageParagraph}>
              {text}
            </p>
          );
        })}
      </>
    );
  };

  const toggleFileUpload = () => {
    setShowFileUpload(!showFileUpload);
    setUploadedFiles([]);
  };

  const toggleAnswerExpansion = () => {
    setShowMoreAnswer(!showMoreAnswer);
  }

  return (
    <div className={styles.chatInterface}>
      <div className={styles.chatHeader}>
        <h1 className={styles.chatTitle}>ARB Assistant</h1>
      </div>

      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.welcomeMessage}>
            <Bot size={48} className={styles.welcomeIcon} />
            <h2>Welcome to ARB Assistant</h2>
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
                    <div className={`${styles.messageText} ${showMoreAnswer ? styles.expanded : ''}`}>
                      <div className={styles.textMessageWrapper}>
                        {message.role === 'assistant' 
                          ? formatMessageContent(message.content)
                          : message.content
                        }
                      </div>
                    </div>
                  </div>
                  <div className={styles.messageExtras}>
                    {message.content.length > 300 && (
                      <span
                        className={styles.showMoreButton}
                        onClick={toggleAnswerExpansion}
                      >
                        {showMoreAnswer ? 'Show Less' : 'Show More'}
                      </span>
                    )}

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

        {/* <div className={styles.inputWrapper}> */}
        {/* <button
            type="button"
            onClick={toggleFileUpload}
            className={`${styles.attachButton} ${showFileUpload ? styles.active : ''}`}
            disabled={isLoading}
          >
            <Paperclip fill='#295dc7' size={28} />
          </button>

          <div className={styles.textInputWrapper}>
            <TextInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSendMessage}
              disabled={isLoading}
              placeholder="Message ARB..."
            />
          </div> */}
        <ChatTextInput inputValue={inputValue} onChange={setInputValue} onSend={handleSendMessage} toggleFileUpload={toggleFileUpload} />
        {/* </div> */}
      </div>
    </div>
  );
};

export default ChatInterface;
