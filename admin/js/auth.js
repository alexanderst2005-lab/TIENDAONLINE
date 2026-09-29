document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginBtn = document.getElementById('loginBtn');
  const errorAlert = document.getElementById('loginError');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  // If already logged in, redirect to dashboard
  if (localStorage.getItem('adminToken')) {
    window.location.href = '/admin/';
  }

  // Toggle Password
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePasswordBtn.textContent = type === 'password' ? 'Mostrar' : 'Ocultar';
    });
  }

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = passwordInput.value;

      errorAlert.style.display = 'none';
      loginBtn.textContent = 'Iniciando sesión...';
      loginBtn.disabled = true;

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Credenciales incorrectas');
        }

        // Save token
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        
        // Redirect to dashboard
        window.location.href = '/admin/';
      } catch (err) {
        errorAlert.textContent = err.message;
        errorAlert.style.display = 'block';
      } finally {
        loginBtn.textContent = 'Iniciar Sesión';
        loginBtn.disabled = false;
      }
    });
  }
});
