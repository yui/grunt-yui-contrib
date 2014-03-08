/*
Copyright (c) 2013, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/

module.exports = function(grunt) {
    // The `artifacts` directory will usually only ever in YUI's CI system.
    // If you're in CI, `build-npm` exists, and this task was called in
    // response to the `postinstall` hook; skip the build.
    if ((process.env.npm_lifecycle_event === "postinstall" && grunt.file.exists('artifacts') && grunt.file.exists('build-npm')) || 'GRUNT_SKIP_BUILD' in process.env) {
        grunt.registerTask('build', 'Building YUI', function() {
            grunt.log.ok('Found GRUNT_SKIP_BUILD in environment, skipping build.');
        });
    } else {
        grunt.registerTask('build', 'Building YUI', ['yogi-build', 'npm']);
    }
    grunt.registerTask('build-test', 'Building and testing YUI', ['yogi-build', 'npm', 'test']);
    grunt.registerTask('all', 'Building and testing YUI', ['build-test']);
};

