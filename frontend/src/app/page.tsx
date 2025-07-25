"use client";

import Image from "next/image";
import CountySearchForm from "./components/CountySearchForm";
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./components/Map'), {
  ssr: false,
});

export default function Home() {
  return (
      <div className="grid justify-center m-5">
          <h1 className="text-6xl font-semibold">RiskFactor</h1>
          <h2 className="text-2xl font-semibold mx-4 pt-2">How safe is my county?</h2>
          <Map />
          <CountySearchForm />
      </div>
  );
}
