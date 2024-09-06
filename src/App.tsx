
import React from 'react';
import './App.css'
import Test from './components/Fetch';

import {QueryClientProvider,QueryClient} from 'react-query'
function App() {
  
  const queryClient = new QueryClient;
  return (
    <QueryClientProvider client={queryClient}>
          <Test/> 
    </QueryClientProvider>
  
    
  )
}

export default App
