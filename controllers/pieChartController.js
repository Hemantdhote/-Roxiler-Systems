const Transaction = require("../models/Transaction");

exports.getPieChartData = async (req, res) => {
    try {
        const { month } = req.query;
        
        const query = {
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
            }
        };

        const transactions = await Transaction.find(query);

        const categoryCount = transactions.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + 1;
            return acc;
        }, {});

        const pieChartData = Object.entries(categoryCount).map(([category, count]) => ({
            category,
            count
        }));

        res.json(pieChartData);
    } catch (error) {
        res.status(500).json({ error: "Error fetching pie chart data" });
    }
};