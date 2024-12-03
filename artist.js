document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById("contact-form");

    contactForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get form data
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        // Display a thank you message (you can customize this)
        alert(`Thank you, ${name}! Your message has been received.\n\nWe will get back to you at ${email}.`);

        // Optionally, you can reset the form
        contactForm.reset();
    });
});