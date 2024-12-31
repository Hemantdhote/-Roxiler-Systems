document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;
    let barChart = null;
    let pieChart = null;

    const monthSelect = document.getElementById('month');
    const searchInput = document.getElementById('search');
    
    async function fetchData() {
        const month = monthSelect.value;
        const search = searchInput.value;
        
        try {
            const response = await fetch(`/api/combined-data?month=${month}&search=${search}&page=${currentPage}`);
            const data = await response.json();
            updateUI(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function updateUI(data) {
        // Update statistics
        document.getElementById('totalSaleAmount').textContent = `$${data.statistics.totalSaleAmount.toFixed(2)}`;
        document.getElementById('soldItems').textContent = data.statistics.soldItems;
        document.getElementById('notSoldItems').textContent = data.statistics.notSoldItems;

        // Update transactions table
        const tbody = document.getElementById('transactionsBody');
        tbody.innerHTML = data.transactions.transactions.map(t => `
            <tr>
                <td>${t.title}</td>
                <td>${t.description}</td>
                <td>$${t.price}</td>
                <td>${t.category}</td>
                <td>${t.sold ? 'Yes' : 'No'}</td>
                <td>${new Date(t.dateOfSale).toLocaleDateString()}</td>
            </tr>
        `).join('');

        // Update bar chart
        updateBarChart(data.barChart);

        // Update pie chart
        updatePieChart(data.pieChart);

        // Update pagination
        document.getElementById('pageInfo').textContent = `Page ${currentPage}`;
        document.getElementById('prevPage').disabled = currentPage === 1;
        document.getElementById('nextPage').disabled = currentPage >= Math.ceil(data.transactions.total / 10);
    }

    function updateBarChart(data) {
        if (barChart) {
            barChart.destroy();
        }

        const ctx = document.getElementById('barChart').getContext('2d');
        barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.range),
                datasets: [{
                    label: 'Number of Items',
                    data: data.map(d => d.count),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    function updatePieChart(data) {
        if (pieChart) {
            pieChart.destroy();
        }

        const ctx = document.getElementById('pieChart').getContext('2d');
        pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.map(d => d.category),
                datasets: [{
                    data: data.map(d => d.count),
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ]
                }]
            },
            options: {
                responsive: true
            }
        });
    }

    // Event listeners
    monthSelect.addEventListener('change', () => {
        currentPage = 1;
        fetchData();
    });

    searchInput.addEventListener('input', debounce(() => {
        currentPage = 1;
        fetchData();
    }, 300));

    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchData();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        currentPage++;
        fetchData();
    });

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initial load
    fetchData();
});
