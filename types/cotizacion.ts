export type Cotizacion = {
  id: string;
  nombre: string;
  telefono: string;
  correo: string;
  fecha: string; // e.g., "Neiva, 15 de octubre de 2025"
  area_total: number;
  subtotal_sin_iva: number;
  iva_amount: number;
  total_general: number;
  costo_por_m2: number;
  costo_construccion: number;
  created_at: string; // ISO date string
};

export const cotizacionColumns: { key: keyof Cotizacion; label: string }[] = [
  { key: "nombre", label: "Nombre" },
  { key: "telefono", label: "Teléfono" },
  { key: "correo", label: "Correo" },
  { key: "fecha", label: "Fecha" },
  { key: "area_total", label: "Área (m²)" },
  { key: "subtotal_sin_iva", label: "Subtotal" },
  { key: "iva_amount", label: "IVA" },
  { key: "total_general", label: "Total" },
  { key: "costo_por_m2", label: "$/m²" },
  { key: "costo_construccion", label: "Costo Construcción" },
  { key: "created_at", label: "Creado" },
];
