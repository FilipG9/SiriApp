document.addEventListener('DOMContentLoaded', () => {
    const calendarBody = document.getElementById('calendar-body');
    const calendarHeader = document.getElementById('calendar-header');
    const daysOfWeek = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    let currentDate = new Date();

    async function fetchAppointments() {
        try {
            const response = await fetch('/appointments');
            const data = await response.json();
            return data.appointments || []; // Accedi ai dati se sono in una proprietà appointments
        } catch (error) {
            console.error('Error fetching appointments:', error);
            return [];
        }
    }

    async function generateSlots(date) {
        calendarBody.innerHTML = '';
        calendarHeader.innerHTML = '';

        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + 1);

        const headerRow = document.createElement('tr');
        const timeHeader = document.createElement('th');
        timeHeader.innerText = 'Orario';
        headerRow.appendChild(timeHeader);

        for (let i = 0; i < daysOfWeek.length; i++) {
            const currentDay = new Date(startOfWeek);
            currentDay.setDate(startOfWeek.getDate() + i);
            const th = document.createElement('th');
            th.innerText = `${daysOfWeek[i]} ${currentDay.toLocaleDateString('it-IT')}`;
            headerRow.appendChild(th);
        }

        calendarHeader.appendChild(headerRow);

        let slotStart = new Date();
        slotStart.setHours(8, 30, 0, 0);

        const appointments = await fetchAppointments();

        for (let i = 0; i < 15; i++) { // 15 slot da 45 minuti
            const row = document.createElement('tr');
            const hour = slotStart.getHours();
            const minute = slotStart.getMinutes();
            const timeCell = document.createElement('td');
            const slotEnd = new Date(slotStart);
            slotEnd.setMinutes(slotStart.getMinutes() + 45);

            timeCell.innerText = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} - ${slotEnd.getHours().toString().padStart(2, '0')}:${slotEnd.getMinutes().toString().padStart(2, '0')}`;
            row.appendChild(timeCell);

            for (let j = 0; j < daysOfWeek.length; j++) {
                const cell = document.createElement('td');
                const slotDate = new Date(startOfWeek);
                slotDate.setDate(startOfWeek.getDate() + j);
                const slotKey = `${slotDate.getFullYear()}-${(slotDate.getMonth() + 1).toString().padStart(2, '0')}-${slotDate.getDate().toString().padStart(2, '0')}-${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const appointment = appointments.find(app => app.date === slotKey);

                if (appointment) {
                    cell.className = 'occupied';
                    cell.innerText = appointment.patientName;
                } else {
                    cell.className = 'free';
                }

                row.appendChild(cell);
            }

            calendarBody.appendChild(row);
            slotStart.setMinutes(slotStart.getMinutes() + 45);
        }
    }

    function updateWeek() {
        const currentWeek = document.getElementById('current-week');
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        currentWeek.innerText = `Settimana dal ${startOfWeek.toLocaleDateString('it-IT')} al ${endOfWeek.toLocaleDateString('it-IT')}`;
        generateSlots(startOfWeek);
    }

    document.getElementById('prev-week').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 7);
        updateWeek();
    });

    document.getElementById('next-week').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 7);
        updateWeek();
    });

    updateWeek();
});
