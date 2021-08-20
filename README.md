# Resurface Insomnia Plugin

Log API requests and responses made with Insomnia to your own <a href="https://resurface.io">system of record</a>.

## Requirements

- docker
- [Resurface](https://resurface.io/installation) (free Docker container)

## Set up

- Go to *Insomnia > Preferences > Plugins*, type in `insomnia-plugin-usage-logger` and click **Install Plugin**.

<img src="https://github.com/resurfaceio/insomnia-plugin/raw/master/assets/readme/install_plugin.gif" width="768" height="400" />

(Alternatively, check out the [manual installation](#manual-installation).)

- Create a new Environment to store the [variables](#environment-variables) used by the logger.

<img src="https://github.com/resurfaceio/insomnia-plugin/raw/master/assets/readme/insomnia_env.gif" width="768" height="400" />

That's it!

## Usage

- Make sure to select the [environment you created before](#set-up) (also, make sure the plugin is enabled).
- Use Insomnia as you would normally.
- Go to `http://localhost:4002` to explore all your logs using the included <a href="https://resurface.io#explore">API Explorer</a>

<img src="https://github.com/resurfaceio/insomnia-plugin/raw/master/assets/readme/insomnia_usage.gif" width="768" height="400" />

Happy loggin' 📝

## Environment variables

This plugin has access to three environment variables, but only one them is required for the logger to work properly.

#### ✔ All API calls are sent to the database running inside the docker container
The environment variable `USAGE_LOGGERS_URL` stores this address, which by default should be `http://localhost:4001/message`
#### ✔ All API calls are filtered using a set of rules (Optional)
The environment variable `USAGE_LOGGERS_RULES` stores these rules. [Learn more](#protecting-user-privacy)
#### ✔ What if I want to disable the Logger? (Optional)
You can! By setting the environment variable `USAGE_LOGGERS_DISABLE` to `true` the logger will be disabled and no API calls will be logged.

In addition, if you're not using any other environment variables, you can just disable the environment and no API calls will be logged until you select the environment again.

<img src="https://github.com/resurfaceio/insomnia-plugin/raw/master/assets/readme/insomnia_env_disable.gif" width="768" height="400" />

## Manual installation

- Clone this repo inside:
  - **MacOS**: `~/Library/Application\ Support/Insomnia/plugins/`
  - **Windows**: `%APPDATA%\Insomnia\plugins\`
  - **Linux**: `$XDG_CONFIG_HOME/Insomnia/plugins/ or ~/.config/Insomnia/plugins/`
- Install dependencies using `npm i`

## Protecting User Privacy

Loggers always have an active set of <a href="https://resurface.io/logging-rules">rules</a> that control what data is logged
and how sensitive data is masked. All of the examples above apply a predefined set of rules (`include debug`),
but logging rules are easily customized to meet the needs of any application.

<a href="https://resurface.io/logging-rules">Logging rules documentation</a>

---
<small>&copy; 2016-2021 <a href="https://resurface.io">Resurface Labs Inc.</a></small>
