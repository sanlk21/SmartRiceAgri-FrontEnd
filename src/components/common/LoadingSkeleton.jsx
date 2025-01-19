// src/components/common/LoadingSkeleton.jsx
import { Card, CardContent } from '@/components/ui/card';

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array(4).fill(0).map((_, i) => (
        <Card key={i} className="h-[120px]">
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-8 bg-gray-200 rounded w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default LoadingSkeleton;