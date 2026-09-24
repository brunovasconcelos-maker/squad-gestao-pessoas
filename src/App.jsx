import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import { ToastProvider } from './components/toast/ToastContext.jsx'

function App() {
  return (
    <ToastProvider>
      <HashRouter>
        <Routes>
          <Route path="/*" element={<Home />} />
        </Routes>
      </HashRouter>
    </ToastProvider>
  )
}

export default App
