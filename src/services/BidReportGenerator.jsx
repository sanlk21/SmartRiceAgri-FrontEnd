// src/services/BidReportGenerator.js
import { formatBidAmount } from '@/utils/bidUtils';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

class BidReportGenerator {
    constructor() {
        this.doc = new jsPDF();
    }

    generateBidReport(bidData, reportType) {
        switch (reportType) {
            case 'daily':
                return this.generateDailyReport(bidData);
            case 'monthly':
                return this.generateMonthlyReport(bidData);
            case 'summary':
                return this.generateSummaryReport(bidData);
            case 'transaction':
                return this.generateTransactionReport(bidData);
            default:
                throw new Error('Invalid report type');
        }
    }

    generateDailyReport(bids) {
        this.doc = new jsPDF();
        const today = format(new Date(), 'yyyy-MM-dd');

        // Add header
        this.doc.setFontSize(18);
        this.doc.text('Daily Bid Report', 14, 20);
        this.doc.setFontSize(12);
        this.doc.text(`Date: ${today}`, 14, 30);

        // Add bid summary
        const bidSummary = this.calculateBidSummary(bids);
        this.addSummarySection(bidSummary, 40);

        // Add bid details table
        const tableData = bids.map(bid => [
            bid.id,
            bid.riceVariety,
            bid.quantity + ' kg',
            formatBidAmount(bid.amount),
            bid.status,
            format(new Date(bid.timestamp), 'HH:mm:ss')
        ]);

        this.doc.autoTable({
            startY: 90,
            head: [['Bid ID', 'Rice Variety', 'Quantity', 'Amount', 'Status', 'Time']],
            body: tableData,
            theme: 'grid',
        });

        return this.doc;
    }

    generateMonthlyReport(bids) {
        this.doc = new jsPDF();
        const month = format(new Date(), 'MMMM yyyy');

        // Add header
        this.doc.setFontSize(18);
        this.doc.text('Monthly Bid Report', 14, 20);
        this.doc.setFontSize(12);
        this.doc.text(`Month: ${month}`, 14, 30);

        // Add monthly statistics
        const monthlyStats = this.calculateMonthlyStatistics(bids);
        this.addMonthlyStatistics(monthlyStats, 40);

        // Add trend analysis
        this.addTrendAnalysis(bids, 100);

        return this.doc;
    }

    generateSummaryReport(bids) {
        this.doc = new jsPDF();

        // Add header
        this.doc.setFontSize(18);
        this.doc.text('Bid Summary Report', 14, 20);

        // Add summary statistics
        const summary = this.calculateBidSummary(bids);
        this.addSummarySection(summary, 40);

        // Add rice variety distribution
        const varietyDistribution = this.calculateVarietyDistribution(bids);
        this.addVarietyDistribution(varietyDistribution, 100);

        // Add success rate analysis
        const successRate = this.calculateSuccessRate(bids);
        this.addSuccessRateAnalysis(successRate, 150);

        return this.doc;
    }

    generateTransactionReport(bidData) {
        this.doc = new jsPDF();

        // Add header
        this.doc.setFontSize(18);
        this.doc.text('Transaction Report', 14, 20);

        // Add transaction details
        const transactionDetails = this.formatTransactionDetails(bidData);
        this.addTransactionDetails(transactionDetails, 40);

        // Add payment summary
        if (bidData.payment) {
            this.addPaymentSummary(bidData.payment, 100);
        }

        return this.doc;
    }

    // Helper methods
    calculateBidSummary(bids) {
        return {
            totalBids: bids.length,
            totalValue: bids.reduce((sum, bid) => sum + (bid.amount * bid.quantity), 0),
            averageBidAmount: bids.reduce((sum, bid) => sum + bid.amount, 0) / bids.length,
            successfulBids: bids.filter(bid => bid.status === 'WON').length
        };
    }

    calculateMonthlyStatistics(bids) {
        const weeklyStats = this.groupBidsByWeek(bids);
        return {
            weeklyStats,
            totalVolume: bids.reduce((sum, bid) => sum + bid.quantity, 0),
            averagePrice: bids.reduce((sum, bid) => sum + bid.amount, 0) / bids.length,
            totalValue: bids.reduce((sum, bid) => sum + (bid.amount * bid.quantity), 0)
        };
    }

    calculateVarietyDistribution(bids) {
        return bids.reduce((acc, bid) => {
            acc[bid.riceVariety] = (acc[bid.riceVariety] || 0) + 1;
            return acc;
        }, {});
    }

    calculateSuccessRate(bids) {
        const totalBids = bids.length;
        const successfulBids = bids.filter(bid => bid.status === 'WON').length;
        return (successfulBids / totalBids) * 100;
    }

    groupBidsByWeek(bids) {
        const weeks = {};
        bids.forEach(bid => {
            const week = format(new Date(bid.timestamp), 'w');
            if (!weeks[week]) {
                weeks[week] = {
                    bids: 0,
                    volume: 0,
                    value: 0
                };
            }
            weeks[week].bids++;
            weeks[week].volume += bid.quantity;
            weeks[week].value += bid.amount * bid.quantity;
        });
        return weeks;
    }

    addSummarySection(summary, startY) {
        this.doc.setFontSize(14);
        this.doc.text('Summary', 14, startY);
        this.doc.setFontSize(12);
        
        const summaryText = [
            `Total Bids: ${summary.totalBids}`,
            `Total Value: ${formatBidAmount(summary.totalValue)}`,
            `Average Bid Amount: ${formatBidAmount(summary.averageBidAmount)}`,
            `Successful Bids: ${summary.successfulBids}`
        ];

        summaryText.forEach((text, index) => {
            this.doc.text(text, 14, startY + 10 + (index * 7));
        });
    }

    addMonthlyStatistics(stats, startY) {
        this.doc.setFontSize(14);
        this.doc.text('Monthly Statistics', 14, startY);
        this.doc.setFontSize(12);

        const tableData = Object.entries(stats.weeklyStats).map(([week, data]) => [
            `Week ${week}`,
            data.bids.toString(),
            `${data.volume} kg`,
            formatBidAmount(data.value)
        ]);

        this.doc.autoTable({
            startY: startY + 10,
            head: [['Week', 'Bids', 'Volume', 'Value']],
            body: tableData,
            theme: 'grid',
        });
    }

    addVarietyDistribution(distribution, startY) {
        this.doc.setFontSize(14);
        this.doc.text('Rice Variety Distribution', 14, startY);
        this.doc.setFontSize(12);

        const tableData = Object.entries(distribution).map(([variety, count]) => [
            variety,
            count.toString()
        ]);

        this.doc.autoTable({
            startY: startY + 10,
            head: [['Rice Variety', 'Count']],
            body: tableData,
            theme: 'grid',
        });
    }

    addSuccessRateAnalysis(successRate, startY) {
        this.doc.setFontSize(14);
        this.doc.text('Success Rate Analysis', 14, startY);
        this.doc.setFontSize(12);
        this.doc.text(`Overall Success Rate: ${successRate.toFixed(1)}%`, 14, startY + 10);
    }

    formatTransactionDetails(bidData) {
        return {
            bidId: bidData.id,
            transactionDate: format(new Date(bidData.transaction?.timestamp), 'yyyy-MM-dd HH:mm:ss'),
            amount: formatBidAmount(bidData.amount * bidData.quantity),
            status: bidData.transaction?.status,
            paymentMethod: bidData.transaction?.paymentMethod
        };
    }

    addTransactionDetails(details, startY) {
        this.doc.setFontSize(12);
        const detailsText = [
            `Bid ID: ${details.bidId}`,
            `Transaction Date: ${details.transactionDate}`,
            `Amount: ${details.amount}`,
            `Status: ${details.status}`,
            `Payment Method: ${details.paymentMethod}`
        ];

        detailsText.forEach((text, index) => {
            this.doc.text(text, 14, startY + (index * 7));
        });
    }

    addPaymentSummary(payment, startY) {
        this.doc.setFontSize(14);
        this.doc.text('Payment Summary', 14, startY);
        this.doc.setFontSize(12);

        const paymentDetails = [
            `Payment ID: ${payment.id}`,
            `Amount: ${formatBidAmount(payment.amount)}`,
            `Status: ${payment.status}`,
            `Method: ${payment.method}`,
            `Processed Date: ${format(new Date(payment.processedDate), 'yyyy-MM-dd HH:mm:ss')}`
        ];

        paymentDetails.forEach((text, index) => {
            this.doc.text(text, 14, startY + 10 + (index * 7));
        });
    }

    addTrendAnalysis(bids, startY) {
        // Sort bids by date
        const sortedBids = [...bids].sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
        );

        // Calculate daily averages
        const dailyAverages = sortedBids.reduce((acc, bid) => {
            const date = format(new Date(bid.timestamp), 'yyyy-MM-dd');
            if (!acc[date]) {
                acc[date] = {
                    total: 0,
                    count: 0,
                    average: 0
                };
            }
            acc[date].total += bid.amount;
            acc[date].count++;
            acc[date].average = acc[date].total / acc[date].count;
            return acc;
        }, {});

        const tableData = Object.entries(dailyAverages).map(([date, data]) => [
            date,
            formatBidAmount(data.average),
            data.count.toString()
        ]);

        this.doc.setFontSize(14);
        this.doc.text('Price Trend Analysis', 14, startY);

        this.doc.autoTable({
            startY: startY + 10,
            head: [['Date', 'Average Price', 'Number of Bids']],
            body: tableData,
            theme: 'grid',
        });
    }

    exportToExcel(bids) {
        try {
            const workbook = XLSX.utils.book_new();

            // Bids worksheet
            const bidsData = bids.map(bid => ({
                'Bid ID': bid.id,
                'Date': format(new Date(bid.timestamp), 'yyyy-MM-dd HH:mm:ss'),
                'Rice Variety': bid.riceVariety,
                'Quantity (kg)': bid.quantity,
                'Amount': formatBidAmount(bid.amount),
                'Total Value': formatBidAmount(bid.amount * bid.quantity),
                'Status': bid.status,
                'Buyer': bid.buyerName,
                'Seller': bid.sellerName
            }));
            const bidsSheet = XLSX.utils.json_to_sheet(bidsData);
            XLSX.utils.book_append_sheet(workbook, bidsSheet, 'Bids');

            // Summary worksheet
            const summary = this.calculateBidSummary(bids);
            const summaryData = [
                ['Summary Statistics', ''],
                ['Total Bids', summary.totalBids],
                ['Total Value', formatBidAmount(summary.totalValue)],
                ['Average Bid Amount', formatBidAmount(summary.averageBidAmount)],
                ['Successful Bids', summary.successfulBids]
            ];
            const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

            // Generate Excel file
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            return new Blob([excelBuffer], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
        } catch (error) {
            console.error('Excel export error:', error);
            throw new Error('Failed to export Excel file');
        }
    }

    exportToPDF() {
        return this.doc.output('blob');
    }
}

export default new BidReportGenerator();