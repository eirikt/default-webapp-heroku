module.exports = function(grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-nodemon');
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
                    'ECHO #######################################',
                    'ECHO ##   <%= pkg.name %> v<%= pkg.version %>',
                    'ECHO #######################################',
                    'ECHO.',
                    'ECHO Essential Grunt tasks are:',
                    'ECHO.',
                    'ECHO    grunt clean              Removes all built stuff',
                    'ECHO.',
                    'ECHO    grunt build:dev          Builds the web application',
                    'ECHO    grunt build:prod         Builds the web application for production environment',
                    'ECHO.',
                    'ECHO    watch:client             Monitors all client code, runs \'build:dev\' on every change, refreshes page    (blocking command)',
                    'ECHO    watch:server             Monitors all server code, restart server on every change                      (blocking command)',
                    'ECHO.',
                    'ECHO.',
                    'ECHO Other commands are:',
                    'ECHO.',
                    'ECHO    node server.js           Start web application locally (using latest built configuration)',
                    'ECHO    heroku local -p 8000     Start web application locally with production configuration'
                ].join('&&')
            }
        },

        mkdir: {
            build: {
                options: {
                    create: ['build/client']
                },
            },
            public: {
                options: {
                    create: ['public']
                },
            },
        },

        clean: {
            build: {
                src: ['build']
            },
            public: {
                src: ['public']
            }
        },

        copy: {
            build: {
                files: [{
                    expand: true,
                    src: ['favicon.ico'],
                    dest: 'build'
                }]
            },
            public: {
                files: [{
                    expand: true,
                    cwd: 'build/client',
                    src: ['index.html', 'favicon.ico'],
                    dest: 'public'
                }]
            }
        },

        processhtml: {
            dev: {
                options: {
                    data: {
                        name: '<%= pkg.description %>',
                        version: '<%= pkg.version %>',
                        timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
                    }
                },
                files: {
                    'build/client/index.html': ['index.html']
                }
            },
            prod: {
                files: {
                    'build/client/index.html': ['index.html']
                }
            }
        },

        htmlmin: {
            prod: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'build/client/index.html': 'build/client/index.html'
                }
            }
        },

        watch: {
            client: {
                options: {
                    atBegin: true,
                    livereload: true
                },
                files: ['Gruntfile.js', 'index.html'],
                tasks: ['build:dev']
            }
        },

        nodemon: {
            server: {
                script: 'server.js'
            }
        }
    });

    grunt.registerTask('compile:html:dev', ['processhtml:dev']);
    grunt.registerTask('compile:html:prod', ['processhtml:prod', 'htmlmin:prod']);

    //grunt.registerTask('watch:client', ['watch:client']);
    grunt.registerTask('watch:server', ['nodemon:server']);

    grunt.registerTask('build:init', ['clean', 'mkdir', 'copy:build']);
    grunt.registerTask('build:dev', ['build:init', 'compile:html:dev', 'copy:public']);
    grunt.registerTask('build:prod', ['build:init', 'compile:html:prod', 'copy:public']);

    grunt.registerTask('default', ['shell:help']);
};
