import React, { useState } from 'react';
import { LanguageCode } from '../types/i18n';
import { getTranslation } from '../localization';
import { ShieldCheck, Lock, Key, AlertTriangle, ShieldAlert, Cpu, Database } from 'lucide-react';
import { audioEngine } from '../audio/audioEngine';

interface Props {
  currentLang: LanguageCode;
}

export const SecurityCenter: React.FC<Props> = ({ currentLang }) => {
  const t = getTranslation(currentLang);

  const [testLockdown, setTestLockdown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  const mockJwtPayload = {
    header: { alg: 'HS256', typ: 'JWT' },
    payload: {
      sub: 'usr_demo_777',
      email: 'demo@aetheria.io',
      iss: 'aetheria-auth-server',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    },
    signature: 'secret_sign_usr_demo_777',
  };

  const handleTestBruteForce = () => {
    audioEngine.playUISound('delete');
    setTestLockdown(true);
    setCooldownTime(30);

    const timer = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTestLockdown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="space-y-8 text-[#E4E4E7]">
      {/* Top Banner */}
      <div className="p-6 md:p-8 bg-[#0F1116] border border-[#2D303E] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-[#1A1C23] border border-[#00F0FF] text-[#00F0FF]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-mono uppercase tracking-wider text-white">{t.securityTitle}</h2>
            <p className="text-xs text-[#64748B] font-mono mt-0.5">
              Enterprise security layer featuring JWT authentication, bcrypt password hashing, and brute-force rate limiters.
            </p>
          </div>
        </div>

        <button
          onClick={handleTestBruteForce}
          disabled={testLockdown}
          className="px-5 py-2.5 bg-rose-950/80 border border-rose-500/40 hover:bg-rose-900 disabled:opacity-50 text-rose-300 text-xs font-mono uppercase font-bold tracking-wider flex items-center gap-2 transition-all shrink-0"
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>{testLockdown ? `LOCKED (${cooldownTime}S)` : 'TEST RATE LIMITER'}</span>
        </button>
      </div>

      {/* Security Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* JWT Inspector */}
        <div className="p-6 bg-[#0F1116] border border-[#2D303E] space-y-4">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-[#00F0FF]" />
            <span>{t.jwtTokenStatus}</span>
          </h3>

          <div className="p-4 bg-[#0A0B0E] border border-[#2D303E] space-y-3 font-mono text-[11px]">
            <div>
              <span className="text-[#64748B] block uppercase text-[10px]">HEADER: ALGORITHM & TOKEN TYPE</span>
              <span className="text-[#00F0FF]">{JSON.stringify(mockJwtPayload.header)}</span>
            </div>
            <div className="border-t border-[#2D303E] pt-2">
              <span className="text-[#64748B] block uppercase text-[10px]">PAYLOAD: DATA</span>
              <pre className="text-emerald-400 whitespace-pre-wrap">
                {JSON.stringify(mockJwtPayload.payload, null, 2)}
              </pre>
            </div>
            <div className="border-t border-[#2D303E] pt-2">
              <span className="text-[#64748B] block uppercase text-[10px]">VERIFY SIGNATURE</span>
              <span className="text-purple-400">{mockJwtPayload.signature}</span>
            </div>
          </div>
        </div>

        {/* bcrypt Password Hashing */}
        <div className="p-6 bg-[#0F1116] border border-[#2D303E] space-y-4">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>{t.bcryptHashMethod}</span>
          </h3>

          <div className="p-4 bg-[#0A0B0E] border border-[#2D303E] space-y-3 text-xs font-mono">
            <div>
              <span className="text-[#64748B] uppercase text-[10px] block mb-1">Plaintext Password (Input):</span>
              <span className="text-amber-300 bg-[#1A1C23] px-2.5 py-1 border border-[#2D303E] block w-fit">
                "password123"
              </span>
            </div>

            <div>
              <span className="text-[#64748B] uppercase text-[10px] block mb-1">bcrypt Salt (10 Rounds):</span>
              <span className="text-[#00F0FF] bg-[#1A1C23] px-2.5 py-1 border border-[#2D303E] block w-fit">
                $2b$10$EixZaYVK1fsbw1ZfbX3OXe
              </span>
            </div>

            <div>
              <span className="text-[#64748B] uppercase text-[10px] block mb-1">Stored Hashed Password:</span>
              <span className="text-emerald-400 bg-[#1A1C23] px-2.5 py-1 border border-[#2D303E] block text-[10px] break-all">
                $2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vj.3pP.yie
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
