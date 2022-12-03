/*

Dropdown polozka sa sklada z viacerych elementov.
Povinnymi elementmi su "main", "control" a "child".
Element typu "main" je obal/kontainer dropdown polozky.
Element typu "control" je napr. button, ktorym sa zobrazuje a skryva element typu "child".
Elementy sa priradzuju pomocou Vue JS direktivy pluginu v-dropdown="{ id : ..., type : 'main/control/child/offset' }".
Povinnymi parametrami direktivy su "id" a "type". Parameter "id" sluzi a previazanie jednotlivych elementov na danu dropdown polozku.
Nepovinny element typu "offset" sa musi DOM-e nachadzat ako rodic/prarodic/atd. vyssie od elementu typu "main" (t.j. "offset" musi byt na linii/strome niekde medzi "body" a "main").
Element "offset" je jediny, ktory moze mat parameter "id" nastaveny na cislo/retazec, ale aj na pole - potrebne v pripade ak ten isty offset element sluzi pre viacero dropdown poloziek.
Pre spravne fungovanie dropdown polozky element "offset" musi mat CSS vlastnost "position" nastavenu na "absolute" alebo "relative".
Element "child" moze mat nepovinny parameter "widthBy" s moznymi hodnotami "offset" alebo "body" t.j., ze sirka zobrazeneho "child" elementu nema byt standardne podla jeho obsahu, ale podla sirky "offset" elementu alebo podla sirky celeho body.
Element "child" moze mat este jeden z tychto dvoch nepovinnych parametrov "showDisplay" alebo "showClass". Standardne sa "child" element zobrazuje/skryva pomocou CSS "display: block/none".
Pomocou "showDisplay" je mozne zmenit hodnotu z "block" na nejaku inu podla potreby. Alebo "child" element je mozne zobrazovat/skryvat pridavanim a odoberanim CSS stylu uvedeneho v "showClass".

*/

'use strict';

var dropdowns = {};

// Jednoduche porovnanie objektov
function compareObjects(object1, object2) {
    if (!object1 || !object2)
        return false;

    var keys1 = Object.keys(object1),
        keys2 = Object.keys(object2);

    if (keys1.length != keys2.length)
        return false;

    var matchesCount = 0;
    for (var key of keys1) {
        if (object1[key] === object2[key])
            matchesCount++;
    }

    return (matchesCount == keys1.length) ? true : false;
}

// Pridanie elementu do dropdown polozky
function addElement(element, value, oldValue) {
    if (compareObjects(value, oldValue))
        return;

    var params = value;
    if (typeof params.id == 'undefined') {
        console.warn('Following dropdown element has no `id` param', params, element);
        return;
    }

    // Parameter "id" pre "offset" element bol zadany ako pole
    if (params.id instanceof Array && params.type == 'offset') {
        for (var id of params.id) {
            addElement(element, Object.assign({}, value, { id : id }), oldValue ? Object.assign({}, oldValue, { id : id }) : undefined);
        }
        return;
    }

    if (typeof params.id != 'number' && typeof params.id != 'string') {
        console.warn('Following dropdown element has invalid value type for `id` param (must be a number or string)', params, element);
        return;
    }

    if (typeof params.id == 'number' && params.id <= 0) {
        console.warn('Following dropdown element has invalid numberic value for `id` param (must be a number > 0)', params, element);
        return;
    }

    if (typeof params.id == 'string' && params.id.trim() == '') {
        console.warn('Following dropdown element has invalid string value for `id` param (must be a non-empty string)', params, element);
        return;
    }

    if (typeof params.type == 'undefined') {
        console.warn('Following dropdown element has no `type` param', params, element);
        return;
    }

    if (params.type != 'main' && params.type != 'control' && params.type != 'child' && params.type != 'offset') {
        console.warn('Following dropdown element has invalid value for `type` param (must be one of: main, control, child, offset)', params, element);
        return;
    }

    if (params.type == 'child' && typeof params.showDisplay != 'undefined' && typeof params.showClass != 'undefined') {
        console.warn('Following dropdown element has both params `showDisplay` and `showClass` (only one of them can be used)', params, element);
        return;
    }

    if (dropdowns[params.id] && dropdowns[params.id][params.type]) {
        dropdowns[params.id][params.type] = Object.assign({}, dropdowns[params.id][params.type], params);
        return;
    }

    if (!dropdowns[params.id])
        dropdowns[params.id] = {};

    if (!dropdowns[params.id][params.type])
        dropdowns[params.id][params.type] = {};

    var dropdownElement = Object.assign({}, params);

    // Pridanie vlastnosti pre "child" element
    if (params.type == 'child') {
        dropdownElement._justClicked = false;
        dropdownElement._childClickListener = null;
        dropdownElement._documentClickListener = null;
    }

    // Pridanie event listenera pre "control" element
    if (params.type == 'control') {
        var controlClickListener = () => {
            controlElementClick(params.id);
        };
        dropdownElement._controlClickListener = controlClickListener;
        element.addEventListener('click', controlClickListener, false);
    }

    dropdownElement._element = element;

    dropdowns[params.id][params.type] = dropdownElement;
}

// Odstranenie elementu z dropdown polozky
function removeElement(element, value) {
    var params = value;

    // Parameter "id" pre "offset" element bol zadany ako pole
    if (params.id instanceof Array && params.type == 'offset') {
        for (var id of params.id) {
            removeElement(element, Object.assign({}, value, { id : id }));
        }
        return;
    }

    // Element z neznemeho dovodu neexistuje
    if (!dropdowns[params.id] || !dropdowns[params.id][params.type])
        return;

    // Odstranenie event listenera pre "control" element
    if (params.type == 'control') {
        element.removeEventListener('click', dropdowns[params.id][params.type]._controlClickListener, false);
        dropdowns[params.id][params.type]._controlClickListener = null;
    }

    // Odstranenie event listenera pre "child" a "document" element
    if (params.type == 'child') {
        element.removeEventListener('click', dropdowns[params.id][params.type]._childClickListener, false);
        dropdowns[params.id][params.type]._childClickListener = null;

        document.removeEventListener('click', dropdowns[params.id][params.type]._documentClickListener, false);
        dropdowns[params.id][params.type]._documentClickListener = null;
    }

    // Zresetovanie referencii a odstranenie elementu z dropdown polozky
    dropdowns[params.id][params.type]._element = null;
    dropdowns[params.id][params.type] = null;
    delete dropdowns[params.id][params.type];

    // Odstranenie dropdown polozky ak jej nezostal ziadny element
    if (Object.keys(dropdowns[params.id]).length == 0) {
        dropdowns[params.id] = null;
        delete dropdowns[params.id];
    }
}

// Ziskanie hodnoty pre CSS vlastnost "display" pomocou, ktorej sa bude "child" element zobrazovat
function getChildShowDisplay(dropdownChild) {
    if (dropdownChild.showDisplay)
        return dropdownChild.showDisplay;
    else if (dropdownChild.showClass)
        return null;
    else
        return 'block';
}

// Ziskanie CSS stylu pomocou, ktoreho sa bude "child" element zobrazovat
function getChildShowClass(dropdownChild) {
    if (dropdownChild.showDisplay)
        return null;
    else if (dropdownChild.showClass)
        return dropdownChild.showClass;
    else
        return null;
}

// Skrytie "child" elementu bud nastavenim CSS vlastnosti "display" na "none" alebo odobratim CSS stylu
function hideChild(dropdownId) {
    if (!dropdownId || !dropdowns[dropdownId] || !dropdowns[dropdownId].child)
        return;

    var childShowDisplay = getChildShowDisplay(dropdowns[dropdownId].child),
        childShowClass = getChildShowClass(dropdowns[dropdownId].child);

    if (childShowDisplay)
        dropdowns[dropdownId].child._element.style.display = 'none';
    else if (childShowClass)
        dropdowns[dropdownId].child._element.classList.remove(childShowClass);
}

// Pomocna funkcia pre event listener pre kliknutie na "child" element
function childElementClick(dropdownId) {
    var dropdownItem = dropdowns[dropdownId];
    if (!dropdownItem) {
        console.warn('Dropdown with param `id` = `' + dropdownId + '` does not exist');
        return;
    }

    var dropdownChild = dropdownItem.child;
    if (!dropdownChild) {
        console.warn('Dropdown with param `id` = `' + dropdownId + '` does not have `child` element');
        return;
    }

    dropdownChild._justClicked = true;
}

// Pomocna funkcia pre event listener pre kliknutie na "document" element
function documentElementClick(dropdownId, offset) {
    var dropdownItem = dropdowns[dropdownId];
    if (!dropdownItem) {
        console.warn('Dropdown with param `id` = `' + dropdownId + '` does not exist');
        return;
    }

    var dropdownChild = dropdownItem.child;
    if (!dropdownChild) {
        console.warn('Dropdown with param `id` = `' + dropdownId + '` does not have `child` element');
        return;
    }

    var child = dropdownChild._element;

    if (!dropdownChild._justClicked) {
        // Skrytie "child" element
        hideChild(dropdownId);

        // Obnovenie povodnej vlastnosti "max-width" v inline style elementu "child" ak existuje
        if (child._dropdownOriginMaxWidth != null) {
            child.style.maxWidth = child._dropdownOriginMaxWidth;
            delete child._dropdownOriginMaxWidth;
        }
        else
            child.style.removeProperty('max-width');

        // Obnovenie povodnej vlastnosti "position" v inline style elementu "child" ak existuje
        if (child._dropdownOriginPosition != null) {
            child.style.position = child._dropdownOriginPosition;
            delete child._dropdownOriginPosition;
        }
        else
            child.style.removeProperty('position');

        // Obnovenie povodnej vlastnosti "bottom" v inline style elementu "child" ak existuje
        if (child._dropdownOriginBottom != null) {
            child.style.bottom = child._dropdownOriginBottom;
            delete child._dropdownOriginBottom;
        }
        else
            child.style.removeProperty('bottom');

        // Obnovenie povodnej vlastnosti "top" v inline style elementu "child" ak existuje
        if (child._dropdownOriginTop != null) {
            child.style.top = child._dropdownOriginTop;
            delete child._dropdownOriginTop;
        }
        else
            child.style.removeProperty('top');

        // Neobnovovat povodne "overflow" vlastnosti v inline style ak sme klikli z jedneho "control" elementu na iny "control"
        // element v ramci toho isteho "offset" elementu (t.j. offset._dropdownLastId a dropdownId nie su rovnake)
        if (offset._dropdownLastId == dropdownId) {
            // obnovit povodne vlastnosti v inline style ak boli odzalohovane
            if (offset._dropdownOriginOverflow != null) {
                offset.style.overflow = offset._dropdownOriginOverflow;
                delete offset._dropdownOriginOverflow;
            }
            else
                offset.style.removeProperty('overflow');

            if (offset._dropdownOriginOverflowX != null) {
                offset.style.overflowX = offset._dropdownOriginOverflowX;
                delete offset._dropdownOriginOverflowX;
            }
            else
                offset.style.removeProperty('overflow-x');

            if (offset._dropdownOriginOverflowY != null) {
                offset.style.overflowY = offset._dropdownOriginOverflowY;
                delete offset._dropdownOriginOverflowY;
            }
            else
                offset.style.removeProperty('overflow-y');
        }

        // Odstranenie event listenera pre "child" lement
        child.removeEventListener('click', dropdownChild._childClickListener, false);
        dropdownChild._childClickListener = null;

        // Odstranenie event listenera pre "document" element
        document.removeEventListener('click', dropdownChild._documentClickListener, false);
        dropdownChild._documentClickListener = null;
    }

    dropdownChild._justClicked = false;
}

// Pomocna funkcia pre event listener pre kliknutie na "control" element
function controlElementClick(dropdownId) {
    var dropdownItem = dropdowns[dropdownId];
    if (!dropdownItem) {
        console.warn('Dropdown with param `id` = `' + dropdownId + '` does not exist');
        return;
    }

    var dropdownMain = dropdownItem.main;
    if (!dropdownMain) {
        console.warn('Dropdown with param `id` = `' + dropdownId + '` does not have `main` element');
        return;
    }

    var dropdownChild = dropdownItem.child;
    if (!dropdownChild) {
        console.warn('Dropdown with param `id` = `' + dropdownId + '` does not have `child` element');
        return;
    }

    var main = dropdownMain._element,
        child = dropdownChild._element;

    var childShowDisplay = getChildShowDisplay(dropdownChild),
        childShowClass = getChildShowClass(dropdownChild);

    // "child" element uz zobrazeny je - nerobime nic
    if (childShowDisplay && child.style.display && child.style.display != 'none')
        return;
    else if (childShowClass && child.classList.contains(childShowClass))
        return;

    // Sirka "child" elementu je standardne zachovana a zarovnava sa vlavo/vpravo od hrany "control" elementu avsak
    // nasledujucimi nastaveniami je mozne zarovnavanie zrusit a sirku nastavit podla "offset" elementu alebo body
    var childWidthByOffset = null,
        childWidthByBody = null;

    if (dropdownChild.widthBy == 'offset')
        childWidthByOffset = true;
    else if (dropdownChild.widthBy == 'body')
        childWidthByBody = true;

    // "offset" element moze byt definovany manualne pomocou v-dropdown="{ id : ..., type : 'offset' }" alebo bude urceny automaticky cez offsetParent "main" elementu
    var offset = (dropdownItem.offset) ? dropdownItem.offset._element : main.offsetParent;

    // Skryt posledny pouzity "child" element daneho "offset" elementu ihned a necakat na documentElementClick()
    // pretoze ak mal dany "child" element nastavene widthBy : 'body', tak pri zobrazeni inej dropdown polozky
    // to ovplyvnuje offset.scrollWidth/scrollHeight, cim sa nespravne vyhodnoti offsetHasVisibleScrollbar ako true
    hideChild(offset._dropdownLastId);

    // Ak sirka "offset" elementu je mensia nez obsah, tak nabehne dole scrollbar a ten vieme detegovat porovnanim scrollHeight a offsetHeight,
    // v pripade offsetHasVisibleScrollbar = true znamena, ze sme vo fallback rezime zobrazenia "child" elementu cez position "fixed".
    var offsetHasVisibleScrollbar = (offset.scrollWidth != offset.clientWidth || offset.scrollHeight != offset.clientHeight) ? true : false;

    // Pozor na bug v suvislosti s vyskou fontu. Na bug ma vplyv hodnota line-height v CSS napr. `html, body { ..., line-height: 1.2, ... }`.
    // Pri danom bugu aj ked scoll bar neexistuje, tak hodnota scrollHeight a clientHeight nie je identicka, ale je rozdiel 1px.
    // Viac info o bugu: https://stackoverflow.com/questions/52815758/why-are-an-elements-scrollheight-and-clientheight-not-the-same-for-some-fonts
    var diffScrollHeightClientHeight = offset.scrollHeight - offset.clientHeight;
    if (diffScrollHeightClientHeight == 1)
        offsetHasVisibleScrollbar = false;

    // Odzalohovat povodne vlastnosti "max-width", "position", "bottom" a "top" v inline style "child" elementu
    if (child._dropdownOriginMaxWidth == null && child.style.maxWidth)
        child._dropdownOriginMaxWidth = child.style.maxWidth;
    if (child._dropdownOriginPosition == null && child.style.position)
        child._dropdownOriginPosition = child.style.position;
    if (child._dropdownOriginBottom == null && child.style.bottom)
        child._dropdownOriginBottom = child.style.bottom;
    if (child._dropdownOriginTop == null && child.style.top)
        child._dropdownOriginTop = child.style.top;

    // Odzalohovat povodne vlastnosti "overflow", "overflow-x" a "overflow-y" v inline style "offset" elementu
    if (offset._dropdownOriginOverflow == null && offset.style.overflow)
        offset._dropdownOriginOverflow = offset.style.overflow;
    if (offset._dropdownOriginOverflowX == null && offset.style.overflowX)
        offset._dropdownOriginOverflowX = offset.style.overflowX;
    if (offset._dropdownOriginOverflowY == null && offset.style.overflowY)
        offset._dropdownOriginOverflowY = offset.style.overflowY;

    // Zistit celkovy scrollLeft a scrollTop postupne od "offset" elementu az po html element
    var temp = offset, scrollLeftFromOffsetElementToHtmlElement = 0, scrollTopFromOffsetElementToHtmlElement = 0;
    while (temp.parentNode) {
        scrollLeftFromOffsetElementToHtmlElement += temp.scrollLeft;
        scrollTopFromOffsetElementToHtmlElement += temp.scrollTop;
        temp = temp.parentNode;
    }

    // Zistit celkovy offsetLeft a offsetTop postupne od "main" elementu az po posledny nadradeny element s relativnou alebo absolutnou poziciou
    var temp = main, offsetLeftFromMainElementToOffsetParentElement = 0, offsetTopFromMainElementToOffsetParentElement = 0;
    while (temp.offsetParent) {
        offsetLeftFromMainElementToOffsetParentElement += temp.offsetLeft;
        offsetTopFromMainElementToOffsetParentElement += temp.offsetTop;
        temp = temp.offsetParent;
    }

    // Zistit ciastkovy offsetLeft postupne od "main" elementu az po "offset" element (toto je nevyhnutne ak "offset" element bol urceny manualne pomocou v-dropdown="{ id : ..., type : 'offset' }"
    // a medzi takymto "offset" elementom a "main" elementom su dalsie elementy, ktore maju absolutnu alebo relativnu poziciu - teda v skutocnosti su taktiez offset elementmi)
    var temp = main, offsetLeftFromMainElementToOffsetElement = 0;
    while (temp.offsetParent) {
        if (offset == temp)
            break;
        offsetLeftFromMainElementToOffsetElement += temp.offsetLeft;
        temp = temp.offsetParent;
    }

    // Fallback rezim s position "fixed"
    if (offsetHasVisibleScrollbar) {
        // Kolko pixelov je dostupnych vpravo/vlavo/hore/dole od "main" elementu
        var available = {};
        available.right = document.body.clientWidth - offsetLeftFromMainElementToOffsetParentElement + scrollLeftFromOffsetElementToHtmlElement;
        available.left = main.clientWidth + offsetLeftFromMainElementToOffsetParentElement - scrollLeftFromOffsetElementToHtmlElement;
        available.top = offsetTopFromMainElementToOffsetParentElement - scrollTopFromOffsetElementToHtmlElement;
        available.bottom = window.innerHeight - main.clientHeight - available.top;
    }
    // Standardny rezim s position "absolute"
    else {
        // Kolko pixelov je dostupnych vpravo/vlavo/hore/dole od "main" elementu
        var available = {};
        available.right = offset.clientWidth - offsetLeftFromMainElementToOffsetElement;
        available.left = main.clientWidth + offsetLeftFromMainElementToOffsetElement;
        available.top = offsetTopFromMainElementToOffsetParentElement - scrollTopFromOffsetElementToHtmlElement;
        available.bottom = window.innerHeight - main.clientHeight - available.top;
    }

    // Potrebna zmena sirky "child" elementu
    if (childWidthByOffset)
        child.style.width = offset.clientWidth + 'px';
    else if (childWidthByBody)
        child.style.width = document.body.clientWidth + 'px';

    // Zobrazit "child" element
    if (childShowDisplay)
        child.style.display = childShowDisplay;
    else if (childShowClass)
        child.classList.add(childShowClass);

    // Sirka (bez marginu) a vyska (s marginom) "child" elementu
    var childWidth = child.offsetWidth;
    var childHeight = child.offsetHeight + parseInt(window.getComputedStyle(child).getPropertyValue('margin-top')) + parseInt(window.getComputedStyle(child).getPropertyValue('margin-bottom'));

    // Ak "offset" element nema scollbar (teda obsah sa zmestil), tak nastavenim overflow = 'visible' mu zrusime pripadne zbytocne nastavene scrollovanie,
    // ktore mohlo byt definovane cez "overflow", "overflow-x" alebo "overflow-y", pretoze inak by "child" element po zobrazeni mohol byt orezany resp. uplne neviditelny
    if (!offsetHasVisibleScrollbar)
        offset.style.overflow = 'visible';
    // Ak ma scrollbar, tak "overflow" elementu "offset" menit nemozeme, ale zmenime position "child" elementu na "fixed"
    else {
        child.style.position = 'fixed';
        // Pre elementy, ktore sirku nemaju urcenu (teda "auto"), pozicia "fixed" narozdiel od "absolute" sposobi rozdiel v tom, ze napr. slova
        // vety "child" elementu nebudu zalomene na viacerych riadkoch, ale budu na jednom dlhom riadku, a preto, aby sme zachovali rovnaky stav medzi
        // non-fallback a fallback rezimom zobrazenia "child" elementu, mu sirku obmedzime podla sirky, aku by mal v pripade pozicie "absolute"
        child.style.maxWidth = childWidth + 'px';
    }

    // Kolko pixelov by ostalo volnych vpravo/vlavo/hore/dole od "main" elementu ak by sme danym smerom zobrazili "child" element
    var rest = {};
    rest.right = available.right - childWidth;
    rest.left = available.left - childWidth;
    rest.top = available.top - childHeight;
    rest.bottom = available.bottom - childHeight;

    // Fallback rezim s position "fixed"
    if (offsetHasVisibleScrollbar) {
        // Zistit celkovy offsetLeft postupne od "offset" elementu az po posledny nadradeny element s relativnou alebo absolutnou poziciou
        var temp = offset, offsetLeftFromOffsetElement = 0;
        while (temp.offsetParent) {
            offsetLeftFromOffsetElement += temp.offsetLeft;
            temp = temp.offsetParent;
        }
        // Sirka "child" elementu je na celu sirku "offset" elementu (zuzovanie a zarovnavanie vlavo/vpravo od hrany "control" elementu sa neaplikuje)
        if (childWidthByOffset) {
            child.style.removeProperty('right');
            child.style.left = offsetLeftFromOffsetElement + 'px';
        }
        // Sirka "child" elementu je na celu sirku body elementu (zuzovanie a zarovnavanie vlavo/vpravo od hrany "control" elementu sa neaplikuje)
        else if (childWidthByBody) {
            child.style.removeProperty('right');
            child.style.left = '0px';
        }
        // Sirka "child" elementu je standardne zachovana (zuzovanie a zarovnavanie vlavo/vpravo od hrany "control" elementu sa aplikuje)
        else {
            // "child" element sa nezmesti vpravo pri uvazovani jeho povodnej sirky
            if (rest.right < 0) {
                // "child" element sa zmesti vlavo pri uvazovani jeho povodnej sirky
                if (rest.left >= 0) {
                    child.style.removeProperty('left');
                    child.style.right = (available.right - main.offsetWidth) + 'px';
                }
                // "child" element sa zmesti vlavo pri uvazovani jeho zmensenej sirky
                else if (rest.left > rest.right) {
                    child.style.maxWidth = available.left + 'px';
                    child.style.removeProperty('left');
                    child.style.right = (available.right - main.offsetWidth) + 'px';
                }
                // "child" element sa zmesti vpravo pri uvazovani jeho zmensenej sirky
                else {
                    child.style.maxWidth = available.right + 'px';
                    child.style.removeProperty('right');
                    child.style.left = (available.left - main.offsetWidth) + 'px';
                }
            }
            // "child" element sa zmesti vpravo pri uvazovani jeho povodnej sirky
            else {
                child.style.removeProperty('right');
                child.style.left = (available.left - main.offsetWidth) + 'px';
            }
        }
        // "child" element sa nezmesti dole
        if (rest.bottom < 0 && rest.bottom < rest.top) {
            child.style.removeProperty('bottom');
            child.style.top = rest.top + 'px';
        }
        else {
            child.style.removeProperty('top');
            child.style.bottom = rest.bottom + 'px';
        }
    }

    // Standardny rezim s position "absolute"
    else {
        // Sirka "child" elementu je na celu sirku "offset" elementu (zuzovanie a zarovnavanie vlavo/vpravo od hrany "control" elementu sa neaplikuje)
        if (childWidthByOffset) {
            child.style.removeProperty('right');
            child.style.left = rest.right + 'px';
        }
        // Sirka "child" elementu je na celu sirku body elementu (zuzovanie a zarovnavanie vlavo/vpravo od hrany "control" elementu sa neaplikuje)
        else if (childWidthByBody) {
            child.style.removeProperty('right');
            child.style.left = (offsetLeftFromMainElementToOffsetParentElement * -1) + 'px';
        }
        // Sirka "child" elementu je standardne zachovana (zuzovanie a zarovnavanie vlavo/vpravo od hrany "control" elementu sa aplikuje)
        else {
            // "child" element sa nezmesti vpravo pri uvazovani jeho povodnej sirky
            if (rest.right < 0) {
                // "child" element sa zmesti vlavo pri uvazovani jeho povodnej sirky
                if (rest.left >= 0) {
                    child.style.removeProperty('left');
                    child.style.right = '0px';
                }
                // "child" element sa zmesti vlavo pri uvazovani jeho zmensenej sirky
                else if (rest.left > rest.right) {
                    child.style.removeProperty('left');
                    child.style.right = '0px';
                    child.style.maxWidth = (main.offsetLeft + main.clientWidth) + 'px';
                }
                // "child" element sa zmesti vpravo pri uvazovani jeho zmensenej sirky
                else
                    child.style.maxWidth = (offset.clientWidth - main.offsetLeft) + 'px';
            }
        }
        // "child" element sa nezmesti dole
        if (rest.bottom < 0 && rest.bottom < rest.top)
            child.style.top = (childHeight * -1) + 'px';
        // Obnovit top position na standardnu
        else if (child.style.top)
            child.style.top = 'auto';
    }

    // Zapamatat si v danom "offset" elemente ID poslednej dropdown polozky, ktora bola naposledy pouzita
    offset._dropdownLastId = dropdownId;

    // Nastavit event listeners pre kliknutie na "child" a na "document" element (zabezpeci sa skrytie "child" elementu)
    setTimeout(() => {
        // Nastavenie event listenera pre "child" element
        var childClickListener = () => {
            childElementClick(dropdownId);
        };
        dropdownChild._childClickListener = childClickListener;
        child.addEventListener('click', childClickListener, false);

        // Nastavenie event listenera pre "document" element
        var documentClickListener = () => {
            documentElementClick(dropdownId, offset);
        };
        dropdownChild._documentClickListener = documentClickListener;
        document.addEventListener('click', documentClickListener, false);
    }, 10);
}


// Export ako Vue JS plugin s direktivou v-dropdown
// Porovnanie hookov pe direktivu medzi Vue 2.x a Vue 3.x: https://v3-migration.vuejs.org/breaking-changes/custom-directives.html
module.exports = {
    install : (app, options) => {

        app.directive('dropdown', {
            // Pre Vue 2.x
            inserted : (element, binding) => {
                addElement(element, binding.value, binding.oldValue);
            },

            // Pre Vue 3.x
            mounted : (element, binding) => {
                addElement(element, binding.value, binding.oldValue);
            },

            // Pre Vue 2.x
            update : (element, binding) => {
                addElement(element, binding.value, binding.oldValue);
            },

            // Pre Vue 3.x
            updated : (element, binding) => {
                addElement(element, binding.value, binding.oldValue);
            },

            // Pre Vue 2.x
            unbind : (element, binding) => {
                removeElement(element, binding.value);
            },

            // Pre Vue 3.x
            unmounted : (element, binding) => {
                removeElement(element, binding.value);
            },
        });

    }
};
