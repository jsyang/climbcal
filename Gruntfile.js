module.exports = function (grunt) {
    "use strict";

    var tasksConfig = grunt.file.readJSON("GruntTasks.json");

    tasksConfig["__loadNpmTasks__"].forEach(function (taskName) {
        grunt.loadNpmTasks(taskName);
    });

    var config = { pkg: grunt.file.readJSON("package.json") };

    for (var key in tasksConfig) {
        config[key] = tasksConfig[key];
    }

    grunt.initConfig(config);

    grunt.registerTask("build-minified",  [ "jshint", "clean", "copy:assets", "browserify:build", "uglify", "sass:build", "cssmin"]);
    grunt.registerTask("default", [ "jshint", "clean", "copy:assets", "browserify:dev", "extract_sourcemap", "sass:dev"]);
};
