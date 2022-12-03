<template>
    <router-view></router-view>
</template>

<script>
    export default {
        data() {
            return {
                colorMode : (document.getElementById('linkStyleSheet').href.indexOf('dark.css') == -1) ? 'light' : 'dark',
            };
        },

        created() {
            // Pridanie globalneho odkazu na Vue App instanciu
            window.vapp = this;

            // Inicializacia waves efektu pre buttony
            Waves.init()
        },

        mounted() {

        },

        watch : {
            colorMode(colorMode) {
                var link = document.getElementById('linkStyleSheet');
                link.href = link.getAttribute('data-' + colorMode);
                localStorage.setItem('colorMode', colorMode);
            },
        },

        computed : {

        },

        methods : {

        },
    }
</script>
