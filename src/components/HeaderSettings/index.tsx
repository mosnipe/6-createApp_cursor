import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, updateEvent } from '../../store';
import { Event, HeaderSettings, CustomGauge } from '../../types';

interface HeaderSettingsProps {
  event: Event;
}

const HeaderSettingsComponent: React.FC<HeaderSettingsProps> = ({ event }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.currentEvent);
  const [settings, setSettings] = useState<HeaderSettings>(
    event.headerSettings || {
      year: 1,
      month: 6,
      week: 3,
      dayType: 'weekday',
      stats: {
        motivation: { value: 3, max: 5, icon: '😊' },
        stamina: { value: 5, max: 5, icon: '❤️' },
        toughness: { value: 2, max: 5, icon: '💚' }
      },
      customGauges: []
    }
  );

  const handleSettingsChange = (newSettings: HeaderSettings) => {
    setSettings(newSettings);
    dispatch(updateEvent({
      id: event.id,
      eventData: { headerSettings: newSettings }
    }));
  };

  const handleStatChange = (statName: keyof typeof settings.stats, field: 'value' | 'max' | 'icon', value: string | number) => {
    const newSettings = {
      ...settings,
      stats: {
        ...settings.stats,
        [statName]: {
          ...settings.stats[statName],
          [field]: value
        }
      }
    };
    handleSettingsChange(newSettings);
  };

  const handleGameInfoChange = (field: keyof Pick<HeaderSettings, 'year' | 'month' | 'week' | 'dayType'>, value: string | number) => {
    const newSettings = {
      ...settings,
      [field]: value
    };
    handleSettingsChange(newSettings);
  };

  const addCustomGauge = () => {
    const newGauge: CustomGauge = {
      id: `gauge_${Date.now()}`,
      name: '新しいゲージ',
      value: 0,
      max: 100,
      color: '#3B82F6',
      icon: '📊'
    };
    
    const newSettings = {
      ...settings,
      customGauges: [...settings.customGauges, newGauge]
    };
    handleSettingsChange(newSettings);
  };

  const updateCustomGauge = (gaugeId: string, field: keyof CustomGauge, value: string | number) => {
    const newSettings = {
      ...settings,
      customGauges: settings.customGauges.map(gauge =>
        gauge.id === gaugeId ? { ...gauge, [field]: value } : gauge
      )
    };
    handleSettingsChange(newSettings);
  };

  const removeCustomGauge = (gaugeId: string) => {
    const newSettings = {
      ...settings,
      customGauges: settings.customGauges.filter(gauge => gauge.id !== gaugeId)
    };
    handleSettingsChange(newSettings);
  };

  const renderGaugeBar = (value: number, max: number, color: string) => {
    const percentage = Math.min((value / max) * 100, 100);
    return (
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="h-4 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ゲーム情報設定 */}
      <div className="powerproke-card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          ゲーム情報設定
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              年
            </label>
            <input
              type="number"
              value={settings.year}
              onChange={(e) => handleGameInfoChange('year', parseInt(e.target.value) || 1)}
              disabled={loading}
              className="powerproke-input w-full"
              min="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              月
            </label>
            <input
              type="number"
              value={settings.month}
              onChange={(e) => handleGameInfoChange('month', parseInt(e.target.value) || 1)}
              disabled={loading}
              className="powerproke-input w-full"
              min="1"
              max="12"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              週
            </label>
            <input
              type="number"
              value={settings.week}
              onChange={(e) => handleGameInfoChange('week', parseInt(e.target.value) || 1)}
              disabled={loading}
              className="powerproke-input w-full"
              min="1"
              max="4"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              曜日タイプ
            </label>
            <select
              value={settings.dayType}
              onChange={(e) => handleGameInfoChange('dayType', e.target.value as 'weekday' | 'weekend' | 'holiday')}
              disabled={loading}
              className="powerproke-input w-full"
            >
              <option value="weekday">平日</option>
              <option value="weekend">週末</option>
              <option value="holiday">祝日</option>
            </select>
          </div>
        </div>
      </div>

      {/* 基本ステータス設定 */}
      <div className="powerproke-card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          基本ステータス設定
        </h2>
        
        <div className="space-y-4">
          {Object.entries(settings.stats).map(([statName, stat]) => (
            <div key={statName} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ステータス名
                  </label>
                  <input
                    type="text"
                    value={statName === 'motivation' ? 'やる気' : statName === 'stamina' ? '体力' : 'タフ'}
                    disabled
                    className="powerproke-input w-full bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    アイコン
                  </label>
                  <input
                    type="text"
                    value={stat.icon}
                    onChange={(e) => handleStatChange(statName as keyof typeof settings.stats, 'icon', e.target.value)}
                    disabled={loading}
                    className="powerproke-input w-full"
                    maxLength={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    現在値
                  </label>
                  <input
                    type="number"
                    value={stat.value}
                    onChange={(e) => handleStatChange(statName as keyof typeof settings.stats, 'value', parseInt(e.target.value) || 0)}
                    disabled={loading}
                    className="powerproke-input w-full"
                    min="0"
                    max={stat.max}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最大値
                  </label>
                  <input
                    type="number"
                    value={stat.max}
                    onChange={(e) => handleStatChange(statName as keyof typeof settings.stats, 'max', parseInt(e.target.value) || 1)}
                    disabled={loading}
                    className="powerproke-input w-full"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm text-gray-600">{stat.icon}</span>
                  <span className="text-sm text-gray-600">{stat.value}/{stat.max}</span>
                </div>
                {renderGaugeBar(stat.value, stat.max, statName === 'motivation' ? '#F59E0B' : statName === 'stamina' ? '#EF4444' : '#10B981')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* カスタムゲージ設定 */}
      <div className="powerproke-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            カスタムゲージ設定 ({settings.customGauges.length}個)
          </h2>
          <button
            onClick={addCustomGauge}
            disabled={loading}
            className="powerproke-button"
          >
            ゲージ追加
          </button>
        </div>
        
        <div className="space-y-4">
          {settings.customGauges.map((gauge) => (
            <div key={gauge.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ゲージ名
                  </label>
                  <input
                    type="text"
                    value={gauge.name}
                    onChange={(e) => updateCustomGauge(gauge.id, 'name', e.target.value)}
                    disabled={loading}
                    className="powerproke-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    アイコン
                  </label>
                  <input
                    type="text"
                    value={gauge.icon || ''}
                    onChange={(e) => updateCustomGauge(gauge.id, 'icon', e.target.value)}
                    disabled={loading}
                    className="powerproke-input w-full"
                    maxLength={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    現在値
                  </label>
                  <input
                    type="number"
                    value={gauge.value}
                    onChange={(e) => updateCustomGauge(gauge.id, 'value', parseInt(e.target.value) || 0)}
                    disabled={loading}
                    className="powerproke-input w-full"
                    min="0"
                    max={gauge.max}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最大値
                  </label>
                  <input
                    type="number"
                    value={gauge.max}
                    onChange={(e) => updateCustomGauge(gauge.id, 'max', parseInt(e.target.value) || 1)}
                    disabled={loading}
                    className="powerproke-input w-full"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    色
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={gauge.color}
                      onChange={(e) => updateCustomGauge(gauge.id, 'color', e.target.value)}
                      disabled={loading}
                      className="w-full h-10 border border-gray-300 rounded"
                    />
                    <button
                      onClick={() => removeCustomGauge(gauge.id)}
                      disabled={loading}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm text-gray-600">{gauge.icon}</span>
                  <span className="text-sm text-gray-600">{gauge.name}: {gauge.value}/{gauge.max}</span>
                </div>
                {renderGaugeBar(gauge.value, gauge.max, gauge.color)}
              </div>
            </div>
          ))}
          
          {settings.customGauges.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>カスタムゲージが登録されていません</p>
              <p className="text-sm">「ゲージ追加」ボタンで追加してください</p>
            </div>
          )}
        </div>
      </div>

      {/* ヘッダープレビュー */}
      <div className="powerproke-card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          ヘッダープレビュー
        </h2>
        
        <div className="bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg overflow-hidden">
          {/* パワポケ風ヘッダー */}
          <div className="bg-blue-300 px-4 py-2 text-sm font-game">
            <div className="flex justify-between items-center">
              <span>
                {settings.year}年目 {settings.month}月{settings.week}週 {
                  settings.dayType === 'weekday' ? '平日' : 
                  settings.dayType === 'weekend' ? '週末' : '祝日'
                }
              </span>
              <div className="flex space-x-4">
                {Object.entries(settings.stats).map(([statName, stat]) => (
                  <span key={statName}>
                    {statName === 'motivation' ? 'やる気' : statName === 'stamina' ? '体力' : 'タフ'}: {stat.icon.repeat(stat.value)}
                  </span>
                ))}
                {settings.customGauges.map((gauge) => (
                  <span key={gauge.id}>
                    {gauge.name}: {gauge.icon}{gauge.value}/{gauge.max}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSettingsComponent;
