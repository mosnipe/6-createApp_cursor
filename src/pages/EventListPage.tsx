import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch, fetchEvents, createEvent } from '../store';
import { Event } from '../types';

const EventListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { list: events, loading, error } = useSelector((state: RootState) => state.events);
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    try {
      const result = await dispatch(createEvent({
        title: newEventTitle,
        description: newEventDescription,
      }));
      
      if (createEvent.fulfilled.match(result)) {
        // フォームをリセット
        setNewEventTitle('');
        setNewEventDescription('');
        setShowNewEventForm(false);
        // 直接編集画面に遷移
        navigate(`/events/${result.payload.id}/edit`);
      }
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleQuickCreate = async () => {
    try {
      const result = await dispatch(createEvent({
        title: '',
        description: '',
      }));
      
      if (createEvent.fulfilled.match(result)) {
        // 直接編集画面に遷移
        navigate(`/events/${result.payload.id}/edit`);
      }
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleEditEvent = (eventId: string) => {
    navigate(`/events/${eventId}/edit`);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 font-game">
            イベント一覧
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={handleQuickCreate}
              className="powerproke-button bg-green-600 hover:bg-green-700"
            >
              クイック作成
            </button>
            <button
              onClick={() => setShowNewEventForm(true)}
              className="powerproke-button"
            >
              詳細作成
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showNewEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">新規イベント作成</h2>
              <form onSubmit={handleCreateEvent}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    タイトル
                  </label>
                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="powerproke-input w-full"
                    placeholder="イベントタイトルを入力"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    説明
                  </label>
                  <textarea
                    value={newEventDescription}
                    onChange={(e) => setNewEventDescription(e.target.value)}
                    className="powerproke-input w-full h-20 resize-none"
                    placeholder="イベントの説明（任意）"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="powerproke-button flex-1"
                  >
                    作成
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewEventForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex-1"
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event: Event) => (
            <div
              key={event.id}
              className="powerproke-card cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleEditEvent(event.id)}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {event.title}
              </h3>
              {event.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {event.description}
                </p>
              )}
              <div className="text-xs text-gray-500">
                <p>作成: {formatDate(event.createdAt)}</p>
                <p>更新: {formatDate(event.updatedAt)}</p>
                <p>テキスト数: {event.texts.length}</p>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">イベントがありません</p>
            <p className="text-gray-400 text-sm mt-2">
              新規作成ボタンから最初のイベントを作成してください
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventListPage;
