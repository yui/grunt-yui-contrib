/*
Copyright (c) 2013, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/

var fs = require('fs'),
    path = require('path'),
    rimraf = require('rimraf'),
    cpr = require('cpr').cpr,
    exists = fs.existsSync || path.existsSync,
    BASE = process.cwd(),
    start = path.join(BASE, './build-npm'),
    debugIndex = 'exports.path = function() {' +
        '   return __dirname;' +
        '};\n' +
        'var YUI = require("./yui-nodejs/yui-nodejs-debug").YUI;\n' +
        'YUI.applyConfig({ debug: true, filter: "debug" });\n' +
        'exports.YUI = YUI;\n',

    makeIndex = function(mod, p) {
        var o = '../index', str;
        if (p) {
            o = './index';
        }
        str = 'var inst = require("' + o + '").getInstance();\n';
        str += 'module.exports = inst.use("' + mod + '");\n';
        return str;
    },
    makeDebug = function(mod, p) {
        var o = '../index', str;
        if (p) {
            o = './index';
        }

        str = 'var inst = require("' + o + '").getInstance();\n';
        str += 'inst.applyConfig({ debug: true, filter: "debug" });\n';
        str += 'module.exports = inst.use("' + mod + '");\n';
        return str;
    };


module.exports = function(grunt) {

    var VERSION;
    
    //Create the npm task
    grunt.registerTask('npm', 'Building YUI npm package', ['npm-boot', 'npm-clean', 'npm-copy', 'npm-process', 'npm-package']);

    grunt.registerTask('npm-boot', 'Bootstrapping npm package', function() {
        var log = 'Creating development NPM build';

        VERSION = grunt.config.get('version');

        if (grunt.option('release')) {
            log = 'Creating NPM Release Build';
            start = path.join(BASE, 'release', VERSION, 'npm');
        }
        grunt.log.ok(log);
    });

    grunt.registerTask('npm-copy', 'Bootstrapping npm package', function() {
        var done = this.async(),
            from = path.join(process.cwd(), 'build/');
        
        grunt.log.write('Copying to build dir: ' + start);

        if (grunt.option('release')) {
            from = path.join(BASE, 'release', VERSION, 'dist', 'build');
        }
            
        cpr(from, start, function() {
            grunt.log.writeln('...OK');
            grunt.file.copy(path.join(process.cwd(), 'README.md'), path.join(start, 'README.md'));
            grunt.file.copy(path.join(process.cwd(), 'package.json'), path.join(start, 'package.json'));
            grunt.file.copy(path.join(process.cwd(), 'src/common/npm/package_index.js'), path.join(start, 'index.js'));
            done();
        });
    });

    grunt.registerTask('npm-clean', 'Cleaning npm package', function() {
        grunt.log.write('Deleting old build-npm directory');
        var done = this.async();
        rimraf(start, function() {
            grunt.log.writeln('...OK');
            done();
        });
    });

    grunt.registerTask('npm-package', 'Post-processing package.json file', function() {
        grunt.log.writeln('Removing scripts flag from package.json file');
        var done = this.async(),
            jsonFile = path.join(start, 'package.json');

        fs.readFile(jsonFile, 'utf8', function(err, json) {
            json = JSON.parse(json);
            delete json.scripts;

            if (VERSION) {
                grunt.log.writeln('Found version: ' + VERSION);
                json.version = VERSION;
            }

            fs.writeFile(jsonFile, JSON.stringify(json, null, 4) + '\n', 'utf8', function() {
                grunt.log.ok('package.json patched');
                done();
            });
        });
    });

    grunt.registerTask('npm-process', 'Processing npm package', function() {
        var done = this.async(),
            Y, dirs, p,
            YUI;

        if (!exists(start)) {
            grunt.fail.fatal('Out directory does not exist, exiting.. (' + start + ')');
        }

        YUI = require(path.join(start, 'yui/yui')).YUI;

        YUI.Env.core = [];
        Y = YUI(); //This makes YUI.Env.aliases valid


        start = path.resolve(start);


        process.chdir(start);

        grunt.log.write('Writing index.js files');
        dirs = fs.readdirSync(start);
        dirs.forEach(function(mod) {
            var p = path.join(start, mod, 'index.js'),
                d = path.join(start, mod, 'debug.js'),
                stat = fs.statSync(path.join(start, mod));

            if (stat.isDirectory()) {
                fs.writeFileSync(p, makeIndex(mod), 'utf8');
                fs.writeFileSync(d, makeDebug(mod), 'utf8');
            }
        });
        grunt.log.writeln('...OK');

        grunt.log.write('Writing seed debug file');

        p = path.join(start, 'debug.js');
        fs.writeFileSync(p, debugIndex, 'utf8');
        grunt.log.writeln('...OK');

        grunt.log.write('Writing alias files');
        Object.keys(YUI.Env.aliases).forEach(function(mod) {
            var index = makeIndex(mod, true),
                p = path.join(start, mod + '.js');

            fs.writeFileSync(p, index, 'utf8');
        });
        grunt.log.writeln('...OK');

        grunt.log.ok('NPM Release Ready');

        //Change back to root dir
        process.chdir(BASE);

        done();

    });

};

