import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
// import FeedbackForm from './FeedbackForm';
// import ProductExplorer from './ProductExplorer';
import Lab63App from './lab63/Lab63App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CssBaseline />
    {/* <FeedbackForm /> */}
    {/* <ProductExplorer /> */}
    <Lab63App />
  </React.StrictMode>,
);
