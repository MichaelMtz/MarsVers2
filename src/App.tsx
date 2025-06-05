import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { Toaster, toast } from "sonner";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [currentPlayer, setCurrentPlayer] = useState<Id<"players"> | null>(null);
  const initializeMissions = useMutation(api.missions.initializeMissions);
  const addNewMissions = useMutation(api.missions.addNewMissions);

  useEffect(() => {
    // Initialize missions on app start
    initializeMissions();
    // Add new missions to existing database
    addNewMissions();
  }, [initializeMissions, addNewMissions]);

  if (!currentPlayer) {
    return (
      <div className="min-h-screen bg-space flex items-center justify-center p-4">
        <LoginForm onLogin={setCurrentPlayer} />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space">
      <Dashboard playerId={currentPlayer} onLogout={() => setCurrentPlayer(null)} />
      <Toaster />
    </div>
  );
}
