const API_URL = 'http://localhost:3000';

const candidateNames = {
    '0': 'Voto en Blanco',
    '1': 'Candidato 1',
    '2': 'Candidato 2',
    '3': 'Candidato 3'
};

const barColors = {
    '0': 'c0',
    '1': 'c1',
    '2': 'c2',
    '3': 'c3'
};

// Cargar resultados al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadResults();
});

// Cargar resultados
async function loadResults() {
    try {
        const response = await fetch(`${API_URL}/votos/resultados`);
        const results = await response.json();
        
        if (results.length === 0) {
            document.getElementById('barChart').innerHTML = '<p class="loading">No hay votos registrados todavia</p>';
            document.getElementById('resultsBody').innerHTML = '<tr><td colspan="4" class="loading">Sin datos</td></tr>';
            return;
        }

        // Calcular totales
        const totalVotes = results.reduce((sum, r) => sum + r.votos, 0);
        const leader = results[0];

        // Actualizar estadisticas
        document.getElementById('totalVotes').textContent = totalVotes;
        document.getElementById('leadingCandidate').textContent = candidateNames[leader.candidato] || `Candidato ${leader.candidato}`;
        document.getElementById('leadingVotes').textContent = leader.votos;

        // Generar grafico de barras
        const maxVotes = leader.votos;
        document.getElementById('barChart').innerHTML = results.map(r => {
            const percentage = totalVotes > 0 ? (r.votos / totalVotes * 100).toFixed(1) : 0;
            const width = maxVotes > 0 ? (r.votos / maxVotes * 100) : 0;
            const colorClass = barColors[r.candidato] || 'c1';
            const name = candidateNames[r.candidato] || `Candidato ${r.candidato}`;
            
            return `
                <div class="bar-item">
                    <span class="bar-label">${name}</span>
                    <div class="bar-container">
                        <div class="bar-fill ${colorClass}" style="width: ${width}%">
                            <span>${r.votos}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Generar tabla de resultados
        document.getElementById('resultsBody').innerHTML = results.map((r, index) => {
            const percentage = totalVotes > 0 ? (r.votos / totalVotes * 100).toFixed(1) : 0;
            const name = candidateNames[r.candidato] || `Candidato ${r.candidato}`;
            const position = index + 1;
            let badgeClass = 'default';
            if (position === 1) badgeClass = 'gold';
            else if (position === 2) badgeClass = 'silver';
            else if (position === 3) badgeClass = 'bronze';
            
            return `
                <tr>
                    <td><span class="position-badge ${badgeClass}">${position}</span></td>
                    <td>${name}</td>
                    <td>${r.votos}</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        }).join('');

        // Actualizar timestamp
        const now = new Date().toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('lastUpdate').textContent = `Ultima actualizacion: ${now}`;

    } catch (error) {
        document.getElementById('barChart').innerHTML = '<p class="loading">Error al cargar los resultados</p>';
        document.getElementById('resultsBody').innerHTML = '<tr><td colspan="4" class="loading">Error de conexion</td></tr>';
        console.error('Error:', error);
    }
}