"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProductStatusButton } from "./ProductStatusButton";
import { ProductEditModal } from "./ProductEditModal";
import { formatARS } from "@/lib/format";
import { ADMIN_I18N } from "@/constants/admin-i18n.constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  containerVariantsCascade,
  variantsParams,
} from "@/lib/animation-variants";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const T = ADMIN_I18N.tables;
const B = ADMIN_I18N.buttons;
const S = ADMIN_I18N.statuses;

interface ProductRow {
  id: string;
  name: string;
  category: string;
  rarity: string;
  stock: number;
  price_ars: number;
  active: boolean;
}

interface ProductsTableProps {
  products: ProductRow[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);

  return (
    <motion.div
      variants={containerVariantsCascade}
      initial="hidden"
      animate="visible"
    >
      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={variantsParams("y", 0.35, index * 0.06, 12)}
            className="rounded-lg border bg-card p-4"
          >
            <p className="mb-1 text-sm font-medium">{product.name}</p>
            <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{product.category}</span>
              <span>·</span>
              <span>{product.rarity}</span>
              <Badge
                variant={product.active ? 'default' : 'secondary'}
                className="ml-auto text-[10px]"
              >
                {product.active ? S.active : S.inactive}
              </Badge>
            </div>
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Stock: {product.stock}</span>
              <span className="font-medium">${formatARS(product.price_ars)}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setEditingProduct(product)}
              >
                {B.edit}
              </Button>
              <ProductStatusButton productId={product.id} active={product.active} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden rounded-lg border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{T.name}</TableHead>
              <TableHead>{T.category}</TableHead>
              <TableHead>{T.rarity}</TableHead>
              <TableHead>{T.stock}</TableHead>
              <TableHead>{T.price}</TableHead>
              <TableHead>{T.active}</TableHead>
              <TableHead className="text-right">{T.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-muted-foreground">{product.category}</TableCell>
                <TableCell className="text-muted-foreground">{product.rarity}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>${formatARS(product.price_ars)}</TableCell>
                <TableCell>
                  <Badge variant={product.active ? 'default' : 'secondary'}>
                    {product.active ? S.active : S.inactive}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProduct(product)}
                    >
                      {B.edit}
                    </Button>
                    <ProductStatusButton productId={product.id} active={product.active} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </motion.div>
  );
}
