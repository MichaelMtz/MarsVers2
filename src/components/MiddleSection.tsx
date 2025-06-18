import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import MDEditor from '@uiw/react-md-editor';
import rehypeRewrite from "rehype-rewrite";

interface MiddleSectionProps {
  selectedMissionId: Id<"missions"> | null;
  showProfile: boolean;
  selectedMessage: any;
  player: any;
  onProfileClose: () => void;
  onMessageClose: () => void;
}

export default function MiddleSection({
  selectedMissionId,
  showProfile,
  selectedMessage,
  player,
  onProfileClose,
  onMessageClose,
}: MiddleSectionProps) {
  const [name, setName] = useState(player.name);
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // New profile fields
  const [realName, setRealName] = useState(player.realName || "");
  const [gender, setGender] = useState(player.gender || "");
  const [hideGender, setHideGender] = useState(player.hideGender || false);
  const [hometown, setHometown] = useState(player.hometown || "");
  const [hideHometown, setHideHometown] = useState(player.hideHometown || false);
  const [company, setCompany] = useState(player.company || "");
  const [occupation, setOccupation] = useState(player.occupation || "");
  const [aboutYou, setAboutYou] = useState(player.aboutYou || "");
  const [favoriteHobbies, setFavoriteHobbies] = useState<string[]>(player.favoriteHobbies || []);
  const [customHobbies, setCustomHobbies] = useState(player.customHobbies || "");
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [personalWebsite, setPersonalWebsite] = useState(player.personalWebsite || "");

  const updatePlayer = useMutation(api.players.updatePlayer);
  const generateUploadUrl = useMutation(api.players.generateUploadUrl);
  
  // Query the selected mission using Convex
  const selectedMission = useQuery(
    api.missions.getMission,
    selectedMissionId ? { missionId: selectedMissionId } : "skip"
  );

  // Query ID card URL
  const idCardUrl = useQuery(
    api.players.getAvatarUrl,
    player.idCardId ? { storageId: player.idCardId } : "skip"
  );

  const hobbyOptions = [
    "Reading", "Writing", "Art", "Sports", "Cars", "Movies", 
    "Cooking", "Dancing", "Photography", "Music"
  ];

  const handleHobbyChange = (hobby: string, checked: boolean) => {
    if (checked) {
      setFavoriteHobbies([...favoriteHobbies, hobby]);
    } else {
      setFavoriteHobbies(favoriteHobbies.filter(h => h !== hobby));
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let avatarId = player.avatarId;
      let idCardId = player.idCardId;
      
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

      if (idCardFile) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": idCardFile.type },
          body: idCardFile,
        });
        const json = await result.json();
        if (!result.ok) {
          throw new Error(`ID Card upload failed: ${JSON.stringify(json)}`);
        }
        idCardId = json.storageId;
      }

      const updates: any = {};
      if (name !== player.name) updates.name = name;
      if (password) updates.password = password;
      if (avatarId !== player.avatarId) updates.avatarId = avatarId;
      if (realName !== player.realName) updates.realName = realName;
      if (gender !== player.gender) updates.gender = gender;
      if (hideGender !== player.hideGender) updates.hideGender = hideGender;
      if (hometown !== player.hometown) updates.hometown = hometown;
      if (hideHometown !== player.hideHometown) updates.hideHometown = hideHometown;
      if (company !== player.company) updates.company = company;
      if (occupation !== player.occupation) updates.occupation = occupation;
      if (aboutYou !== player.aboutYou) updates.aboutYou = aboutYou;
      if (JSON.stringify(favoriteHobbies) !== JSON.stringify(player.favoriteHobbies)) updates.favoriteHobbies = favoriteHobbies;
      if (customHobbies !== player.customHobbies) updates.customHobbies = customHobbies;
      if (idCardId !== player.idCardId) updates.idCardId = idCardId;
      if (personalWebsite !== player.personalWebsite) updates.personalWebsite = personalWebsite;

      if (Object.keys(updates).length > 0) {
        await updatePlayer({ playerId: player._id, ...updates });
        toast.success("Profile updated successfully!");
      }
      
      onProfileClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-white';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  if (selectedMessage) {
    return (
      <div className="glass-panel h-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white orbitron">MESSAGE</h2>
          <button
            onClick={onMessageClose}
            className="text-white hover:text-red-400 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Message Header */}
          <div className="border-b border-white/20 pb-4">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-lg">{getPriorityIcon(selectedMessage.priority)}</span>
              <h3 className="text-xl font-bold text-white orbitron">
                {selectedMessage.subject}
              </h3>
              <span className={`px-2 py-1 rounded text-xs font-bold orbitron ${getPriorityColor(selectedMessage.priority)}`}>
                {selectedMessage.priority.toUpperCase()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/60 orbitron">From:</span>
                <span className="text-white orbitron ml-2">{selectedMessage.from}</span>
              </div>
              <div>
                <span className="text-white/60 orbitron">To:</span>
                <span className="text-white orbitron ml-2">{selectedMessage.to}</span>
              </div>
              <div>
                <span className="text-white/60 orbitron">Date:</span>
                <span className="text-white orbitron ml-2">
                  {new Date(selectedMessage.sendDate).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-white/60 orbitron">Status:</span>
                <span className="text-green-400 orbitron ml-2">
                  {selectedMessage.messageRead ? 'Read' : 'Unread'}
                </span>
              </div>
            </div>
          </div>

          {/* Message Body */}
          <div>
            <h4 className="text-white font-bold mb-4 orbitron">MESSAGE CONTENT</h4>
            <div className="border border-blue-400/30 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
              <MDEditor.Markdown 
                source={selectedMessage.body} 
                style={{ 
                  backgroundColor: 'transparent',
                  color: 'white',
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  padding: '16px'
                }}
                data-color-mode="dark"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showProfile) {
    return (
      <div className="glass-panel h-full p-6 overflow-y-auto player-middle-section">
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
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-white mb-2 orbitron">Real Name</label>
              <input
                type="text"
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                className="game-input"
              />
            </div>
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

          {/* Gender */}
          <div>
            <label className="block text-white mb-2 orbitron">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="game-input"
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
                className="w-4 h-4 text-blue-600 bg-white/10 border-blue-400/30 rounded focus:ring-blue-400 focus:ring-2"
              />
              <span className="ml-2 text-white orbitron text-sm">Hide gender from other players</span>
            </div>
          </div>

          {/* Hometown */}
          <div>
            <label className="block text-white mb-2 orbitron">Hometown</label>
            <input
              type="text"
              value={hometown}
              onChange={(e) => setHometown(e.target.value)}
              className="game-input"
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={hideHometown}
                onChange={(e) => setHideHometown(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white/10 border-blue-400/30 rounded focus:ring-blue-400 focus:ring-2"
              />
              <span className="ml-2 text-white orbitron text-sm">Hide hometown from other players</span>
            </div>
          </div>

          {/* Company and Occupation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2 orbitron">Company</label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="game-input"
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
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="game-input"
              />
            </div>
          </div>

          {/* About You */}
          <div>
            <label className="block text-white mb-2 orbitron">About You</label>
            <textarea
              value={aboutYou}
              onChange={(e) => setAboutYou(e.target.value)}
              className="game-input h-24 resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Favorite Hobbies */}
          <div>
            <label className="block text-white mb-2 orbitron">Favorite Hobbies</label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {hobbyOptions.map((hobby) => (
                <div key={hobby} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={favoriteHobbies.includes(hobby)}
                    onChange={(e) => handleHobbyChange(hobby, e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-white/10 border-blue-400/30 rounded focus:ring-blue-400 focus:ring-2"
                  />
                  <span className="ml-2 text-white orbitron text-sm">{hobby}</span>
                </div>
              ))}
            </div>
            <input
              type="text"
              value={customHobbies}
              onChange={(e) => setCustomHobbies(e.target.value)}
              className="game-input"
              placeholder="Other hobbies (comma separated)"
            />
          </div>

          {/* Personal Website */}
          <div>
            <label className="block text-white mb-2 orbitron">Personal Website</label>
            <input
              type="url"
              value={personalWebsite}
              onChange={(e) => setPersonalWebsite(e.target.value)}
              className="game-input"
              placeholder="https://your-website.com"
            />
          </div>

          {/* Avatar Image */}
          <div>
            <label className="block text-white mb-2 orbitron">Avatar Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="game-input"
            />
          </div>

          {/* ID Card */}
          <div>
            <label className="block text-white mb-2 orbitron">ID Card</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setIdCardFile(e.target.files?.[0] || null)}
              className="game-input"
            />
            {idCardUrl && (
              <div className="mt-2">
                <img src={idCardUrl} alt="Current ID Card" className="w-32 h-20 object-cover rounded border border-white/20" />
              </div>
            )}
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
      <div className="glass-panel h-full player-middle-section p-6">
        <h2 className="text-3xl font-bold text-white mb-4 orbitron">
          {selectedMission.name}
        </h2>
        
        <div className="mb-6">
          <span className="inline-block bg-yellow-500 text-black px-3 py-1 rounded-full font-bold orbitron">
            {selectedMission.points} POINTS
          </span>
        </div>

        <div className="mb-8">
          <div className="border border-blue-400/30 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
            <MDEditor.Markdown 
              source={selectedMission.description} 
              style={{ 
                backgroundColor: 'transparent',
                color: 'white',
                fontFamily: 'Orbitron, monospace',
                fontSize: '16px',
                lineHeight: '1.6',
                padding: '16px'
              }}
              rehypeRewrite={(node, index, parent) => {
								//console.info("**rehypeRewrite found", node);
				        if (node.type === "element" && node.tagName === "a") {
				          node.properties.target = "_blank";
				          console.info("**Anchor found", node.properties);
				        }
				      }}
							data-color-mode="dark"
            />
          </div>
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
          Select a mission from the left panel to view details or check your inbox for new messages
        </p>
      </div>
    </div>
  );
}
