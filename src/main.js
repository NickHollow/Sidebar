import Sidebar from './Sidebar.html';

let map = L.map(document.body, {zoomControl: false}).setView([54.04, 26.27], 5);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

let SidebarControl = L.Control.extend({
    includes: L.Evented ? L.Evented.prototype : L.Mixin.Events,
    initialize: function(options) {
        L.setOptions(this, options);        
    },
    onAdd: function(map) {
		this._container = L.DomUtil.create('div');
		this._sidebar = new Sidebar({target: this._container});

		const tabs = [
			{active: 'fas fa-layer-group active', normal: 'fas fa-layer-group normal', content: 'Layers'},
			{active: 'fas fa-bolt active', normal: 'fas fa-bolt normal', content: 'Weather'},
			{active: 'fas fa-cogs active', normal: 'fas fa-cogs normal', content: 'Services'},
		];

		this._sidebar.set({tabs});
		const panes = this._sidebar.panes();
		for (let i = 0; i < panes.length; ++i) {
			panes[i].innerHTML = `<span>${tabs[i].content}</span>`;
		}

		this._sidebar.on('state', state => {
			console.log(state);
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
let ctl = new SidebarControl({position: 'topleft'}).addTo(map);
