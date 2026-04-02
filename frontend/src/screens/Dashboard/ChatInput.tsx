import React, { RefObject } from 'react';
import { COLORS } from '../../utils/constants';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  onVoiceRecording: () => void;
  onFileMenuToggle: () => void;
  showFileMenu: boolean;
  isRecording: boolean;
  recordingDuration: number;
  onStopRecording: () => void;
  imageInputRef: RefObject<HTMLInputElement>;
  fileInputRef: RefObject<HTMLInputElement>;
  videoInputRef?: RefObject<HTMLInputElement>;
  onImageSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  onVoiceRecording,
  onFileMenuToggle,
  showFileMenu,
  isRecording,
  recordingDuration,
  onStopRecording,
  imageInputRef,
  fileInputRef,
  videoInputRef,
  onImageSelect,
  onFileSelect,
  onVideoSelect,
  placeholder = 'Escribe un mensaje...'
}) => {
  const formatTime = (seconds: number) => 
    `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div style={{ 
      padding: 15, 
      background: COLORS.gray800, 
      borderTop: `1px solid ${COLORS.gray700}`, 
      display: 'flex', 
      alignItems: 'center', 
      gap: 10 
    }}>
      {isRecording ? (
        <>
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10, 
            background: COLORS.red + '30', 
            padding: '8px 15px', 
            borderRadius: 20 
          }}>
            <button 
              onClick={onStopRecording} 
              style={{ 
                width: 30, 
                height: 30, 
                borderRadius: '50%', 
                background: COLORS.red, 
                border: 'none', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <i className="fas fa-stop" style={{ color: 'white', fontSize: 12 }} />
            </button>
            <span style={{ color: COLORS.red, fontFamily: 'monospace', fontSize: 14 }}>
              {formatTime(recordingDuration)}
            </span>
          </div>
          <span style={{ fontSize: 11, color: COLORS.gray400 }}>Grabando</span>
        </>
      ) : (
        <>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder={placeholder}
            style={{ 
              flex: 1, 
              padding: 12, 
              borderRadius: 25, 
              border: 'none', 
              outline: 'none', 
              background: COLORS.gray700, 
              color: 'white' 
            }}
          />
          <div style={{ position: 'relative' }}>
            <button 
              onClick={onFileMenuToggle} 
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                background: COLORS.gray600, 
                border: 'none', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <i className="fas fa-paperclip" style={{ color: 'white' }} />
            </button>
            {showFileMenu && (
              <div style={{ 
                position: 'absolute', 
                bottom: 50, 
                right: 0, 
                background: COLORS.gray700, 
                borderRadius: 10, 
                padding: 10, 
                display: 'flex', 
                gap: 5, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                zIndex: 100 
              }}>
                <input 
                  ref={imageInputRef} 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={onImageSelect} 
                />
                <button 
                  onClick={() => imageInputRef.current?.click()} 
                  title="Imagen" 
                  style={{ 
                    width: 35, 
                    height: 35, 
                    borderRadius: 8, 
                    background: COLORS.purple, 
                    border: 'none', 
                    cursor: 'pointer' 
                  }}
                >
                  <i className="fas fa-image" style={{ color: 'white' }} />
                </button>
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  style={{ display: 'none' }} 
                  onChange={onFileSelect} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  title="Archivo" 
                  style={{ 
                    width: 35, 
                    height: 35, 
                    borderRadius: 8, 
                    background: COLORS.blue, 
                    border: 'none', 
                    cursor: 'pointer' 
                  }}
                >
                  <i className="fas fa-file" style={{ color: 'white' }} />
                </button>
                <input 
                  ref={videoInputRef} 
                  type="file" 
                  accept="video/*" 
                  style={{ display: 'none' }} 
                  onChange={onVideoSelect} 
                />
                <button 
                  onClick={() => videoInputRef?.current?.click()} 
                  title="Video" 
                  style={{ 
                    width: 35, 
                    height: 35, 
                    borderRadius: 8, 
                    background: COLORS.red, 
                    border: 'none', 
                    cursor: 'pointer' 
                  }}
                >
                  <i className="fas fa-video" style={{ color: 'white' }} />
                </button>
                <button 
                  onClick={onVoiceRecording} 
                  title="Audio" 
                  style={{ 
                    width: 35, 
                    height: 35, 
                    borderRadius: 8, 
                    background: COLORS.green, 
                    border: 'none', 
                    cursor: 'pointer' 
                  }}
                >
                  <i className="fas fa-microphone" style={{ color: 'white' }} />
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={onSend} 
            style={{ 
              width: 45, 
              height: 45, 
              borderRadius: '50%', 
              background: COLORS.primary, 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <i className="fas fa-paper-plane" style={{ color: 'white' }} />
          </button>
        </>
      )}
    </div>
  );
};

export default ChatInput;