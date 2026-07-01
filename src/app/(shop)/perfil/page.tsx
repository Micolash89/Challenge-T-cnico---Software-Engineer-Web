import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatARS } from '@/lib/format';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const metadata = {
  title: 'Mi Perfil',
};

const STATUS_LABELS: Record<string, string> = {
  reservado: 'Reservado',
  pagado: 'Pagado',
  cancelado: 'Cancelado',
};

const STATUS_COLORS: Record<string, string> = {
  pagado: 'bg-[hsl(142,76%,36%)]',
  cancelado: 'bg-[hsl(0,84%,60%)]',
  reservado: 'bg-[hsl(38,92%,50%)]',
};

interface OrderRow {
  id: string;
  status: string;
  total_ars: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export default async function PerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const name = (user.user_metadata?.full_name as string) ?? user.email?.split('@')[0] ?? 'Usuario';
  const email = user.email ?? '—';
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('es-AR')
    : '—';

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const userOrders: OrderRow[] = (orders ?? []).map((o) => ({
    id: o.id,
    status: o.status,
    total_ars: o.total_ars,
    payment_method: o.payment_method,
    created_at: o.created_at,
    updated_at: o.updated_at,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* User info */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <div className="mt-4 rounded-xl border bg-card p-6">
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Nombre</dt>
              <dd className="font-medium">{name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Miembro desde</dt>
              <dd className="font-medium">{memberSince}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Orders */}
      <div>
        <h2 className="mb-4 text-xl font-bold">Historial de Compras</h2>

        {userOrders.length === 0 ? (
          <p className="text-muted-foreground">No tenés compras aún.</p>
        ) : (
          <div className="rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userOrders.map((o) => {
                  const createdDate = new Date(o.created_at).toLocaleDateString('es-AR');
                  const updatedDate = new Date(o.updated_at).toLocaleDateString('es-AR');
                  const datesMatch = o.created_at === o.updated_at || !o.updated_at;

                  return (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">
                        #{o.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold text-white ${
                            STATUS_COLORS[o.status] ?? 'bg-muted'
                          }`}
                        >
                          {STATUS_LABELS[o.status] ?? o.status}
                        </span>
                      </TableCell>
                      <TableCell>${formatARS(o.total_ars)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {o.payment_method === 'mercadopago' ? 'Mercado Pago' : 'Depósito/Efectivo'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {createdDate}
                        {!datesMatch && (
                          <span className="ml-1 text-xs">
                            (mod. {updatedDate})
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
