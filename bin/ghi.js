#!/usr/bin/env node
const updateNotifier = require("update-notifier")
const pkg = require('../package.json')

require('../dist/app')

updateNotifier({ pkg }).notify()
