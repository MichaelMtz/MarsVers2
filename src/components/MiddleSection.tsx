import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface MiddleSectionProps {
  selectedMission: any;
  showProfile: boolean;
  player: any;
  onProfileClose: () => void;
}

export default function MiddleSection({
  selectedMission,
  showProfile,
  player,
  onProfileClose,
}: MiddleSectionProps) {
  const [name, setName] = useState(player.name);
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const updatePlayer = useMutation(api.players.updatePlayer);
  const generateUploadUrl = useMutation(api.players.generateUploadUrl);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let avatarId = player.avatarId;
      
      if (selectedFile) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedFile.type },
          body: selectedFile,
        });
        const json = await result.json();
        if (!result.ok) {
          throw new Error(`Upload failed: ${JSON.stringify(json)}`);
        }
        avatarId = json.storageId;
      }

      const updates: any = {};
      if (name !== player.name) updates.name = name;
      if (password) updates.password = password;
      if (avatarId !== player.avatarId) updates.avatarId = avatarId;

      if (Object.keys(updates).length > 0) {
        await updatePlayer({ playerId: player._id, ...updates });
        toast.success("Profile updated successfully!");
      }
      
      onProfileClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    }
  };

  if (showProfile) {
    return (
      <div className="glass-panel h-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white orbitron">PLAYER PROFILE</h2>
          <button
            onClick={onProfileClose}
            className="text-white hover:text-red-400 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-6">
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
            <label className="block text-white mb-2 orbitron">New Password (optional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="game-input"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div>
            <label className="block text-white mb-2 orbitron">Avatar Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="game-input"
            />
          </div>

          <button type="submit" className="game-button w-full">
            UPDATE PROFILE
          </button>
        </form>
      </div>
    );
  }

  if (selectedMission) {
    return (
      <div className="glass-panel h-full p-6">
        <h2 className="text-3xl font-bold text-white mb-4 orbitron">
          {selectedMission.name}
        </h2>
        
        <div className="mb-6">
          <span className="inline-block bg-yellow-500 text-black px-3 py-1 rounded-full font-bold orbitron">
            {selectedMission.points} POINTS
          </span>
        </div>

        <div className="text-white/80 text-lg leading-relaxed mb-8">
          {selectedMission.description}
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-bold mb-2 orbitron">Mission Status</h4>
            <p className="text-blue-300 orbitron">
              {selectedMission.isActive ? "ACTIVE" : "INACTIVE"}
            </p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-bold mb-2 orbitron">Difficulty</h4>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded ${
                    i < Math.floor(selectedMission.points / 10)
                      ? "bg-yellow-400"
                      : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel h-full p-6 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4 orbitron">
          WELCOME TO THE DASHBOARD
        </h2>
        <p className="text-white/60 orbitron">
          Select a mission from the left panel to view details
        </p>
      </div>
    </div>
  );
}
