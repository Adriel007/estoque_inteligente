document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Gestão da navegação ativa --- */
    /* --- 4. Navbar fixa com sombra ao rolar --- */
const navbar = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        const currentPath = window.location.pathname.split('/').pop();
        const linkPath = link.getAttribute('href');

        if (linkPath === currentPath) {
            link.classList.add('active');
        } else if (currentPath === '' && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });

    /* --- 2. Interatividade do formulário de Login/Cadastro --- */
    const showLoginLink = document.getElementById('show-login');
    const showCadastroLink = document.getElementById('show-cadastro');
    const loginForm = document.getElementById('login-form');
    const cadastroForm = document.getElementById('cadastro-form');
    
    if (showLoginLink && showCadastroLink && loginForm && cadastroForm) {
        showLoginLink.addEventListener('click', (event) => {
            event.preventDefault();
            loginForm.classList.add('active');
            cadastroForm.classList.remove('active');
        });

        showCadastroLink.addEventListener('click', (event) => {
            event.preventDefault();
            cadastroForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }

    /* --- 3. Funcionalidade do Carrossel (Seção de Formulário) --- */
    const carouselContainer = document.querySelector('.form-carousel-container');

    // Verifica se o container do carrossel existe na página
    if (carouselContainer) {
        const slides = Array.from(carouselContainer.querySelectorAll('.carousel-slide'));
        const nextButton = carouselContainer.querySelector('.carousel-button.next');
        const prevButton = carouselContainer.querySelector('.carousel-button.prev');
        let slideIndex = 0;

        // Adiciona a classe 'active' ao primeiro slide ao carregar a página
        if (slides.length > 0) {
            slides[slideIndex].classList.add('active');
        }

        const updateCarousel = (direction) => {
            // Remove a classe 'active' do slide atual
            slides[slideIndex].classList.remove('active');

            // Atualiza o índice do slide
            if (direction === 'next') {
                slideIndex = (slideIndex + 1) % slides.length;
            } else {
                slideIndex = (slideIndex - 1 + slides.length) % slides.length;
            }

            // Adiciona a classe 'active' ao próximo slide
            slides[slideIndex].classList.add('active');
        };
        
        // Verifica se os botões de navegação existem
        if (nextButton && prevButton) {
            nextButton.addEventListener('click', () => {
                updateCarousel('next');
            });

            prevButton.addEventListener('click', () => {
                updateCarousel('prev');
            });
        }
        
        // Verifica se há mais de um slide para iniciar o avanço automático
        if (slides.length > 1) {
            setInterval(() => {
                updateCarousel('next');
            }, 5000);
        }
    }
    document.querySelectorAll('.hotspot').forEach(hotspot => {
  hotspot.addEventListener('mouseenter', function(e) {
    const tooltip = document.getElementById('tooltip');
    tooltip.innerText = this.dataset.text;
    tooltip.style.top = this.offsetTop + "px";
    tooltip.style.left = this.offsetLeft + "px";
    tooltip.style.display = 'block';
  });

  hotspot.addEventListener('mouseleave', function() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
  });
});

});