import React, { useState } from 'react';
import axios from 'axios';
import { Box, Fingerprint, Key, Mail, ShieldPlus } from 'lucide-react';
import TerminalInput from '../components/ui/TerminalInput';
import TerminalButton from '../components/ui/TerminalButton';
import StatusHeader from '../components/login/StatusHeader';
import SystemFooter from '../components/login/SystemFooter';

const RegisterPage = () => {
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [systemMessage, setSystemMessage] = useState('AWAITING_NEW_IDENTITY_DATA');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSystemMessage("GENERATING_UNIQUE_NODE_ID...");

    try {
      // Calling your Backend Registration Route
      const response = await axios.post('http://localhost:5555/api/signup', {
        identity_handle: handle,
        email: email,
        access_key_hash: accessKey // We send it to backend to be hashed
      });

      setSystemMessage("IDENTITY_CREATED_SUCCESSFULLY");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/'; 
      }, 2000);

    } catch (err) {
      setLoading(false);
      const errorMsg = err.response?.data?.message || "REGISTRATION_FAILURE: Mainframe Rejected Request";
      setSystemMessage(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#00bfff] flex flex-col justify-between p-8 relative overflow-hidden font-mono">
      
      {/* Background Grid/Scanline */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#00bfff 1px, transparent 1px), linear-gradient(90deg, #00bfff 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00bfff]/5 to-transparent pointer-events-none animate-scanline"></div>

      <StatusHeader />

      <main className="flex justify-center items-center z-10">
        <div className="w-full max-w-[440px] border border-[#1a1a1a] bg-[#0a0a0a]/90 p-12 backdrop-blur-md relative">
          
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00bfff]"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00bfff]"></div>

          <header className="flex flex-col items-center mb-10 text-center">
            <ShieldPlus size={48} strokeWidth={1} className={`mb-6 ${loading ? 'animate-spin' : 'animate-pulse'}`} />
            <h1 className="text-3xl font-light tracking-[0.4em] mb-3 uppercase">Initialize Identity</h1>
            <p className={`text-[10px] tracking-[0.4em] uppercase ${loading ? 'text-yellow-400' : 'opacity-40'}`}>
                {systemMessage}
            </p>
          </header>

          <form onSubmit={handleRegister} className="space-y-6">
            <TerminalInput 
              label="Define Handle"
              icon={Fingerprint}
              placeholder="e.g. Neo_User"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              disabled={loading}
            />

            <TerminalInput 
              label="Uplink Email"
              icon={Mail}
              type="email"
              placeholder="user@network.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            
            <TerminalInput 
              label="Secure Access Key"
              icon={Key}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              disabled={loading}
              onIconClick={() => setShowPassword(!showPassword)}
            />

            <div className="pt-4">
               <TerminalButton disabled={loading}>
                 {loading ? "PROVISIONING..." : "Confirm Identity"}
               </TerminalButton>
            </div>

            <div className="text-center text-[10px] tracking-[0.2em] pt-2 opacity-40 uppercase">
              <button type="button" onClick={() => window.location.href = '/'} className="hover:opacity-100 transition-opacity">
                Back to Authentication
              </button>
            </div>
          </form>
        </div>
      </main>

      <SystemFooter />
    </div>
  );
};

export default RegisterPage;