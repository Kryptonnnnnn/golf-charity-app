import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function WinnerProof({ winnerId }: any) {
  const [file, setFile] = useState<any>(null);

  const upload = async () => {
    const fileName = `${Date.now()}-${file.name}`;

    await supabase.storage
      .from("proofs")
      .upload(fileName, file);

    const url = supabase.storage.from("proofs").getPublicUrl(fileName).data.publicUrl;

    await supabase
      .from("winners")
      .update({ proof: url })
      .eq("id", winnerId);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
      <button onClick={upload} className="bg-blue-600 text-white px-4">
        Upload Proof
      </button>
    </div>
  );
}