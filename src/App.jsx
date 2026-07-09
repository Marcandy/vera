import './App.css'
import { Routes, Route, Navigate } from 'react-router';
import Dashboard from './pages/Dashboard';
import VisitDetail from './pages/VisitDetail';
import Layout from './components/Layout';


function App() {
  
  return (
      <Routes>
          <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/visits/:visitId" element={<VisitDetail />} />
          </Route>
      </Routes>
  )
}

export default App
