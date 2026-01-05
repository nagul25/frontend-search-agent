import { Paperclip, Send } from 'lucide-react';
import styles from '../styles/ChatTextInput.module.css';

type ChatTextInputProps = {
  inputValue: string;
  onSend: () => void;
  onChange: (value: string) => void;
  toggleFileUpload?: () => void;
  isLoading?: boolean;
  showUploadIcon?: boolean;
};

function ChatTextInput(props: ChatTextInputProps) {
  const {
    inputValue,
    toggleFileUpload,
    isLoading,
    showUploadIcon = true,
    onSend,
    onChange,
  } = props;

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSend();
    }
  };

  return (
    <div className={styles.inputWrapper}>
      {showUploadIcon && toggleFileUpload ? (
        <button
          type='button'
          onClick={toggleFileUpload}
          disabled={isLoading}
          className={`${styles.attachButton} ${showUploadIcon ? styles.active : ''}`}
        >
          <Paperclip fill='#295dc7' size={28} />
        </button>
      ) : null}

      <textarea
        placeholder='Type a message...'
        value={inputValue}
        rows={4}
        className={styles.textInput}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type='button'
        onClick={handleSend}
        className={styles.sendButton}
        disabled={!inputValue.trim() || isLoading}
      >
        <Send stroke='white' size={28} />
      </button>
    </div>
  );
}

export default ChatTextInput;
