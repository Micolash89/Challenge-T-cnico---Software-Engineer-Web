"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
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
    >
      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            variants={variantsParams("y", 0.35, index * 0.06, 12)}
            className="rounded-lg border bg-card p-4"
          >
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium">{user.name ?? '—'}</p>
              <UserRoleBadge role={user.role} />
            </div>
            <p className="mb-3 text-sm text-muted-foreground">{user.email ?? '—'}</p>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/admin/users/${user.id}`} aria-label={`${ADMIN_I18N.buttons.view} ${user.name ?? user.email}`}>
                <Eye className="mr-2 h-4 w-4" />
                {ADMIN_I18N.buttons.view}
              </Link>
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
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/users/${user.id}`} aria-label={`${ADMIN_I18N.buttons.view} ${user.name ?? user.email}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
