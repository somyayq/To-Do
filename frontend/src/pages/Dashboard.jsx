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
  AlarmClock,
  CalendarDays,
  CalendarSync,
} from "lucide-react";
import { DayPicker } from "react-day-picker"; // to import the selectable calendar component
import "react-day-picker/dist/style.css"; // default styles for the calendar

const Dashboard = () => {
  // --- STATE MANAGEMENT ---
  const [tasks, setTasks] = useState([]);
  const [newDirective, setNewDirective] = useState("");
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState("98.4% STABLE");
  const [activeCategory, setActiveCategory] = useState("My Day");
  const [terminationDate, setTerminationDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);

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

  const filteredTasks = tasks.filter((task) => {
    if (activeCategory === "Important") return task.threat_level === "CRITICAL";
    if (activeCategory === "Archived")
      return task.execution_status === "TERMINATED";
    return true; // "My Day" shows all
  });

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
      console.log("Sending:",{terminationDate,reminderTime});
      try {
        await axios.post(`${API_BASE}`, {
          directive: newDirective,
          intel: "MANUAL_UPLINK",
          threat_level: "LOW_THREAT",
          agent_id: agentId,
          termination_date: terminationDate
            ? terminationDate.toISOString()
            : null,
          reminder_time: reminderTime || null,
        });
        setNewDirective("");
        setTerminationDate(null);
        setReminderTime("");
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

  const toggleStar = async (id) => {
    try {
      await axios.patch(`${API_BASE}/${id}/star`);
      fetchTasks();
    } catch (err) {
      console.error("IMPORTANT_TOGGLE_FAILED", err);
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
          <Box className="text-[#2CFF05]" size={28} />
          <h1 className="text-xl font-bold tracking-[0.2em] text-white">
            TASK_OS{" "}
            <span className="text-[10px] opacity-40 font-normal text-[#2CFF05]">
              V0.0.1
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 border border-[#00d0ff]/30 rounded-full bg-[#00d0ff]/5">
            <div
              className={`w-2 h-2 rounded-full ${loading ? "bg-yellow-400" : "bg-[#00d0ff]"} animate-pulse`}
            ></div>
            <span className="text-[10px] tracking-widest text-[#2CFF05]">
              {loading ? "SYNCING..." : "SYSTEM ONLINE"}
            </span>
          </div>
          <div className="flex items-center gap-4 border-l border-[#2CFF05] pl-6">
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
                <p className="text-[15px] font-bold text-white uppercase text-shadow-[0_0_5px_#00d0ff] tracking-[0.1em] text-[#2CFF05]">
                  {agentHandle}
                </p>
                <p className="text-[9px] opacity-50 tracking-tighter">LVL_1</p>
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

      <div className="flex-1 grid grid-cols-[225px_1fr_350px] overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="border-r border-[#112226] flex flex-col p-6 bg-[#020b0d]/50">
          <div className="bg-[#051114] border border-[#112226] p-4 rounded-sm mb-8 flex items-center gap-4 shadow-lg shadow-black/20">
            <div className="w-10 h-10 bg-[#00d0ff]/10 flex items-center justify-center border border-[#00d0ff]/20">
              <RefreshCw
                size={20}
                className={`text-[#2CFF05] ${loading ? "animate-spin" : ""}`}
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
              active={activeCategory === "My Day"}
              onClick={() => setActiveCategory("My Day")}
            />
            <SidebarItem
              icon={Star}
              label="Important"
              active={activeCategory === "Important"}
              onClick={() => setActiveCategory("Important")}
            />
            <SidebarItem
              icon={Archive}
              label="Archived"
              active={activeCategory === "Archived"}
              onClick={() => setActiveCategory("Archived")}
            />
          </nav>

          <button
            onClick={handleLogout}
            className="mt-auto border border-dashed border-red-900/40 p-3 text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 text-red-500/50 hover:bg-red-500/5 hover:text-red-500 transition-all"
          >
            <Power size={14} /> Terminate Session
          </button>
        </aside>

        {/* CENTER PANEL: THE FEED */}
        <main className="flex flex-col overflow-hidden bg-[#020b0d]">
          <div
            className="p-12 overflow-y-auto custom-scrollbar"
            style={{ height: "calc(90vh - 110px)" }}
          >
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
              {filteredTasks.map((task) => (
                <TaskRow
                  key={task._id}
                  task={task}
                  onToggle={() => toggleTask(task._id)}
                  onDelete={() => deleteTask(task._id)}
                  onStar={() => toggleStar(task._id)} // <--- Add this
                />
              ))}
            </div>
          </div>

          {/* TASK INPUT BAR */}
          <div className="p-8 px-12 border-t border-[#112226] bg-[#020b0d] shrink-0">
            <div className="bg-[#051114] border border-[#112226] p-4 flex items-center gap-4 focus-within:border-[#00d0ff]/50 transition-all shadow-inner">
              <Plus
                className="opacity-80 hover:opacity-100 hover:text-[#00d0ff] transition-all"
                size={20}
                onClick={() => {
                  if (newDirective) {
                    deployOperation({ key: "Enter" });
                  }
                }}
              />
              <input
                type="text"
                placeholder="Initialize new task protocol..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:opacity-20 text-white font-mono"
                value={newDirective}
                onChange={(e) => setNewDirective(e.target.value)}
                onKeyDown={deployOperation}
              />
              {terminationDate && (
                <span className="text-[9px] text-[#00d0ff] opacity-60 tracking-widest">
                  {terminationDate.toLocaleDateString()}
                </span>
              )}
              <div className="flex gap-5 opacity-80">
                <div className="relative">
                  <CalendarDays
                    size={18}
                    className={`cursor-pointer transition-colors ${terminationDate ? "text-[#00d0ff]" : "hover:text-[#00d0ff]"}`}
                    onClick={() => setShowDatePicker(!showDatePicker)}
                  />
                  {showDatePicker && (
                    <div className="absolute bottom-10 right-0 bg-[#051114] border border-[#00d0ff]/30 p-4 z-50 shadow-[0_0_20px_rgba(0,208,255,0.1)]">
                      <DayPicker
                        mode="single"
                        selected={terminationDate}
                        onSelect={(date) => {
                          setTerminationDate(date);
                          setShowDatePicker(false);
                        }}
                        styles={{
                          root: {
                            color: "#00d0ff",
                            fontFamily: "monospace",
                            fontSize: "12px",
                          },
                          caption: { color: "#ffffff" },
                          head_cell: { color: "#00d0ff", opacity: 0.5 },
                          day: { color: "#6eb6c1", borderRadius: "2px" },
                          day_selected: {
                            backgroundColor: "#00d0ff",
                            color: "#000000",
                          },
                          day_today: { color: "#ffffff", fontWeight: "bold" },
                          nav_button: { color: "#00d0ff" },
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="relative">
                  <AlarmClock
                    size={18}
                    className={`cursor-pointer transition-colors ${reminderTime ? "text-[#00d0ff] opacity-100" : "hover:text-[#00d0ff]"}`}
                    onClick={() => setShowTimePicker(!showTimePicker)}
                  />
                  {showTimePicker && (
                    <div className="absolute bottom-10 right-0 bg-[#051114] border border-[#00d0ff]/30 p-4 z-50 shadow-[0_0_20px_rgba(0,208,255,0.1)] w-48">
                      <p className="text-[9px] tracking-[0.3em] uppercase text-[#00d0ff] mb-3 opacity-60">
                        Set Reminder
                      </p>

                      {/* Quick options */}
                      <div className="space-y-1 mb-3">
                        {[
                          {
                            label: "Later Today",
                            value: () => {
                              const d = new Date();
                              d.setHours(d.getHours() + 3);
                              return d.toTimeString().slice(0, 5);
                            },
                          },
                          { label: "Tomorrow Morning", value: () => "09:00" },
                          { label: "Tonight", value: () => "20:00" },
                        ].map((opt) => (
                          <button
                            key={opt.label}
                            onClick={() => {
                              setReminderTime(opt.value());
                              setShowTimePicker(false);
                            }}
                            className="w-full text-left text-[10px] tracking-widest uppercase p-2 hover:bg-[#00d0ff]/10 hover:text-[#00d0ff] transition-all text-[#6eb6c1]"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      {/* Custom time input */}
                      <div className="border-t border-[#112226] pt-3">
                        <p className="text-[9px] tracking-[0.2em] uppercase opacity-40 mb-2">
                          Custom Time
                        </p>
                        <input
                          type="time"
                          className="w-full bg-transparent text-[#00d0ff] text-xs outline-none font-mono border border-[#112226] p-2 focus:border-[#00d0ff]/50"
                          value={reminderTime}
                          onChange={(e) => {
                            setReminderTime(e.target.value);
                            setShowTimePicker(false);
                          }}
                        />
                      </div>

                      {/* Clear option */}
                      {reminderTime && (
                        <button
                          onClick={() => {
                            setReminderTime("");
                            setShowTimePicker(false);
                          }}
                          className="w-full text-center text-[9px] tracking-widest uppercase p-2 mt-2 text-red-500/50 hover:text-red-500 transition-all"
                        >
                          Clear Reminder
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <CalendarSync
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
                INTEL_LOG
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

const SidebarItem = ({ icon: Icon, label, count, active, onClick }) => (
  <div
    onClick={onClick}
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

const TaskRow = ({ task, onToggle, onDelete, onStar}) => {
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
          {task.termination_date && (
            <span className="text-[8px] flex items-center gap-1.5 tracking-[0.1em] uppercase opacity-50">
              <CalendarDays size={10} />{" "}
              {new Date(task.termination_date).toLocaleDateString()}
            </span>
          )}
          {task.threat_level === "CRITICAL" && (
            <span className="text-[8px] items-center gap-1.5 tracking-[0.1em] uppercase text-red-500/80">
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
          onClick={() => onStar(task._id)}
          className={
            task.threat_level === "CRITICAL"
              ? "text-[#2CFF05] fill-[#2CFF05] shadow-[0_0_10px_#2CFF05]"
              : "opacity-10 hover:opacity-50 transition-all cursor-pointer"
          }
        />
      </div>

      {/*add the date display inside the content area*/}
    </div>
  );
};

export default Dashboard;
