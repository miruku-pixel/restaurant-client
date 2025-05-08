import { useEffect, useState, FormEvent } from "react";

interface LoginFormProps {
  onLogin: (user: any) => void;
}

interface Entity {
  id: string;
  name: string;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState("");

  useEffect(() => {
    // Fetch available entities when component mounts
    fetch("/api/entities")
      .then((res) => res.json())
      .then((data) => {
        setEntities(data);
        if (data.length > 0) {
          setSelectedEntityId(data[0].id); // default selection
        }
      })
      .catch((err) => console.error("Failed to fetch entities", err));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, entityId: selectedEntityId }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token); // Save JWT for future use
      onLogin(data.user);
    } else {
      alert(data.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        className="border rounded-2xl p-3 mr-2"
        value={selectedEntityId}
        onChange={(e) => setSelectedEntityId(e.target.value)}
        required
      >
        <option value="">Select Entity</option>
        {entities.map((entity) => (
          <option key={entity.id} value={entity.id}>
            {entity.name}
          </option>
        ))}
      </select>
      <input
        className="border rounded-2xl p-3 mr-2"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        className="border rounded-2xl p-3 mr-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
