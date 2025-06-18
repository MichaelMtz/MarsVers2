import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import LeftRail from "./LeftRail";
import MiddleSection from "./MiddleSection";
import RightRail from "./RightRail";

interface DashboardProps {
  playerId: Id<"players">;
  onLogout: () => void;
}

export default function Dashboard({ playerId, onLogout }: DashboardProps) {
  const [selectedMissionId, setSelectedMissionId] = useState<Id<"missions"> | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  
  const player = useQuery(api.players.getPlayer, { playerId });
  const missions = useQuery(api.missions.getMissions) || [];

  if (!player) {
    return (
      <div className="min-h-screen bg-space flex items-center justify-center">
        <div className="text-white orbitron">Loading dashboard...</div>
      </div>
    );
  }

  const handleMissionSelect = (mission: any) => {
    setSelectedMissionId(mission._id);
    setShowProfile(false);
    setSelectedMessage(null);
  };

  const handleProfileClick = () => {
    setShowProfile(true);
    setSelectedMissionId(null);
    setSelectedMessage(null);
  };

  const handleProfileClose = () => {
    setShowProfile(false);
  };

  const handleMessageSelect = (message: any) => {
    setSelectedMessage(message);
    setSelectedMissionId(null);
    setShowProfile(false);
  };

  const handleMessageClose = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="min-h-screen bg-space p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4 h-screen game-main-grid">
        <div className="col-span-1">
          <LeftRail
            player={player}
            missions={missions}
            onMissionSelect={handleMissionSelect}
            onProfileClick={handleProfileClick}
            onLogout={onLogout}
          />
        </div>
        
        <div className="col-span-2">
          <MiddleSection
            selectedMissionId={selectedMissionId}
            showProfile={showProfile}
            selectedMessage={selectedMessage}
            player={player}
            onProfileClose={handleProfileClose}
            onMessageClose={handleMessageClose}
          />
        </div>
        
        <div className="col-span-1">
          <RightRail onMessageSelect={handleMessageSelect} />
        </div>
      </div>
    </div>
  );
}
