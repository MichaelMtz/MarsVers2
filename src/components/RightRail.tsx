import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function RightRail() {
  const playerLeaderboard = useQuery(api.players.getPlayerLeaderboard) || [];
  const teamLeaderboard = useQuery(api.players.getTeamLeaderboard) || [];

  return (
    <div className="space-y-4 h-full">
      {/* Player Leaderboard */}
      <div className="glass-panel p-4 h-1/2">
        <h3 className="text-white font-bold mb-4 orbitron">PLAYER LEADERBOARD</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {playerLeaderboard.map((player, index) => (
            <div
              key={player._id}
              className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10"
            >
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 font-bold orbitron w-6">
                  #{index + 1}
                </span>
                <div>
                  <div className="text-white font-semibold orbitron text-sm">
                    {player.name}
                  </div>
                  <div className="text-blue-300 text-xs orbitron">
                    {player.teamName}
                  </div>
                </div>
              </div>
              <span className="text-yellow-400 font-bold orbitron">
                {player.totalScore}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Team Leaderboard */}
      <div className="glass-panel p-4 h-1/2">
        <h3 className="text-white font-bold mb-4 orbitron">TEAM LEADERBOARD</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {teamLeaderboard.map((team, index) => (
            <div
              key={team._id}
              className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10"
            >
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 font-bold orbitron w-6">
                  #{index + 1}
                </span>
                <div>
                  <div className="text-white font-semibold orbitron text-sm">
                    {team.name}
                  </div>
                  <div className="text-blue-300 text-xs orbitron">
                    {team.memberCount} members
                  </div>
                </div>
              </div>
              <span className="text-yellow-400 font-bold orbitron">
                {team.totalScore}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
