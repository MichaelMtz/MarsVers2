import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface RightRailProps {
  onMessageSelect: (message: any) => void;
}

export default function RightRail({ onMessageSelect }: RightRailProps) {
  const [activeTab, setActiveTab] = useState<'players' | 'teams'>('players');
  const playerLeaderboard = useQuery(api.players.getPlayerLeaderboard) || [];
  const teamLeaderboard = useQuery(api.players.getTeamLeaderboard) || [];
  const messages = useQuery(api.messages.getMessagesByRecipient, { to: "all" }) || [];
  const markAsRead = useMutation(api.messages.markMessageAsRead);

  const handleMessageClick = async (message: any) => {
    if (!message.messageRead) {
      await markAsRead({ messageId: message._id });
    }
    onMessageSelect(message);
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

  return (
    <div className="glass-panel h-full p-4 flex flex-col">
      {/* Leaderboards Section */}
      <div className="flex-1 mb-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-4 border-b border-white/20">
            <button
              onClick={() => setActiveTab('players')}
              className={`pb-3 px-1 text-xs font-bold orbitron transition-colors relative ${
                activeTab === 'players'
                  ? 'text-blue-400'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              PLAYERS
              {activeTab === 'players' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`pb-3 px-1 text-xs font-bold orbitron transition-colors relative ${
                activeTab === 'teams'
                  ? 'text-blue-400'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              TEAMS
              {activeTab === 'teams' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full"></div>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="h-full">
          {activeTab === 'players' ? (
            <div>
              <h3 className="text-white font-bold mb-4 orbitron">PLAYER LEADERBOARD</h3>
              <div className="space-y-2 overflow-y-auto">
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
          ) : (
            <div>
              <h3 className="text-white font-bold mb-4 orbitron">TEAM LEADERBOARD</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
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
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/20 my-4"></div>

      {/* Inbox Section */}
      <div className="flex-1">
        <h3 className="text-white font-bold mb-4 orbitron">INBOX</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message._id}
              onClick={() => handleMessageClick(message)}
              className={`p-2 rounded border cursor-pointer transition-colors ${
                message.messageRead 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                  : 'bg-blue-500/20 border-blue-400/30 hover:bg-blue-500/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs">{getPriorityIcon(message.priority)}</span>
                    <div className={`text-white font-semibold orbitron text-xs truncate ${
                      !message.messageRead ? 'font-bold' : ''
                    }`}>
                      {message.subject}
                    </div>
                  </div>
                  <div className="text-blue-300 text-xs orbitron mb-1">
                    From: {message.from}
                  </div>
                  <div className="text-white/60 text-xs orbitron">
                    {new Date(message.sendDate).toLocaleDateString()}
                  </div>
                </div>
                {!message.messageRead && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-1"></div>
                )}
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-white/60 text-center py-4 orbitron text-sm">
              No messages in inbox
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
