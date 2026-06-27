import { Navbar } from '@/components/features/layout/Navbar';
import { Footer } from '@/components/features/layout/Footer';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
