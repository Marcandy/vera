import './App.css'
import { Routes, Route, Navigate } from 'react-router';
import Visits from './pages/Visits';
import VisitDetail from './pages/VisitDetail';
import Layout from './components/Layout';
import Billing from './pages/Billing';
import Caregivers from './pages/Caregivers';
import NotFound from './pages/NotFound';
import CaregiverVisit from './pages/CaregiverVisit';
import Homepage from './pages/Homepage';
import About from './pages/About';
import MyVisits from './pages/MyVisits';


function App() {
  
  return (
      <Routes>
            <Route path="/" element={<Homepage />} />
            <Route element={<Layout />}>
                {/* the overview replaces this redirect in the next commit */}
                <Route path="/dashboard" element={<Navigate to="/visits" replace />} />
                <Route path="/visits" element={<Visits />} />
                <Route path="/my-visits" element={<MyVisits />} />
                <Route path="/visits/:visitId" element={<VisitDetail />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/caregivers" element={<Caregivers />} />
                <Route path="/caregiver/visits/:visitId" element={<CaregiverVisit />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
            </Route>
      </Routes>
  )
}

export default App
