document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    emailjs.sendForm('service_00yeqma', 'template_kj48bj6', this)
        .then(() => {
            alert('¡Mensaje enviado con éxito!');
            this.reset();
        }, (error) => {
            alert('Error al enviar el mensaje. Intentalo más tarde.');
            console.error('EmailJS Error:', error);
        });
});