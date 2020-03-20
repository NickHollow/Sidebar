import './Sidebar.css';
import EventTarget from 'scanex-event-target';

class Sidebar extends EventTarget {
    constructor(container) {
        super();
        this._tabs = {};
        this._panels = {};
        this._container = container;
        this._render(this._container);
        this.visible = false;
    }
    _onTabClick(id, e) {
        e.stopPropagation();
        if (this.selected === id) {
            this.visible = !this.visible;
        }
        else {
            this.selected = id;
        }        
    }
    addTab(id) {
        let tab = document.createElement('div');
        tab.classList.add('tab');
        tab.classList.add('noselect');
        tab.classList.add('scanex-sidebar-icon');
        tab.classList.add(id);
        tab.addEventListener('click', this._onTabClick.bind(this, id));
        this._tabsContainer.appendChild(tab);
        this._tabs[id] = tab;

        let panel = document.createElement('div');
        panel.classList.add('panel');
        panel.classList.add(id);
        panel.classList.add('hidden');
        this._panelsContainer.appendChild(panel);
        this._panels[id] = panel;
        
        if(!this.selected) {
            this.selected = id;
            this.visible = false;
        }
        return panel;
    }
    removeTab(id) {
    }
    get visible () {
        return this._visible;
    }
    set visible (visible) {
        Object.keys(this._tabs).forEach(id => {
            if (visible && id === this.selected) {
                this._panels[id].classList.remove('hidden');
            }
            else {
                this._panels[id].classList.add('hidden');
            }            
        });
        this._visible = visible;
        let event = document.createEvent('Event');
        event.initEvent('change:visible', false, false);
        this.dispatchEvent(event);
    }
    get selected () {
        return this._selected;
    }
    set selected (selected) {
        if (this.selected !== selected) {
            Object.keys(this._tabs).forEach(id => {
                if (id === selected) {
                    this._tabs[id].classList.add('selected');
                }
                else {
                    this._tabs[id].classList.remove('selected');
                }            
            }); 
            this._selected = selected;
            this.visible = true;
            let event = document.createEvent('Event');
            event.initEvent('change:selected', false, false);
            this.dispatchEvent(event);
        }
    }
    _render(container) {
        this._element = document.createElement('div');
        this._element.classList.add('scanex-sidebar');

        this._tabsContainer = document.createElement('div');
        this._tabsContainer.classList.add('tabs');
        this._element.appendChild(this._tabsContainer);

        this._panelsContainer = document.createElement('div');
        this._panelsContainer.classList.add('panels');
        this._element.appendChild(this._panelsContainer);

        container.appendChild(this._element);
    }
}

export default Sidebar;