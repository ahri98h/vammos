// ===== CONFIG =====
const API_URL = 'http://localhost:3001/api';
let currentUser = null;
let authToken = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Restaurar token do localStorage
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
        authToken = savedToken;
        updateAuthUI();
    }

    // Event listeners
    setupEventListeners();
    initializeDatePicker();
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Navegação
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const section = e.target.dataset.section;
            showSection(section);
        });
    });

    // Autenticação
    document.getElementById('authForm').addEventListener('submit', handleAuth);
    document.querySelectorAll('input[name="authMode"]').forEach(radio => {
        radio.addEventListener('change', toggleAuthFields);
    });

    // Botões
    document.getElementById('btnLogin').addEventListener('click', () => showSection('auth'));
    document.getElementById('btnLogout').addEventListener('click', logout);
    document.getElementById('btnComeceLogo').addEventListener('click', () => {
        if (authToken) {
            showSection('agendar');
        } else {
            showSection('auth');
        }
    });

    // Agendamento
    document.getElementById('bookingForm').addEventListener('submit', handleBooking);
    document.getElementById('duration').addEventListener('change', calculatePrice);
    document.getElementById('hasStaff').addEventListener('change', calculatePrice);
    document.getElementById('hasQuarter').addEventListener('change', calculatePrice);
    document.getElementById('isPostWork').addEventListener('change', calculatePrice);

    // Pagamento
    document.getElementById('paymentForm').addEventListener('submit', handlePayment);
}

// ===== AUTENTICAÇÃO =====
async function handleAuth(e) {
    e.preventDefault();
    const mode = document.querySelector('input[name="authMode"]:checked').value;

    const credentials = {
        email: mode === 'login' ? document.getElementById('email').value : document.getElementById('regEmail').value,
        password: mode === 'login' ? document.getElementById('password').value : document.getElementById('regPassword').value
    };

    if (mode === 'register') {
        credentials.name = document.getElementById('name').value;
        credentials.phone = document.getElementById('phone').value;
        credentials.cpf_cnpj = document.getElementById('cpf_cnpj').value;
        credentials.address = document.getElementById('address').value;
        credentials.city = document.getElementById('city').value;
        credentials.state = document.getElementById('state').value;
        credentials.zip_code = document.getElementById('zip_code').value;
    }

    try {
        const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            const error = await response.json();
            showAlert(error.message || 'Erro na autenticação', 'error');
            return;
        }

        const data = await response.json();
        authToken = data.token;
        localStorage.setItem('authToken', authToken);
        
        updateAuthUI();
        showAlert(`${mode === 'login' ? 'Login' : 'Conta criada'} com sucesso!`, 'success');
        showSection('home');
    } catch (error) {
        showAlert('Erro ao conectar com servidor', 'error');
        console.error(error);
    }
}

function toggleAuthFields() {
    const mode = document.querySelector('input[name="authMode"]:checked').value;
    document.getElementById('loginFields').style.display = mode === 'login' ? 'flex' : 'none';
    document.getElementById('registerFields').style.display = mode === 'register' ? 'flex' : 'none';
}

function updateAuthUI() {
    if (authToken) {
        document.getElementById('btnLogin').style.display = 'none';
        document.getElementById('btnLogout').style.display = 'block';
        
        // Mostrar opções de usuário
        document.getElementById('nav-agendar').style.display = 'block';
        document.getElementById('nav-meus').style.display = 'block';
        document.getElementById('nav-fid').style.display = 'block';
    } else {
        document.getElementById('btnLogin').style.display = 'block';
        document.getElementById('btnLogout').style.display = 'none';
        
        // Esconder opções de usuário
        document.getElementById('nav-agendar').style.display = 'none';
        document.getElementById('nav-meus').style.display = 'none';
        document.getElementById('nav-fid').style.display = 'none';
    }
}

function logout() {
    authToken = null;
    localStorage.removeItem('authToken');
    updateAuthUI();
    showSection('home');
    showAlert('Você saiu da conta', 'info');
}

// ===== AGENDAMENTO =====
function calculatePrice() {
    const basePrices = { 1: 40, 2: 60, 3: 80, 4: 100, 5: 120 };
    const duration = parseInt(document.getElementById('duration').value) || 1;
    let basePrice = basePrices[duration] || 40;

    let totalPrice = basePrice;
    let quarterFee = 0;
    let staffFee = 0;
    let postWorkAdjustment = 0;

    // Quarter do trabalho (+25%)
    if (document.getElementById('hasQuarter').checked) {
        quarterFee = basePrice * 0.25;
        totalPrice += quarterFee;
        document.getElementById('quarterItem').style.display = 'flex';
        document.getElementById('quarterFee').textContent = `R$ ${quarterFee.toFixed(2)}`;
    } else {
        document.getElementById('quarterItem').style.display = 'none';
    }

    // Taxa funcionária (+40%)
    if (document.getElementById('hasStaff').checked) {
        staffFee = totalPrice * 0.40;
        totalPrice += staffFee;
        document.getElementById('staffFeeItem').style.display = 'flex';
        document.getElementById('staffFee').textContent = `R$ ${staffFee.toFixed(2)}`;
    } else {
        document.getElementById('staffFeeItem').style.display = 'none';
    }

    // Pós-obra (×1.5)
    if (document.getElementById('isPostWork').checked) {
        postWorkAdjustment = totalPrice * 0.50;
        totalPrice += postWorkAdjustment;
        document.getElementById('postWorkItem').style.display = 'flex';
        document.getElementById('postWorkFee').textContent = `R$ ${postWorkAdjustment.toFixed(2)}`;
    } else {
        document.getElementById('postWorkItem').style.display = 'none';
    }

    // Atualizar display
    document.getElementById('priceBase').textContent = `R$ ${basePrice.toFixed(2)}`;
    document.getElementById('totalPrice').textContent = `R$ ${totalPrice.toFixed(2)}`;
    document.getElementById('paymentAmount').value = `R$ ${totalPrice.toFixed(2)}`;
}

async function handleBooking(e) {
    e.preventDefault();

    if (!authToken) {
        showAlert('Faça login para agendar', 'error');
        showSection('auth');
        return;
    }

    const bookingData = {
        serviceId: parseInt(document.getElementById('service').value),
        date: document.getElementById('bookingDate').value,
        time: document.getElementById('bookingTime').value,
        durationHours: parseInt(document.getElementById('duration').value),
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        hasStaff: document.getElementById('hasStaff').checked,
        hasExtraQuarter: document.getElementById('hasQuarter').checked,
        isPostWork: document.getElementById('isPostWork').checked,
        notes: document.getElementById('notes').value
    };

    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
            const error = await response.json();
            showAlert(error.message || 'Erro ao criar agendamento', 'error');
            return;
        }

        const data = await response.json();
        showAlert('Agendamento criado! Prosseguindo para pagamento...', 'success');
        
        // Abrir modal de pagamento
        document.getElementById('paymentModal').classList.add('show');
    } catch (error) {
        showAlert('Erro ao conectar com servidor', 'error');
        console.error(error);
    }
}

// ===== PAGAMENTO =====
async function handlePayment(e) {
    e.preventDefault();

    const paymentData = {
        cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
        cardExpiry: document.getElementById('cardExpiry').value,
        cardCVV: document.getElementById('cardCVV').value,
        cardName: document.getElementById('cardName').value
    };

    try {
        const response = await fetch(`${API_URL}/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(paymentData)
        });

        if (!response.ok) {
            const error = await response.json();
            showAlert(error.message || 'Erro no pagamento', 'error');
            return;
        }

        showAlert('Pagamento realizado com sucesso!', 'success');
        closePaymentModal();
        document.getElementById('bookingForm').reset();
        calculatePrice();
        
        // Carregar agendamentos
        setTimeout(() => {
            loadUserBookings();
            showSection('meus-agendamentos');
        }, 1000);
    } catch (error) {
        showAlert('Erro ao processar pagamento', 'error');
        console.error(error);
    }
}

// ===== AGENDAMENTOS DO USUÁRIO =====
async function loadUserBookings() {
    if (!authToken) return;

    try {
        const response = await fetch(`${API_URL}/bookings/user`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) {
            showAlert('Erro ao carregar agendamentos', 'error');
            return;
        }

        const bookings = await response.json();
        const container = document.getElementById('bookingsList');
        
        if (!bookings.length) {
            container.innerHTML = '<p>Você ainda não tem agendamentos. <a href="#" onclick="showSection(\'agendar\')">Clique aqui</a> para agendar.</p>';
            return;
        }

        container.innerHTML = bookings.map(booking => `
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <h3>Agendamento #${booking.id}</h3>
                        <p><strong>Serviço:</strong> ${booking.service_name}</p>
                        <p><strong>Data:</strong> ${formatDate(booking.date)} às ${booking.time}</p>
                        <p><strong>Local:</strong> ${booking.address}</p>
                        <p><strong>Preço:</strong> R$ ${parseFloat(booking.final_price).toFixed(2)}</p>
                    </div>
                    <span class="status-badge status-${booking.status.toLowerCase()}">
                        ${formatStatus(booking.status)}
                    </span>
                </div>
                ${booking.status === 'completed' && !booking.rating ? `
                    <button class="btn-primary" style="margin-top: 10px;" onclick="rateBooking(${booking.id})">
                        Avaliar Serviço ⭐
                    </button>
                ` : ''}
            </div>
        `).join('');
    } catch (error) {
        showAlert('Erro ao carregar agendamentos', 'error');
        console.error(error);
    }
}

// ===== FIDELIDADE =====
async function loadLoyaltyInfo() {
    if (!authToken) return;

    try {
        const response = await fetch(`${API_URL}/loyalty`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) return;

        const loyalty = await response.json();
        const container = document.getElementById('loyaltyInfo');

        const progressPercent = (loyalty.five_star_streak / 10) * 100;

        container.innerHTML = `
            <div class="loyalty-badge">
                🎁 ${loyalty.five_star_streak}/10 Avaliações 5⭐
            </div>
            
            <div style="background: #f0f0f0; border-radius: 10px; padding: 20px;">
                <p style="margin-bottom: 10px;">Progresso para bônus de R$ 100:</p>
                <div style="background: white; border-radius: 5px; height: 30px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${progressPercent}%; transition: width 0.3s;"></div>
                </div>
                <p style="margin-top: 10px; color: #666; font-size: 14px;">
                    ${loyalty.five_star_streak < 10 ? `Faltam ${10 - loyalty.five_star_streak} avaliações para ganhar R$ 100!` : '🎉 Você ganhou R$ 100!'}
                </p>
            </div>

            ${loyalty.loyalty_bonus > 0 ? `
                <div class="card" style="background: #fff3cd; border-left-color: #ffc107; margin-top: 20px;">
                    <h3>💰 Bônus Disponível: R$ ${loyalty.loyalty_bonus.toFixed(2)}</h3>
                    <p>Este desconto será aplicado automaticamente no seu próximo agendamento!</p>
                </div>
            ` : ''}

            <h3 style="color: #667eea; margin-top: 30px; margin-bottom: 15px;">Como Funciona?</h3>
            <div class="card">
                <p>✅ Cada serviço bem avaliado com 5⭐ adiciona 1 ponto ao seu streak</p>
            </div>
            <div class="card">
                <p>🎁 Ao atingir 10 avaliações 5⭐ seguidas, você ganha R$ 100 de bônus!</p>
            </div>
            <div class="card">
                <p>💳 O bônus é aplicado automaticamente no seu próximo agendamento</p>
            </div>
            <div class="card">
                <p>🔄 Após usar o bônus, seu streak reseta e você pode ganhar outro!</p>
            </div>
        `;
    } catch (error) {
        console.error(error);
    }
}

// ===== UTILITÁRIOS =====
function showSection(sectionId) {
    // Esconder todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Mostrar seção selecionada
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }

    // Atualizar nav
    document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');

    // Carregar dados se necessário
    if (sectionId === 'meus-agendamentos' && authToken) {
        loadUserBookings();
    } else if (sectionId === 'fidelidade' && authToken) {
        loadLoyaltyInfo();
    }
}

function showAlert(message, type = 'info') {
    const alertBox = document.getElementById('alertBox');
    alertBox.className = `alert ${type}`;
    alertBox.textContent = message;

    setTimeout(() => {
        alertBox.className = 'alert';
    }, 4000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function formatStatus(status) {
    const statuses = {
        'pending': '⏳ Pendente',
        'confirmed': '✅ Confirmado',
        'completed': '✔️ Concluído',
        'cancelled': '❌ Cancelado'
    };
    return statuses[status.toLowerCase()] || status;
}

function initializeDatePicker() {
    const dateInput = document.getElementById('bookingDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('show');
}

async function rateBooking(bookingId) {
    const rating = prompt('Digite sua avaliação (1-5 estrelas):', '5');
    if (!rating) return;

    const review = prompt('Deixe um comentário (opcional):');

    try {
        const response = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                bookingId,
                rating: parseInt(rating),
                review: review || ''
            })
        });

        if (!response.ok) {
            showAlert('Erro ao avaliar', 'error');
            return;
        }

        showAlert('Avaliação enviada com sucesso! ⭐', 'success');
        loadUserBookings();
    } catch (error) {
        showAlert('Erro ao enviar avaliação', 'error');
        console.error(error);
    }
}

// Iniciar interface
updateAuthUI();
