import './App.css'
import { Routes, Route } from 'react-router';
import Dashboard from './pages/Dashboard';
import VisitDetail from './pages/VisitDetail';
import Layout from './components/Layout';
import Billing from './pages/Billing';
import Caregivers from './pages/Caregivers';
import NotFound from './pages/NotFound';
import CaregiverVisit from './pages/CaregiverVisit';
import Homepage from './pages/Homepage';


function App() {
  
  return (
      <Routes>
            <Route path="/" element={<Homepage />} />
            <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/visits/:visitId" element={<VisitDetail />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/caregivers" element={<Caregivers />} />
                <Route path="/caregiver/visits/:visitId" element={<CaregiverVisit />} />
                <Route path="*" element={<NotFound />} />
            </Route>
      </Routes>
  )
}

export default App
