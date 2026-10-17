export default function WavingSkeleton({ isRtl = false }: { isRtl?: boolean }) {
  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-6 sm:px-8 space-y-12">
      {/* Chapter Title & Subtitle Waving Skeleton */}
      <div className="flex flex-col items-center justify-center space-y-3 pb-8 border-b border-[#E8E1D5] dark:border-[#2E2B26]">
        <div className="h-3 w-28 rounded-full skeleton-waving"></div>
        <div className="h-10 w-64 rounded-xl skeleton-waving"></div>
        <div className="h-6 w-36 rounded-lg skeleton-waving"></div>
      </div>

      {/* Verses Text Area Waving Skeleton */}
      <div className="space-y-8">
        {Array.from({ length: 14 }).map((_, i) => {
          const width1 = ['w-full', 'w-[96%]', 'w-[92%]', 'w-[98%]'][i % 4];
          const width2 = ['w-3/4', 'w-4/5', 'w-2/3', 'w-5/6'][i % 4];

          return (
            <div
              key={i}
              className={`flex gap-5 items-baseline ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Verse number indicator */}
              <div className="h-4 w-7 rounded-sm skeleton-waving shrink-0 mt-1.5 opacity-60"></div>

              {/* Verse text lines */}
              <div className="flex-1 space-y-3.5">
                <div className={`h-5 ${width1} rounded-md skeleton-waving`}></div>
                <div className={`h-5 ${width2} rounded-md skeleton-waving ${isRtl ? 'ml-auto' : ''}`}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
