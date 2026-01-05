import React, { useRef, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import styles from '../styles/TextInput.module.css';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  onSend,
  placeholder = 'Message ARB...',
  disabled = false,
  maxLength = 4000,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  return (
    <div className={styles.textInputContainer}>
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={styles.textInput}
          rows={1}
        />
        <button
          type='button'
          onClick={handleSend}
          className={styles.sendButton}
          disabled={!value.trim() || disabled}
        >
          <Send fill='white' size={28} />
        </button>
      </div>
      <div className={styles.characterCount}>
        {value.length}/{maxLength}
      </div>
    </div>
  );
};

export default TextInput;
