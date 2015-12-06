/* global module, require */

/* eslint-disable no-extra-parens */
/* eslint-disable global-require */
/* eslint-disable spaced-comment */

/* eslint complexity: [1, 1] */

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-cssnano');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-scss-lint');

    grunt.initConfig({
        project: grunt.file.readJSON('package.json'),

        clean: {
            build: [
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

        eslint: {
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
            },
            // Not feasable (mostly due to browserify) ... put the effort on testing/specifications instead
            //'server-build': {
            //    options: {
            //        configFile: '.eslintrc-server-transpiled.json'
            //    },
            //    src: ['build/server/scripts/server.js']
            //},
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
            }
            // Not feasable (mostly due to browserify) ... put the effort on testing/specifications instead
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
                    id: '<%= project.name %>',
                    name: '<%= project.description %>',
                    version: '<%= project.version %>',
                    timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
                    eslintErrors: (function() {
                        const eslintResultsExist = grunt.file.exists('./build/analysis/eslint.json');
                        const eslintResults = (eslintResultsExist) ? require('jsonfile').readFileSync('./build/analysis/eslint.json') : null;

                        return (eslintResultsExist) ? eslintResults[0].data.errors : '?';
                    }()),
                    eslintWarnings: (function() {
                        const eslintResultsExist = grunt.file.exists('./build/analysis/eslint.json');
                        const eslintResults = (eslintResultsExist) ? require('jsonfile').readFileSync('./build/analysis/eslint.json') : null;

                        return (eslintResultsExist) ? eslintResults[0].data.warnings : '?';
                    }()),
                    scsslintWarnings: (function() {
                        const scsslintResultsExist = grunt.file.exists('./build/analysis/scsslint.json');
                        const scsslintResults = (scsslintResultsExist) ? require('jsonfile').readFileSync('./build/analysis/scsslint.json') : null;

                        return (scsslintResultsExist) ? scsslintResults[0].data.warnings : '?';
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
            step1: {
                options: {
                    atBegin: false,
                    livereload: false
                },
                files: [
                    '.eslintrs-client.json',
                    '.eslintrs-server.json',
                    '.scss-lint.yml',
                    'client/**/*',
                    'server/**/*',
                    'Gruntfile.js',
                    'package.json'
                ],
                tasks: ['build:analysis']
            },
            step2: {
                options: {
                    atBegin: true,
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


    grunt.registerTask('help', () => {
        const project = grunt.file.readJSON('package.json');

        grunt.log.writeln();
        grunt.log.writeln('#######################################');
        grunt.log.writeln('##   ' + project.name + ' v' + project.version);
        grunt.log.writeln('#######################################');
        grunt.log.writeln();
        grunt.log.writeln('Essential Grunt tasks are:');
        grunt.log.writeln();
        grunt.log.writeln('   grunt clean              Removes all built stuff');
        grunt.log.writeln('   grunt lint:js            Runs ESLint');
        grunt.log.writeln('   grunt lint:css           Runs SCSS Lint');
        grunt.log.writeln();
        grunt.log.writeln('   grunt build:prod         Builds the web application for production environment');
        grunt.log.writeln('   grunt build:dev          Builds the web application');
        grunt.log.writeln();
        grunt.log.writeln('   grunt watch:server       Monitors all server source code, restarts server on every change                       (blocking command)');
        grunt.log.writeln('   grunt watch:build        Monitors analysis result files, runs \'build:dev\' on every change, refreshes page       (blocking command)');
        grunt.log.writeln('   grunt watch:analysis      Monitors most source code, runs all analysis tasks on every change                     (blocking command)');
        grunt.log.writeln();
        grunt.log.writeln();
        grunt.log.writeln('Other commands are:');
        grunt.log.writeln();
        grunt.log.writeln('   node server/scripts/server.js      Starts web application locally (using latest built configuration)');
        grunt.log.writeln('   heroku local -p 8000               Starts web application locally with production configuration');
    });


    // Grunt task for (temporarily) disable/enable forced continuation of execution
    grunt.registerTask('force', (set) => {
        if (set === 'on') {
            grunt.option('force', true);
        } else {
            grunt.option('force', false);
        }
    });


    grunt.registerTask('scsslint:export', 'Extracting essential data out of sccs-lint dumps', () => {
        const project = grunt.file.readJSON('package.json');
        const scsslintDump = grunt.file.read('./build/analysis/scsslint-dump.xml');
        const scsslintResultFile = './build/analysis/scsslint.json';
        const scsslintResultFileContent = (grunt.file.exists(scsslintResultFile)) ? JSON.parse(grunt.file.read(scsslintResultFile)) : [];
        const currentScsslintResult = {
            project: project.name,
            type: 'scss-lint (static analysis: application style sheet (in SCSS) source code)',
            timestamp: new Date().toJSON(),
            data: {
                warnings: '?'
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


    grunt.registerTask('eslint:export', 'Extracting essential data out of ESLint dumps', () => {
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
                errors: '?',
                warnings: '?'
            }
        };

        if (currentEslintResult.data.errors === '?') {
            currentEslintResult.data.errors = 0;
        }
        if (currentEslintResult.data.warnings === '?') {
            currentEslintResult.data.warnings = 0;
        }
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

    grunt.registerTask('lint:js', ['eslint:server', 'eslint:client']);
    grunt.registerTask('lint:js-dump', ['eslint:server-dump', 'eslint:client-dump']);
    grunt.registerTask('compile:js:dev', ['browserify']);
    grunt.registerTask('compile:js:prod', ['compile:js:dev', 'uglify']);

    grunt.registerTask('compile:html:dev', ['processhtml:dev']);
    grunt.registerTask('compile:html:prod', ['processhtml:prod', 'htmlmin:prod']);

    grunt.registerTask('build:analysis', ['force:on', 'lint:css', 'lint:js-dump', 'force:off', 'scsslint:export', 'eslint:export']);
    grunt.registerTask('build:dev', ['copy:build', 'compile:css:dev', 'compile:js:dev', 'compile:html:dev']);
    grunt.registerTask('build:prod', ['copy:build', 'compile:css:prod', 'compile:js:prod', 'compile:html:prod', 'copy:public']);
    grunt.registerTask('build:heroku', ['build:prod']);
    grunt.registerTask('build:travis', ['build:prod']);

    grunt.registerTask('watch:server', ['nodemon:server']);
    grunt.registerTask('watch:build', ['build:analysis', 'watch:step2']);
    grunt.registerTask('watch:analysis', ['watch:step1']);

    grunt.registerTask('default', ['help']);
};
