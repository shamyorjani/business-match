// resources/js/app.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routes';

// If you're using styles
import '../css/app.css';

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

if (document.getElementById('app')) {
  const root = ReactDOM.createRoot(document.getElementById('app'));
  root.render(<App />);
}
