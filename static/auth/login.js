const API_URL = "http://127.0.0.1:8000";

async function dataPOST_login() {
    const error = document.getElementById("error");
    const success = document.getElementById("success");
    const rememberMeChecked = document.getElementById("rememberMe") ? document.getElementById("rememberMe").checked : false; // Pobierz stan checkboxa

    try {
        const url = `${API_URL}/login?remember_me=${rememberMeChecked}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            })
        });

        if (response.ok) {
            const result = await response.json();

            localStorage.setItem("accessToken", result.access_token);

            if (result.refresh_token) {
                localStorage.setItem("refreshToken", result.refresh_token);
            }

            const userName = result.user.name;
            const userSurname = result.user.surname;

            alert(`Zalogowano pomyślnie! Witaj, ${userName} ${userSurname}`);
            console.log(`Zalogowano pomyślnie! Witaj, ${userName} ${userSurname}`)
            success.textContent = `Witaj, ${userName} ${userSurname}`;

            window.location.href = "home.html";

            return;
        }

        const data = await response.json();

        if (!response.ok) {
            error.textContent = data.detail;
            return;
        }

        error.textContent = "";

    } catch (error) {
        error.textContent = "Server connection error.";
        console.error("Login error:", error);
    }
}
