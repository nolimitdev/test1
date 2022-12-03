<template>
    <div class="€fc_userAvatar" v-bind:class="[classSize, classDetail]"  >
        <div class="€fc_userAvatarCon" v-bind:class="classWaveEffect">
            <div class="€fc_userAvatarPhoto">
                <div class="€fc_userAvatarImg" v-if="photo">
                    <img v-bind:src="photo">
                </div>
                <div class="€fc_userAvatarIcon" v-else>
                    <i v-bind:class="iconClass"></i>
                </div>
                <div class="€fc_userAvatarStatus" v-bind:class="classStatus"></div>
            </div>
            <div class="€fc_userAvatarDetail">
                <div class="€fc_userAvatarName">
                    {{ name }}
                </div>
                <div class="€fc_userAvatarOtherInfo">
                    {{ info }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import IconClass from '../../other/fw-icon-class.js';

    export default {
        props : {
            name : {
                type : String,
                required : true,
            },
            info : {
                type : String,
                required : false,
            },
            size : {
                type : String,
                required : false,
            },
            photo : {
                type : String,
                required : false,
            },
            status : {
                type : String,
                required : false,
            },
            detail : {
                type : String,
                required : false,
            },
            effect : {
                type : String,
                required : false,
            },
        },

        data() {
            return {
                iconClass : IconClass.get('icon-user'),
            };
        },

        computed : {
            classWaveEffect() {
                if (!this.effect)
                    return null;
                else if (this.effect == 'waves')
                    return '€fc_waves-effect';
                else {
                    console.warn('Unknown effect `' + this.effect + '`');
                    return '€fc_waves-effect(!unknown-effect!)';
                }
            },

            classSize() {
                if (!this.size)
                    return null;
                else if (this.size == 'xxs')
                    return '€fc_userAvatar--xxs';
                else if (this.size == 'xs')
                    return '€fc_userAvatar--xs';
                else if (this.size == 'sm')
                    return '€fc_userAvatar--sm';
                else if (this.size == 'md')
                    return '€fc_userAvatar--md';
                else if (this.size == 'lg')
                    return '€fc_userAvatar--lg';
                else if (this.size == 'xl')
                    return '€fc_userAvatar--xl';
                else {
                    console.warn('Unknown user size `' + this.size + '`');
                    return '€fc_userAvatar(!unknown-size!)';
                }
            },

            classStatus() {
                if (!this.status)
                    return null;
                else if (this.status == 'online')
                    return '€fc_userAvatarStatus--online';
                else if (this.status == 'offline')
                    return '€fc_userAvatarStatus--offline';
                else if (this.status == 'away')
                    return '€fc_userAvatarStatus--away';
                else if (this.status == 'hide')
                    return '€fc_userAvatarStatus--hide';
                else {
                    console.warn('Unknown user status `' + this.status + '`');
                    return '€fc_userAvatarStatus(!unknown-status!)';
                }

            },

            classDetail() {
                if (!this.detail)
                    return null;
                else if (this.detail == 'hide')
                    return '€fc_userAvatarDetail--hide';
                else {
                    console.warn('Unknown user detail `' + this.detail + '`');
                    return '€fc_userAvatarStatus(!unknown-detail!)';
                }

            },
        },
    }
</script>
