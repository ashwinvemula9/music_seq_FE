import React from 'react';
import { Sequencer } from './components/Sequencer';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4 mb-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Collaborative Music Sequencer
        </h1>
      </header>
      <Sequencer />
    </div>
  );
}

export default App;