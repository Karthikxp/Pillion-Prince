
import React, { useState } from 'react';
import BrandTile from './BrandTile';
import CarDetail from './CarDetail';
import { ArrowRight } from 'lucide-react';

const CarAssistant: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  
  const brands = ['BMW', 'PORSCHE', 'AUDI', 'BENZ', 'BUGATTI', 'OTHERS'];
  
  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
  };
  
  const handleBack = () => {
    setSelectedBrand(null);
  };
  
  return (
    <div className="relative flex flex-col h-full w-full bg-background overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20" 
          style={{ backgroundImage: "url('/car-silhouette.webp')" }}
        ></div>
        <div 
          className="absolute bottom-0 right-0 h-[70%] w-[50%] bg-contain bg-right-bottom bg-no-repeat"
          style={{ backgroundImage: "url('/girl-with-car.webp')", opacity: 0.25 }}
        ></div>
      </div>
      
      <header className="pt-10 pb-5 text-center z-10">
        <div className="flex items-center justify-center">
          <span className="inline-block w-12 h-[1px] bg-white/30"></span>
          <h1 className="text-4xl tracking-widest text-white/80 px-4">P I L L I O N &nbsp; P R I N C E</h1>
          <span className="inline-block w-12 h-[1px] bg-white/30"></span>
        </div>
        <p className="text-sm text-white/40 mt-2 tracking-wider">LUXURY PERFORMANCE VEHICLES</p>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        {!selectedBrand ? (
          <div className="w-full max-w-5xl mx-auto animate-fade-in">
            <h2 className="text-xl tracking-widest text-white/60 text-center mb-10">S e l e c t &nbsp; a &nbsp; b r a n d</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {brands.map((brand) => (
                <BrandTile 
                  key={brand} 
                  brand={brand} 
                  onClick={() => handleBrandSelect(brand)} 
                />
              ))}
            </div>
            
            <div className="mt-20 text-center">
              <p className="text-white/50 text-sm mb-4">Need help with your selection?</p>
              <button 
                className="glass-card bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full text-white/80 flex items-center mx-auto transition-all hover:transform hover:translate-x-1"
                onClick={() => handleBrandSelect('OTHERS')}
              >
                Speak to an advisor <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            <CarDetail brand={selectedBrand} onBack={handleBack} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CarAssistant;
