'use strict';
 
module.exports = function( grunt )  {  // (1) : export
  // (2) : task configuration
  grunt.initConfig ({
     less : { 
      development : { 
        options : { 
          paths : [ "less" ] 
        } ,
        files : { 
          "css/jquery.mobile.multibuttonentry.css" : "css/jquery.mobile.multibuttonentry.less" 
        } 
      } ,
      production : { 
        options : { 
          paths : [ "less" ] ,
          yuicompress : true 
        } ,
        files : { 
          "dist/jquery.mobile.multibuttonentry.min.css" : "css/jquery.mobile.multibuttonentry.less" 
        } 
      } 
    } ,
    concat : {
      'dist/multibuttonentryWidget.js' : ['js/*.js'],
      'dist/multibuttonentryWidget.css' : ['css/jquery.mobile.multibuttonentry.css', 'css/jquery.mobile-1.3.2.css']
    } ,
    jshint : {
      options :  {
        "jquery": true,
        "boss": true,
        "curly": true,
        "eqeqeq": true,
        "eqnull": true,
        "expr": true,
        "immed": true,
        "noarg": true,
        "onevar": true,
        "quotmark": "double",
        "smarttabs": true,
        "trailing": true,
        "undef": true,
        "unused": true,
        "latedef": true,
        "newcap": true,
        "sub": true,
        "browser": true,
        "globals": {
                "define": false,
                "require": false,
                "requirejs": false
        }
      },
      files : {
        src : ['js/jquery.mobile.multibuttonentry.js']
      }
    }
  });
 
  // (3) : load plugin task (s)
  grunt.loadNpmTasks ( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks ( 'grunt-contrib-less' );
  grunt.loadNpmTasks ( 'grunt-contrib-concat' );
 
  // (4) : register default task (s)
  grunt.registerTask ('default',  ['jshint', 'less:development', 'concat']);
};