// Root projektu
var ProjectRoot = require('./project-root.js');

// Zahrnutie potrebnych modulov
var Fs = require('fs');
var Postcss = require('postcss');
var PostcssCalc = require('postcss-calc');
var PostcssColorModFunction = require('postcss-color-mod-function');
var PostcssCustomProperties = require('postcss-custom-properties');

var colorMode = process.argv[2];
if (colorMode != 'light' && colorMode != 'dark')
    throw new Error('Unknown color mode (colorMode = ' + colorMode + ')');

// Subor s CSS mixinmi
var mixinsFilePath = ProjectRoot + '/resources/css/postcss/resources/fw-mixins.css';

// Subor s CSS premennymi pre rozne ostatne veci
var customPropertiesOtherFilePath = ProjectRoot + '/resources/css/postcss/resources/custom-properties-config.css';

// Subor s CSS premennymi pre zakladne farby
var customPropertiesColorBaseFilePath = ProjectRoot + '/resources/css/postcss/resources/custom-properties-color-base.css';

// Subor s CSS premennymi pre farby podla rezimu (light/dark)
var customPropertiesColorModeFilePath = (colorMode == 'light') ? ProjectRoot + '/resources/css/postcss/resources/custom-properties-color-light.css' : ProjectRoot + '/resources/css/postcss/resources/custom-properties-color-dark.css';

// Subory s premennymi pre importovanie do postcss-custom-properties a postcss-color-mod-function
// customPropertiesOtherFilePath je nelogicky pouzity ako prvy, hoci vola vo velkom premenne z nasledujuceho customPropertiesColorModeFilePath (pluginu postcss-custom-properties toto opacne poradie nevadi),
// a to z dovodu, ze customPropertiesColorModeFilePath v pripade tmaveho rezimu prebija premenne z customPropertiesOtherFilePath a aby prebijanie fungovalo, tak customPropertiesColorModeFilePath musi byt neskor v poradi
var customProperties = [
    customPropertiesOtherFilePath,
    customPropertiesColorBaseFilePath,
    customPropertiesColorModeFilePath,
];

// Subory pre sprocesovanie
var filesToProcess = [
    { resource : mixinsFilePath, processed : ProjectRoot + '/resources/css/postcss/processed/' + colorMode + '/fw-mixins.css' },
    { resource : customPropertiesOtherFilePath, processed : ProjectRoot + '/resources/css/postcss/processed/' + colorMode + '/custom-properties-config.css' },
    { resource : customPropertiesColorBaseFilePath, processed : ProjectRoot + '/resources/css/postcss/processed/' + colorMode + '/custom-properties-color-base.css' },
    { resource : customPropertiesColorModeFilePath, processed : ProjectRoot + '/resources/css/postcss/processed/' + colorMode + '/custom-properties-color-mode.css' },
];

// Sprocesovanie suborov
(async() => {
    for (var file of filesToProcess) {
        var content = Fs.readFileSync(file.resource, 'utf8');

        if (file.resource != mixinsFilePath)
            content = fakeCss('create', content);

        var { css : content } = await Postcss([
            PostcssCustomProperties({ importFrom : customProperties, preserve : false }),
            PostcssColorModFunction({ importFrom : customProperties }),
            PostcssCalc(),
        ]).process(content, { from : undefined });

        // Plugin postcss-color-mod-function je potrebne aplikovat este raz, pretoze PostCSS subory su komplexne a color-mod je viacnasobne povnarany napriec premennymi a subormi
        var { css : content } = await Postcss([
            PostcssColorModFunction(),
        ]).process(content, { from : undefined });

        if (file.resource != mixinsFilePath)
            content = fakeCss('destroy', content);

        Fs.writeFileSync(file.processed, content);
    }
})();

// Pluginy postcss-custom-properties a postcss-color-mod-function neprocesuju CSS kod v sekcii :root { } preto je potrebne tento kod docasne zmenit na fiktivny CSS subor, aby mohol byt sprocesovany
function fakeCss(type, content) {
    if (type == 'create') {
        content = content.replace(':root {', '/*START*/');
        content = content.replace('}\n', '/*END*/');
        content = content.replace(/:/g, '{color:');
        content = content.replace(/;/g, '};');
    }

    else if (type == 'destroy') {
        content = content.replace(/\{color:/g, ':');
        content = content.replace(/\};/g, ';');
        content = content.replace('/*START*/', ':root {');
        content = content.replace('/*END*/', '}\n');
    }

    return content;
}
