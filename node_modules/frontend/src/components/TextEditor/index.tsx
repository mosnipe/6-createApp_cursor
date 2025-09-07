import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, createText, updateText, deleteText, reorderTexts } from '../store';
import { Event, TextItem } from '../types';
import TextList from './TextList';
import TextInput from './TextInput';

interface TextEditorProps {
  event: Event;
}

const TextEditor: React.FC<TextEditorProps> = ({ event }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.currentEvent);

  const handleCreateText = async (content: string) => {
    if (!content.trim()) return;

    try {
      await dispatch(createText({
        eventId: event.id,
        textData: {
          content: content.trim(),
          order: event.texts.length,
        }
      }));
    } catch (error) {
      console.error('Failed to create text:', error);
    }
  };

  const handleUpdateText = async (id: string, content: string) => {
    try {
      await dispatch(updateText({
        id,
        textData: { content: content.trim() }
      }));
    } catch (error) {
      console.error('Failed to update text:', error);
    }
  };

  const handleDeleteText = async (id: string) => {
    try {
      await dispatch(deleteText(id));
    } catch (error) {
      console.error('Failed to delete text:', error);
    }
  };

  const handleReorderTexts = async (textIds: string[]) => {
    try {
      await dispatch(reorderTexts(textIds));
    } catch (error) {
      console.error('Failed to reorder texts:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* テキスト入力エリア */}
      <div className="powerproke-card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          テキスト入力
        </h2>
        <TextInput
          onSubmit={handleCreateText}
          disabled={loading}
        />
      </div>

      {/* テキスト一覧 */}
      <div className="powerproke-card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          テキスト順序 ({event.texts.length}件)
        </h2>
        <TextList
          texts={event.texts}
          onUpdate={handleUpdateText}
          onDelete={handleDeleteText}
          onReorder={handleReorderTexts}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default TextEditor;
