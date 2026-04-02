import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  data: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && data) {
      QRCode.toCanvas(canvasRef.current, data, { width: 200, margin: 2 }, (error: Error | null | undefined) => {
        if (error) console.error('QR generation error:', error);
      });
    }
  }, [data]);

  return <canvas ref={canvasRef} />;
};

export default QRCodeGenerator;