/*
Copyright (c) 2013, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/
var path = require('path');

module.exports = function(grunt) {
    var start,
        VERSION;

    grunt.registerTask('since-replace', 'replace @SINCE@ with current release version', function(){
        var fileCount = 0,
        token = /@SINCE@/g;

        start = path.join(process.cwd(), 'src'); //only search src directory
        VERSION = grunt.config.get('version');

        grunt.log.writeln("@since @SINCE@ Replace starting...");
        grunt.log.writeln("Using release version: " + VERSION);

        grunt.file.recurse(start, function(abspath,rootdir,subdir,filename) {
            if(path.extname(filename) === '.js'){
                var content = grunt.file.read(abspath),
                    newContent,
                    contentMatch = content.match(token);

                if(contentMatch && contentMatch.length > 0){
                    grunt.log.writeln("Found " + contentMatch.length + " @SINCE@ token(s) in " + abspath);
                    fileCount++;
                    newContent = content.replace(token,VERSION);
                    grunt.file.write(abspath, newContent); //overwrite old file
                    grunt.log.writeln("Wrote " + VERSION + " to " + abspath);
                }

            }

        });

        grunt.log.writeln("@SINCE@ Replace done. Files changed: "+ fileCount);
    });

};
