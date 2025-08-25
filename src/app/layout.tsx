//layout.tsx


import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Society Management System',
  description: 'Manage society efficiently',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}