import { ShieldAlert, ArrowLeft, ChefHat } from "lucide-react";
import Link from "next/link";
import { getServerSupabase, getAdminProfile } from "@repo/database/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UnauthorizedPage() {
  const cookieStore = await cookies();
  const supabase    = getServerSupabase(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const adminProfile = await getAdminProfile(cookieStore);
  if (adminProfile) redirect("/dashboard/reservas");

  return (
    <main className="min-h-dvh bg-[#0b0d0f] flex items-center justify-center p-5 relative overflow-hidden">

      {/* ── Background glow ──────────────────────────────── */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Card ─────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full max-w-[360px] text-center"
        style={{
          background: "linear-gradient(160deg, #1a1f2b 0%, #111318 100%)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Top gradient line */}
        <div
          className="absolute top-0 left-8 right-8 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.4), transparent)" }}
        />

        <div className="p-8">
          {/* Brand mark */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div
              className="w-8 h-8 rounded-[9px] flex items-center justify-center"
              style={{
                background: "#1e232c",
                border: "1px solid rgba(141,106,50,0.2)",
              }}
            >
              <ChefHat size={14} className="text-[#8D6A32]" strokeWidth={1.5} />
            </div>
            <span className="text-[12px] font-medium text-[#5f6672]">
              Sistema{" "}
              <span className="font-['Cormorant_Garamond',serif] italic text-[#8D6A32]">Ops</span>
            </span>
          </div>

          {/* Icon */}
          <div
            className="w-16 h-16 rounded-[16px] flex items-center justify-center mx-auto mb-5"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              boxShadow: "0 0 24px rgba(239,68,68,0.1)",
            }}
          >
            <ShieldAlert size={28} className="text-[#ef4444]" strokeWidth={1.5} />
          </div>

          <h1 className="text-[22px] font-semibold text-[#e8eaed] mb-3 tracking-[-0.01em]">
            Acceso Denegado
          </h1>

          <p className="text-[13px] text-[#5f6672] leading-relaxed mb-2">
            Has iniciado sesión como:
          </p>
          <p className="text-[13px] font-medium text-[#9aa0ac] mb-6 break-all">
            {user.email}
          </p>
          <p className="text-[12px] text-[#5f6672] leading-relaxed mb-8">
            Esta cuenta <strong className="text-[#9aa0ac]">no tiene permisos de administrador</strong>{" "}
            en la base de datos.
          </p>

          {/* Divider */}
          <div
            className="h-px mb-6"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
          />

          {/* Actions */}
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              id="unauthorized-logout"
              className="
                w-full py-3 rounded-[10px] text-[13px] font-semibold
                text-[#ef4444] transition-all duration-150
                hover:bg-[rgba(239,68,68,0.08)]
                border border-[rgba(239,68,68,0.2)]
              "
            >
              Cerrar sesión · intentar con otra cuenta
            </button>
          </form>
        </div>

        {/* Footer */}
        <div
          className="px-8 py-3.5 border-t border-white/[0.05] flex items-center justify-between"
          style={{ borderRadius: "0 0 20px 20px" }}
        >
          <span className="text-[10px] text-[#5f6672] font-medium uppercase tracking-[0.08em]">
            Panel Admin
          </span>
          <span className="text-[10px] text-[#5f6672]">
            Contacta a Nicolás si crees que es un error
          </span>
        </div>
      </div>
    </main>
  );
}
