import { Maximize2, Minimize2, Eye } from 'lucide-react';
import React, { useState } from 'react';
import { useCoreStore } from '../integration/store/coreStore';
import { useTeamStore, useActiveTeam } from '../integration/store/teamStore';
import { useUiStore } from '../integration/store/uiStore';
import InspectorPanel from './InspectorPanel';
import UIOverlay from './UIOverlay';
import TeamFlowModal from './TeamFlowModal';
import { AuditModal } from './AuditModal';
import { TeamBadge } from './components/TeamBadge';
import { TeamOutputBadge } from './components/TeamOutputBadge';
import { AGENTIC_SETS } from '../data/agents';

interface SimulationViewProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
}

// Positions de téléportation pour chaque bureau
const TELEPORT_DESTINATIONS = [
  { id: 'vinted-ia',        label: 'Vinted IA',        revenue: '20k', color: '#ec4899', x: -26, z: 0  },
  { id: 'vente-site-web',   label: 'Vente Web',        revenue: '12k', color: '#f97316', x: -13, z: 0  },
  { id: 'pub-marques',      label: 'Pub Marques',      revenue: '10k', color: '#eab308', x: 0,   z: 0  },
  { id: 'formations-ia',    label: 'Formations',       revenue: '10k', color: '#22c55e', x: 13,  z: 0  },
  { id: 'miniatures-video', label: 'Miniatures',       revenue: '10k', color: '#3b82f6', x: 26,  z: 0  },
  { id: 'montage-ia',       label: 'Montage IA',       revenue: '10k', color: '#8b5cf6', x: -26, z: 13 },
  { id: 'bot-trading',      label: 'Bot Trading',      revenue: '10k', color: '#06b6d4', x: -13, z: 13 },
  { id: 'agent-finance',    label: 'Finance',          revenue: '10k', color: '#f43f5e', x: 0,   z: 13 },
  { id: 'json-business-1',  label: 'JSON Biz 1',       revenue: '800', color: '#84cc16', x: 13,  z: 13 },
  { id: 'json-business-2',  label: 'JSON Biz 2',       revenue: '800', color: '#a78bfa', x: 26,  z: 13 },
  { id: 'pause',            label: '🛋️ Pause',         revenue: 'QG',  color: '#64748b', x: 0,   z: 21 },
];

const SimulationView: React.FC<SimulationViewProps> = ({ canvasRef, isFullscreen, setIsFullscreen }) => {
  const { selectedNpcIndex, activeAuditTaskId, setActiveAuditTaskId } = useUiStore();
  const activeSet = useActiveTeam();
  const { setActiveTeam } = useTeamStore();
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);
  const [showTeleport, setShowTeleport] = useState(false);

  React.useEffect(() => {
    if (activeAuditTaskId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [activeAuditTaskId]);

  const handleTeleport = (dest: typeof TELEPORT_DESTINATIONS[0]) => {
    // Change l'équipe active pour le bureau choisi
    if (dest.id !== 'pause') {
      setActiveTeam(dest.id);
    }
    setShowTeleport(false);

    // Envoie un événement custom pour téléporter le joueur
    window.dispatchEvent(new CustomEvent('teleport-player', {
      detail: { x: dest.x, y: 0, z: dest.z }
    }));
  };

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-0 relative">
      {/* Header */}
      <div className="h-14 border-b border-black/5 flex items-center justify-between px-5 bg-white shrink-0">
        <div className="flex-1 flex items-center gap-4">
          <button
            onClick={() => setIsFlowModalOpen(true)}
            className="flex items-center gap-4 hover:bg-zinc-50 px-2.5 py-1.5 rounded-2xl transition-all active:scale-95 group cursor-pointer"
            title="View Team Flow"
          >
            <TeamBadge system={activeSet} />
            <div className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-300 group-hover:text-darkDelegation group-hover:border-zinc-200 transition-colors">
              <Eye size={14} />
            </div>
          </button>
          <TeamOutputBadge system={activeSet} className="hidden md:flex" />
        </div>

        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-zinc-400 hover:text-darkDelegation transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Panel"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      <div ref={canvasRef} className="flex-1 min-h-0 relative overflow-hidden bg-black/5">
        <UIOverlay />

        {/* Bouton téléportation */}
        <button
          onClick={() => setShowTeleport(!showTeleport)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-white/90 backdrop-blur-sm border border-zinc-200 rounded-full text-xs font-black uppercase tracking-widest text-zinc-600 hover:bg-white hover:text-zinc-900 transition-all shadow-lg active:scale-95 cursor-pointer"
        >
          📍 Téléporter
        </button>

        {/* Menu téléportation */}
        {showTeleport && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-sm border border-zinc-100 rounded-3xl shadow-2xl p-4 w-[360px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 text-center">
              Choisir un bureau
            </p>
            <div className="grid grid-cols-3 gap-2">
              {TELEPORT_DESTINATIONS.map(dest => (
                <button
                  key={dest.id}
                  onClick={() => handleTeleport(dest)}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-2xl hover:bg-zinc-50 active:scale-95 transition-all cursor-pointer group"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
                    style={{ background: dest.color }}
                  >
                    {dest.label[0]}
                  </div>
                  <span className="text-[9px] font-bold text-zinc-600 text-center leading-tight">
                    {dest.label}
                  </span>
                  <span
                    className="text-[8px] font-black"
                    style={{ color: dest.color }}
                  >
                    {dest.revenue}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {isFullscreen && selectedNpcIndex !== null && (
          <div className="absolute top-4 right-4 bottom-4 w-96 z-50 pointer-events-none flex flex-col gap-4">
            <InspectorPanel isFloating />
          </div>
        )}
      </div>

      {isFlowModalOpen && (
        <TeamFlowModal
          isOpen={isFlowModalOpen}
          onClose={() => setIsFlowModalOpen(false)}
          system={activeSet}
        />
      )}

      {activeAuditTaskId && (
        <AuditModal
          isOpen={!!activeAuditTaskId}
          taskId={activeAuditTaskId}
          onClose={() => setActiveAuditTaskId(null)}
        />
      )}
    </div>
  );
};

export default SimulationView;
