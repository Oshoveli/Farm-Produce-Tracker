// Farm Produce Tracker - JavaScript Functions

// Sample data storage
let farmData = {
    crops: JSON.parse(localStorage.getItem('crops')) || [],
    livestock: JSON.parse(localStorage.getItem('livestock')) || [],
    sales: JSON.parse(localStorage.getItem('sales')) || [],
    activities: JSON.parse(localStorage.getItem('activities')) || [],
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is logged in and redirect if needed
    checkAuthentication();
    
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
        updateSalesSummary();
    }
    
    // Reports page initialization
    if (document.getElementById('totalInventoryValue')) {
        updateReportsPage();
    }
    
    // Forms initialization
    initializeForms();
}

// Authentication functions
function checkAuthentication() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const protectedPages = ['dashboard.html', 'crops.html', 'livestock.html', 'sales.html', 'reports.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    if ((currentPage === 'login.html' || currentPage === 'register.html') && currentUser) {
        window.location.href = 'dashboard.html';
        return;
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validate fields
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showError('No account found with this email. Please register first.');
        return;
    }
    
    if (user.password !== password) {
        showError('Incorrect password. Please try again.');
        return;
    }
    
    // Login successful
    localStorage.setItem('currentUser', JSON.stringify(user));
    showSuccess('Login successful! Redirecting to dashboard...');
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

function handleRegister(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const farmName = document.getElementById('farmName').value;
    const location = document.getElementById('location').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate all fields are filled
    if (!fullName || !farmName || !location || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.email === email)) {
        showError('This email is already registered. Please use a different email or login.');
        return;
    }
    
    // Check password match
    if (password !== confirmPassword) {
        showError('Passwords do not match!');
        return;
    }
    
    // Check password strength
    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }
    
    // Save user to localStorage
    const userData = {
        id: Date.now(),
        fullName: fullName,
        farmName: farmName,
        location: location,
        email: email,
        password: password, // In real app, this should be hashed
        createdAt: new Date().toISOString()
    };
    
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    
    showSuccess('Registration successful! Redirecting to login...');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    // Remove any existing messages
    const existingError = document.querySelector('.error-message');
    const existingSuccess = document.querySelector('.success-message');
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 12px;
        border-radius: 4px;
        margin: 15px 0;
        border: 1px solid #f5c6cb;
    `;
    
    // Insert after the form title or at the top of the form
    const form = document.querySelector('form');
    form.parentNode.insertBefore(errorDiv, form);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

function showSuccess(message) {
    // Remove any existing messages
    const existingError = document.querySelector('.error-message');
    const existingSuccess = document.querySelector('.success-message');
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();
    
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        background: #d4edda;
        color: #155724;
        padding: 12px;
        border-radius: 4px;
        margin: 15px 0;
        border: 1px solid #c3e6cb;
    `;
    
    // Insert after the form title or at the top of the form
    const form = document.querySelector('form');
    form.parentNode.insertBefore(successDiv, form);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 5000);
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
    
    const cropName = document.getElementById('cropName').value;
    const cropType = document.getElementById('cropType').value;
    const plantingDate = document.getElementById('plantingDate').value;
    
    if (!cropName || !cropType || !plantingDate) {
        showError('Please fill in all required fields');
        return;
    }
    
    const cropData = {
        id: Date.now(),
        name: cropName,
        type: cropType,
        plantingDate: plantingDate,
        harvestDate: document.getElementById('harvestDate').value,
        quantity: document.getElementById('quantity').value || 0,
        status: document.getElementById('status').value
    };
    
    farmData.crops.push(cropData);
    saveToLocalStorage('crops', farmData.crops);
    
    // Add activity
    addActivity('crop_added', `Added ${cropData.quantity}kg of ${cropData.name}`);
    
    showSuccess('Crop added successfully!');
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
        showSuccess('Crop deleted successfully!');
    }
}

// Edit Crop Functionality
function editCrop(id) {
    const crop = farmData.crops.find(c => c.id === id);
    if (!crop) return;

    // Remove any existing edit form
    const existingEditForm = document.getElementById('editCropForm');
    if (existingEditForm) {
        existingEditForm.remove();
    }

    // Create edit form
    const editForm = document.createElement('div');
    editForm.id = 'editCropForm';
    editForm.className = 'edit-form';
    editForm.innerHTML = `
        <h4>Edit Crop: ${crop.name}</h4>
        <form onsubmit="handleEditCrop(event, ${crop.id})">
            <div class="form-group">
                <label for="editCropName">Crop Name</label>
                <input type="text" id="editCropName" value="${crop.name}" required>
            </div>
            <div class="form-group">
                <label for="editCropType">Crop Type</label>
                <select id="editCropType" required>
                    <option value="grain" ${crop.type === 'grain' ? 'selected' : ''}>Grain</option>
                    <option value="vegetable" ${crop.type === 'vegetable' ? 'selected' : ''}>Vegetable</option>
                    <option value="fruit" ${crop.type === 'fruit' ? 'selected' : ''}>Fruit</option>
                    <option value="legume" ${crop.type === 'legume' ? 'selected' : ''}>Legume</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editPlantingDate">Planting Date</label>
                <input type="date" id="editPlantingDate" value="${crop.plantingDate}" required>
            </div>
            <div class="form-group">
                <label for="editHarvestDate">Expected Harvest Date</label>
                <input type="date" id="editHarvestDate" value="${crop.harvestDate || ''}">
            </div>
            <div class="form-group">
                <label for="editQuantity">Quantity (kg/hectare)</label>
                <input type="number" id="editQuantity" value="${crop.quantity}" step="0.1">
            </div>
            <div class="form-group">
                <label for="editStatus">Status</label>
                <select id="editStatus" required>
                    <option value="planted" ${crop.status === 'planted' ? 'selected' : ''}>Planted</option>
                    <option value="growing" ${crop.status === 'growing' ? 'selected' : ''}>Growing</option>
                    <option value="ready" ${crop.status === 'ready' ? 'selected' : ''}>Ready for Harvest</option>
                    <option value="harvested" ${crop.status === 'harvested' ? 'selected' : ''}>Harvested</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Update Crop</button>
                <button type="button" class="btn btn-secondary" onclick="cancelEditCrop()">Cancel</button>
            </div>
        </form>
    `;

    document.getElementById('editCropContainer').appendChild(editForm);
    document.getElementById('editCropContainer').scrollIntoView({ behavior: 'smooth' });
}

function handleEditCrop(e, id) {
    e.preventDefault();
    
    const cropIndex = farmData.crops.findIndex(c => c.id === id);
    if (cropIndex === -1) return;

    farmData.crops[cropIndex] = {
        ...farmData.crops[cropIndex],
        name: document.getElementById('editCropName').value,
        type: document.getElementById('editCropType').value,
        plantingDate: document.getElementById('editPlantingDate').value,
        harvestDate: document.getElementById('editHarvestDate').value,
        quantity: document.getElementById('editQuantity').value,
        status: document.getElementById('editStatus').value
    };

    saveToLocalStorage('crops', farmData.crops);
    addActivity('crop_updated', `Updated ${farmData.crops[cropIndex].name} details`);
    
    showSuccess('Crop updated successfully!');
    cancelEditCrop();
    loadCropsTable();
    if (document.getElementById('totalCrops')) {
        updateDashboard();
    }
}

function cancelEditCrop() {
    const editForm = document.getElementById('editCropForm');
    if (editForm) {
        editForm.remove();
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
    
    const animalType = document.getElementById('animalType').value;
    const quantity = document.getElementById('quantity').value;
    const acquisitionDate = document.getElementById('acquisitionDate').value;
    
    if (!animalType || !quantity || !acquisitionDate) {
        showError('Please fill in all required fields');
        return;
    }
    
    const livestockData = {
        id: Date.now(),
        type: animalType,
        breed: document.getElementById('breed').value,
        quantity: quantity,
        acquisitionDate: acquisitionDate,
        healthStatus: document.getElementById('healthStatus').value,
        notes: document.getElementById('notes').value
    };
    
    farmData.livestock.push(livestockData);
    saveToLocalStorage('livestock', farmData.livestock);
    
    addActivity('livestock_added', `Added ${livestockData.quantity} ${livestockData.type}(s)`);
    
    showSuccess('Livestock added successfully!');
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
        showSuccess('Livestock record deleted successfully!');
    }
}

// Edit Livestock Functionality
function editLivestock(id) {
    const animal = farmData.livestock.find(a => a.id === id);
    if (!animal) return;

    const existingEditForm = document.getElementById('editLivestockForm');
    if (existingEditForm) {
        existingEditForm.remove();
    }

    const editForm = document.createElement('div');
    editForm.id = 'editLivestockForm';
    editForm.className = 'edit-form';
    editForm.innerHTML = `
        <h4>Edit Livestock: ${animal.type}</h4>
        <form onsubmit="handleEditLivestock(event, ${animal.id})">
            <div class="form-group">
                <label for="editAnimalType">Animal Type</label>
                <select id="editAnimalType" required>
                    <option value="Cattle" ${animal.type === 'Cattle' ? 'selected' : ''}>Cattle</option>
                    <option value="Goats" ${animal.type === 'Goats' ? 'selected' : ''}>Goats</option>
                    <option value="Sheep" ${animal.type === 'Sheep' ? 'selected' : ''}>Sheep</option>
                    <option value="Chickens" ${animal.type === 'Chickens' ? 'selected' : ''}>Chickens</option>
                    <option value="Pigs" ${animal.type === 'Pigs' ? 'selected' : ''}>Pigs</option>
                    <option value="Other" ${animal.type === 'Other' ? 'selected' : ''}>Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editBreed">Breed</label>
                <input type="text" id="editBreed" value="${animal.breed || ''}">
            </div>
            <div class="form-group">
                <label for="editQuantity">Quantity</label>
                <input type="number" id="editQuantity" value="${animal.quantity}" required>
            </div>
            <div class="form-group">
                <label for="editAcquisitionDate">Acquisition Date</label>
                <input type="date" id="editAcquisitionDate" value="${animal.acquisitionDate}" required>
            </div>
            <div class="form-group">
                <label for="editHealthStatus">Health Status</label>
                <select id="editHealthStatus" required>
                    <option value="healthy" ${animal.healthStatus === 'healthy' ? 'selected' : ''}>Healthy</option>
                    <option value="vaccinated" ${animal.healthStatus === 'vaccinated' ? 'selected' : ''}>Vaccinated</option>
                    <option value="sick" ${animal.healthStatus === 'sick' ? 'selected' : ''}>Sick</option>
                    <option value="quarantined" ${animal.healthStatus === 'quarantined' ? 'selected' : ''}>Quarantined</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editNotes">Notes</label>
                <textarea id="editNotes" rows="3">${animal.notes || ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Update Livestock</button>
                <button type="button" class="btn btn-secondary" onclick="cancelEditLivestock()">Cancel</button>
            </div>
        </form>
    `;

    document.getElementById('editLivestockContainer').appendChild(editForm);
    document.getElementById('editLivestockContainer').scrollIntoView({ behavior: 'smooth' });
}

function handleEditLivestock(e, id) {
    e.preventDefault();
    
    const animalIndex = farmData.livestock.findIndex(a => a.id === id);
    if (animalIndex === -1) return;

    farmData.livestock[animalIndex] = {
        ...farmData.livestock[animalIndex],
        type: document.getElementById('editAnimalType').value,
        breed: document.getElementById('editBreed').value,
        quantity: document.getElementById('editQuantity').value,
        acquisitionDate: document.getElementById('editAcquisitionDate').value,
        healthStatus: document.getElementById('editHealthStatus').value,
        notes: document.getElementById('editNotes').value
    };

    saveToLocalStorage('livestock', farmData.livestock);
    addActivity('livestock_updated', `Updated ${farmData.livestock[animalIndex].type} details`);
    
    showSuccess('Livestock updated successfully!');
    cancelEditLivestock();
    loadLivestockTable();
    if (document.getElementById('totalLivestock')) {
        updateDashboard();
    }
}

function cancelEditLivestock() {
    const editForm = document.getElementById('editLivestockForm');
    if (editForm) {
        editForm.remove();
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
    
    const itemType = document.getElementById('itemType').value;
    const itemName = document.getElementById('itemName').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const buyer = document.getElementById('buyer').value;
    const saleDate = document.getElementById('saleDate').value;
    
    if (!itemType || !itemName || !quantity || !price || !buyer || !saleDate) {
        showError('Please fill in all required fields');
        return;
    }
    
    const saleData = {
        id: Date.now(),
        itemType: itemType,
        itemName: itemName,
        quantity: quantity,
        price: price,
        amount: parseFloat(quantity) * parseFloat(price),
        buyer: buyer,
        date: saleDate,
        paymentStatus: document.getElementById('paymentStatus').value
    };
    
    farmData.sales.push(saleData);
    saveToLocalStorage('sales', farmData.sales);
    
    addActivity('sale_recorded', `Sold ${saleData.quantity} ${saleData.itemType} for N$ ${saleData.amount}`);
    
    showSuccess('Sale recorded successfully!');
    hideAddSaleForm();
    loadSalesTable();
    updateSalesSummary();
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
        updateSalesSummary();
        if (document.getElementById('monthlySales')) {
            updateDashboard();
        }
        addActivity('sale_deleted', 'Removed a sale record');
        showSuccess('Sale record deleted successfully!');
    }
}

function updateSalesSummary() {
    if (!document.getElementById('totalSales')) return;
    
    const totalSales = farmData.sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    const currentMonth = new Date().getMonth();
    const monthlySales = farmData.sales
        .filter(sale => new Date(sale.date).getMonth() === currentMonth)
        .reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    const pendingSales = farmData.sales
        .filter(sale => sale.paymentStatus === 'pending')
        .reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    
    // Find top buyer
    const buyerCounts = {};
    farmData.sales.forEach(sale => {
        buyerCounts[sale.buyer] = (buyerCounts[sale.buyer] || 0) + 1;
    });
    const topBuyer = Object.keys(buyerCounts).reduce((a, b) => buyerCounts[a] > buyerCounts[b] ? a : b, 'None');
    
    document.getElementById('totalSales').textContent = `N$ ${totalSales.toFixed(2)}`;
    document.getElementById('monthlySales').textContent = `N$ ${monthlySales.toFixed(2)}`;
    document.getElementById('pendingSales').textContent = `N$ ${pendingSales.toFixed(2)}`;
    document.getElementById('topBuyer').textContent = topBuyer;
}

// Update Item Names for Sales Form
function updateItemNames() {
    const itemType = document.getElementById('itemType').value;
    const itemNameSelect = document.getElementById('itemName');
    
    itemNameSelect.innerHTML = '<option value="">Select item</option>';
    
    if (itemType === 'crop') {
        farmData.crops.forEach(crop => {
            const option = document.createElement('option');
            option.value = crop.name;
            option.textContent = crop.name;
            itemNameSelect.appendChild(option);
        });
    } else if (itemType === 'livestock') {
        farmData.livestock.forEach(animal => {
            const option = document.createElement('option');
            option.value = animal.type;
            option.textContent = animal.type;
            itemNameSelect.appendChild(option);
        });
    }
}

// Reports Page Functions
function generateSalesReport() {
    showSuccess('Sales report generated! This would download a PDF in a real application.');
    addActivity('report_generated', 'Generated sales trends report');
}

function generateCropReport() {
    showSuccess('Crop analytics report generated!');
    addActivity('report_generated', 'Generated crop analytics report');
}

function generateLivestockReport() {
    showSuccess('Livestock report generated!');
    addActivity('report_generated', 'Generated livestock health report');
}

function generateFinancialReport() {
    showSuccess('Financial summary generated!');
    addActivity('report_generated', 'Generated financial summary report');
}

// Update reports page statistics
function updateReportsPage() {
    if (!document.getElementById('totalInventoryValue')) return;
    
    // Inventory value
    const cropValue = farmData.crops.reduce((sum, crop) => sum + (parseFloat(crop.quantity) * 10), 0);
    const livestockValue = farmData.livestock.reduce((sum, animal) => sum + (parseInt(animal.quantity) * 100), 0);
    document.getElementById('totalInventoryValue').textContent = `N$ ${(cropValue + livestockValue).toFixed(2)}`;
    
    // Monthly revenue
    const currentMonth = new Date().getMonth();
    const monthlyRevenue = farmData.sales
        .filter(sale => new Date(sale.date).getMonth() === currentMonth)
        .reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    document.getElementById('monthlyRevenue').textContent = `N$ ${monthlyRevenue.toFixed(2)}`;
    
    // Active crops and animals
    document.getElementById('activeCropsCount').textContent = farmData.crops.length;
    document.getElementById('totalAnimalsCount').textContent = farmData.livestock.reduce((sum, animal) => sum + parseInt(animal.quantity), 0);
    
    // Update stats table
    updateStatsTable();
}

function updateStatsTable() {
    const statsTable = document.getElementById('statsTable');
    if (!statsTable) return;
    
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentYear = new Date().getFullYear();
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const currentMonthSales = farmData.sales
        .filter(sale => new Date(sale.date).getMonth() === currentMonth && new Date(sale.date).getFullYear() === currentYear)
        .reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    
    const lastMonthSales = farmData.sales
        .filter(sale => new Date(sale.date).getMonth() === lastMonth && new Date(sale.date).getFullYear() === lastMonthYear)
        .reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    
    const salesChange = lastMonthSales === 0 ? 100 : ((currentMonthSales - lastMonthSales) / lastMonthSales * 100);
    
    statsTable.innerHTML = `
        <tr>
            <td>Total Sales</td>
            <td>N$ ${currentMonthSales.toFixed(2)}</td>
            <td>N$ ${lastMonthSales.toFixed(2)}</td>
            <td style="color: ${salesChange >= 0 ? '#2d8a5f' : '#dc3545'}">${salesChange >= 0 ? '+' : ''}${salesChange.toFixed(1)}%</td>
        </tr>
        <tr>
            <td>New Crops</td>
            <td>${farmData.crops.filter(crop => new Date(crop.plantingDate).getMonth() === currentMonth).length}</td>
            <td>${farmData.crops.filter(crop => new Date(crop.plantingDate).getMonth() === lastMonth).length}</td>
            <td>-</td>
        </tr>
        <tr>
            <td>Livestock Added</td>
            <td>${farmData.livestock.filter(animal => new Date(animal.acquisitionDate).getMonth() === currentMonth).length}</td>
            <td>${farmData.livestock.filter(animal => new Date(animal.acquisitionDate).getMonth() === lastMonth).length}</td>
            <td>-</td>
        </tr>
    `;
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