const openModBtns = document.querySelectorAll("[data-modal-target]");
const closeModBtns = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

openModBtns.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget);
        openMod(modal);
    })
})

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        closeMod(modal);
    })
})

closeModBtns.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeMod(modal);
    })
})

function openMod(modal) {
    if (modal == null)
        return;
    modal.classList.add('active');
    overlay.classList.add('active');
}

function closeMod(modal) {
    if (modal == null)
        return;
    modal.classList.remove('active');
    overlay.classList.remove('active');
}