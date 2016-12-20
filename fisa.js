var fis = module.exports = require('fis');

fis.cli.name = 'fis-angular';
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');

fis.config.merge({
    bower : {
        path : 'public/bower_components'
    }
});

require('./build/bower_boost.js');

RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

fis.util.getReplaceFrom = function(conf){

    var regArr = Object.keys(conf).map(function(val, index, arr){

        return RegExp.escape(val);
    });

    return new RegExp(regArr.join('|'), 'g');
}

fis.util.getReplaceTo = function(conf){

    return function(m){

        return conf[m];
    }
}

fis.util.getReplace = function(conf){

    if(!conf){
        return null;
    }

    var replace = {
        from: fis.util.getReplaceFrom(conf),
        to: fis.util.getReplaceTo(conf)
    };

    return replace;
}

fis.util.getDeploy = function(conf){

    var deploy = {};

    for(var key in conf){

        if(conf.hasOwnProperty(key)){

            deploy[key] = [
                {
                    from: conf[key].from,
                    to: conf[key].to
                }
            ];

            if(conf[key].replace){

                deploy[key][0].replace = fis.util.getReplace(conf[key].replace);
            }

            if(conf[key].receiver){

                deploy[key][0].receiver = conf[key].receiver;
            }
        }
    }

    return deploy;
}

fis.config.merge({

    staticModule : 'static',
    server : {
        type : 'node'
    },

    modules : {
        parser : {
            less : ['less'],
            js: ['babel-es2015'],
            es: ['babel-es2015']
        },
        packager : 'depscombine',
        postpackager : 'autoload, simple',
        postprocessor : {
            js : 'jswrapper, annotate-lastest'
        }
    },
    settings : {
        parser: {
            'babel-es2015': {
                presets: ['es2015']
            }
        },
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
            less : 'css',
            es: 'js'
        },
        path : [
            {
                reg: /.*business\/index\.html$/i,
                isMod: false,
                useHash: false,
                release: '${staticModule}/$&'
            },
            {

                reg: /.*\.html$/i,
                isMod: false,
                useHash: true,
                release: '${staticModule}/$&'
            },
            {
                reg : /(server\.conf)$/i,
                release : 'config/$1'
            },
            {
                reg : /\/(test\/.*)/i,
                release : '$1'
            },
            {
                reg : /public\/(directives|services|main)\/([^\/]+)\/\2\.es$/i,
                isMod : true,
                isES6: true,
                id : '$1/$2',
                release : '${staticModule}/$&',
                extras : {
                    isAnnotate : true
                }
            },
            {
                reg : /public\/(directives|services|main)\/(.*)\.es$/i,
                isMod : true,
                isES6: true,
                id : '$1/$2',
                release : '${staticModule}/$&',
                extras : {
                    isAnnotate : true
                }
            },
            {
                reg : /business\/(.*)\/(.*)\.es$/i,
                isMod : true,
                isES6: true,
                id : 'business/$1',
                release : '${staticModule}/$&',
                extras : {
                    isAnnotate : true
                }
            },
            {
                reg : /public\/(directives|services|main)\/([^\/]+)\/\2\.js$/i,
                isMod : true,
                isES6: true,
                id : '$1/$2',
                release : '${staticModule}/$&',
                extras : {
                    isAnnotate : true
                }
            },
            {
                reg : /public\/(directives|services|main)\/(.*)\.js$/i,
                isMod : true,
                isES6: true,
                id : '$1/$2',
                release : '${staticModule}/$&',
                extras : {
                    isAnnotate : true
                }
            },
            {
                reg : /business\/(.*)\/(.*)\.js$/i,
                isMod : true,
                isES6: true,
                id : 'business/$1',
                release : '${staticModule}/$&',
                extras : {
                    isAnnotate : true
                }
            },
            {
                reg : /(.*\.(?:js|css|less|scss|html|gif|jpg|png|swf))$/i,
                isES6: false,
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