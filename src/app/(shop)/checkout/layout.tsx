import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/constants/routes.constants';

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`${ROUTES.LOGIN}?redirect=/checkout`);
  }

  return <>{children}</>;
}
