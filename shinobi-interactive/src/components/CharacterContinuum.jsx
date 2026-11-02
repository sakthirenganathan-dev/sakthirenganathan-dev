import React, { useState, useRef } from 'react';
import { Users, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const FACTIONS = [
  {
    id: 'team7',
    name: 'TEAM 7 & MENTORS',
    japanese: '第七班',
    color: '#f97316',
    motto: 'The Unbreakable Will of Fire',
    characters: [
      { name: 'Naruto Uzumaki', title: 'Nine-Tails Jinchuriki · 7th Hokage', ability: 'Rasengan · Sage Mode · Six Paths Senjutsu' },
      { name: 'Sasuke Uchiha', title: 'Shadow Hokage · Last Prodigy', ability: 'Rinnegan · Eternal Mangekyo · Chidori' },
      { name: 'Sakura Haruno', title: 'Supreme Medical Kunoichi', ability: 'Strength of a Hundred Seal · Katsuyu Summon' },
      { name: 'Kakashi Hatake', title: 'The Copy Ninja · 6th Hokage', ability: 'Kamui · Raikiri · 1000 Copied Jutsu' },
    ],
  },
  {
    id: 'uchiha',
    name: 'UCHIHA BLOODLINE',
    japanese: 'うちは一族',
    color: '#c084fc',
    motto: 'Curse of Hatred & Eye of the Mind',
    characters: [
      { name: 'Madara Uchiha', title: 'Ghost of the Uchiha · Founder', ability: 'Perfect Susanoo · Tengai Shinsei · Wood Style' },
      { name: 'Itachi Uchiha', title: 'Martyr of the Hidden Leaf', ability: 'Tsukuyomi · Black Flames of Amaterasu · Totsuka' },
      { name: 'Obito Uchiha', title: 'Ten-Tails Jinchuriki', ability: 'Kamui Space-Time · Izanagi Reality Warp' },
      { name: 'Shisui Uchiha', title: 'Shisui of the Body Flicker', ability: 'Kotoamatsukami Ultimate Mind Control' },
    ],
  },
  {
    id: 'akatsuki',
    name: 'AKATSUKI ORDER',
    japanese: '暁',
    color: '#ef4444',
    motto: 'Pain Shall Teach the World Peace',
    characters: [
      { name: 'Pain / Nagato', title: 'God of the Hidden Rain', ability: 'Six Paths of Pain · Shinra Tensei · Chibaku Tensei' },
      { name: 'Konan', title: 'Angel of God', ability: 'Dance of the Shikigami · 600 Billion Explosive Paper' },
      { name: 'Kisame Hoshigaki', title: 'Monster of the Hidden Mist', ability: 'Samehada Greatsword · Water Prison Shark Dance' },
      { name: 'Deidara & Sasori', title: 'Artisan of Transient Detonation', ability: 'Explosive Clay C4 Karura · 100 Human Puppets' },
    ],
  },
  {
    id: 'hokage',
    name: 'HOKAGE & SANNIN',
    japanese: '火影 · 三忍',
    color: '#10b981',
    motto: 'Protectors of the Leaf Era',
    characters: [
      { name: 'Hashirama Senju', title: 'God of Shinobi · 1st Hokage', ability: 'True Several Thousand Hands · Wood Golem' },
      { name: 'Minato Namikaze', title: 'The Yellow Flash · 4th Hokage', ability: 'Flying Thunder God · Rasengan Creator' },
      { name: 'Jiraiya', title: 'The Toad Sage of Mount Myoboku', ability: 'Toad Stomach Trap · Sage Art Ultra-Big Ball Rasengan' },
      { name: 'Tsunade Senju', title: 'Slug Princess · 5th Hokage', ability: 'Mitotic Regeneration · Earth-Shattering Strength' },
    ],
  },
  {
    id: 'allied',
    name: 'ALLIED SHINOBI FORCES',
    japanese: '忍連合軍',
    color: '#06b6d4',
    motto: '80,000 Shinobi United Beyond Boundaries',
    characters: [
      { name: 'Gaara', title: 'Regimental Commander · Kazekage', ability: 'Sand Waterfall Imperial Funeral · Shukaku Shield' },
      { name: 'Killer B', title: 'Eight-Tails Perfect Jinchuriki', ability: 'Eight-Tails Gyuki Tailed Beast Bomb · Acrobat Blade' },
      { name: 'Might Guy', title: 'The Sublime Green Beast', ability: 'Night Guy · Eighth Inner Gate of Death' },
      { name: 'Rock Lee & Shikamaru', title: 'Lotus of Youth & Master Strategist', ability: 'Hidden Lotus · Shadow Imitation Strategem' },
    ],
  },
];

export default function CharacterContinuum() {
  const [activeFactionIndex, setActiveFactionIndex] = useState(0);
  const currentFaction = FACTIONS[activeFactionIndex];

  return (
    <section className="relative py-24 px-4 max-w-6xl mx-auto z-10 overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 font-mono text-xs tracking-widest uppercase mb-3">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>CONTINUOUS ANIME ARCHIVE</span>
        </div>
        <h2 className="font-cinzel text-3xl md:text-5xl font-black text-white uppercase tracking-wider text-glow-purple">
          NARUTO CHARACTER UNIVERSE
        </h2>
        <p className="font-mono text-xs text-slate-400 tracking-widest mt-2">
          JOURNEY THROUGH THE FIVE GREAT NATIONS &amp; LEGENDARY LEGACIES
        </p>
      </div>

      {/* Seamless Horizontal Faction Navigation Selector */}
      <div className="flex items-center justify-center flex-wrap gap-2 md:gap-4 mb-12">
        {FACTIONS.map((f, i) => (
          <button
            key={f.id}
            onClick={() => setActiveFactionIndex(i)}
            className={`px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all duration-300 border ${
              activeFactionIndex === i
                ? 'bg-slate-900 border-2 font-bold scale-105 shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                : 'bg-black/40 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            style={{
              borderColor: activeFactionIndex === i ? f.color : undefined,
              color: activeFactionIndex === i ? f.color : undefined,
            }}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Cinematic Full-Width Scene Continuum (Cardless) */}
      <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-b from-purple-950/30 via-black/80 to-slate-950/40 border border-purple-800/40 backdrop-blur-xl">
        {/* Giant Faction Watermark Kanji */}
        <span 
          className="absolute right-8 top-10 font-cinzel text-7xl md:text-9xl font-black opacity-10 select-none pointer-events-none"
          style={{ color: currentFaction.color }}
        >
          {currentFaction.japanese}
        </span>

        {/* Faction Intro */}
        <div className="mb-10 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span 
              className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border"
              style={{ color: currentFaction.color, borderColor: currentFaction.color }}
            >
              FACTION REGISTRY // {currentFaction.id.toUpperCase()}
            </span>
          </div>
          <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-wide">
            {currentFaction.name}
          </h3>
          <p className="font-mono text-sm text-slate-400 italic mt-1">
            “{currentFaction.motto}”
          </p>
        </div>

        {/* Continuous Flowing Character Stream */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {currentFaction.characters.map((char, idx) => (
            <div 
              key={char.name}
              className="relative pl-6 border-l-2 transition-all duration-300 hover:translate-x-1"
              style={{ borderColor: currentFaction.color }}
            >
              <span className="font-mono text-xs text-slate-500 block mb-1">
                // SHINOBI #{idx + 1}
              </span>
              <h4 className="text-lg md:text-xl font-bold text-white mb-0.5">
                {char.name}
              </h4>
              <p className="text-xs font-mono text-cyan-300 mb-2">
                {char.title}
              </p>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                <span className="font-mono text-purple-400 font-semibold">JUTSU MASTERY: </span>
                {char.ability}
              </p>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-purple-900/40 text-xs font-mono text-slate-400">
          <button
            onClick={() => setActiveFactionIndex((prev) => (prev > 0 ? prev - 1 : FACTIONS.length - 1))}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-cyan-400" />
            <span>PREVIOUS FACTION</span>
          </button>
          <span>{activeFactionIndex + 1} / {FACTIONS.length}</span>
          <button
            onClick={() => setActiveFactionIndex((prev) => (prev < FACTIONS.length - 1 ? prev + 1 : 0))}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>NEXT FACTION</span>
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>
    </section>
  );
}

