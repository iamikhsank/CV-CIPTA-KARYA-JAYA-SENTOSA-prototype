"use client";

import { useState, type FormEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import EyeIcon from "@hugeicons/core-free-icons/EyeIcon";
import EyeOffIcon from "@hugeicons/core-free-icons/EyeOffIcon";
import LockIcon from "@hugeicons/core-free-icons/LockIcon";
import Login03Icon from "@hugeicons/core-free-icons/Login03Icon";
import Mail01Icon from "@hugeicons/core-free-icons/Mail01Icon";

export function LoginView({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("jason@ciptakaryajaya.co.id");
  const [password, setPassword] = useState("Admin2026");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.includes("@") || password.length < 6) {
      setError("Masukkan email valid dan password minimal 6 karakter.");
      return;
    }
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 650);
  };

  return (
    <main className="login-shell">
      <section className="login-showcase">
        <div className="login-brand">
          <div className="login-brand-logo">
            <img src="/logo-ckjs.jpg" alt="Logo CV. Cipta Karya Jaya Sentosa" />
          </div>
          <span>
            <b>Financial Management</b>
            <small>Cipta Karya Jaya Sentosa</small>
          </span>
        </div>
        <div className="login-message">
          <span className="login-eyebrow">MULTI-PROJECT FINANCE</span>
          <h1>
            Keuangan proyek,
            <br />
            lebih mudah dikendalikan.
          </h1>
          <p>
            Pantau kas, transaksi, laba rugi, serta performa setiap proyek dari satu sistem terpadu.
          </p>
          <div className="login-benefits">
            <span>
              <i>✓</i>Automatic balanced journal
            </span>
            <span>
              <i>✓</i>Real-time project cashflow
            </span>
            <span>
              <i>✓</i>Audit-ready financial records
            </span>
          </div>
        </div>
        <footer>CV. Cipta Karya Jaya Sentosa</footer>
      </section>
      <section className="login-panel">
        <form className="login-card" onSubmit={submit}>
          <div className="login-card-icon">
            <HugeiconsIcon icon={Login03Icon} size={23} strokeWidth={1.8} />
          </div>
          <h2>Welcome back</h2>
          <p>Masuk untuk melanjutkan ke dashboard keuangan CV. Cipta Karya Jaya Sentosa.</p>
          <label>
            Email address
            <div className="login-input">
              <HugeiconsIcon icon={Mail01Icon} size={19} strokeWidth={1.7} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>
          </label>
          <label>
            Password
            <div className="login-input">
              <HugeiconsIcon icon={LockIcon} size={19} strokeWidth={1.7} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
              <button
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                type="button"
              >
                <HugeiconsIcon
                  icon={showPassword ? EyeOffIcon : EyeIcon}
                  size={19}
                  strokeWidth={1.7}
                />
              </button>
            </div>
          </label>
          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              Remember me
            </label>
            <button
              onClick={() =>
                setError("Silakan hubungi administrator CV. Cipta Karya Jaya Sentosa untuk reset password.")
              }
              type="button"
            >
              Forgot password?
            </button>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button className="login-submit" disabled={loading} type="submit">
            {loading ? (
              <>
                <i />
                Signing in...
              </>
            ) : (
              <>
                Sign in <HugeiconsIcon icon={Login03Icon} size={18} strokeWidth={1.8} />
              </>
            )}
          </button>
          <small className="login-demo">Prototype access · credentials have been prefilled</small>
        </form>
      </section>
    </main>
  );
}
