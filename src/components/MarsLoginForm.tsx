import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface MarsLoginFormProps {
  onLogin: (adminId: Id<"admins">) => void;
}

export default function MarsLoginForm({ onLogin }: MarsLoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginAdmin = useMutation(api.admin.loginAdmin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const adminId = await loginAdmin({ username, password });
      onLogin(adminId);
      toast.success("Welcome to Mars Admin!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div className="mars-glass-panel p-8 w-full max-w-md">
      <h1 className="text-3xl font-bold text-center mb-8 text-white orbitron">
        MARS ADMIN
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <button type="submit" className="mars-button w-full">
          LOGIN TO MARS
        </button>
      </form>
    </div>
  );
}
