'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { UserRoleBadge } from './UserRoleBadge';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import { updateUserAction, deleteUserAction } from '@/actions/admin.actions';

const U = ADMIN_I18N.users;
const B = ADMIN_I18N.buttons;

interface UserEditModalProps {
  user: {
    id: string;
    name?: string;
    email?: string;
    role: string;
  };
  currentUserId: string;
  open: boolean;
  onClose: () => void;
}

export function UserEditModal({ user, currentUserId, open, onClose }: UserEditModalProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name ?? '');
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isSelf = user.id === currentUserId;

  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.set('name', name);

    const result = await updateUserAction(user.id, null, formData);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(U.updateSuccess);
      router.refresh();
      onClose();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (isSelf) return;

    setDeleting(true);
    const result = await deleteUserAction(user.id);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(U.deleteSuccess);
      router.refresh();
      onClose();
    }
    setDeleting(false);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md p-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="size-5 mr-1"/>
              <span>
              {U.editUser}
              </span>
              </DialogTitle>
            <DialogDescription>
              {user.email ?? user.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* User info summary */}
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{user.name ?? '—'}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email ?? '—'}</p>
              </div>
              <UserRoleBadge role={user.role} />
            </div>

            {/* Edit name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-name">{U.name}</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-row items-center justify-between gap-3 sm:gap-0 mt-1">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSelf || deleting}
              className={` h-9 ${isSelf ? ' cursor-not-allowed ' : ' cursor-pointer '}`}
              title={isSelf ? "No permitido" : 'Eliminar usuario'}
            >
              <Trash2 className="size-5 mr-1" />
              {B.deleteUser}
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={saving}
                className="cursor-pointer h-9 ml-2"
              >
                {B.cancel}
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="cursor-pointer h-9 "
              >
                {saving ? 'Guardando...' : B.save}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={U.deleteTitle}
        description={U.deleteDescription}
        confirmLabel={B.deleteUser}
        variant="destructive"
        loading={deleting}
      />
    </>
  );
}
