import { Button } from "@/components/ui/button";
import { Search, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-muted-foreground mb-4">
            404
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Página no encontrada
          </h1>
          <p className="text-muted-foreground mb-8">
            La página que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full h-9">
            <Link href={'/'}>
              <Home className="size-5 mr-2" />
              Volver al inicio
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full bg-transparent h-9">
            <Link href="/yugioh">
              <Search className="size-5 mr-2" />
              Explorar productos
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
