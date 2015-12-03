'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _s = require('underscore.string');
var wiredep = require('wiredep');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../../package.json');
  },
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the WeStud.io ' + chalk.red('generator-gulp-website') + '! I include Gulp and Sass.'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'scaffold',
      message: 'You are about to scaffold a boilerplate project to start a new website. Continue?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;
      
      if (!this.props.scaffold)
      {
        process.exit(1);
      }

      done();
    }.bind(this));
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js')
    );
    
    this.fs.copy(
      this.templatePath('_package.json'),
      this.destinationPath('package.json')
    );
    
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );

    this.fs.copy(
      this.templatePath('gitattributes'),
      this.destinationPath('.gitattributes')
    );
    
    var bowerJson = {
        name: _s.slugify(this.appname),
        private: true,
        dependencies: {}
      };  
    bowerJson.dependencies['jquery'] = '~2.1.1';
    this.fs.writeJSON('bower.json', bowerJson);
    this.fs.copy(
      this.templatePath('bowerrc'),
      this.destinationPath('.bowerrc')
    );
    
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );
      
    this.fs.copy(
      this.templatePath('favicon.ico'),
      this.destinationPath('app/favicon.ico')
    );
    
    this.fs.copy(
      this.templatePath('robots.txt'),
      this.destinationPath('app/robots.txt')
    );
    
    this.fs.copy(
      this.templatePath('main.scss'),
      this.destinationPath('app/main.scss')
    );
    
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('app/index.html'),
      {
          appname: this.appname
      }
    );
    
    mkdirp('app/images');
    mkdirp('app/fonts');
  },

  install: function () {
    this.installDependencies();
  },
  
  end: function() {
    var bowerJson = this.fs.readJSON(this.destinationPath('bower.json'));

    // wire Bower packages to .scss
    wiredep({
      bowerJson: bowerJson,
      directory: 'bower_components',
      ignorePath: /^(\.\.\/)+/,
      src: 'app/styles/*.scss'
    });
  }
});
