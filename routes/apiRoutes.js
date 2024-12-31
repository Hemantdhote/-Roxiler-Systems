const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const statisticsController = require('../controllers/statisticsController');
const barChartController = require('../controllers/barChartController');
const pieChartController = require('../controllers/pieChartController');
const combinedController = require('../controllers/combinedController');

router.get('/seed', transactionController.seedDatabase);
router.get('/transactions', transactionController.getTransactions);
router.get('/statistics', statisticsController.getStatistics);
router.get('/bar-chart', barChartController.getBarChartData);
router.get('/pie-chart', pieChartController.getPieChartData);
router.get('/combined-data', combinedController.getCombinedData);

module.exports = router;