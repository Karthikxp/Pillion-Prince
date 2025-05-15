
import React, { useState } from 'react';
import { ArrowRight, Mic } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (value: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit }) => {
  const [value, setValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value);
      setValue('');
    }
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Simulate voice recognition after 2 seconds
      setTimeout(() => {
        setValue("I'd like to know more about this car's specifications");
        setIsRecording(false);
      }, 2000);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 w-full">
      <button 
        type="button" 
        onClick={toggleRecording}
        className={`flex items-center justify-center w-12 h-12 rounded-full glass-card ${isRecording ? 'bg-white/20 text-white' : 'bg-white/5 text-white/70'} transition-all hover:bg-white/10`}
      >
        <Mic size={20} className={isRecording ? 'animate-pulse' : ''} />
      </button>
      
      <input
        type="text"
        placeholder="Ask about your car"
        className="chat-input flex-1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      
      <button 
        type="submit" 
        className="flex items-center justify-center w-12 h-12 rounded-full glass-card bg-white/5 text-white transition-all hover:bg-white/10"
        disabled={!value.trim()}
      >
        <ArrowRight size={20} className={value.trim() ? 'text-white' : 'text-white/50'} />
      </button>
    </form>
  );
};

export default ChatInput;
