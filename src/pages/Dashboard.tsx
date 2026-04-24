import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ScoreForm from "../components/ScoreForm";
import CharitySelector from "../components/CharitySelector";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [scores, setScores] = useState<any[]>([]);
  const [draw, setDraw] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [winnings, setWinnings] = useState<any[]>([]);
  const navigate = useNavigate();

  const checkSubscription = async () => {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.email === "admin@gmail.com") {
      return;
    }

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!sub) {
      navigate("/subscribe");
    }
  };

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  const fetchScores = async () => {
    const { data: userData } = await supabase.auth.getUser();

    const { data } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", userData.user?.id)
      .order("date", { ascending: false });

    setScores(data || []);
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

  const fetchWinnings = async () => {
    const { data: userData } = await supabase.auth.getUser();

    const { data } = await supabase
      .from("winners")
      .select("*")
      .eq("user_id", userData.user?.id);

    setWinnings(data || []);
  };

  useEffect(() => {
    checkSubscription();
    fetchUser();
    fetchScores();
    fetchDraw();
    fetchWinnings();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-6">
        {[
          { title: "User", value: user?.email },
          { title: "Scores", value: scores.length },
          { title: "Latest Draw", value: draw?.numbers?.join(", ") },
          {
            title: "Winnings",
            value: `₹${winnings.reduce((a, w) => a + w.prize, 0)}`,
          },
        ].map((card, i) => (
          <div key={i} className="bg-white/10 p-5 rounded-xl">
            <h2 className="text-gray-300">{card.title}</h2>
            <p className="text-xl font-bold mt-2">{card.value || "-"}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/10 p-4 rounded mb-6">
        <ScoreForm refresh={fetchScores} />
      </div>

      <div className="bg-white/10 p-4 rounded mb-6">
        <CharitySelector />
      </div>

      <div className="bg-white/10 p-4 rounded mb-6">
        <h2>Your Scores</h2>
        {scores.map((s) => (
          <div key={s.id} className="flex justify-between py-2">
            <span>{s.score}</span>
            <span>{s.date}</span>
          </div>
        ))}
      </div>

      <div className="bg-white/10 p-4 rounded">
        <h2>Your Winnings</h2>
        {winnings.map((w) => (
          <div key={w.id} className="flex justify-between py-2">
            <span>{w.match_type}</span>
            <span>₹{w.prize}</span>
          </div>
        ))}
      </div>
    </Layout>
  );
}