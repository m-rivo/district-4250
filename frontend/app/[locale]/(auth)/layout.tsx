import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Puedes incluir aquí un logo global o botón de cambio de idioma/tema */}
        {children}
      </div>
    </div>
  );
}
