const SystemFooter = () => (
  <div className="flex justify-between items-end z-10 text-[9px] tracking-[0.2em] font-mono">
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00bfff] animate-pulse shadow-[0_0_8px_#00bfff]"></div>
        <p className="text-[#00bfff]">CORE_CONNECTION_STABLE</p>
      </div>
      <p className="opacity-30">LATENCY: 12ms // BUFFER: 0%</p>
    </div>
    <div className="max-w-[250px] text-right opacity-30 leading-relaxed uppercase hidden md:block">
      Unauthorized access is strictly monitored by Task OS Security.
    </div>
  </div>
);

export default SystemFooter;