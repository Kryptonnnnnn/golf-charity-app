import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function CharitySelector() {
  const [charities, setCharities] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("charities").select("*").then(({ data }) => {
      setCharities(data || []);
    });
  }, []);

  const selectCharity = async (id: string) => {
    const { data } = await supabase.auth.getUser();

    await supabase.from("user_charities").upsert([
      {
        user_id: data.user?.id,
        charity_id: id,
        percentage: 10,
      },
    ]);

    alert("Charity selected");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Select Charity</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {charities.map((c) => (
          <div key={c.id} className="border p-3 rounded flex justify-between">
            <span>{c.name}</span>
            <button
              onClick={() => selectCharity(c.id)}
              className="bg-green-600 text-white px-3 rounded"
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}