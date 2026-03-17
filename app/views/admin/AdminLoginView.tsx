"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Integrar con Supabase (tabla usuarios, rol = admin)
    if (email && password) {
      alert(`Admin logged in: ${email}`);
      router.push("/views/admin/AdminDashboardView");
    } else {
      alert("Please enter your credentials.");
    }
  };

  return (
    <div className="app-main text-center">
      <h2>Administrator Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <p>
        Not an admin? <a href="/views/login/LoginView">Go back to main login</a>
      </p>
    </div>
  );
}
