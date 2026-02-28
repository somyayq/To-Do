import React from 'react';

const TerminalInput = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2 group">
    <label 
    htmlFor={props.id}
    className="text-[10px] tracking-[0.2em] opacity-70 block uppercase">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity font-mono">
        {">"}
      </span>
      <input 
        {...props}
        className="w-full bg-[#111111]/50 border border-[#1a1a1a] py-4 pl-10 pr-12 text-sm font-mono text-[#00bfff] focus:outline-none focus:border-[#00bfff] transition-all placeholder:opacity-20"
      />
      {Icon && <Icon size={18} onClick={props.onIconClick} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-60 transition-opacity" />}
    </div>
  </div>
);

export default TerminalInput;