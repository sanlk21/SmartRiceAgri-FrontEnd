import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Check,
  MapPin,
  Package,
  User,
  X
} from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";

const AdminLandList = ({ lands = [], onStatusUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': // Changed from VERIFIED to APPROVED
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredLands = selectedStatus === 'ALL' 
    ? lands 
    : lands.filter(land => land.status === selectedStatus);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Land Registrations</CardTitle>
          <div className="flex gap-2">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => ( // Changed VERIFIED to APPROVED
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                onClick={() => setSelectedStatus(status)}
                size="sm"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredLands.map((land) => (
            <article 
              key={land.id} 
              className="p-4 border rounded-lg"
              aria-label={`Land ID ${land.id}`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{land.farmerNic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p>{land.location}</p>
                      <p className="text-sm text-gray-500">{land.district}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span>{land.size} hectares</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span 
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(land.status)}`}
                    aria-label={`Status: ${land.status}`}
                  >
                    {land.status}
                  </span>
                  
                  {land.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600"
                        onClick={() => onStatusUpdate(land.id, 'APPROVED')} // Changed from VERIFIED to APPROVED
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => onStatusUpdate(land.id, 'REJECTED')}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {land.documentName && (
                <div className="mt-3 pt-3 border-t">
                  <a 
                    href={`/api/lands/${land.id}/document`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    View Document: {land.documentName}
                  </a>
                </div>
              )}
            </article>
          ))}

          {filteredLands.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No lands found with the selected status.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

AdminLandList.propTypes = {
  lands: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      farmerNic: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      district: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      status: PropTypes.oneOf(['PENDING', 'APPROVED', 'REJECTED']).isRequired, // Changed VERIFIED to APPROVED
      documentName: PropTypes.string,
    })
  ).isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
};

export default AdminLandList;