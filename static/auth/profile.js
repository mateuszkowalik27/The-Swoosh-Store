document.addEventListener('DOMContentLoaded', () => {
    checkAuthAndRenderHeader();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

function checkAuthAndRenderHeader() {
    const accessToken = localStorage.getItem('accessToken');

    const authLinksDiv = document.getElementById('auth-links');
    const profileAreaDiv = document.getElementById('profile-area');

    if (!authLinksDiv || !profileAreaDiv) {
        console.error("Brak wymaganych elementów nagłówka (auth-links lub profile-area) w HTML.");
        return;
    }

    if (accessToken) {
        authLinksDiv.style.display = 'none';
        profileAreaDiv.style.display = 'flex';
    } else {
        authLinksDiv.style.display = 'flex';
        profileAreaDiv.style.display = 'none';
    }
}

function handleLogout(event) {
    event.preventDefault();

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    alert('Wylogowano pomyślnie.');

    window.location.reload();
}