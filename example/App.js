import './App.css';
import './scroll.css';
import './icons.css';
import Sidebar from '../src/Sidebar.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

window.addEventListener('load', () => {
    let sidebar = new Sidebar(document.getElementById('example'));    

    let propsPanel = sidebar.addTab('props');
    propsPanel.innerText = 'Props';

    let layersPanel = sidebar.addTab('layers');
    layersPanel.innerText = 'Layers';

    sidebar.disable('layers');

    let mapContainer = document.getElementById('map');

    let map = L.map(mapContainer).setView([51.505, -0.09], 13);

    sidebar.on('change:visible', () => {        
        if (sidebar.visible) {
            mapContainer.classList.add('expanded');
        }
        else {
            mapContainer.classList.remove('expanded');
        }        
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
});

