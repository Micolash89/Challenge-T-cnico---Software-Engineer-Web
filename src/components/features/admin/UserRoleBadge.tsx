import { Badge } from '@/components/ui/badge';

interface UserRoleBadgeProps {
  role: string;
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  super_admin: 'Super Administrador',
  user: 'Usuario',
};

const ROLE_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  admin: 'default',
  super_admin: 'secondary',
  user: 'outline',
};

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const label = ROLE_LABELS[role] ?? role;
  const variant = ROLE_VARIANTS[role] ?? 'outline';

  return <Badge variant={variant}>{label}</Badge>;
}
