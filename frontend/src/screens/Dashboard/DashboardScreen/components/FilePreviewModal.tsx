import React from 'react';
import { COLORS } from '../../../../utils/constants';

interface FilePreviewModalProps {
  visible: boolean;
  file: File | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  visible,
  file,
  onConfirm,
  onCancel
}) => {
  if (!visible || !file) return null;

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isAudio = file.type.startsWith('audio/');
  const isDocument = !isImage && !isVideo && !isAudio;

  const getFileIcon = () => {
    if (isImage) return { icon: 'fa-image', color: COLORS.purple, label: 'Imagen' };
    if (isVideo) return { icon: 'fa-video', color: COLORS.red, label: 'Video' };
    if (isAudio) return { icon: 'fa-microphone', color: COLORS.green, label: 'Audio' };
    return { icon: 'fa-file', color: COLORS.blue, label: 'Archivo' };
  };

  const fileInfo = getFileIcon();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: COLORS.gray800,
        borderRadius: 16,
        padding: 20,
        maxWidth: 400,
        width: '90%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 20,
          color: COLORS.gray100,
          fontWeight: 600,
          fontSize: 16 
        }}>
          <i className={`fas ${fileInfo.icon}`} style={{ 
            color: fileInfo.color, 
            fontSize: 32,
            marginBottom: 10,
            display: 'block'
          }} />
          {fileInfo.label}
        </div>

        <div style={{
          background: COLORS.gray700,
          borderRadius: 12,
          padding: 15,
          marginBottom: 20,
          maxHeight: 250,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isImage && (
            <img 
              src={URL.createObjectURL(file)} 
              alt="preview"
              style={{ 
                maxWidth: '100%', 
                maxHeight: 220, 
                borderRadius: 8,
                objectFit: 'contain'
              }}
            />
          )}
          {isVideo && (
            <video 
              src={URL.createObjectURL(file)} 
              controls
              style={{ 
                maxWidth: '100%', 
                maxHeight: 220, 
                borderRadius: 8 
              }}
            />
          )}
          {isAudio && (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <i className="fas fa-music" style={{ fontSize: 48, color: COLORS.green }} />
              <div style={{ marginTop: 10, color: COLORS.gray300 }}>Audio listo</div>
            </div>
          )}
          {isDocument && (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <i className="fas fa-file-alt" style={{ fontSize: 48, color: COLORS.blue }} />
              <div style={{ marginTop: 10, color: COLORS.gray300, fontSize: 13 }}>
                {file.name.length > 30 ? file.name.slice(0, 30) + '...' : file.name}
              </div>
              <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 5 }}>
                {(file.size / 1024).toFixed(1)} KB
              </div>
            </div>
          )}
        </div>

        <div style={{ 
          fontSize: 12, 
          color: COLORS.gray400, 
          textAlign: 'center',
          marginBottom: 20,
          wordBreak: 'break-all'
        }}>
          {file.name}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={onCancel}
            style={{
              flex: 1,
              padding: 12,
              background: COLORS.gray600,
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14
            }}
          >
            <i className="fas fa-times" style={{ marginRight: 6 }} />
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: 12,
              background: COLORS.green,
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14
            }}
          >
            <i className="fas fa-paper-plane" style={{ marginRight: 6 }} />
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};