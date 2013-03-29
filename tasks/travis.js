/*
Copyright (c) 2013, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/

module.exports = function(grunt) {
    grunt.registerTask('travis', 'Perform a travis build', function() {
        //If travis node version is 0.10.x we should run all the tests
        //otherwise only run the CLI tests.
        var task = ((process.env.TRAVIS_NODE_VERSION === '0.10') ? 'test' : 'test-cli');
        grunt.task.run(task);
    });
};
