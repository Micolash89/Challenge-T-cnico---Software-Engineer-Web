'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';

interface UserEditFormProps {
  action: (
    prev: { error?: string; success?: boolean } | null,
    formData: FormData,
  ) => Promise<{ error?: string; success?: boolean }>;
  defaultValues?: {
    name?: string;
    email?: string;
  };
}

const T = ADMIN_I18N.tables;
const B = ADMIN_I18N.buttons;

export function UserEditForm({
  action,
  defaultValues = {},
}: UserEditFormProps) {
  const [state, formAction] = useActionState(action, null);

  const inputClass = 'min-h-10';

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <div
          role="alert"
          className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.error}
        </div>
      )}

      {state?.success && (
        <div
          role="status"
          className="rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-600"
        >
          Usuario actualizado correctamente
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">{T.name}</Label>
          <Input
            id="name"
            name="name"
            defaultValue={defaultValues.name as string}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{T.email}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultValues.email as string}
            className={inputClass}
          />
        </div>
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        {B.save}
      </Button>
    </form>
  );
}
