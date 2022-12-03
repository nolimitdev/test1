<template>
    <a v-if="type == 'text'" v-bind:class="[buttonClassType, buttonClassColor]" v-bind:href="anchorHref" v-bind:target="anchorTarget"><input v-if="showInputFile" v-bind:name="file" type="file">{{ text }}</a>
    <button v-else v-bind:class="[buttonClassType, buttonClassColor, buttonClassSize, buttonClassIcon, buttonClassDraggable, buttonClassDropDown, buttonClassTransparent, buttonClassUnderlined, buttonClassRounded, buttonClassNoRadius, buttonClassNoShadow, '€fc_waves-effect']">
        <i v-if="showIcon" v-bind:class="iconClass"></i>
        <input v-if="showInputFile" v-bind:name="file" type="file">
        <div v-if="showLoader" class="€fc_circleLoader--xs">
            <div class="€fc_circleLoader"></div>
        </div>
        <div v-if="showTag" class="€fc_tagItem">
            <div class="€fc_tagText">{{ buttonTextTag }}</div>
            <a href="javascript:void(0)" class="€fc_tagClose"><i v-bind:class="getIconClass('icon-cross')"></i></a>
        </div>
        <div v-if="showNotification" class="€fc_notificationCount" v-bind:class="getNotificationClassColor()">
            <p>{{ notification.number }}</p>
        </div>
        {{ buttonTextOther }}
    </button>
</template>

<script>
    import IconClass from '../../other/fw-icon-class.js';

    export default {
        props : {
            type : {
                type : String,
                required : true,
            },
            color : {
                type : String,
                required : false,
            },
            text : {
                type : String,
                required : false,
            },
            size : {
                type : String,
                required : false,
            },
            icon : {
                type : String,
                required : false,
            },
            file : {
                type : String,
                required : false,
            },
            href : {
                type : String,
                required : false,
            },
            target : {
                type : String,
                required : false,
            },
            notification : {
                type : Object,
                required : false,
                validator(notification) {
                    return (notification.number && typeof notification.number == 'number' && notification.color && typeof notification.color == 'string') ? true : false;
                },
            },
            draggable : {
                type : Boolean,
                required : false,
            },
            dropdown : {
                type : Boolean,
                required : false,
            },
            loader : {
                type : Boolean,
                required : false,
            },
            rounded : {
                type : Boolean,
                required : false,
            },
            transparent : {
                type : Boolean,
                required : false,
            },
            underlined : {
                type : Boolean,
                required : false,
            },
            noRadius : {
                type : Boolean,
                required : false,
            },
            noShadow : {
                type : Boolean,
                required : false,
            },
        },

        computed : {
            anchorHref() {
                return (this.href) ? this.href : 'javascript:void(0)';
            },

            anchorTarget() {
                return (this.target) ? this.target : null;
            },

            buttonTextTag() {
                return (this.type == 'tag') ? this.text : null;
            },

            buttonTextOther() {
                return (this.type != 'tag') ? this.text : null;
            },

            buttonClassType() {
                if (this.type == 'raised')
                    return '€fc_btnRaised';
                else if (this.type == 'flated')
                    return '€fc_btnFlat';
                else if (this.type == 'flated-bordered')
                    return '€fc_btnFlatBd';
                else if (this.type == 'slim')
                    return '€fc_btnSlim';
                else if (this.type == 'slim-bordered')
                    return '€fc_btnSlimBd';
                else if (this.type == 'text')
                    return '€fc_btnAsText';
                else if (this.type == 'tag')
                    return '€fc_btnTag';
                else {
                    console.warn('Unknown button type `' + this.type + '`');
                    return '€fc_btn(!unknown-type!)';
                }
            },

            buttonClassColor() {
                if (!this.color)
                    return null;
                else if (this.type == 'raised')
                    return this.getButtonClassColorForTypeRaised();
                else if (this.type == 'flated')
                    return this.getButtonClassColorForTypeFlated();
                else if (this.type == 'flated-bordered')
                    return this.getButtonClassColorForTypeFlatedBordered();
                else if (this.type == 'slim')
                    return this.getButtonClassColorForTypeSlim();
                else if (this.type == 'slim-bordered')
                    return this.getButtonClassColorForTypeSlimBordered();
                else if (this.type == 'text')
                    return this.getButtonClassColorForTypeText();
                else if (this.type == 'tag')
                    return this.getButtonClassColorForTypeTag();
                else
                    return null;
            },

            buttonClassSize() {
                if (!this.size)
                    return null;
                else if (this.size == 'xs')
                    return '€fc_btnSize--xs';
                else if (this.size == 'sm')
                    return '€fc_btnSize--sm';
                else if (this.size == 'md')
                    return '€fc_btnSize--md';
                else if (this.size == 'lg')
                    return '€fc_btnSize--lg';
                else {
                    console.warn('Unknown button size `' + this.size + '`');
                    return '€fc_btnSize(!unknown-size!)';
                }
            },

            buttonClassIcon() {
                if (!this.icon)
                    return null;
                else if (this.text)
                    return '€fc_btn--icon';
                else
                    return '€fc_btn--iconOnly';
            },

            buttonClassDraggable() {
                return (this.draggable) ? '€fc_btnDrag €fh_noBgHover' : null;
            },

            buttonClassDropDown() {
                return (this.dropdown) ? '€fc_btnDropDown' : null;
            },

            buttonClassTransparent() {
                return (this.transparent) ? '€fc_btn--transparent' : null;
            },

            buttonClassUnderlined() {
                return (this.underlined) ? '€fc_btn--underline' : null;
            },

            buttonClassRounded() {
                return (this.rounded) ? '€fc_btn--rounded' : null;
            },

            buttonClassNoRadius() {
                return (this.noRadius) ? '€fc_btn--noRadius' : null;
            },

            buttonClassNoShadow() {
                return (this.noShadow) ? '€fc_btn--noShadow' : null;
            },

            iconClass() {
                return (this.icon) ? this.getIconClass(this.icon) : null;
            },

            showIcon() {
                return (this.icon) ? true : false;
            },

            showInputFile() {
                return (this.file) ? true : false;
            },

            showLoader() {
                return (this.loader) ? true : false;
            },

            showTag() {
                return (this.type == 'tag') ? true : false;
            },

            showNotification() {
                return (this.notification) ? true : false;
            },
        },

        methods : {
            getIconClass(iconName) {
                return IconClass.get(iconName);
            },

            getNotificationClassColor() {
                if (this.notification.color == 'color1')
                    return '€fc_notificationCount--color1';
                else if (this.notification.color == 'color2')
                    return '€fc_notificationCount--color2';
                else if (this.notification.color == 'color3')
                    return '€fc_notificationCount--color3';
                else {
                    console.warn('Unknown button notification color `' + this.notification.color + '`');
                    return '€fc_notificationCount--(!unknown-color!)';
                }
            },

            getButtonClassColorForTypeRaised() {
                if (this.color == 'success')
                    return '€fc_btnRaised--success';
                else if (this.color == 'error')
                    return '€fc_btnRaised--error';
                else if (this.color == 'warning')
                    return '€fc_btnRaised--warning';
                else if (this.color == 'primary')
                    return '€fc_btnRaised--primary';
                else if (this.color == 'ghost')
                    return '€fc_btnRaised--ghost';
                else if (this.color == 'disabled')
                    return '€fc_btnRaised--disabled';
                else {
                    console.warn('Unknown button color `' + this.color + '`');
                    return '€fc_btnRaised--(!unknown-color!)';
                }
            },

            getButtonClassColorForTypeFlated() {
                if (this.color == 'success')
                    return '€fc_btnFlat--success';
                else if (this.color == 'error')
                    return '€fc_btnFlat--error';
                else if (this.color == 'warning')
                    return '€fc_btnFlat--warning';
                else if (this.color == 'primary')
                    return '€fc_btnFlat--primary';
                else if (this.color == 'ghost')
                    return '€fc_btnFlat--ghost';
                else if (this.color == 'disabled')
                    return '€fc_btnFlat--disabled';
                else {
                    console.warn('Unknown button color `' + this.color + '`');
                    return '€fc_btnFlat--(!unknown-color!)';
                }
            },

            getButtonClassColorForTypeFlatedBordered() {
                if (this.color == 'success')
                    return '€fc_btnFlatBd--success';
                else if (this.color == 'error')
                    return '€fc_btnFlatBd--error';
                else if (this.color == 'warning')
                    return '€fc_btnFlatBd--warning';
                else if (this.color == 'primary')
                    return '€fc_btnFlatBd--primary';
                else if (this.color == 'ghost')
                    return '€fc_btnFlatBd--ghost';
                else if (this.color == 'disabled')
                    return '€fc_btnFlatBd--disabled';
                else {
                    console.warn('Unknown button color `' + this.color + '`');
                    return '€fc_btnFlatBd--(!unknown-color!)';
                }
            },

            getButtonClassColorForTypeSlim() {
                if (this.color == 'success')
                    return '€fc_btnSlim--success';
                else if (this.color == 'error')
                    return '€fc_btnSlim--error';
                else if (this.color == 'warning')
                    return '€fc_btnSlim--warning';
                else if (this.color == 'primary')
                    return '€fc_btnSlim--primary';
                else if (this.color == 'ghost')
                    return '€fc_btnSlim--ghost';
                else if (this.color == 'disabled')
                    return '€fc_btnSlim--disabled';
                else {
                    console.warn('Unknown button color `' + this.color + '`');
                    return '€fc_btnSlim--(!unknown-color!)';
                }
            },

            getButtonClassColorForTypeSlimBordered() {
                if (this.color == 'success')
                    return '€fc_btnSlimBd--success';
                else if (this.color == 'error')
                    return '€fc_btnSlimBd--error';
                else if (this.color == 'warning')
                    return '€fc_btnSlimBd--warning';
                else if (this.color == 'primary')
                    return '€fc_btnSlimBd--primary';
                else if (this.color == 'ghost')
                    return '€fc_btnSlimBd--ghost';
                else if (this.color == 'disabled')
                    return '€fc_btnSlimBd--disabled';
                else {
                    console.warn('Unknown button color `' + this.color + '`');
                    return '€fc_btnSlimBd--(!unknown-color!)';
                }
            },

            getButtonClassColorForTypeText() {
                if (this.color == 'success')
                    return '€fc_btnAsText--success';
                else if (this.color == 'error')
                    return '€fc_btnAsText--error';
                else if (this.color == 'warning')
                    return '€fc_btnAsText--warning';
                else if (this.color == 'primary')
                    return '€fc_btnAsText--primary';
                else if (this.color == 'ghost')
                    return '€fc_btnAsText--ghost';
                else if (this.color == 'disabled')
                    return '€fc_btnAsText--disabled';
                else {
                    console.warn('Unknown button color `' + this.color + '`');
                    return '€fc_btnAsText--(!unknown-color!)';
                }
            },

            getButtonClassColorForTypeTag() {
                if (this.color == 'palette10')
                    return '€fc_color10';
                else if (this.color == 'palette20')
                    return '€fc_color20';
                else if (this.color == 'palette30')
                    return '€fc_color30';
                else if (this.color == 'palette40')
                    return '€fc_color40';
                else if (this.color == 'palette50')
                    return '€fc_color50';
                else if (this.color == 'palette60')
                    return '€fc_color60';
                else if (this.color == 'palette70')
                    return '€fc_color70';
                else if (this.color == 'palette80')
                    return '€fc_color80';
                else if (this.color == 'palette90')
                    return '€fc_color90';
                else if (this.color == 'palette100')
                    return '€fc_color100';
                else if (this.color == 'palette110')
                    return '€fc_color110';
                else if (this.color == 'palette120')
                    return '€fc_color120';
                else if (this.color == 'palette130')
                    return '€fc_color130';
                else if (this.color == 'palette140')
                    return '€fc_color140';
                else if (this.color == 'palette150')
                    return '€fc_color150';
                else if (this.color == 'palette160')
                    return '€fc_color160';
                else if (this.color == 'palette170')
                    return '€fc_color170';
                else if (this.color == 'palette180')
                    return '€fc_color180';
                else if (this.color == 'palette190')
                    return '€fc_color190';
                else if (this.color == 'paletteOutline10')
                    return '€fc_colorOut10';
                else if (this.color == 'paletteOutline20')
                    return '€fc_colorOut20';
                else if (this.color == 'paletteOutline30')
                    return '€fc_colorOut30';
                else if (this.color == 'paletteOutline40')
                    return '€fc_colorOut40';
                else if (this.color == 'paletteOutline50')
                    return '€fc_colorOut50';
                else if (this.color == 'paletteOutline60')
                    return '€fc_colorOut60';
                else if (this.color == 'paletteOutline70')
                    return '€fc_colorOut70';
                else if (this.color == 'paletteOutline80')
                    return '€fc_colorOut80';
                else if (this.color == 'paletteOutline90')
                    return '€fc_colorOut90';
                else if (this.color == 'paletteOutline100')
                    return '€fc_colorOut100';
                else if (this.color == 'paletteOutline110')
                    return '€fc_colorOut110';
                else if (this.color == 'paletteOutline120')
                    return '€fc_colorOut120';
                else if (this.color == 'paletteOutline130')
                    return '€fc_colorOut130';
                else if (this.color == 'paletteOutline140')
                    return '€fc_colorOut140';
                else if (this.color == 'paletteOutline150')
                    return '€fc_colorOut150';
                else if (this.color == 'paletteOutline160')
                    return '€fc_colorOut160';
                else if (this.color == 'paletteOutline170')
                    return '€fc_colorOut170';
                else if (this.color == 'paletteOutline180')
                    return '€fc_colorOut180';
                else if (this.color == 'paletteOutline190')
                    return '€fc_colorOut190';
                else {
                    console.warn('Unknown button color `' + this.color + '`');
                    return '€fc_color(!unknown-color!)';
                }
            },
        },
    }
</script>
