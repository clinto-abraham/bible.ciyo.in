import WavingSkeleton from '@/components/WavingSkeleton';

export default function ChapterLoading() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col justify-start">
      <WavingSkeleton />
    </div>
  );
}
