import { useEffect, useState } from "react";
import { User } from "../types/User";
import { Link, useLocation } from "react-router-dom";

type Props = {
  user: User;
  onLogout: () => void;
};

export default function Navbar({ user, onLogout }: Props) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-between items-center mb-4 bg-white p-4 rounded shadow">
      <div>
        <p className="font-bold text-lg">User: {user.username}</p>
        <p className="text-sm text-gray-600">Entity: {user.entity || "N/A"}</p>
        <p className="text-sm text-gray-600">{currentTime}</p>
      </div>
      {/* Center section: navigation */}
      <div className="flex gap-4">
        <Link
          to="/order"
          className={`px-4 py-2 rounded ${
            location.pathname === "/order-entry"
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
          }`}
        >
          Order Entry
        </Link>
        <Link
          to="/status"
          className={`px-4 py-2 rounded ${
            location.pathname === "/status"
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
          }`}
        >
          Status
        </Link>
      </div>
      <button
        onClick={onLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
