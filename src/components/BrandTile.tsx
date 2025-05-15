
import React from 'react';

interface BrandTileProps {
  brand: string;
  onClick: () => void;
}

const BrandTile: React.FC<BrandTileProps> = ({ brand, onClick }) => {
  const formattedBrand = brand.split('').join(' ');
  
  // Logo paths (these would be replaced with actual logo images)
  const logos: Record<string, string> = {
    'BMW': '/bmw-logo.webp',
    'PORSCHE': '/porsche-logo.webp',
    'AUDI': '/audi-logo.webp',
    'BENZ': '/benz-logo.webp',
    'BUGATTI': '/bugatti-logo.webp',
    'OTHERS': '/question-mark.webp',
  };
  
  return (
    <div 
      className="brand-tile flex flex-col items-center justify-center h-40 p-5 relative overflow-hidden group"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10 flex flex-col items-center space-y-4">
        <div className="w-12 h-12 flex items-center justify-center mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
          <img 
            src={logos[brand]} 
            alt={`${brand} logo`} 
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }} 
          />
        </div>
        <p className="text-white tracking-widest text-center transition-all duration-300 group-hover:text-white/90">
          {formattedBrand}
        </p>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
};

export default BrandTile;
