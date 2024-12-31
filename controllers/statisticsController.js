const Transaction = require("../models/Transaction");

exports.getStatistics = async (req, res) => {
    try {
        const { month } = req.query;
        
        const query = {
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
            }
        };

        const transactions = await Transaction.find(query);

        const totalSaleAmount = transactions.reduce((sum, t) => sum + t.price, 0);
        const soldItems = transactions.filter(t => t.sold).length;
        const notSoldItems = transactions.filter(t => !t.sold).length;

        res.json({
            totalSaleAmount,
            soldItems,
            notSoldItems
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching statistics" });
    }
};