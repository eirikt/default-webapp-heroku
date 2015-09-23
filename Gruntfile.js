module.exports = function(grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
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
                    'ECHO    grunt clean             Removes all built stuff',
                    'ECHO    grunt js:lint           Runs JSHint',
                    'ECHO.',
                    'ECHO    grunt build:dev         Builds the web application',
                    'ECHO    grunt build:prod        Builds the web application for production environment',
                    'ECHO.',
                    'ECHO    grunt watch:client      Monitors all client code, runs \'build:dev\' on every change, refreshes page      (blocking command)',
                    'ECHO    grunt watch:server      Monitors all server code, restart server on every change                        (blocking command)',
                    'ECHO.',
                    'ECHO.',
                    'ECHO Other commands are:',
                    'ECHO.',
                    'ECHO    node server/scripts/server.js      Start web application locally (using latest built configuration)',
                    'ECHO    heroku local -p 8000               Start web application locally with production configuration'
                ].join('&&')
            }
        },

        clean: {
            build: {
                src: [
                    'build/client/scripts/vendor',
                    'build/client/scripts',
                    'build/client/styles',
                    'build/client',
                    'build'
                ]
            },
            public: {
                src: [
                    'public/scripts',
                    'public/styles',
                    'public'
                ]
            }
        },

        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'client',
                    src: ['favicon.ico', 'images/*', 'scripts/*'],
                    dest: 'build/client'
                }, {
                    expand: true,
                    cwd: 'node_modules/socket.io/node_modules/socket.io-client',
                    src: ['socket.io.js'],
                    dest: 'build/client/scripts/vendor'
                }]
            },
            'public': {
                files: [{
                    expand: true,
                    cwd: 'client',
                    src: ['manifest.appcache'],
                    dest: 'public'
                }, {
                    expand: true,
                    cwd: 'build/client',
                    src: ['favicon.ico', 'images/*', 'styles/*'],
                    dest: 'public'
                }]
            }
        },

        processhtml: {
            options: {
                data: {
                    id: '<%= pkg.name %>',
                    name: '<%= pkg.description %>',
                    version: '<%= pkg.version %>',
                    timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
                }
            },
            dev: {
                files: {
                    'build/client/index.html': ['client/index.html']
                }
            },
            prod: {
                files: {
                    'build/client/index.html': ['client/index.html']
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
                    'public/index.html': ['build/client/index.html']
                }
            }
        },

        sass: {
            options: {
                sourcemap: 'none'
            },
            build: {
                files: {
                    'build/client/styles/app.css': 'client/styles/app.scss'
                }
            }
        },

        jshint: {
            options: {
                jshintrc: true,
                reporter: 'checkstyle'
            },
            all: ['Gruntfile.js', 'server/scripts/*.js']
        },

        uglify: {
            prod: {
                files: {
                    'public/scripts/app.min.js': [
                        'build/client/scripts/vendor/socket.io.js',
                        'build/client/scripts/app-appcache.js',
                        'build/client/scripts/app-socketio.js'
                    ]
                }
            }
        },

        watch: {
            client: {
                options: {
                    atBegin: true,
                    livereload: true
                },
                files: ['Gruntfile.js', 'client/index.html', 'client/styles/app.scss'],
                tasks: ['build:dev']
            }
        },

        nodemon: {
            server: {
                script: 'server/scripts/server.js'
            }
        }
    });

    grunt.registerTask('compile:html:dev', ['processhtml:dev']);
    grunt.registerTask('compile:html:prod', ['processhtml:prod', 'htmlmin:prod']);

    grunt.registerTask('css:lint', ['scsslint']);
    grunt.registerTask('compile:css:dev', ['sass']);
    grunt.registerTask('compile:css:prod', ['compile:css:dev']);

    grunt.registerTask('js:lint', ['jshint']);

    //grunt.registerTask('watch:client'); // supported directly by plugin
    grunt.registerTask('watch:server', ['nodemon:server']);

    grunt.registerTask('build:dev', ['copy:build', 'compile:html:dev', 'compile:css:dev']);
    grunt.registerTask('build:prod', ['js:lint', 'copy:build', 'compile:html:prod', 'compile:css:prod', 'uglify', 'copy:public']);
    grunt.registerTask('build:travis', ['build:prod']);

    grunt.registerTask('default', ['shell:help']);
};
