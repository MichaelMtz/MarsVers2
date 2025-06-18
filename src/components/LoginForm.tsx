import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface LoginFormProps {
  onLogin: (playerId: Id<"players">) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [teamName, setTeamName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [isNewTeam, setIsNewTeam] = useState(false);

  const createPlayer = useMutation(api.players.createPlayer);
  const loginPlayer = useMutation(api.players.loginPlayer);
  const teams = useQuery(api.players.getAllTeams) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        const playerId = await loginPlayer({ name, password });
        onLogin(playerId);
        toast.success("Welcome back!");
      } else {
        const finalTeamName = isNewTeam ? teamName : selectedTeam;
        if (!finalTeamName) {
          toast.error("Please select or enter a team name");
          return;
        }
        
        const playerId = await createPlayer({
          name,
          password,
          teamName: finalTeamName,
        });
        onLogin(playerId);
        toast.success("Account created! Welcome to the game!");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div className="glass-panel p-8 w-full max-w-md">
      <h1 className="text-3xl font-bold text-center mb-8 text-white orbitron">
        SPACE DASHBOARD
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white mb-2 orbitron">Player Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="game-input"
            required
          />
        </div>

        <div>
          <label className="block text-white mb-2 orbitron">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="game-input"
            required
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-white mb-2 orbitron">Team</label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="existing-team"
                  checked={!isNewTeam}
                  onChange={() => setIsNewTeam(false)}
                  className="text-blue-400"
                />
                <label htmlFor="existing-team" className="text-white orbitron">
                  Join Existing Team
                </label>
              </div>
              
              {!isNewTeam && (
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="game-input"
                >
                  <option value="">Select a team...</option>
                  {teams.map((team: any) => (
                    <option key={team._id} value={team.name}>
                      {team.name}
                    </option>
                  ))}
                </select>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="new-team"
                  checked={isNewTeam}
                  onChange={() => setIsNewTeam(true)}
                  className="text-blue-400"
                />
                <label htmlFor="new-team" className="text-white orbitron">
                  Create New Team
                </label>
              </div>
              
              {isNewTeam && (
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  className="game-input"
                />
              )}
            </div>
          </div>
        )}

        <button type="submit" className="game-button w-full">
          {isLogin ? "LOGIN" : "CREATE ACCOUNT"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-400 hover:text-blue-300 orbitron"
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
