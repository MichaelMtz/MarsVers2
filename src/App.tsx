import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { Toaster, toast } from "sonner";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import MarsAdmin from "./mars-admin";

export default function App() {
  const [currentPlayer, setCurrentPlayer] = useState<Id<"players"> | null>(null);
  const [showMarsAdmin, setShowMarsAdmin] =  useState(false);
  const initializeMissions = useMutation(api.missions.initializeMissions);
  const addNewMissions = useMutation(api.missions.addNewMissions);
  const initializeMessages = useMutation(api.messages.initializeMessages);

  // Check URL for Mars Admin route
  useEffect(() => {
    const checkRoute = () => {
      if (window.location.pathname === '/mars-admin' || window.location.hash === '#mars-admin') {
        setShowMarsAdmin(true);
      } else {
        setShowMarsAdmin(false);
      }
    };
    
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  // Load player from localStorage on app start
  useEffect(() => {
    const savedPlayerId = localStorage.getItem('currentPlayerId');
    if (savedPlayerId) {
      setCurrentPlayer(savedPlayerId as Id<"players">);
    }
  }, []);

  useEffect(() => {
    // Initialize missions on app start
    initializeMissions();
    // Add new missions to existing database
    addNewMissions();
    // Initialize messages
    initializeMessages();
  }, [initializeMissions, addNewMissions, initializeMessages]);

  const handleLogin = (playerId: Id<"players">) => {
    setCurrentPlayer(playerId);
    localStorage.setItem('currentPlayerId', playerId);
  };

  const handleLogout = () => {
    setCurrentPlayer(null);
    localStorage.removeItem('currentPlayerId');
  };

  const goToMarsAdmin = () => {
    setShowMarsAdmin(true);
    window.history.pushState({}, '', '#mars-admin');
  };

  const goToMainApp = () => {
    setShowMarsAdmin(false);
    window.history.pushState({}, '', '/');
  };

  // Show Mars Admin if route matches
  if (showMarsAdmin) {
    return (
      <div>
        <MarsAdmin />
        <button
          onClick={goToMainApp}
          className="fixed top-4 left-4 z-50 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg orbitron transition-colors"
        >
          ← Back to Space Dashboard
        </button>
      </div>
    );
  }

  if (!currentPlayer) {
    return (
      <div className="min-h-screen bg-space flex items-center justify-center p-4">
        <div className="relative">
          <LoginForm onLogin={handleLogin} />
          <button
            onClick={goToMarsAdmin}
            className="absolute top-4 right-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded orbitron transition-colors"
          >
            Mars Admin
          </button>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space">
      <button
        onClick={goToMarsAdmin}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg orbitron transition-colors"
      >
        Mars Admin
      </button>
      <Dashboard playerId={currentPlayer} onLogout={handleLogout} />
      <Toaster />
    </div>
  );
}
