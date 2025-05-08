import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import OrderEntry from "./components/OrderEntry";
import StatusPage from "./pages/StatusPage";
import LoginPage from "./pages/LoginPage"; // Optional
import { User } from "./types/User";

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => setUser(null);

  if (!user) {
    return <LoginPage onLogin={handleLoginSuccess} />; // Pass handleLoginSuccess as onLogin
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/order"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <OrderEntry user={user} /> {/* Pass the user prop here */}
            </Layout>
          }
        />
        <Route
          path="/status"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <StatusPage user={user} />
            </Layout>
          }
        />
        {/* Redirect / to /order */}
        <Route
          path="/"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <OrderEntry user={user} /> {/* Pass the user prop here as well */}
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
