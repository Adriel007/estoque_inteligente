document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.getElementById('imageContainer');
    const tiltImage = document.getElementById('tiltImage');

    if (imageContainer && tiltImage) {
        imageContainer.addEventListener('mousemove', (e) => {
            const { offsetWidth: width, offsetHeight: height } = imageContainer;
            const { offsetX: x, offsetY: y } = e;

            const rotateY = (x / width - 0.5) * 40; // Ajuste o '40' para controlar a intensidade da rotação Y
            const rotateX = (y / height - 0.5) * -40; // Ajuste o '40' para controlar a intensidade da rotação X

            tiltImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        imageContainer.addEventListener('mouseleave', () => {
            tiltImage.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    }
});