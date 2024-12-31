const axios = require('axios');

exports.getCombinedData = async (req, res) => {
    try {
        const { month } = req.query;
        const baseUrl = `${req.protocol}://${req.get('host')}/api`;

        const [transactions, statistics, barChart, pieChart] = await Promise.all([
            axios.get(`${baseUrl}/transactions?month=${month}`),
            axios.get(`${baseUrl}/statistics?month=${month}`),
            axios.get(`${baseUrl}/bar-chart?month=${month}`),
            axios.get(`${baseUrl}/pie-chart?month=${month}`)
        ]);

        res.json({
            transactions: transactions.data,
            statistics: statistics.data,
            barChart: barChart.data,
            pieChart: pieChart.data
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching combined data" });
    }
};