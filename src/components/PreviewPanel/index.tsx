import React from 'react';
import { Event } from '../../types';

interface PreviewPanelProps {
  event: Event;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ event }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="powerproke-card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          パワポケ風プレビュー
        </h2>
        
        {/* パワポケ風画面のレイアウト */}
        <div className="bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg overflow-hidden">
          {/* 上部ステータスバー */}
          <div className="bg-blue-300 px-4 py-2 text-sm font-game">
            <div className="flex justify-between items-center">
              <span>1年目 6月3週 平日</span>
              <div className="flex space-x-4">
                <span>やる気: 😊</span>
                <span>体力: ❤️❤️❤️❤️❤️</span>
                <span>タフ: 💚💚</span>
              </div>
            </div>
          </div>

          {/* メイン表示エリア */}
          <div className="relative h-64 bg-gradient-to-b from-green-200 to-blue-300">
            {/* 背景画像 */}
            {event.backgroundImage && (
              <img
                src={event.backgroundImage}
                alt="背景"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            
            {/* キャラクター表示エリア（将来実装） */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-600 text-center">
                <p className="text-lg font-game">キャラクター表示エリア</p>
                <p className="text-sm">（将来実装予定）</p>
              </div>
            </div>
          </div>

          {/* テキストボックス */}
          <div className="bg-white border-4 border-purple-500 p-4">
            {event.texts.length > 0 ? (
              <div className="space-y-2">
                {event.texts.map((text, index) => (
                  <div key={text.id} className="font-game text-lg">
                    <span className="text-gray-500 text-sm">#{index + 1}</span>
                    <p className="text-gray-800">{text.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 font-game text-lg">
                テキストがありません
              </p>
            )}
          </div>
        </div>

        {/* イベント情報 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="powerproke-card">
            <h3 className="font-semibold text-gray-800 mb-2">基本情報</h3>
            <p className="text-sm text-gray-600">タイトル: {event.title}</p>
            {event.description && (
              <p className="text-sm text-gray-600">説明: {event.description}</p>
            )}
          </div>
          
          <div className="powerproke-card">
            <h3 className="font-semibold text-gray-800 mb-2">統計</h3>
            <p className="text-sm text-gray-600">テキスト数: {event.texts.length}</p>
            <p className="text-sm text-gray-600">キャラクター数: {event.characters.length}</p>
          </div>
          
          <div className="powerproke-card">
            <h3 className="font-semibold text-gray-800 mb-2">更新情報</h3>
            <p className="text-sm text-gray-600">
              作成: {new Date(event.createdAt).toLocaleDateString('ja-JP')}
            </p>
            <p className="text-sm text-gray-600">
              更新: {new Date(event.updatedAt).toLocaleDateString('ja-JP')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
