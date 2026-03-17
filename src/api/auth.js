const API = "https://23b39fiukc.execute-api.us-east-1.amazonaws.com/prod";

export async function apiRegister({ name, email, password }) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "注册失败");
  return data;
}

export async function apiLogin({ email, password }) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "登录失败");
  return data; // { token, user: { email, name } }
}
