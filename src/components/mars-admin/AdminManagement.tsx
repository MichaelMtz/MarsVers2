import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";

interface AdminManagementProps {
  currentView: 'users' | 'addUser' | 'profile';
  admin: any;
  allAdmins: any[];
  onViewChange: (view: any) => void;
}

export default function AdminManagement({ 
  currentView, 
  admin, 
  allAdmins, 
  onViewChange 
}: AdminManagementProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [username, setUsername] = useState(admin?.username || "");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const updateAdmin = useMutation(api.admin.updateAdmin);
  const createAdmin = useMutation(api.admin.createAdmin);
  const deleteAdmin = useMutation(api.admin.deleteAdmin);
  const generateUploadUrl = useMutation(api.admin.generateUploadUrl);

  const AdminAvatar = ({ adminUser }: { adminUser: any }) => {
    const avatarUrl = useQuery(
      api.admin.getAvatarUrl,
      adminUser.avatarId ? { storageId: adminUser.avatarId } : "skip"
    );

    return (
      <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-bold orbitron text-sm">
            {adminUser.username.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    );
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let avatarId = admin.avatarId;

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
      if (username !== admin.username) updates.username = username;
      if (password) updates.password = password;
      if (avatarId !== admin.avatarId) updates.avatarId = avatarId;

      if (Object.keys(updates).length > 0) {
        await updateAdmin({ adminId: admin._id, ...updates });
        toast.success("Profile updated successfully!");
      }

      setUsername(admin.username);
      setPassword("");
      setSelectedFile(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let avatarId;

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

      await createAdmin({
        username,
        password,
        avatarId,
      });

      toast.success("Admin user created successfully!");
      onViewChange('users');

      setUsername("");
      setPassword("");
      setSelectedFile(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create admin");
    }
  };

  const handleEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let avatarId = editingAdmin.avatarId;

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
      if (username !== editingAdmin.username) updates.username = username;
      if (password) updates.password = password;
      if (avatarId !== editingAdmin.avatarId) updates.avatarId = avatarId;

      if (Object.keys(updates).length > 0) {
        await updateAdmin({ adminId: editingAdmin._id, ...updates });
        toast.success("Admin updated successfully!");
      }

      setShowEditModal(false);
      setEditingAdmin(null);
      setUsername("");
      setPassword("");
      setSelectedFile(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update admin");
    }
  };

  const handleDeleteAdmin = async () => {
    try {
      await deleteAdmin({ adminId: editingAdmin._id });
      toast.success("Admin deleted successfully!");
      setShowDeleteModal(false);
      setEditingAdmin(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete admin");
    }
  };

  const openEditModal = (adminToEdit: any) => {
    setEditingAdmin(adminToEdit);
    setUsername(adminToEdit.username);
    setPassword("");
    setSelectedFile(null);
    setShowEditModal(true);
  };

  const openDeleteModal = (adminToDelete: any) => {
    setEditingAdmin(adminToDelete);
    setShowDeleteModal(true);
  };

  if (currentView === 'profile') {
    return (
      <div className="mars-glass-panel h-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white orbitron">ADMIN PROFILE</h2>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div>
            <label className="block text-white mb-2 orbitron">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mars-input"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2 orbitron">New Password (optional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mars-input"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div>
            <label className="block text-white mb-2 orbitron">Avatar Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="mars-input"
            />
          </div>

          <button type="submit" className="mars-button w-full">
            UPDATE PROFILE
          </button>
        </form>
      </div>
    );
  }

  if (currentView === 'addUser') {
    return (
      <div className="mars-glass-panel h-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white orbitron">ADD ADMIN USER</h2>
        </div>

        <form onSubmit={handleCreateAdmin} className="space-y-6">
          <div>
            <label className="block text-white mb-2 orbitron">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mars-input"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2 orbitron">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mars-input"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2 orbitron">Avatar Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="mars-input"
            />
          </div>

          <div className="flex space-x-4">
            <button type="submit" className="mars-button flex-1">
              CONFIRM SIGNUP
            </button>
            <button
              type="button"
              onClick={() => onViewChange('users')}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg orbitron transition-colors flex-1"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="mars-glass-panel h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white orbitron">ADMIN USERS</h2>
        <button
          onClick={() => onViewChange('addUser')}
          className="mars-button"
        >
          ADD ADMIN USER
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto">
        {allAdmins.map((adminUser) => (
          <div
            key={adminUser._id}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="flex items-center space-x-4">
              <AdminAvatar adminUser={adminUser} />
              <div>
                <div className="text-white font-semibold orbitron">
                  {adminUser.username}
                </div>
                <div className="text-red-300 text-sm orbitron">
                  Last login: {new Date(adminUser.lastLoginDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => openEditModal(adminUser)}
                className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded orbitron text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => openDeleteModal(adminUser)}
                className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded orbitron text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="mars-glass-panel p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white orbitron mb-4">EDIT ADMIN</h3>
            <form onSubmit={handleEditAdmin} className="space-y-4">
              <div>
                <label className="block text-white mb-2 orbitron">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mars-input"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2 orbitron">New Password (optional)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mars-input"
                  placeholder="Leave blank to keep current"
                />
              </div>
              <div>
                <label className="block text-white mb-2 orbitron">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="mars-input"
                />
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="mars-button flex-1">
                  UPDATE
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded orbitron"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="mars-glass-panel p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white orbitron mb-4">CONFIRM DELETE</h3>
            <p className="text-white mb-6">
              Are you sure you want to delete admin user "{editingAdmin?.username}"?
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleDeleteAdmin}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded orbitron flex-1"
              >
                DELETE
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
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
