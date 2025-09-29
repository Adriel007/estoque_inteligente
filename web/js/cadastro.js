document.addEventListener('DOMContentLoaded', () => {

    const showCadastroBtn = document.getElementById('show-cadastro');
    const showLoginBtn = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const cadastroForm = document.getElementById('cadastro-form');

    // Funções para alternar entre Login e Cadastro
    if (showCadastroBtn && showLoginBtn && loginForm && cadastroForm) {
        showCadastroBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.remove('active');
            cadastroForm.classList.add('active');
        });

        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cadastroForm.classList.remove('active');
            loginForm.classList.add('active');
        });
    }

    /*
    // --- LÓGICA DO LOGIN ---
    const loginFormElement = loginForm.querySelector('form');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(loginFormElement);
            
            try {
                // CORREÇÃO: Usando ../ para subir um nível e entrar na pasta 'php'
                const response = await fetch('../php/login.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (result.success) {
                    // Login bem-sucedido: redireciona para o dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    // Login falhou: exibe a mensagem de erro
                    alert(result.message);
                }
            } catch (error) {

            }
        });
    } */

    // --- LÓGICA DO CADASTRO ---
    /* const cadastroFormElement = cadastroForm.querySelector('form');
    if (cadastroFormElement) {
        cadastroFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(cadastroFormElement);

            try {
                // CORREÇÃO: Usando ../ para subir um nível e entrar na pasta 'php'
                const response = await fetch('../php/cadastro.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (result.success) {
                    // Cadastro bem-sucedido: exibe a mensagem de sucesso
                    showSuccessMessage('Cadastro realizado com sucesso!', result.key);
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Erro na requisição de cadastro:', error);
                alert('Ocorreu um erro ao tentar se cadastrar. Tente novamente.');
            }
        });
    } */

    // --- LÓGICA DA MENSAGEM DE SUCESSO DO CADASTRO ---
    const successMessage = document.getElementById('success-message');
    const closeBtn = successMessage.querySelector('.close-btn');

    function showSuccessMessage(text, key) {
        const messageText = successMessage.querySelector('.message-text');
        const messageKey = successMessage.querySelector('.message-key');
        
        messageText.textContent = text;
        if (key) {
            messageKey.textContent = `Sua chave de acesso: ${key}`;
            messageKey.style.display = 'block';
        } else {
            messageKey.textContent = '';
            messageKey.style.display = 'none';
        }
        
        successMessage.classList.add('visible');
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            successMessage.classList.remove('visible');
        });
    }
});