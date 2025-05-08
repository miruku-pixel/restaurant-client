import LoginForm from "../components/LoginForm";
import { User } from "../types/User";

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="ml-10">
      <h1 className="mb-5">Login</h1>
      <LoginForm onLogin={onLogin} />
    </div>
  );
}
