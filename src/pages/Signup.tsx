import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    if (user) {
      await supabase.from("profiles").upsert([
        {
          id: user.id,
          email: user.email,
        },
      ]);
    }

    alert("Signup successful");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
      <div className="bg-white p-8 rounded-xl shadow-lg w-80">
        <h1 className="text-2xl font-bold mb-6 text-center">Signup</h1>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />

        <button
          onClick={handleSignup}
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
        >
          Signup
        </button>
      </div>
    </div>
  );
}