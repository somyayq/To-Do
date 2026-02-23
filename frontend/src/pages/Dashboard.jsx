import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LayoutGrid,
  Star,
  Calendar,
  Folder,
  Archive,
  Plus,
  Bell,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Settings,
  Box,
  ShieldCheck,
  Quote,
  Clock,
  Lock,
  Trash2,
  Power,
} from "lucide-react";

const Dashboard = () => {
  // --- STATE MANAGEMENT ---
  const [tasks, setTasks] = useState([]);
  const [newDirective, setNewDirective] = useState("");
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState("98.4% STABLE");

  // Fetching credentials from LocalStorage (Saved during Login)
  const agentId = localStorage.getItem("agent_id");
  const agentHandle = localStorage.getItem("agent_handle") || "CORE_ADMIN";
  const nodeId = localStorage.getItem("node_id") || "NODE_01";

  const API_BASE = "http://localhost:5555/api/operations";

  // --- LOGIC HANDLERS ---

  useEffect(() => {
    if (agentId) {
      fetchTasks();
    } else {
      // Safety: If no agent ID, boot back to login
      window.location.href = "/";
    }
  }, [agentId]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/${agentId}`);
      setTasks(res.data);
      setSyncStatus("100% SYNCED");
    } catch (err) {
      console.error("SYNC_FAILED", err);
      setSyncStatus("CONNECTION_ERROR");
    } finally {
      setTimeout(() => setLoading(false), 500); // Small delay for "hacker" feel
    }
  };

  const deployOperation = async (e) => {
    // Only trigger on Enter key or button click
    if (e.key === "Enter" && newDirective) {
      setLoading(true);
      try {
        await axios.post(`${API_BASE}/deploy`, {
          directive: newDirective,
          intel: "MANUAL_UPLINK",
          threat_level: "LOW_THREAT",
          agent_id: agentId,
        });
        setNewDirective("");
        fetchTasks();
      } catch (err) {
        console.error("DEPLOYMENT_FAILED", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleTask = async (id) => {
    try {
      await axios.patch(`${API_BASE}/${id}/toggle`);
      fetchTasks(); // Refresh list to show checkbox/line-through
    } catch (err) {
      console.error("STATE_TRANSITION_FAILED", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("DELETION_FAILED", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#020b0d] text-[#6eb6c1] font-mono flex flex-col overflow-hidden select-none">
      {/* TOP NAVIGATION BAR */}
      <nav className="h-16 border-b border-[#112226] flex items-center justify-between px-6 bg-[#020b0d] z-20">
        <div className="flex items-center gap-3">
          <Box className="text-[#00d0ff]" size={28} />
          <h1 className="text-xl font-bold tracking-[0.2em] text-white">
            TASK_OS{" "}
            <span className="text-[10px] opacity-40 font-normal text-[#00d0ff]">
              V4.0.2
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 border border-[#00d0ff]/30 rounded-full bg-[#00d0ff]/5">
            <div
              className={`w-2 h-2 rounded-full ${loading ? "bg-yellow-400" : "bg-[#00d0ff]"} animate-pulse`}
            ></div>
            <span className="text-[10px] tracking-widest text-[#00d0ff]">
              {loading ? "SYNCING..." : "SYSTEM ONLINE"}
            </span>
          </div>
          <div className="flex items-center gap-4 border-l border-[#112226] pl-6">
            <Bell
              size={18}
              className="cursor-pointer hover:text-white transition-colors"
            />
            <Settings
              size={18}
              className="cursor-pointer hover:text-white transition-colors"
            />
            <div className="flex items-center gap-3 ml-2">
              <div className="text-right">
                <p className="text-[10px] font-bold text-white uppercase">
                  {agentHandle}
                </p>
                <p className="text-[9px] opacity-50 tracking-tighter">LVL_99</p>
              </div>
              <div className="w-10 h-10 border border-[#00d0ff] p-0.5 rounded-sm">
                <img
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${agentHandle}`}
                  alt="avatar"
                  className="bg-[#112226]"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 grid grid-cols-[280px_1fr_350px] overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="border-r border-[#112226] flex flex-col p-6 bg-[#020b0d]/50">
          <div className="bg-[#051114] border border-[#112226] p-4 rounded-sm mb-8 flex items-center gap-4 shadow-lg shadow-black/20">
            <div className="w-10 h-10 bg-[#00d0ff]/10 flex items-center justify-center border border-[#00d0ff]/20">
              <RefreshCw
                size={20}
                className={`text-[#00d0ff] ${loading ? "animate-spin" : ""}`}
              />
            </div>
            <div>
              <p className="text-[9px] opacity-40 uppercase tracking-tighter">
                Neural Sync
              </p>
              <p className="text-sm font-bold text-white">{syncStatus}</p>
            </div>
          </div>

          <nav className="space-y-1 flex-1">
            <SidebarItem
              icon={Calendar}
              label="My Day"
              count={tasks.length}
              active
            />
            <SidebarItem icon={Star} label="Important" />
            <SidebarItem icon={Calendar} label="Planned" />
            <SidebarItem icon={LayoutGrid} label="All Nodes" />
            <SidebarItem icon={Archive} label="Archived" />
          </nav>

          <button
            onClick={handleLogout}
            className="mt-auto border border-dashed border-red-900/40 p-3 text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 text-red-500/50 hover:bg-red-500/5 hover:text-red-500 transition-all"
          >
            <Power size={14} /> Terminate Session
          </button>
        </aside>

        {/* CENTER PANEL: THE FEED */}
        <main className="flex flex-col relative bg-[#020b0d]">
          <div className="p-12 flex-1 overflow-y-auto custom-scrollbar">
            <header className="mb-12 flex justify-between items-end">
              <div>
                <h2 className="text-5xl font-bold tracking-tighter text-white">
                  MY_DAY<span className="text-[#00d0ff]">.EXE</span>
                </h2>
                <p className="text-[10px] opacity-40 mt-3 uppercase tracking-[0.3em] font-mono">
                  CYCLE_{new Date().getFullYear()}.{new Date().getMonth() + 1}.
                  {new Date().getDate()} // UPTIME: {nodeId}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 border border-[#112226] hover:bg-white/5 transition-colors"
                  onClick={fetchTasks}
                >
                  <RefreshCw size={16} />
                </button>
                <button className="p-2 border border-[#112226] hover:bg-white/5 transition-colors">
                  <Settings size={16} />
                </button>
              </div>
            </header>

            <div className="space-y-3">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TaskRow
                    key={task._id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                ))
              ) : (
                <div className="py-20 text-center border border-dashed border-[#112226] opacity-20 text-xs tracking-[0.3em]">
                  NO_ACTIVE_DIRECTIVES_DETECTED
                </div>
              )}
            </div>
          </div>

          {/* TASK INPUT BAR */}
          <div className="p-8 px-12 border-t border-[#112226] bg-[#020b0d]">
            <div className="bg-[#051114] border border-[#112226] p-4 flex items-center gap-4 focus-within:border-[#00d0ff]/50 transition-all shadow-inner">
              <Plus className="opacity-20" size={20} />
              <input
                type="text"
                placeholder="Initialize new task protocol..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:opacity-20 text-white font-mono"
                value={newDirective}
                onChange={(e) => setNewDirective(e.target.value)}
                onKeyDown={deployOperation}
              />
              <div className="flex gap-5 opacity-30">
                <Calendar
                  size={18}
                  className="cursor-pointer hover:text-[#00d0ff] transition-colors"
                />
                <Bell
                  size={18}
                  className="cursor-pointer hover:text-[#00d0ff] transition-colors"
                />
                <RefreshCw
                  size={18}
                  className="cursor-pointer hover:text-[#00d0ff] transition-colors"
                />
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR: INTEL */}
        <aside className="border-l border-[#112226] bg-[#020b0d]/50 p-10 flex flex-col">
          <div className="bg-[#051114] border border-[#112226] p-6 rounded-sm mb-12 relative shadow-lg">
            <Quote
              className="absolute -top-3 left-4 text-[#00d0ff] bg-[#051114] px-1"
              size={24}
            />
            <p className="italic text-lg leading-relaxed text-white font-serif mt-2">
              "Efficiency is the bridge between goals and accomplishment."
            </p>
            <p className="text-[9px] mt-4 opacity-30 tracking-[0.3em] uppercase">
              — System_Msg // 0xAF32
            </p>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#00d0ff]">
                Chronos_Interface
              </h3>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-white uppercase tracking-widest">
                Oct <span className="opacity-30">.2024</span>
              </span>
              <div className="flex gap-4">
                <ChevronLeft
                  size={16}
                  className="opacity-30 cursor-pointer hover:opacity-100"
                />
                <ChevronRight
                  size={16}
                  className="opacity-30 cursor-pointer hover:opacity-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-y-5 text-[10px] text-center opacity-40">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="font-bold">
                  {d}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => (
                <div
                  key={i}
                  className={`py-1 rounded-sm ${i === 23 ? "bg-[#00d0ff] text-black font-bold shadow-[0_0_10px_#00d0ff]" : ""}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-[#112226] flex justify-between items-center text-[9px] opacity-30 tracking-[0.1em]">
            <span>BUILD 4.0.22-STABLE</span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_green]"></div>{" "}
              ACTIVE_NODE
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, count, active }) => (
  <div
    className={`flex items-center justify-between p-3.5 cursor-pointer group transition-all duration-200 border-l-2 ${active ? "bg-[#00d0ff]/5 text-[#00d0ff] border-[#00d0ff]" : "border-transparent hover:bg-white/5 hover:text-white"}`}
  >
    <div className="flex items-center gap-4">
      <Icon size={18} />
      <span className="text-[11px] uppercase tracking-[0.2em] font-medium">
        {label}
      </span>
    </div>
    {count !== undefined && (
      <span className={`text-[10px] ${active ? "opacity-100" : "opacity-30"}`}>
        {count.toString().padStart(2, "0")}
      </span>
    )}
  </div>
);

const TaskRow = ({ task, onToggle, onDelete }) => {
  const isTerminated = task.execution_status === "TERMINATED";

  return (
    <div
      className={`group border border-[#112226] p-5 flex items-center gap-5 bg-[#051114]/50 hover:bg-[#051114] transition-all duration-300 relative ${isTerminated ? "opacity-30 grayscale-[0.5]" : ""}`}
    >
      {/* Completion Trigger */}
      <div
        onClick={() => onToggle(task._id)}
        className={`w-5 h-5 border cursor-pointer flex items-center justify-center transition-all ${isTerminated ? "bg-[#00d0ff] border-[#00d0ff] shadow-[0_0_8px_#00d0ff]" : "border-[#112226] hover:border-[#00d0ff]"}`}
      >
        {isTerminated && <ShieldCheck size={12} className="text-[#020b0d]" />}
      </div>

      {/* Content Area */}
      <div className="flex-1">
        <p
          className={`text-sm tracking-widest ${isTerminated ? "line-through" : "text-white"}`}
        >
          {task.directive}
        </p>
        <div className="flex gap-4 mt-1.5">
          <span className="text-[8px] flex items-center gap-1.5 tracking-[0.1em] uppercase opacity-40">
            <Folder size={10} /> {task.intel || "GENERAL_DATA"}
          </span>
          {task.threat_level === "CRITICAL" && (
            <span className="text-[8px] flex items-center gap-1.5 tracking-[0.1em] uppercase text-red-500/80">
              <Lock size={10} /> CRITICAL_PRIORITY
            </span>
          )}
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center gap-5">
        <button
          onClick={() => onDelete(task._id)}
          className="opacity-0 group-hover:opacity-100 text-red-500/40 hover:text-red-500 transition-all p-1"
        >
          <Trash2 size={16} />
        </button>
        <Star
          size={18}
          className={
            task.threat_level === "CRITICAL"
              ? "text-[#00d0ff] fill-[#00d0ff] shadow-[0_0_10px_cyan]"
              : "opacity-10 hover:opacity-50 transition-all cursor-pointer"
          }
        />
      </div>
    </div>
  );
};

export default Dashboard;
