import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { Toaster, toast } from "sonner";
import MarsLoginForm from "./components/MarsLoginForm";
import MarsAdminDashboard from "./components/MarsAdminDashboard";

export default function MarsAdmin() {
  const [currentAdmin, setCurrentAdmin] = useState<Id<"admins"> | null>(null);
  const initializeAdmins = useMutation(api.admin.initializeAdmins);

  // Load admin from localStorage on app start
  useEffect(() => {
    const savedAdminId = localStorage.getItem('currentAdminId');
    if (savedAdminId) {
      setCurrentAdmin(savedAdminId as Id<"admins">);
    }
  }, []);

  useEffect(() => {
    // Initialize admins on app start
    initializeAdmins();
  }, [initializeAdmins]);

  const handleLogin = (adminId: Id<"admins">) => {
    setCurrentAdmin(adminId);
    localStorage.setItem('currentAdminId', adminId);
  };

  const handleLogout = () => {
    setCurrentAdmin(null);
    localStorage.removeItem('currentAdminId');
  };

  if (!currentAdmin) {
    return (
      <div className="min-h-screen bg-mars flex items-center justify-center p-4">
        <MarsLoginForm onLogin={handleLogin} />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mars">
      <MarsAdminDashboard adminId={currentAdmin} onLogout={handleLogout} />
      <Toaster />
    </div>
  );
}
