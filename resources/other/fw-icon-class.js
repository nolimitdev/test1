export default {
    get(iconName) {
        var icons = {
            'icon-check-circle' : '€icon-check_circle',
            'icon-cross' : '€icon-cross',
            'icon-drag-indicator' : '€icon-drag_indicator',
            'icon-keyboard-arrow-left' : '€icon-keyboard_arrow_left',
            'icon-keyboard-arrow-right' : '€icon-keyboard_arrow_right',
            'icon-keyboard-arrow-down' : '€icon-keyboard_arrow_down',
            'icon-google' : '€icon-google',
            'icon-facebook' : '€icon-facebook',
            'icon-select-all' : '€icon-select_all',
            'icon-warning' : '€icon-warning',
            'icon-user' : '€icon-user',
            'icon-plus' : '€icon-plus',
            'icon-minus' : '€icon-minus'
        };

        var iconClass = icons[iconName];

        if (iconClass)
            return iconClass;
        else {
            console.warn('Unknown icon `' + iconName + '`');
            return '€icon-(!unknown-icon!)';
        }
    }
}
