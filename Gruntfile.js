module.exports = function(grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-shell');

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

        processhtml: {
            main: {
                options: {
                    data: {
                        name: '<%= pkg.description %>',
                        version: '<%= pkg.version %>',
                        timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
                    }
                },
                files: {
                    'public/index.html': ['public/index.html']
                }
            }
        }
    });

    grunt.registerTask('build', ['copy', 'processhtml']);

    grunt.registerTask('default', ['shell:help']);
};
