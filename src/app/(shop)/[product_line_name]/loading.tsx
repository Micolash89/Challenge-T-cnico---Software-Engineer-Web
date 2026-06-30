import { Skeleton } from '@/components/ui/skeleton';
import { SKELETON } from '@/constants/ui.constants';

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-snow">
      <div className="relative aspect-square overflow-hidden bg-fog">
        <Skeleton className="h-full w-full rounded-none bg-silver-mist" />
      </div>
      <div className="flex flex-col gap-1 px-5 pt-3 pb-2">
        <Skeleton className="h-3 w-20 bg-silver-mist" />
        <Skeleton className="h-4 w-40 bg-silver-mist" />
        <Skeleton className="h-5 w-24 bg-silver-mist" />
      </div>
      <div className="px-5 pb-4">
        <Skeleton className="h-10 w-full rounded-md bg-silver-mist" />
      </div>
    </div>
  );
}

export default function CatalogLoading() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-10">
      <div className="mb-8">
        <Skeleton className="mb-2 h-10 w-48 bg-silver-mist" />
        <Skeleton className="h-4 w-36 bg-silver-mist" />
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <Skeleton className="h-8 w-20 rounded-lg bg-silver-mist" />
        <Skeleton className="h-8 w-32 rounded-lg bg-silver-mist" />
        <Skeleton className="h-8 w-32 rounded-lg bg-silver-mist" />
        <Skeleton className="h-8 w-24 rounded-lg bg-silver-mist" />
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: SKELETON.CARD_COUNT }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
