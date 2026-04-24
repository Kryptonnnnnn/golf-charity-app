import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Layout({ children }: any) {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      
      {/* Navbar */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Golf Charity</h1>

        <div className="flex gap-4">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/admin">Admin</Link>
          <button onClick={logout} className="text-red-400">Logout</button>
        </div>
      </div>

      {/* Page Content */}
      <div className="p-6">{children}</div>
    </div>
  );
}