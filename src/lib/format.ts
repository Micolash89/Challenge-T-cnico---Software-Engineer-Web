export function formatARS(value: unknown): string {
  return Number(value ?? 0).toLocaleString("es-AR");
}
