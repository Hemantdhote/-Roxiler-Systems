const Transaction = require("../models/Transaction");
const axios = require("axios");

exports.seedDatabase = async (req, res) => {
    try {
        const response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
        await Transaction.deleteMany({});
        await Transaction.insertMany(response.data);
        res.json({ message: "Database seeded successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error seeding database" });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const { month = 3, search = "", page = 1, perPage = 10 } = req.query;
        
        const query = {
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
            }
        };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { price: isNaN(search) ? undefined : Number(search) }
            ].filter(Boolean);
        }

        const skip = (page - 1) * perPage;
        
        const transactions = await Transaction.find(query)
            .skip(skip)
            .limit(parseInt(perPage));

        const total = await Transaction.countDocuments(query);

        res.json({
            transactions,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / perPage)
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching transactions" });
    }
};







