import React from 'react';
import type { Event } from '../../types';

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
              <span>
                {event.headerSettings?.year || 1}年目 {event.headerSettings?.month || 6}月{event.headerSettings?.week || 3}週 {
                  event.headerSettings?.dayType === 'weekday' ? '平日' : 
                  event.headerSettings?.dayType === 'weekend' ? '週末' : '祝日'
                }
              </span>
              <div className="flex space-x-4">
                {event.headerSettings?.stats && Object.entries(event.headerSettings.stats).map(([statName, stat]) => (
                  <span key={statName}>
                    {statName === 'motivation' ? 'やる気' : statName === 'stamina' ? '体力' : 'タフ'}: {stat.icon.repeat(stat.value)}
                  </span>
                ))}
                {event.headerSettings?.customGauges?.map((gauge) => (
                  <span key={gauge.id}>
                    {gauge.name}: {gauge.icon}{gauge.value}/{gauge.max}
                  </span>
                ))}
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
            
            {/* キャラクター表示エリア */}
            <div className="absolute inset-0 flex items-center justify-between px-8">
              {/* 左側キャラクター */}
              <div className="flex flex-col items-center">
                {event.characters.filter(char => char.position === 'left').map(char => (
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
                    <p className="text-xs text-center mt-1 text-white font-semibold bg-black bg-opacity-50 px-2 py-1 rounded">
                      {char.name}
                    </p>
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
                        className="w-24 h-24 object-cover rounded border-2 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-300 rounded border-2 border-white flex items-center justify-center text-xs text-gray-600 shadow-lg">
                        {char.name}
                      </div>
                    )}
                    <p className="text-xs text-center mt-1 text-white font-semibold bg-black bg-opacity-50 px-2 py-1 rounded">
                      {char.name}
                    </p>
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
                        className="w-20 h-20 object-cover rounded border-2 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-300 rounded border-2 border-white flex items-center justify-center text-xs text-gray-600 shadow-lg">
                        {char.name}
                      </div>
                    )}
                    <p className="text-xs text-center mt-1 text-white font-semibold bg-black bg-opacity-50 px-2 py-1 rounded">
                      {char.name}
                    </p>
                  </div>
                ))}
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
            <p className="text-sm text-gray-600">画像付きキャラクター: {event.characters.filter(char => char.imageUrl).length}</p>
            <p className="text-sm text-gray-600">カスタムゲージ数: {event.headerSettings?.customGauges?.length || 0}</p>
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
