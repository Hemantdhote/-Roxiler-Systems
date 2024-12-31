const Transaction = require("../models/Transaction");

exports.getBarChartData = async (req, res) => {
    try {
        const { month } = req.query;
        
        const query = {
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
            }
        };

        const transactions = await Transaction.find(query);

        const ranges = [
            { min: 0, max: 100 },
            { min: 101, max: 200 },
            { min: 201, max: 300 },
            { min: 301, max: 400 },
            { min: 401, max: 500 },
            { min: 501, max: 600 },
            { min: 601, max: 700 },
            { min: 701, max: 800 },
            { min: 801, max: 900 },
            { min: 901, max: Infinity }
        ];

        const barChartData = ranges.map(range => ({
            range: range.max === Infinity ? '901-above' : `${range.min}-${range.max}`,
            count: transactions.filter(t => 
                t.price >= range.min && t.price <= range.max
            ).length
        }));

        res.json(barChartData);
    } catch (error) {
        res.status(500).json({ error: "Error fetching bar chart data" });
    }
};