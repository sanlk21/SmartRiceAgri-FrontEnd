import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { validateLandRequest } from "@/types/landTypes";
import PropTypes from "prop-types";
import { useState } from "react";

const LandRegistrationForm = ({ onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    size: "",
    location: "",
    district: "",
  });
  const [errors, setErrors] = useState({});
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const validation = validateLandRequest(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("size", formData.size);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("district", formData.district);

      if (document) {
        formDataToSend.append("document", document);
      }

      await onSubmit(formDataToSend);

      setFormData({
        size: "",
        location: "",
        district: "",
      });
      setDocument(null);

      toast({
        title: "Success",
        description: "Land registered successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to register land",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register New Land</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Land Size (hectares)</label>
            <Input
              type="number"
              step="0.01"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              required
              min="0"
              className={errors.size ? "border-red-500" : ""}
            />
            {errors.size && (
              <p className="text-sm text-red-500 mt-1">{errors.size}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Location</label>
            <Input
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && (
              <p className="text-sm text-red-500 mt-1">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">District</label>
            <Input
              value={formData.district}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value })
              }
              required
              className={errors.district ? "border-red-500" : ""}
            />
            {errors.district && (
              <p className="text-sm text-red-500 mt-1">{errors.district}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Land Document</label>
            <Input
              type="file"
              onChange={(e) => setDocument(e.target.files[0])}
              accept=".pdf,.jpg,.jpeg,.png"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: PDF, JPG, PNG
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Registering..." : "Register Land"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

LandRegistrationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default LandRegistrationForm;
