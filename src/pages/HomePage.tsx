import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleNewEvent = () => {
    navigate('/event-edit');
  };

  const handleEditEvent = () => {
    navigate('/event-list');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-powerproke-blue to-powerproke-purple flex items-center justify-center pt-20">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 font-game">
            パワポケ風
          </h1>
          <h2 className="text-2xl font-semibold text-gray-600 mb-8">
            テキストノベルエディター
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={handleNewEvent}
              className="w-full powerproke-button text-lg py-3"
            >
              新規イベント作成
            </button>
            
            <button
              onClick={handleEditEvent}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded transition-colors duration-200 text-lg"
            >
              既存イベント編集
            </button>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>パワポケのようなテキストノベルイベントを</p>
            <p>簡単に作成・編集できます</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
