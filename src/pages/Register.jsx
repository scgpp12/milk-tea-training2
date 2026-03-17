import { useState } from "react";
import { apiRegister } from "../api/auth";

export default function Register({ onGoLogin }) {
  const [form, setForm]       = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("两次输入的密码不一致");
      return;
    }
    setLoading(true);
    try {
      await apiRegister({ name: form.name, email: form.email, password: form.password });
      setSuccess(true);
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
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-green-200 opacity-30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-emerald-200 opacity-30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-600 text-2xl shadow-lg shadow-green-200 mb-4">
            🧋
          </div>
          <h1 className="text-2xl font-bold text-green-900 tracking-tight">Rui Tea 培训系统</h1>
          <p className="text-sm text-green-600 mt-1">创建员工账号</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-green-100 border border-green-100 p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">✅</div>
              <p className="font-semibold text-green-800 mb-1">注册成功！</p>
              <p className="text-sm text-green-600 mb-5">请使用你的账号登录</p>
              <button
                onClick={onGoLogin}
                className="w-full rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition"
              >
                前往登录
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-800 mb-1.5">姓名</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={update("name")}
                  placeholder="你的姓名"
                  className="w-full rounded-xl border border-green-200 bg-green-50/50 px-4 py-2.5 text-sm text-green-900 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-green-800 mb-1.5">邮箱</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-green-200 bg-green-50/50 px-4 py-2.5 text-sm text-green-900 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-green-800 mb-1.5">密码</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={update("password")}
                  placeholder="至少 6 位"
                  className="w-full rounded-xl border border-green-200 bg-green-50/50 px-4 py-2.5 text-sm text-green-900 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-green-800 mb-1.5">确认密码</label>
                <input
                  type="password"
                  required
                  value={form.confirm}
                  onChange={update("confirm")}
                  placeholder="再次输入密码"
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
                {loading ? "注册中…" : "注册"}
              </button>
            </form>
          )}

          {!success && (
            <p className="mt-5 text-center text-sm text-green-600">
              已有账号？{" "}
              <button
                onClick={onGoLogin}
                className="font-semibold text-green-700 hover:underline"
              >
                返回登录
              </button>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-green-400 mt-6">Rui Tea · Jersey City</p>
      </div>
    </div>
  );
}
