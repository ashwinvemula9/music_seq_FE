import React from 'react';
import { Sequencer } from './components/Sequencer';
import { Info } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4 mb-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Collaborative Music Sequencer
        </h1>
      </header>
      <div className='flex gap-2 justify-center items-center'>
        <div className='flex' >
        <Info size={24} /> 
        <p className='mx-2' >My render free instance will spin down with inactivity, which can delay requests by 1 to 2 mins or more.</p>
        </div>
      </div>
      <Sequencer />
    </div>
  );
}

export default App;