import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Layout from "../components/Layout";

export default function Leaderboard() {
  const [users, setUsers] = useState<any[]>([]);

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from("winners")
      .select("user_id, prize");

    const map: any = {};

    data?.forEach((d) => {
      if (!map[d.user_id]) map[d.user_id] = 0;
      map[d.user_id] += d.prize;
    });

    const result = Object.entries(map).map(([user_id, total]) => ({
      user_id,
      total,
    }));

    setUsers(result.sort((a: any, b: any) => b.total - a.total));
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>

      <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
        {users.length === 0 && <p>No data yet</p>}

        {users.map((u, i) => (
          <div
            key={i}
            className="flex justify-between border-b border-gray-700 py-3"
          >
            <span>Rank #{i + 1}</span>
            <span>₹{u.total}</span>
          </div>
        ))}
      </div>
    </Layout>
  );
}