import React, { useRef, useState } from 'react';
import { Upload, X, File, Image, FileText } from 'lucide-react';
import { type UploadedFile } from '../types';
import styles from '../styles/FileUpload.module.css';

interface FileUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  onToggleFileDrop?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  maxFiles = 10,
  maxFileSize = 10,
  acceptedTypes = [
    'image/*',
    'text/*',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  onToggleFileDrop,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={16} />;
    if (type.includes('pdf') || type.includes('document')) return <FileText size={16} />;
    return <File size={16} />;
  };

  const handleFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles: UploadedFile[] = [];
    const errors: string[] = [];

    fileArray.forEach((file) => {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        errors.push(`${file.name} is too large. Maximum size is ${maxFileSize}MB.`);
        return;
      }

      // Check file type
      const isValidType = acceptedTypes.some((type) => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (!isValidType) {
        errors.push(`${file.name} has an unsupported file type.`);
        return;
      }

      // Check total files limit
      if (files.length + validFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed.`);
        return;
      }

      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      };

      validFiles.push(uploadedFile);
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileId: string) => {
    onFilesChange(files.filter((file) => file.id !== fileId));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.fileUploadContainer}>
      <div
        className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <button className={styles.closeButton} onClick={onToggleFileDrop}>
          <X stroke='#334155' />
        </button>
        <input
          ref={fileInputRef}
          type='file'
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className={styles.hiddenInput}
        />

        <div className={styles.dropZoneContent}>
          <Upload size={24} className={styles.uploadIcon} />
          <p className={styles.dropZoneText}>
            Drag and drop files here, or{' '}
            <button type='button' onClick={openFileDialog} className={styles.browseButton}>
              browse
            </button>
          </p>
          <p className={styles.dropZoneSubtext}>
            Supports images, documents, and text files (max {maxFileSize}MB each, up to {maxFiles}{' '}
            files)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className={styles.fileList}>
          <h4 className={styles.fileListTitle}>Attached Files ({files.length})</h4>
          <div className={styles.files}>
            {files.map((file) => (
              <div key={file.id} className={styles.fileItem}>
                <div className={styles.fileInfo}>
                  <div className={styles.fileIcon}>{getFileIcon(file.type)}</div>
                  <div className={styles.fileDetails}>
                    <span className={styles.fileName}>{file.name}</span>
                    <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                  </div>
                </div>
                <button
                  type='button'
                  onClick={() => removeFile(file.id)}
                  className={styles.removeButton}
                >
                  <X size={16} stroke='red' />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
