import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, fetchEvent, updateEvent, setPreviewMode } from '../store';
import TextEditor from '../components/TextEditor';
import ImageSettings from '../components/ImageSettings';
import PreviewPanel from '../components/PreviewPanel';

const EventEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { event, loading, error } = useSelector((state: RootState) => state.currentEvent);
  const { previewMode } = useSelector((state: RootState) => state.ui);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchEvent(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
    }
  }, [event]);

  const handleSaveTitle = async () => {
    if (!event || !title.trim()) return;

    try {
      await dispatch(updateEvent({
        id: event.id,
        eventData: { title: title.trim() }
      }));
      setIsEditingTitle(false);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to update title:', error);
    }
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setTitle(event?.title || '');
      setIsEditingTitle(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHasUnsavedChanges(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-powerproke-blue mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">エラーが発生しました</p>
          <button
            onClick={() => navigate('/events')}
            className="powerproke-button"
          >
            イベント一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/events')}
                className="text-gray-600 hover:text-gray-800"
              >
                ← 戻る
              </button>
              
              {isEditingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  onKeyDown={handleTitleKeyPress}
                  onBlur={handleSaveTitle}
                  className="text-xl font-semibold bg-transparent border-b-2 border-powerproke-blue focus:outline-none"
                  autoFocus
                />
              ) : (
                <h1
                  className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-powerproke-blue"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {event.title}
                </h1>
              )}
              
              {hasUnsavedChanges && (
                <span className="text-orange-500 text-sm">未保存</span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => dispatch(setPreviewMode(!previewMode))}
                className={`px-4 py-2 rounded ${
                  previewMode 
                    ? 'bg-powerproke-purple text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {previewMode ? '編集モード' : 'プレビュー'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-6">
        {previewMode ? (
          <PreviewPanel event={event} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左側: テキストエディター */}
            <div className="lg:col-span-2">
              <TextEditor event={event} />
            </div>
            
            {/* 右側: 画像設定 */}
            <div className="lg:col-span-1">
              <ImageSettings event={event} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventEditPage;
