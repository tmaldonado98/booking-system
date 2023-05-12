import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ChakraProvider } from '@chakra-ui/react'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import Footer from './Footer';

window.scrollTo({
  top: 0,
  behavior: "smooth"
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<ChakraProvider>
  
      <React.StrictMode>
        <App />
        <Footer/>
      </React.StrictMode>
  
</ChakraProvider>
);