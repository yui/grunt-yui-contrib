/*
Copyright (c) 2013, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/

var bower = require('bower');

module.exports = function (grunt) {
    grunt.registerTask('bower-install', 'Installs Bower dependencies.', function () {
        var done = this.async();

        bower.commands.install()
            .on('log', function (data) {
                if (data.id !== 'install') { return; }
                grunt.log.writeln('bower ' + data.id.cyan + ' ' + data.message);
            })
            .on('end', function (results) {
                if (!Object.keys(results).length) {
                    grunt.log.writeln('No bower packages to install.');
                }

                done();
            });
    });
};
