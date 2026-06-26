import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SpinnerLab } from './components/SpinnerLab.tsx'

// Preview the spinner gallery at /?spinners (does not touch the main flow).
const showSpinners =
  typeof window !== 'undefined' &&
  (window.location.search.includes('spinners') ||
    window.location.hash.includes('spinners'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>{showSpinners ? <SpinnerLab /> : <App />}</StrictMode>,
)
