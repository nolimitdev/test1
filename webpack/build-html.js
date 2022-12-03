// Root projektu a zahrnutie konfiguracneho suboru
var ProjectRoot = require('./project-root.js');
var Config = require(ProjectRoot + '/config/config.js');

// Zahrnutie potrebnych modulov
var Fs = require('fs');
var HtmlMinifierTerser = require('html-minifier-terser');
var Postcss = require('postcss');
var PostcssCustomMedia = require('postcss-custom-media');
var PostcssCustomProperties = require('postcss-custom-properties');

// Zdrojovy a vysledny HTML subor
var htmlFile = { source : ProjectRoot + '/resources/html/index.html', target : ProjectRoot + '/public/index.html' };

// Subor s CSS premennymi
var cssConfigFilePath = ProjectRoot + '/resources/css/postcss/resources/custom-properties-config.css';

// Subor s CSS custom media
var cssMediaFilePath = ProjectRoot + '/resources/css/postcss/resources/fw-custom-media.css';

// Aby sme mohli pouzit await namiesto Promise.then(), tak kod spustime cez IIFE pretoze await je mozne pouzit iba v async funkcii (hlavne vlakno nie je mozne blokovat)
(async() => {
    // CSS kod pre safe area, ktory bude pridany do HTML kodu
    var cssSafeArea = Fs.readFileSync(ProjectRoot + '/resources/css/fw-safe-area.css', 'utf8');

    // Pred sprocesovanim docasne premenovat premenne --JSsafeArea* na --JStempHide, aby neboli sprocesovane, lebo v safe area kode musia ostat premenne, nie ich hodnoty (hodnoty pre premenne spravuje safe area javascript)
    cssSafeArea = cssSafeArea.replace(/--JSsafeArea/g, '--JStempHide');

    // Sprocesovanie CSS safe area suboru
    var { css : cssSafeArea } = await Postcss([
        PostcssCustomProperties({ importFrom : cssConfigFilePath, preserve : false }),
        PostcssCustomMedia({ importFrom : cssMediaFilePath }),
    ]).process(cssSafeArea, { from : undefined });

    // Po sprocesovani premenovat naspat premenne --JStempHide* na --JSsafeArea
    cssSafeArea = cssSafeArea.replace(/--JStempHide/g, '--JSsafeArea');

    // V pripade produkcie CSS kod pre safe area minifikujeme (musime pridat <style> tag a potom odstranit kedze pouzivame minifikator urceny pre HTML nie priamo CSS)
    if (Config.production) {
        cssSafeArea = await HtmlMinifierTerser.minify('<style>' + cssSafeArea + '</style>', {
            minifyCSS : true,
        });
        cssSafeArea = cssSafeArea.replace('<style>', '').replace('</style>', '');
    }

    // Osetrit znaky novych riadkov \r a \n a single uvodzovku
    cssSafeArea = cssSafeArea.replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/'/g, '\\\'');

    // JavaScript kod, ktory bude nahradzovat v predpripravenom CSS kode premenne --JSsafeAreaHeightTop a --JSsafeAreaHeightBottom
    var scriptSafeArea = '\n' +
        '            window.mobileAppSafeArea = function(safeAreaHeightTop, safeAreaHeightBottom) {\n' +
        '                if (typeof safeAreaHeightTop == \'undefined\' && typeof safeAreaHeightBottom == \'undefined\')\n' +
        '                    return;\n' +
        '                var style = document.getElementById(\'styleSafeArea\');\n' +
        '                safeAreaHeightTop = parseInt(safeAreaHeightTop) || 0;\n' +
        '                safeAreaHeightBottom = parseInt(safeAreaHeightBottom) || 0;\n' +
        '                style.textContent = \'' + cssSafeArea + '\'.replace(/var\\(--JSsafeAreaHeightTop\\)/g, safeAreaHeightTop + \'px\').replace(/var\\(--JSsafeAreaHeightBottom\\)/g, safeAreaHeightBottom + \'px\');\n' +
        '            };\n' +
        '            (function() {\n' +
        '                var style = document.createElement(\'style\'); style.id = \'styleSafeArea\';\n' +
        '                var matchSafeAreaHeightTop = location.search.match(/safeAreaHeightTop=([^&]+)/) || [];\n' +
        '                var matchSafeAreaHeightBottom = location.search.match(/safeAreaHeightBottom=([^&]+)/) || [];\n' +
        '                document.currentScript.parentNode.insertBefore(style, document.currentScript);\n' +
        '                window.mobileAppSafeArea(matchSafeAreaHeightTop[1], matchSafeAreaHeightBottom[1]);\n' +
        '            })();\n        ';

    // Sprocesovanie HTML suboru

    // Nacitat obsah zdrojoveho HTML suboru
    var htmlData = Fs.readFileSync(htmlFile.source, 'utf8');

    // Nahradit premenne, ktore su v tvare (( config.configKey ))
    htmlData = htmlData.replace(/\(\( ?config\.([a-z0-9]+) ?\)\)/gi, (whole, configKey) => {
        if (typeof Config[configKey] == 'undefined')
            throw new Error('Failed to replace non-existent config.' + configKey + ' in ' + htmlFile.source);

        return Config[configKey];
    });

    // Nahradit predpripravene miesto v HTML kode za JavaScript kod spravujuci safe area
    htmlData = htmlData.replace(/\(\( ?scriptSafeArea ?\)\)/gi, scriptSafeArea);

    // JavaScript kod, ktory rozhodne aky farebny rezim sa pouzije (app-light.css alebo app-dark.css)
    var scriptColorMode = '\n' +
        '            (function() {\n' +
        '                var link = document.getElementById(\'linkStyleSheet\');\n' +
        '                var colorMode = (!window.localStorage || window.localStorage.colorMode != \'dark\') ? \'light\' : \'dark\';\n' +
        '                link.href = link.getAttribute(\'data-\' + colorMode);\n' +
        '            })();\n        ';

    // Nahradit predpripravene miesto v HTML kode za JavaScript kod spravujuci farebny rezim
    htmlData = htmlData.replace(/\(\( ?scriptColorMode ?\)\)/gi, scriptColorMode);

    // V pripade produkcie HTML subor minifikujeme
    if (Config.production) {
        htmlData = await HtmlMinifierTerser.minify(htmlData, {
            collapseWhitespace : true,
            collapseBooleanAttributes : true,
            removeComments : true,
            removeEmptyAttributes : true,
            minifyCSS : true,
            minifyJS : true,
            removeAttributeQuotes : true,
        });
    }

    // Vysledny HTML subor ulozime iba ak sa jeho obsah zmenil (inak webpack-dev-server zbytocne reloadne celu stranku - F5; try/catch pouzite, lebo pri prvom spusteni nemusi subor existovat)
    try { var htmlDataOld = Fs.readFileSync(htmlFile.target, 'utf8'); } catch (error) {};
    if (htmlData != htmlDataOld)
        Fs.writeFileSync(htmlFile.target, htmlData);
})();
