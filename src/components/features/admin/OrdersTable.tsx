"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { OrderActions } from "./OrderActions";
import { ADMIN_I18N } from "@/constants/admin-i18n.constants";
import {
  containerVariantsCascade,
  variantsParams,
} from "@/lib/animation-variants";

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
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.product}</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.total}</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.status}</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.paymentMethod}</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.date}</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">{T.actions}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <motion.tr
              key={order.id as string}
              variants={variantsParams("y", 0.35, index * 0.06, 12)}
              className={index % 2 === 1 ? "bg-muted/30" : "bg-white"}
            >
              <td className="px-4 py-3 text-sm">Pedido #{String(order.id).slice(0, 8)}</td>
              <td className="px-4 py-3 text-sm">${Number(order.total_ars).toLocaleString()}</td>
              <td className="px-4 py-3">
                <Badge variant={STATUS_VARIANTS[order.status as string] ?? "outline"}>
                  {S[order.status as keyof typeof S] ?? String(order.status)}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {String(order.payment_method ?? order.paymentMethod)}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {new Date(String(order.created_at ?? order.createdAt)).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <OrderActions
                  orderId={order.id as string}
                  status={(order.status as "reservado" | "pagado" | "cancelado") ?? "reservado"}
                />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
