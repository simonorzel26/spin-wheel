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
import Link from 'next/link';

// Dynamically import the Wheel component with SSR disabled
const Wheel = dynamic(() => import('react-custom-roulette').then((mod) => mod.Wheel), { ssr: false });

export default function Home(props) {
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
          {data.removed.length > 0 && (
    <Card className="w-full mb-10">
      <CardHeader>
        <h2 className="text-2xl font-bold">Dinners already chosen:</h2>
      </CardHeader>
      <CardContent className="divide-y divide-gray-200 dark:divide-gray-800">
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            <>
              {data.removed.map((date, index) => (
                <li key={index} className="py-4">
                  <div className="flex items-center gap-4">
                    <Badge className="text-xs" color="rose" variant="solid">
                      {index + 1}
                    </Badge>
                    <div className="flex-1">
                      <h3 className="font-semibold">{date.option}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {date.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {date.date && new Date(date.date).toLocaleString()}
                      </p>
                      {date.link && (
                      <Link className="text-sm text-gray-500 dark:text-gray-400" href={date.link}>{date.link}</Link>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </>
        </ul>
      </CardContent>
    </Card>
          )}

    {data.remaining.length > 0 && (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-2xl font-bold">Available dinners:</h2>
      </CardHeader>
      <CardContent className="divide-y divide-gray-200 dark:divide-gray-800">
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            <>
              {data.remaining.map((date, index) => (
                <li key={index} className="py-4">
                  <div className="flex items-center gap-4">
                    <Badge className="text-xs" color="rose" variant="solid">
                      {index + 1}
                    </Badge>
                    <div className="flex-1">
                      <h3 className="font-semibold">{date.option}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {date.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {date.date && new Date(date.date).toLocaleString()}
                      </p>
                      {date.link && (
                      <Link className="text-sm text-gray-500 dark:text-gray-400" href={date.link}>{date.link}</Link>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </>
        </ul>
      </CardContent>
    </Card>
          )}
  </aside>

  <div className="order-1 md:order-2 flex flex-col items-center w-full md:w-2/3 mb-20">
    <h1 className="text-5xl font-extrabold mb-6 text-center bg-clip-text">
      Date night menu Gewinnspiel for KSP
    </h1>
    <Button
      onClick={() => handleSpinClick()}
      className="mb-6 py-3 px-8 rounded-full shadow-lg text-lg font-semibold bg-slate-300 hover:bg-slate-400 transition-colors duration-300"
      color="rose"
      size="large"
      variant="solid"
    >
      Good luck baby :D
    </Button>
    <div className="rounded-full mt-6 opacity-90">
      {data.remaining?.length > 0 ? (
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          spinDuration={1}
          data={data.remaining}
          onStopSpinning={onStopSpinning}
          outerBorderWidth={2}
          innerBorderWidth={2}
          radiusLineColor="transparent"
        />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">All Dates are Planned!</h2>
          <p className="text-gray-500 dark:text-gray-400">Hope you are excited for our upcoming adventures!</p>
        </div>
      )}
    </div>  
  </div>
</main>

  
  );
}


export async function getStaticProps(context) {
  // Fetch data at build time
  return { props: { /* your props here */ } };
}
