<template>
    <button v-bind:class="['€fc_btnTag', buttonClassButton, buttonClassColor, buttonClassSize, buttonClassInactive, '€fc_waves-effect']">
        <div class="€fc_tagItem">
            <div class="€fc_tagText">
                <div class="€fc_tagPhoto" v-if="icon || image">
                    <i v-if="icon" v-bind:class="iconClass"></i>
                    <img v-if="image" v-bind:src="image" alt="">
                </div>
                {{ text }}
            </div>
            <a href="javascript:void(0)" class="€fc_tagClose" v-if="closable">
                <i v-bind:class="getIconClass('icon-cross')"></i>
            </a>
        </div>
    </button>
</template>

<script>
    import IconClass from '../../other/fw-icon-class.js';

    export default {
        props : {
            button : {
                type : String,
                required : false,
            },
            color : {
                type : String,
                required : false,
            },
            text : {
                type : String,
                required : true,
            },
            size : {
                type : String,
                required : false,
            },
            icon : {
                type : String,
                required : false,
            },
            image : {
                type : String,
                required : false,
            },
            inactive : {
                type : Boolean,
                required : false,
            },
            closable : {
                type : Boolean,
                required : false,
            },
        },

        computed : {
            buttonClassButton() {
                if (!this.button)
                    return null;
                else if (this.button == 'raised')
                    return '€fc_btnRaised';
                else if (this.button == 'flated')
                    return '€fc_btnFlat';
                else if (this.button == 'flated-bordered')
                    return '€fc_btnFlatBd';
                else if (this.button == 'slim')
                    return '€fc_btnSlim';
                else if (this.button == 'slim-bordered')
                    return '€fc_btnSlimBd';
                else {
                    console.warn('Unknown button `' + this.button + '`');
                    return '€fc_btn(!unknown-button!)';
                }
            },

            buttonClassColor() {
                if (!this.color)
                    return null;
                else if (!this.button)
                    return this.getButtonClassColorForButtonNull();
                else if (this.button == 'raised')
                    return this.getButtonClassColorForButtonRaised();
                else if (this.button == 'flated')
                    return this.getButtonClassColorForButtonFlated();
                else if (this.button == 'flated-bordered')
                    return this.getButtonClassColorForButtonFlatedBordered();
                else if (this.button == 'slim')
                    return this.getButtonClassColorForButtonSlim();
                else if (this.button == 'slim-bordered')
                    return this.getButtonClassColorForButtonSlimBordered();
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
                    console.warn('Unknown tag size `' + this.size + '`');
                    return '€fc_btnSize(!unknown-size!)';
                }
            },

            buttonClassInactive() {
                return (this.inactive) ? '€fc_btnTag--simple' : null; // TODO: odporucam premenovat na €fc_btnTag--inactive
            },

            iconClass() {
                return (this.icon) ? this.getIconClass(this.icon) : null;
            },
        },

        methods : {
            getIconClass(iconName) {
                return IconClass.get(iconName);
            },

            getButtonClassColorForButtonRaised() {
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

            getButtonClassColorForButtonFlated() {
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

            getButtonClassColorForButtonFlatedBordered() {
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

            getButtonClassColorForButtonSlim() {
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

            getButtonClassColorForButtonSlimBordered() {
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

            getButtonClassColorForButtonNull() {
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
                    console.warn('Unknown tag color `' + this.color + '`');
                    return '€fc_color(!unknown-color!)';
                }
            },
        },
    }
</script>
