document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const menuItems = document.querySelectorAll(".item");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const category = button.getAttribute("data-category");

            menuItems.forEach(item => {
                item.style.display = category === "all" || item.getAttribute("data-category") === category ? "block" : "none";
            });
        });
    });
});
