"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ADMIN_I18N } from "@/constants/admin-i18n.constants";
import {
  containerVariantsCascade,
  variantsParams,
} from "@/lib/animation-variants";
import { useState } from "react";
import { OrderModal } from "./OrderModal";

const T = ADMIN_I18N.tables;
const S = ADMIN_I18N.statuses;

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  reservado: "secondary",
  pagado: "default",
  cancelado: "destructive",
};

interface OrdersTableProps {
  orders: Record<string, unknown>[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Record<string, unknown> | null>(null);

  return (
    <motion.div
      variants={containerVariantsCascade}
      initial="hidden"
      animate="visible"
    >
      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {orders.map((order, index) => (
          <motion.div
            key={order.id as string}
            variants={variantsParams("y", 0.35, index * 0.06, 12)}
            className="rounded-lg border bg-card p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">Pedido #{(order.id as string).slice(0, 8)}</p>
              <Badge variant={STATUS_VARIANTS[order.status as string] ?? "outline"}>
                {S[order.status as keyof typeof S] ?? String(order.status)}
              </Badge>
            </div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">${Number(order.total_ars).toLocaleString()}</span>
            </div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Método:</span>
              <span>{String(order.payment_method ?? order.paymentMethod)}</span>
            </div>
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Fecha:</span>
              <span>{new Date(String(order.created_at ?? order.createdAt)).toLocaleDateString()}</span>
            </div>
            <Button
              variant="outline"
              size="icon-sm"
              className="w-full"
              onClick={() => setSelectedOrder(order)}
            >
              <Eye className="mr-2 size-5" />
              Ver detalle
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden rounded-lg border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{T.product}</TableHead>
              <TableHead>{T.total}</TableHead>
              <TableHead>{T.status}</TableHead>
              <TableHead>{T.paymentMethod}</TableHead>
              <TableHead>{T.date}</TableHead>
              <TableHead className="text-right">{T.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id as string}>
                <TableCell className="font-medium">
                  Pedido #{(order.id as string).slice(0, 8)}
                </TableCell>
                <TableCell>${Number(order.total_ars).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[order.status as string] ?? "outline"}>
                    {S[order.status as keyof typeof S] ?? String(order.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {String(order.payment_method ?? order.paymentMethod)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(String(order.created_at ?? order.createdAt)).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </motion.div>
  );
}
