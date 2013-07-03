/*
Copyright (c) 2013, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/

/*jshint maxlen: 500 */

module.exports = function(grunt) {

    grunt.registerTask('yui', ['help']);

    grunt.registerTask('help', 'Show YUI Grunt Help', function() {
        grunt.log.ok('\nShowing YUI specific help commands\n'.white);
        grunt.log.writeln('');
        var help = [
            ['build', 'Build the entire library (and npm package) locally with ' + 'yogi'.magenta],
            ['release', 'Build a release (dist, cdn and npm)'],
            ['build-test', 'Build and test the entire library'],
            ['test', 'Test the library with ' + 'yogi'.magenta],
            ['test-cli', 'Test the library via CLI with ' + 'yogi'.magenta],
            ['travis', 'Perform a travis test (uses enviroment vars to determine tests)'],
            ['since-replace', 'Replaces @SINCE@ tokens in js files with *release-version*'],
            ['help', 'Show this stuffs']
        ], len = 0,
        pad = function(line) {
            for (var i = line.length; i < len; i++) {
                line += ' ';
            }
            return '  ' + line.yellow + '\t';
        }, opts = [
            ['--release-version=<VERSION>', 'Pass to set the version of the release ' + '(required for a release build)'.red],
            ['--release-build=<BUILD>', 'Pass to set the build number of the release, if not passed the git sha will be used.'],
            ['--cache-build', 'Cache the ' + 'shifter'.magenta + ' build.'.white]
        ];

        help.forEach(function(item) {
            var line = item[0];
            if (line.length > len) {
                len = line.length;
            }
        });

        help.forEach(function(item) {
            grunt.log.writeln(pad(item[0]) +  item[1].white);
        });

        grunt.log.writeln('');
        grunt.log.ok('Options:');
        grunt.log.writeln('');
        len = 0;

        opts.forEach(function(item) {
            var line = item[0];
            if (line.length > len) {
                len = line.length;
            }
        });

        opts.forEach(function(item) {
            grunt.log.writeln(pad(item[0]) +  item[1].white);
        });

    });

};
