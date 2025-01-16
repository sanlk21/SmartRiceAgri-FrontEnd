// src/hooks/useBidNotifications.jsx
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, AlertTriangle, BellRing, Check } from 'lucide-react';
import { useCallback } from 'react';

export const useBidNotifications = () => {
  const { toast } = useToast();

  const showNotification = useCallback((title, description, variant = "default", icon = null) => {
    toast({
      title,
      description,
      variant,
      duration: 5000,
      className: variant === "destructive" ? "bg-red-50" : "bg-white",
      icon: icon && (
        <span className={`mr-2 ${
          variant === "destructive" ? "text-red-500" : 
          variant === "success" ? "text-green-500" : 
          "text-blue-500"
        }`}>
          {icon}
        </span>
      ),
    });
  }, [toast]);

  // Bid Placed Notifications
  const showBidPlaced = useCallback((amount, variety) => {
    showNotification(
      "Bid Placed Successfully",
      `Your bid of Rs.${amount} for ${variety} rice has been placed successfully.`,
      "success",
      <Check className="h-5 w-5" />
    );
  }, [showNotification]);

  // Bid Won Notifications
  const showBidWon = useCallback((bidDetails) => {
    showNotification(
      "Congratulations! Bid Won",
      `You've won the bid for ${bidDetails.quantity}kg of ${bidDetails.riceVariety} at Rs.${bidDetails.winningBidAmount}/kg`,
      "success",
      <Check className="h-5 w-5" />
    );
  }, [showNotification]);

  // Bid Lost Notifications
  const showBidLost = useCallback((bidDetails) => {
    showNotification(
      "Bid Unsuccessful",
      `Your bid for ${bidDetails.riceVariety} was not successful. The winning bid was Rs.${bidDetails.winningBidAmount}/kg`,
      "default",
      <AlertCircle className="h-5 w-5" />
    );
  }, [showNotification]);

  // Bid Expiring Soon Notifications
  const showBidExpiringSoon = useCallback((bidId, timeLeft) => {
    showNotification(
      "Bid Expiring Soon",
      `Your bid #${bidId} will expire in ${timeLeft}. Take action if needed.`,
      "warning",
      <AlertTriangle className="h-5 w-5" />
    );
  }, [showNotification]);

  // Bid Expired Notifications
  const showBidExpired = useCallback((bidDetails) => {
    showNotification(
      "Bid Expired",
      `Your bid for ${bidDetails.quantity}kg of ${bidDetails.riceVariety} has expired.`,
      "default",
      <BellRing className="h-5 w-5" />
    );
  }, [showNotification]);

  // Bid Cancelled Notifications
  const showBidCancelled = useCallback((bidId) => {
    showNotification(
      "Bid Cancelled",
      `Bid #${bidId} has been cancelled successfully.`,
      "default",
      <Check className="h-5 w-5" />
    );
  }, [showNotification]);

  // New Bid Offer Notifications (for farmers)
  const showNewBidOffer = useCallback((offerDetails) => {
    showNotification(
      "New Bid Offer Received",
      `New offer of Rs.${offerDetails.amount}/kg for your ${offerDetails.riceVariety} listing.`,
      "default",
      <BellRing className="h-5 w-5" />
    );
  }, [showNotification]);

  // Bid Error Notifications
  const showBidError = useCallback((error) => {
    showNotification(
      "Bid Error",
      error.message || "An error occurred while processing your bid.",
      "destructive",
      <AlertTriangle className="h-5 w-5" />
    );
  }, [showNotification]);

  // Outbid Notifications
  const showOutbidNotification = useCallback((bidDetails) => {
    showNotification(
      "You've Been Outbid!",
      `Someone has placed a higher bid of Rs.${bidDetails.newAmount}/kg on ${bidDetails.riceVariety}.`,
      "warning",
      <AlertTriangle className="h-5 w-5" />
    );
  }, [showNotification]);

  // Price Update Notifications
  const showPriceUpdateNotification = useCallback((updateDetails) => {
    showNotification(
      "Price Update",
      `The minimum price for ${updateDetails.riceVariety} has been updated to Rs.${updateDetails.newPrice}/kg.`,
      "default",
      <BellRing className="h-5 w-5" />
    );
  }, [showNotification]);

  // Bid Acceptance Notifications
  const showBidAcceptedNotification = useCallback((bidDetails) => {
    showNotification(
      "Bid Accepted",
      `Your bid for ${bidDetails.quantity}kg of ${bidDetails.riceVariety} has been accepted by the farmer.`,
      "success",
      <Check className="h-5 w-5" />
    );
  }, [showNotification]);

  return {
    showBidPlaced,
    showBidWon,
    showBidLost,
    showBidExpiringSoon,
    showBidExpired,
    showBidCancelled,
    showNewBidOffer,
    showBidError,
    showOutbidNotification,
    showPriceUpdateNotification,
    showBidAcceptedNotification
  };
};

export default useBidNotifications;