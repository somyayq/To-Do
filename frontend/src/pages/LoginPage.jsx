import React, { useState } from 'react';
import axios from 'axios';
import { Box, Fingerprint, Key, Loader2 } from 'lucide-react'; // Added Loader2 for extra flare
import TerminalInput from '../components/ui/TerminalInput';
import TerminalButton from '../components/ui/TerminalButton';
import StatusHeader from '../components/login/StatusHeader';
import SystemFooter from '../components/login/SystemFooter';

const LoginPage = () => {
  const [handle, setHandle] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [systemMessage, setSystemMessage] = useState('INITIALIZATION_REQUIRED');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Prevent empty submissions
    if (!handle || !accessKey) {
        setSystemMessage("ERROR: INSUFFICIENT_CREDENTIALS");
        return;
    }

    setLoading(true);
    setSystemMessage("ESTABLISHING_SECURE_CONNECTION...");

    

    try {
      // Note: Use your actual backend URL here
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, {
        identity_handle: handle,
        access_key_hash: accessKey
      });

      // On Success
      setSystemMessage(response.data.message);
      
      // Save identity data for the dashboard
      localStorage.setItem('agent_id', response.data.user._id);
      localStorage.setItem('agent_handle', handle);
      localStorage.setItem('node_id', response.data.user?.node_id || 'NODE-UNKNOWN');

      // Simulate a small delay for the "hacker" experience before moving to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard'; // Or use useNavigate() from react-router-dom
      }, 1500);

    } catch (err) {
      setLoading(false);
      
      // Handle specific error messages from your backend
      const errorMsg = err.response?.data?.message || "SYSTEM_OFFLINE: CONNECTION_TIMEOUT";
      setSystemMessage(errorMsg);
      
      console.error("[AUTH_CRITICAL_FAILURE]:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#00bfff] flex flex-col justify-between p-8 relative overflow-hidden font-mono">
      
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#2CFF05 1px, transparent 1px), linear-gradient(90deg, #2CFF05 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2CFF05]/5 to-transparent pointer-events-none animate-scanline"></div>

      <StatusHeader />

      <main className="flex justify-center items-center z-10">
        <div className="w-full max-w-[440px] border border-[#1a1a1a] bg-[#0a0a0a]/90 p-12 backdrop-blur-md relative">
          
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#2CFF05]"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#2CFF05]"></div>

          <header className="flex flex-col items-center mb-12 text-center">
            {/* Box spins while loading */}
            <Box size={48} strokeWidth={1} className={`mb-6 ${loading ? 'animate-spin' : 'animate-pulse'}`} />
            
            <h1 className="text-4xl font-light tracking-[0.6em] mb-3 uppercase">Task OS</h1>
            
            {/* Dynamic System Message Display */}
            <p className={`text-[10px] tracking-[0.4em] uppercase transition-all duration-300 ${loading ? 'text-yellow-400' : 'opacity-40'}`}>
              {systemMessage}
            </p>
          </header>

          <form onSubmit={handleLogin} className="space-y-10">
            <TerminalInput 
              label="Identity Handle"
              icon={Fingerprint}
              id="identity_handle"
              placeholder="user@task.os"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              disabled={loading} // Disable input while loading
            />
            
            <TerminalInput 
              label="Access Key"
              icon={Key}
              id="access_key"
              name="access_key"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              disabled={loading}
              onIconClick={() => setShowPassword(!showPassword)}
            />

            <TerminalButton disabled={loading}>
              {loading ? "AUTHENTICATING..." : "Initialize"}
            </TerminalButton>

            <div className="flex justify-between items-center text-[10px] tracking-[0.2em] pt-4 opacity-40 uppercase">
              <button type="button" className="hover:opacity-100 transition-opacity">Recovery</button>
              <div className="h-[1px] w-16 bg-[#1a1a1a]"></div>
              <button type="button" className="hover:opacity-100 transition-opacity"
              onClick={()=>window.location.href='./register'}>New Instance +</button>
            </div>
          </form>
        </div>
      </main>

      <SystemFooter />
    </div>
  );
};

export default LoginPage;