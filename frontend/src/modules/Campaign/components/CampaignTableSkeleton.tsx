export default function CampaignTableSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-8 bg-gray-200 rounded animate-pulse"
        />
      ))}
    </div>
  )
}