import Sidebar from './src/Sidebar.js';

let map = L.map(document.body, {zoomControl: false}).setView([54.04, 26.27], 5);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

let SidebarControl = L.Control.extend({
    includes: L.Evented ? L.Evented.prototype : L.Mixin.Events,
    
    initialize: function(options) {
        L.setOptions(this, options);        
    },

    onAdd: function(map) {
		this._container = L.DomUtil.create('div');
		this._sidebar = new Sidebar(this._container);

		const tabs = [
			{id: 'layers', icon: 'fas fa-layer-group', active: 'active', normal: 'normal', content: 'Layers'},
			{id: 'weather', icon: 'fas fa-bolt', active: 'active', normal: 'normal', content: 'Weather'},
			{id: 'services', icon: 'fas fa-cogs', active: 'active', normal: 'normal', content: 'Services'},
		];
				
		for (let i = 0; i < tabs.length; ++i) {
            const {id, icon, active, normal, content} = tabs[i];
            let p = this._sidebar.addTab({id, icon, active, normal});
			p.innerHTML = `<span>${content}</span>`;
        }

        this._sidebar.addEventListener('change', e => {
            const {detail} = e;
            console.log(detail);
        });

        return this._container;
    },

    addTo: function(map) {
        L.Control.prototype.addTo.call(this, map);
        if (this.options.addBefore) {
            this.addBefore(this.options.addBefore);
        }
        return this;
    },

    addBefore: function(id) {
        let parentNode = this._parent && this._parent._container;
        if (!parentNode) {
            parentNode = this._map && this._map._controlCorners[this.getPosition()];
        }
        if (!parentNode) {
            this.options.addBefore = id;
        }
        else {
            for (let i = 0, len = parentNode.childNodes.length; i < len; i++) {
                let it = parentNode.childNodes[i];
                if (id === it._id) {
                    parentNode.insertBefore(this._container, it);
                    break;
                }
            }
        }
        return this;
    },    
});

export default new SidebarControl({position: 'topleft'}).addTo(map);