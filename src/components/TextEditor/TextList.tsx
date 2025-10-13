import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TextItem, Character } from '../../types';

interface TextListProps {
  texts: TextItem[];
  onUpdate: (id: string, content: string, characterId?: string) => void;
  onDelete: (id: string) => void;
  onReorder: (textIds: string[]) => void;
  disabled?: boolean;
  characters: Character[];
}

interface TextItemProps {
  text: TextItem;
  onUpdate: (id: string, content: string, characterId?: string) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
  characters: Character[];
}

const SortableTextItem: React.FC<TextItemProps> = ({ text, onUpdate, onDelete, disabled = false, characters }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(text.content);
  const [selectedCharacterId, setSelectedCharacterId] = useState(text.characterId || '');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: text.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (content.trim() && (content !== text.content || selectedCharacterId !== (text.characterId || ''))) {
      onUpdate(text.id, content, selectedCharacterId || undefined);
    } else {
      setContent(text.content);
      setSelectedCharacterId(text.characterId || '');
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(text.content);
    setSelectedCharacterId(text.characterId || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`powerproke-card ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div className="flex items-start space-x-3">
        {/* ドラッグハンドル */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="4" cy="4" r="1"/>
            <circle cx="12" cy="4" r="1"/>
            <circle cx="4" cy="8" r="1"/>
            <circle cx="12" cy="8" r="1"/>
            <circle cx="4" cy="12" r="1"/>
            <circle cx="12" cy="12" r="1"/>
          </svg>
        </div>

        {/* テキスト内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">
                #{text.order + 1}
              </span>
              {text.characterId && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {characters.find(c => c.id === text.characterId)?.name || '不明なキャラクター'}
                </span>
              )}
              {!text.characterId && (
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  システム
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                disabled={disabled}
                className="text-sm text-powerproke-blue hover:text-blue-600 disabled:opacity-50"
              >
                編集
              </button>
              <button
                onClick={() => onDelete(text.id)}
                disabled={disabled}
                className="text-sm text-red-500 hover:text-red-600 disabled:opacity-50"
              >
                削除
              </button>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-2">
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
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                className="powerproke-input w-full h-20 resize-none"
                autoFocus
                disabled={disabled}
              />
            </div>
          ) : (
            <p className="text-gray-800 whitespace-pre-wrap">{text.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const TextList: React.FC<TextListProps> = ({
  texts,
  onUpdate,
  onDelete,
  onReorder,
  disabled = false,
  characters,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = texts.findIndex((text) => text.id === active.id);
      const newIndex = texts.findIndex((text) => text.id === over.id);

      const newTexts = arrayMove(texts, oldIndex, newIndex);
      const textIds = newTexts.map((text) => text.id);
      onReorder(textIds);
    }
  };

  if (texts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>テキストがありません</p>
        <p className="text-sm mt-1">上の入力欄からテキストを追加してください</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={texts.map(text => text.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {texts.map((text) => (
            <SortableTextItem
              key={text.id}
              text={text}
              onUpdate={onUpdate}
              onDelete={onDelete}
              disabled={disabled}
              characters={characters}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default TextList;
