# Graylog API Security Insomnia Plugin
Easily log API requests and responses to your own <a href="https://resurface.io">security data lake</a>.

[![License](https://img.shields.io/github/license/resurfaceio/insomnia-plugin)](https://github.com/resurfaceio/insomnia-plugin/blob/master/LICENSE)
[![Contributing](https://img.shields.io/badge/contributions-welcome-green.svg)](https://github.com/resurfaceio/insomnia-plugin/blob/master/CONTRIBUTING.md)

## Requirements

- Kubernetes (if you have docker desktop, you already have a [local k8s cluster](https://docs.docker.com/desktop/kubernetes/)! For Linux we recommend [microk8s](https://ubuntu.com/tutorials/install-a-local-kubernetes-with-microk8s))
- [Graylog API Security](https://resurface.io/installation) -- first node is free!

## Set up

- Go to *Insomnia > Preferences > Plugins*
- Type in
  ```
  insomnia-plugin-usage-logger
  ```
- Click **Install Plugin**.

  <img src="https://github.com/resurfaceio/insomnia-plugin/raw/master/assets/readme/insomnia_install.gif" width="768" height="498" />


  (Alternatively, check out the [manual installation](#manual-installation).)

- Add the [variables](#environment-variables) used by the logger to your Base Environment (or create a separate new Private/Shared environment for it).

  ```json
  {
      "USAGE_LOGGERS_URL": "http://localhost:7701/message",
      "USAGE_LOGGERS_RULES": "include debug"
  }
  ```

  <img src="https://github.com/resurfaceio/insomnia-plugin/raw/master/assets/readme/insomnia_environment.gif" width="768" height="498" />


That's it!

## Usage

- Make sure the plugin is enabled (also, if you created a new private/shared environment make sure to select it).
- Use Insomnia as you would normally.
- Go to `http://localhost:7700` to explore all your logs using the included Graylog API Security web UI

  <img src="https://github.com/resurfaceio/insomnia-plugin/raw/master/assets/readme/insomnia_usage.gif" width="768" height="498" />

- You can always disable the plugin if you want stop logging API calls temporarily

  <img src="https://github.com/resurfaceio/insomnia-plugin/raw/master/assets/readme/insomnia_disable.gif" width="768" height="498" />

Happy loggin' 📝

## Environment variables

This plugin has access to four environment variables, but only one them is required for the logger to work properly.

#### ✔ All API calls are sent to the database running inside the `resurface` container
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
<small>&copy; 2016-2024 <a href="https://resurface.io">Graylog, Inc.</a></small>
