const API_URL = 'http://localhost:3000';

// Cargar votantes al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadVoters();
});

// Manejar envio del formulario
document.getElementById('voteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const cedula = document.getElementById('cedula').value.trim();
    const votoInput = document.querySelector('input[name="voto"]:checked');
    
    if (!cedula || !votoInput) {
        showMessage('Por favor completa todos los campos', 'error');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Procesando...</span>';

    try {
        const response = await fetch(`${API_URL}/votos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cedula: cedula,
                voto: parseInt(votoInput.value)
            })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Voto emitido correctamente. Gracias por participar.', 'success');
            document.getElementById('voteForm').reset();
            loadVoters();
        } else {
            showMessage(data.error || 'Error al emitir el voto', 'error');
        }
    } catch (error) {
        showMessage('Error de conexion con el servidor', 'error');
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Confirmar Voto
        `;
    }
});

// Mostrar mensaje
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    
    setTimeout(() => {
        messageEl.className = 'message hidden';
    }, 5000);
}

// Cargar lista de votantes
async function loadVoters() {
    const tbody = document.getElementById('votersBody');
    
    try {
        const response = await fetch(`${API_URL}/votos/usuarios`);
        const voters = await response.json();
        
        if (voters.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="loading">No hay votantes registrados</td></tr>';
            document.getElementById('totalVoters').textContent = 'Total: 0 votantes';
            return;
        }

        tbody.innerHTML = voters.map((voter, index) => {
            const maskedCedula = maskCedula(voter.cedula);
            const fecha = new Date(voter.fecha).toLocaleString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${maskedCedula}</td>
                    <td>${fecha}</td>
                </tr>
            `;
        }).join('');

        document.getElementById('totalVoters').textContent = `Total: ${voters.length} votantes`;
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="3" class="loading">Error al cargar los votantes</td></tr>';
        console.error('Error:', error);
    }
}

// Enmascarar cedula para privacidad
function maskCedula(cedula) {
    if (cedula.length <= 4) return cedula;
    const visible = cedula.slice(-4);
    const masked = '*'.repeat(cedula.length - 4);
    return masked + visible;
}