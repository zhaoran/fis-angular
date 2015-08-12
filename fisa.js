var fis = module.exports = require('fis');

fis.cli.name = 'fis-angular';
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');

fis.config.merge({
    bower : {
        path : 'public/bower_components'
    }
});

require('./build/bower_boost.js');

fis.config.merge({

    staticModule : 'static',
    server : {
        type : 'node'
    },

    modules : {
        parser : {
            less : ['less']
        },
        packager : 'depscombine',
        postpackager : 'autoload, simple',
        postprocessor : {
            js : 'jswrapper, annotate'
        }
    },
    settings : {
        postpackager : {
            simple : {
                autoCombine : true
            }
        },
        postprocessor : {
            jswrapper : {
                type : 'amd'
            }
        }
    },
    roadmap : {
        ext : {
            less : 'css'
        },
        path : [
            {
                reg : /(server\.conf)$/i,
                release : 'config/$1'
            },
            {
                reg : /\/(test\/.*)/i,
                release : '$1'
            },
            {
                reg : /public\/(directives|services|main)\/([^\/]+)\/\2\.js$/i,
                isMod : true,
                id : '$1/$2',
                release : '${staticModule}/$&',
                extras : {
                    isAnnotate : true
                }
            },
            {
                reg : /public\/(directives|services|main)\/(.*)\.js$/i,
                isMod : true,
                id : '$1/$2',
                release : '${staticModule}/$&',
                extras : {
                    isAnnotate : true
                }
            },
            {
                reg : /business\/(.*)\/(.*)\.js$/i,
                isMod : true,
                id : 'business/$1',
                release : '${staticModule}/$&',
                extras : {
                    isAnnotate : true
                }
            },
            {
                reg : /(.*\.(?:js|css|less|scss|html|gif|jpg|png|swf))$/i,
                release : '${staticModule}/$1',
            },
            {
                reg : /(.*\.(?:eot|svg|ttf|woff|woff2|otf))$/i,
                release : '${staticModule}/$1',
            },
            {
                reg : '**',
                release : false
            }
        ]
    }
});