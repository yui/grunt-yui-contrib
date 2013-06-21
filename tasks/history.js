/*
Copyright (c) 2013, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/
var path = require('path'),
    exec = require('child_process').spawn;


module.exports = function(grunt) {
    var start,
        VERSION,
        historyName = "HISTORY.md",
              token = /@VERSION@/gi,
          noChanges = /No changes./,
                key = "\n3.";

    grunt.registerTask('history-rollup', 'Create the history rollup file.', function(){

        var output = '',
        rollupName = "HISTORYROLLUP.md",
         fileCount = 0,
        destination;

        start = path.join(process.cwd(), 'src');
        destination = path.join(process.cwd(), rollupName);
        VERSION = grunt.config.get('version');


        grunt.log.writeln("History Rollup Creation starting...");
        grunt.log.writeln("Starting in: "+start);

        grunt.file.recurse(start, function(abspath,rootdir,subdir,filename){
            if(filename === historyName){
                var content = grunt.file.read(abspath);
                content = content.split(key)[0];
                //grunt.log.writeln(content);

                if(content && content.search(token) && content.search(noChanges) == -1){
                    grunt.log.writeln("Found content in " + abspath);
                    grunt.log.writeln(">>> adding to buffer");
                    output += "\n" +content;
                    fileCount++;
                }
            }


        });

        // report findings
        grunt.log.writeln("Finished scanning files.");
        grunt.log.writeln("Added "+ fileCount + " entries.");

        // done recursing now write to file
        if(output !== ""){
            grunt.file.write(destination, output);
            grunt.log.writeln("Wrote to file: " + destination);
        }



    });

    grunt.registerTask('history-populate', 'Populate history files with @VERSION@ if not there already.', function (){
        var nochanges = "\n@VERSION@\n------\n\n* No changes.\n",
            fileCount = 0,
            content,
            newContent,
            contArr;

        start = path.join(process.cwd(), 'src');

        grunt.log.writeln("History Populate starting...");


        grunt.file.recurse(start, function(abspath,rootdir,subdir,filename){
            if(filename === historyName){
                content = grunt.file.read(abspath);

                if(content.match(token) !== null){
                    grunt.log.writeln("Found a @VERSION@ in " + abspath + " skipping...");
                } else {
                    grunt.log.writeln("No @VERSION@ found. Adding to : " + abspath);
                    contArr = content.split(key);
                    grunt.log.writeln(contArr.length);
                    contArr[0] = contArr[0] + nochanges; // add new history entry.
                    newContent = contArr.join(key);
                    grunt.file.write(abspath, newContent); //overwrite old HISTORY.md
                    fileCount++;
                }
            }
        });

        grunt.log.writeln("History Populate done. Files changed: "+ fileCount);



    });

    grunt.registerTask('history-replace', 'Replace @VERSION@ with current release version.', function(){
        var fileCount = 0;

        start = path.join(process.cwd(), 'src');
        VERSION = grunt.config.get('version');

        grunt.log.writeln("History Version Replace starting...");
        grunt.log.writeln("Using release version: " + VERSION);

        grunt.file.recurse(start, function(abspath,rootdir,subdir,filename){
            if(filename === historyName){
                var content = grunt.file.read(abspath),
                    newContent,
                    contentMatch = content.match(token);

                if(contentMatch){
                    if(contentMatch.length == 1){
                        grunt.log.writeln("Found exactly 1 @VERSION@ in " + abspath);

                        newContent = content.replace(token,VERSION);
                        grunt.file.write(abspath, newContent); //overwrite old HISTORY.md
                        grunt.log.writeln("Wrote " + VERSION + " to " + abspath);
                        fileCount++;

                    } else {
                        grunt.log.error("Found " + contentMatch.length + " @VERSION@'s in " + abspath + " skipping...");
                    }

                } else {
                    grunt.log.error("Found 0 @VERSION@'s in " + abspath + " skipping...");
                }
            }
        });

        grunt.log.writeln("History Version Replace done. Files changed: "+ fileCount);

    });






};

