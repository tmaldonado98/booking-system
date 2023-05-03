import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Main from './Main';
import { ChakraProvider } from '@chakra-ui/react'
import 'bootstrap/dist/css/bootstrap.min.css';
// import dotenv from 'dotenv';
// dotenv.config();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<ChakraProvider>
  
      <React.StrictMode>
        <Main />
      </React.StrictMode>
  
</ChakraProvider>
);