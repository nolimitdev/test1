'use strict';

// Nazov CSS stylu, ktory bude pridany rodicovi ak input ma focus alebo ma neprazdnu hodnotu
var className = '€fc_input--filled';

// Overenie, ci je retazec prazdny
function isEmpty(value) {
    return (value.trim() === '') ? true : false;
}

// Pridanie elementu s vue direktivou v-labeled
function addElement(element) {
    if (element.tagName != 'INPUT') {
        console.warn('Following element with `v-labeled` directive is not INPUT element', element);
        return;
    }

    if (element.type != 'text' && element.type != 'password') {
        console.warn('Following INPUT element with `v-labeled` directive is not TEXT or PASSWORD type', element);
        return;
    }

    if (element._changeValueCallback)
        return;

    element.addEventListener('focus', focusListener);
    element.addEventListener('blur', blurListener);

    if (isEmpty(element.value))
        element.parentNode.classList.remove(className);
    else
        element.parentNode.classList.add(className);

    elementValueChangeCallbackAdd(element, () => {
        if (isEmpty(element.value))
            element.parentNode.classList.remove(className);
        else
            element.parentNode.classList.add(className);
    });
}

// Odstranenie elementu s vue direktivou v-labeled
function removeElement(element) {
    element.removeEventListener('focus', focusListener);
    element.removeEventListener('blur', blurListener);

    elementValueChangeCallbackRemove(element);
}

// Event listener pre focus
function focusListener(event) {
    event.target.parentNode.classList.add(className);
}

// Event listener pre blur
function blurListener(event) {
    if (isEmpty(event.target.value))
        event.target.parentNode.classList.remove(className);
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

// Export ako Vue JS plugin s direktivou v-labeled
// Porovnanie hookov pe direktivu medzi Vue 2.x a Vue 3.x: https://v3-migration.vuejs.org/breaking-changes/custom-directives.html
module.exports = {
    install : (app, options) => {

        app.directive('labeled', {
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
