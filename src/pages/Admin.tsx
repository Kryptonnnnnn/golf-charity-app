import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { generateDrawNumbers } from "../lib/draw";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function Admin() {
  const [users, setUsers] = useState<any[]>([]);
  const [draw, setDraw] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const navigate = useNavigate();

  const checkAdmin = async () => {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      navigate("/admin-login");
      return;
    }

    if (user.email !== "admin@gmail.com") {
      navigate("/admin-login");
      return;
    }

    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    setUsers(data || []);
  };

  const fetchDraw = async () => {
    const { data } = await supabase
      .from("draws")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    setDraw(data);
  };

  const runDraw = async () => {
    if (running) return;

    setRunning(true);

    try {
      const { data: existingDraw } = await supabase
        .from("draws")
        .select("*")
        .eq("month", "April")
        .maybeSingle();

      if (existingDraw) {
        alert("Draw already exists for this month");
        setRunning(false);
        return;
      }

      const numbers = generateDrawNumbers();

      const { data: drawData, error } = await supabase
        .from("draws")
        .insert([{ numbers, month: "April", status: "published" }])
        .select()
        .single();

      if (error || !drawData) {
        alert(error?.message || "Draw failed");
        setRunning(false);
        return;
      }

      const drawId = drawData.id;

      const { data: scores } = await supabase.from("scores").select("*");

      const userMap: any = {};

      scores?.forEach((s) => {
        if (!userMap[s.user_id]) userMap[s.user_id] = [];
        userMap[s.user_id].push(s.score);
      });

      const totalUsers = Object.keys(userMap).length;
      const totalPool = totalUsers * 100;

      for (const userId in userMap) {
        const userScores = userMap[userId];

        const matches = userScores.filter((score: number) =>
          numbers.includes(score)
        ).length;

        let matchType = "";
        let prize = 0;

        if (matches === 5) {
          matchType = "5-match";
          prize = totalPool * 0.4;
        } else if (matches === 4) {
          matchType = "4-match";
          prize = totalPool * 0.35;
        } else if (matches === 3) {
          matchType = "3-match";
          prize = totalPool * 0.25;
        } else continue;

        await supabase.from("winners").insert([
          {
            user_id: userId,
            draw_id: drawId,
            match_type: matchType,
            prize,
          },
        ]);
      }

      alert("Draw completed");
      fetchDraw();
    } catch {
      alert("Something went wrong");
    }

    setRunning(false);
  };

  useEffect(() => {
    checkAdmin();
    fetchUsers();
    fetchDraw();
  }, []);

  if (loading) {
    return <div className="p-10 text-white">Loading...</div>;
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="bg-white/10 backdrop-blur p-6 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-2">Latest Draw</h2>

        <p className="text-lg">
          {draw ? draw.numbers.join(", ") : "No draw yet"}
        </p>

        <button
          onClick={runDraw}
          disabled={running}
          className="mt-4 bg-black text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {running ? "Running..." : "Run Draw"}
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">
          Users ({users.length})
        </h2>

        {users.map((u) => (
          <div key={u.id} className="border-b border-gray-700 py-2">
            {u.email}
          </div>
        ))}
      </div>
    </Layout>
  );
}