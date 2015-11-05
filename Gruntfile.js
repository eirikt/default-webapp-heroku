/* global module, require */

/* eslint-disable global-require */
/* eslint-disable spaced-comment */

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-cssnano');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-scss-lint');
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
                    'ECHO    grunt lint:js           Runs JSHint and ESLint',
                    'ECHO    grunt lint:css          Runs SCSS Lint',
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
                    src: ['favicon.ico', 'images/*'],
                    dest: 'build/client'
                }]
            },
            public: {
                files: [{
                    expand: true,
                    cwd: 'client',
                    src: ['manifest.appcache'],
                    dest: 'public'
                }, {
                    expand: true,
                    cwd: 'build/client',
                    src: ['favicon.ico', 'images/*'],
                    dest: 'public'
                }]
            }
        },

        scsslint: {
            options: {
                config: '.scss-lint.yml'
            },
            build: 'client/styles/**/*.scss'
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

        /* eslint-disable no-inline-comments */
        postcss: {
            options: {
                syntax: require('postcss-scss'),
                parser: require('postcss-safe-parser'),
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 2 version']
                    }) // Deactivated, trouble when deploying on Node.js 4.1.2 ...
                    //require('postcss-colorblind')({
                    //    // See: https://github.com/btholt/postcss-colorblind
                    //    method: 'Achromatomaly'
                    //})
                ]
            },
            build: {
                src: 'build/client/styles/app.css'
            }
        },

        cssnano: {
            prod: {
                files: {
                    'public/styles/app.min.css': 'build/client/styles/app.css'
                }
            }
        },

        jshint: {
            options: {
                jshintrc: true,
                reporter: 'checkstyle'
            },
            all: [
                'Gruntfile.js',
                'client/scripts/**/*.js',
                'server/scripts/**/*.js'
            ]
        },

        eslint: {
            client: {
                options: {
                    configFile: '.eslintrc-client.json'
                },
                src: [
                    'Gruntfile.js',
                    'client/scripts/**/*.jsx',
                    'client/scripts/**/*.js'
                ]
            },
            'client-dump': {
                options: {
                    configFile: '.eslintrc-client.json',
                    format: require('eslint-json'),
                    outputFile: './build/analysis/eslint-client-dump.json'
                },
                src: [
                    'Gruntfile.js',
                    'client/scripts/**/*.jsx',
                    'client/scripts/**/*.js'
                ]
            },
            server: {
                options: {
                    configFile: '.eslintrc-server.json'
                },
                src: [
                    'server/scripts/**/*.js'
                ]
            } //,
            // Not feasable (mostly due to browserify) ... put the effort on testing/specifications
            //'client-build': {
            //    options: {
            //        configFile: '.eslintrc-client-transpiled.json'
            //    },
            //    src: ['build/client/scripts/app.js']
            //},
        },

        browserify: {
            build: {
                options: {
                    transform: [
                        [
                            'babelify', {
                                whitelist: [
                                    'es6.arrowFunctions',
                                    'es6.blockScoping',
                                    'es6.classes',
                                    'es6.constants',
                                    'es6.destructuring',
                                    'es6.modules',
                                    'react'
                                ]
                            }
                        ]
                    ]
                },
                files: {
                    'build/client/scripts/app.js': [
                        'client/scripts/app-socketio.js',
                        'client/scripts/title.jsx',
                        'client/scripts/app.jsx'
                    ]
                }
            }
        },

        uglify: {
            prod: {
                files: {
                    'public/scripts/app.min.js': [
                        'build/client/scripts/vendor/socket.io.js',
                        'build/client/scripts/app.js'
                    ]
                }
            }
        },

        processhtml: {
            options: {
                data: {
                    id: '<%= pkg.name %>',
                    name: '<%= pkg.description %>',
                    version: '<%= pkg.version %>',
                    timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
                    eslintErrors: (function() {
                        var jsonfile = require('jsonfile'),
                            eslintResultsExist = grunt.file.exists('./build/analysis/eslint-results.json'),
                            eslintResults;
                        if (eslintResultsExist) {
                            eslintResults = jsonfile.readFileSync('./build/analysis/eslint-results.json');
                            return eslintResults[0].data.errors;
                        } else {
                            return '(unknown)';
                        }
                    }()),
                    eslintWarnings: (function() {
                        var jsonfile = require('jsonfile'),
                            eslintResultsExist = grunt.file.exists('./build/analysis/eslint-results.json'),
                            eslintResults;
                        if (eslintResultsExist) {
                            eslintResults = jsonfile.readFileSync('./build/analysis/eslint-results.json');
                            return eslintResults[0].data.warnings;
                        } else {
                            return '(unknown)';
                        }
                    }())

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

        watch: {
            'client-step1-analysis': {
                options: {
                    atBegin: true,
                    livereload: false
                },
                files: [
                    'Gruntfile.js',
                    'client/index.html',
                    'client/**/*.js',
                    'client/**/*.jsx',
                    'client/**/*.scss'
                ],
                tasks: ['build:analysis']
            },
            'client-step2-build': {
                options: {
                    atBegin: true,
                    livereload: true
                },
                files: [
                    'build/analysis/eslint-results.json'
                ],
                tasks: ['build:dev']
            }
        },

        nodemon: {
            server: {
                script: 'server/scripts/server.js'
            }
        }
    });


    // Grunt task for (temporarily) disable/enable forced continuation of execution
    grunt.registerTask('force', function(set) {
        if (set === 'on') {
            grunt.option('force', true);
        } else {
            grunt.option('force', false);
        }
    });

    // Grunt task for ...
    grunt.registerTask('eslint:export', 'Extracting interesting data out of ESLint dump.', function() {
        var jsonfile = require('jsonfile'),
            project = grunt.file.readJSON('package.json'),
            eslintDump = grunt.file.readJSON('./build/analysis/eslint-client-dump.json'),
            eslintResultFile = './build/analysis/eslint-results.json',
            eslintResultFileContent,
            currentEslintResult = {
                project: project.name,
                type: 'ESLint (static analysis: application client source code)',
                timestamp: new Date().toJSON(),
                data: {
                    errors: 0,
                    warnings: 0
                }
            };
        if (grunt.file.exists(eslintResultFile)) {
            grunt.log.writeln('eslintResultFile EXISTS!');
            eslintResultFileContent = jsonfile.readFileSync(eslintResultFile);

        } else {
            grunt.log.writeln('eslintResultFile DOES NOT EXIST!');
            eslintResultFileContent = [];
        }
        grunt.log.writeln('eslintResultFileContent.length: ' + eslintResultFileContent.length);
        eslintDump.results.forEach(function(fileResult/*, index, array*/) {
            currentEslintResult.data.errors += fileResult.errorCount;
            currentEslintResult.data.warnings += fileResult.warningCount;
        });
        eslintResultFileContent.unshift(currentEslintResult);
        jsonfile.writeFileSync(eslintResultFile, eslintResultFileContent, { spaces: 4 });
        grunt.log.write('ESLint errors and warnings extracted... ').ok();
    });


    grunt.registerTask('lint:css', ['scsslint']);
    grunt.registerTask('compile:css:dev', ['sass', 'postcss']);
    grunt.registerTask('compile:css:prod', ['compile:css:dev', 'cssnano']);

    grunt.registerTask('lint:js', ['jshint', 'eslint:client', 'eslint:server']);
    grunt.registerTask('compile:js', ['browserify']);

    grunt.registerTask('compile:html:dev', ['processhtml:dev']);
    grunt.registerTask('compile:html:prod', ['processhtml:prod', 'htmlmin:prod']);

    grunt.registerTask('build:analysis', ['force:on', 'eslint:client-dump', 'force:off', 'eslint:export']);
    grunt.registerTask('build:dev', ['copy:build', 'compile:css:dev', 'compile:js', 'compile:html:dev']);
    grunt.registerTask('build:prod', ['lint:css', /*'lint:js', */'copy:build', 'compile:css:prod', 'compile:js', 'uglify', 'compile:html:prod', 'copy:public']);
    grunt.registerTask('build:travis', ['build:prod']);

    grunt.registerTask('watch:client1', ['watch:client-step1-analysis']);
    grunt.registerTask('watch:client2', ['watch:client-step2-build']);
    grunt.registerTask('watch:server', ['nodemon:server']);

    grunt.registerTask('default', ['shell:help']);
};
