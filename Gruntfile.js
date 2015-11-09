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
                    'ECHO    grunt watch:client1     Monitors analysis result files, runs \'build:dev\' on every change, refreshes page      (blocking command)',
                    'ECHO    grunt watch:client2     Monitors most client source code, runs all analysis tasks on every change             (blocking command)',
                    'ECHO    grunt watch:server      Monitors all server source code, restart server on every change                       (blocking command)',
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
            build: [
                'build/client/scripts/vendor',
                'build/client/scripts',
                'build/client/styles',
                'build/client',
                'build'
            ],
            public: [
                'public/scripts',
                'public/styles',
                'public'
            ]
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
                colorizeOutput: true,
                config: '.scss-lint.yml',
                reporterOutput: './build/analysis/scsslint-dump.xml'
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
            files: [
                'Gruntfile.js',
                'client/scripts/**/*.js',
                'server/scripts/**/*.js'
            ]
        },

        eslint: {
            'client': {
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
            // Not feasable (mostly due to browserify) ... put the effort on testing/specifications
            //'client-build': {
            //    options: {
            //        configFile: '.eslintrc-client-transpiled.json'
            //    },
            //    src: ['build/client/scripts/app.js']
            //},
            'server': {
                options: {
                    configFile: '.eslintrc-server.json'
                },
                src: [
                    'server/scripts/**/*.js'
                ]
            },
            'server-dump': {
                options: {
                    configFile: '.eslintrc-server.json',
                    format: require('eslint-json'),
                    outputFile: './build/analysis/eslint-server-dump.json'
                },
                src: ['server/scripts/**/*.js']
            } //,
            // Not feasable (mostly due to browserify) ... put the effort on testing/specifications
            //'server-build': {
            //    options: {
            //        configFile: '.eslintrc-server-transpiled.json'
            //    },
            //    src: ['build/server/scripts/server.js']
            //},
        },

        browserify: {
            build: {
                options: {
                    transform: [
                        ['babelify', {
                            presets: ['es2015', 'react'],
                            plugins: ['transform-es2015-modules-commonjs']
                        }]
                    ]
                },
                files: {
                    'build/client/scripts/app.js': [
                        'client/scripts/app-socketio.js',
                        'client/scripts/app.jsx'
                    ]
                }
            }
        },

        uglify: {
            options: {
                screwIE8: true
            },
            prod: {
                files: {
                    'public/scripts/app.min.js': [
                        'build/client/scripts/vendor/socket.io.js',
                        'build/client/scripts/app.js'
                    ]
                }
            }
        },

        /* eslint-disable no-sync */
        processhtml: {
            options: {
                data: {
                    id: '<%= pkg.name %>',
                    name: '<%= pkg.description %>',
                    version: '<%= pkg.version %>',
                    timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
                    eslintErrors: (function() {
                        const jsonfile = require('jsonfile');
                        const eslintResultsExist = grunt.file.exists('./build/analysis/eslint.json');
                        const eslintResults = (eslintResultsExist) ? jsonfile.readFileSync('./build/analysis/eslint.json') : null;

                        return (eslintResultsExist) ? eslintResults[0].data.errors : '(unknown)';
                    }()),
                    eslintWarnings: (function() {
                        const jsonfile = require('jsonfile');
                        const eslintResultsExist = grunt.file.exists('./build/analysis/eslint.json');
                        const eslintResults = (eslintResultsExist) ? jsonfile.readFileSync('./build/analysis/eslint.json') : null;

                        return (eslintResultsExist) ? eslintResults[0].data.warnings : '(unknown)';
                    }()),
                    scsslintWarnings: (function() {
                        const jsonfile = require('jsonfile');
                        const scsslintResultsExist = grunt.file.exists('./build/analysis/scsslint.json');
                        const scsslintResults = (scsslintResultsExist) ? jsonfile.readFileSync('./build/analysis/scsslint.json') : null;

                        return (scsslintResultsExist) ? scsslintResults[0].data.warnings : '(unknown)';
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
                    '!build',
                    '!public',
                    '.jshintrc',
                    '.eslintrs-client.json',
                    '.eslintrs-server.json',
                    '.scss-lint.yml',
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
                    atBegin: false,
                    livereload: true
                },
                files: [
                    'build/analysis/eslint.json',
                    'build/analysis/scsslint.json'
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
    /* eslint complexity: [2, 2] */
    grunt.registerTask('force', (set) => {
        if (set === 'on') {
            grunt.option('force', true);
        } else {
            grunt.option('force', false);
        }
    });


    // Grunt task for ...
    /* eslint complexity: [2, 3] */
    grunt.registerTask('scsslint:export', 'Extracting interesting data out of sccs-lint dumps', () => {
        const project = grunt.file.readJSON('package.json');
        const scsslintDump = grunt.file.read('./build/analysis/scsslint-dump.xml');
        const scsslintResultFile = './build/analysis/scsslint.json';
        const scsslintResultFileContent = (grunt.file.exists(scsslintResultFile)) ? JSON.parse(grunt.file.read(scsslintResultFile)) : [];
        const currentScsslintResult = {
            project: project.name,
            type: 'scss-lint (static analysis: application style sheet (in SCSS) source code)',
            timestamp: new Date().toJSON(),
            data: {
                warnings: 0
            }
        };
        const indexOfErrorCountStart = scsslintDump.indexOf('errors=') + 'errors="'.length;
        const indexOfErrorCountEnd = scsslintDump.indexOf('"', indexOfErrorCountStart);
        const warnings = scsslintDump.substring(indexOfErrorCountStart, indexOfErrorCountEnd);

        currentScsslintResult.data.warnings = warnings;
        scsslintResultFileContent.unshift(currentScsslintResult);
        grunt.file.write(scsslintResultFile, JSON.stringify(scsslintResultFileContent));

        grunt.log.write('scss-lint warnings extracted... ').ok();
    });


    // Grunt task for ...
    /* eslint complexity: [2, 3] */
    grunt.registerTask('eslint:export', 'Extracting interesting data out of ESLint dumps', () => {
        const jsonfile = require('jsonfile');
        const project = grunt.file.readJSON('package.json');
        const eslintClientDump = grunt.file.readJSON('./build/analysis/eslint-client-dump.json');
        const eslintServerDump = grunt.file.readJSON('./build/analysis/eslint-server-dump.json');
        const eslintResultFile = './build/analysis/eslint.json';
        const eslintResultFileContent = (grunt.file.exists(eslintResultFile)) ? jsonfile.readFileSync(eslintResultFile) : [];
        const currentEslintResult = {
            project: project.name,
            type: 'ESLint (static analysis: application JavaScript (in ECMAScript 2015) source code)',
            timestamp: new Date().toJSON(),
            data: {
                errors: 0,
                warnings: 0
            }
        };

        eslintClientDump.results.forEach((fileResult/*, index, array*/) => {
            currentEslintResult.data.errors += fileResult.errorCount;
            currentEslintResult.data.warnings += fileResult.warningCount;
        });
        eslintServerDump.results.forEach((fileResult/*, index, array*/) => {
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

    grunt.registerTask('build:analysis', ['force:on', 'lint:css', 'eslint:client-dump', 'eslint:server-dump', 'force:off', 'scsslint:export', 'eslint:export']);
    grunt.registerTask('build:dev', ['copy:build', 'compile:css:dev', 'compile:js', 'compile:html:dev']);
    grunt.registerTask('build:prod', ['copy:build', 'compile:css:prod', 'compile:js', 'uglify', 'compile:html:prod', 'copy:public']);
    grunt.registerTask('build:travis', ['build:prod']);

    grunt.registerTask('watch:client1', ['watch:client-step2-build']);
    grunt.registerTask('watch:client2', ['watch:client-step1-analysis']);
    grunt.registerTask('watch:server', ['nodemon:server']);

    grunt.registerTask('default', ['shell:help']);
};
