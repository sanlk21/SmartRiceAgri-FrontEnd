// src/components/shared/orders/BidOrderConfirmation.jsx
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { formatBidAmount } from '@/utils/bidUtils';
import {
    Calendar,
    CheckCircle2,
    Download,
    FileText,
    Printer,
    Truck
} from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';

const BidOrderConfirmation = ({ 
    order, 
    isOpen, 
    onClose,
    onDownloadReceipt,
    onPrintOrder
}) => {
    const [downloading, setDownloading] = useState(false);
    const [printing, setPrinting] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            await onDownloadReceipt(order.id);
        } finally {
            setDownloading(false);
        }
    };

    const handlePrint = async () => {
        setPrinting(true);
        try {
            await onPrintOrder(order.id);
        } finally {
            setPrinting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-6 w-6" />
                        <DialogTitle>Order Confirmed!</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Order Success Message */}
                    <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700">
                            Your order has been successfully placed and confirmed.
                        </AlertDescription>
                    </Alert>

                    {/* Order Details */}
                    <Card className="p-4">
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium mb-2">Order Details</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <p className="text-gray-500">Order ID:</p>
                                    <p>{order.id}</p>
                                    <p className="text-gray-500">Rice Variety:</p>
                                    <p>{order.riceVariety}</p>
                                    <p className="text-gray-500">Quantity:</p>
                                    <p>{order.quantity}kg</p>
                                    <p className="text-gray-500">Price per kg:</p>
                                    <p>{formatBidAmount(order.pricePerKg)}</p>
                                    <p className="text-gray-500 font-medium">Total Amount:</p>
                                    <p className="font-medium">
                                        {formatBidAmount(order.quantity * order.pricePerKg)}
                                    </p>
                                </div>
                            </div>

                            {/* Delivery Information */}
                            <div>
                                <h4 className="font-medium mb-2">Delivery Information</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Truck className="h-4 w-4 text-gray-400" />
                                        <span>Estimated Delivery:</span>
                                        <span className="font-medium">
                                            {new Date(order.estimatedDelivery).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span>Collection Window:</span>
                                        <span className="font-medium">
                                            {new Date(order.collectionStart).toLocaleDateString()} - 
                                            {new Date(order.collectionEnd).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Seller Information */}
                            <div>
                                <h4 className="font-medium mb-2">Seller Information</h4>
                                <div className="text-sm space-y-1">
                                    <p>Name: {order.sellerName}</p>
                                    <p>Contact: {order.sellerContact}</p>
                                    <p>Location: {order.sellerLocation}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Action Buttons */}
                    <DialogFooter className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleDownload}
                            disabled={downloading}
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            {downloading ? 'Downloading...' : 'Download Receipt'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handlePrint}
                            disabled={printing}
                            className="flex items-center gap-2"
                        >
                            <Printer className="h-4 w-4" />
                            {printing ? 'Printing...' : 'Print Order'}
                        </Button>
                        <Button
                            onClick={onClose}
                            className="flex items-center gap-2"
                        >
                            <FileText className="h-4 w-4" />
                            View Orders
                        </Button>
                    </DialogFooter>

                    {/* Next Steps */}
                    <div className="text-sm text-gray-500 space-y-2">
                        <p className="font-medium">Next Steps:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Check your email for order confirmation</li>
                            <li>Contact seller to arrange collection</li>
                            <li>Prepare necessary documentation for collection</li>
                            <li>Inspect goods during collection</li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

BidOrderConfirmation.propTypes = {
    order: PropTypes.shape({
        id: PropTypes.string.isRequired,
        riceVariety: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        pricePerKg: PropTypes.number.isRequired,
        estimatedDelivery: PropTypes.string.isRequired,
        collectionStart: PropTypes.string.isRequired,
        collectionEnd: PropTypes.string.isRequired,
        sellerName: PropTypes.string.isRequired,
        sellerContact: PropTypes.string.isRequired,
        sellerLocation: PropTypes.string.isRequired,
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDownloadReceipt: PropTypes.func.isRequired,
    onPrintOrder: PropTypes.func.isRequired,
};

export default BidOrderConfirmation;