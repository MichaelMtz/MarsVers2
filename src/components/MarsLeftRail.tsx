import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface MarsLeftRailProps {
  admin: any;
  onProfileClick: () => void;
  onUsersClick: () => void;
  onPlayersClick: () => void;
  onNpcsClick: () => void;
  onMessagesClick: () => void;
  onMissionsClick: () => void;
  onLogout: () => void;
}

export default function MarsLeftRail({
  admin,
  onProfileClick,
  onUsersClick,
  onPlayersClick,
  onNpcsClick,
  onMessagesClick,
  onMissionsClick,
  onLogout,
}: MarsLeftRailProps) {
  const avatarUrl = useQuery(
    api.admin.getAvatarUrl,
    admin.avatarId ? { storageId: admin.avatarId } : "skip"
  );

  return (
    <div className="mars-glass-panel h-full p-4 flex flex-col admin-left-rail-container-grid">
      {/* Admin Info */}
      <div
        className="cursor-pointer hover:bg-white/10 p-4 rounded-lg transition-colors admin-left-rail-container-user"
        onClick={onProfileClick}
      >
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold orbitron">
                {admin.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-white font-bold orbitron">{admin.username}</h3>
            <p className="text-red-300 text-sm orbitron">Mars Admin</p>
          </div>
        </div>
        <div className="text-center">
          <span className="text-orange-400 font-bold orbitron text-sm">
            Last Login: {new Date(admin.lastLoginDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="border-t border-white/20 my-4"></div>

      {/* Admin Management Cards */}
      <div className="flex-1 admin-left-rail-container-admin-btn space-y-4">
        {/* Admin Users */}
        <button
          onClick={onUsersClick}
          className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
        >
          <div className="text-white font-bold orbitron">
            ADMIN USERS
          </div>
          <div className="text-red-300 text-sm orbitron">
            Manage system administrators
          </div>
        </button>

        {/* Players */}
        <button
          onClick={onPlayersClick}
          className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
        >
          <div className="text-white font-bold orbitron">
            PLAYERS
          </div>
          <div className="text-red-300 text-sm orbitron">
            Manage system players
          </div>
        </button>

        {/* NPCs */}
        <button
          onClick={onNpcsClick}
          className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
        >
          <div className="text-white font-bold orbitron">
            NPCS
          </div>
          <div className="text-red-300 text-sm orbitron">
            Manage system NPCs
          </div>
        </button>

        {/* Missions */}
        <button
          onClick={onMissionsClick}
          className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
        >
          <div className="text-white font-bold orbitron">
            MISSIONS
          </div>
          <div className="text-red-300 text-sm orbitron">
            Manage system missions
          </div>
        </button>

        {/* Messages */}
        <button
          onClick={onMessagesClick}
          className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
        >
          <div className="text-white font-bold orbitron">
            MESSAGES
          </div>
          <div className="text-red-300 text-sm orbitron">
            Manage system messages
          </div>
        </button>
      </div>

      <button
        onClick={onLogout}
        className="mt-4 w-full py-2 px-4 bg-red-700 hover:bg-red-800 text-white rounded-lg orbitron transition-colors admin-left-rail-container-logout"
      >
        LOGOUT
      </button>
    </div>
  );
}
