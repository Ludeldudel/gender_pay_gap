// Gender Pay Gap Deutschland - Interactive Data Visualization
// Main application logic for the interactive website
//
// Structure:
// 1. Data definitions and global state
// 2. Initialization functions
// 3. Utility functions
// 4. Live counter and seven segment display
// 5. Interactive components (sliders, calculators, charts)
// 6. Event handling and animations
// 7. Sharing and social features
const data = {
    genderPayGap: {
        germany2024: {
            unadjusted: 16,
            adjusted: 6,
            maleHourlyWage: 26.34,
            femaleHourlyWage: 22.24,
            hourlyDifference: 4.10
        },
        historicalData: [
            {year: 2006, gap: 23},
            {year: 2010, gap: 22},
            {year: 2015, gap: 21},
            {year: 2020, gap: 18},
            {year: 2021, gap: 18},
            {year: 2022, gap: 18},
            {year: 2023, gap: 18},
            {year: 2024, gap: 16}
        ],
        migrationPayGap: [
            {group: "Deutsche Männer", percentage: 100, color: "#6de394"},
            {group: "Deutsche Frauen", percentage: 84, color: "#9e62f8"},
            {group: "Männer mit Migration", percentage: 82, color: "#6de394"},
            {group: "Frauen mit Migration", percentage: 68, color: "#9e62f8"}
        ],
        ageGaps: [
            {ageGroup: "25-29", gap: 9},
            {ageGroup: "30-34", gap: 14},
            {ageGroup: "35-39", gap: 19},
            {ageGroup: "40-44", gap: 24},
            {ageGroup: "45-49", gap: 28},
            {ageGroup: "50-54", gap: 26},
            {ageGroup: "55-59", gap: 24},
            {ageGroup: "60-65", gap: 22}
        ],
        industryGaps: [
            {industry: "Medizintechnik", gap: 22.6},
            {industry: "Business Development", gap: 18.0},
            {industry: "Finanzdienstleistungen", gap: 17.5},
            {industry: "IT-Beratung", gap: 15.2},
            {industry: "Marketing", gap: 12.8},
            {industry: "Personalwesen", gap: 8.4},
            {industry: "Bildung", gap: 5.1},
            {industry: "Gesundheitswesen", gap: 3.2},
            {industry: "Import/Export", gap: 0.3}
        ],
        internationalComparison: [
            {country: "Lettland", gap: 19},
            {country: "Deutschland", gap: 16},
            {country: "Österreich", gap: 15},
            {country: "EU-Durchschnitt", gap: 12},
            {country: "Frankreich", gap: 8},
            {country: "Luxemburg", gap: -0.9},
            {country: "Belgien", gap: 1}
        ],
        lifetimeImpact: [
            {salary: 25000, lifetimeLoss: 160000},
            {salary: 50000, lifetimeLoss: 320000},
            {salary: 75000, lifetimeLoss: 480000},
            {salary: 100000, lifetimeLoss: 640000}
        ]
    }
};

// Global state
let appState = {
    visitStartTime: Date.now()
};

let historicalChartAnimationFrame = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startLiveCounter();
    drawHistoricalChart();
    displayIndustryData();
});

function initializeApp() {
    // Add intersection observer for animations
    setupIntersectionObserver();

    // Initialize all interactive elements
    updateSalaryGap();
    updateAgeVisualization();
    updatePersonalCalculation();
}

function setupEventListeners() {
    // Salary slider in hero - improved responsiveness
    const salarySlider = document.getElementById('salarySlider');
    if (salarySlider) {
        salarySlider.addEventListener('input', debounce(updateSalaryGap, 100));
        salarySlider.addEventListener('change', updateSalaryGap);
    }

    // Age slider in career section - improved responsiveness
    const ageSlider = document.getElementById('ageSlider');
    if (ageSlider) {
        ageSlider.addEventListener('input', debounce(updateAgeVisualization, 100));
        ageSlider.addEventListener('change', updateAgeVisualization);
    }

    // Personal calculator inputs - improved responsiveness
    const personalSalary = document.getElementById('personalSalary');
    const personalAge = document.getElementById('personalAge');
    const personalGender = document.getElementById('personalGender');

    [personalSalary, personalAge, personalGender].forEach(input => {
        if (input) {
            input.addEventListener('input', debounce(updatePersonalCalculation, 200));
            input.addEventListener('change', updatePersonalCalculation);
        }
    });

    // Industry hover effects - improved performance
    setTimeout(() => {
        const industryBars = document.querySelectorAll('.industry-bar');
        industryBars.forEach(bar => {
            bar.addEventListener('mouseenter', showIndustryTooltip);
            bar.addEventListener('mouseleave', hideIndustryTooltip);
        });
    }, 100);

    // WebBluetooth functionality for ESP32 connection
    const startCounterBtn = document.getElementById('startCounterBtn');
    if (startCounterBtn) {
        startCounterBtn.addEventListener('click', connectAndSendStart);
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Debounce function to improve performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================================================
// LIVE COUNTER & SEVEN SEGMENT DISPLAY
// ============================================================================

let counterInterval = null; // Global variable to track the counter interval

function startLiveCounter() {
    const counterElement = document.getElementById('liveCounter');
    if (!counterElement) return;
    
    // Clear any existing interval to prevent multiple counters running
    if (counterInterval) {
        clearInterval(counterInterval);
    }
    
    const startTime = Date.now();
    
    function updateCounter() {
        const elapsed = (Date.now() - startTime) / 1000; // seconds
        const womenInGermany = 29000000; // approximate
        const hourlyLoss = 4.10;
        const secondlyLoss = hourlyLoss / 3600;
        const totalLoss = womenInGermany * secondlyLoss * elapsed / 3;
        const displayValue = Math.round(totalLoss).toLocaleString('de-DE');
        renderSevenSegmentDisplay(displayValue);
    }
    
    counterInterval = setInterval(updateCounter, 50);
    updateCounter(); // Initial update

    // WICHTIG: Timeout für initiale Skalierung nach dem ersten Rendern
    setTimeout(scaleCounterToFit, 0);
}

function renderSevenSegmentDisplay(value) {
    const container = document.getElementById('liveCounter');
    if (!container) return;

    // Wert als reine Ziffern, auf 10 Stellen auffüllen
    let str = value.replace(/[^\d]/g, '');
    let padded = str.padStart(10, '0');

    // Berechne, wie viele führende Stellen inaktiv sind
    const firstActive = 10 - str.length;

    // Tausenderpunkte berechnen (bei 10 Stellen: 1.000.000.000)
    let segments = [];
    for (let i = 0; i < padded.length; i++) {
        const isInactive = i < firstActive;
        segments.push({ 
            type: 'digit', 
            value: padded[i], 
            inactive: isInactive
        });
        // Punkt nach jedem dritten Ziffer, aber nicht am Ende
        if ((padded.length - i - 1) % 3 === 0 && i !== padded.length - 1) {
            // Punkt bekommt .inactive, wenn die Ziffer davor inaktiv ist
            segments.push({ type: 'dot', inactive: isInactive });
        }
    }

    // HTML generieren
    container.innerHTML = segments.map(seg => {
        if (seg.type === 'digit') {
            return `<span class="digit${seg.inactive ? ' inactive' : ''}"></span>`;
        }
        if (seg.type === 'dot') {
            return `<span class="digit dot${seg.inactive ? ' inactive' : ''}"><span class="segment dot on"></span></span>`;
        }
        return '';
    }).join('');

    // Segmente setzen
    let digitIndex = 0;
    const digitElements = container.querySelectorAll('.digit:not(.dot):not(.euro)');
    for (let i = 0; i < digitElements.length; i++) {
        setSevenSegment(digitElements[i], padded[i], i < firstActive);
    }

    // Nach dem Rendern:
    scaleCounterToFit();
}

function setSevenSegment(el, char, inactive = false) {
    // Segment-Mapping für 0-9
    const map = {
        '0': [1,1,1,1,1,1,0],
        '1': [0,1,1,0,0,0,0],
        '2': [1,1,0,1,1,0,1],
        '3': [1,1,1,1,0,0,1],
        '4': [0,1,1,0,0,1,1],
        '5': [1,0,1,1,0,1,1],
        '6': [1,0,1,1,1,1,1],
        '7': [1,1,1,0,0,0,0],
        '8': [1,1,1,1,1,1,1],
        '9': [1,1,1,1,0,1,1]
    };
    el.innerHTML = '';
    const segs = ['a','b','c','d','e','f','g'];
    let val = map[char] || [0,0,0,0,0,0,0];
    // Wenn inaktiv: alle Segmente "aus" (kein .on)
    if (inactive) val = [0,0,0,0,0,0,0];
    for (let i = 0; i < 7; i++) {
        el.appendChild(Object.assign(
            document.createElement('div'),
            {
                className: 'segment ' + segs[i] + (val[i] ? ' on' : '') + (inactive ? ' inactive' : '')
            }
        ));
    }
}

// Im updateCounter() die Anzeige anpassen:
function updateCounter() {
    const elapsed = (Date.now() - startTime) / 1000; // seconds
    const womenInGermany = 29000000; // approximate
    const hourlyLoss = 4.10;
    const secondlyLoss = hourlyLoss / 3600;
    const totalLoss = womenInGermany * secondlyLoss * elapsed / 3;
    const displayValue = Math.round(totalLoss).toLocaleString('de-DE');
    renderSevenSegmentDisplay(displayValue);
}

// ============================================================================
// INTERACTIVE COMPONENTS
// ============================================================================

function updateSalaryGap() {
    const slider = document.getElementById('salarySlider');
    const salaryDisplay = document.getElementById('sliderSalary');
    const gapAmount = document.getElementById('gapAmount');
    
    if (!slider || !salaryDisplay || !gapAmount) return;
    
    const salary = parseInt(slider.value);
    const gap = salary * 0.16; // 16% gap
    
    salaryDisplay.textContent = `${salary.toLocaleString('de-DE')}€`;
    gapAmount.textContent = `${Math.round(gap).toLocaleString('de-DE')}€`;
}

function drawHistoricalChart() {
    const canvas = document.getElementById('historicalChart');
    if (!canvas) return;

    // Responsive: Setze die Canvas-Größe auf die Containergröße
    const container = canvas.parentElement;
    const width = container.offsetWidth;
    const height = 300;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Animation setup
    const dataPoints = data.genderPayGap.historicalData;
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Lilac/Green Farbschema
    const lilac = 'rgb(159, 98, 248)';
    const green = 'rgb(109, 227, 148)';
    const isDark = document.body.getAttribute('data-color-scheme') === 'dark';
    const lineColor = isDark ? green : lilac;
    const textColor = isDark ? green : lilac;
    const gridColor = isDark ? 'rgba(109, 227, 148, 0.3)' : 'rgba(159, 98, 248, 0.3)';

    // Precompute points
    const points = dataPoints.map((pt, i) => ({
        x: padding + (i * chartWidth / (dataPoints.length - 1)),
        y: padding + ((25 - pt.gap) * chartHeight / 25),
        gap: pt.gap,
        year: pt.year
    }));

    // Cancel previous animation if any
    if (historicalChartAnimationFrame) {
        cancelAnimationFrame(historicalChartAnimationFrame);
    }

    let progress = 0;
    const duration = 900; // ms

    function animateChart(tsStart) {
        ctx.clearRect(0, 0, width, height);

        // Draw grid and labels
        ctx.strokeStyle = gridColor;
        ctx.fillStyle = textColor;
        ctx.font = '12px Arial';
        for (let i = 0; i <= 5; i++) {
            const y = padding + (i * chartHeight / 5);
            const value = 25 - (i * 5);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
            ctx.fillText(`${value}%`, 10, y + 4);
        }
        // Draw year labels
        for (let i = 0; i < points.length; i++) {
            ctx.fillText(points[i].year, points[i].x - 15, height - 10);
        }

        // Animate line
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        let lastDrawn = 0;
        const maxIndex = Math.floor(progress * (points.length - 1));
        for (let i = 0; i <= maxIndex; i++) {
            if (i === 0) {
                ctx.moveTo(points[i].x, points[i].y);
            } else {
                ctx.lineTo(points[i].x, points[i].y);
            }
            lastDrawn = i;
        }
        // Interpolate to next point
        if (lastDrawn < points.length - 1) {
            const next = points[lastDrawn + 1];
            const prev = points[lastDrawn];
            const localProgress = (progress * (points.length - 1)) - lastDrawn;
            const ix = prev.x + (next.x - prev.x) * localProgress;
            const iy = prev.y + (next.y - prev.y) * localProgress;
            ctx.lineTo(ix, iy);
        }
        ctx.stroke();

        // Draw points and value labels up to current progress
        ctx.fillStyle = lineColor;
        for (let i = 0; i <= lastDrawn; i++) {
            ctx.beginPath();
            ctx.arc(points[i].x, points[i].y, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = textColor;
            ctx.fillText(`${points[i].gap}%`, points[i].x - 8, points[i].y - 10);
            ctx.fillStyle = lineColor;
        }

        // Animate
        if (progress < 1) {
            historicalChartAnimationFrame = requestAnimationFrame((now) => {
                if (!tsStart) tsStart = now;
                progress = Math.min((now - tsStart) / duration, 1);
                animateChart(tsStart);
            });
        } else {
            // Draw all points at the end
            for (let i = lastDrawn + 1; i < points.length; i++) {
                ctx.beginPath();
                ctx.arc(points[i].x, points[i].y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillStyle = textColor;
                ctx.fillText(`${points[i].gap}%`, points[i].x - 8, points[i].y - 10);
                ctx.fillStyle = lineColor;
            }
        }
    }

    animateChart();
}

function updateAgeVisualization() {
    const ageSlider = document.getElementById('ageSlider');
    const currentAge = document.getElementById('currentAge');
    const ageGapValue = document.getElementById('ageGapValue');
    const ageDescription = document.getElementById('ageDescription');
    
    if (!ageSlider || !currentAge || !ageGapValue || !ageDescription) return;
    
    const age = parseInt(ageSlider.value);
    currentAge.textContent = age;
    
    // Find corresponding age group
    const ageGroups = data.genderPayGap.ageGaps;
    let selectedGroup = ageGroups[0];
    
    for (let group of ageGroups) {
        const [minAge, maxAge] = group.ageGroup.split('-').map(a => parseInt(a));
        if (age >= minAge && age <= maxAge) {
            selectedGroup = group;
            break;
        }
    }
    
    ageGapValue.textContent = `${selectedGroup.gap}%`;
    
    // Update description based on age
    const descriptions = {
        "25-29": "Berufseinstieg: Der Gap ist noch relativ gering, da Karriereunterschiede sich erst entwickeln.",
        "30-34": "Familiengründung beginnt: Der Gap verdoppelt sich durch erste Karriereunterbrechungen.",
        "35-39": "Mutterschaftsstrafe voll wirksam: Teilzeit und Betreuungspflichten verstärken den Gap.",
        "40-44": "Karriere-Peak bei Männern: Während Männer Führungspositionen erreichen, bleiben Frauen zurück.",
        "45-49": "Größter Gap des Arbeitslebens: Kumulative Effekte von 20 Jahren Diskriminierung.",
        "50-54": "Langsame Verbesserung: Kinder werden selbstständiger, aber verlorene Jahre bleiben.",
        "55-59": "Vorruhestand-Phase: Gap verringert sich, aber Rentenlücke ist bereits programmiert.",
        "60-65": "Karriereende: Der Gap nimmt ab, aber die Rentenunterschiede sind dramatisch."
    };
    
    ageDescription.textContent = descriptions[selectedGroup.ageGroup] || descriptions["30-34"];
    
    // Update career path visualizations
    updateCareerPaths(age, selectedGroup.gap);
}

function updateCareerPaths(age, gap) {
    const withKidsPath = document.getElementById('withKidsPath');
    const withoutKidsPath = document.getElementById('withoutKidsPath');
    
    if (!withKidsPath || !withoutKidsPath) return;
    
    // Simulate career progression
    const baseGap = gap;
    const withKidsGap = Math.min(baseGap + 10, 35); // Additional penalty for having kids
    const withoutKidsGap = Math.max(baseGap - 5, 5); // Better progression without kids
    
    withKidsPath.innerHTML = `
        <div style="background: linear-gradient(90deg, var(--color-lilac) ${100 - withKidsGap}%, var(--color-green) ${100 - withKidsGap}%); height: 100%; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; transition: all 0.3s ease;">
            ${withKidsGap}% Gap
        </div>
    `;
    
    withoutKidsPath.innerHTML = `
        <div style="background: linear-gradient(90deg, var(--color-lilac) ${100 - withoutKidsGap}%, var(--color-green) ${100 - withoutKidsGap}%); height: 100%; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; transition: all 0.3s ease;">
            ${withoutKidsGap}% Gap
        </div>
    `;
}

function updatePersonalCalculation() {
    const salaryInput = document.getElementById('personalSalary');
    const ageInput = document.getElementById('personalAge');
    const genderInput = document.getElementById('personalGender');
    const lifetimeLossElement = document.getElementById('lifetimeLoss');
    
    if (!salaryInput || !ageInput || !genderInput || !lifetimeLossElement) return;
    
    const salary = parseInt(salaryInput.value) || 50000;
    const age = parseInt(ageInput.value) || 30;
    const gender = genderInput.value;
    
    const yearsUntilRetirement = Math.max(65 - age, 0);
    const lifetimeLoss = gender === 'female' ? salary * 0.16 * yearsUntilRetirement : 0;
    
    lifetimeLossElement.textContent = `${Math.round(lifetimeLoss).toLocaleString('de-DE')}€`;
    
    // Update purchase options
    updatePurchaseOptions(lifetimeLoss);
}

function updatePurchaseOptions(amount) {
    const purchaseOptions = document.getElementById('purchaseOptions');
    if (!purchaseOptions) return;
    
    // 35 Jahre Rente à 12 Monate = 420 Monate
    const extraRente = Math.round(amount / 420);

    const options = [
        {item: 'Haus-Anzahlung', value: Math.min(amount, 200000).toLocaleString('de-DE') + '€'},
        {item: 'Neuwagen', value: Math.round(amount / 40000) + 'x'},
        {item: 'Studienfinanzierungen', value: Math.round(amount / 32000) + 'x'},
        // {item: 'Extra Rente pro Monat', value: extraRente.toLocaleString('de-DE') + '€'}
    ];
    
    purchaseOptions.innerHTML = options.map(option => `
        <div class="purchase-item">
            ${option.item}: <span>${option.value}</span>
        </div>
    `).join('');
}

function displayIndustryData() {
    const industryContainer = document.getElementById('industryData');
    if (!industryContainer) return;
    
    const sortedIndustries = [...data.genderPayGap.industryGaps].sort((a, b) => b.gap - a.gap);
    
    industryContainer.innerHTML = sortedIndustries.map((industry, index) => `
        <div class="industry-bar" data-industry="${industry.industry}" data-gap="${industry.gap}">
            <div class="industry-info">
                <span class="industry-name">${index + 1}. ${industry.industry}</span>
                <span class="industry-gap">${industry.gap}%</span>
            </div>
            <div class="industry-visual">
                <div class="bar-fill" style="width: ${(industry.gap / 25) * 100}%; background: var(--color-lilac); transition: all 0.3s ease;"></div>
            </div>
        </div>
    `).join('');
}

let activeTooltip = null;

function showIndustryTooltip(event) {
    const industry = event.currentTarget.dataset.industry;
    const gap = event.currentTarget.dataset.gap;
    
    // Remove existing tooltip
    if (activeTooltip) {
        activeTooltip.remove();
        activeTooltip = null;
    }
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'industry-tooltip';
    tooltip.innerHTML = `<strong>${industry}</strong><br>Gender Pay Gap: ${gap}%`;
    tooltip.style.cssText = `
        position: fixed;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        padding: var(--space-8);
        border-radius: var(--radius-base);
        font-size: var(--font-size-sm);
        pointer-events: none;
        z-index: 1000;
        box-shadow: var(--shadow-md);
        max-width: 200px;
    `;
    
    document.body.appendChild(tooltip);
    activeTooltip = tooltip;
    
    // Position tooltip
    const rect = event.currentTarget.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
}

function hideIndustryTooltip() {
    if (activeTooltip) {
        activeTooltip.remove();
        activeTooltip = null;
    }
}

function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

function shareResult() {
    const lifetimeLossElement = document.getElementById('lifetimeLoss');
    if (!lifetimeLossElement) return;
    
    const lifetimeLoss = lifetimeLossElement.textContent;
    const text = `Ich habe gerade meinen persönlichen Gender Pay Gap berechnet: ${lifetimeLoss} Verlust über das Berufsleben!`;
    
    try {
        if (navigator.share) {
            navigator.share({
                title: 'Mein Gender Pay Gap Verlust',
                text: text
            });
        } else {
            // Fallback for environments without clipboard API
            alert('Teilen nicht verfügbar. Ihr Verlust: ' + lifetimeLoss);
        }
    } catch (error) {
        console.error('Fehler beim Teilen:', error);
    }
}

// Repariere shareWebsite: Fallback kopiert Link in die Zwischenablage
function shareWebsite() {
    const text = 'Entdecke die schockierende Wahrheit über den Gender Pay Gap in Deutschland!';
    const url = window.location.href;

    try {
        if (navigator.share) {
            navigator.share({
                title: 'Gender Pay Gap Deutschland',
                text: text,
                url: url
            });
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(url);
            alert('Link zur Website wurde in die Zwischenablage kopiert!');
        } else {
            prompt('Link zur Website:', url);
        }
    } catch (error) {
        console.error('Fehler beim Teilen:', error);
        alert('Link zur Website: ' + url);
    }
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function scaleCounterToFit() {
  const wrapper = document.querySelector('.counter-scale-wrapper');
  const counter = document.getElementById('liveCounter');
  if (!wrapper || !counter) return;
  // Reset scaling
  counter.style.transform = 'scale(1)';
  // Berechne, ob der Counter breiter als der Wrapper ist
  const available = wrapper.clientWidth;
  const needed = counter.scrollWidth;
  if (needed > available) {
    const scale = available / needed;
    counter.style.transform = `scale(${scale})`;
  }
}

window.addEventListener('resize', debounce(drawHistoricalChart, 150));
window.addEventListener('resize', scaleCounterToFit);

// Zusätzlich: Führe die Skalierung nach window.onload nochmal aus
window.addEventListener('load', () => {
    scaleCounterToFit();
});

// WebBluetooth functionality for ESP32 connection
const BLUETOOTH_CONFIG = {
    SERVICE_UUID: '12345678-1234-1234-1234-1234567890ab',
    CHARACTERISTIC_UUID: 'abcd1234-5678-90ab-cdef-1234567890ab'
};

let bleDevice = null;
let bleCharacteristic = null;

async function connectAndSendStart() {
    const statusElement = document.getElementById('bluetoothStatus');
    const buttonElement = document.getElementById('startCounterBtn');
    
    try {
        statusElement.textContent = 'Requesting BLE device...';
        buttonElement.disabled = true;
        
        bleDevice = await navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: 'ESP32' }],
            optionalServices: [BLUETOOTH_CONFIG.SERVICE_UUID]
        });

        statusElement.textContent = 'Connecting...';
        const server = await bleDevice.gatt.connect();
        const service = await server.getPrimaryService(BLUETOOTH_CONFIG.SERVICE_UUID);
        bleCharacteristic = await service.getCharacteristic(BLUETOOTH_CONFIG.CHARACTERISTIC_UUID);

        statusElement.textContent = 'Connected! Sending start signal...';

        const startSignal = new Uint8Array([1]);
        await bleCharacteristic.writeValue(startSignal);

        statusElement.textContent = 'Counter started via Bluetooth!';
        buttonElement.textContent = 'Counter Started';
        
        // Note: Visual counter is already running from page load
        
    } catch (error) {
        console.error('Bluetooth error:', error);
        statusElement.textContent = 'Error: ' + error.message;
        buttonElement.disabled = false;
    }
}

// Initialize Bluetooth functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const startCounterBtn = document.getElementById('startCounterBtn');
    if (startCounterBtn) {
        startCounterBtn.addEventListener('click', connectAndSendStart);
    }
    
    // Check if Web Bluetooth is supported
    if (!navigator.bluetooth) {
        const statusElement = document.getElementById('bluetoothStatus');
        if (statusElement) {
            statusElement.textContent = 'Web Bluetooth not supported in this browser';
            statusElement.style.color = 'var(--color-red)';
        }
        
        const buttonElement = document.getElementById('startCounterBtn');
        if (buttonElement) {
            buttonElement.disabled = true;
            buttonElement.textContent = 'Bluetooth Not Supported';
        }
    }
});