/*
Copyright (c) 2013, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/

module.exports = function(grunt) {
    grunt.registerTask('build', 'Building YUI', ['yogi-build', 'npm']);
    grunt.registerTask('build-test', 'Building and testing YUI', ['yogi-build', 'npm', 'test']);
    grunt.registerTask('all', 'Building and testing YUI', ['build-test']);
};

