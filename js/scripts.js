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
    
    alert('Crop updated successfully!');
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
    
    alert('Livestock updated successfully!');
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

// Email Validation for Registration
function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Check if email already exists (in real app, this would check database)
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (existingUsers.some(user => user.email === email)) {
        alert('This email is already registered. Please use a different email or login.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Save user to localStorage (in real app, this would be a database)
    const userData = {
        id: Date.now(),
        fullName: document.getElementById('fullName').value,
        farmName: document.getElementById('farmName').value,
        location: document.getElementById('location').value,
        email: email,
        password: password, // In real app, this should be hashed
        createdAt: new Date().toISOString()
    };
    
    existingUsers.push(userData);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    alert('Registration successful! Please login.');
    window.location.href = 'login.html';
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
    alert('Sales report generated! This would download a PDF in a real application.');
    addActivity('report_generated', 'Generated sales trends report');
}

function generateCropReport() {
    alert('Crop analytics report generated!');
    addActivity('report_generated', 'Generated crop analytics report');
}

function generateLivestockReport() {
    alert('Livestock report generated!');
    addActivity('report_generated', 'Generated livestock health report');
}

function generateFinancialReport() {
    alert('Financial summary generated!');
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

// Update initialization to include reports page
function initializeApp() {
    // ... existing code ...
    
    // Reports page initialization
    if (document.getElementById('totalInventoryValue')) {
        updateReportsPage();
    }
}