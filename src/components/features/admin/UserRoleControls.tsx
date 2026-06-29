'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { UserRoleBadge } from './UserRoleBadge';

interface UserRoleControlsProps {
  targetUserId: string;
  currentUserId: string;
  currentRole: string;
  onPromote: (userId: string) => Promise<void>;
  onDemote: (userId: string) => Promise<void>;
}

export function UserRoleControls({
  targetUserId,
  currentUserId,
  currentRole,
  onPromote,
  onDemote,
}: UserRoleControlsProps) {
  const [isPending, startTransition] = useTransition();

  const isSelf = currentUserId === targetUserId;
  const isSuperAdmin = currentRole === 'super_admin';
  const isUser = currentRole === 'user';

  const handlePromote = () => {
    startTransition(async () => {
      await onPromote(targetUserId);
    });
  };

  const handleDemote = () => {
    startTransition(async () => {
      await onDemote(targetUserId);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <UserRoleBadge role={currentRole} />

      {isSelf && isSuperAdmin && (
        <span className="text-xs text-muted-foreground">
          No puedes modificar tu propio rol
        </span>
      )}

      {!(isSelf && isSuperAdmin) && (
        <div className="flex gap-1">
          {!isSuperAdmin && (
            <Button
              size="sm"
              variant="outline"
              onClick={handlePromote}
              disabled={isPending}
            >
              Ascender
            </Button>
          )}
          {!isUser && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleDemote}
              disabled={isPending}
            >
              Descender
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
