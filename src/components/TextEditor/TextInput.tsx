import React, { useState } from 'react';

interface TextInputProps {
  onSubmit: (content: string) => void;
  disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ onSubmit, disabled = false }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !disabled) {
      onSubmit(content);
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="テキストを入力してください..."
          className="powerproke-input w-full h-24 resize-none"
          disabled={disabled}
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Enter: 追加, Shift+Enter: 改行
          </span>
          <button
            type="submit"
            disabled={!content.trim() || disabled}
            className="powerproke-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            追加
          </button>
        </div>
      </div>
    </form>
  );
};

export default TextInput;
