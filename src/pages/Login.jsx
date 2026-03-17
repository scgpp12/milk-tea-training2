import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiLogin } from "../api/auth";

export default function Login({ onGoRegister }) {
  const { login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await apiLogin({ email, password });
      login(token, user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f0fdf4] flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green-200 opacity-30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-200 opacity-30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-600 text-2xl shadow-lg shadow-green-200 mb-4">
            🧋
          </div>
          <h1 className="text-2xl font-bold text-green-900 tracking-tight">Rui Tea 培训系统</h1>
          <p className="text-sm text-green-600 mt-1">员工登录</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-green-100 border border-green-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-green-800 mb-1.5">邮箱</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-green-200 bg-green-50/50 px-4 py-2.5 text-sm text-green-900 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-800 mb-1.5">密码</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full rounded-xl border border-green-200 bg-green-50/50 px-4 py-2.5 text-sm text-green-900 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 active:bg-green-800 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-green-200"
            >
              {loading ? "登录中…" : "登录"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-green-600">
            还没有账号？{" "}
            <button
              onClick={onGoRegister}
              className="font-semibold text-green-700 hover:underline"
            >
              立即注册
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-green-400 mt-6">Rui Tea · Jersey City</p>
      </div>
    </div>
  );
}
