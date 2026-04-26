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

let swiper3 = null;
let currentDevice = null;
let touchStartTime = 0; // Para double-touch

function getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1080) return 'tablet';
    return 'desktop';
}

function destroySwiper() {
    if (swiper3) {
        swiper3.destroy(true, true);
        swiper3 = null;
    }
}

function removeAllListeners() {
    const swiperWrapper = document.querySelector('.mySwiper3 .swiper-wrapper');
    if (swiperWrapper) {
        swiperWrapper.replaceWith(swiperWrapper.cloneNode(true));
    }
}

// NOVA: Função para Mostrar Detalhes Dinâmicos
function showDetalhes(servicoId) {
    const card = document.querySelector(`[data-service="${servicoId}"]`);
    if (!card) return;

    const imgSrc = card.querySelector('img').src;
    const titulo = card.querySelector('h3').textContent;
    const descricao = card.querySelector('.card-description').textContent;
    const whatsappUrl = card.dataset.whatsapp;

    document.getElementById('img-detalhe').src = imgSrc;
    document.getElementById('titulo-detalhe').textContent = titulo;
    document.getElementById('desc-detalhe').textContent = descricao;
    document.getElementById('btn-whatsapp').href = whatsappUrl;

    document.getElementById('conteudo-detalhes').classList.remove('hidden');
    document.getElementById('detalhes').classList.add('visible'); // Trigger animações

    // Scroll suave para seção detalhes
    document.getElementById('detalhes').scrollIntoView({ behavior: 'smooth' });
}

// Setup Listeners Mobile (Aprimorado com Double-Touch)
function setupMobileListeners(swiperWrapper) {
    swiperWrapper.addEventListener('touchstart', (e) => {
        const now = new Date().getTime();
        const card = e.target.closest('.service-card-modern');
        if (!card) return;

        if (now - touchStartTime < 300) {
            // Double-Touch: Scroll para Detalhes
            const servicoId = card.dataset.service;
            showDetalhes(servicoId);
        } else {
            // Single-Touch: Toggle Expand
            touchStartTime = now;
            card.classList.toggle('expanded');
            if (card.classList.contains('expanded')) {
                // No expandido, próximo touch abre WhatsApp (já no listener existente)
            }
        }
    });

    // Listener para WhatsApp no expandido (touch no card expandido)
    swiperWrapper.addEventListener('touchend', (e) => {
        const card = e.target.closest('.service-card-modern.expanded');
        if (card) {
            window.open(card.dataset.whatsapp, '_blank');
        }
    });
}

// Setup Listeners Desktop (Aprimorado com Clique em "Saiba Mais")
function setupDesktopListeners(swiperWrapper) {
    swiperWrapper.addEventListener('mouseover', (e) => {
        const card = e.target.closest('.service-card-modern');
        if (card) card.classList.add('expanded');
    });
    
    swiperWrapper.addEventListener('mouseleave', (e) => {
        const card = e.target.closest('.service-card-modern');
        if (card) card.classList.remove('expanded');
    });

    // Clique em "Saiba Mais" para Detalhes
    swiperWrapper.addEventListener('click', (e) => {
        if (e.target.classList.contains('saiba-mais-btn')) {
            e.stopPropagation();
            const card = e.target.closest('.service-card-modern');
            const servicoId = card.dataset.service;
            showDetalhes(servicoId);
        } else {
            // Clique no card (fora botão): Abre WhatsApp
            const card = e.target.closest('.service-card-modern');
            if (card) window.open(card.dataset.whatsapp, '_blank');
        }
    });
}

// Inicializar Swiper (Aprimorado: Vertical Mobile, Paginação Desktop)
function initSwiper() {
    const swiperConfig = {
        direction: getDeviceType() === 'mobile' ? 'vertical' : 'horizontal', // Vertical mobile
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        breakpoints: {
            0: { // Mobile
                slidesPerView: 1,
                effect: 'creative', // Efeito creative vertical
                creativeEffect: {
                    prev: { shadow: true, translate: [0, 0, -400] },
                    next: { translate: [0, 0, -400] }
                }
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
                effect: 'slide'
            },
            1080: {
                slidesPerView: 3,
                spaceBetween: 40,
                centeredSlides: true,
                effect: 'slide'
            }
        }
    };
    swiper3 = new Swiper('.mySwiper3', swiperConfig);

    // Paginação Desktop Extra (Bolinhas para Páginas de 3 Cards)
    if (getDeviceType() === 'desktop') {
        const paginationDesktop = document.querySelector('.swiper-pagination');
        paginationDesktop.classList.add('swiper-pagination-desktop');
        // Dots já gerados pelo Swiper; são clicáveis via clickable: true
    }
}

function setupListeners() {
    const swiperWrapper = document.querySelector('.mySwiper3 .swiper-wrapper');
    if (!swiperWrapper) return;
    const device = getDeviceType();
    if (device === 'mobile') {
        setupMobileListeners(swiperWrapper);
    } else {
        setupDesktopListeners(swiperWrapper);
    }
}

function setupResizeListener() {
    const debouncedResize = debounce(() => {
        const newDevice = getDeviceType();
        if (newDevice !== currentDevice) {
            currentDevice = newDevice;
            destroySwiper();
            removeAllListeners();
            initSwiper();
            setupListeners();
        }
    }, 250);
    window.addEventListener('resize', debouncedResize);
}

// Botão Voltar
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-voltar').addEventListener('click', () => {
        document.getElementById('conteudo-detalhes').classList.add('hidden');
        document.getElementById('detalhes').classList.remove('visible');
        document.getElementById('divisa').scrollIntoView({ behavior: 'smooth' });
    });

    currentDevice = getDeviceType();
    initSwiper();
    setupListeners();
    setupResizeListener();
});


<script>
  AOS.init({
    duration: 1000,
    once: true,
    easing: 'ease-out-cubic',
    offset: 80
  });
</script>
