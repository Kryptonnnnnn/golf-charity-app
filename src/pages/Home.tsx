import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col items-center justify-center text-white">
      <h1 className="text-6xl font-bold mb-4">Golf Charity</h1>

      <p className="text-gray-400 mb-8 text-lg">
        Play • Win • Support a Cause
      </p>

      <div className="flex gap-6">
        <Link
          to="/login"
          className="bg-blue-600 px-8 py-3 rounded-lg text-lg hover:bg-blue-700"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="bg-green-600 px-8 py-3 rounded-lg text-lg hover:bg-green-700"
        >
          Signup
        </Link>

        <Link
          to="/admin-login"
          className="bg-white text-black px-8 py-3 rounded-lg text-lg hover:bg-gray-200"
        >
          Admin
        </Link>
      </div>
    </div>
  );
}