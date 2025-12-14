async function dataPOST() {
    const API_URL = "http://127.0.0.1:8000";
    const error = document.getElementById("error");

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: document.getElementById('name').value,
                surname: document.getElementById('surname').value,
                email: document.getElementById("email").value,
                date_birth: document.getElementById('date_birth').value,
                password: document.getElementById("password").value,
                // confirm_password: document.getElementById("password_confirmation").value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // pobiera detail z FastAPI i wyświetla
            error.textContent = data.detail;
            return;
        }

        error.textContent = "";

    } catch (err) {
        error.textContent = "Server connection error.";
    }
}
