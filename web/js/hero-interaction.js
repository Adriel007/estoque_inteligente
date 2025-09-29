document.addEventListener('DOMContentLoaded', () => {

    // ------------------- Lógica para o Carrossel (mantida) -------------------
    const carouselTrack = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (carouselTrack && prevBtn && nextBtn) {
        const slides = Array.from(carouselTrack.children);
        let slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        window.addEventListener('resize', () => {
            slideWidth = slides[0].getBoundingClientRect().width;
            carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        });
    }

    // ------------------- Nova Lógica para Interatividade da Seção Hero -------------------

    // Seleciona os elementos que serão alterados
    const heroTitle = document.querySelector('.hero-content h1');
    const heroText = document.querySelector('.hero-content p');
    
    // Seleciona todos os pontos interativos
    const iconPoints = document.querySelectorAll('.icon-point');
    
    // Armazena o texto original da seção
    const originalTitle = heroTitle.textContent;
    const originalText = heroText.textContent;

    // Dados para cada ponto (título e descrição)
    const dataPoints = {
        'ponto-1': {
            title: 'Controle de Estoque',
            text: 'Gerencie seus produtos, categorize itens e monitore a entrada e saída de mercadorias em tempo real para evitar perdas.',
        },
        'ponto-2': {
            title: 'Alertas Inteligentes',
            text: 'Receba notificações automatizadas sobre estoque baixo, produtos prestes a vencer e itens fora de linha para agir rapidamente.',
        },
        'ponto-3': {
            title: 'Relatórios Detalhados',
            text: 'Tenha acesso a gráficos e relatórios visuais sobre vendas, tendências de consumo e desempenho de produtos para otimizar suas estratégias.',
        },
        'ponto-4': {
            title: 'Dashboard Interativo',
            text: 'Visualize em tempo real os principais indicadores do seu negócio, como vendas diárias, estoque atual e produtos mais vendidos.',
        },
        'ponto-5': {
            title: 'Integração de Sistemas',
            text: 'Sincronize o Estoque Inteligente com outras plataformas e sistemas para automatizar processos e centralizar sua gestão.',
        },
        'ponto-6': {
            title: 'Segurança de Dados',
            text: 'Seus dados são protegidos com criptografia de ponta e backups regulares, garantindo a integridade e confidencialidade de suas informações.',
        },
        'ponto-7': {
            title: 'Acesso Mobile',
            text: 'Gerencie seu estoque de qualquer lugar, a qualquer momento, com nossa plataforma otimizada para dispositivos móveis.',
        },
        'ponto-8': {
            title: 'Suporte Rápido',
            text: 'Nossa equipe de suporte está sempre pronta para ajudar a resolver qualquer dúvida ou problema, garantindo que sua operação nunca pare.',
        },
    };

    // Adiciona o evento de 'mouseover' a cada ponto
    iconPoints.forEach(point => {
        const tooltip = point.querySelector('.icon-tooltip');
        
        point.addEventListener('mouseover', () => {
            // Obtém o ID do ponto para encontrar os dados correspondentes
            const pointId = point.id;
            const data = dataPoints[pointId];

            if (data) {
                // Altera o conteúdo do título e do texto
                heroTitle.textContent = data.title;
                heroText.textContent = data.text;
                
                // Mostra o tooltip (se a imagem tiver um)
                if (tooltip) {
                    tooltip.style.opacity = '1';
                    tooltip.style.visibility = 'visible';
                }
            }
        });

        // Adiciona o evento de 'mouseout' para voltar ao texto original
        point.addEventListener('mouseout', () => {
            heroTitle.textContent = originalTitle;
            heroText.textContent = originalText;
            
            // Esconde o tooltip
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            }
        });
    });
});