// Farm Produce Tracker - JavaScript Functions

// Sample data storage (in a real app, this would be from a database)
let farmData = {
    crops: JSON.parse(localStorage.getItem('crops')) || [],
    livestock: JSON.parse(localStorage.getItem('livestock')) || [],
    sales: JSON.parse(localStorage.getItem('sales')) || [],
    activities: JSON.parse(localStorage.getItem('activities')) || []
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Dashboard initialization
    if (document.getElementById('totalCrops')) {
        updateDashboard();
    }
    
    // Crops page initialization
    if (document.getElementById('cropsTable')) {
        loadCropsTable();
    }
    
    // Livestock page initialization
    if (document.getElementById('livestockTable')) {
        loadLivestockTable();
    }
    
    // Sales page initialization
    if (document.getElementById('salesTable')) {
        loadSalesTable();
    }
    
    // Forms initialization
    initializeForms();
}

// Form handling
function initializeForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Crop form
    const cropForm = document.getElementById('cropForm');
    if (cropForm) {
        cropForm.addEventListener('submit', handleAddCrop);
    }
    
    // Livestock form
    const livestockForm = document.getElementById('livestockForm');
    if (livestockForm) {
        livestockForm.addEventListener('submit', handleAddLivestock);
    }
    
    // Sales form
    const salesForm = document.getElementById('salesForm');
    if (salesForm) {
        salesForm.addEventListener('submit', handleAddSale);
    }
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation (in real app, this would check against a database)
    if (email && password) {
        alert('Login successful! Redirecting to dashboard...');
        window.location.href = 'dashboard.html';
    } else {
        alert('Please fill in all fields');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    alert('Registration successful! Please login.');
    window.location.href = 'login.html';
}

// Dashboard functions
function updateDashboard() {
    // Update crop count
    document.getElementById('totalCrops').textContent = farmData.crops.length;
    
    // Update livestock count
    const totalLivestock = farmData.livestock.reduce((sum, animal) => sum + parseInt(animal.quantity), 0);
    document.getElementById('totalLivestock').textContent = totalLivestock;
    
    // Update monthly sales
    const currentMonth = new Date().getMonth();
    const monthlySales = farmData.sales
        .filter(sale => new Date(sale.date).getMonth() === currentMonth)
        .reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    document.getElementById('monthlySales').textContent = `N$ ${monthlySales.toFixed(2)}`;
    
    // Update inventory value (simplified calculation)
    const cropValue = farmData.crops.reduce((sum, crop) => sum + (parseFloat(crop.quantity) * 10), 0);
    const livestockValue = farmData.livestock.reduce((sum, animal) => sum + (parseInt(animal.quantity) * 100), 0);
    const totalValue = cropValue + livestockValue;
    document.getElementById('inventoryValue').textContent = `N$ ${totalValue.toFixed(2)}`;
    
    // Update activity table
    loadActivityTable();
}

function loadActivityTable() {
    const table = document.getElementById('activityTable');
    if (!table) return;
    
    table.innerHTML = '';
    
    const recentActivities = farmData.activities.slice(-5).reverse();
    
    recentActivities.forEach(activity => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(activity.date)}</td>
            <td>${activity.type}</td>
            <td>${activity.details}</td>
        `;
        table.appendChild(row);
    });
}

// Crop management functions
function showAddCropForm() {
    document.getElementById('addCropForm').style.display = 'block';
}

function hideAddCropForm() {
    document.getElementById('addCropForm').style.display = 'none';
    document.getElementById('cropForm').reset();
}

function handleAddCrop(e) {
    e.preventDefault();
    
    const cropData = {
        id: Date.now(),
        name: document.getElementById('cropName').value,
        type: document.getElementById('cropType').value,
        plantingDate: document.getElementById('plantingDate').value,
        harvestDate: document.getElementById('harvestDate').value,
        quantity: document.getElementById('quantity').value || 0,
        status: document.getElementById('status').value
    };
    
    farmData.crops.push(cropData);
    saveToLocalStorage('crops', farmData.crops);
    
    // Add activity
    addActivity('crop_added', `Added ${cropData.quantity}kg of ${cropData.name}`);
    
    alert('Crop added successfully!');
    hideAddCropForm();
    loadCropsTable();
    if (document.getElementById('totalCrops')) {
        updateDashboard();
    }
}

function loadCropsTable() {
    const table = document.getElementById('cropsTable');
    if (!table) return;
    
    table.innerHTML = '';
    
    farmData.crops.forEach(crop => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${crop.name}</td>
            <td>${crop.type}</td>
            <td>${formatDate(crop.plantingDate)}</td>
            <td>${crop.harvestDate ? formatDate(crop.harvestDate) : 'Not set'}</td>
            <td>${crop.quantity} kg</td>
            <td><span class="status-badge status-${crop.status}">${crop.status}</span></td>
            <td>
                <button class="btn-small" onclick="editCrop(${crop.id})">Edit</button>
                <button class="btn-small btn-danger" onclick="deleteCrop(${crop.id})">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

function deleteCrop(id) {
    if (confirm('Are you sure you want to delete this crop?')) {
        farmData.crops = farmData.crops.filter(crop => crop.id !== id);
        saveToLocalStorage('crops', farmData.crops);
        loadCropsTable();
        if (document.getElementById('totalCrops')) {
            updateDashboard();
        }
        addActivity('crop_deleted', 'Removed a crop from tracking');
    }
}

// Livestock management functions
function showAddLivestockForm() {
    document.getElementById('addLivestockForm').style.display = 'block';
}

function hideAddLivestockForm() {
    document.getElementById('addLivestockForm').style.display = 'none';
    document.getElementById('livestockForm').reset();
}

function handleAddLivestock(e) {
    e.preventDefault();
    
    const livestockData = {
        id: Date.now(),
        type: document.getElementById('animalType').value,
        breed: document.getElementById('breed').value,
        quantity: document.getElementById('quantity').value,
        acquisitionDate: document.getElementById('acquisitionDate').value,
        healthStatus: document.getElementById('healthStatus').value,
        notes: document.getElementById('notes').value
    };
    
    farmData.livestock.push(livestockData);
    saveToLocalStorage('livestock', farmData.livestock);
    
    addActivity('livestock_added', `Added ${livestockData.quantity} ${livestockData.type}(s)`);
    
    alert('Livestock added successfully!');
    hideAddLivestockForm();
    loadLivestockTable();
    if (document.getElementById('totalLivestock')) {
        updateDashboard();
    }
}

function loadLivestockTable() {
    const table = document.getElementById('livestockTable');
    if (!table) return;
    
    table.innerHTML = '';
    
    farmData.livestock.forEach(animal => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${animal.type}</td>
            <td>${animal.breed}</td>
            <td>${animal.quantity}</td>
            <td>${formatDate(animal.acquisitionDate)}</td>
            <td><span class="status-badge status-${animal.healthStatus}">${animal.healthStatus}</span></td>
            <td>${animal.notes || '-'}</td>
            <td>
                <button class="btn-small" onclick="editLivestock(${animal.id})">Edit</button>
                <button class="btn-small btn-danger" onclick="deleteLivestock(${animal.id})">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

function deleteLivestock(id) {
    if (confirm('Are you sure you want to delete this livestock record?')) {
        farmData.livestock = farmData.livestock.filter(animal => animal.id !== id);
        saveToLocalStorage('livestock', farmData.livestock);
        loadLivestockTable();
        if (document.getElementById('totalLivestock')) {
            updateDashboard();
        }
        addActivity('livestock_deleted', 'Removed livestock from tracking');
    }
}

// Sales management functions
function showAddSaleForm() {
    document.getElementById('addSaleForm').style.display = 'block';
}

function hideAddSaleForm() {
    document.getElementById('addSaleForm').style.display = 'none';
    document.getElementById('salesForm').reset();
}

function handleAddSale(e) {
    e.preventDefault();
    
    const saleData = {
        id: Date.now(),
        itemType: document.getElementById('itemType').value,
        itemName: document.getElementById('itemName').value,
        quantity: document.getElementById('quantity').value,
        price: document.getElementById('price').value,
        amount: parseFloat(document.getElementById('quantity').value) * parseFloat(document.getElementById('price').value),
        buyer: document.getElementById('buyer').value,
        date: document.getElementById('saleDate').value,
        paymentStatus: document.getElementById('paymentStatus').value
    };
    
    farmData.sales.push(saleData);
    saveToLocalStorage('sales', farmData.sales);
    
    addActivity('sale_recorded', `Sold ${saleData.quantity} ${saleData.itemType} for N$ ${saleData.amount}`);
    
    alert('Sale recorded successfully!');
    hideAddSaleForm();
    loadSalesTable();
    if (document.getElementById('monthlySales')) {
        updateDashboard();
    }
}

function loadSalesTable() {
    const table = document.getElementById('salesTable');
    if (!table) return;
    
    table.innerHTML = '';
    
    farmData.sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(sale.date)}</td>
            <td>${sale.itemType}</td>
            <td>${sale.itemName}</td>
            <td>${sale.quantity}</td>
            <td>N$ ${sale.price}</td>
            <td>N$ ${sale.amount.toFixed(2)}</td>
            <td>${sale.buyer}</td>
            <td><span class="status-badge status-${sale.paymentStatus}">${sale.paymentStatus}</span></td>
            <td>
                <button class="btn-small btn-danger" onclick="deleteSale(${sale.id})">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

function deleteSale(id) {
    if (confirm('Are you sure you want to delete this sale record?')) {
        farmData.sales = farmData.sales.filter(sale => sale.id !== id);
        saveToLocalStorage('sales', farmData.sales);
        loadSalesTable();
        if (document.getElementById('monthlySales')) {
            updateDashboard();
        }
        addActivity('sale_deleted', 'Removed a sale record');
    }
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function addActivity(type, details) {
    const activity = {
        date: new Date().toISOString(),
        type: type,
        details: details
    };
    
    farmData.activities.push(activity);
    saveToLocalStorage('activities', farmData.activities);
}

// Add some sample data for demonstration
function addSampleData() {
    if (farmData.crops.length === 0) {
        farmData.crops = [
            {
                id: 1,
                name: 'Maize',
                type: 'grain',
                plantingDate: '2025-01-15',
                harvestDate: '2025-05-20',
                quantity: 500,
                status: 'growing'
            },
            {
                id: 2,
                name: 'Mahangu',
                type: 'grain',
                plantingDate: '2025-02-01',
                harvestDate: '2025-06-15',
                quantity: 300,
                status: 'growing'
            }
        ];
        saveToLocalStorage('crops', farmData.crops);
    }
    
    if (farmData.livestock.length === 0) {
        farmData.livestock = [
            {
                id: 1,
                type: 'Cattle',
                breed: 'Brahman',
                quantity: 25,
                acquisitionDate: '2024-08-10',
                healthStatus: 'healthy',
                notes: 'Main herd'
            },
            {
                id: 2,
                type: 'Goats',
                breed: 'Boer',
                quantity: 50,
                acquisitionDate: '2024-11-05',
                healthStatus: 'healthy',
                notes: 'For meat production'
            }
        ];
        saveToLocalStorage('livestock', farmData.livestock);
    }
    
    if (farmData.sales.length === 0) {
        farmData.sales = [
            {
                id: 1,
                itemType: 'crop',
                itemName: 'Maize',
                quantity: 100,
                price: 8.5,
                amount: 850,
                buyer: 'Local Market',
                date: '2025-03-01',
                paymentStatus: 'paid'
            }
        ];
        saveToLocalStorage('sales', farmData.sales);
    }
    
    if (farmData.activities.length === 0) {
        farmData.activities = [
            {
                date: new Date().toISOString(),
                type: 'system',
                details: 'FarmTracker initialized with sample data'
            }
        ];
        saveToLocalStorage('activities', farmData.activities);
    }
}

// Initialize with sample data on first load
addSampleData();