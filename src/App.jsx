import './App.css'

import StatusPill from './components/StatusPill';
import VisitCard from './components/VisitCard';

function App() {
  const visit = {
    patientName: 'John Pirate',
    scheduledAt: "July 8, 9:30am",
    caregiverName: "Marcus",
    status: "complete"
  }
  return (
    <>
      <header>
        <h2>Vera</h2>
      </header>

      <section>
        <VisitCard visit={visit}/>

        <StatusPill status="needs review" />
      </section>
    </>
  )
}

export default App
