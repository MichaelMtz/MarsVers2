import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import MDEditor from '@uiw/react-md-editor';

interface MissionManagementProps {
  currentView: 'missions' | 'addMission';
  selectedMission: any;
  onViewChange: (view: any) => void;
}

export default function MissionManagement({ 
  currentView, 
  selectedMission, 
  onViewChange 
}: MissionManagementProps) {
  const [missionName, setMissionName] = useState("");
  const [missionDescription, setMissionDescription] = useState("");
  const [missionPoints, setMissionPoints] = useState(0);
  const [missionIsActive, setMissionIsActive] = useState(true);
  const [showMissionEditModal, setShowMissionEditModal] = useState(false);

  const updateMission = useMutation(api.admin.updateMission);
  const createMission = useMutation(api.admin.createMission);
  const missions = useQuery(api.missions.getMissions) || [];

  useEffect(() => {
    if (selectedMission && currentView === 'missions') {
      setMissionName(selectedMission.name);
      setMissionDescription(selectedMission.description);
      setMissionPoints(selectedMission.points);
      setMissionIsActive(selectedMission.isActive);
    }
  }, [selectedMission, currentView]);

  useEffect(() => {
    if (currentView === 'addMission') {
      resetMissionForm();
    }
  }, [currentView]);

  const resetMissionForm = () => {
    setMissionName("");
    setMissionDescription("");
    setMissionPoints(0);
    setMissionIsActive(true);
  };

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createMission({
        name: missionName,
        description: missionDescription,
        points: missionPoints,
        isActive: missionIsActive,
      });

      toast.success("Mission created successfully!");
      onViewChange('missions');
      resetMissionForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create mission");
    }
  };

  const handleUpdateMission = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateMission({
        missionId: selectedMission._id,
        name: missionName,
        description: missionDescription,
        points: missionPoints,
        isActive: missionIsActive,
      });

      toast.success("Mission updated successfully!");
      setShowMissionEditModal(false);
      onViewChange('missions');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update mission");
    }
  };

  const openMissionEditModal = (mission: any) => {
    setMissionName(mission.name);
    setMissionDescription(mission.description);
    setMissionPoints(mission.points);
    setMissionIsActive(mission.isActive);
    setShowMissionEditModal(true);
  };

  if (currentView === 'addMission') {
    return (
      <div className="mars-glass-panel h-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white orbitron">ADD MISSION</h2>
        </div>

        <form onSubmit={handleCreateMission} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-white mb-2 orbitron">Mission Name</label>
              <input
                type="text"
                value={missionName}
                onChange={(e) => setMissionName(e.target.value)}
                className="mars-input"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2 orbitron">Points</label>
              <input
                type="number"
                value={missionPoints}
                onChange={(e) => setMissionPoints(parseInt(e.target.value) || 0)}
                className="mars-input"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2 orbitron">Active</label>
              <div className="flex items-center mt-3">
                <input
                  type="checkbox"
                  checked={missionIsActive}
                  onChange={(e) => setMissionIsActive(e.target.checked)}
                  className="w-5 h-5 text-red-600 bg-white/10 border-red-400/30 rounded focus:ring-red-400 focus:ring-2"
                />
                <span className="ml-2 text-white orbitron">Mission is active</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-white mb-2 orbitron">Description</label>
            <div className="border border-red-400/30 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
              <MDEditor
                value={missionDescription}
                onChange={(value) => setMissionDescription(value || "")}
                data-color-mode="dark"
                preview="edit"
                hideToolbar={false}
                visibleDragbar={false}
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button type="submit" className="mars-button flex-1">
              CREATE MISSION
            </button>
            <button
              type="button"
              onClick={() => onViewChange('missions')}
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
        <h2 className="text-2xl font-bold text-white orbitron">SYSTEM MISSIONS</h2>
        <button
          onClick={() => onViewChange('addMission')}
          className="mars-button"
        >
          ADD MISSION
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto">
        {missions.map((mission) => (
          <div
            key={mission._id}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div>
                <div className="text-white font-semibold orbitron text-sm">
                  {mission.name}
                </div>
              </div>
              <div>
                <div className="text-orange-400 orbitron text-sm font-bold">
                  {mission.points} PTS
                </div>
              </div>
              <div>
                <div className={`orbitron text-sm font-bold ${mission.isActive ? 'text-green-400' : 'text-red-400'}`}>
                  {mission.isActive ? 'ACTIVE' : 'INACTIVE'}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => openMissionEditModal(mission)}
                className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded orbitron text-sm"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mission Edit Modal */}
      {showMissionEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="mars-glass-panel add-opacity p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white orbitron mb-4">EDIT MISSION</h3>
            <form onSubmit={handleUpdateMission} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-white mb-2 orbitron">Mission Name</label>
                  <input
                    type="text"
                    value={missionName}
                    onChange={(e) => setMissionName(e.target.value)}
                    className="mars-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 orbitron">Points</label>
                  <input
                    type="number"
                    value={missionPoints}
                    onChange={(e) => setMissionPoints(parseInt(e.target.value) || 0)}
                    className="mars-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 orbitron">Active</label>
                  <div className="flex items-center mt-3">
                    <input
                      type="checkbox"
                      checked={missionIsActive}
                      onChange={(e) => setMissionIsActive(e.target.checked)}
                      className="w-5 h-5 text-red-600 bg-white/10 border-red-400/30 rounded focus:ring-red-400 focus:ring-2"
                    />
                    <span className="ml-2 text-white orbitron">Mission is active</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-white mb-2 orbitron">Description</label>
                <div className="border border-red-400/30 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
                  <MDEditor
                    value={missionDescription}
                    onChange={(value) => setMissionDescription(value || "")}
                    data-color-mode="dark"
                    preview="edit"
                    hideToolbar={false}
                    visibleDragbar={false}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="mars-button flex-1">
                  UPDATE MISSION
                </button>
                <button
                  type="button"
                  onClick={() => setShowMissionEditModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded orbitron"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
