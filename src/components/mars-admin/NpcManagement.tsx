import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";

interface NpcManagementProps {
  onViewChange: (view: any) => void;
}

export default function NpcManagement({ onViewChange }: NpcManagementProps) {
  const [showNpcEditModal, setShowNpcEditModal] = useState(false);
  const [showNpcDeleteModal, setShowNpcDeleteModal] = useState(false);
  const [showAddNpcModal, setShowAddNpcModal] = useState(false);
  const [editingNpc, setEditingNpc] = useState<any>(null);
  const [npcName, setNpcName] = useState("");
  const [npcRealName, setNpcRealName] = useState("");
  const [npcGender, setNpcGender] = useState("");
  const [hideGender, setHideGender] = useState(false);
  const [npcHometown, setNpcHometown] = useState("");
  const [hideHometown, setHideHometown] = useState(false);
  const [npcCompany, setNpcCompany] = useState("");
  const [npcOccupation, setNpcOccupation] = useState("");
  const [npcAboutYou, setNpcAboutYou] = useState("");
  const [npcTeamName, setNpcTeamName] = useState("");
  const [favoriteHobbies, setFavoriteHobbies] = useState<string[]>([]);
  const [customHobbies, setCustomHobbies] = useState("");
  const [npcAvatarFile, setNpcAvatarFile] = useState<File | null>(null);

  const createNpc = useMutation(api.npcs.createNpc);
  const updateNpc = useMutation(api.npcs.updateNpc);
  const deleteNpc = useMutation(api.npcs.deleteNpc);
  const generateUploadUrl = useMutation(api.admin.generateUploadUrl);
  const npcs = useQuery(api.npcs.getAllNpcs) || [];

  const hobbiesOptions = [
    "Reading", "Writing", "Art", "Sports", "Cars", "Movies", 
    "Cooking", "Dancing", "Photography", "Music"
  ];

  const NpcAvatar = ({ npc }: { npc: any }) => {
    const avatarUrl = useQuery(
      api.npcs.getAvatarUrl,
      npc.avatarId ? { storageId: npc.avatarId } : "skip"
    );

    return (
      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-bold orbitron text-sm">
            {npc.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    );
  };

  const resetNpcForm = () => {
    setNpcName("");
    setNpcRealName("");
    setNpcGender("");
    setHideGender(false);
    setNpcHometown("");
    setHideHometown(false);
    setNpcCompany("");
    setNpcOccupation("");
    setNpcAboutYou("");
    setNpcTeamName("");
    setFavoriteHobbies([]);
    setCustomHobbies("");
    setNpcAvatarFile(null);
  };

  const handleHobbyChange = (hobby: string, checked: boolean) => {
    if (checked) {
      setFavoriteHobbies([...favoriteHobbies, hobby]);
    } else {
      setFavoriteHobbies(favoriteHobbies.filter(h => h !== hobby));
    }
  };

  const handleCreateNpc = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let avatarId;

      if (npcAvatarFile) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": npcAvatarFile.type },
          body: npcAvatarFile,
        });
        const json = await result.json();
        if (!result.ok) {
          throw new Error(`Upload failed: ${JSON.stringify(json)}`);
        }
        avatarId = json.storageId;
      }

      await createNpc({
        name: npcName,
        realName: npcRealName,
        gender: npcGender,
        hideGender,
        hometown: npcHometown,
        hideHometown,
        company: npcCompany,
        occupation: npcOccupation,
        aboutYou: npcAboutYou,
        teamName: npcTeamName,
        favoriteHobbies,
        customHobbies,
        avatarId,
      });

      toast.success("NPC created successfully!");
      setShowAddNpcModal(false);
      resetNpcForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create NPC");
    }
  };

  const handleUpdateNpc = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let avatarId = editingNpc.avatarId;

      if (npcAvatarFile) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": npcAvatarFile.type },
          body: npcAvatarFile,
        });
        const json = await result.json();
        if (!result.ok) {
          throw new Error(`Upload failed: ${JSON.stringify(json)}`);
        }
        avatarId = json.storageId;
      }

      const updates: any = {};
      if (npcName !== editingNpc.name) updates.name = npcName;
      if (npcRealName !== editingNpc.realName) updates.realName = npcRealName;
      if (npcGender !== editingNpc.gender) updates.gender = npcGender;
      if (hideGender !== editingNpc.hideGender) updates.hideGender = hideGender;
      if (npcHometown !== editingNpc.hometown) updates.hometown = npcHometown;
      if (hideHometown !== editingNpc.hideHometown) updates.hideHometown = hideHometown;
      if (npcCompany !== editingNpc.company) updates.company = npcCompany;
      if (npcOccupation !== editingNpc.occupation) updates.occupation = npcOccupation;
      if (npcAboutYou !== editingNpc.aboutYou) updates.aboutYou = npcAboutYou;
      if (npcTeamName !== editingNpc.teamName) updates.teamName = npcTeamName;
      if (JSON.stringify(favoriteHobbies) !== JSON.stringify(editingNpc.favoriteHobbies)) updates.favoriteHobbies = favoriteHobbies;
      if (customHobbies !== editingNpc.customHobbies) updates.customHobbies = customHobbies;
      if (avatarId !== editingNpc.avatarId) updates.avatarId = avatarId;

      if (Object.keys(updates).length > 0) {
        await updateNpc({ npcId: editingNpc._id, ...updates });
        toast.success("NPC updated successfully!");
      }

      setShowNpcEditModal(false);
      setEditingNpc(null);
      resetNpcForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update NPC");
    }
  };

  const handleDeleteNpc = async () => {
    try {
      await deleteNpc({ npcId: editingNpc._id });
      toast.success("NPC deleted successfully!");
      setShowNpcDeleteModal(false);
      setEditingNpc(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete NPC");
    }
  };

  const openEditNpcModal = (npc: any) => {
    setEditingNpc(npc);
    setNpcName(npc.name);
    setNpcRealName(npc.realName || "");
    setNpcGender(npc.gender || "");
    setHideGender(npc.hideGender || false);
    setNpcHometown(npc.hometown || "");
    setHideHometown(npc.hideHometown || false);
    setNpcCompany(npc.company || "");
    setNpcOccupation(npc.occupation || "");
    setNpcAboutYou(npc.aboutYou || "");
    setNpcTeamName(npc.teamName || "");
    setFavoriteHobbies(npc.favoriteHobbies || []);
    setCustomHobbies(npc.customHobbies || "");
    setNpcAvatarFile(null);
    setShowNpcEditModal(true);
  };

  const openDeleteNpcModal = (npc: any) => {
    setEditingNpc(npc);
    setShowNpcDeleteModal(true);
  };

  const openAddNpcModal = () => {
    resetNpcForm();
    setShowAddNpcModal(true);
  };

  return (
    <div className="mars-glass-panel h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white orbitron">SYSTEM NPCS</h2>
        <button onClick={openAddNpcModal} className="mars-button">
          ADD NPC
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto">
        {npcs.map((npc) => (
          <div
            key={npc._id}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="flex items-center space-x-4 flex-1">
              <NpcAvatar npc={npc} />
              <div className="grid grid-cols-4 gap-4 flex-1">
                <div>
                  <div className="text-white font-semibold orbitron text-sm">
                    {npc.name}
                  </div>
                </div>
                <div>
                  <div className="text-purple-300 orbitron text-sm">
                    {npc.realName}
                  </div>
                </div>
                <div>
                  <div className="text-green-400 orbitron text-sm">
                    {npc.teamName || "No Team"}
                  </div>
                </div>
                <div>
                  <div className="text-white/60 orbitron text-sm">
                    {npc.company || "No Company"}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => openEditNpcModal(npc)}
                className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded orbitron text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => openDeleteNpcModal(npc)}
                className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded orbitron text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add NPC Modal */}
      {showAddNpcModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="mars-glass-panel p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white orbitron mb-4">ADD NPC</h3>
            <form onSubmit={handleCreateNpc} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 orbitron">Name</label>
                  <input
                    type="text"
                    value={npcName}
                    onChange={(e) => setNpcName(e.target.value)}
                    className="mars-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 orbitron">Real Name</label>
                  <input
                    type="text"
                    value={npcRealName}
                    onChange={(e) => setNpcRealName(e.target.value)}
                    className="mars-input"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 orbitron">Gender</label>
                  <select
                    value={npcGender}
                    onChange={(e) => setNpcGender(e.target.value)}
                    className="mars-input"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer Not to Say">Prefer Not to Say</option>
                  </select>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={hideGender}
                      onChange={(e) => setHideGender(e.target.checked)}
                      className="w-4 h-4 text-red-600 bg-white/10 border-red-400/30 rounded focus:ring-red-400 focus:ring-2"
                    />
                    <span className="ml-2 text-white orbitron text-sm">Hide gender</span>
                  </div>
                </div>
                <div>
                  <label className="block text-white mb-2 orbitron">Hometown</label>
                  <input
                    type="text"
                    value={npcHometown}
                    onChange={(e) => setNpcHometown(e.target.value)}
                    className="mars-input"
                  />
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={hideHometown}
                      onChange={(e) => setHideHometown(e.target.checked)}
                      className="w-4 h-4 text-red-600 bg-white/10 border-red-400/30 rounded focus:ring-red-400 focus:ring-2"
                    />
                    <span className="ml-2 text-white orbitron text-sm">Hide hometown</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 orbitron">Company</label>
                  <select
                    value={npcCompany}
                    onChange={(e) => setNpcCompany(e.target.value)}
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
                    value={npcOccupation}
                    onChange={(e) => setNpcOccupation(e.target.value)}
                    className="mars-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 orbitron">Team Name</label>
                <select
                  value={npcTeamName}
                  onChange={(e) => setNpcTeamName(e.target.value)}
                  className="mars-input"
                >
                  <option value="">Select Team</option>
                  <option value="Zinnia">Zinnia</option>
                  <option value="EagleEyes">EagleEyes</option>
                  <option value="RocknRoll">RocknRoll</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2 orbitron">About You</label>
                <textarea
                  value={npcAboutYou}
                  onChange={(e) => setNpcAboutYou(e.target.value)}
                  className="mars-input h-24 resize-none"
                  placeholder="Tell us about this NPC..."
                />
              </div>

              <div>
                <label className="block text-white mb-2 orbitron">Favorite Hobbies</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {hobbiesOptions.map((hobby) => (
                    <div key={hobby} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={favoriteHobbies.includes(hobby)}
                        onChange={(e) => handleHobbyChange(hobby, e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-white/10 border-red-400/30 rounded focus:ring-red-400 focus:ring-2"
                      />
                      <span className="ml-2 text-white orbitron text-sm">{hobby}</span>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={customHobbies}
                  onChange={(e) => setCustomHobbies(e.target.value)}
                  className="mars-input"
                  placeholder="Custom hobbies (comma separated)"
                />
              </div>

              <div>
                <label className="block text-white mb-2 orbitron">Avatar Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNpcAvatarFile(e.target.files?.[0] || null)}
                  className="mars-input"
                />
              </div>

              <div className="flex space-x-2">
                <button type="submit" className="mars-button flex-1">
                  CREATE NPC
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddNpcModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded orbitron"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit NPC Modal */}
      {showNpcEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="mars-glass-panel p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white orbitron mb-4">EDIT NPC</h3>
            <form onSubmit={handleUpdateNpc} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 orbitron">Name</label>
                  <input
                    type="text"
                    value={npcName}
                    onChange={(e) => setNpcName(e.target.value)}
                    className="mars-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 orbitron">Real Name</label>
                  <input
                    type="text"
                    value={npcRealName}
                    onChange={(e) => setNpcRealName(e.target.value)}
                    className="mars-input"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 orbitron">Gender</label>
                  <select
                    value={npcGender}
                    onChange={(e) => setNpcGender(e.target.value)}
                    className="mars-input"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer Not to Say">Prefer Not to Say</option>
                  </select>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={hideGender}
                      onChange={(e) => setHideGender(e.target.checked)}
                      className="w-4 h-4 text-red-600 bg-white/10 border-red-400/30 rounded focus:ring-red-400 focus:ring-2"
                    />
                    <span className="ml-2 text-white orbitron text-sm">Hide gender</span>
                  </div>
                </div>
                <div>
                  <label className="block text-white mb-2 orbitron">Hometown</label>
                  <input
                    type="text"
                    value={npcHometown}
                    onChange={(e) => setNpcHometown(e.target.value)}
                    className="mars-input"
                  />
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={hideHometown}
                      onChange={(e) => setHideHometown(e.target.checked)}
                      className="w-4 h-4 text-red-600 bg-white/10 border-red-400/30 rounded focus:ring-red-400 focus:ring-2"
                    />
                    <span className="ml-2 text-white orbitron text-sm">Hide hometown</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 orbitron">Company</label>
                  <select
                    value={npcCompany}
                    onChange={(e) => setNpcCompany(e.target.value)}
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
                    value={npcOccupation}
                    onChange={(e) => setNpcOccupation(e.target.value)}
                    className="mars-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 orbitron">Team Name</label>
                <select
                  value={npcTeamName}
                  onChange={(e) => setNpcTeamName(e.target.value)}
                  className="mars-input"
                >
                  <option value="">Select Team</option>
                  <option value="Zinnia">Zinnia</option>
                  <option value="EagleEyes">EagleEyes</option>
                  <option value="RocknRoll">RocknRoll</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2 orbitron">About You</label>
                <textarea
                  value={npcAboutYou}
                  onChange={(e) => setNpcAboutYou(e.target.value)}
                  className="mars-input h-24 resize-none"
                  placeholder="Tell us about this NPC..."
                />
              </div>

              <div>
                <label className="block text-white mb-2 orbitron">Favorite Hobbies</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {hobbiesOptions.map((hobby) => (
                    <div key={hobby} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={favoriteHobbies.includes(hobby)}
                        onChange={(e) => handleHobbyChange(hobby, e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-white/10 border-red-400/30 rounded focus:ring-red-400 focus:ring-2"
                      />
                      <span className="ml-2 text-white orbitron text-sm">{hobby}</span>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={customHobbies}
                  onChange={(e) => setCustomHobbies(e.target.value)}
                  className="mars-input"
                  placeholder="Custom hobbies (comma separated)"
                />
              </div>

              <div>
                <label className="block text-white mb-2 orbitron">Avatar Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNpcAvatarFile(e.target.files?.[0] || null)}
                  className="mars-input"
                />
              </div>

              <div className="flex space-x-2">
                <button type="submit" className="mars-button flex-1">
                  UPDATE NPC
                </button>
                <button
                  type="button"
                  onClick={() => setShowNpcEditModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded orbitron"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete NPC Modal */}
      {showNpcDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="mars-glass-panel p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white orbitron mb-4">CONFIRM DELETE</h3>
            <p className="text-white mb-6">
              Are you sure you want to delete NPC "{editingNpc?.name}"?
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleDeleteNpc}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded orbitron flex-1"
              >
                DELETE
              </button>
              <button
                onClick={() => setShowNpcDeleteModal(false)}
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
