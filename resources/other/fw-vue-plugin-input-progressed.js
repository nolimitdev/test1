'use strict';

// Ziskanie nahodneho cisla
function getRandomNumber() {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}

// Vypocet pomeru progressbaru pre input[type=range]
function calculateProgressRatio(element) {
    var min = element.min || 0,
        max = element.max || 100,
        range = max - min,
        value = parseInt(element.value) || 0,
        ratio = (value - min) / range;

    return ratio;
}

// Pridanie style elementu s background-size podla pomeru progressbaru
function appendStyleElement(element, className) {
    var styleElement = document.createElement('style'),
        progressRatio = calculateProgressRatio(element);

    styleElement.id = className;

    styleElement.textContent = '' +
        '.' + className + '::-webkit-slider-runnable-track { background-size: calc(' + progressRatio + ' * 100%) !important; }\n' +
        '.' + className + '::-moz-range-track { background-size: calc(' + progressRatio + ' * 100%) !important; }';

    document.head.appendChild(styleElement);
}

// Aktualizacia style elementu s background-size podla pomeru progressbaru
function updateStyleElement(element) {
    var styleElement = document.getElementById(element._rangeId);
    styleElement.textContent = styleElement.textContent.replace(/calc\([^ ]+/g, 'calc(' + calculateProgressRatio(element));
}

// Pridanie elementu s vue direktivou v-progressed
function addElement(element) {
    if (element.tagName != 'INPUT') {
        console.warn('Following element with `v-progressed` directive is not INPUT element', element);
        return;
    }

    if (element.type != 'range') {
        console.warn('Following INPUT element with `v-progressed` directive is not RANGE type', element);
        return;
    }

    if (element._changeValueCallback)
        return;

    var className = '€rangeId' + getRandomNumber();

    element._rangeId = className;

    element.classList.add(className);

    appendStyleElement(element, className);

    element.addEventListener('input', inputListener);

    elementValueChangeCallbackAdd(element, () => {
        updateStyleElement(element);
    });
}

// Odstranenie elementu s vue direktivou v-progressed
function removeElement(element) {
    var styleElement = document.getElementById(element._rangeId);
    styleElement.parentNode.removeChild(styleElement);

    element.removeEventListener('input', inputListener);

    elementValueChangeCallbackRemove(element);
}

// Event listener pre input
function inputListener(event) {
    updateStyleElement(event.target);
}

// Pridanie callbacku pre zmenu hodnoty inputu
function elementValueChangeCallbackAdd(element, callback) {
    var property = 'value',
        elementPrototype = Object.getPrototypeOf(element);

    if (!elementPrototype.hasOwnProperty(property))
        return;

    element._changeValueCallback = callback;

    var descriptor = Object.getOwnPropertyDescriptor(elementPrototype, property);

    Object.defineProperty(element, property, {
        get : function () {
            return descriptor.get.apply(this, arguments);
        },

        set : function () {
            var value = descriptor.set.apply(this, arguments);

            if (element._changeValueCallback)
                element._changeValueCallback();

            return value;
        }
    });
}

// Odstranenie callbacku pre zmenu hodnoty inputu
function elementValueChangeCallbackRemove(element) {
    element._changeValueCallback = null;
}

// Export ako Vue JS plugin s direktivou v-progressed
// Porovnanie hookov pe direktivu medzi Vue 2.x a Vue 3.x: https://v3-migration.vuejs.org/breaking-changes/custom-directives.html
module.exports = {
    install : (app, options) => {

        app.directive('progressed', {
            // Pre Vue 2.x
            inserted : (element, binding) => {
                addElement(element);
            },

            // Pre Vue 3.x
            mounted : (element, binding) => {
                addElement(element);
            },

            // Pre Vue 2.x
            update : (element, binding) => {
                addElement(element);
            },

            // Pre Vue 3.x
            updated : (element, binding) => {
                addElement(element);
            },

            // Pre Vue 2.x
            unbind : (element, binding) => {
                removeElement(element);
            },

            // Pre Vue 3.x
            unmounted : (element, binding) => {
                removeElement(element);
            },
        });

    }
};
