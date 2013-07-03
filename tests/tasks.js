var vows = require('vows'),
    assert = require('assert'),
    path = require('path'),
    fs  = require('fs'),
    grunt = require('grunt');

grunt.loadTasks(path.join(__dirname, '../tasks'));

var tasks = [];

grunt.task.init([], {help: true});
Object.keys(grunt.task._tasks).forEach(function(name) {
    tasks.push(name);
});

tasks.sort();

//This is a placeholder to ensure we are exporting all defined tasks
var tests = {
    'should export tasks': {
        topic: function() {
            return tasks.length;
        },
        'and find 41 tasks': function(topic) {
            assert.equal(41, topic);
        }
    }
};


tasks.forEach(function(name) {
    tests['should have ' + name] = {
        topic: function() {
            return grunt.task._tasks[name]
        },
        'should be an object': function(topic) {
            assert.isObject(topic);
        }
    };
});


vows.describe('tasks').addBatch(tests).export(module);
