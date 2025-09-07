import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import reducers from './store';
import HomePage from './pages/HomePage';
import EventListPage from './pages/EventListPage';
import EventEditPage from './pages/EventEditPage';
import './index.css';

const store = configureStore({
  reducer: reducers,
});

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventListPage />} />
            <Route path="/events/:id/edit" element={<EventEditPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;