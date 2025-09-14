import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, updateEvent } from '../../store';
import { Event } from '../../types';
import { imageService } from '../../services/api';

interface ImageSettingsProps {
  event: Event;
}

const ImageSettings: React.FC<ImageSettingsProps> = ({ event }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.currentEvent);
  const [uploading, setUploading] = useState(false);

  const handleBackgroundImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await imageService.uploadImage(file);
      await dispatch(updateEvent({
        id: event.id,
        eventData: { backgroundImageId: result.id }
      }));
    } catch (error) {
      console.error('Failed to upload background image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 背景画像設定 */}
      <div className="powerproke-card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          背景画像
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
              disabled={uploading || loading}
              className="powerproke-input w-full"
            />
            {uploading && (
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

      {/* 背景画像プレビュー */}
      {event.backgroundImage && (
        <div className="powerproke-card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            背景画像プレビュー
          </h2>
          <div className="border-2 border-gray-300 rounded-lg p-4 bg-gradient-to-b from-green-200 to-blue-300 h-48 relative overflow-hidden">
            <img
              src={event.backgroundImage}
              alt="背景画像プレビュー"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="text-white text-center">
                <p className="text-lg font-semibold">背景画像プレビュー</p>
                <p className="text-sm">実際のゲーム画面での表示イメージ</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* プレビュー */}
      <div className="powerproke-card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          プレビュー
        </h2>
        <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="text-center text-gray-500">
            <p>プレビュー機能は</p>
            <p>将来実装予定です</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSettings;
