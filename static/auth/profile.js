document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("accessToken");
    const success = document.getElementById("success");

    if (token && success) {
        try {
            const response = await fetch("http://127.0.0.1:8000/users/me", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                success.textContent = `Witaj, ${userData.name} ${userData.surname}`;
            } else {
                console.log("The session has expired or the token is invalid.");
                localStorage.removeItem("accessToken");
            }
        } catch (error) {
            console.error("Błąd podczas pobierania danych użytkownika:", error);
        }
    }
});