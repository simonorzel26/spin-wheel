/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useState, useEffect } from 'react';
import Head from "next/head";
import dynamic from 'next/dynamic';

// Dynamically import the Wheel component with SSR disabled
const Wheel = dynamic(() => import('react-custom-roulette').then((mod) => mod.Wheel), { ssr: false });

export default function Home() {
  const [data, setData] = useState({remaining:[], removed:[]});
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  // Fetch initial data when the component mounts
  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        if (data && data.remaining && data.removed) {
          setData(data);
        }
      });
  }, []);

  const handleSpinClick = () => {
    if (!mustSpin && data.remaining && data.remaining.length > 0) {
      const newPrizeNumber = Math.floor(Math.random() * data.remaining.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const onStopSpinning = () => {
    setMustSpin(false);
    // TAke the prizeNumber and remove it from the remaining array
    const selectedItem = data.remaining[prizeNumber];
    const updatedCurrentData = data.remaining.filter((_, index) => index !== prizeNumber);
    const updatedRemovedItems = [...data.removed, selectedItem];
    const newData = { remaining: updatedCurrentData, removed: updatedRemovedItems};
  
    setData(newData);
  
    fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });
  };
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-blue-900">
    {data.remaining?.length > 0 && (
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 shadow-lg">
        <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            spinDuration={0.5}
            data={data.remaining}
            onStopSpinning={onStopSpinning}
          />
        <button onClick={() => handleSpinClick()} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">SPIN</button>
      </div>
    )}
    {data.removed.length > 0 && (
      <div className="removed-items-container flex flex-col md:flex-row-reverse md:justify-around w-full">
        <h2 className="text-lg font-bold text-purple-500">Removed Items:</h2>
        <ol className="list-decimal list-inside text-blue-300">
          {data.removed.map((item, index) => (
            <li key={index}>{item.option}</li>
          ))}
        </ol>
      </div>
    )}
  </main>
  
  );
}

