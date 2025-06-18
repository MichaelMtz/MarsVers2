import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import MarsLeftRail from "./MarsLeftRail";
import MarsMiddleSection from "./MarsMiddleSection";

interface MarsAdminDashboardProps {
  adminId: Id<"admins">;
  onLogout: () => void;
}

export default function MarsAdminDashboard({ adminId, onLogout }: MarsAdminDashboardProps) {
  const [currentView, setCurrentView] = useState<'welcome' | 'profile' | 'users' | 'addUser' | 'players' | 'addPlayer' | 'editPlayer' | 'npcs' | 'addNpc' | 'editNpc' | 'missions' | 'addMission' | 'editMission' | 'messages'>('welcome');
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [selectedNpc, setSelectedNpc] = useState<any>(null);
  
  const admin = useQuery(api.admin.getAdmin, { adminId });
  const allAdmins = useQuery(api.admin.getAllAdmins) || [];

  if (!admin) {
    return (
      <div className="min-h-screen bg-mars flex items-center justify-center">
        <div className="text-white orbitron">Loading Mars Admin...</div>
      </div>
    );
  }

  const handleMissionEdit = (mission: any) => {
    setSelectedMission(mission);
    setCurrentView('editMission');
  };

  const handlePlayerEdit = (player: any) => {
    setSelectedPlayer(player);
    setCurrentView('editPlayer');
  };

  const handleNpcEdit = (npc: any) => {
    setSelectedNpc(npc);
    setCurrentView('editNpc');
  };

  return (
    <div className="min-h-screen bg-mars p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4 h-screen admin-main-grid">
        <div className="col-span-1">
          <MarsLeftRail
            admin={admin}
            onProfileClick={() => setCurrentView('profile')}
            onUsersClick={() => setCurrentView('users')}
            onPlayersClick={() => setCurrentView('players')}
            onNpcsClick={() => setCurrentView('npcs')}
            onMessagesClick={() => setCurrentView('messages')}
            onMissionsClick={() => setCurrentView('missions')}
            onLogout={onLogout}
          />
        </div>
        
        <div className="col-span-3">
          <MarsMiddleSection
            currentView={currentView}
            admin={admin}
            allAdmins={allAdmins}
            selectedAdmin={selectedAdmin}
            selectedMission={selectedMission}
            selectedPlayer={selectedPlayer}
            selectedNpc={selectedNpc}
            onViewChange={setCurrentView}
            onAdminSelect={setSelectedAdmin}
            onMissionEdit={handleMissionEdit}
            onPlayerEdit={handlePlayerEdit}
            onNpcEdit={handleNpcEdit}
          />
        </div>
      </div>
    </div>
  );
}
