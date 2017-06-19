# auth-service

[![Build Status](https://travis-ci.org/ship7software/auth-service.svg?branch=master)](https://travis-ci.org/ship7software/auth-service)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c106a5023e2546ba8d153c2a2b841bf5)](https://www.codacy.com/app/ship7software/auth-service?utm_source=github.com&utm_medium=referral&utm_content=ship7software/auth-service&utm_campaign=badger)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/c106a5023e2546ba8d153c2a2b841bf5)](https://www.codacy.com/app/Ship7/auth-service?utm_source=github.com&utm_medium=referral&utm_content=ship7software/auth-service&utm_campaign=Badge_Coverage)
[![generator-api](https://img.shields.io/badge/built%20with-generator--api-green.svg)](https://github.com/ndelvalle/generator-api)

Serviço de Autenticação das aplicações Ship7Software





## dependencies

[Docker](https://docs.docker.com/engine/installation/) :whale: & [docker-compose](https://docs.docker.com/compose/install/).

## developing

run locally run using docker-compose:

```bash
sudo docker-compose up
```

the app runs on `localhost:8080`

## production

build the Docker :whale: container and run it:

_you'll likely be consuming mongodb as a service, so make sure you set the env var to connect to it._

```bash
sudo docker build -t <image-name> .
sudo docker run \
  -p <host-port>:8080 \
  -d <image-name> \
  -e MONGO_DB_URI=mongodb://<username>:<password>@<host>:<port> \
  npm run start
```



--------------------------------------------------------------------------------
