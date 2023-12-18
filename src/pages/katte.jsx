/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CardHeader, CardContent, Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
    selectedItem.date = new Date().toISOString();
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
    <main className="flex flex-col md:flex-row justify-center items-start gap-6 md:gap-12 p-4 md:p-8">
    <aside className="order-2 md:order-1 w-full md:w-1/3">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-bold">Prize List</h2>
        </CardHeader>
        <CardContent className="divide-y divide-gray-200 dark:divide-gray-800">
    
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {data.removed.length > 0 && (
            <>
          {data.removed.map((item, index) => (
            <li key={index} className="py-4">
              <div className="flex items-center gap-4">
                <Badge className="text-xs" color="green" variant="solid">
                  {index + 1}
                </Badge>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.option}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.description}
                    </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.date && new Date(item.date).toLocaleString()}
                    </p>
                </div>
              </div>
            </li>
          ))}
          </>

    )}
          </ul>
        </CardContent>
      </Card>
    </aside>
    <div className="order-1 md:order-2 flex flex-col items-center w-full md:w-2/3 mb-20">
      <h1 className="text-5xl font-extrabold mb-6 text-center bg-clip-text">
        Spin the Wheel!
      </h1>
      <Button
      onClick={() => handleSpinClick()}
        className="mb-6 py-3 px-8 rounded-full shadow-lg text-lg font-semibold hover:bg-indigo-700 transition-colors duration-300"
        color="indigo"
        size="large"
        variant="solid"
      >
        Spin Now!
      </Button>
      <div className="rounded-full mt-6">
        {data.remaining?.length > 0 ? (
        <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                spinDuration={1}
                data={data.remaining}
                onStopSpinning={onStopSpinning}
              />
        ):
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">All prizes have been claimed!</h2>
          <p className="text-gray-500 dark:text-gray-400">Please check back later.</p>
        </div>
          }
      </div>  
    </div>
  </main>
  
  );
}

