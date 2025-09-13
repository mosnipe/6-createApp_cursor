import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTitleClick = () => {
    navigate('/');
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-gradient-to-r from-powerproke-blue to-powerproke-purple shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 
            className="text-2xl font-bold text-white font-game cursor-pointer hover:text-yellow-200 transition-colors duration-200"
            onClick={handleTitleClick}
          >
            パワポケ風テキストノベルエディター
          </h1>
          
          {!isHomePage && (
            <nav className="flex space-x-4">
              <button
                onClick={() => navigate('/events')}
                className="text-white hover:text-yellow-200 transition-colors duration-200 font-semibold"
              >
                イベント一覧
              </button>
              <button
                onClick={() => navigate('/')}
                className="text-white hover:text-yellow-200 transition-colors duration-200 font-semibold"
              >
                ホーム
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;
