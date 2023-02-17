'use ***REMOVED***rict';

module.exports = function(grunt) {

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks("grunt-remove-logging");
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-todos');

grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	meta: {
		banner:
		'/* \n'+
		' * Leaflet Control Search v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> \n'+
		' * \n'+
		' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> \n'+
		' * <%= pkg.author.email %> \n'+
		' * <%= pkg.author.url %> \n'+
		' * \n'+
		' * Licensed under the <%= pkg.license %> license. \n'+
		' * \n'+
		' * Demo: \n'+
		' * <%= pkg.homepage %> \n'+
		' * \n'+
		' * Source: \n'+
		' * <%= pkg.repository.url %> \n'+
		' * \n'+
		' */\n'
	},
	clean: {
		di***REMOVED***: {
			src: ['di***REMOVED***/*']
		}
	},
	removelogging: {
		di***REMOVED***: {
			src: 'di***REMOVED***/*.js'
		}
	},	
	jshint: {
		options: {
      esversion: 6,
			globals: {
				'no-console': true,
				module: true
			},
			'-W099': true,
			'-W033': true,
			'-W044': true,
			'-W104': true,
		},
		files: ['src/*.js']
	},
	concat: {
		options: {
			banner: '<%= meta.banner %>'
		},
		di***REMOVED***: {
			files: {
				'di***REMOVED***/leaflet-search.src.js': ['src/leaflet-search.js'],			
				'di***REMOVED***/leaflet-search.src.css': ['src/leaflet-search.css'],
				'di***REMOVED***/leaflet-search.mobile.src.css': ['src/leaflet-search.mobile.css']
			}
		}
	},
	uglify: {
		di***REMOVED***: {
			files: {
				'di***REMOVED***/leaflet-search.min.js': ['di***REMOVED***/leaflet-search.src.js']
			}
		}
	},
	cssmin: {
		combine: {
			files: {
				'di***REMOVED***/leaflet-search.min.css': ['src/leaflet-search.css'],
				'di***REMOVED***/leaflet-search.mobile.min.css': ['src/leaflet-search.mobile.css']
			}
		},
		options: {
			banner: '<%= meta.banner %>'
		},
		minify: {
			expand: true,
			cwd: 'di***REMOVED***/',
			files: {
				'di***REMOVED***/leaflet-search.min.css': ['src/leaflet-search.css'],
				'di***REMOVED***/leaflet-search.mobile.min.css': ['src/leaflet-search.mobile.css']
			}
		}
	},
	watch: {
		di***REMOVED***: {
			options: { livereload: true },
			files: ['src/*'],
			tasks: ['clean','concat','cssmin','jshint']
		}		
	}
});

grunt.regi***REMOVED***erTask('default', [
	'clean',
	'concat',	
	'cssmin',
	'removelogging',	
	'jshint',
	'uglify'
]);

};