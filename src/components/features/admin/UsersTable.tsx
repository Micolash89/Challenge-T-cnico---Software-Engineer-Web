"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ADMIN_I18N } from '@/constants/admin-i18n.constants';
import { UserRoleBadge } from './UserRoleBadge';
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
}

const T = ADMIN_I18N.tables;

export function UsersTable({ users }: UsersTableProps) {
  return (
    <motion.div
      variants={containerVariantsCascade}
      initial="hidden"
      animate="visible"
      className="rounded-xl border bg-card"
    >
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.name}</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.email}</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.role}</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">{T.actions}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <motion.tr
              key={user.id}
              variants={variantsParams("y", 0.35, index * 0.06, 12)}
              className={index % 2 === 1 ? 'bg-muted/30' : 'bg-white'}
            >
              <td className="px-4 py-3 text-sm">{user.name ?? '—'}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{user.email ?? '—'}</td>
              <td className="px-4 py-3">
                <UserRoleBadge role={user.role} />
              </td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/users/${user.id}`} aria-label={`${ADMIN_I18N.buttons.view} ${user.name ?? user.email}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
