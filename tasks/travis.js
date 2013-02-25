/*
Copyright (c) 2013, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/

module.exports = function(grunt) {
    grunt.registerTask('travis', 'Perform a travis build', function() {
        grunt.task.run('build');
        if (process.env.TRAVIS_NODE_VERSION === '0.8') {
            grunt.task.run('test');
        } else {
            grunt.task.run('test-cli');
        }
    });
};
