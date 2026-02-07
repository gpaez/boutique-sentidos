import type { Metadata } from "next";
import "./globals.css"; // Verifica que esta ruta sea correcta

export const metadata: Metadata = {
  title: "Boutique Sentidos | Flores, Perfumes y Dulces",
  description: "Experiencia sensorial única",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}