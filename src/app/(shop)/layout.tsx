import { Navbar } from "@/components/features/layout/Navbar";
import { Footer } from "@/components/features/layout/Footer";
import { WhatsAppFloat } from "@/components/features/layout/WhatsAppFloat";
import { createClient } from "@/lib/supabase/server";
import { Toaster } from "@/components/ui/sonner";
export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user?.user_metadata?.role as string | undefined;
  const isAdmin = ["admin", "super_admin"].includes(role ?? "");

  return (
    <>
      <Navbar isAuthenticated={!!user} isAdmin={isAdmin} />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster position="top-right" />
      <WhatsAppFloat />
    </>
  );
}
