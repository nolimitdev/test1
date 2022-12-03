// Root projektu a zahrnutie konfiguracneho suboru
var ProjectRoot = require('./project-root.js');
var Config = require(ProjectRoot + '/config/config.js');

// Zahrnutie potrebnych modulov
var Path = require('path');

// Export PostCSS konfiguracie
module.exports = (api) => {
    var colorMode = api.options.colorMode;
    if (colorMode != 'light' && colorMode != 'dark')
        throw new Error('Unknown color mode (colorMode = ' + colorMode + ')');

    // Subor s CSS custom media
    var customMediaFilePath = ProjectRoot + '/resources/css/postcss/resources/fw-custom-media.css';

    // Subor s CSS mixinmi
    var mixinsFilePath = ProjectRoot + '/resources/css/postcss/processed/' + colorMode + '/fw-mixins.css';

    // Subor s CSS premennymi pre rozne ostatne veci
    var customPropertiesOtherFilePath = ProjectRoot + '/resources/css/postcss/processed/' + colorMode + '/custom-properties-config.css';

    // Subor s CSS premennymi pre zakladne farby
    var customPropertiesColorBaseFilePath = ProjectRoot + '/resources/css/postcss/processed/' + colorMode + '/custom-properties-color-base.css';

    // Subor s CSS premennymi pre farby podla rezimu (light/dark)
    var customPropertiesColorModeFilePath = ProjectRoot + '/resources/css/postcss/processed/' + colorMode + '/custom-properties-color-mode.css'

    // Pri zmene tychto suborov sa spusti rekompilacia
    var dependencies = [
        { type : 'dependency', file : Path.resolve(customMediaFilePath) },
        { type : 'dependency', file : Path.resolve(mixinsFilePath) },
        { type : 'dependency', file : Path.resolve(customPropertiesColorBaseFilePath) },
        { type : 'dependency', file : Path.resolve(customPropertiesColorModeFilePath) },
        { type : 'dependency', file : Path.resolve(customPropertiesOtherFilePath) },
    ];

    // Subory s premennymi pre importovanie do postcss-custom-properties a postcss-color-mod-function
    // customPropertiesOtherFilePath je nelogicky pouzity ako prvy, hoci vola vo velkom premenne z nasledujuceho customPropertiesColorModeFilePath (pluginu postcss-custom-properties toto opacne poradie nevadi),
    // a to z dovodu, ze customPropertiesColorModeFilePath v pripade tmaveho rezimu prebija premenne z customPropertiesOtherFilePath a aby prebijanie fungovalo, tak customPropertiesColorModeFilePath musi byt neskor v poradi
    var customProperties = [
        customPropertiesOtherFilePath,
        customPropertiesColorBaseFilePath,
        customPropertiesColorModeFilePath,
    ];

    return {
        plugins : [
            ['postcss-mixins', { mixinsFiles : mixinsFilePath, silent : false }],
            ['postcss-custom-properties', { importFrom : customProperties, preserve : false }],
            ['postcss-custom-properties-checker', { unresolved : 'throw' }],
            ['postcss-color-mod-function', { importFrom : customProperties, unresolved : 'throw' }],
            ['postcss-calc', {}],
            ['postcss-custom-media', { importFrom : customMediaFilePath }],
            ['postcss-selector-matches', {}],
            ['postcss-round-subpixels', {}],
            ['autoprefixer', { overrideBrowserslist : ['last 5 versions'] }],
            ['postcss-add-dependencies', { dependencies : dependencies }],
            ['postcss-fail-on-warn', {}],
        ],
    }
};
