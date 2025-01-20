import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Beaker, MapPin } from "lucide-react";
import PropTypes from "prop-types";

const LandList = ({ lands = [], onSelect }) => {
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Lands</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lands && lands.length > 0 ? (
            lands.map((land) => (
              <div
                key={land?.id || Math.random().toString()}
                onClick={() => onSelect && onSelect(land)}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{land?.location || 'N/A'}</span>
                    </div>
                    <p className="text-sm text-gray-500">{land?.district || 'N/A'}</p>
                    <p className="text-sm">
                      Size: {typeof land?.size === 'number' ? `${land.size} hectares` : 'N/A'}
                    </p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(land?.status)}>
                    {land?.status || 'PENDING'}
                  </Badge>
                </div>

                {land?.status?.toUpperCase() === 'VERIFIED' ? (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Beaker className="h-4 w-4" />
                      <span>
                        Total NPK Quota:{' '}
                        {typeof land?.totalNpkQuota === 'number'
                          ? `${land.totalNpkQuota.toFixed(2)} kg`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Pending verification for fertilizer allocation</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No lands registered yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

LandList.propTypes = {
  lands: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      location: PropTypes.string,
      district: PropTypes.string,
      size: PropTypes.number,
      status: PropTypes.string,
      totalNpkQuota: PropTypes.number,
    })
  ),
  onSelect: PropTypes.func,
};

LandList.defaultProps = {
  lands: [],
  onSelect: () => {},
};

export default LandList;