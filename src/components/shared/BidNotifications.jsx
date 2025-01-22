// src/components/shared/BidNotifications.jsx
import { useToast } from '@/components/ui/use-toast';

export const useBidNotifications = () => {
  const { toast } = useToast();

  const showBidPlaced = () => {
    toast({
      title: "Bid Placed Successfully",
      description: "Your bid has been placed. You will be notified when the farmer responds.",
      variant: "success",
    });
  };

  const showBidCreated = () => {
    toast({
      title: "Bid Created Successfully",
      description: "Your bid listing is now active and visible to buyers.",
      variant: "success",
    });
  };

  const showBidCancelled = () => {
    toast({
      title: "Bid Cancelled",
      description: "The bid has been cancelled successfully.",
      variant: "info",
    });
  };

  const showBidWon = (bidDetails) => {
    toast({
      title: "Congratulations! You Won the Bid",
      description: `You won the bid for ${bidDetails.quantity}kg of ${bidDetails.riceVariety} at Rs.${bidDetails.winningBidAmount}/kg`,
      variant: "success",
      duration: 6000,
    });
  };

  const showBidExpired = () => {
    toast({
      title: "Bid Expired",
      description: "Your bid listing has expired without any successful offers.",
      variant: "warning",
    });
  };

  const showBidError = (error) => {
    toast({
      title: "Error",
      description: error.message || "An error occurred while processing your bid.",
      variant: "destructive",
    });
  };

  return {
    showBidPlaced,
    showBidCreated,
    showBidCancelled,
    showBidWon,
    showBidExpired,
    showBidError,
  };
};

export default useBidNotifications;