const energyData = {
    'North America': { solar: 30, wind: 40, hydro: 20, other: 10 },
    'South America': { solar: 20, wind: 30, hydro: 40, other: 10 },
    'Europe': { solar: 35, wind: 45, hydro: 15, other: 5 },
    'Africa': { solar: 40, wind: 20, hydro: 30, other: 10 },
    'Asia': { solar: 25, wind: 35, hydro: 25, other: 15 },
    'Oceania': { solar: 45, wind: 35, hydro: 10, other: 10 },
};

const colors = {
    solar: '#FFA500',
    wind: '#87CEEB',
    hydro: '#1E90FF',
    other: '#90EE90'
};

const continents = document.querySelectorAll('.continent');
const tooltip = document.getElementById('tooltip');
const energyChart = document.getElementById('energy-chart');

continents.forEach(continent => {
    continent.addEventListener('mouseover', showTooltip);
    continent.addEventListener('mouseout', hideTooltip);
    continent.addEventListener('click', showEnergyChart);
});

function showTooltip(event) {
    const continent = event.target.getAttribute('data-continent');
    tooltip.textContent = `Click to see ${continent} renewable energy data`;
    tooltip.style.opacity = 1;
    tooltip.style.left = `${event.clientX + 10}px`;
    tooltip.style.top = `${event.clientY + 10}px`;
}

function hideTooltip() {
    tooltip.style.opacity = 0;
}

function showEnergyChart(event) {
    const continent = event.target.getAttribute('data-continent');
    const data = energyData[continent];

    energyChart.innerHTML = `
        <h2>${continent} Renewable Energy Distribution</h2>
        <div class="chart-container"></div>
    `;

    const chartContainer = energyChart.querySelector('.chart-container');
    let startAngle = 0;

    for (const [source, percentage] of Object.entries(data)) {
        const endAngle = startAngle + (percentage / 100) * Math.PI * 2;
        const largeArcFlag = percentage > 50 ? 1 : 0;
        const x1 = Math.cos(startAngle) * 100 + 100;
        const y1 = Math.sin(startAngle) * 100 + 100;
        const x2 = Math.cos(endAngle) * 100 + 100;
        const y2 = Math.sin(endAngle) * 100 + 100;

        const slice = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        slice.setAttribute('width', '200');
        slice.setAttribute('height', '200');
        slice.setAttribute('viewBox', '0 0 200 200');
        slice.classList.add('chart-slice');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M100,100 L${x1},${y1} A100,100 0 ${largeArcFlag},1 ${x2},${y2} Z`);
        path.setAttribute('fill', colors[source]);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const textAngle = startAngle + (endAngle - startAngle) / 2;
        const textX = Math.cos(textAngle) * 70 + 100;
        const textY = Math.sin(textAngle) * 70 + 100;
        text.setAttribute('x', textX);
        text.setAttribute('y', textY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#fff');
        text.textContent = `${source}: ${percentage}%`;

        slice.appendChild(path);
        slice.appendChild(text);
        chartContainer.appendChild(slice);

        startAngle = endAngle;
    }
}

