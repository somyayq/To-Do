import React from 'react';
import { MoveRight } from 'lucide-react';

const TerminalButton = ({ children, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full bg-[#00bfff] hover:bg-[#00d0ff] text-black font-bold py-4 flex items-center justify-center gap-3 tracking-[0.4em] uppercase transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(0,191,255,0.3)]"
  >
    {children} <MoveRight size={20} />
  </button>
);

export default TerminalButton;