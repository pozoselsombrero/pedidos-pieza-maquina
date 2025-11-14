// Referencias a los elementos del DOM
const form = document.getElementById('solicitudForm');
const reqPerforadora = document.getElementById('req_perforadora');
const reqPieza = document.getElementById('req_pieza');
const perforadoraSection = document.getElementById('perforadoraSection');
const descripcionPerforadora = document.getElementById('descripcionPerforadora');
const piezaSection = document.getElementById('piezaSection');
const checkboxOtros = document.getElementById('part5');
const otroPiezaSection = document.getElementById('otroPiezaSection');
const descripcionOtraPieza = document.getElementById('descripcionOtraPieza');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');
const whatsappInput = document.getElementById('whatsapp');

/**
 * Maneja la lógica condicional para mostrar u ocultar secciones
 * y ajustar el atributo 'required' y 'disabled'.
 * @param {string} tipo - 'perforadora' o 'pieza'.
 */
function toggleRequerimiento(tipo) {
    // 1. Resetear estados de ambas secciones condicionales

    // Perforadora
    perforadoraSection.classList.add('hidden');
    descripcionPerforadora.removeAttribute('required');
    descripcionPerforadora.disabled = true;
    
    // Pieza
    piezaSection.classList.add('hidden');
    
    // Ocultar el campo 'Otros' y deshabilitar su textarea
    toggleOtro(false); 

    // 2. Aplicar estado según el tipo seleccionado
    if (tipo === 'perforadora') {
        perforadoraSection.classList.remove('hidden');
        descripcionPerforadora.setAttribute('required', 'required');
        descripcionPerforadora.disabled = false;
    } else if (tipo === 'pieza') {
        piezaSection.classList.remove('hidden');
    }
}

/**
 * Maneja la lógica para mostrar u ocultar la descripción de 'Otros'
 * dentro de la sección 'Pieza' y ajustar 'required'/'disabled'.
 * @param {boolean} isChecked - Indica si el checkbox 'Otros' está marcado.
 */
function toggleOtro(isChecked) {
    // Si se llama para marcar (o si el checkbox 'Otros' está marcado)
    if (isChecked) {
        otroPiezaSection.classList.remove('hidden');
        descripcionOtraPieza.setAttribute('required', 'required');
        descripcionOtraPieza.disabled = false;
    } else {
        // Si se llama para desmarcar (y el checkbox 'Otros' no está marcado)
        if (!checkboxOtros.checked) {
            otroPiezaSection.classList.add('hidden');
            descripcionOtraPieza.removeAttribute('required');
            descripcionOtraPieza.disabled = true;
            descripcionOtraPieza.value = ''; // Limpiar el campo
        }
    }
}

/**
 * Valida el formato del email, la selección de Piezas y el campo de 'Otros'.
 * @returns {boolean} - true si el formulario es válido, false en caso contrario.
 */
function validateForm() {
    let isValid = true;
    let focusSet = false;

    // 1. Validación de Correo Electrónico (Regex simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        emailError.classList.remove('hidden');
        emailInput.focus();
        focusSet = true;
        isValid = false;
    } else {
        emailError.classList.add('hidden');
    }

    // 2. Validación de WhatsApp (patrón: solo números)
    // El atributo pattern="[0-9]*" en el HTML hace la mayor parte del trabajo.
    if (!whatsappInput.checkValidity()) {
        if (!focusSet) {
            whatsappInput.focus();
            focusSet = true;
        }
        isValid = false; 
    }

    // 3. Validación Condicional: Selección de al menos una Pieza
    if (reqPieza.checked) {
        const checkboxes = piezaSection.querySelectorAll('input[type="checkbox"]:checked');
        const hasSelection = checkboxes.length > 0;
        let error = piezaSection.querySelector('.error-message');

        if (!hasSelection) {
            // Muestra mensaje de error
            if (!error) {
                error = document.createElement('p');
                error.className = 'error-message text-red-600 text-sm mt-2';
                error.textContent = 'Debes seleccionar al menos una Pieza de la lista.';
                piezaSection.appendChild(error);
            }
            isValid = false;
        } else {
             // Oculta mensaje de error si existe
             if (error) error.remove();
        }
    }
    
    // 4. Validación de la Descripción de Otras Piezas (si 'Otros' está marcado)
    if (checkboxOtros.checked && descripcionOtraPieza.value.trim() === '') {
         if (!focusSet) {
             descripcionOtraPieza.focus();
             focusSet = true;
         }
         isValid = false;
    }
    
    return isValid;
}

// -----------------------------------------------------
// Lógica de Event Listeners
// -----------------------------------------------------

// Event listeners para la selección Perforadora/Pieza
reqPerforadora.addEventListener('change', () => toggleRequerimiento('perforadora'));
reqPieza.addEventListener('change', () => toggleRequerimiento('pieza'));

// Event listener para el checkbox 'Otros'
checkboxOtros.addEventListener('change', (e) => {
    toggleOtro(e.target.checked);
});

// Event listener para otros checkboxes de piezas (para manejar si desmarcan 'Otros')
piezaSection.addEventListener('change', (e) => {
    // Solo si el cambio es en un checkbox y NO es el checkbox 'Otros'
    if (e.target.type === 'checkbox' && e.target.id !== 'part5') {
        // Si 'Otros' está marcado, aseguramos que su descripción esté activa
        if (checkboxOtros.checked) {
            toggleOtro(true); 
        } else {
             // Si desmarcan 'Otros', lo manejamos directamente con el listener de 'checkboxOtros'
             // Si desmarcan otra pieza y 'Otros' no está marcado, no hacemos nada con la sección de "Otros".
        }
    }
});


// Inicializar la lógica al cargar la página (para el caso de campos pre-seleccionados si existieran)
window.addEventListener('load', () => {
    if (reqPerforadora.checked) {
        toggleRequerimiento('perforadora');
    } else if (reqPieza.checked) {
        toggleRequerimiento('pieza');
    } else {
        // Asegurarse de que ambas secciones estén ocultas al inicio si no hay selección predeterminada
        perforadoraSection.classList.add('hidden');
        piezaSection.classList.add('hidden');
    }
});