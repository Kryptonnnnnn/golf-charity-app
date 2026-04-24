import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function ScoreForm({ refresh }: any) {
  const [score, setScore] = useState("");
  const [date, setDate] = useState("");

  const addScore = async () => {
    if (!score || !date) {
      alert("Enter score and date");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("User not logged in");
      return;
    }

    await supabase.from("profiles").upsert([
      {
        id: user.id,
        email: user.email,
      },
    ]);

    const { data: existing } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true });

    if (existing?.find((s) => s.date === date)) {
      alert("Duplicate date not allowed");
      return;
    }

    if ((existing?.length || 0) >= 5) {
      await supabase
        .from("scores")
        .delete()
        .eq("id", existing![0].id);
    }

    const { error } = await supabase.from("scores").insert([
      {
        user_id: user.id,
        score: Number(score),
        date,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setScore("");
    setDate("");
    refresh();
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Add Score</h2>

      <div className="flex gap-3">
        <input
          type="number"
          placeholder="Score (1-45)"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="border p-2 rounded w-40"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={addScore}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}