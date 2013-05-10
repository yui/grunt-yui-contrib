/*
Copyright (c) 2013, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/


var exec = require('child_process').spawn,
    path = require('path');

module.exports = function(grunt) {
    var CLI = false;

    grunt.registerTask('test-cli', 'Testing YUI via the CLI', function() {
        CLI = true;
        grunt.task.run('test');

    });

    grunt.registerTask('test', 'Testing YUI', function() {
        grunt.log.ok('Testing all modules with yogi');

        var done = this.async(),
            yogi = path.join(process.cwd(), 'node_modules/yogi/bin/yogi.js'),
            args = [
                yogi,
                'test'
            ],
            child;

        // echoecho-based load-tests require a longer timeout.
        args.push('-t');
        args.push(120);

        if (CLI) {
            CLI = false;
            args.push('--cli');
        }

        if ('TEST_RESULTS_DIR' in process.env) {
            grunt.log.ok('Saving JUnitXML file to: ' + process.env.TEST_RESULTS_DIR);
            args.push('--junit');
            args.push('--outfile');
            args.push(path.join(process.env.TEST_RESULTS_DIR, 'junit.xml'));
        }

        child = exec(process.execPath, args, {
            cwd: path.join(process.cwd(), 'src'),
            stdio: 'inherit',
            env: process.env
        });

        child.on('exit', function(code) {
            if (code) {
                grunt.fail.fatal('yogi test exited with code: ' + code);
            }
            done();
        });

    });

};


