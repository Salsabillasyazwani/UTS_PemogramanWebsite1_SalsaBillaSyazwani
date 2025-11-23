
const API_URL = 'http://localhost:8080/Tugas_PemogramanWeb/Projek2/flow/';
// FUNGSI REGISTER
function registerUser(event) {
    event.preventDefault();
    
    const name = document.querySelector('input[placeholder="Name"]').value;
    const username = document.querySelector('input[placeholder="Username"]').value;
    const email = document.querySelector('input[placeholder="Email"]').value;
    const password = document.querySelector('input[placeholder="Password"]').value;
    
    // Validasi input
    if (!name || !username || !email || !password) {
        alert('Semua field harus diisi!');
        return;
    }
    
    const formData = new FormData();
    formData.append('action', 'register');
    formData.append('name', name);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    
    fetch(API_URL + 'insup.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            window.location.href = 'login.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat registrasi');
    });
}


// FUNGSI LOGIN
function loginUser(event) {
    event.preventDefault();
    
    const username = document.querySelector('input[placeholder="Username"]').value;
    const password = document.querySelector('input[placeholder="Password"]').value;
    
    // Validasi input
    if (!username || !password) {
        alert('Username dan Password harus diisi!');
        return;
    }
    
    const formData = new FormData();
    formData.append('action', 'login');
    formData.append('username', username);
    formData.append('password', password);
    
    fetch(API_URL + 'insup.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Simpan data user ke localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify(data.data));
            
            alert(data.message);
            window.location.href = 'Utama.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat login');
    });
}

// FUNGSI LOGOUT
function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        window.location.href = 'index.html';
    }
}

// FUNGSI LOAD USER PROFILE
function loadUserProfile() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (!userData) {
        alert('Session expired. Silakan login kembali');
        window.location.href = 'login.html';
        return;
    }
    
    // Tampilkan data di form
    const profileName = document.querySelector('.profile-name');
    if (profileName) {
        profileName.textContent = userData.name;
    }
    
    const inputs = document.querySelectorAll('.form-group-custom input');
    if (inputs.length >= 3) {
        inputs[0].value = userData.name || ''; // Name
        inputs[1].value = userData.username || ''; // Username
        inputs[2].value = userData.email || ''; // Email
    }
}
// FUNGSI UPDATE PROFILE
function updateProfile() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (!userData) {
        alert('Session expired. Silakan login kembali');
        window.location.href = 'login.html';
        return;
    }
    
    const inputs = document.querySelectorAll('.form-group-custom input');
    const name = inputs[0].value;
    const username = inputs[1].value;
    const email = inputs[2].value;
    
    // Validasi
    if (!name || !username || !email) {
        alert('Semua field harus diisi!');
        return;
    }
    
    const formData = new FormData();
    formData.append('action', 'update'); 
    formData.append('id', userData.id);
    formData.append('name', name);
    formData.append('username', username);
    formData.append('email', email);
    
    fetch(API_URL + 'insup.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('userData', JSON.stringify(data.data)); 
            alert(data.message);
            loadUserProfile();
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat update profil');
    });
}
// FUNGSI DELETE ACCOUNT
function deleteAccount() {
    if (!confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan!')) {
        return;
    }
    
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (!userData) {
        alert('Session expired. Silakan login kembali');
        window.location.href = 'login.html';
        return;
    }
    
    const formData = new FormData();
    formData.append('id', userData.id);
    
    fetch(API_URL + 'delete.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userData');
            window.location.href = 'index.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat menghapus akun');
    });
}

// FUNGSI CEK STATUS LOGIN
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Halaman yang memerlukan login
    const protectedPages = ['Utama.html', 'produk.html', 'profil.html'];
    
    if (!isLoggedIn && protectedPages.includes(currentPage)) {
        alert('Silakan login terlebih dahulu');
        window.location.href = 'login.html';
        return;
    }
    
  
    if (isLoggedIn && (currentPage === 'login.html' || currentPage === 'register.html')) {
        window.location.href = 'Utama.html';
        return;
    }
}

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Cek login status (kecuali di index.html)
    if (currentPage !== 'index.html' && currentPage !== '') {
        checkLoginStatus();
    }
    
    // REGISTER PAGE
    if (window.location.pathname.includes('register')) {
        const submitBtn = document.querySelector('.submit');
        if (submitBtn) {
            submitBtn.addEventListener('click', registerUser);
        }
        
        const loginLinkInForm = document.querySelector('.top a');
        if (loginLinkInForm) {
            loginLinkInForm.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'login.html';
            });
        }
        
        const loginBtnNavbar = document.getElementById('loginBtn');
        if (loginBtnNavbar) {
            loginBtnNavbar.addEventListener('click', function() {
                window.location.href = 'login.html';
            });
        }
    }
    
    // LOGIN PAGE
   
    if (window.location.pathname.includes('login')) {
        const submitBtn = document.querySelector('.submit');
        if (submitBtn) {
            submitBtn.addEventListener('click', loginUser);
        }
        
        const signupLinkInForm = document.querySelector('.top a');
        if (signupLinkInForm) {
            signupLinkInForm.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'register.html';
            });
        }
        
        const signupBtnNavbar = document.getElementById('registasi');
        if (signupBtnNavbar) {
            signupBtnNavbar.addEventListener('click', function() {
                window.location.href = 'register.html';
            });
        }
    }
    
    // INDEX PAGE
    if (window.location.pathname.includes('index') || currentPage === '' || currentPage === '/') {
        const loginBtn = document.querySelector('.btn-login');
        const signupBtn = document.querySelector('.btn-signup');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', function() {
                window.location.href = 'login.html';
            });
        }
        
        if (signupBtn) {
            signupBtn.addEventListener('click', function() {
                window.location.href = 'register.html';
            });
        }
    }
    
    
    // PROFILE PAGE
    
    if (window.location.pathname.includes('profil')) {
        loadUserProfile();
        const saveBtn = document.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', updateProfile);
        }
       
        const logoutBtn = document.querySelector('.logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
        
       
        const menuItems = document.querySelectorAll('.side-menu li');
        menuItems.forEach((item) => {
            item.addEventListener('click', function() {
                
                menuItems.forEach(m => m.classList.remove('active'));
                this.classList.add('active');
                const menuText = this.textContent.trim();
                if (menuText === 'Hapus akun') {
                    deleteAccount();
                } else if (menuText === 'Profile') {
                    loadUserProfile();
                }
            });
        });
    }
});