import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-10">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image skeleton */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-snow">
          <Skeleton className="h-full w-full rounded-none bg-silver-mist" />
        </div>

        {/* Info skeleton */}
        <div className="flex flex-col justify-center gap-6">
          {/* Rarity + category pills */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-24 rounded-full bg-silver-mist" />
            <Skeleton className="h-7 w-20 rounded-full bg-silver-mist" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-3/4 bg-silver-mist" />
            <Skeleton className="h-10 w-1/2 bg-silver-mist" />
          </div>

          {/* Price */}
          <Skeleton className="h-8 w-32 bg-silver-mist" />

          {/* Stock */}
          <Skeleton className="h-4 w-40 bg-silver-mist" />

          {/* Divider */}
          <div className="h-px bg-silver-mist" />

          {/* CTA */}
          <Skeleton className="h-12 w-full rounded-full bg-silver-mist" />
        </div>
      </div>
    </div>
  );
}
