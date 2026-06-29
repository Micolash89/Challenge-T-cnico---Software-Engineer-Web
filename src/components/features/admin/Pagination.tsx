import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  params?: Record<string, string>;
}

function buildHref(
  basePath: string,
  page: number,
  params?: Record<string, string>,
): string {
  const sp = new URLSearchParams(params ?? {});
  sp.set('page', String(page));
  return `${basePath}?${sp.toString()}`;
}

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  if (endPage - startPage < 1) {
    if (startPage === 2) {
      endPage = Math.min(totalPages - 1, startPage + 1);
    } else if (endPage === totalPages - 1) {
      startPage = Math.max(2, endPage - 1);
    }
  }

  if (startPage > 2) {
    pages.push('ellipsis');
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages - 1) {
    pages.push('ellipsis');
  }

  pages.push(totalPages);

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  params,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label="Paginación"
    >
      {/* First page */}
      <Button
        variant="outline"
        size="icon"
        asChild
        aria-disabled={isFirst}
      >
        <Link
          href={buildHref(basePath, 1, params)}
          aria-label="Primera página"
          tabIndex={isFirst ? -1 : 0}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Link>
      </Button>

      {/* Previous page */}
      <Button
        variant="outline"
        size="icon"
        asChild
        aria-disabled={isFirst}
      >
        <Link
          href={buildHref(basePath, currentPage - 1, params)}
          aria-label="Página anterior"
          tabIndex={isFirst ? -1 : 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>

      {/* Page numbers */}
      {pages.map((page, index) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <Link
              href={buildHref(basePath, page, params)}
              aria-label={String(page)}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </Link>
          </Button>
        ),
      )}

      {/* Next page */}
      <Button
        variant="outline"
        size="icon"
        asChild
        aria-disabled={isLast}
      >
        <Link
          href={buildHref(basePath, currentPage + 1, params)}
          aria-label="Página siguiente"
          tabIndex={isLast ? -1 : 0}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>

      {/* Last page */}
      <Button
        variant="outline"
        size="icon"
        asChild
        aria-disabled={isLast}
      >
        <Link
          href={buildHref(basePath, totalPages, params)}
          aria-label="Última página"
          tabIndex={isLast ? -1 : 0}
        >
          <ChevronsRight className="h-4 w-4" />
        </Link>
      </Button>
    </nav>
  );
}
