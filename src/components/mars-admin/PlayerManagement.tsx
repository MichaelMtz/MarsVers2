import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";

interface PlayerManagementProps {
  onViewChange: (view: any) => void;
}

export default function PlayerManagement({ onViewChange }: PlayerManagementProps) {
  const [showPlayerEditModal, setShowPlayerEditModal] = useState(false);
  const [showPlayerDeleteModal, setShowPlayerDeleteModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<any>(null);
  const [playerName, setPlayerName] = useState("");
  const [playerPassword, setPlayerPassword] = useState("");
  const [playerTeamName, setPlayerTeamName] = useState("");
  const [playerRealName, setPlayerRealName] = useState("");
  const [playerGender, setPlayerGender] = useState("");
  const [playerHometown, setPlayerHometown] = useState("");
  const [playerCompany, setPlayerCompany] = useState("");
  const [playerOccupation, setPlayerOccupation] = useState("");
  const [playerAboutYou, setPlayerAboutYou] = useState("");
  const [playerPersonalWebsite, setPlayerPersonalWebsite] = useState("");
  const [playerAvatarFile, setPlayerAvatarFile] = useState<File | null>(null);

  const createPlayer = useMutation(api.players.createPlayer);
  const updatePlayer = useMutation(api.players.updatePlayer);
  const deletePlayer = useMutation(api.admin.deletePlayer);
  const generateUploadUrl = useMutation(api.admin.generateUploadUrl);
  const players = useQuery(api.players.getAllPlayers) || [];

  const PlayerAvatar = ({ player }: { player: any }) => {
    const avatarUrl = useQuery(
      api.players.getAvatarUrl,
      player.avatarId ? { storageId: player.avatarId } : "skip"
    );

    return (
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-bold orbitron text-sm">
            {player.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    );
  };

  const resetPlayerForm = () => {
    setPlayerName("");
    setPlayerPassword("");
    setPlayerTeamName("");
    setPlayerRealName("");
    setPlayerGender("");
    setPlayerHometown("");
    setPlayerCompany("");
    setPlayerOccupation("");
    setPlayerAboutYou("");
    setPlayerPersonalWebsite("");
    setPlayerAvatarFile(null);
  };

  const handleCreatePlayer = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let avatarId;

      if (playerAvatarFile) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": playerAvatarFile.type },
          body: playerAvatarFile,
        });
        const json = await result.json();
        if (!result.ok) {
          throw new Error(`Upload failed: ${JSON.stringify(json)}`);
        }
        avatarId = json.storageId;
      }

      await createPlayer({
        name: playerName,
        password: playerPassword,
        teamName: playerTeamName,
        avatarId,
      });

      toast.success("Player created successfully!");
      setShowAddPlayerModal(false);
      resetPlayerForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create player");
    }
  };

  const handleUpdatePlayer = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let avatarId = editingPlayer.avatarId;

      if (playerAvatarFile) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": playerAvatarFile.type },
          body: playerAvatarFile,
        });
        const json = await result.json();
        if (!result.ok) {
          throw new Error(`Upload failed: ${JSON.stringify(json)}`);
        }
        avatarId = json.storageId;
      }

      const updates: any = {};
      if (playerName !== editingPlayer.name) updates.name = playerName;
      if (playerPassword) updates.password = playerPassword;
      if (playerRealName !== editingPlayer.realName) updates.realName = playerRealName;
      if (playerGender !== editingPlayer.gender) updates.gender = playerGender;
      if (playerHometown !== editingPlayer.hometown) updates.hometown = playerHometown;
      if (playerCompany !== editingPlayer.company) updates.company = playerCompany;
      if (playerOccupation !== editingPlayer.occupation) updates.occupation = playerOccupation;
      if (playerAboutYou !== editingPlayer.aboutYou) updates.aboutYou = playerAboutYou;
      if (playerPersonalWebsite !== editingPlayer.personalWebsite) updates.personalWebsite = playerPersonalWebsite;
      if (avatarId !== editingPlayer.avatarId) updates.avatarId = avatarId;

      if (Object.keys(updates).length > 0) {
        await updatePlayer({ playerId: editingPlayer._id, ...updates });
        toast.success("Player updated successfully!");
      }

      setShowPlayerEditModal(false);
      setEditingPlayer(null);
      resetPlayerForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update player");
    }
  };

  const handleDeletePlayer = async () => {
    try {
      await deletePlayer({ playerId: editingPlayer._id });
      toast.success("Player deleted successfully!");
      setShowPlayerDeleteModal(false);
      setEditingPlayer(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete player");
    }
  };

  const openEditPlayerModal = (player: any) => {
    setEditingPlayer(player);
    setPlayerName(player.name);
    setPlayerPassword("");
    setPlayerTeamName(player.teamName);
    setPlayerRealName(player.realName || "");
    setPlayerGender(player.gender || "");
    setPlayerHometown(player.hometown || "");
    setPlayerCompany(player.company || "");
    setPlayerOccupation(player.occupation || "");
    setPlayerAboutYou(player.aboutYou || "");
    setPlayerPersonalWebsite(player.personalWebsite || "");
    setPlayerAvatarFile(null);
    setShowPlayerEditModal(true);
  };

  const openDeletePlayerModal = (player: any) => {
    setEditingPlayer(player);
    setShowPlayerDeleteModal(true);
  };

  const openAddPlayerModal = () => {
    resetPlayerForm();
    setShowAddPlayerModal(true);
  };

  return (
    <div className="mars-glass-panel h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white orbitron">SYSTEM PLAYERS</h2>
        <button onClick={openAddPlayerModal} className="mars-button">
          ADD PLAYER
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto">
        {players.map((player) => (
          <div
            key={player._id}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="flex items-center space-x-4 flex-1">
              <PlayerAvatar player={player} />
              <div className="grid grid-cols-4 gap-4 flex-1">
                <div>
                  <div className="text-white font-semibold orbitron text-sm">
                    {player.name}
                  </div>
                </div>
                <div>
                  <div className="text-blue-300 orbitron text-sm">
                    {player.teamName}
                  </div>
                </div>
                <div>
                  <div className="text-yellow-400 orbitron text-sm font-bold">
                    {player.totalScore} PTS
                  </div>
                </div>
                <div>
                  <div className="text-white/60 orbitron text-sm">
                    {player.realName || "Not provided"}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => openEditPlayerModal(player)}
                className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded orbitron text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => openDeletePlayerModal(player)}
                className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded orbitron text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Player Modal */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="mars-glass-panel p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white orbitron mb-4">ADD PLAYER</h3>
            <form onSubmit={handleCreatePlayer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 orbitron">Player Name</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="mars-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 orbitron">Password</label>
                  <input
                    type="password"
                    value={playerPassword}
                    onChange={(e) => setPlayerPassword(e.target.value)}
                    className="mars-input"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-white mb-2 orbitron">Team Name</label>
                <input
                  type="text"
                  value={playerTeamName}
                  onChange={(e) => setPlayerTeamName(e.target.value)}
                  className="mars-input"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2 orbitron">Avatar Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPlayerAvatarFile(e.target.files?.[0] || null)}
                  className="mars-input"
                />
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="mars-button flex-1">
                  CREATE PLAYER
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPlayerModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded orbitron"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Player Modal */}
      {showPlayerEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="mars-glass-panel p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white orbitron mb-4">EDIT PLAYER</h3>
            <form onSubmit={handleUpdatePlayer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 orbitron">Player Name</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="mars-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 orbitron">Real Name</label>
                  <input
                    type="text"
                    value={playerRealName}
                    onChange={(e) => setPlayerRealName(e.target.value)}
                    className="mars-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white mb-2 orbitron">New Password (optional)</label>
                <input
                  type="password"
                  value={playerPassword}
                  onChange={(e) => setPlayerPassword(e.target.value)}
                  className="mars-input"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 orbitron">Gender</label>
                  <select
                    value={playerGender}
                    onChange={(e) => setPlayerGender(e.target.value)}
                    className="mars-input"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer Not to Say">Prefer Not to Say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white mb-2 orbitron">Hometown</label>
                  <input
                    type="text"
                    value={playerHometown}
                    onChange={(e) => setPlayerHometown(e.target.value)}
                    className="mars-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 orbitron">Company</label>
                  <select
                    value={playerCompany}
                    onChange={(e) => setPlayerCompany(e.target.value)}
                    className="mars-input"
                  >
                    <option value="">Select Company</option>
                    <option value="Atomic Orbit">Atomic Orbit</option>
                    <option value="Zero-G">Zero-G</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white mb-2 orbitron">Occupation</label>
                  <input
                    type="text"
                    value={playerOccupation}
                    onChange={(e) => setPlayerOccupation(e.target.value)}
                    className="mars-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white mb-2 orbitron">About You</label>
                <textarea
                  value={playerAboutYou}
                  onChange={(e) => setPlayerAboutYou(e.target.value)}
                  className="mars-input h-24 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <label className="block text-white mb-2 orbitron">Personal Website</label>
                <input
                  type="url"
                  value={playerPersonalWebsite}
                  onChange={(e) => setPlayerPersonalWebsite(e.target.value)}
                  className="mars-input"
                  placeholder="https://your-website.com"
                />
              </div>
              <div>
                <label className="block text-white mb-2 orbitron">Avatar Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPlayerAvatarFile(e.target.files?.[0] || null)}
                  className="mars-input"
                />
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="mars-button flex-1">
                  UPDATE PLAYER
                </button>
                <button
                  type="button"
                  onClick={() => setShowPlayerEditModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded orbitron"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Player Modal */}
      {showPlayerDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="mars-glass-panel p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white orbitron mb-4">CONFIRM DELETE</h3>
            <p className="text-white mb-6">
              Are you sure you want to delete player "{editingPlayer?.name}"?
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleDeletePlayer}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded orbitron flex-1"
              >
                DELETE
              </button>
              <button
                onClick={() => setShowPlayerDeleteModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded orbitron flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
