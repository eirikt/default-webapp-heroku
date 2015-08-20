# Default Webapp
My default and favourite setup (at the latest commit date, anyway) for web application development.
The main objectives being:
- Ease of development
- Very compact code base
- [Continuous delivery][continuous-delivery]

The web application is based on **_Node.js_**.

A live version is hosted on [Heroku][heroku], as [https://lit-sea-2983.herokuapp.com](https://lit-sea-2983.herokuapp.com).

## Prepare
1. Install [Node.js][node] (The Node package manager, **_npm_**, is included)
1. Sign up for a Heroku [account][heroku-account]
1. Install [Heroku Toolbelt][heroku-setup]

## Get Started
Open a terminal with Git in its path (in Windows; "Run as Administrator").
Go to your local workspace folder, and clone `default-webapp-heroku`

```
git clone https://github.com/eirikt/default-webapp-heroku
CD default-webapp-heroku
```

## Build
1. Fetch dependencies with `npm`

   ```
   npm install
   ```

1. Show project info and available tasks (_optional_)

   ```
   grunt
   ```

## Develop
1. Open a couple of terminals (in Windows; Run as Administrator).

1. Start the server-side code monitoring (blocking command)
   ```
   grunt watch:server
   ```

1. Start the client-side code monitoring (blocking command)
   ```
   grunt watch:client
   ```

1. Navigate to [http://localhost:8000]()

Depending on your editors auto-save configuration (and capabilities), you should now just be able to code away with instant feedback.
I use [Atom][atom], the hackable text editor.

## Deploy locally
1. If watchers are running, kill them.

1. Build the web application

   ```
   grunt build:dev
   ```

1. Start the web application
   ```
   node server.js
   ```

1. Navigate to [http://localhost:8000]()

## Stage the webapp
1. Use Heroku Toolbelt to stage your webapp using production environment configuration

   Kill your local server, if running, and redeploy on port `8000`.

   ```
   heroku local -p 8000
   ```

1. Navigate to [http://localhost:8000]()

## Deploy to Heroku
1. _If not already done;_ Configure Heroku environment

   First, log in with your Heroku account.

   ```
   heroku login
   ```

   Then create a Heroku app, which prepares Heroku to receive your source code.

   ```
   heroku create
   ```

   When you create an app, a git remote (called `heroku`) is also created and associated with your local git repository.

   Heroku generates a random name for your app, or you can pass a parameter to specify your own app name.

   Then set a ["buildpack"][heroku-buildpacks] for you Heroku environment.

   ```
   heroku buildpacks:set https://github.com/heroku/heroku-buildpack-nodejs
   ```

   This sets the default "buildpack", which handles the pushed changes on the `heroku` branch.
   This includes running `npm install` in addition to what's declared in the `Procfile`, namely `npm start` including all its [hooks][npm-scripts].

1. Just push your commits to the `heroku` git remote branch

   ```
   git push heroku master
   ```

   **_Your site is now live and updated!_**

   Now visit the web app at the URL generated by its Heroku app name.
   As a handy shortcut, you can open the website as follows:

   ```
   heroku open
   ```

...

For a full public launch, the site should be given a proper domain name. That is easily accomplished with Heroku's [custom domain][heroku-custom-domains] functionality.

---

## A boilerplate for your project

This project is meant as a well-documented starting-point for a project, like a boilerplate.

First, look through the commit log and find the wanted version (_optional_).
Then either fork this GitHub repository for preserving the commit history (_recommended_), or just copy the code base to your own project folder.
Also, you could delete the `.git` folder and turn the `default-webapp-heroku` folder into your own project folder.
Either way, "reset"/modify the `LICENCE.txt`, `package.json`, and `README.md`.

Then just develop, stage, and deploy as described above.

---

## Changelog
Some arguments and rationale for the design choices of some essential commits ...

### v0.1: Establish project and deploy
Walking the continuous delivery walk;
We are starting with the simplest possible webapp, just returning `200 OK` - a heartbeat service.
- [Walkthrough](https://github.com/eirikt/default-webapp-heroku/blob/master/SETUP.md)
- [`Procfile` (Heroku-specific) for local staging and easier deployment](https://github.com/eirikt/default-webapp-heroku/commit/edeedc577e27c8d8e107b277079b7cbae87f0e37)

_Tell your client that their webapp has awakened._

...

### v0.2: Hello World!
Putting together a decent default `index.html`.
Rather inspired by [HTML5 Boilerplate][html5boilerplate-explained], and such.
- [Serving static content with Express](https://github.com/eirikt/default-webapp-heroku/blob/0e00c71001074200bb27d4bea33379bd82abae58/server.js)
- [HTTP Header settings for no caching](https://github.com/eirikt/default-webapp-heroku/commit/abcdfcab93961dceff8d29a1faae49a798313d42). Inspired by [this](http://stackoverflow.com/questions/49547/making-sure-a-web-page-is-not-cached-across-all-browsers) Stack Overflow thread.
- [Favicon trick to avoid '404 Not Found' in browsers](https://github.com/eirikt/default-webapp-heroku/commit/180f48f8b3e927335092bbd409175ba64b623fa4)
- [Warning users with IE9 and worse](https://github.com/eirikt/default-webapp-heroku/commit/447a8f444a81a63d3d16470ab3a1c42f9b9cb4ea).
  Just take a stand!
  But at least warn users about the situation.
  We should not waste time on those troublesome browsers unless _absolutely necessary_.
- [Mobile first](https://github.com/eirikt/default-webapp-heroku/commit/37d5b261fb505e2fcabb4ae04423608a15ba056c) by setting the [viewport](https://developers.google.com/web/fundamentals/layouts/rwd-fundamentals/set-the-viewport?hl=en) appropriately.
- [Normalize.css (via CDN)](https://github.com/eirikt/default-webapp-heroku/commit/de914283450bc5b0b81ce43b7f026a2702483fee).
  [Normalize.css](http://nicolasgallagher.com/about-normalize-css/) makes browsers render all elements more consistently and in line with modern standards.
  It precisely targets only the styles that need normalizing.

_Tell your client that their webapp has said 'hello'. Also, mention that it is mobile-first and responsive and will stay that way._

...

### v0.3: Ease of development
Setting up a smooth development environment where the goal is extremely fast and frequent micro-iterations.

- [EditorConfig](https://github.com/eirikt/default-webapp-heroku/commit/af9af9df9b720994f21352225a65c6fb24c59c78), IDE-agnostic editor configurations.
- [Grunt as Build tool](https://github.com/eirikt/default-webapp-heroku/commit/8dbcf0164b4da8f69ac60c6b11dd4f311335132c).
  Even though the usage of tools like [Grunt][grunt] and [Gulp][gulp] lately have been [questioned](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/) as the primary build tool, I find Grunt still very useful.
  In my opinion it scales better than e.g. `npm` when the build configuration gets large and complex.
- [HTML templating](https://github.com/eirikt/default-webapp-heroku/commit/d2ef0ac25022eb11a7d4578721aa5125c04c4bb6)
- _Build folder_ for file processing without renaming.
  Also, it gives a cleaner project layout.
  This is a transient ("temp") folder named `build`.
- Dedicated _folder for public files_.
  It increases security, and makes multiple build steps easier.
  This is a transient ("temp") folder named `public`.
- [Automatic client reload when client-side code changes](https://github.com/eirikt/default-webapp-heroku/commit/5df6035f7a3c6c97db58f9abb08265f9f505a8f8)
- [Automatic server restart when serve-side code changes](https://github.com/eirikt/default-webapp-heroku/commit/c164227534f561bcf845e237b64de6af7dc559b3)
- Client-side resource files moved into `client` source folder.
  It gives a cleaner project layout.
- Server-side resource files moved into `server` source folder.
  Primarily moved for symmetry.

_Tell your client that their webapp is developing at full speed, with no waste - and that they will be able to monitor all progress, live!_



[atom]: https://atom.io
[continuous-delivery]: https://en.wikipedia.org/wiki/Continuous_delivery/
[github]: https://github.com
[grunt]: http://gruntjs.com
[gulp]: http://gulpjs.com
[html5boilerplate]: https://html5boilerplate.com
[html5boilerplate-explained]: http://ningbit.github.io/blog/2013/09/30/html5-boilerplate-explained-in-simple-terms/
[npm-scripts]: https://docs.npmjs.com/misc/scripts
[node]: https://iojs.org
[heroku]: https://www.heroku.com
[heroku-account]: https://signup.heroku.com/dc/
[heroku-buildpacks]: https://devcenter.heroku.com/articles/buildpacks/
[heroku-setup]: https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up
[heroku-intro]: https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction
[heroku-custom-domains]: https://devcenter.heroku.com/articles/custom-domains/
