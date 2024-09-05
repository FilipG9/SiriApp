document.addEventListener('DOMContentLoaded', () => {
    const slotsPerDay = 12; // 11 slot da 45 minuti dalle 8:30 alle 19:30
    let currentDate = new Date();
    const daysOfWeek = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
    const appointments = []; // Memorizza gli appuntamenti in formato: { date: "YYYY-MM-DD", time: "HH:MM", patientName: "Nome", note: "Nota" }
    
    // Simula il login di Siria (per esempio, con una variabile di sessione)
    const isAdmin = false; // Cambia a `false` per simulare un utente non amministratore

    function generateSlots(date) {
        const calendarBody = document.getElementById('calendar-body');
        calendarBody.innerHTML = '';

        for (let i = 0; i < slotsPerDay; i++) {
            const row = document.createElement('tr');

            // Orario
            const timeCell = document.createElement('td');
            let hour = 8 + Math.floor(i / 2);
            let minute = (i % 2) * 30;
            timeCell.innerText = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            row.appendChild(timeCell);

            // Slot per cias giorno della settimana
            for (let j = 0; j < daysOfWeek.length; j++) {
                const cell = document.createElement('td');
                const slotKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const appointment = appointments.find(app => app.date === slotKey);

                if (appointment) {
                    cell.className = 'occupied';
                    cell.title = `Occupato da ${appointment.patientName}\nNota: ${appointment.note}`;
                } else {
                    cell.className = 'free';
                }

                if (isAdmin) {
                    cell.addEventListener('click', () => {
                        document.getElementById('admin-area').style.display = 'block';
                        document.getElementById('date').value = date.toISOString().split('T')[0];
                        document.getElementById('time').value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    });
                }

                row.appendChild(cell);
            }

            calendarBody.appendChild(row);
        }
    }

    function updateWeek() {
        const currentWeek = document.getElementById('current-week');
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

        currentWeek.innerText = `Settimana del ${startOfWeek.toLocaleDateString('it-IT')}`;
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

    document.getElementById('appointment-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const patientName = document.getElementById('patientName').value;
        const note = document.getElementById('note').value;
        
        const appointmentDate = new Date(`${date}T${time}`);
        const slotKey = `${appointmentDate.getFullYear()}-${(appointmentDate.getMonth() + 1).toString().padStart(2, '0')}-${appointmentDate.getDate().toString().padStart(2, '0')}-${appointmentDate.getHours().toString().padStart(2, '0')}:${appointmentDate.getMinutes().toString().padStart(2, '0')}`;
        
        appointments.push({ date: slotKey, time, patientName, note });
        document.getElementById('admin-area').style.display = 'none';
        updateWeek();
    });

    updateWeek();
});
