document.addEventListener('DOMContentLoaded', () => {
    // Dane dla każdego buta
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

    // Elementy DOM, które będą aktualizowane
    const titleElement = document.querySelector('.left-block h1');
    const releaseDateElement = document.querySelector('.info p:nth-child(2)');
    const colorWayElement = document.querySelector('.info p:nth-child(4)');

    const allShoes = document.querySelectorAll('.shoe-img');

    const checkedRadio = document.querySelector('input[name="color"]:checked');
    const activeShoeId = checkedRadio ? checkedRadio.dataset.color + '-shoe' : null;
    const initialActiveShoe = activeShoeId ? document.getElementById(activeShoeId) : null;

    if (!backgroundElement || allShoes.length === 0 || !titleElement || !releaseDateElement || !colorWayElement) {
        console.error('Brak wymaganych elementów DOM (Tło, Buty, lub elementy tekstowe).');
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

    // NOWA FUNKCJA: Aktualizuje tekst na podstawie danych
    const updateTextContent = (color) => {
        const data = shoeData[color];
        if (data) {
            releaseDateElement.textContent = data.date;
            colorWayElement.textContent = data.colorway;
        }
    };

    const switchShoes = (enteringShoe) => {
        const leavingShoe = document.querySelector('.shoe-img.active');

        // POBIERANIE NOWEGO KOLORU DLA AKTUALIZACJI TREŚCI
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

        // ZMIANA TŁA
        backgroundElement.className = `background ${newColor}-active`;

        // ZMIANA TEKSTU NATYCHMIAST PO WYBRANIU NOWEGO BUTA
        updateTextContent(newColor);


        setTimeout(() => {
            enteringShoe.style.animation = 'sway 5s ease-in-out infinite alternate';
            isAnimating = false;
        }, transitionDuration);
    };

    if (initialActiveShoe) {
         initialActiveShoe.style.animation = 'sway 5s ease-in-out infinite alternate';
         // Ustawienie tekstu początkowego dla domyślnego buta
         updateTextContent(checkedRadio.dataset.color);
    }


    radioButtons.forEach(radio => {
        radio.addEventListener('change', (event) => {
            if (isAnimating) {
                event.target.checked = false;
                return;
            }

            const selectedColor = event.target.dataset.color;
            const enteringShoe = document.getElementById(`${selectedColor}-shoe`);

            if (enteringShoe) {
                isAnimating = true;
                switchShoes(enteringShoe);
            }
        });
    });
});