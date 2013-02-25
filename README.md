Grunt YUI Contrib
=================

Various Grunt tasks used to within the YUI Project.

Usage
-----

```
>> 
>> Showing YUI specific help commands
>> 

  build         Build the entire library (and npm package) locally with yogi
  release       Build a release (dist, cdn and npm)
  build-test    Build and test the entire library
  test          Test the library with yogi
  test-cli      Test the library via CLI with yogi
  travis        Perform a travis build and test (uses enviroment vars to determine tests)
  help          Show this stuffs

>> Options:

  --release-version=<VERSION>   Pass to set the version of the release (required for a release build)
  --release-build=<BUILD>       Pass to set the build number of the release, if not passed the git sha will be used.
  --cache-build                 Cache the shifter build.
```

Build Status
------------

[![Build Status](https://secure.travis-ci.org/yui/grunt-yui-contrib.png?branch=master)](http://travis-ci.org/yui/grunt-yui-contrib)
