import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, updateEvent } from '../../store';
import { Event, Character } from '../../types';
import { imageService } from '../../services/api';
import { resizeImageToSquare, isSquareImage, getImageDimensions } from '../../utils/imageUtils';

interface CharacterSettingsProps {
  event: Event;
}

const CharacterSettings: React.FC<CharacterSettingsProps> = ({ event }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.currentEvent);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [warnings, setWarnings] = useState<{ [key: string]: string }>({});

  const handleCharacterImageUpload = async (characterId: string, file: File) => {
    setUploading(prev => ({ ...prev, [characterId]: true }));
    setWarnings(prev => ({ ...prev, [characterId]: '' }));
    
    try {
      // 画像のサイズをチェック
      const dimensions = await getImageDimensions(file);
      const isSquare = await isSquareImage(file);
      
      let processedFile = file;
      let warningMessage = '';
      
      if (!isSquare) {
        warningMessage = `画像が正方形ではありません（${dimensions.width}×${dimensions.height}）。正方形にリサイズされます。`;
        processedFile = await resizeImageToSquare(file, 256);
      }
      
      if (warningMessage) {
        setWarnings(prev => ({ ...prev, [characterId]: warningMessage }));
      }
      
      const result = await imageService.uploadImage(processedFile);
      const updatedCharacters = event.characters.map(char =>
        char.id === characterId ? { ...char, imageUrl: result.url } : char
      );
      
      await dispatch(updateEvent({
        id: event.id,
        eventData: { characters: updatedCharacters }
      }));
    } catch (error) {
      console.error('Failed to upload character image:', error);
      setWarnings(prev => ({ ...prev, [characterId]: '画像のアップロードに失敗しました。' }));
    } finally {
      setUploading(prev => ({ ...prev, [characterId]: false }));
    }
  };

  const handleCharacterNameChange = async (characterId: string, name: string) => {
    const updatedCharacters = event.characters.map(char =>
      char.id === characterId ? { ...char, name } : char
    );
    
    await dispatch(updateEvent({
      id: event.id,
      eventData: { characters: updatedCharacters }
    }));
  };

  const handleCharacterPositionChange = async (characterId: string, position: 'left' | 'right' | 'center') => {
    const updatedCharacters = event.characters.map(char =>
      char.id === characterId ? { ...char, position } : char
    );
    
    await dispatch(updateEvent({
      id: event.id,
      eventData: { characters: updatedCharacters }
    }));
  };

  const addCharacter = async () => {
    const newCharacter: Character = {
      id: `char_${Date.now()}`,
      name: '新しいキャラクター',
      imageUrl: '', // 空文字列のまま（データベースでNULL許可に変更済み）
      position: 'left'
    };
    
    const updatedCharacters = [...event.characters, newCharacter];
    try {
      await dispatch(updateEvent({
        id: event.id,
        eventData: { characters: updatedCharacters }
      }));
    } catch (error) {
      console.error('Failed to add character:', error);
      // エラー時の処理を追加
    }
  };

  const removeCharacter = async (characterId: string) => {
    const updatedCharacters = event.characters.filter(char => char.id !== characterId);
    await dispatch(updateEvent({
      id: event.id,
      eventData: { characters: updatedCharacters }
    }));
  };

  const handleBackgroundImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, 'background': true }));
    try {
      const result = await imageService.uploadImage(file);
      await dispatch(updateEvent({
        id: event.id,
        eventData: { backgroundImageId: result.id }
      }));
    } catch (error) {
      console.error('Failed to upload background image:', error);
    } finally {
      setUploading(prev => ({ ...prev, 'background': false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* 背景画像設定 */}
      <div className="powerproke-card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          背景画像設定
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              画像ファイル
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundImageUpload}
              disabled={uploading['background'] || loading}
              className="powerproke-input w-full"
            />
            {uploading['background'] && (
              <p className="text-sm text-blue-600 mt-1">アップロード中...</p>
            )}
          </div>

          {event.backgroundImage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                現在の背景画像
              </label>
              <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                <img
                  src={event.backgroundImage}
                  alt="背景画像"
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* キャラクター一覧 */}
      <div className="powerproke-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            キャラクター設定 ({event.characters.length}体)
          </h2>
          <button
            onClick={addCharacter}
            disabled={loading}
            className="powerproke-button"
          >
            キャラクター追加
          </button>
        </div>

        <div className="space-y-4">
          {event.characters.map((character) => (
            <div key={character.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* キャラクター画像 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    キャラクター画像
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCharacterImageUpload(character.id, file);
                      }}
                      disabled={uploading[character.id] || loading}
                      className="powerproke-input w-full"
                    />
                    {uploading[character.id] && (
                      <p className="text-sm text-blue-600">アップロード中...</p>
                    )}
                    {warnings[character.id] && (
                      <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
                        {warnings[character.id]}
                      </p>
                    )}
                    {character.imageUrl && (
                      <div className="border-2 border-gray-300 rounded-lg p-2 bg-white">
                        <img
                          src={character.imageUrl}
                          alt={character.name}
                          className="w-full h-24 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* キャラクター名 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    キャラクター名
                  </label>
                  <input
                    type="text"
                    value={character.name}
                    onChange={(e) => handleCharacterNameChange(character.id, e.target.value)}
                    disabled={loading}
                    className="powerproke-input w-full"
                  />
                </div>

                {/* 位置設定 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    表示位置
                  </label>
                  <select
                    value={character.position}
                    onChange={(e) => handleCharacterPositionChange(character.id, e.target.value as 'left' | 'right' | 'center')}
                    disabled={loading}
                    className="powerproke-input w-full"
                  >
                    <option value="left">左側</option>
                    <option value="right">右側</option>
                    <option value="center">中央</option>
                  </select>
                  
                  <button
                    onClick={() => removeCharacter(character.id)}
                    disabled={loading}
                    className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          ))}

          {event.characters.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>キャラクターが登録されていません</p>
              <p className="text-sm">「キャラクター追加」ボタンで追加してください</p>
            </div>
          )}
        </div>
      </div>

      {/* 統合プレビュー */}
      <div className="powerproke-card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          背景画像・キャラクター配置プレビュー
        </h2>
        <div className="border-2 border-gray-300 rounded-lg p-4 h-64 relative overflow-hidden">
          {/* 背景画像 */}
          {event.backgroundImage ? (
            <img
              src={event.backgroundImage}
              alt="背景画像プレビュー"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-green-200 to-blue-300" />
          )}
          
          {/* オーバーレイ */}
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          
          {/* キャラクター配置 */}
          <div className="absolute inset-0 flex items-center justify-between px-8">
            {/* 左側キャラクター */}
            <div className="flex flex-col items-center">
              {event.characters.filter(char => char.position === 'left').map(char => (
                <div key={char.id} className="mb-2">
                  {char.imageUrl ? (
                    <img
                      src={char.imageUrl}
                      alt={char.name}
                      className="w-16 h-16 object-cover rounded border-2 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-300 rounded border-2 border-white flex items-center justify-center text-xs text-gray-600 shadow-lg">
                      {char.name}
                    </div>
                  )}
                  <p className="text-xs text-center mt-1 text-white font-semibold drop-shadow-lg">{char.name}</p>
                </div>
              ))}
            </div>

            {/* 中央キャラクター */}
            <div className="flex flex-col items-center">
              {event.characters.filter(char => char.position === 'center').map(char => (
                <div key={char.id} className="mb-2">
                  {char.imageUrl ? (
                    <img
                      src={char.imageUrl}
                      alt={char.name}
                      className="w-20 h-20 object-cover rounded border-2 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-300 rounded border-2 border-white flex items-center justify-center text-xs text-gray-600 shadow-lg">
                      {char.name}
                    </div>
                  )}
                  <p className="text-xs text-center mt-1 text-white font-semibold drop-shadow-lg">{char.name}</p>
                </div>
              ))}
            </div>

            {/* 右側キャラクター */}
            <div className="flex flex-col items-center">
              {event.characters.filter(char => char.position === 'right').map(char => (
                <div key={char.id} className="mb-2">
                  {char.imageUrl ? (
                    <img
                      src={char.imageUrl}
                      alt={char.name}
                      className="w-16 h-16 object-cover rounded border-2 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-300 rounded border-2 border-white flex items-center justify-center text-xs text-gray-600 shadow-lg">
                      {char.name}
                    </div>
                  )}
                  <p className="text-xs text-center mt-1 text-white font-semibold drop-shadow-lg">{char.name}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* プレビュー説明 */}
          <div className="absolute bottom-2 left-2 right-2 text-center">
            <p className="text-xs text-white font-semibold drop-shadow-lg bg-black bg-opacity-30 px-2 py-1 rounded">
              実際のゲーム画面での表示イメージ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSettings;
