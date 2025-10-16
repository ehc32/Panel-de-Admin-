import { Spinner } from "@/components/ui/spinner";

export default function LoadingDashboard() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center animate-in fade-in-50">
      <div className="flex flex-col items-center gap-3">
        <Spinner size={32} />
        <p className="text-sm text-muted-foreground">Cargando panel…</p>
      </div>
    </div>
  );
}
