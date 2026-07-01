'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import { UserRoleBadge } from './UserRoleBadge';
import { UserEditModal } from './UserEditModal';
import {
  containerVariantsCascade,
  variantsParams,
} from '@/lib/animation-variants';

interface User {
  id: string;
  name?: string;
  email?: string;
  role: string;
}

interface UsersTableProps {
  users: User[];
  currentUserId: string;
}

const T = ADMIN_I18N.tables;
const B = ADMIN_I18N.buttons;

export function UsersTable({ users, currentUserId }: UsersTableProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);

  return (
    <>
      <motion.div
        variants={containerVariantsCascade}
        initial="hidden"
        animate="visible"
      >
        {/* Mobile cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              variants={variantsParams('y', 0.35, index * 0.06, 12)}
              className="rounded-lg border bg-card p-4"
            >
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-medium">{user.name ?? '—'}</p>
                <UserRoleBadge role={user.role} />
              </div>
              <p className="mb-3 text-sm text-muted-foreground">{user.email ?? '—'}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingUser(user)}
                className="cursor-pointer"
              >
                <Pencil className="size-5 mr-1" />
                {B.edit}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden rounded-lg border bg-card md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{T.name}</TableHead>
                <TableHead>{T.email}</TableHead>
                <TableHead>{T.role}</TableHead>
                <TableHead className="text-right">{T.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email ?? '—'}</TableCell>
                  <TableCell>
                    <UserRoleBadge role={user.role} />
                  </TableCell>
                  <TableCell className="text-right ">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingUser(user)}
                      className="cursor-pointer mr-2"
                    >
                      <Pencil className="size-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {editingUser && (
        <UserEditModal
          user={editingUser}
          currentUserId={currentUserId}
          open={!!editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </>
  );
}
