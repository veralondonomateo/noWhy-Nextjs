import './globals.css';

export const metadata = {
  title: 'noWhy — Tu modo foco activado',
  description: 'Música científica que activa tu cerebro cuando más lo necesitas.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
