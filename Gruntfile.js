module.exports = function(grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            help: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true
                },
                command: [
                    'ECHO.',
                    'ECHO ########################################',
                    'ECHO ###   <%= pkg.name %> v<%= pkg.version %>   ###',
                    'ECHO ########################################',
                    'ECHO.',
                    'ECHO Essential Grunt tasks are:',
                    'ECHO.',
                    'ECHO      build     Builds the web application ready for deployment'
                ].join('&&')
            }
        },

        copy: {
            public: {
                files: [{
                    expand: true,
                    src: 'index.html',
                    dest: 'public'
                }]
            }
        },
    });

    grunt.registerTask('help', ['shell:help']);
    grunt.registerTask('build', ['copy']);

    grunt.registerTask('default', ['help']);
};
