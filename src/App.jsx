import React, { useState } from 'react';
import Frontend from './Frontend';
import Admin    from './Admin';

export default function App() {
  const [view, setView] = useState('frontend');

  return (
    <>
      {view === 'frontend' && <Frontend onEnterAdmin={() => setView('admin')} />}
      {view === 'admin'    && <Admin    onBack={() => setView('frontend')} />}
    </>
  );
}
