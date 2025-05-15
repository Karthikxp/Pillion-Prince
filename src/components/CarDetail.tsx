import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Clock, Check, Car, Gift } from 'lucide-react';
import ChatInput from './ChatInput';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { carApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface CarDetailProps {
  brand: string;
  onBack: () => void;
}

const CarDetail: React.FC<CarDetailProps> = ({ brand, onBack }) => {
  const [query, setQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<{type: 'user' | 'assistant', message: string}[]>([]);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState<boolean>(true);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [showModelSelection, setShowModelSelection] = useState<boolean>(true);
  const { toast } = useToast();
  
  const carInfo = {
    'BMW': {
      models: ['M4 Competition', 'M3', 'X5', 'i8', '7 Series'],
      defaultModel: 'M4 Competition',
      horsepower: '500 hp',
      acceleration: '3.8 seconds (0-60 mph)',
      topSpeed: '180 mph',
      price: '$74,700',
      image: '/bmw-m4.webp'
    },
    'PORSCHE': {
      models: ['911 Turbo S', 'Taycan', 'Cayenne', 'Panamera', '718 Boxster'],
      defaultModel: '911 Turbo S',
      horsepower: '640 hp',
      acceleration: '2.6 seconds (0-60 mph)',
      topSpeed: '205 mph',
      price: '$207,000',
      image: '/porsche-911.webp'
    },
    'AUDI': {
      models: ['R8 V10', 'RS7', 'e-tron GT', 'Q8', 'A8'],
      defaultModel: 'R8 V10',
      horsepower: '562 hp',
      acceleration: '3.4 seconds (0-60 mph)',
      topSpeed: '201 mph',
      price: '$148,700',
      image: '/audi-r8.webp'
    },
    'BENZ': {
      models: ['AMG GT Black Series', 'S-Class', 'EQS', 'G-Wagon', 'C-Class'],
      defaultModel: 'AMG GT Black Series',
      horsepower: '720 hp',
      acceleration: '3.1 seconds (0-60 mph)',
      topSpeed: '202 mph',
      price: '$325,000',
      image: '/amg-gt.webp'
    },
    'BUGATTI': {
      models: ['Chiron', 'Veyron', 'Divo', 'La Voiture Noire', 'Centodieci'],
      defaultModel: 'Chiron',
      horsepower: '1,500 hp',
      acceleration: '2.4 seconds (0-60 mph)',
      topSpeed: '261 mph',
      price: '$3,000,000',
      image: '/bugatti-chiron.webp'
    },
    'OTHERS': {
      models: ['Various Luxury Models'],
      defaultModel: 'Various Models',
      horsepower: 'Contact for details',
      acceleration: 'Contact for details',
      topSpeed: 'Contact for details',
      price: 'Contact for pricing',
      image: '/luxury-cars.webp'
    }
  };

  useEffect(() => {
    // Reset state when brand changes
    setSelectedModel('');
    setShowModelSelection(true);
    setChatHistory([]);
    setShowWelcomeMessage(true);
  }, [brand]);
  
  useEffect(() => {
    if (!showModelSelection && showWelcomeMessage) {
      const timer = setTimeout(() => {
        const info = carInfo[brand as keyof typeof carInfo];
        const welcomeMsg = brand === 'OTHERS' 
          ? `Welcome to our luxury car assistant. How can I help you find your perfect vehicle today?` 
          : `Welcome to the ${brand} ${selectedModel} experience. How can I assist you with this magnificent vehicle today?`;
        
        setChatHistory(prev => [...prev, {type: 'assistant', message: welcomeMsg}]);
        setShowWelcomeMessage(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [brand, showWelcomeMessage, showModelSelection, selectedModel]);
  
  const handleSubmit = async (value: string) => {
    setQuery(value);
    setChatHistory(prev => [...prev, {type: 'user', message: value}]);
    setIsTyping(true);
    
    try {
      const result = await carApi.askQuestion(value, brand);
      setChatHistory(prev => [...prev, {type: 'assistant', message: result.reply}]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response from AI assistant',
        variant: 'destructive',
      });
      setChatHistory(prev => [...prev, {type: 'assistant', message: 'I apologize, but I encountered an error. Please try again.'}]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleModelSelect = (value: string) => {
    setSelectedModel(value);
  };

  const handleContinue = () => {
    setShowModelSelection(false);
  };

  return (
    <div className="flex flex-col h-full relative animate-fade-in">
      <div className="absolute top-5 left-5 cursor-pointer z-20" onClick={onBack}>
        <button className="glass-card p-2 rounded-full hover:bg-white/10 transition-all">
          <ArrowLeft className="text-white/60 hover:text-white transition-colors" />
        </button>
      </div>
      
      {showModelSelection ? (
        <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in">
          <h2 className="text-2xl text-white/80 mb-8">Which {brand} model are you interested in?</h2>
          
          <div className="glass-card bg-black/40 p-8 w-full max-w-md border-white/10 rounded-lg">
            <Select 
              onValueChange={handleModelSelect}
              defaultValue={carInfo[brand as keyof typeof carInfo].defaultModel}
            >
              <SelectTrigger className="w-full mb-6 bg-black/30 border-white/20 text-white">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent className="bg-black/80 border-white/20 text-white">
                {carInfo[brand as keyof typeof carInfo].models.map((model) => (
                  <SelectItem key={model} value={model} className="hover:bg-white/10">
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="relative h-48 bg-gradient-to-b from-black/0 to-black/40 mb-6 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center" 
                   style={{ backgroundImage: `url('${carInfo[brand as keyof typeof carInfo].image}')` }}></div>
            </div>
            
            <Button 
              onClick={handleContinue} 
              className="w-full glass-card bg-white/5 hover:bg-white/10 text-white border-none"
              disabled={!selectedModel && !carInfo[brand as keyof typeof carInfo].defaultModel}
            >
              Continue to Chat
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row h-full pt-16">
          <div className="md:w-1/2 p-6 flex flex-col justify-center">
            <h1 className="text-4xl tracking-widest text-white/80 mb-10">{brand.split('').join(' ')}</h1>
            <h2 className="text-2xl text-white/70 mb-6">{selectedModel || carInfo[brand as keyof typeof carInfo].defaultModel}</h2>
            
            <Card className="glass-card overflow-hidden bg-black/40 border-white/10 mb-6">
              <div className="p-0">
                <div className="relative h-48 bg-gradient-to-b from-black/0 to-black/40">
                  <div className="absolute inset-0 bg-cover bg-center" 
                       style={{ backgroundImage: `url('${carInfo[brand as keyof typeof carInfo].image}')` }}></div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl text-white/80 mb-2">{selectedModel || carInfo[brand as keyof typeof carInfo].defaultModel}</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center text-white/60">
                      <Car className="w-4 h-4 mr-2" />
                      <span>{carInfo[brand as keyof typeof carInfo].horsepower}</span>
                    </div>
                    <div className="flex items-center text-white/60">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{carInfo[brand as keyof typeof carInfo].acceleration}</span>
                    </div>
                    <div className="flex items-center text-white/60">
                      <Gift className="w-4 h-4 mr-2" />
                      <span>{carInfo[brand as keyof typeof carInfo].price}</span>
                    </div>
                    <div className="flex items-center text-white/60">
                      <Check className="w-4 h-4 mr-2" />
                      <span>Available Now</span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
            
            {/* Schedule a Test Drive button has been removed */}
          </div>
          
          <div className="md:w-1/2 p-6 flex flex-col">
            <div className="flex-1 overflow-y-auto mb-20 space-y-4">
              {chatHistory.map((chat, index) => (
                <div key={index} className={`${chat.type === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
                  <div className={`glass-card p-4 max-w-[80%] ${chat.type === 'user' ? 'bg-white/10' : 'bg-black/40'}`}>
                    <p className="text-white/80">{chat.message}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="glass-card p-4 bg-black/40">
                    <p className="text-white/60">Typing<span className="animate-pulse">...</span></p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {!showModelSelection && (
        <div className="absolute bottom-6 left-0 right-0 px-6 w-full max-w-2xl mx-auto">
          <ChatInput onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
};

export default CarDetail;
