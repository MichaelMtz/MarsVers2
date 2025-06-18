import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import MDEditor from '@uiw/react-md-editor';

export default function MessageManagement() {
  const [showMessageEditModal, setShowMessageEditModal] = useState(false);
  const [showMessageDeleteModal, setShowMessageDeleteModal] = useState(false);
  const [showAddMessageModal, setShowAddMessageModal] = useState(false);
  const [editingMessage, setEditingMessage] = useState<any>(null);
  const [messageTo, setMessageTo] = useState("");
  const [messageFrom, setMessageFrom] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [messagePriority, setMessagePriority] = useState<"low" | "medium" | "high">("medium");

  const createMessage = useMutation(api.messages.createMessage);
  const updateMessage = useMutation(api.messages.updateMessage);
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const messages = useQuery(api.messages.getMessages) || [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-white';
    }
  };

  const resetMessageForm = () => {
    setMessageTo("");
    setMessageFrom("");
    setMessageSubject("");
    setMessageBody("");
    setMessagePriority("medium");
  };

  const handleCreateMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createMessage({
        to: messageTo,
        from: messageFrom,
        subject: messageSubject,
        body: messageBody,
        priority: messagePriority,
      });

      toast.success("Message created successfully!");
      setShowAddMessageModal(false);
      resetMessageForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create message");
    }
  };

  const handleEditMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateMessage({
        messageId: editingMessage._id,
        to: messageTo,
        from: messageFrom,
        subject: messageSubject,
        body: messageBody,
        priority: messagePriority,
      });

      toast.success("Message updated successfully!");
      setShowMessageEditModal(false);
      setEditingMessage(null);
      resetMessageForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update message");
    }
  };

  const handleDeleteMessage = async () => {
    try {
      await deleteMessage({ messageId: editingMessage._id });
      toast.success("Message deleted successfully!");
      setShowMessageDeleteModal(false);
      setEditingMessage(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete message");
    }
  };

  const openEditMessageModal = (message: any) => {
    setEditingMessage(message);
    setMessageTo(message.to);
    setMessageFrom(message.from);
    setMessageSubject(message.subject);
    setMessageBody(message.body);
    setMessagePriority(message.priority);
    setShowMessageEditModal(true);
  };

  const openDeleteMessageModal = (message: any) => {
    setEditingMessage(message);
    setShowMessageDeleteModal(true);
  };

  const openAddMessageModal = () => {
    resetMessageForm();
    setShowAddMessageModal(true);
  };

  return (
    <div className="mars-glass-panel h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white orbitron">SYSTEM MESSAGES</h2>
        <button onClick={openAddMessageModal} className="mars-button">
          ADD MESSAGE
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message._id}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="flex-1 grid grid-cols-4 gap-4">
              <div>
                <div className="text-white font-semibold orbitron text-sm">
                  {message.subject}
                </div>
              </div>
              <div>
                <div className="text-white orbitron text-sm">
                  {message.to}
                </div>
              </div>
              <div>
                <div className="text-white orbitron text-sm">
                  {new Date(message.sendDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className={`orbitron text-sm font-bold ${getPriorityColor(message.priority)}`}>
                  {message.priority.toUpperCase()}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => openEditMessageModal(message)}
                className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded orbitron text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => openDeleteMessageModal(message)}
                className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded orbitron text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Message Modal */}
      {showAddMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="mars-glass-panel p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white orbitron mb-4">ADD MESSAGE</h3>
            <form onSubmit={handleCreateMessage} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 orbitron">To</label>
                  <input
                    type="text"
                    value={messageTo}
                    onChange={(e) => setMessageTo(e.target.value)}
                    className="mars-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 orbitron">From</label>
                  <input
                    type="text"
                    value={messageFrom}
                    onChange={(e) => setMessageFrom(e.target.value)}
                    className="mars-input"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-white mb-2 orbitron">Subject</label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="mars-input"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2 orbitron">Priority</label>
                <select
                  value={messagePriority}
                  onChange={(e) => setMessagePriority(e.target.value as "low" | "medium" | "high")}
                  className="mars-input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-2 orbitron">Body</label>
                <div className="border border-red-400/30 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
                  <MDEditor
                    value={messageBody}
                    onChange={(value) => setMessageBody(value || "")}
                    data-color-mode="dark"
                    preview="edit"
                    hideToolbar={false}
                    visibleDragbar={false}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="mars-button flex-1">
                  CREATE MESSAGE
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMessageModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded orbitron"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Message Modal */}
      {showMessageEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="mars-glass-panel p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white orbitron mb-4">EDIT MESSAGE</h3>
            <form onSubmit={handleEditMessage} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 orbitron">To</label>
                  <input
                    type="text"
                    value={messageTo}
                    onChange={(e) => setMessageTo(e.target.value)}
                    className="mars-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 orbitron">From</label>
                  <input
                    type="text"
                    value={messageFrom}
                    onChange={(e) => setMessageFrom(e.target.value)}
                    className="mars-input"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-white mb-2 orbitron">Subject</label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="mars-input"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2 orbitron">Priority</label>
                <select
                  value={messagePriority}
                  onChange={(e) => setMessagePriority(e.target.value as "low" | "medium" | "high")}
                  className="mars-input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-2 orbitron">Body</label>
                <div className="border border-red-400/30 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
                  <MDEditor
                    value={messageBody}
                    onChange={(value) => setMessageBody(value || "")}
                    data-color-mode="dark"
                    preview="edit"
                    hideToolbar={false}
                    visibleDragbar={false}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="mars-button flex-1">
                  UPDATE MESSAGE
                </button>
                <button
                  type="button"
                  onClick={() => setShowMessageEditModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded orbitron"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Message Modal */}
      {showMessageDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="mars-glass-panel p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white orbitron mb-4">CONFIRM DELETE</h3>
            <p className="text-white mb-6">
              Are you sure you want to delete the message "{editingMessage?.subject}"?
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleDeleteMessage}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded orbitron flex-1"
              >
                DELETE
              </button>
              <button
                onClick={() => setShowMessageDeleteModal(false)}
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
