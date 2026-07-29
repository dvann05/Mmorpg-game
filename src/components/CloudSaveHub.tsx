import React, { useState, useEffect } from 'react';
import { LanguageCode } from '../types/i18n';
import { getTranslation, formatLocaleDate } from '../localization';
import { CloudSaveData } from '../types/auth';
import {
  Cloud,
  CheckCircle2,
  RefreshCw,
  AlertOctagon,
  HardDrive,
  WifiOff,
  ShieldCheck,
  ArrowRightLeft,
  Sparkles,
} from 'lucide-react';
import { audioEngine } from '../audio/audioEngine';

interface Props {
  currentLang: LanguageCode;
  userId: string;
}

export const CloudSaveHub: React.FC<Props> = ({ currentLang, userId }) => {
  const t = getTranslation(currentLang);

  const [cloudSave, setCloudSave] = useState<CloudSaveData | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  // Conflict Resolution Modal
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictLocal, setConflictLocal] = useState<CloudSaveData | null>(null);

  useEffect(() => {
    fetchCloudSave();
  }, [userId]);

  const fetchCloudSave = async () => {
    try {
      const res = await fetch(`/api/cloud-save?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setCloudSave(data);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleForceBackup = async () => {
    setIsSyncing(true);
    audioEngine.playUISound('click');

    setTimeout(async () => {
      try {
        const res = await fetch('/api/cloud-save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            level: (cloudSave?.level || 42) + 1,
            gold: (cloudSave?.gold || 150000) + 12500,
            inventoryCount: (cloudSave?.inventoryCount || 48) + 2,
            zone: 'village',
            playtimeMinutes: (cloudSave?.playtimeMinutes || 1200) + 30,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setCloudSave(data.save);
          audioEngine.playUISound('success');
        }
      } catch (e) {
        // ignore
      } finally {
        setIsSyncing(false);
      }
    }, 1200);
  };

  const triggerConflictSimulation = () => {
    if (!cloudSave) return;
    setConflictLocal({
      ...cloudSave,
      level: cloudSave.level + 2,
      gold: cloudSave.gold + 45000,
      timestamp: new Date().toISOString(),
      hash: 'local_conflict_cache_99',
    });
    setShowConflictModal(true);
  };

  const handleResolveConflict = (choice: 'server' | 'local') => {
    if (choice === 'local' && conflictLocal) {
      setCloudSave(conflictLocal);
    }
    setShowConflictModal(false);
    audioEngine.playUISound('success');
  };

  return (
    <div className="space-y-8 text-[#E4E4E7]">
      {/* Top Banner */}
      <div className="p-6 md:p-8 bg-[#0F1116] border border-[#2D303E] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-[#1A1C23] border border-[#00F0FF] text-[#00F0FF]">
            <Cloud className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-mono uppercase tracking-wider text-white">{t.cloudSaveTitle}</h2>
              {offlineMode ? (
                <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold uppercase flex items-center gap-1">
                  <WifiOff className="w-3 h-3" />
                  {t.offlineMode}
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {t.synced}
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B] font-mono mt-0.5">
              Automatic backup, conflict resolution, and cross-platform synchronization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono uppercase text-xs">
          <button
            onClick={() => setOfflineMode(!offlineMode)}
            className={`px-4 py-2.5 border font-bold transition-all ${
              offlineMode
                ? 'bg-amber-600 text-[#0A0B0E] border-amber-500'
                : 'bg-[#1A1C23] border-[#2D303E] text-[#64748B] hover:text-white'
            }`}
          >
            {offlineMode ? 'Go Online' : 'Simulate Offline'}
          </button>

          <button
            onClick={handleForceBackup}
            disabled={isSyncing || offlineMode}
            className="px-5 py-2.5 bg-[#00F0FF] text-[#0A0B0E] font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] disabled:opacity-40 flex items-center gap-2 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? t.syncing : t.forceBackupNow}</span>
          </button>
        </div>
      </div>

      {/* Cloud Save Stats Card */}
      {cloudSave && (
        <div className="p-6 bg-[#0F1116] border border-[#2D303E] space-y-6">
          <div className="flex items-center justify-between border-b border-[#2D303E] pb-3">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-[#00F0FF]" />
              <span>Current Cloud Data Record</span>
            </h3>
            <span className="text-xs font-mono text-[#64748B]">
              HASH: {cloudSave.hash}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 bg-[#0A0B0E] border border-[#2D303E]">
              <span className="text-[#64748B] uppercase text-[10px] block mb-1">Character Level</span>
              <span className="text-lg font-bold text-white font-mono uppercase">
                LEVEL {cloudSave.level}
              </span>
            </div>

            <div className="p-4 bg-[#0A0B0E] border border-[#2D303E]">
              <span className="text-[#64748B] uppercase text-[10px] block mb-1">Inventory Gold</span>
              <span className="text-lg font-bold text-amber-400 font-mono">
                {cloudSave.gold.toLocaleString()} GOLD
              </span>
            </div>

            <div className="p-4 bg-[#0A0B0E] border border-[#2D303E]">
              <span className="text-[#64748B] uppercase text-[10px] block mb-1">Total Playtime</span>
              <span className="text-lg font-bold text-[#00F0FF] font-mono">
                {Math.floor(cloudSave.playtimeMinutes / 60)}H {cloudSave.playtimeMinutes % 60}M
              </span>
            </div>

            <div className="p-4 bg-[#0A0B0E] border border-[#2D303E]">
              <span className="text-[#64748B] uppercase text-[10px] block mb-1">{t.lastCloudBackup}</span>
              <span className="text-xs font-bold text-slate-200 font-mono">
                {formatLocaleDate(new Date(cloudSave.timestamp), currentLang)}
              </span>
            </div>
          </div>

          {/* Test Conflict Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={triggerConflictSimulation}
              className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-mono uppercase font-bold flex items-center gap-2 transition-colors"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Simulate Cloud Save Conflict</span>
            </button>
          </div>
        </div>
      )}

      {/* Conflict Resolution Modal */}
      {showConflictModal && conflictLocal && cloudSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl bg-[#0F1116] border border-amber-500/50 p-6 md:p-8 text-[#E4E4E7] shadow-2xl">
            <div className="flex items-center gap-3 border-b border-[#2D303E] pb-4 mb-6">
              <AlertOctagon className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-white">{t.conflictResolutionTitle}</h3>
                <p className="text-xs text-[#64748B] font-mono">{t.conflictResolutionDesc}</p>
              </div>
            </div>

            {/* Side-by-Side Save Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Server Save Card */}
              <div className="p-4 bg-[#0A0B0E] border border-[#2D303E] text-xs font-mono space-y-2">
                <span className="px-2 py-0.5 text-[10px] bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 font-bold uppercase block w-fit">
                  {t.serverSave}
                </span>
                <p className="text-white font-bold text-sm">LEVEL {cloudSave.level}</p>
                <p className="text-[#64748B]">GOLD: {cloudSave.gold.toLocaleString()} G</p>
                <p className="text-[#64748B] text-[10px]">
                  {formatLocaleDate(new Date(cloudSave.timestamp), currentLang)}
                </p>
                <button
                  onClick={() => handleResolveConflict('server')}
                  className="w-full mt-3 py-2 bg-[#00F0FF] text-[#0A0B0E] font-bold text-xs uppercase"
                >
                  {t.keepServerSave}
                </button>
              </div>

              {/* Local Save Card */}
              <div className="p-4 bg-[#0A0B0E] border border-amber-500/30 text-xs font-mono space-y-2">
                <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase block w-fit">
                  {t.localSave}
                </span>
                <p className="text-white font-bold text-sm">LEVEL {conflictLocal.level}</p>
                <p className="text-[#64748B]">GOLD: {conflictLocal.gold.toLocaleString()} G</p>
                <p className="text-[#64748B] text-[10px]">
                  {formatLocaleDate(new Date(conflictLocal.timestamp), currentLang)}
                </p>
                <button
                  onClick={() => handleResolveConflict('local')}
                  className="w-full mt-3 py-2 bg-amber-500 text-[#0A0B0E] font-bold text-xs uppercase"
                >
                  {t.keepLocalSave}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
