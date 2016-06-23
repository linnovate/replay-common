## Description
This repo is intended to share code between Replay micro services.

## Adding new module
Just add your module in the root of the repo, and do not forget to append a package.json by calling npm-init in your module.

Also do not forget to prefix your module with "replay-".

## Modifing existing modules
Upon pushing new code to your module, please elevate the "version" tag in your package.json, else the projects depending on the module won't receive the update when they'd perform "npm install".