# Utaitai

A Music Player for language learning.

## Contents

- [Usage](#usage)
- [Getting Started](#getting-started)
- [Structure](#structure)
- [Learning Logs](#learning-logs)
- [Features](#features)

## Usage

## Getting Started

## Structure

### Frontend

### Backend

#### [server.js](server.js)

Do the followings:

- create app
- connect db
- auth user
- save user to db
- routes

#### [routes](routes)

- blob - CRUD azure storage blob
- lyric - CRUD Track.lyrics
- note - CRUD User.noteList
- settings - CRUD User.settings
- track - CRUD User.trackList

#### [models](models)

Contains an index.js where mongoose models all schemas from under the same dir.

#### [controllers](controllers)

Handle requests to each route.

## Learning Logs

### Frontend

### Backend

### Deployment

#### Multiple .env configuration for different environments

1. Use [custom-env](https://www.freecodecamp.org/news/nodejs-custom-env-files-in-your-apps-fa7b3e67abe1/).

2. Pass true to env() as in `require('custom-env').env(true)`.

3. Set NODE_ENV respectively.

- [Windows](https://blog.jimmydc.com/cross-env-for-environment-variables/)

  npm-scripts: {"dev": "**set NODE_ENV=dev&** nodemon server",}

- Linux

### Others

#### Can I fork my own repo?

No, you can [import](https://stackoverflow.com/a/43576472/19419913) it instead.

## Features
