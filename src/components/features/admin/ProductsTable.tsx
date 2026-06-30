"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DeleteProductButton } from "./DeleteProductButton";
import { ADMIN_I18N } from "@/constants/admin-i18n.constants";
import {
  containerVariantsCascade,
  variantsParams,
} from "@/lib/animation-variants";

const T = ADMIN_I18N.tables;
const B = ADMIN_I18N.buttons;

interface ProductRow {
  id: string;
  name: string;
  category: string;
  rarity: string;
  stock: number;
  price_ars: number;
}

interface ProductsTableProps {
  products: ProductRow[];
}

export function ProductsTable({ products }: ProductsTableProps) {
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
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.category}</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.rarity}</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.stock}</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{T.price}</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">{T.actions}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <motion.tr
              key={product.id}
              variants={variantsParams("y", 0.35, index * 0.06, 12)}
              className={index % 2 === 1 ? "bg-muted/30" : "bg-white"}
            >
              <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{product.category}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{product.rarity}</td>
              <td className="px-4 py-3 text-sm">{product.stock}</td>
              <td className="px-4 py-3 text-sm">${Number(product.price_ars).toLocaleString()}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>{B.edit}</Link>
                  </Button>
                  <DeleteProductButton productId={product.id} />
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
