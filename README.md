# Default Webapp
My default and opinionated/favourite setup (at the latest commit date, anyway) for web application development.
The main objectives being:
- Ease of development
- Compact code base

The web application is based on **_Node.js_** using [Express][express].

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[![Build Status](https://travis-ci.org/eirikt/default-webapp-heroku.png)](https://travis-ci.org/eirikt/default-webapp-heroku)
&nbsp;&nbsp;
[![Dependency Status](https://www.versioneye.com/user/projects/55f51d813ed894001e000376/badge.svg)](https://www.versioneye.com/user/projects/55f51d813ed894001e000376)
&nbsp;&nbsp;
[![Codacy Badge](https://api.codacy.com/project/badge/grade/8454bc7b66e74cc4be1fa2d8b2a54394)](https://www.codacy.com/app/eiriktorske/default-webapp-heroku)

A live version is hosted on [Heroku][heroku], as [https://defaultwebapp.herokuapp.com](https://defaultwebapp.herokuapp.com).
(It is a Heroku single-dyno setup - meaning that the response may take quite a few seconds if the server has to spin up for you ...)

## Prepare
1. Install [Node.js][node] (The Node package manager, **_npm_**, is included)
1. Sign up for a Heroku [account][heroku-account]
1. Install [Heroku Toolbelt][heroku-setup] (Ruby is included)
1. Add Ruby to your path (for Sass integration)

## Get Started
Open a terminal with Git in its path (in Windows; "Run as Administrator").
Go to your local workspace folder, and clone `default-webapp-heroku`.
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
1. Open some terminal windows

1. Start monitoring for live reloading of server (blocking command)
   ```
   grunt watch:server
   ```

1. Start code monitoring for automatic static code analysis and application re-building (blocking commands)

   Build - Triggered by completed analysis tasks below
   ```
   grunt watch:build
   ```

   Analyze - Static code analysis, monitors most source files
   ```
   grunt watch:analysis
   ```

1. Navigate to [http://localhost:8000]()

Depending on your editors auto-save configuration (and capabilities), you should now just be able to code away with instant feedback.
I use [Atom][atom], the hackable text editor.

These three steps are a clear candidate for inclusion in a start-up script.
(I leave that as an exercise to the reader ;-)

## Deploy locally
1. If watchers are running, kill them!

1. Build the web application
   ```
   grunt build:dev
   ```

1. Start the web application
   ```
   node server/scripts/server.js
   ```

1. Navigate to [http://localhost:8000]()

## Stage the webapp
1. Use Heroku Toolbelt to stage your web application using production environment configuration

   If on Windows/PowerShell, first set the production environment variable.
   ```
   $env:NODE_ENV='production'
   ```
   or in Windows/`cmd`.
   ```
   set NODE_ENV=production
   ```

   Then redeploy on port `8000`.
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

   Set the primary ["buildpack"][heroku-buildpacks] for you Heroku environment.
   ```
   heroku buildpacks:set https://github.com/heroku/heroku-buildpack-nodejs
   ```
   This sets the default buildpack, which handles the pushed changes on the `heroku` branch.
   This includes running `npm install` in addition to what's declared in the `Procfile`, namely `npm start` including all its [hooks][npm-scripts].

   <!---One such important hook installs Sass via `gem install sass`, as [declared](https://github.com/eirikt/default-webapp-heroku/commit/95f7573a72f423cff6970f916f4ca93e49b0ab7a) in the `package.json` file.-->
   For Sass integration our Heroku environment also needs a Ruby runtime.
   Add the Ruby buildpack.
   ```
   heroku buildpacks:add https://github.com/heroku/heroku-buildpack-ruby
   ```
   <!---For the Ruby buildpack too work, it has to detect that this is a valid Ruby project,
   in addition to being a Node.js project.
   That is why the `Gemfile` and `Gemfile.lock` files are included in the project.-->
   <!---One such important hook installs Sass via `gem install sass`, as [declared](https://github.com/eirikt/default-webapp-heroku/commit/95f7573a72f423cff6970f916f4ca93e49b0ab7a) in the `package.json` file.-->

1. Just push your commits to the `heroku` git remote branch
   ```
   git push heroku master
   ```

   **_Your site is now live and/or updated!_**

   Now visit the web app at the URL generated by its Heroku app name.
   As a handy shortcut, you can open the website as follows:
   ```
   heroku open
   ```

...

For a full public launch, the site should be given a proper domain name.
That is easily accomplished with Heroku's [custom domain][heroku-custom-domains] functionality.

Node's embedded HTTP server is superfast and scalable, but is by default quite stripped with regard to security configurations.
Have a look at e.g. [this](https://blog.liftsecurity.io/2012/12/07/writing-secure-express-js-apps) and [this](http://recxltd.blogspot.no/2012/03/seven-web-server-http-headers-that.html) blog posts describing some quick and easy ways of increasing your site's protection against the usual malicious attack suspects.

---

## A boilerplate for your project

This project is meant as a well-documented starting-point for a project, like a boilerplate.

Either fork this GitHub repository, or copy the code base to your own project folder.
Also, you could just delete the `.git` folder and turn the `default-webapp-heroku` folder into your own project folder.
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

_Tell your client that their webapp has said 'hello'.
Also, mention that it looks good and all devices
(**buzzwords**: "mobile-first" and "responsive design") and that it will stay that way._

...

### v0.3: Ease of development
Setting up a smooth development environment where the goal is fast and frequent micro-iterations, making short feedback loops possible.
The principle of short feedback loops when developing are discussed e.g. [here](https://wilmsmann.fullmontty.com/2014/01/05/future-of-coding/), and in Brett Victor's excellent [talk](https://vimeo.com/36579366),
in which he talks about the necessity of _having an immediate connection with what you create_.

- [Grunt as Build tool](https://github.com/eirikt/default-webapp-heroku/commit/8dbcf0164b4da8f69ac60c6b11dd4f311335132c).
  Even though the usage of tools like [Grunt][grunt] and [Gulp][gulp] lately have been [questioned](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/) as the primary build tool, I find Grunt still very useful.
  In my opinion it scales better than e.g. `npm` when the build configuration gets large and complex.
- [HTML templating](https://github.com/eirikt/default-webapp-heroku/commit/d2ef0ac25022eb11a7d4578721aa5125c04c4bb6)
- _Build folder_ for file processing without renaming.
  Also, it gives a cleaner project layout.
  This is a transient ("temp") folder named `build`.
- Dedicated _folder for public files_.
  It increases security, and makes multiple build steps easier.
  A typical example is transpiling and then minifying.
  This is a transient ("temp") folder named `public`.
- [Automatic client reload when client-side code changes](https://github.com/eirikt/default-webapp-heroku/commit/5df6035f7a3c6c97db58f9abb08265f9f505a8f8)
- [Automatic server restart when serve-side code changes](https://github.com/eirikt/default-webapp-heroku/commit/c164227534f561bcf845e237b64de6af7dc559b3)
- Client-side resource files moved into `client` source folder.
  Server-side resource files moved into `server` source folder.
  It gives a cleaner project layout.
- [EditorConfig](https://github.com/eirikt/default-webapp-heroku/commit/af9af9df9b720994f21352225a65c6fb24c59c78), IDE-agnostic editor configurations.
- [Node config](https://github.com/eirikt/default-webapp-heroku/commit/14e19c9aeb393d8183e2a141e56a00daa656d4ae)

_Tell your client that their webapp is developing at full speed, with no waste - The code base is ~~idiomatic~~ quite ordinary stuff, and can be transferred to other teams with great ease - Also, one can monitor all progress, live._

...

### v0.4: Offline first
Using the [HTML5 Appliction Cache API][appcache] (_"Appcache"_) to make the web application work even without a network connection.
The webapp is cached in its entirety on the client, making it independent on an Internet connection to function; at least partially function.

- On Express servers, the MIME type for manifest (`.appcache` => `text/cache-manifest`) files is already included.
- It's a good idea to set expires headers on your web server for appcache files to expire immediately.
This avoids the risk of caching manifest files.
This is already taken care of by [this](https://github.com/eirikt/default-webapp-heroku/commit/abcdfcab93961dceff8d29a1faae49a798313d42) commit (HTTP Header settings for no caching).
- The Appcache is only active when using the `prod` build tasks.
When developing, the Appcache is, and always should be - [deactivated!](https://github.com/eirikt/default-webapp-heroku/commit/ab0731848132751966161f32922b78cdb59760b8)

_Tell your client that their webapp works even without an Internet connection!
(**buzzwords**: "offline first", "occasionally connected")_

...

### v0.5: Server push with [Socket.io][socketio]
[HTTP server push techniques](serverpush) makes connected clients possible, with instant synchronized state shared among all clients.
With server push you can achieve smooth user experiences for web applications, with a more limited increase in network round-trips and less bloated code than would have been the case if we were to implement this using regular web technologies.

The move from the stateless request/response-oriented HTTP towards server push technologies, like [WebSocket][websocket], are questioned by many with regard to [scaling and security](http://blog.synopse.info/post/2014/08/16/Will-WebSockets-replace-HTTP-Do-they-scale).
Also, it is [argued](http://www.infoq.com/news/2012/02/websockets-rest) that this is yet another road into a remote procedure call (RPC) paradigm that has failed numerous times, and [will do so again](http://www.slideshare.net/jamesalewis/websockets-omg-someone-broke-the-internet).

My take on it is to use server push strictly as a supplement to HTTP, not replacing HTTP when it comes to service calls.

_Tell your client that their webapp is a "connected" one, always **automatically** reflecting the current state, for all users - like Google Docs! (When online, that is.)
(**buzzwords**: "real-time apps")_

...

### v0.6: Styling with [Sass][sass]
[Less][less] vs. [Sass][sass] ...
Well, being no frontend guy, here I am finding myself just [googling around](http://www.zingdesign.com/less-vs-sass-its-time-to-switch-to-sass/), following the gut feeling, and [going with the flow](http://blog.getbootstrap.com/2015/08/19/bootstrap-4-alpha/) ...

Sass has a lot of nice features:
- [Sass variables](https://github.com/eirikt/default-webapp-heroku/commit/eb5705e0f1e4df57df060dcddedbf294846f8b14)
- [Sass nesting](https://github.com/eirikt/default-webapp-heroku/commit/d2a3cfa96554059f5968774897101d3b2dd4fb2a)
- [Sass inheritance](https://github.com/eirikt/default-webapp-heroku/commit/5ac8e0975ee2ab6bad3faf33c3760cfd00ac6e66)
- [Sass mixins](https://github.com/eirikt/default-webapp-heroku/commit/91cf73eeb3c1a062a1190fa476fe388458a9290c)
- [Sass imports](https://github.com/eirikt/default-webapp-heroku/commit/7f575f7d642f27d77a005259a36f68f3296d392f)

Also added are:
- [Sass linting](https://github.com/eirikt/default-webapp-heroku/commit/e373a8492d301c8e1f128454f713d7f1a8824a49) with [SCSS-Lint][sass-lint]
- [Transpiling Sass to CSS](https://github.com/eirikt/default-webapp-heroku/commit/81533b22a1956a1daab3a628aa8282b64e1c3f93)
- Using [PostCSS][postcss], for things like e.g.  [autoprefixing](https://github.com/eirikt/default-webapp-heroku/commit/f9119af2c3f8085948449d8488c3413529ca955e) (using [this][postcss-autoprefixer] tool), and [color blindness](https://github.com/eirikt/default-webapp-heroku/commit/0244b6c19c9141bfb706c82f4a9801f2e999c918) (using [this][postcss-colorblind] tool)
- [Minifying CSS](https://github.com/eirikt/default-webapp-heroku/commit/b288d53c93a65f3f51adb00dce7b750e9ba4e48f) with [cssnano][cssnano]
- [Using CSS instead of images](https://github.com/eirikt/default-webapp-heroku/commit/486134dd3978533354c51d07eda03bfb5d32cfdb) for the LEDs :-)
- ["Fork me on GitHub" banner](https://github.com/eirikt/default-webapp-heroku/commit/5bb7997f4862f9324f0a3cd9051c9e952f159591) :-)

_Tell your client that their webapp's theme is highly customizable and switching its "look-and-feel" is a swift and concise exercise!_

...

### v0.7: Client-side content rendering with [React][react]
[React][react] has the world record of going from an obscure, experimental (WTF) framework - to become the de-facto standard.
React has set the direction of web development in the years to come.
This little application of React capabilities utilizes most of the features demonstrated in the [default tutorial](https://facebook.github.io/react/docs/tutorial.html).

- [React trick for no DOM rendering](https://github.com/eirikt/default-webapp-heroku/commit/fb6e4c94671c540984cc4ff61d35cffdc88b96b3)
- [Transpiling JSX with Browserify and Babel](https://github.com/eirikt/default-webapp-heroku/commit/f40739f35bb3a80c606ec783124d48da9fa0805d)
- [Inlined React component as CommonJS module](https://github.com/eirikt/default-webapp-heroku/commit/fd0ce297a0c8e4a49f6cba815f0bc248d0f3b9d0)
- [ECMAScript 2015 with Babel (v5): Modules](https://github.com/eirikt/default-webapp-heroku/commit/1f41cc58299691fb78fd0ffc34961244b146c518)
- [ECMAScript 2015 with Babel (v5): Classes](https://github.com/eirikt/default-webapp-heroku/commit/4ae177778985f72974b6249af09cedbf7c82f406)
- [ECMAScript 2015 with Babel (v5): Arrow functions and React v0.14 stateless functional components](https://github.com/eirikt/default-webapp-heroku/commit/c8f091d459c21eeba5f067dd6cb5af1d6bf76ef8)
- [ECMAScript 2015 with Babel (v5): Destructuring and an implicit return](https://github.com/eirikt/default-webapp-heroku/commit/67e4161eb104cda6be5598b57a0a2f99f944a9f0)
- [Babel v6 upgrade](https://github.com/eirikt/default-webapp-heroku/commit/c554d66bed54e66fbdbfe38603ef017d7ad39bb1)

...

### v0.8: Testing ...

...

### v0.9: Redux / React-Router / Relay / GraphQL / Graffiti ... Oh my ?



[appcache]: https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache
[atom]: https://atom.io
[continuous-delivery]: https://en.wikipedia.org/wiki/Continuous_delivery
[cssnano]: https://github.com/ben-eb/cssnano
[express]: http://expressjs.com
[github]: https://github.com
[grunt]: http://gruntjs.com
[gulp]: http://gulpjs.com
[html5boilerplate]: https://html5boilerplate.com
[html5boilerplate-explained]: http://ningbit.github.io/blog/2013/09/30/html5-boilerplate-explained-in-simple-terms
[less]: http://lesscss.org
[npm-scripts]: https://docs.npmjs.com/misc/scripts
[node]: https://iojs.org
[postcss]: https://github.com/postcss/postcss
[postcss-autoprefixer]: https://github.com/postcss/autoprefixer
[postcss-colorblind]: https://github.com/btholt/postcss-colorblind
[react]: https://facebook.github.io/react
[sass]: http://sass-lang.com
[sass-lint]: https://github.com/brigade/scss-lint
[serverpush]: https://en.wikipedia.org/wiki/Push_technology
[socketio]: http://socket.io
[websocket]: https://en.wikipedia.org/wiki/WebSocket

[heroku]: https://www.heroku.com
[heroku-account]: https://signup.heroku.com/dc
[heroku-buildpacks]: https://devcenter.heroku.com/articles/buildpacks
[heroku-setup]: https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up
[heroku-intro]: https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction
[heroku-custom-domains]: https://devcenter.heroku.com/articles/custom-domains
