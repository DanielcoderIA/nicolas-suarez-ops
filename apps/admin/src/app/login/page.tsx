"use client";

import { useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { LockKeyhole, Mail, Send, AlertCircle, ArrowRight, ChefHat } from "lucide-react";

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg,  setErrorMsg]  = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const supabase = createClient();

      if (password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
        window.location.href = "/";
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw new Error(error.message);
        setIsSuccess(true);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-dvh bg-[#0b0d0f] flex items-center justify-center p-5 relative overflow-hidden">

      {/* ── Ambient background glows ─────────────────────── */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(141,106,50,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0"
          style={{
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(79,142,247,0.05) 0%, transparent 70%)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── Card ─────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full max-w-[380px]"
        style={{
          background: "linear-gradient(160deg, #1a1f2b 0%, #111318 100%)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Top gradient line */}
        <div
          className="absolute top-0 left-8 right-8 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(141,106,50,0.5), transparent)" }}
        />

        <div className="p-8">
          {/* ── Header ───────────────────────────────────── */}
          <div className="flex flex-col items-center text-center mb-8">
            {/* Logo mark */}
            <div className="relative mb-5">
              <div
                className="w-14 h-14 rounded-[16px] flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #1e232c 0%, #111318 100%)",
                  border: "1px solid rgba(141,106,50,0.25)",
                  boxShadow: "0 0 24px rgba(141,106,50,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <ChefHat size={22} className="text-[#8D6A32]" strokeWidth={1.5} />
              </div>
              {/* Outer ring */}
              <div
                className="absolute -inset-2 rounded-[20px] border border-[rgba(141,106,50,0.08)] pointer-events-none"
              />
            </div>

            <h1 className="text-[22px] font-semibold text-[#e8eaed] leading-tight tracking-[-0.01em]">
              Sistema de Operación
            </h1>
            <p className="mt-1.5 text-[12px] text-[#5f6672] tracking-[0.08em] uppercase font-medium">
              <span className="font-['Cormorant_Garamond',serif] italic text-[#8D6A32] text-[13px] tracking-[0.06em] mr-1">
                Nicolás Suárez
              </span>
              · Zipaquirá
            </p>
          </div>

          {/* ── Success state ─────────────────────────────── */}
          {isSuccess ? (
            <div
              className="flex flex-col items-center text-center p-6 rounded-[12px]"
              style={{
                background: "rgba(34,197,94,0.06)",
                border: "1px solid rgba(34,197,94,0.15)",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ background: "rgba(34,197,94,0.12)" }}
              >
                <Send size={20} className="text-[#22c55e]" />
              </div>
              <p className="text-[15px] font-semibold text-[#22c55e] mb-2">
                Enlace enviado
              </p>
              <p className="text-[13px] text-[#9aa0ac] leading-relaxed">
                Revisa tu correo <strong className="text-[#e8eaed]">{email}</strong> para acceder.
              </p>
            </div>
          ) : (
            /* ── Form ─────────────────────────────────────── */
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Error */}
              {errorMsg && (
                <div
                  className="flex items-start gap-3 p-3.5 rounded-[10px]"
                  style={{
                    background: "rgba(239,68,68,0.07)",
                    border: "1px solid rgba(239,68,68,0.18)",
                  }}
                >
                  <AlertCircle size={15} className="text-[#ef4444] mt-0.5 shrink-0" />
                  <p className="text-[13px] text-[#ef4444] font-medium leading-snug">{errorMsg}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-[11px] font-semibold text-[#5f6672] uppercase tracking-[0.1em] mb-2"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5f6672] pointer-events-none"
                  />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nicolas@ejemplo.co"
                    required
                    className="admin-input pl-[38px] text-[14px]"
                    style={{ paddingLeft: "38px" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="login-pass"
                  className="flex items-center justify-between text-[11px] font-semibold text-[#5f6672] uppercase tracking-[0.1em] mb-2"
                >
                  <span>Contraseña</span>
                  <span className="text-[10px] normal-case text-[#5f6672] font-normal tracking-normal">
                    Opcional · Magic Link
                  </span>
                </label>
                <div className="relative">
                  <LockKeyhole
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5f6672] pointer-events-none"
                  />
                  <input
                    id="login-pass"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="admin-input text-[14px]"
                    style={{ paddingLeft: "38px" }}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[10px] text-[#5f6672] uppercase tracking-[0.1em]">acceder</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={isLoading}
                className="
                  w-full flex items-center justify-center gap-2
                  py-[13px] rounded-[10px]
                  text-[14px] font-semibold text-white
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  group
                "
                style={{
                  background: "linear-gradient(135deg, #4f8ef7 0%, #6ba0f8 100%)",
                  boxShadow: "0 0 20px rgba(79,142,247,0.25), 0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    />
                    Validando acceso...
                  </span>
                ) : (
                  <>
                    {password ? "Entrar con contraseña" : "Acceder vía Magic Link"}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-8 py-4 border-t border-white/[0.05] flex items-center justify-between"
          style={{ borderRadius: "0 0 20px 20px" }}
        >
          <span className="text-[10px] text-[#5f6672] font-medium uppercase tracking-[0.08em]">
            Panel Admin
          </span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" style={{ boxShadow: "0 0 4px rgba(34,197,94,0.5)" }} />
            <span className="text-[10px] text-[#5f6672]">Sistema activo</span>
          </div>
        </div>
      </div>
    </main>
  );
}
