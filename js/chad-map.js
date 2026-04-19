/**
 * EnerTchad Chad Interactive Map Component
 * Renders an interactive SVG map showing operational locations
 * Self-initializes on DOMContentLoaded
 */

(function() {
  // Configuration
  const MAP_CONFIG = {
    viewBoxWidth: 500,
    viewBoxHeight: 600,
    containerSelector: '#chad-map-container'
  };

  // Operational locations with coordinates scaled to viewBox
  // 14 villes stratégiques + Terminal export Kribi
  const LOCATIONS = {
    ndjaména: {
      name: 'N\'Djaména',
      coords: [250, 80],
      color: '#D9A84F',
      type: 'hq',
      description: 'Siège social · 6 stations · Hub principal'
    },
    djermaya: {
      name: 'Djermaya',
      coords: [265, 105],
      color: '#D97706',
      type: 'refinery',
      description: 'Raffinerie SRN 20 kb/j · 1 station'
    },
    massakory: {
      name: 'Massakory',
      coords: [235, 55],
      color: '#10B981',
      type: 'station',
      description: 'Hadjer-Lamis · 1 station'
    },
    bongor: {
      name: 'Bongor',
      coords: [180, 220],
      color: '#0EA5E9',
      type: 'exploration',
      description: 'Bassin de Bongor · Forage · 1 station'
    },
    pala: {
      name: 'Pala',
      coords: [150, 300],
      color: '#10B981',
      type: 'station',
      description: 'Mayo-Kebbi Ouest · 1 station'
    },
    kelo: {
      name: 'Kélo',
      coords: [195, 340],
      color: '#10B981',
      type: 'station',
      description: 'Tandjilé · 1 station'
    },
    moundou: {
      name: 'Moundou',
      coords: [220, 420],
      color: '#10B981',
      type: 'distribution',
      description: '2ème ville · 3 stations · Hub Sud'
    },
    doba: {
      name: 'Doba',
      coords: [280, 380],
      color: '#2E86DE',
      type: 'production',
      description: 'Bassin pétrolier · Production · 2 stations'
    },
    koumra: {
      name: 'Koumra',
      coords: [260, 350],
      color: '#10B981',
      type: 'station',
      description: 'Mandoul · 1 station'
    },
    sarh: {
      name: 'Sarh',
      coords: [310, 340],
      color: '#10B981',
      type: 'station',
      description: 'Moyen-Chari · 3ème ville · 2 stations'
    },
    mongo: {
      name: 'Mongo',
      coords: [340, 200],
      color: '#10B981',
      type: 'station',
      description: 'Guéra · Centre · 1 station'
    },
    ati: {
      name: 'Ati',
      coords: [310, 145],
      color: '#10B981',
      type: 'station',
      description: 'Batha · Nord-centre · 1 station'
    },
    abeche: {
      name: 'Abéché',
      coords: [380, 180],
      color: '#10B981',
      type: 'station',
      description: 'Ouaddaï · Est · 2 stations'
    },
    faya: {
      name: 'Faya-Largeau',
      coords: [290, -30],
      color: '#10B981',
      type: 'station',
      description: 'BET · Grand Nord · 1 station'
    },
    kribi: {
      name: 'Kribi Terminal',
      coords: [350, 570],
      color: '#F59E0B',
      type: 'export',
      description: 'Pipeline Doba-Kribi 1 070 km'
    }
  };

  // Pipeline routes (arrays of coordinate pairs)
  const PIPELINES = [
    {
      name: 'Doba to Djermaya',
      points: [[280, 380], [300, 320]],
      style: 'stroke-dasharray: 5,5'
    },
    {
      name: 'Djermaya to N\'Djaména',
      points: [[300, 320], [250, 80]],
      style: 'stroke-dasharray: 5,5'
    },
    {
      name: 'Doba to Kribi',
      points: [[280, 380], [350, 570]],
      style: 'stroke-dasharray: 5,5'
    }
  ];

  /**
   * Create Chad border outline as SVG path
   * Simplified polygon representation of Chad
   */
  function createChadBorder() {
    // Approximate Chad border coordinates (scaled to viewBox)
    const borderPath = `
      M 100,50
      L 150,40
      L 180,60
      L 200,80
      L 220,100
      L 250,95
      L 280,110
      L 320,100
      L 360,120
      L 380,150
      L 390,200
      L 385,250
      L 380,300
      L 370,350
      L 360,380
      L 340,400
      L 320,420
      L 300,440
      L 280,450
      L 260,445
      L 240,450
      L 220,440
      L 200,450
      L 180,440
      L 160,450
      L 140,440
      L 120,450
      L 110,420
      L 100,380
      L 95,320
      L 90,260
      L 85,200
      L 80,150
      L 85,100
      L 95,75
      Z
    `;
    return borderPath;
  }

  /**
   * Create SVG element with map content
   */
  function createMapSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${MAP_CONFIG.viewBoxWidth} ${MAP_CONFIG.viewBoxHeight}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', 'auto');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.cssText = `
      display: block;
      max-width: 100%;
      margin: 0 auto;
      background: transparent;
    `;

    // Create defs for styles and animations
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&display=swap');

        .chad-border {
          fill: none;
          stroke: #D9A84F;
          stroke-width: 1.5;
          opacity: 0.8;
        }

        .pipeline {
          fill: none;
          stroke: #D9A84F;
          stroke-width: 1.5;
          opacity: 0.5;
        }

        .location-dot {
          cursor: pointer;
          transition: r 0.3s ease, opacity 0.3s ease;
          filter: drop-shadow(0 0 3px rgba(217, 168, 79, 0.5));
        }

        .location-dot:hover {
          r: 7;
          opacity: 1;
          filter: drop-shadow(0 0 8px rgba(217, 168, 79, 0.8));
        }

        .location-dot.active {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            r: 5;
            opacity: 1;
          }
          50% {
            r: 8;
            opacity: 0.6;
          }
        }

        .location-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 10px;
          font-weight: 500;
          fill: #FFFFFF;
          pointer-events: none;
          text-anchor: middle;
        }

        .tooltip {
          position: absolute;
          background: rgba(20, 20, 20, 0.95);
          border: 1px solid #D9A84F;
          border-radius: 6px;
          padding: 8px 12px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px;
          color: #FFFFFF;
          pointer-events: none;
          z-index: 1000;
          max-width: 200px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .tooltip-title {
          font-weight: 600;
          color: #D9A84F;
          margin-bottom: 4px;
        }

        .tooltip-description {
          font-size: 11px;
          color: #E0E0E0;
        }

        .legend {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 10px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .legend-color {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .legend-text {
          fill: #FFFFFF;
        }
      </style>

      <marker id="pipeline-marker" markerWidth="4" markerHeight="4" refX="2" refY="2" markerUnits="strokeWidth">
        <circle cx="2" cy="2" r="1" fill="#D9A84F" opacity="0.5"/>
      </marker>
    `;
    svg.appendChild(defs);

    // Chad border background
    const borderPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    borderPath.setAttribute('d', createChadBorder());
    borderPath.setAttribute('class', 'chad-border');
    svg.appendChild(borderPath);

    // ═══ PETROLEUM BASINS (Source: Carte Tchad Final 12-03-2025v6.pdf) ═══
    const BASINS = {
      doba: { name: 'Bassin de Doba', color: '#2E86DE', center: [270, 400], radius: 50,
        description: '>900M bbl · Bolobo, Komé, Miandoum, Mangara, Badila' },
      bongor: { name: 'Bassin de Bongor', color: '#0EA5E9', center: [200, 200], radius: 45,
        description: 'Rônier & Mimosa · Alimente raffinerie SRN Djermaya' },
      doseo: { name: 'Bassin de Doseo', color: '#8B5CF6', center: [350, 420], radius: 40,
        description: 'Exploration · 480×90 km · Brut basse teneur soufre' },
      salamat: { name: 'Bassin de Salamat', color: '#10B981', center: [380, 350], radius: 35,
        description: 'Exploration · Transfrontalier Tchad/RCA' },
      erdis: { name: "Bassin d'Erdis", color: '#D97706', center: [320, 30], radius: 55,
        description: 'Exploration préliminaire · Nord Tchad' }
    };
    const svgNS = 'http://www.w3.org/2000/svg';
    Object.values(BASINS).forEach(basin => {
      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('cx', basin.center[0]);
      circle.setAttribute('cy', basin.center[1]);
      circle.setAttribute('r', basin.radius);
      circle.setAttribute('fill', basin.color);
      circle.setAttribute('opacity', '0.07');
      circle.setAttribute('stroke', basin.color);
      circle.setAttribute('stroke-width', '0.5');
      circle.setAttribute('stroke-opacity', '0.25');
      circle.setAttribute('stroke-dasharray', '4,3');
      svg.appendChild(circle);
      const label = document.createElementNS(svgNS, 'text');
      label.setAttribute('x', basin.center[0]);
      label.setAttribute('y', basin.center[1] - basin.radius - 4);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', basin.color);
      label.setAttribute('font-size', '7');
      label.setAttribute('font-weight', '600');
      label.setAttribute('opacity', '0.4');
      label.textContent = basin.name;
      svg.appendChild(label);
      // Tooltip on basin hover
      circle.style.cursor = 'pointer';
      circle.addEventListener('mouseenter', (e) => {
        showTooltip(e, { name: basin.name, description: basin.description });
        circle.setAttribute('opacity', '0.15');
      });
      circle.addEventListener('mouseleave', () => {
        hideTooltip();
        circle.setAttribute('opacity', '0.07');
      });
    });

    // Pipeline routes
    PIPELINES.forEach(pipeline => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      const [x1, y1] = pipeline.points[0];
      const [x2, y2] = pipeline.points[1];
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('class', 'pipeline');
      line.setAttribute('stroke-dasharray', '5,5');
      svg.appendChild(line);
    });

    // Operational location dots
    Object.values(LOCATIONS).forEach(location => {
      const [x, y] = location.coords;

      // Circle dot
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      dot.setAttribute('r', 5);
      dot.setAttribute('fill', location.color);
      dot.setAttribute('class', `location-dot ${location.type === 'hq' || location.type === 'production' ? 'active' : ''}`);
      dot.setAttribute('data-location', location.name);
      dot.style.opacity = '0.9';

      // Add event listeners for tooltip
      dot.addEventListener('mouseenter', (e) => showTooltip(e, location));
      dot.addEventListener('mouseleave', hideTooltip);

      svg.appendChild(dot);

      // Location label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', x);
      label.setAttribute('y', y + 15);
      label.setAttribute('class', 'location-label');
      label.textContent = location.name;
      svg.appendChild(label);
    });

    // Legend
    const legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    legendGroup.setAttribute('class', 'legend');
    legendGroup.setAttribute('transform', 'translate(20, 520)');

    const legendTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    legendTitle.setAttribute('x', 0);
    legendTitle.setAttribute('y', 0);
    legendTitle.setAttribute('fill', '#D9A84F');
    legendTitle.setAttribute('font-weight', '600');
    legendTitle.setAttribute('font-size', '11');
    legendTitle.setAttribute('font-family', 'Space Grotesk, sans-serif');
    legendTitle.textContent = 'Opérations EnerTchad';
    legendGroup.appendChild(legendTitle);

    const legendItems = [
      { color: '#D9A84F', label: 'Siège social' },
      { color: '#2E86DE', label: 'Production' },
      { color: '#0EA5E9', label: 'Exploration' },
      { color: '#10B981', label: 'Distribution' },
      { color: '#D97706', label: 'Raffinerie' },
      { color: '#F59E0B', label: 'Export' }
    ];

    legendItems.forEach((item, index) => {
      const yOffset = 15 + (index * 12);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', 5);
      circle.setAttribute('cy', yOffset - 3);
      circle.setAttribute('r', 2.5);
      circle.setAttribute('fill', item.color);
      legendGroup.appendChild(circle);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', 15);
      text.setAttribute('y', yOffset);
      text.setAttribute('class', 'legend-text');
      text.setAttribute('font-family', 'Space Grotesk, sans-serif');
      text.setAttribute('font-size', '9');
      text.textContent = item.label;
      legendGroup.appendChild(text);
    });

    svg.appendChild(legendGroup);

    return svg;
  }

  /**
   * Show tooltip with location details
   */
  function showTooltip(event, location) {
    hideTooltip();

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.id = 'map-tooltip';
    tooltip.innerHTML = `
      <div class="tooltip-title">${location.name}</div>
      <div class="tooltip-description">${location.description}</div>
    `;

    document.body.appendChild(tooltip);

    // Position tooltip near mouse
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = (rect.left + 10) + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';

    // Adjust if tooltip goes off-screen
    const tooltipRect = tooltip.getBoundingClientRect();
    if (tooltipRect.right > window.innerWidth) {
      tooltip.style.left = (window.innerWidth - tooltipRect.width - 10) + 'px';
    }
    if (tooltipRect.top < 0) {
      tooltip.style.top = (rect.bottom + 10) + 'px';
    }
  }

  /**
   * Hide tooltip
   */
  function hideTooltip() {
    const tooltip = document.getElementById('map-tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }

  /**
   * Initialize the map
   */
  function initMap() {
    const container = document.querySelector(MAP_CONFIG.containerSelector);

    if (!container) {
      console.warn(`Chad map container "${MAP_CONFIG.containerSelector}" not found`);
      return;
    }

    // Clear any existing content
    container.innerHTML = '';

    // Create and append SVG map
    const svgMap = createMapSVG();
    container.appendChild(svgMap);

    // Add container styling
    container.style.cssText = `
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      padding: 20px 0;
    `;
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
  } else {
    initMap();
  }

  // Export for potential external use
  window.EnerTchadMap = {
    init: initMap
  };
})();
