import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import TextInput from '../components/TextEditor/TextInput';

// テスト用のストアを作成
const createTestStore = () => {
  return configureStore({
    reducer: {
      events: (state = { list: [], loading: false, error: null }) => state,
      currentEvent: (state = { event: null, loading: false, error: null }) => state,
      ui: (state = { sidebarOpen: true, previewMode: false, dragIndex: null }) => state,
    },
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

describe('TextInput', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test('renders input field and submit button', () => {
    render(
      <TestWrapper>
        <TextInput onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('テキストを入力してください...')).toBeInTheDocument();
    expect(screen.getByText('追加')).toBeInTheDocument();
    expect(screen.getByText('Enter: 追加, Shift+Enter: 改行')).toBeInTheDocument();
  });

  test('calls onSubmit when form is submitted with text', () => {
    render(
      <TestWrapper>
        <TextInput onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('テキストを入力してください...');
    const submitButton = screen.getByText('追加');

    fireEvent.change(input, { target: { value: 'テストテキスト' } });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('テストテキスト');
  });

  test('calls onSubmit when Enter key is pressed', () => {
    render(
      <TestWrapper>
        <TextInput onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('テキストを入力してください...');

    fireEvent.change(input, { target: { value: 'テストテキスト' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnSubmit).toHaveBeenCalledWith('テストテキスト');
  });

  test('does not call onSubmit when Shift+Enter is pressed', () => {
    render(
      <TestWrapper>
        <TextInput onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('テキストを入力してください...');

    fireEvent.change(input, { target: { value: 'テストテキスト' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('clears input after successful submission', () => {
    render(
      <TestWrapper>
        <TextInput onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('テキストを入力してください...');
    const submitButton = screen.getByText('追加');

    fireEvent.change(input, { target: { value: 'テストテキスト' } });
    fireEvent.click(submitButton);

    expect(input).toHaveValue('');
  });

  test('submit button is disabled when input is empty', () => {
    render(
      <TestWrapper>
        <TextInput onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    const submitButton = screen.getByText('追加');
    expect(submitButton).toBeDisabled();
  });

  test('submit button is enabled when input has text', () => {
    render(
      <TestWrapper>
        <TextInput onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('テキストを入力してください...');
    const submitButton = screen.getByText('追加');

    fireEvent.change(input, { target: { value: 'テストテキスト' } });

    expect(submitButton).not.toBeDisabled();
  });
});
