/*
Copyright (c) 2013, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/


var exec = require('child_process').spawn,
    path = require('path');

module.exports = function(grunt) {

    grunt.registerTask('yogi-build', 'Building YUI', function() {
        var done = this.async(),
            VERSION = grunt.config.get('version'),
            line = 'Building all modules with yogi',
            yogi = path.join(process.cwd(), 'node_modules/yogi/bin/yogi.js'),
            args = [
                yogi,
                'build',
                '--istanbul'
            ], walkArgs, child,
            buildCore = function() {
                grunt.log.ok('Building Loader Meta-Data');
                var child = exec(process.execPath, [
                    yogi,
                    'loader',
                    '--mix',
                    '--yes'
                ], {
                    cwd: path.join(process.cwd(), 'src'),
                    stdio: 'inherit',
                    env: process.env
                });

                child.on('exit', function(code) {
                    if (code) {
                        grunt.fail.fatal('yogi seed build exited with code: ' + code);
                    }
                    grunt.log.ok('Building Seed Files');
                    var child = exec(process.execPath, args, {
                        cwd: path.join(process.cwd(), 'src', 'yui'),
                        stdio: 'inherit',
                        env: process.env
                    });

                    child.on('exit', function(code) {
                        if (code) {
                            grunt.fail.fatal('yogi seed build exited with code: ' + code);
                        }
                        done();
                    });
                });
            };

        if (grunt.option('release')) {
            line += ' for release ' + VERSION;
        }
        grunt.log.ok(line);

        if (grunt.option('release')) {
            args.push('--replace-version');
            args.push(VERSION);
            args.push('--build-dir');
            args.push(path.join(process.cwd(), 'release/', VERSION, 'dist', 'build'));
        } else {
            if (grunt.option('cache-build')) {
                args.push('--cache');
            }
        }

        walkArgs = [].concat(args);
        walkArgs.push('-x');
        walkArgs.push('yui');
        walkArgs.push('-x');
        walkArgs.push('loader');
        walkArgs.push('-x');
        walkArgs.push('get');

        child = exec(process.execPath, walkArgs, {
            cwd: path.join(process.cwd(), 'src'),
            stdio: 'inherit',
            env: process.env
        });

        child.on('exit', function(code) {
            if (code) {
                grunt.fail.fatal('yogi build exited with code: ' + code);
            }
            buildCore();
        });

    });

};

