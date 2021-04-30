# Insomnia Usage Logger

Easily log API requests and responses made with Insomnia.
Store and explore them using your own <a href="https://resurface.io">system of record</a>.

## Requirements

- Install `docker`
- Sign up for [Resurface Pilot Edition](https://resurface.io/pilot-installation) access (it's free!)

## Set up

- Go to *Insomnia > Preferences > Plugins*, type in `insomnia-plugin-usage-logger` and click **Install Plugin**. <br/>
(Alternatively, check out the [manual installation](#manual).)
- Create a new Environment to store the [variables](#envvars) used by the logger.

<img src="https://github.com/resurfaceio/insomnia-plugin-usage-logger/blob/master/img/insomnia_env.gif" width="768" height="400" />

That's it!<br/>Happy loggin' 📝

<a name="envvars"/>

## Environment variables

This plugin has access to three environment variables, but only one them is required for the logger to work properly.

#### ✔ All API calls are sent to the database running inside the docker container
The environment variable `USAGE_LOGGERS_URL` stores this address, which by default should be `http://localhost:4001/message`
#### ✔ All API calls are filtered using a set of rules (Optional)
The environment variable `USAGE_LOGGERS_RULES` stores these rules. [Learn more](#privacy)
#### ✔ What if I want to disable the Logger? (Optional)
You can! By setting the environment variable `USAGE_LOGGERS_DISABLE` to `true` the logger will be disabled and no API calls will be logged.<br/>In addition, if you're not using any other environment variables, you can just disable the environment and no API calls will be logged until you select the environment again.

<img src="https://github.com/resurfaceio/insomnia-plugin-usage-logger/blob/master/img/insomnia_env_disable.gif" width="768" height="400" />

## Usage

Coming soon

<a name="manual"/>

## Manual installation

- Place `usage-logger` folder inside:
  - **MacOS**: `~/Library/Application\ Support/Insomnia/plugins/`
  - **Windows**: `%APPDATA%\Insomnia\plugins\`
  - **Linux**: `$XDG_CONFIG_HOME/Insomnia/plugins/ or ~/.config/Insomnia/plugins/`
- Install dependencies using `npm i`

<a name="privacy"/>

## Protecting User Privacy

Loggers always have an active set of <a href="https://resurface.io/logging-rules">rules</a> that control what data is logged
and how sensitive data is masked. All of the examples above apply a predefined set of rules (`include debug`),
but logging rules are easily customized to meet the needs of any application.

<a href="https://resurface.io/logging-rules">Logging rules documentation</a>

---
<small>&copy; 2016-2021 <a href="https://resurface.io">Resurface Labs Inc.</a></small>
