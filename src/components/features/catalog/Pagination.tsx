"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(page));
      }
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      router.push(createPageURL(page));
      window.scrollTo(0, 0);
    },
    [router, createPageURL],
  );

  if (totalPages <= 1) return null;

  const maxVisible = typeof window !== "undefined" && window.innerWidth < 640 ? 3 : 5;
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, currentPage + half);

  if (end - start + 1 < maxVisible) {
    if (start === 1) {
      end = Math.min(totalPages, start + maxVisible - 1);
    } else {
      start = Math.max(1, end - maxVisible + 1);
    }
  }

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav
      aria-label="Paginación"
      className="mt-10 flex items-center justify-center gap-1.5"
    >
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage <= 1}
        className="flex size-9 items-center justify-center rounded-lg border border-silver-mist bg-snow text-graphite transition-colors hover:bg-fog hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Primera página"
      >
        <ChevronsLeft className="size-5" />
      </button>

      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex size-9 items-center justify-center rounded-lg border border-silver-mist bg-snow text-graphite transition-colors hover:bg-fog hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Página anterior"
      >
        <ChevronLeft className="size-5" />
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className="flex size-9 items-center justify-center rounded-lg border border-silver-mist bg-snow text-body-sm text-graphite transition-colors hover:bg-fog hover:text-ink"
          >
            1
          </button>
          {start > 2 && (
            <span className="flex size-9 items-center justify-center text-body-sm text-graphite">
              ...
            </span>
          )}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`flex size-9 items-center justify-center rounded-lg border text-body-sm font-medium transition-colors ${
            page === currentPage
              ? "border-ink bg-ink text-snow"
              : "border-silver-mist bg-snow text-graphite hover:bg-fog hover:text-ink"
          }`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="flex size-9 items-center justify-center text-body-sm text-graphite">
              ...
            </span>
          )}
          <button
            onClick={() => handlePageChange(totalPages)}
            className="flex size-9 items-center justify-center rounded-lg border border-silver-mist bg-snow text-body-sm text-graphite transition-colors hover:bg-fog hover:text-ink"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex size-9 items-center justify-center rounded-lg border border-silver-mist bg-snow text-graphite transition-colors hover:bg-fog hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Página siguiente"
      >
        <ChevronRight className="size-5" />
      </button>

      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage >= totalPages}
        className="flex size-9 items-center justify-center rounded-lg border border-silver-mist bg-snow text-graphite transition-colors hover:bg-fog hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Última página"
      >
        <ChevronsRight className="size-5" />
      </button>
    </nav>
  );
}
