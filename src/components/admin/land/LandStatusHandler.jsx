import { landApi } from "@/api/landApi";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import PropTypes from "prop-types";
import { showVerificationToast } from "./LandVerificationToast";

const LandStatusHandler = ({ land, onStatusChange }) => {
  const handleStatusUpdate = async (newStatus) => {
    try {
      const updatedLand = await landApi.updateLandStatus(land.id, newStatus);
      onStatusChange(updatedLand);
      showVerificationToast(updatedLand);
    } catch (error) {
      console.error("Error updating land status:", error);
      // Show error toast or handle error appropriately
      throw error;
    }
  };

  if (land.status !== "PENDING") {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        className="text-green-600"
        onClick={() => handleStatusUpdate("APPROVED")} // Changed from VERIFIED to APPROVED
      >
        <Check className="h-4 w-4 mr-1" />
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-red-600"
        onClick={() => handleStatusUpdate("REJECTED")}
      >
        <X className="h-4 w-4 mr-1" />
        Reject
      </Button>
    </div>
  );
};

LandStatusHandler.propTypes = {
  land: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["PENDING", "APPROVED", "REJECTED"]).isRequired, // Changed VERIFIED to APPROVED
  }).isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

export default LandStatusHandler;