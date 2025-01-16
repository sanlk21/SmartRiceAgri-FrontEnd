// src/services/BidExportService.js
import { formatBidAmount } from '@/utils/bidUtils';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

class BidExportService {
    async exportToExcel(bids, type = 'all') {
        try {
            const workbook = XLSX.utils.book_new();
            
            switch (type) {
                case 'all':
                    this.addBidWorksheet(workbook, bids);
                    this.addSummaryWorksheet(workbook, bids);
                    this.addAnalyticsWorksheet(workbook, bids);
                    break;
                case 'summary':
                    this.addSummaryWorksheet(workbook, bids);
                    break;
                case 'transactions':
                    this.addTransactionWorksheet(workbook, bids);
                    break;
                case 'analytics':
                    this.addAnalyticsWorksheet(workbook, bids);
                    break;
                default:
                    throw new Error('Invalid export type');
            }

            // Generate filename
            const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
            const filename = `bid_export_${type}_${timestamp}.xlsx`;

            // Convert to blob
            const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            return {
                blob: new Blob([buffer], { 
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }),
                filename
            };
        } catch (error) {
            console.error('Export error:', error);
            throw new Error('Failed to export bid data');
        }
    }

    addBidWorksheet(workbook, bids) {
        // Prepare bid data
        const bidData = bids.map(bid => ({
            'Bid ID': bid.id,
            'Date': format(new Date(bid.timestamp), 'yyyy-MM-dd HH:mm:ss'),
            'Rice Variety': bid.riceVariety,
            'Quantity (kg)': bid.quantity,
            'Bid Amount': formatBidAmount(bid.amount),
            'Total Value': formatBidAmount(bid.amount * bid.quantity),
            'Status': bid.status,
            'Buyer': bid.buyerName,
            'Seller': bid.sellerName,
            'Location': bid.location
        }));

        const worksheet = XLSX.utils.json_to_sheet(bidData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Bids');

        // Set column widths
        const colWidths = [
            { wch: 15 }, // Bid ID
            { wch: 20 }, // Date
            { wch: 15 }, // Rice Variety
            { wch: 12 }, // Quantity
            { wch: 15 }, // Bid Amount
            { wch: 15 }, // Total Value
            { wch: 12 }, // Status
            { wch: 20 }, // Buyer
            { wch: 20 }, // Seller
            { wch: 20 }  // Location
        ];
        worksheet['!cols'] = colWidths;
    }

    addSummaryWorksheet(workbook, bids) {
        // Calculate summary statistics
        const summary = {
            totalBids: bids.length,
            totalValue: bids.reduce((sum, bid) => sum + (bid.amount * bid.quantity), 0),
            averageBidAmount: bids.reduce((sum, bid) => sum + bid.amount, 0) / bids.length,
            successfulBids: bids.filter(bid => bid.status === 'WON').length,
            totalQuantity: bids.reduce((sum, bid) => sum + bid.quantity, 0),
            varietyDistribution: this.calculateVarietyDistribution(bids)
        };

        // Create summary data
        const summaryData = [
            ['Bid Summary Report', ''],
            ['Generated On', format(new Date(), 'yyyy-MM-dd HH:mm:ss')],
            ['', ''],
            ['Total Bids', summary.totalBids],
            ['Successful Bids', summary.successfulBids],
            ['Total Value', formatBidAmount(summary.totalValue)],
            ['Average Bid Amount', formatBidAmount(summary.averageBidAmount)],
            ['Total Quantity (kg)', summary.totalQuantity],
            ['', ''],
            ['Rice Variety Distribution', ''],
            ...Object.entries(summary.varietyDistribution).map(([variety, count]) => 
                [variety, count]
            )
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Summary');

        // Set column widths
        worksheet['!cols'] = [{ wch: 25 }, { wch: 20 }];
    }

    addTransactionWorksheet(workbook, bids) {
        // Filter only successful bids with transactions
        const transactions = bids
            .filter(bid => bid.status === 'WON' && bid.transaction)
            .map(bid => ({
                'Transaction ID': bid.transaction.id,
                'Bid ID': bid.id,
                'Date': format(new Date(bid.transaction.date), 'yyyy-MM-dd HH:mm:ss'),
                'Amount': formatBidAmount(bid.transaction.amount),
                'Payment Method': bid.transaction.paymentMethod,
                'Status': bid.transaction.status,
                'Buyer': bid.buyerName,
                'Seller': bid.sellerName
            }));

        const worksheet = XLSX.utils.json_to_sheet(transactions);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

        // Set column widths
        worksheet['!cols'] = [
            { wch: 20 }, // Transaction ID
            { wch: 15 }, // Bid ID
            { wch: 20 }, // Date
            { wch: 15 }, // Amount
            { wch: 15 }, // Payment Method
            { wch: 12 }, // Status
            { wch: 20 }, // Buyer
            { wch: 20 }  // Seller
        ];
    }

    addAnalyticsWorksheet(workbook, bids) {
        // Prepare analytics data
        const analytics = {
            dailyStats: this.calculateDailyStats(bids),
            varietyStats: this.calculateVarietyStats(bids),
            priceAnalysis: this.calculatePriceAnalysis(bids)
        };

        // Daily Statistics
        const dailyData = Object.entries(analytics.dailyStats).map(([date, stats]) => ({
            'Date': date,
            'Total Bids': stats.count,
            'Total Value': formatBidAmount(stats.value),
            'Average Bid': formatBidAmount(stats.average),
            'Success Rate': `${(stats.successRate * 100).toFixed(1)}%`
        }));

        const dailySheet = XLSX.utils.json_to_sheet(dailyData);
        XLSX.utils.book_append_sheet(workbook, dailySheet, 'Daily Analysis');

        // Variety Statistics
        const varietyData = Object.entries(analytics.varietyStats).map(([variety, stats]) => ({
            'Rice Variety': variety,
            'Total Bids': stats.count,
            'Average Price': formatBidAmount(stats.averagePrice),
            'Total Volume': `${stats.totalVolume} kg`,
            'Market Share': `${(stats.marketShare * 100).toFixed(1)}%`
        }));

        const varietySheet = XLSX.utils.json_to_sheet(varietyData);
        XLSX.utils.book_append_sheet(workbook, varietySheet, 'Variety Analysis');
    }

    // Helper methods
    calculateVarietyDistribution(bids) {
        return bids.reduce((acc, bid) => {
            acc[bid.riceVariety] = (acc[bid.riceVariety] || 0) + 1;
            return acc;
        }, {});
    }

    calculateDailyStats(bids) {
        const dailyStats = {};
        bids.forEach(bid => {
            const date = format(new Date(bid.timestamp), 'yyyy-MM-dd');
            if (!dailyStats[date]) {
                dailyStats[date] = {
                    count: 0,
                    value: 0,
                    successful: 0,
                    average: 0
                };
            }
            dailyStats[date].count++;
            dailyStats[date].value += bid.amount * bid.quantity;
            if (bid.status === 'WON') dailyStats[date].successful++;
        });

        // Calculate averages and success rates
        Object.values(dailyStats).forEach(stats => {
            stats.average = stats.value / stats.count;
            stats.successRate = stats.successful / stats.count;
        });

        return dailyStats;
    }

    calculateVarietyStats(bids) {
        const stats = {};
        const totalBids = bids.length;

        bids.forEach(bid => {
            if (!stats[bid.riceVariety]) {
                stats[bid.riceVariety] = {
                    count: 0,
                    totalValue: 0,
                    totalVolume: 0,
                };
            }
            stats[bid.riceVariety].count++;
            stats[bid.riceVariety].totalValue += bid.amount * bid.quantity;
            stats[bid.riceVariety].totalVolume += bid.quantity;
        });

        // Calculate averages and market share
        Object.values(stats).forEach(stat => {
            stat.averagePrice = stat.totalValue / stat.totalVolume;
            stat.marketShare = stat.count / totalBids;
        });

        return stats;
    }

    calculatePriceAnalysis(bids) {
        return {
            min: Math.min(...bids.map(b => b.amount)),
            max: Math.max(...bids.map(b => b.amount)),
            average: bids.reduce((sum, b) => sum + b.amount, 0) / bids.length
        };
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new BidExportService();
        }
        return this.instance;
    }
}

export default BidExportService.getInstance();