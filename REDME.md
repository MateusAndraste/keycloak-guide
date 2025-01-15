# Welcome to Keycloak guide
This repository will try to guide you in some basic concepts of this awesome tool of Identity Provider.
Feel free to navigate and explore the repository, here we make available a [docker-compose.yaml](./docker-compose.yaml) file with keycloak 24.0.5 to develop purpouses, Furthermore, as we go increment the repository we will try to mantain the configurations at `config/db/h2` directory, wich is a bind to database of tool.

## Chapters

1. [Realms](./realms)

## Tips

### Network
To work well with another container may be help create a external network something like:
```bash
docker network create keycloak-env
```
Then reference it in the [docker-compose.yaml](./docker-compose.yaml) file