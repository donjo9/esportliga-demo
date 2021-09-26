# esportliga demo site

- [esportliga demo site](#esportliga-demo-site)
  - [Installation](#installation)
    - [API](#api)
    - [CLIENT](#client)

## Installation

### API

In the api/ folder run the following:

```bash
npm i
# or
yarn install
```

Then run one of the following

```bash
# To create database and seed with demo data (user/teams/teaminvitations)
npm run initdb
#or
yarn initdb
```

```bash

# or to create database tables only, without demo data
npm run createdb
#or
yarn createdb

```

To seed database with data later run

```bash
npm run seeddb
#or
yarn seeddb
```

To run the API, run

```bash
npm run dev
#or
yarn dev
```

### CLIENT

In the client/ folder run the following

```bash
npm i
# or
yarn install
```

To run the client run,

```bash
npm run dev
# or
yarn dev
```
