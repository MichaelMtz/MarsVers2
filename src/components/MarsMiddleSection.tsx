import PlayerManagement from "./mars-admin/PlayerManagement";
import MissionManagement from "./mars-admin/MissionManagement";
import MessageManagement from "./mars-admin/MessageManagement";
import AdminManagement from "./mars-admin/AdminManagement";
import NpcManagement from "./mars-admin/NpcManagement";

interface MarsMiddleSectionProps {
  currentView: 'welcome' | 'profile' | 'users' | 'addUser' | 'players' | 'addPlayer' | 'editPlayer' | 'npcs' | 'addNpc' | 'editNpc' | 'missions' | 'addMission' | 'editMission' | 'messages';
  admin: any;
  allAdmins: any[];
  selectedAdmin: any;
  selectedMission: any;
  selectedPlayer: any;
  selectedNpc: any;
  onViewChange: (view: 'welcome' | 'profile' | 'users' | 'addUser' | 'players' | 'addPlayer' | 'editPlayer' | 'npcs' | 'addNpc' | 'editNpc' | 'missions' | 'addMission' | 'editMission' | 'messages') => void;
  onAdminSelect: (admin: any) => void;
  onMissionEdit: (mission: any) => void;
  onPlayerEdit: (player: any) => void;
  onNpcEdit: (npc: any) => void;
}

export default function MarsMiddleSection({
  currentView,
  admin,
  allAdmins,
  selectedAdmin,
  selectedMission,
  selectedPlayer,
  selectedNpc,
  onViewChange,
  onAdminSelect,
  onMissionEdit,
  onPlayerEdit,
  onNpcEdit,
}: MarsMiddleSectionProps) {

  // Player management views
  if (currentView === 'players') {
    return <PlayerManagement onViewChange={onViewChange} />;
  }

  // NPC management views
  if (currentView === 'npcs') {
    return <NpcManagement onViewChange={onViewChange} />;
  }

  // Mission management views
  if (currentView === 'missions' || currentView === 'addMission') {
    return (
      <MissionManagement
        currentView={currentView}
        selectedMission={selectedMission}
        onViewChange={onViewChange}
      />
    );
  }

  // Message management view
  if (currentView === 'messages') {
    return <MessageManagement />;
  }

  // Admin management views
  if (currentView === 'profile' || currentView === 'users' || currentView === 'addUser') {
    return (
      <AdminManagement
        currentView={currentView}
        admin={admin}
        allAdmins={allAdmins}
        onViewChange={onViewChange}
      />
    );
  }

  // Welcome view
  return (
    <div className="mars-glass-panel h-full p-6 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4 orbitron">
          WELCOME TO MARS ADMIN
        </h2>
        <p className="text-white/60 orbitron">
          Select an option from the left panel to manage the system
        </p>
      </div>
    </div>
  );
}
