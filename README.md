Sidebar
=======
Боковая панель с вкладками

# Конструктор
```javascript
new Sidebar (container, options);
```
Параметр | Тип | Описание
---------|-----|---------
container |`<HtmlElement>`| Контейнер для боковой панели
options |`<SidebarOptions>`| Параметры инициализации боковой панели

### `<SidebarOptions>`
Свойство | Тип | По умолчанию | Возможные значения | Описание
---------|-----|-----------------------|--------------------|---------
position | `<String>` | left | left \| right | Уникальный идентификатор вкладки.

# Свойства
Свойство | Тип | Чтение | Запись | Описание
---------|-----|--------|--------|---------
active | `<String>` | Да | Да | Идентификатор активной вкладки.<br/>Установка открывает вкладку с указанным идентификатором.<br/>Если присвоить значение `null`, вкладка закрывается.

# Методы
## addTab (options) - Добавляет новую вкладку
Параметр | Тип | Описание
---------|-----|---------
options |`<TabOptions>`| Параметры создаваемой вкладки

### `<TabOptions>`
Свойство | Тип | Описание
---------|-----|---------
id | `<String>` | Уникальный идентификатор вкладки.
icon | `<String>` | CSS-класс иконки вкладки.
active | `<String>` | CSS-класс иконки активной вкладки.
normal | `<String>` | CSS-класс иконки неактивной вкладки.

### Возвращаемое значение:
Тип | Описание
----|---------
`<HtmlElement>` | DOM-элемент панели вкладки.

## removeTab (id) - Удаляет вкладку.
Параметр | Тип | Описание
---------|-----|---------
id |`<String>`| Идентификатор удаляемой вкладки

# События
Событие | Тип | Описание
--------|-----|---------
change | `<Event>` | Изменение состояния вкладок (открытие / закрытие).

### `<Event>`
Свойство | Тип | Описание
---------|-----|---------
detail | `<SidebarСhangeEvent>` | Параметры события

### `<SidebarСhangeEvent>`
Свойство | Тип | Описание
---------|-----|---------
active | `<String>` | Идентификатор активной вкладки

# Пример:
```javascript
let sidebar = new Sidebar (document.getElementById('sidebar'), {position: 'left'});
sidebar.addTab({id: 'terra', icon: 'icon terra', active: 'active', normal: 'normal'}).innerHTML = <span>Terra</span>;
sidebar.addTab({id: 'aqua', icon: 'icon aqua', active: 'active', normal: 'normal'}).innerHTML = <span>Aqua</span>;
sidebar.addTab({id: 'aura', icon: 'icon aura', active: 'active', normal: 'normal'}).innerHTML = <span>Aura</span>;
sidebar.on ('change', e => console.log(e));
```