// src/hooks/useFertilizerOperations.js
import { fertilizerApi } from '@/api/fertilizerApi';
import { useToast } from '@/components/ui/use-toast';
import { useFertilizer } from '@/context/FertilizerContext';
import { useCallback } from 'react';
import * as XLSX from 'xlsx';

export const useFertilizerOperations = () => {
  const { 
    setLoading, 
    setError, 
    setAllocations, 
    setPagination, 
    updateFilters, 
    filters 
  } = useFertilizer();
  const { toast } = useToast();

  const fetchAllocations = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      const response = await fertilizerApi.getAllAllocations(page, filters);
      setAllocations(response.content);
      setPagination({
        currentPage: page,
        totalPages: response.totalPages,
        totalItems: response.totalElements
      });
      setError(null);
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to fetch allocations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [filters, setAllocations, setError, setLoading, setPagination, toast]);

  const createAllocation = async (data) => {
    try {
      setLoading(true);
      await fertilizerApi.createAllocation(data);
      toast({
        title: "Success",
        description: "Allocation created successfully",
        variant: "success"
      });
      await fetchAllocations(0); // Refresh first page
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to create allocation",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCollectionStatus = async (id, status) => {
    try {
      setLoading(true);
      await fertilizerApi.updateCollectionStatus(id, status);
      toast({
        title: "Success",
        description: "Collection status updated successfully",
        variant: "success"
      });
      await fetchAllocations(0);
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to update collection status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setDistributionDetails = async (id, details) => {
    try {
      setLoading(true);
      await fertilizerApi.setDistributionDetails(id, details);
      toast({
        title: "Success",
        description: "Distribution details set successfully",
        variant: "success"
      });
      await fetchAllocations(0);
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to set distribution details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilters = async (newFilters) => {
    updateFilters(newFilters);
    await fetchAllocations(0); // Reset to first page with new filters
  };

  const exportToExcel = (allocations) => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(allocations);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Allocations');
      XLSX.writeFile(workbook, 'fertilizer-allocations.xlsx');
      toast({
        title: "Success",
        description: "Data exported successfully",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive"
      });
    }
  };

  return {
    fetchAllocations,
    createAllocation,
    updateCollectionStatus,
    setDistributionDetails,
    handleFilters,
    exportToExcel
  };
};

export default useFertilizerOperations;