import './App.css'
import { Routes, Route, Navigate } from 'react-router';
import Dashboard from './pages/Dashboard';
import VisitDetail from './pages/VisitDetail';


function App() {
  
  return (
    <>
      <header>
        <h1>Vera</h1>
      </header>

      <section>
        <Routes>
          <Route path='/' element={<Navigate to='/dashboard' replace />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/visits/:visitId' element={<VisitDetail />} />
        </Routes>
      </section>
    </>
  )
}

export default App
