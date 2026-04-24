import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Subscribe() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const subscribe = async (plan: string) => {
    setLoading(true);

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      navigate("/login");
      return;
    }

    const { data: existing } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      navigate("/dashboard");
      return;
    }

    const { error } = await supabase.from("subscriptions").insert([
      {
        user_id: user.id,
        plan,
        status: "active",
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-xl w-96 text-center">
        <h1 className="text-3xl font-bold mb-4">Choose Plan</h1>

        <p className="text-gray-400 mb-6">
          Subscribe to participate in draws
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => subscribe("monthly")}
            disabled={loading}
            className="bg-blue-600 py-3 rounded hover:bg-blue-700"
          >
            {loading ? "Processing..." : "Monthly Plan"}
          </button>

          <button
            onClick={() => subscribe("yearly")}
            disabled={loading}
            className="bg-green-600 py-3 rounded hover:bg-green-700"
          >
            {loading ? "Processing..." : "Yearly Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}