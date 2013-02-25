/*
Copyright (c) 2013, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/


var path = require('path'),
    fs = require('fs'),
    exists = fs.existsSync || path.existsSync,
    exec = require('child_process').spawn,
    cpr = require('cpr').cpr;

module.exports = function(grunt) {

    var VERSION = grunt.option('release-version'),
        STAMP = [
            '/*',
            '<%= buildtag %>',
            '<%= copyright %>',
            '<%= license %>',
            '*/',
            '',
            ''
        ].join('\n'),
        start = path.join(process.cwd(), 'release', VERSION);
    

    grunt.config.set('version', VERSION);

    grunt.registerTask('dist', 'Create a YUI Dist Release', [
        'dist-tag',
        'dist-docs',
        'dist-api',
        'dist-releasenotes',
        'dist-tests',
        'dist-skins',
        'dist-extras'
    ]);

    grunt.registerTask('dist-tag', 'Tag files with copyright stamp', function() {
        var stamp = grunt.template.process(STAMP),
            count = 0;
        grunt.log.ok('Adding build stamp and copyright');
        grunt.log.ok('Adding the following stamp to all JS and CSS files');
        grunt.log.writeln('\n' + stamp);
        grunt.file.recurse(path.join(start, 'dist', 'build'), function(abs, root, part, file) {
            if (path.extname(file) === '.js' || path.extname(file) === '.css') {
                count++;
                grunt.verbose.writeln(abs);
                var data = grunt.file.read(abs);
                grunt.file.write(abs, stamp + data);
            }
        });
        grunt.log.ok('Finished processing ' + count + ' files.');
    });

    grunt.registerTask('dist-api', 'Dist Release API Docs', function() {
        grunt.log.writeln('Using YUIDoc to generate docs');
        var done = this.async(),
            base = path.join(start, 'dist', 'api'),
            yuidoc = path.join(process.cwd(), 'node_modules/yogi/node_modules/yuidocjs/lib/cli.js'),
            fakeJSON = grunt.file.readJSON(path.join(process.cwd(), 'src/common/api/dist.json')),
            docJSON = path.join(start, 'yuidoc-dist.json'),
            child;
        
        fakeJSON.version = VERSION;

        grunt.file.write(docJSON, JSON.stringify(fakeJSON, null, 4) + '\n');
        
        child = exec(process.execPath, [
            yuidoc,
            '--config',
            docJSON,
            '--outdir',
            base
        ], {
            cwd: path.join(process.cwd(), 'src'),
            env: process.env
        });

        child.on('exit', function(code) {
            if (code) {
                grunt.fail.fatal('YUIDoc exited with code ' + code, code);
            }
            grunt.log.ok('YUIDoc API Docs Complete');
            fs.unlinkSync(docJSON);
            done();
        });
    });

    grunt.registerTask('dist-docs', 'Dist Release Docs', function() {
        
        grunt.log.writeln('Using Selleck to generate docs');
        var done = this.async(),
            base = path.join(start, 'dist', 'docs'),
            selleck = path.join(process.cwd(), 'node_modules/yogi/node_modules/selleck/bin/selleck'),
            fakeJSON = grunt.file.readJSON(path.join(process.cwd(), 'src/common/docs/dist.json')),
            selleckJSON = path.join(start, 'selleck-dist.json'),
            child;
        
        fakeJSON.yuiVersion = VERSION;
        grunt.file.write(selleckJSON, JSON.stringify(fakeJSON, null, 4) + '\n');
        
        child = exec(process.execPath, [
            selleck,
            '--meta',
            selleckJSON,
            '--out',
            base
        ], {
            cwd: path.join(process.cwd(), 'src'),
            env: process.env
        });

        child.on('exit', function(code) {
            if (code) {
                grunt.fail.fatal('Selleck exited with code ' + code, code);
            }
            grunt.log.ok('Selleck docs complete');
            fs.unlinkSync(selleckJSON);
            done();
        });
        
    });

    grunt.registerTask('dist-extras', 'Adding extras to release', function() {
        grunt.log.writeln('Adding extras to release');

        var RM = path.join(process.cwd(), 'README.md'),
            RRM = path.join(start, 'dist', 'README.md');
            L = path.join(process.cwd(), 'LICENSE.md'),
            RL = path.join(start, 'dist', 'LICENSE.md');

        grunt.file.copy(RM, RRM);
        grunt.file.copy(L, RL);

    });

    grunt.registerTask('dist-skins', 'Munging skins', function() {
        grunt.log.writeln('Munging skins into the dist');
        var done = this.async(),
            base = path.join(start, 'dist', 'build'),
            skinSrc = {};

        grunt.log.writeln('Creating rollup skins');

        cpr(path.join(process.cwd(), 'src/common/assets'),
            path.join(base, 'assets'),
            function() {
                grunt.file.recurse(base, function(abs, root, part, file) {
                    var skinName, parts, dest;
                    if (grunt.file.isMatch('*/assets/skins/'+'*', part)) {
                        if (file.indexOf('-skin.css') > -1) {
                            skinName = path.basename(part);
                            skinSrc[skinName] = skinSrc[skinName] || [];
                            skinSrc[skinName].push(grunt.file.read(abs));
                        } else {
                            parts = part.split(path.sep);
                            parts.shift();
                            dest = path.resolve(root, parts.join(path.sep), file);
                            grunt.file.copy(abs, dest);
                        }
                    }
                });
                
                Object.keys(skinSrc).forEach(function(dir) {
                    var skinFile = path.join(base, 'assets/skin/', dir, 'skin.css');
                    grunt.log.ok('Writing compiled skin:' + skinFile);
                    grunt.file.write(skinFile, skinSrc[dir].join('\n'));
                });
            done();
        });


    });

    grunt.registerTask('dist-releasenotes', 'Preparing Dist Release', function() {
        grunt.log.writeln('Copying Release Notes for release');
        var base = path.join(start, 'dist', 'releasenotes'),
            root, dirs, count;

        grunt.file.mkdir(base);
        root = path.join(process.cwd(), 'src');
        dirs = fs.readdirSync(root);
        count = 0;
        dirs.forEach(function(f) {
            var history = path.join(root, f, 'HISTORY.md'),
                newHist;
            if (exists(history)) {
                count++;
                newHist = path.join(base, 'HISTORY.' + f + '.md');
                grunt.file.copy(history, newHist);
            }
        });
        grunt.log.writeln('Copied ' + count + ' history files.');
    });

    grunt.registerTask('dist-tests', 'Dist Release Tests', function() {
        grunt.log.writeln('Copying tests for release');
        var base = path.join(start, 'dist', 'tests'),
            done = this.async(),
            root = path.join(process.cwd(), 'src'),
            dirs = fs.readdirSync(root),
            count = 0,
            complete = 0,
            check = function() {
                if (count === complete) {
                    grunt.log.writeln('Copied ' + count + ' test dirs.');
                    done();
                }
            };

        grunt.file.mkdir(base);

        dirs.forEach(function(f) {
            var tests = path.join(root, f, 'tests'),
                newTests;
            if (exists(tests)) {
                count++;
                newTests = path.join(base, f, 'tests');
                cpr(tests, newTests, function() {
                    complete++;
                    check();
                });
            }
        });
    });

};
