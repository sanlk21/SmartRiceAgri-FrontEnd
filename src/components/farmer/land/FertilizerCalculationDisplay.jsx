import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Beaker } from "lucide-react";
import PropTypes from "prop-types";

const FertilizerCalculationDisplay = ({ landData }) => {
  // Only show calculations if land is verified
  if (landData.status !== 'VERIFIED') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fertilizer Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Fertilizer quotas will be calculated after land verification by admin.
              Current Status: {landData.status}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fertilizer Allocation for {landData.location}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Quota Overview */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold flex items-center gap-2">
              <Beaker className="h-5 w-5 text-blue-500" />
              Total NPK Quota
            </h3>
            <p className="text-2xl font-bold mt-2">{landData.totalNpkQuota?.toFixed(2)} kg</p>
            <p className="text-sm text-gray-600">For {landData.size} hectares</p>
          </div>

          {/* Individual Nutrients */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nitrogen */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-700">Nitrogen (N)</h4>
              <p className="text-xl font-bold mt-1">{landData.nitrogenQuota?.toFixed(2)} kg</p>
              <p className="text-sm text-gray-600">75 kg/ha</p>
            </div>

            {/* Phosphorus */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-700">Phosphorus (P)</h4>
              <p className="text-xl font-bold mt-1">{landData.phosphorusQuota?.toFixed(2)} kg</p>
              <p className="text-sm text-gray-600">35 kg/ha</p>
            </div>

            {/* Potassium */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-700">Potassium (K)</h4>
              <p className="text-xl font-bold mt-1">{landData.potassiumQuota?.toFixed(2)} kg</p>
              <p className="text-sm text-gray-600">40 kg/ha</p>
            </div>
          </div>

          {/* Application Guidelines */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Application Guidelines:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Apply Nitrogen in three split doses (1/3 each during planting, tillering, and heading)</li>
              <li>Apply all Phosphorus at planting time</li>
              <li>Apply Potassium in two split doses (1/2 at planting, 1/2 at heading)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

FertilizerCalculationDisplay.propTypes = {
  landData: PropTypes.shape({
    status: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    totalNpkQuota: PropTypes.number,
    nitrogenQuota: PropTypes.number,
    phosphorusQuota: PropTypes.number,
    potassiumQuota: PropTypes.number,
  }).isRequired,
};

export default FertilizerCalculationDisplay;
