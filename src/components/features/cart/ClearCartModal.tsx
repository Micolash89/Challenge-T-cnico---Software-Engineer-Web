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

export function ClearCartModal({
  open,
  onClose,
  onConfirm,
}: ClearCartModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-destructive" />
            Vaciar carrito
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que querés vaciar el carrito?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className=" flex gap-3  sm:gap-0 mt-1">
          <Button
            variant="default"
            className="px-5 py-3 rounded-lg flex items-center gap-2 cursor-pointer hover-opacity-90"
            onClick={onClose}
          >
            <span>Cancelar</span>
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="ml-5 flex items-center gap-2 justify-center px-3 py-3 rounded-lg cursor-pointer"
          >
            <Trash2 className="size-5" />
            <span>Vaciar</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
