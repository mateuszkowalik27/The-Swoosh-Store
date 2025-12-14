const password = document.getElementById("password");
const hideShowImg = document.getElementById("hide-show-img");
document.getElementById("hide-show").addEventListener("click", function () {
    if (password.type === "password") {
            password.type = "text"
            hideShowImg.src = "../../assets/images/show.png";
    }
    else if (password.type === "text") {
        password.type = "password"
        hideShowImg.src = "../../assets/images/hide.png";
    }
});
password.addEventListener("focus", function () {
    if (password.type === "password") {
        hideShowImg.src = "../../assets/images/hide-black.png";
    }
    else if (password.type === "text") {
        hideShowImg.src = "../../assets/images/show-black.png";
    }
});
password.addEventListener("blur", function () {
     if (password.type === "password") {
        hideShowImg.src = "../../assets/images/hide.png";
    }
    else if (password.type === "text") {
        hideShowImg.src = "../../assets/images/show.png";
    }
});