# Resurface Insomnia Plugin

Log API requests and responses made with Insomnia to your own <a href="https://resurface.io">system of record</a>.

## Requirements

- docker
- [Resurface](https://resurface.io/installation) (free Docker container)

## Set up

- Go to *Insomnia > Preferences > Plugins*, type in `insomnia-plugin-usage-logger` and click **Install Plugin**.

<img src="https://github.com/resurfaceio/insomnia-plugin/raw/master/assets/readme/install_plugin.gif" width="768" height="400" />

(Alternatively, check out the [manual installation](#manual-installation).)

- Add the [variables](#environment-variables) used by the logger to your Base Environment (or create a separate new Sub Environment for them).

```json
{
    "USAGE_LOGGERS_URL": "http://localhost:7701/message",
    "USAGE_LOGGERS_RULES": "include debug"
}
```

<img src="https://github.com/resurfaceio/insomnia-plugin/raw/master/assets/readme/insomnia_env.gif" width="768" height="400" />

That's it!

## Usage

- Make sure the plugin is enabled (also, if you [created a new sub environment](#set-up) make sure to select it).
- Use Insomnia as you would normally.
- Go to `http://localhost:7700` to explore all your logs using the included <a href="https://resurface.io#explore">API Explorer</a>

<img src="https://github.com/resurfaceio/insomnia-plugin/raw/master/assets/readme/insomnia_usage.gif" width="768" height="400" />

- You can always disable the plugin if you want stop logging API calls temporarily

//TODO

Happy loggin' 📝

## Environment variables

This plugin has access to four environment variables, but only one them is required for the logger to work properly.

#### ✔ All API calls are sent to the database running inside the docker container
The environment variable `USAGE_LOGGERS_URL` stores this address, which by default should be the string `"http://localhost:7701/message"`
#### ✔ All API calls are filtered using a set of rules (Optional)
The environment variable `USAGE_LOGGERS_RULES` stores these [logging rules](#protecting-user-privacy) as a string. Even though this variable is optional, it is recommended to set it to `"include debug"` or `"allow_http_url"` when trying the plugin for the first time.
#### ✔ Reponse bodies are logged up to a certain size (Optional)
If you are working with large response payloads and don't want to log the whole thing, you can use the environment variable `USAGE_LOGGERS_LIMIT`. It stores an integer value corresponding to the number of bytes after which a response body will not be logged (by default, this upper limit is 1 MiB).
#### ✔ The Logger can be disabled even if the plugin is enabled (Optional)
By setting the environment variable `USAGE_LOGGERS_DISABLE` to `true` the logger will be disabled and no API calls will be logged.

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
<small>&copy; 2016-2022 <a href="https://resurface.io">Resurface Labs Inc.</a></small>
