import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface LinkshopButtonProps {
  url: string;
  message?: string;
}
export default function LinkShopButton({ url, message }: LinkshopButtonProps) {
  return (
    <Link href={url} className="w-fit">
      <Button
        variant="default"
        size="lg"
        className="flex items-center gap-1 px-3 py-1 hover:bg-black/70 transition-colors  cursor-pointer "
      >
        <ArrowLeft className="size-5" />
        <span>{message}</span>
      </Button>
    </Link>
  );
}
