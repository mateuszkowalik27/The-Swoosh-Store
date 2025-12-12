const API_URL = "http://127.0.0.1:8000";

async function logout() {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
        try {
            const response = await fetch(`${API_URL}/logout`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}` // <--- TO JEST KLUCZOWE
                }
            });

            if (response.ok) {
                console.log("Serwer usunął refresh token. Wylogowanie zakończone sukcesem na serwerze.");
            } else {
                console.warn("Serwer zwrócił błąd przy /logout (może token wygasł).", response.status);
            }

        } catch (error) {
            console.error("Błąd połączenia z API /logout:", error);
        }
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    if (success) {
        success.textContent = "";
    }
    alert("Wylogowano pomyślnie.");
};