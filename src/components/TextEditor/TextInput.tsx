import React, { useState } from 'react';
import { Character } from '../../types';

interface TextInputProps {
  onSubmit: (content: string, characterId?: string) => void;
  disabled?: boolean;
  characters: Character[];
}

const TextInput: React.FC<TextInputProps> = ({ onSubmit, disabled = false, characters }) => {
  const [content, setContent] = useState('');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !disabled) {
      onSubmit(content, selectedCharacterId || undefined);
      setContent('');
      setSelectedCharacterId('');
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
        {/* キャラクター選択 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            発話者
          </label>
          <select
            value={selectedCharacterId}
            onChange={(e) => setSelectedCharacterId(e.target.value)}
            disabled={disabled}
            className="powerproke-input w-full"
          >
            <option value="">システム（ナレーション）</option>
            {characters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name}
              </option>
            ))}
          </select>
        </div>

        {/* テキスト入力 */}
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
