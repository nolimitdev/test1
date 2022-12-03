// Root projektu a zahrnutie konfiguracneho suboru
var ProjectRoot = require('./project-root.js');
var Config = require(ProjectRoot + '/config/config.js');

// Zahrnutie potrebnych modulov
var Del = require('del');

if (!Config.sourcemaps) {
    Del.sync(ProjectRoot + '/public/assets/*/*.map', { force : true });
}
