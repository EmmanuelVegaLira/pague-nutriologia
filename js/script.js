// Menú móvil
document.getElementById('mobile-menu').addEventListener('click', function() {
    document.getElementById('nav-menu').classList.toggle('show');
});

// Calendario
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const calendarDays = document.getElementById('calendar-days');
const calendarTitle = document.querySelector('.calendar-title');
const timeSlots = document.getElementById('time-slots');
const confirmBtn = document.getElementById('confirm-btn');
const emailForm = document.getElementById('email-form');
const sendAppointmentBtn = document.getElementById('send-appointment');

let selectedDate = null;
let selectedTime = null;

// Horarios disponibles (simulados)
const availableTimes = [
    '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'
];

// Generar calendario
function generateCalendar(month, year) {
    // Limpiar calendario
    calendarDays.innerHTML = '';
    calendarTitle.textContent = `${monthNames[month]} ${year}`;
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);
    // Días en el mes
    const daysInMonth = lastDay.getDate();
    // Día de la semana del primer día
    const startingDay = firstDay.getDay();
    
    // Días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Agregar días del mes anterior
    for (let i = 0; i < startingDay; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day disabled';
        dayElement.textContent = prevMonthLastDay - startingDay + i + 1;
        calendarDays.appendChild(dayElement);
    }
    
    // Agregar días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = i;
        
        const currentDay = new Date(year, month, i);
        const today = new Date();
        
        // Deshabilitar días pasados y fines de semana
        if (currentDay < today || currentDay.getDay() === 0 || currentDay.getDay() === 6) {
            dayElement.classList.add('disabled');
        } else {
            dayElement.addEventListener('click', function() {
                selectDate(this, i);
            });
        }
        
        calendarDays.appendChild(dayElement);
    }
    
    // Calcular días restantes para completar la cuadrícula
    const totalCells = startingDay + daysInMonth;
    const remainingDays = 7 - (totalCells % 7);
    
    // Agregar días del próximo mes si es necesario
    if (remainingDays < 7) {
        for (let i = 1; i <= remainingDays; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day disabled';
            dayElement.textContent = i;
            calendarDays.appendChild(dayElement);
        }
    }
}

// Seleccionar fecha
function selectDate(element, day) {
    // Quitar selección anterior
    const prevSelected = document.querySelector('.calendar-day.selected');
    if (prevSelected) {
        prevSelected.classList.remove('selected');
    }
    
    // Marcar nueva selección
    element.classList.add('selected');
    selectedDate = new Date(currentYear, currentMonth, day);
    
    // Mostrar horarios disponibles
    showAvailableTimes();
    
    // Actualizar botón de confirmación
    updateConfirmButton();
}

// Mostrar horarios disponibles
function showAvailableTimes() {
    timeSlots.innerHTML = '';
    
    availableTimes.forEach(time => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = time;
        
        // Simular que algunos horarios están ocupados
        if (Math.random() < 0.3) {
            timeSlot.classList.add('disabled');
        } else {
            timeSlot.addEventListener('click', function() {
                selectTime(this, time);
            });
        }
        
        timeSlots.appendChild(timeSlot);
    });
}

// Seleccionar horario
function selectTime(element, time) {
    // Quitar selección anterior
    const prevSelected = document.querySelector('.time-slot.selected');
    if (prevSelected) {
        prevSelected.classList.remove('selected');
    }
    
    // Marcar nueva selección
    element.classList.add('selected');
    selectedTime = time;
    
    // Actualizar botón de confirmación
    updateConfirmButton();
}

// Actualizar botón de confirmación
function updateConfirmButton() {
    if (selectedDate && selectedTime) {
        confirmBtn.disabled = false;
    } else {
        confirmBtn.disabled = true;
    }
}

// Confirmar cita
confirmBtn.addEventListener('click', function() {
    if (selectedDate && selectedTime) {
        // Mostrar formulario de email
        emailForm.style.display = 'block';
        confirmBtn.style.display = 'none';
    }
});

// Enviar confirmación de cita
sendAppointmentBtn.addEventListener('click', function() {
    const emailInput = document.getElementById('client-email');
    const email = emailInput.value;
    
    if (email && validateEmail(email)) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = selectedDate.toLocaleDateString('es-ES', options);
        
        // Simular envío de correo (en producción usarías un servicio de email)
        alert(`Cita agendada para el ${dateStr} a las ${selectedTime}.\nSe ha enviado el enlace de Google Meet a ${email}`);
        
        // Aquí iría la integración real con Google Meet y el envío de email
        // window.location.href = "https://meet.google.com/...";
    } else {
        alert('Por favor ingresa un correo electrónico válido');
    }
});

// Validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Navegación del calendario
document.getElementById('prev-month').addEventListener('click', function() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
});

document.getElementById('next-month').addEventListener('click', function() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
});

// Smooth scrolling para los enlaces del menú
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        
        // Cerrar menú móvil si está abierto
        document.getElementById('nav-menu').classList.remove('show');
    });
});

// Inicializar calendario
generateCalendar(currentMonth, currentYear);