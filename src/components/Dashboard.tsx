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
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  
  const player = useQuery(api.players.getPlayer, { playerId });
  const missions = useQuery(api.missions.getMissions) || [];

  if (!player) {
    return (
      <div className="min-h-screen bg-space flex items-center justify-center">
        <div className="text-white orbitron">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 h-screen">
        <div className="col-span-3">
          <LeftRail
            player={player}
            missions={missions}
            onMissionSelect={setSelectedMission}
            onProfileClick={() => setShowProfile(true)}
            onLogout={onLogout}
          />
        </div>
        
        <div className="col-span-6">
          <MiddleSection
            selectedMission={selectedMission}
            showProfile={showProfile}
            player={player}
            onProfileClose={() => setShowProfile(false)}
          />
        </div>
        
        <div className="col-span-3">
          <RightRail />
        </div>
      </div>
    </div>
  );
}
