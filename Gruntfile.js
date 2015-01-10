var _ = require('lodash');

module.exports = function(grunt) {
	"use strict";

    var tasksConfig = grunt.file.readJSON( "GruntTasks.json" );

    tasksConfig["__loadNpmTasks__"].forEach(function(taskName){
        grunt.loadNpmTasks(taskName);
    });

	grunt.initConfig(_.extend({ pkg: grunt.file.readJSON( "package.json" ) }, tasksConfig));
  grunt.registerTask( "default", [ "jshint", "clean", "copy:assets", "browserify", "extract_sourcemap", "concat"] );
};
