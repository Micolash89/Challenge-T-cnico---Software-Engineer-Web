export function ChartSkeleton() {
  return (
    <div
      className="rounded-xl border bg-card p-4 animate-pulse"
      role="status"
      aria-label="Cargando gráfico"
    >
      {/* Title line placeholder */}
      <div className="h-4 w-1/3 rounded bg-muted mb-6" />

      {/* Chart bars placeholder */}
      <div className="flex items-end gap-2 h-[300px]">
        <div className="flex-1 rounded-t bg-muted h-[55%]" />
        <div className="flex-1 rounded-t bg-muted h-[75%]" />
        <div className="flex-1 rounded-t bg-muted h-[40%]" />
        <div className="flex-1 rounded-t bg-muted h-[85%]" />
        <div className="flex-1 rounded-t bg-muted h-[60%]" />
        <div className="flex-1 rounded-t bg-muted h-[90%]" />
        <div className="flex-1 rounded-t bg-muted h-[35%]" />
      </div>
    </div>
  );
}
