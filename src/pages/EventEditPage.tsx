import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, fetchEvent, updateEvent, setPreviewMode } from '../store';
import TextEditor from '../components/TextEditor';
import CharacterSettings from '../components/CharacterSettings';
import HeaderSettingsComponent from '../components/HeaderSettings';
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
  const [activeTab, setActiveTab] = useState<'text' | 'characters' | 'header'>('text');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  const handleSaveStoryEvent = async () => {
    if (!event) return;

    // タイトル未入力チェック
    if (!title.trim()) {
      setSaveMessage({
        type: 'error',
        message: 'イベントタイトルを入力してください。'
      });
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      // 全ての変更を保存
      await dispatch(updateEvent({
        id: event.id,
        eventData: {
          title: title.trim(),
          description: event.description,
          background_image_id: event.backgroundImage,
          headerSettings: event.headerSettings,
          characters: event.characters
        }
      }));

      setHasUnsavedChanges(false);
      setSaveMessage({
        type: 'success',
        message: 'ストーリーイベントが正常に保存されました！'
      });

      // 3秒後にメッセージを消す
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);

    } catch (error) {
      console.error('Failed to save story event:', error);
      setSaveMessage({
        type: 'error',
        message: '保存に失敗しました。もう一度お試しください。'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinishEditing = async () => {
    // タイトル未入力チェック
    if (!title.trim()) {
      setSaveMessage({
        type: 'error',
        message: 'イベントタイトルを入力してください。'
      });
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
      return;
    }

    await handleSaveStoryEvent();
    
    // 保存完了後、イベント一覧に戻る
    setTimeout(() => {
      navigate('/events');
    }, 2000);
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
              
              <button
                onClick={handleSaveStoryEvent}
                disabled={isSaving || loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? '保存中...' : '保存'}
              </button>
              
              <button
                onClick={handleFinishEditing}
                disabled={isSaving || loading}
                className="px-6 py-2 bg-powerproke-blue text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {isSaving ? '完了中...' : '完了'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-6">
        {/* 保存メッセージ */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            saveMessage.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            <div className="flex items-center">
              <span className="mr-2">
                {saveMessage.type === 'success' ? '✅' : '❌'}
              </span>
              <span className="font-medium">{saveMessage.message}</span>
            </div>
          </div>
        )}

        {previewMode ? (
          <PreviewPanel event={event} />
        ) : (
          <div className="space-y-6">
            {/* タブナビゲーション */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('text')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'text'
                      ? 'text-powerproke-blue border-b-2 border-powerproke-blue bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📝 ストーリーテキスト
                </button>
                <button
                  onClick={() => setActiveTab('characters')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'characters'
                      ? 'text-powerproke-blue border-b-2 border-powerproke-blue bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  👥 キャラクター設定
                </button>
                <button
                  onClick={() => setActiveTab('header')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'header'
                      ? 'text-powerproke-blue border-b-2 border-powerproke-blue bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📊 ヘッダー設定
                </button>
              </div>
            </div>

            {/* タブコンテンツ */}
            <div className="min-h-[600px]">
              {activeTab === 'text' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <TextEditor event={event} />
                  </div>
                  <div className="lg:col-span-1">
                    <div className="powerproke-card">
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        テキスト統計
                      </h2>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">総テキスト数: {event.texts.length}</p>
                        <p className="text-sm text-gray-600">総文字数: {event.texts.reduce((sum, text) => sum + text.content.length, 0)}</p>
                        <p className="text-sm text-gray-600">平均文字数: {event.texts.length > 0 ? Math.round(event.texts.reduce((sum, text) => sum + text.content.length, 0) / event.texts.length) : 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}


              {activeTab === 'characters' && (
                <CharacterSettings event={event} />
              )}

              {activeTab === 'header' && (
                <HeaderSettingsComponent event={event} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventEditPage;
