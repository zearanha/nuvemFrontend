import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Main from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react'

createRoot(document.getElementById('root')!).render(
  <ChakraProvider>
    <StrictMode>
      <Main />
    </StrictMode>
  </ChakraProvider>,
)
