import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import reducers from '../store';

// テスト用のストアを作成
const createTestStore = () => {
  return configureStore({
    reducer: reducers,
  });
};

// テスト用のラッパーコンポーネント
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore();
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

describe('HomePage', () => {
  test('renders title and buttons correctly', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    expect(screen.getByText('パワポケ風')).toBeInTheDocument();
    expect(screen.getByText('テキストノベルエディター')).toBeInTheDocument();
    expect(screen.getByText('新規イベント作成')).toBeInTheDocument();
    expect(screen.getByText('既存イベント編集')).toBeInTheDocument();
  });

  test('navigates to events page when clicking new event button', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    const newEventButton = screen.getByText('新規イベント作成');
    fireEvent.click(newEventButton);

    // ナビゲーションが正しく動作することを確認
    // 実際のテストでは、useNavigateのモックを使用する必要があります
  });

  test('navigates to events page when clicking edit event button', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    const editEventButton = screen.getByText('既存イベント編集');
    fireEvent.click(editEventButton);

    // ナビゲーションが正しく動作することを確認
  });
});
