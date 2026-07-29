import React, { useState, useEffect } from 'react';
import { LanguageCode } from '../types/i18n';
import { getTranslation } from '../localization';
import { Character, CharacterClass, CharacterCustomization } from '../types/auth';
import {
  Sword,
  Shield,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Server,
  Zap,
  Activity,
  Flame,
  UserCheck,
  RotateCcw,
} from 'lucide-react';
import { audioEngine } from '../audio/audioEngine';

interface Props {
  currentLang: LanguageCode;
  userId: string;
}

const DEFAULT_CUSTOMIZATION: CharacterCustomization = {
  hairStyle: 1,
  hairColor: '#facc15',
  skinTone: '#fde047',
  outfitColor: '#3b82f6',
  weaponGlow: '#60a5fa',
};

export const CharacterHub: React.FC<Props> = ({ currentLang, userId }) => {
  const t = getTranslation(currentLang);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [serverName, setServerName] = useState('Aetheria-East-1');

  // Creation Wizard
  const [isCreating, setIsCreating] = useState(false);
  const [newCharName, setNewCharName] = useState('');
  const [selectedClass, setSelectedClass] = useState<CharacterClass>('Warrior');
  const [customization, setCustomization] = useState<CharacterCustomization>(DEFAULT_CUSTOMIZATION);

  // Modals
  const [deleteModalChar, setDeleteModalChar] = useState<Character | null>(null);
  const [confirmNameInput, setConfirmNameInput] = useState('');
  const [renameModalChar, setRenameModalChar] = useState<Character | null>(null);
  const [renameInput, setRenameInput] = useState('');

  useEffect(() => {
    fetchCharacters();
  }, [userId]);

  const fetchCharacters = async () => {
    try {
      const res = await fetch(`/api/characters?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setCharacters(data);
        if (data.length > 0 && !selectedCharId) {
          setSelectedCharId(data[0].id);
        }
      }
    } catch (e) {
      // ignore
    }
  };

  const handleCreateCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharName.trim()) return;

    audioEngine.playUISound('levelUp');

    try {
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: newCharName.trim(),
          characterClass: selectedClass,
          customization,
          serverName,
        }),
      });

      if (res.ok) {
        const newChar = await res.json();
        setCharacters((prev) => [...prev, newChar]);
        setSelectedCharId(newChar.id);
        setIsCreating(false);
        setNewCharName('');
      }
    } catch (e) {
      // ignore
    }
  };

  const handleDeleteCharacter = async () => {
    if (!deleteModalChar) return;
    if (confirmNameInput !== deleteModalChar.name) return;

    audioEngine.playUISound('delete');

    try {
      const res = await fetch(`/api/characters/${deleteModalChar.id}?userId=${userId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCharacters((prev) => prev.filter((c) => c.id !== deleteModalChar.id));
        setDeleteModalChar(null);
        setConfirmNameInput('');
      }
    } catch (e) {
      // ignore
    }
  };

  const handleRenameCharacter = async () => {
    if (!renameModalChar || !renameInput.trim()) return;

    audioEngine.playUISound('success');

    try {
      const res = await fetch(`/api/characters/${renameModalChar.id}/rename`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName: renameInput.trim(), userId }),
      });
      if (res.ok) {
        setCharacters((prev) =>
          prev.map((c) => (c.id === renameModalChar.id ? { ...c, name: renameInput.trim() } : c))
        );
        setRenameModalChar(null);
        setRenameInput('');
      }
    } catch (e) {
      // ignore
    }
  };

  const selectedChar = characters.find((c) => c.id === selectedCharId) || characters[0];

  return (
    <div className="space-y-8">
      {/* Realm / Server Selector Bar */}
      <div className="p-4 bg-[#0F1116] border border-[#2D303E] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#E4E4E7]">
        <div className="flex items-center gap-3">
          <Server className="w-5 h-5 text-[#00F0FF]" />
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B]">
              {t.serverSelect}
            </h3>
            <p className="text-sm font-bold font-mono text-white">{serverName}</p>
          </div>
        </div>

        <select
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          className="px-3.5 py-2 bg-[#1A1C23] border border-[#2D303E] text-xs font-mono text-white outline-none cursor-pointer focus:border-[#00F0FF]"
        >
          <option value="Aetheria-East-1">Aetheria-East-1 (Ping: 24ms)</option>
          <option value="Aetheria-West-2">Aetheria-West-2 (Ping: 45ms)</option>
          <option value="Valhalla-EU">Valhalla-EU (Ping: 82ms)</option>
          <option value="Kyoto-Asia">Kyoto-Asia (Ping: 110ms)</option>
        </select>
      </div>

      {/* Main Grid: Character List vs Character Visualizer & Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Character Slot Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
              <Sword className="w-4 h-4 text-[#00F0FF]" />
              <span>{t.characterSelectTitle}</span>
            </h3>
            <span className="text-xs font-mono text-[#64748B]">
              {characters.length} / 5 SLOTS
            </span>
          </div>

          <div className="space-y-3">
            {characters.map((char) => {
              const isSelected = selectedCharId === char.id;
              return (
                <div
                  key={char.id}
                  onClick={() => {
                    setSelectedCharId(char.id);
                    setIsCreating(false);
                    audioEngine.playUISound('click');
                  }}
                  className={`p-4 border cursor-pointer transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#00F0FF]/15 border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'bg-[#0F1116] border-[#2D303E] hover:border-[#64748B]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold font-mono text-white">{char.name}</h4>
                        <span className="px-2 py-0.5 text-[10px] font-mono bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 font-bold">
                          LV.{char.level}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-[#64748B] mt-0.5 uppercase">
                        {char.characterClass} • {char.serverName}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenameModalChar(char);
                          setRenameInput(char.name);
                        }}
                        title={t.renameTicketTitle}
                        className="p-2 bg-[#1A1C23] border border-[#2D303E] hover:border-[#00F0FF] text-[#E4E4E7] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteModalChar(char);
                          setConfirmNameInput('');
                        }}
                        title={t.deleteCharacter}
                        className="p-2 bg-rose-950/80 border border-rose-500/40 hover:bg-rose-900 text-rose-300 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {characters.length < 5 && (
              <button
                onClick={() => {
                  setIsCreating(true);
                  audioEngine.playUISound('click');
                }}
                className="w-full py-4 border-2 border-dashed border-[#2D303E] hover:border-[#00F0FF] bg-[#0F1116] text-[#64748B] hover:text-[#00F0FF] font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{t.createCharacter}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Visual Stage / Creation Wizard (8 cols) */}
        <div className="lg:col-span-8">
          {isCreating ? (
            <div className="p-6 md:p-8 bg-[#0F1116] border border-[#00F0FF]/50 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#2D303E] pb-4">
                <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#00F0FF]" />
                  <span>{t.createCharacter}</span>
                </h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-xs font-mono uppercase text-[#64748B] hover:text-white"
                >
                  {t.cancel}
                </button>
              </div>

              <form onSubmit={handleCreateCharacter} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#64748B] mb-2">
                    {t.newCharacterName}
                  </label>
                  <input
                    type="text"
                    required
                    value={newCharName}
                    onChange={(e) => setNewCharName(e.target.value)}
                    placeholder="e.g., Kaelen, Lyra, Thorin"
                    className="w-full px-4 py-2.5 bg-[#0A0B0E] border border-[#2D303E] focus:border-[#00F0FF] text-sm font-mono text-white outline-none transition-colors"
                  />
                </div>

                {/* Class Selection */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#64748B] mb-2">
                    {t.characterClass}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {(['Warrior', 'Mage', 'Archer', 'Assassin', 'Paladin'] as CharacterClass[]).map(
                      (cls) => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => {
                            setSelectedClass(cls);
                            audioEngine.playUISound('click');
                          }}
                          className={`py-3 px-2 border text-center font-mono uppercase text-xs tracking-wider transition-all ${
                            selectedClass === cls
                              ? 'bg-[#00F0FF] text-[#0A0B0E] font-bold border-[#00F0FF]'
                              : 'bg-[#1A1C23] border-[#2D303E] text-[#64748B] hover:text-white'
                          }`}
                        >
                          <span className="block">{cls}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Color Customizer Controls */}
                <div className="p-4 bg-[#0A0B0E] border border-[#2D303E] space-y-4">
                  <h4 className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-[0.2em]">
                    {t.customizeAppearance}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                    <div>
                      <label className="block text-[#64748B] uppercase text-[10px] mb-1">{t.hairColor}</label>
                      <input
                        type="color"
                        value={customization.hairColor}
                        onChange={(e) =>
                          setCustomization({ ...customization, hairColor: e.target.value })
                        }
                        className="w-full h-8 bg-[#1A1C23] border border-[#2D303E] cursor-pointer p-0.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[#64748B] uppercase text-[10px] mb-1">{t.outfitColor}</label>
                      <input
                        type="color"
                        value={customization.outfitColor}
                        onChange={(e) =>
                          setCustomization({ ...customization, outfitColor: e.target.value })
                        }
                        className="w-full h-8 bg-[#1A1C23] border border-[#2D303E] cursor-pointer p-0.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[#64748B] uppercase text-[10px] mb-1">{t.weaponGlow}</label>
                      <input
                        type="color"
                        value={customization.weaponGlow}
                        onChange={(e) =>
                          setCustomization({ ...customization, weaponGlow: e.target.value })
                        }
                        className="w-full h-8 bg-[#1A1C23] border border-[#2D303E] cursor-pointer p-0.5"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2 font-mono uppercase text-xs">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-5 py-2.5 bg-[#1A1C23] border border-[#2D303E] text-[#64748B] hover:text-white"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#00F0FF] text-[#0A0B0E] font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                  >
                    {t.createCharacter}
                  </button>
                </div>
              </form>
            </div>
          ) : selectedChar ? (
            <div className="p-6 md:p-8 bg-[#0F1116] border border-[#2D303E] shadow-2xl space-y-6">
              {/* Character Visual Avatar Display Stage */}
              <div className="relative h-64 bg-[#0A0B0E] border border-[#2D303E] flex items-center justify-center overflow-hidden">
                {/* Glow Aura */}
                <div
                  className="absolute w-40 h-40 rounded-full blur-3xl opacity-40 animate-pulse"
                  style={{ backgroundColor: selectedChar.customization.weaponGlow }}
                />

                {/* Character Sprite Simulation Card */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className="w-24 h-24 border-4 shadow-2xl flex items-center justify-center transition-all"
                    style={{
                      borderColor: selectedChar.customization.outfitColor,
                      backgroundColor: selectedChar.customization.hairColor,
                    }}
                  >
                    <Sword className="w-12 h-12 text-[#0A0B0E]" />
                  </div>
                  <h3 className="text-xl font-bold font-mono text-white mt-3 uppercase">{selectedChar.name}</h3>
                  <p className="text-xs text-[#00F0FF] font-mono font-bold uppercase tracking-wider">
                    {selectedChar.characterClass} • LEVEL {selectedChar.level}
                  </p>
                </div>
              </div>

              {/* Combat Stats & Attributes */}
              <div>
                <h4 className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#00F0FF]" />
                  <span>{t.stats}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-[#0A0B0E] border border-[#2D303E]">
                    <div className="flex justify-between text-[#64748B] mb-1 uppercase">
                      <span>HP (Health)</span>
                      <span className="text-[#00F0FF] font-bold">{selectedChar.stats.hp}</span>
                    </div>
                    <div className="w-full bg-[#1A1C23] h-1.5 overflow-hidden">
                      <div className="bg-[#00F0FF] h-full w-[80%]" />
                    </div>
                  </div>

                  <div className="p-3 bg-[#0A0B0E] border border-[#2D303E]">
                    <div className="flex justify-between text-[#64748B] mb-1 uppercase">
                      <span>MP (Mana)</span>
                      <span className="text-purple-400 font-bold">{selectedChar.stats.mp}</span>
                    </div>
                    <div className="w-full bg-[#1A1C23] h-1.5 overflow-hidden">
                      <div className="bg-purple-500 h-full w-[65%]" />
                    </div>
                  </div>

                  <div className="p-3 bg-[#0A0B0E] border border-[#2D303E]">
                    <div className="flex justify-between text-[#64748B] mb-1 uppercase">
                      <span>Attack</span>
                      <span className="text-amber-400 font-bold">{selectedChar.stats.attack}</span>
                    </div>
                    <div className="w-full bg-[#1A1C23] h-1.5 overflow-hidden">
                      <div className="bg-amber-500 h-full w-[75%]" />
                    </div>
                  </div>

                  <div className="p-3 bg-[#0A0B0E] border border-[#2D303E]">
                    <div className="flex justify-between text-[#64748B] mb-1 uppercase">
                      <span>Defense</span>
                      <span className="text-blue-400 font-bold">{selectedChar.stats.defense}</span>
                    </div>
                    <div className="w-full bg-[#1A1C23] h-1.5 overflow-hidden">
                      <div className="bg-blue-500 h-full w-[70%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 bg-[#0F1116] border border-[#2D303E] text-center text-[#64748B] font-mono uppercase">
              No character selected.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalChar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0F1116] border border-rose-500/40 p-6 text-[#E4E4E7]">
            <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-rose-400 mb-2">{t.deleteConfirmationTitle}</h3>
            <p className="text-xs text-[#64748B] mb-4 font-mono">{t.deleteConfirmationDesc}</p>
            <p className="text-xs text-amber-300 font-mono mb-2 uppercase">{t.typeCharacterNameToConfirm}</p>
            <p className="text-sm font-bold font-mono text-white mb-2">{deleteModalChar.name}</p>
            <input
              type="text"
              value={confirmNameInput}
              onChange={(e) => setConfirmNameInput(e.target.value)}
              placeholder={deleteModalChar.name}
              className="w-full px-3.5 py-2.5 bg-[#0A0B0E] border border-[#2D303E] focus:border-rose-500 text-xs font-mono text-white mb-4 outline-none"
            />
            <div className="flex justify-end gap-2 font-mono uppercase text-xs">
              <button
                onClick={() => setDeleteModalChar(null)}
                className="px-4 py-2 bg-[#1A1C23] border border-[#2D303E] text-[#64748B]"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDeleteCharacter}
                disabled={confirmNameInput !== deleteModalChar.name}
                className="px-4 py-2 bg-rose-600 disabled:opacity-40 text-xs font-bold text-white"
              >
                {t.deleteCharacter}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Ticket Modal */}
      {renameModalChar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0F1116] border border-[#2D303E] p-6 text-[#E4E4E7]">
            <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-white mb-2">{t.renameTicketTitle}</h3>
            <p className="text-xs text-[#64748B] mb-4 font-mono">{t.newCharacterName}</p>
            <input
              type="text"
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0A0B0E] border border-[#2D303E] focus:border-[#00F0FF] text-xs font-mono text-white mb-4 outline-none"
            />
            <div className="flex justify-end gap-2 font-mono uppercase text-xs">
              <button
                onClick={() => setRenameModalChar(null)}
                className="px-4 py-2 bg-[#1A1C23] border border-[#2D303E] text-[#64748B]"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleRenameCharacter}
                className="px-4 py-2 bg-[#00F0FF] text-[#0A0B0E] font-bold"
              >
                {t.useRenameTicket}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
