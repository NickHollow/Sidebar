Sidebar
=======
Боковая панель с вкладками

# Конструктор
```javascript
new Sidebar (container);
```
Параметр | Тип | Описание
---------|-----|---------
container |`<HtmlElement>`| Контейнер для боковой панели

# Свойства
Свойство | Тип | Чтение | Запись | Описание
---------|-----|--------|--------|---------
selected | `<String>` | Да | Да | Идентификатор открытой вкладки.<br/>Установка открывает вкладку с указанным идентификатором.<br/>Если присвоить значение `null`, вкладка закрывается.
visible | `<Boolean>` | Да | Да | Видимость выбранной вкладки.

# Методы
## addTab (id) - Добавляет новую вкладку
Параметр | Тип | Описание
---------|-----|---------
id |`<String>`| Идентификатор создаваемой вкладки

### Возвращаемое значение:
Тип | Описание
----|---------
`<HtmlElement>` | DOM-элемент панели вкладки.

## removeTab (id) - Удаляет вкладку.
Параметр | Тип | Описание
---------|-----|---------
id |`<String>`| Идентификатор удаляемой вкладки

## enable (id) - Делает вкладку активной.
Параметр | Тип | Описание
---------|-----|---------
id |`<String>`| Идентификатор вкладки

## disable (id) - Делает вкладку неактивной.
Параметр | Тип | Описание
---------|-----|---------
id |`<String>`| Идентификатор вкладки

## enabled (id) - Проверяет активна или нет вкладка.
Параметр | Тип | Описание
---------|-----|---------
id |`<String>`| Идентификатор вкладки

### Возвращаемое значение:
Тип | Описание
----|---------
`<Boolean>` | Признак, показывающий, активна ли вкладка.

# События
Событие | Тип | Описание
--------|-----|---------
change:visible | `<Event>` | Изменение видимости вкладки.
change:selected | `<Event>` | Изменение выбранной вкладки.

# Пример:
```javascript
let sidebar = new Sidebar (document.getElementById('sidebar'));
sidebar.addTab('terra').innerHTML = <span>Terra</span>;
sidebar.addTab('aqua').innerHTML = <span>Aqua</span>;
sidebar.addTab('aura').innerHTML = <span>Aura</span>;
sidebar.on ('change:selected', e => console.log(e));
```