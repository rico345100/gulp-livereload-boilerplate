# Gulp + Livereload Boilerplate
This boilerplate was created for only web page publishing, based on [https://github.com/rico345100/gulp-react-typescript-boilerplate](https://github.com/rico345100/gulp-react-typescript-boilerplate).

## Features
- Gulp
- Livereload
- Uglify

## Preqrequisite
- Node.js (Of course)
- Globally installed Gulp (or npx might be helpful)
- SCSS

## Run
1. Install dependencies

```bash
$ npm install
```

2. Install Gulp

```bash
$ npm install -g gulp
```

Or if you already using npx, you can use gulp via npx.

3. Run the task

```bash
$ npm start
```

## Scripts
Each function of building application in here is separated as Gulp tasks. Available tasks are:
- default: Build and serve web page. Use this for development environment.
- build: Build HTML/SCSS/JavaScript.
- build:html
- build:scss
- build:js
- serve: Run livereload server in the available browser.

By default, each build tasks are watching file changes and triggers reload the website. You can just build only once with --once option:

```bash
$ gulp build:html --once
```

To minimize resources, put --production option:

```bash
$ gulp build:html --production
```
