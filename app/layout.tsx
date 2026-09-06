import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CleanFlow-AI',
  description: 'Gestión de negocios de limpieza con agenda y rutas optimizadas por IA',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
