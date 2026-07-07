// import { useState } from 'react'
import './App.css'

import StatusPill from './components/StatusPill'

function App() {

  return (
    <>
      <header>
        <h2>Vera</h2>
        <StatusPill status="needs review" />
        <StatusPill status="ready to bill" />
      </header>
    </>
  )
}

export default App
