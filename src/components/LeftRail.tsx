import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface LeftRailProps {
  player: any;
  missions: any[];
  onMissionSelect: (mission: any) => void;
  onProfileClick: () => void;
  onLogout: () => void;
}

export default function LeftRail({
  player,
  missions,
  onMissionSelect,
  onProfileClick,
  onLogout,
}: LeftRailProps) {
  const avatarUrl = useQuery(
    api.players.getAvatarUrl,
    player.avatarId ? { storageId: player.avatarId } : "skip"
  );

  return (
    <div className="glass-panel h-full p-4 flex flex-col">
      {/* Player Info */}
      <div
        className="cursor-pointer hover:bg-white/10 p-4 rounded-lg transition-colors"
        onClick={onProfileClick}
      >
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold orbitron">
                {player.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-white font-bold orbitron">{player.name}</h3>
            <p className="text-blue-300 text-sm orbitron">{player.teamName}</p>
          </div>
        </div>
        <div className="text-center">
          <span className="text-yellow-400 font-bold orbitron text-lg">
            {player.totalScore} PTS
          </span>
        </div>
      </div>

      <div className="border-t border-white/20 my-4"></div>

      {/* Missions */}
      <div className="flex-1">
        <h4 className="text-white font-bold mb-4 orbitron">MISSIONS</h4>
        <div className="space-y-2 overflow-y-auto">
          {missions.map((mission) => (
            <button
              key={mission._id}
              onClick={() => onMissionSelect(mission)}
              className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              <div className="text-white font-semibold orbitron text-sm">
                {mission.name}
              </div>
              <div className="text-yellow-400 text-xs orbitron">
                {mission.points} PTS
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onLogout}
        className="mt-4 w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg orbitron transition-colors"
      >
        LOGOUT
      </button>
    </div>
  );
}
