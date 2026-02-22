const StatusHeader = () => (
  <div className="flex justify-between items-start z-10 text-[10px] tracking-[0.2em] font-mono">
    <div>
      <p className="opacity-50">SYSTEM STATUS</p>
      <p className="text-[#00bfff]">NODE_ACTIVE // PORT_8080</p>
    </div>
    <div className="flex gap-12 text-right">
      <p className="opacity-50 hidden sm:block text-[#00bfff]">ENCRYPTED SESSION</p>
      <p>V1.0.4-STABLE</p>
    </div>
  </div>
);

export default StatusHeader;