import { Skeleton } from '@/components/ui/skeleton';
import { SKELETON } from '@/constants/ui.constants';

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl bg-snow">
      <div className="relative aspect-square overflow-hidden bg-fog">
        <Skeleton className="h-full w-full rounded-none bg-silver-mist" />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-3 w-20 bg-silver-mist" />
        <Skeleton className="h-4 w-40 bg-silver-mist" />
        <Skeleton className="h-5 w-24 bg-silver-mist" />
      </div>
    </div>
  );
}

export default function CatalogLoading() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-10">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="mb-2 h-10 w-48 bg-silver-mist" />
        <Skeleton className="h-4 w-36 bg-silver-mist" />
      </div>

      {/* Filter pills */}
      <div className="mb-8 flex gap-2">
        <Skeleton className="h-8 w-16 rounded-full bg-silver-mist" />
        <Skeleton className="h-8 w-20 rounded-full bg-silver-mist" />
        <Skeleton className="h-8 w-24 rounded-full bg-silver-mist" />
        <Skeleton className="h-8 w-16 rounded-full bg-silver-mist" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: SKELETON.CARD_COUNT }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
