// src/app/page.js

'use client';

import { useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('Off');

  const handleControl = async (action) => {
    try {
      const response = await fetch(`/api/control?action=${action}`);
      const data = await response.json();
      setStatus(action === 'on' ? 'On' : 'Off');
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Pump Control</h1>
      <p>Status: {status}</p>
      <div>
        <button onClick={() => handleControl('on')}>Turn On</button>
        <button onClick={() => handleControl('off')}>Turn Off</button>
        <button onClick={() => handleControl('manual')}>Manual</button>
        <button onClick={() => handleControl('auto')}>Auto</button>
      </div>
    </div>
  );
}
