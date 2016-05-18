# Anatomy of a Tilt application

## The Tilt application layout

The layout of a Tilt application is rather simple. A typical Tilt application looks like this:

```
app                      → Application sources
 └ assets                → Compiled asset sources
    └ stylesheets        → Typically SASS SCSS sources or PostCSS cssnext sources.
    └ javascripts        → Typically ES6 sources
 └ controllers           → Application controllers
 └ models                → Application models
 └ services              → Application business layer
 └ views                 → React JSX templates
conf                     → Configurations files
 └ application.json      → Main configuration file (can include whole configuration or be split upon the below files)
 └ assets.json           → Configuration for the Asset compiler, browserify or webpack standard config
 └ babel.json            → Configuration for Babel, standard .babelrc config
 └ eslint.json           → Configuration for ESLint, standard .eslintrc config
 └ database.json         → Configuration file for database info
 └ i18n.json             → Configuration file for i18n support
 └ log.json              → Configuration for application logger
 └ views.json            → Configuration for view engine, specifying views directory, template extensions, etc.
public                   → Public assets
 └ stylesheets           → CSS files
 └ javascripts           → Javascript files
 └ images                → Image files
logs                     → Logs folder
 └ application.log       → Default log file
target                   → Generated stuff
 └ web                   → Compiled web assets
test                     → Folder for unit or functional tests
Makefile                 → Application build script
package.json             → Application package.json file
```

## The `app/` directory

The `app` directory contains all application sources: JavaScript source code,
templates and compiled assets' sources.

There are three folders in the `app` directory, one for each component of the
MVC architectural pattern:

- `app/controllers`
- `app/models`
- `app/views`

You can of course add your own folders, for example an `app/utils` package.

There is also an optional directory called `app/assets` for compiled assets such as Sass, PostCSS and client-side ES6 files.

## The `conf/` directory

The `conf` directory contains the application’s configuration files. There are
two main configuration files:

- `application.json`, the main configuration file for the application
- `<type>.json`, a more specific part of application configuration like `i18.json` or `views.json`

The whole configuration can be defined in application.json or split upon several files, for instance:

```js
// application.json
{
  "i18n": {
    "locale": "en"
  }
}
```

is the same as creating an `i18n.json` file with:

```js
{
  "locale": "en"
}
```

## The `public/` directory

Resources stored in the `public` directory are static assets that are served
directly by the Web server.

This directory is split into three sub-directories for images, CSS stylesheets
and JavaScript files.

> In a newly-created application, the `/public` directory is mapped to the
> `/assets` URL path, but you can easily change that, or even use several
> directories for your static assets.

## The `target/` directory

The `target` directory contains everything generated by the build system. It can be useful to know what is generated here.

- `src/` contains Babel generated sources, such as the ES6/7 sources compiled down to ES5.
- `web/` contains assets processed by browserify or webpack such as those from
  the `app/assets/*` folders.

## The `Makefile` file

Your project's main build declarations are generally found in `Makefile` at the
root of the project. It can be used with standard Make or using the `tilt`
command. Every Make target defined in the project Makefile becomes available
with `tilt <target>`.

## The `package.json` file

Typical npm `package.json` file with name, version, and scripts properties.

## Typical `.gitignore` file

Generated folders should be ignored by your version control system. Here is the typical `.gitignore` file for a Tilt application:

```txt
target
node_modules
*.log
```