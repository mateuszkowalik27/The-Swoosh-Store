document.addEventListener('DOMContentLoaded', () => {
    const shoeData = {
        red: {
            date: "2016 - 11 - 05",
            colorway: "BRED TOE"
        },
        blue: {
            date: "2017 - 02 - 19",
            colorway: "ALL-STAR CHAMELEON"
        },
        green: {
            date: "2023 - 04 - 15",
            colorway: "LUCKY GREEN"
        },
        purple: {
            date: "2018 - 09 - 22",
            colorway: "COURT PURPLE"
        }
    };

    const radioButtons = document.querySelectorAll('input[name="color"]');
    const backgroundElement = document.querySelector('.background');
    const colorOptionsContainer = document.getElementById('color-options-container');

    const titleElement = document.querySelector('.left-block h1');
    const releaseDateElement = document.querySelector('.info p:nth-child(2)');
    const colorWayElement = document.querySelector('.info p:nth-child(4)');

    const allShoes = document.querySelectorAll('.shoe-img');

    const checkedRadio = document.querySelector('input[name="color"]:checked');
    const activeShoeId = checkedRadio ? checkedRadio.dataset.color + '-shoe' : null;
    const initialActiveShoe = activeShoeId ? document.getElementById(activeShoeId) : null;

    if (!backgroundElement || allShoes.length === 0 || !titleElement || !releaseDateElement || !colorWayElement || !colorOptionsContainer) {
        console.error('Brak wymaganych elementów DOM.');
        return;
    }

    const transitionDuration = 700;
    let isAnimating = false;

    const setupTransitionReset = (shoeElement) => {
        shoeElement.addEventListener('transitionend', (event) => {
            if (event.propertyName === 'transform' && shoeElement.classList.contains('leaving')) {
                shoeElement.style.transition = 'none';
                shoeElement.classList.remove('leaving');
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        shoeElement.style.transition = '';
                    });
                });
            }
        });
    };

    allShoes.forEach(shoe => setupTransitionReset(shoe));

    const updateTextContent = (color) => {
        const data = shoeData[color];
        if (data) {
            releaseDateElement.textContent = data.date;
            colorWayElement.textContent = data.colorway;
        }
    };

    const switchShoes = (enteringShoe) => {
        colorOptionsContainer.classList.add('disabled-interaction');

        const leavingShoe = document.querySelector('.shoe-img.active');
        const newColor = enteringShoe.id.replace('-shoe', '');

        if (leavingShoe && leavingShoe !== enteringShoe) {
            leavingShoe.style.transition = '';
            leavingShoe.style.animation = 'none';

            requestAnimationFrame(() => {
                leavingShoe.classList.add('leaving');
                leavingShoe.classList.remove('active');
            });
        }

        enteringShoe.style.transition = '';
        enteringShoe.style.animation = 'none';

        enteringShoe.classList.remove('leaving');
        enteringShoe.classList.add('active');

        backgroundElement.className = `background ${newColor}-active`;

        updateTextContent(newColor);


        setTimeout(() => {
            enteringShoe.style.animation = 'sway 5s ease-in-out infinite alternate';
            isAnimating = false;
            colorOptionsContainer.classList.remove('disabled-interaction');
        }, transitionDuration);
    };

    if (initialActiveShoe) {
         initialActiveShoe.style.animation = 'sway 5s ease-in-out infinite alternate';
         updateTextContent(checkedRadio.dataset.color);
    }


    radioButtons.forEach(radio => {
        radio.addEventListener('change', (event) => {

            const selectedColor = event.target.dataset.color;
            const enteringShoe = document.getElementById(`${selectedColor}-shoe`);

            if (enteringShoe) {
                isAnimating = true;
                switchShoes(enteringShoe);
            }
        });
    });
});