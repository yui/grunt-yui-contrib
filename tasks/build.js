/*
Copyright (c) 2013, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/

module.exports = function(grunt) {
    if ('GRUNT_SKIP_BUILD' in process.env) {
        grunt.registerTask('build', 'Building YUI', function() {
            grunt.log.ok('Found GRUNT_SKIP_BUILD in environment, skipping build.');
        });
    } else {
        grunt.registerTask('build', 'Building YUI', ['yogi-build', 'npm']);
    }
    grunt.registerTask('build-test', 'Building and testing YUI', ['yogi-build', 'npm', 'test']);
    grunt.registerTask('all', 'Building and testing YUI', ['build-test']);
};

