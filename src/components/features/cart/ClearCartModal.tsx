"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ClearCartModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ClearCartModal({ open, onClose, onConfirm }: ClearCartModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-destructive" />
            Vaciar carrito
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que querés vaciar el carrito? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-2"
          >
            <Trash2 className="size-4" />
            Vaciar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
