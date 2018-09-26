import EventTarget from 'scanex-event-target';
import './Sidebar.css';

class Sidebar extends EventTarget {
    constructor (container, {position = 'left'} = {}) {
        super();
        this._container = container;
        this._container.classList.add ('noselect');    
        this._container.innerHTML = `<div class="scanex-sidebar">
            <div class="${position === 'left' ? 'tabs' : 'panes'}"></div>
            <div class="${position === 'left' ? 'panes' : 'tabs'}"></div>
        </div>`;

        this._tabContainer = this._container.querySelector('.tabs');
        this._paneContainer = this._container.querySelector('.panes');

        this._active = null;
        this._visible = false;
        this._tabs = [];
    }
    get visible () {
        return this._visible;
    }
    get active () {
        return this._active;
    }    
    addTab({id, icon, active, normal}) {        
        let tab = document.createElement('div');
        let ic = document.createElement('i');        
        icon.split (/\s+/g).forEach (x => ic.classList.add(x));    
        ic.classList.add (id === this._active ? active : normal);
        tab.appendChild (ic);
        tab.setAttribute ('data-tab-id', id);
        tab.addEventListener ('click', this._toggle.bind(this, id));
        this._tabContainer.appendChild (tab);
        this._tabs.push({id, icon, active, normal});
        let pane = document.createElement('div');
        pane.setAttribute ('data-pane-id', id);
        pane.classList.add (this.visible && this.active === id ? 'shown' : 'hidden');
        this._paneContainer.appendChild (pane);
        return pane;
    }
    removeTab (id) {
        const tab = this._tabContainer.querySelector(`[data-tab-id=${id}]`);
        tab.removeEventListener('click', this._toggle.bind(this, id));
        this._tabContainer.removeChild(tab);

        const pane = this._paneContainer.querySelector(`[data-pane-id=${id}]`);
        this._paneContainer.removeChild(pane);

        for (let i = 0; i < this._tabs.length; ++i) {
            if (this._tabs[i].id === id) {
                this._tabs.splice(i, 1);
                break;
            }         
        }
    }    
    _toggle (current) {
        const tabs = this._tabContainer.children;
        const panes = this._paneContainer.children;
        if (this.active === current) {
            const show = !this.visible;            
            for (let i = 0; i < tabs.length; ++i) {
                const {id, active, normal} = this._tabs[i];
                let tab = tabs[i].querySelector('i');
                let pane = panes[i];
                if (show) {
                    if (id === current) {
                        tab.classList.remove (normal);
                        tab.classList.add (active);
                    }
                    else {                        
                        tab.classList.remove (active);
                        tab.classList.add (normal);
                    }
                    pane.classList.remove('hidden');
                    pane.classList.add('shown');
                }
                else {                    
                    tab.classList.remove (active);
                    tab.classList.add (normal);
                    pane.classList.remove('shown');
                    pane.classList.add('hidden');
                }
            }
            if (!show) {
                this._active = null;
            }
            this._visible = show;                    
        }
        else {                       
            for (let i = 0; i < tabs.length; ++i) {
                const {id, active, normal} = this._tabs[i];
                let tab = tabs[i].querySelector('i');
                let pane = panes[i];
                if (id === current) {
                    tab.classList.add (active);
                    tab.classList.remove (normal);                  
                    pane.classList.remove('hidden');
                    pane.classList.add('shown');
                }
                else { 
                    tab.classList.remove (active);
                    tab.classList.add (normal);
                    pane.classList.remove('shown');
                    pane.classList.add('hidden');
                }
            }
            this._active = current;
            this._visible = true;
        } 
        
        let event = document.createEvent('Event');
        event.detail = {active: current, visible: this.visible};
        event.initEvent('change', false, false);
        this.dispatchEvent(event);
    }
}

export default Sidebar;