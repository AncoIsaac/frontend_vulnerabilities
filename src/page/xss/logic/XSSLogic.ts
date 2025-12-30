import { useState } from 'react';
import type { PayloadHistory } from '../interface/PayloadHistory';

const XSSLogic = () => {
  const [message, setMessage] = useState<string>('');
  const [payloadHistory, setPayloadHistory] = useState<PayloadHistory[]>([]);
  const [isSafeMode, setIsSafeMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSend = (): void => {
    if (!message.trim()) return;

    setIsLoading(true);

    // Simular procesamiento
    setTimeout(() => {
      const newPayload: PayloadHistory = {
        payload: message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        safeMode: isSafeMode,
      };

      setPayloadHistory((prev) => [newPayload, ...prev.slice(0, 4)]);
      setIsLoading(false);
    }, 300);
  };
  const clearHistory = (): void => {
    setPayloadHistory([]);
    setMessage('');
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSend();
    }
  };

  const handleExampleClick = (payload: string): void => {
    setMessage(payload);
  };

  const sanitizeHTML = (html: string): string => {
    // Esta es una sanitización básica - NO usar en producción
    // En una app real, usar DOMPurify o similar
    return html
      .replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        '[Script removido]'
      )
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/on\w+='[^']*'/g, '')
      .replace(/javascript:/gi, 'blocked:')
      .replace(/data:/gi, 'blocked:')
      .replace(/vbscript:/gi, 'blocked:');
  };
  return {
    message,
    payloadHistory,
    isSafeMode,
    isLoading,
    setIsSafeMode,
    setPayloadHistory,
    setMessage,
    handleSend,
    clearHistory,
    handleKeyPress,
    handleExampleClick,
    sanitizeHTML,
  };
};

export default XSSLogic;
