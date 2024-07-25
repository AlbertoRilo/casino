import Image from "next/image";
import CasinoForm from './CasinoForm';
import Tabs from "./Tabs";


export default function Home() {
  return (
  
   
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-7xl font-bold text-gray-800 mb-8">Project Spark Database</h1>
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-md p-8">
        <Tabs />
      </div>
    </div>
  );

  
}
