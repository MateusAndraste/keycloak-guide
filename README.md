>❗This is a Work in Progress repository

# Welcome to Keycloak guide

This repository will try to guide you in some basic concepts of this awesome tool of Identity Provider.
Feel free to navigate and explore the repository, here we make available a [docker-compose.yaml](./docker-compose.yaml) file with keycloak 24.0.5 to develop purpouses, Furthermore, as we go increment the repository we will try to mantain the configurations at `config/db/h2` directory, wich is a bind to database of tool.

## Chapters

1. [Realms](./realms)

## Tips

### Network

The examples here are using the Docker container to run, based on that there is some approachs to handle with network communication between containers, here are some suggentions approach.

> :bulb: This guide considering your keycloak instance is running localy, using the Keycloak from this repository for instance, if you have a Keycloak already configured and running, you can use it just appling URL of it.

<details>
<summary>Managing Hosts machine</summary>
For this approach you will need to manage the Host file from your machine to configure the [docker-compose.yaml](./docker-compose.yaml) to add a extra host at the service you want like:

> :bulb: you can discover the Docker Gateway IP addres by entering in the container and check the hosts file from them using something like `cat /etc/hosts` this way you can search which ip the `host.docker.internal` is referenced for, let's assume for now the `172.17.0.1`

```yaml
extra_hosts:
  - "host.docker.internal:172.17.0.1"
```

this way you will bind the localhost from docker to the Docker Gateway, and they will reach the user machine, now we need just change the hosts file from our machine and put the follow line

`127.0.0.1 host.docker.internal`

This file will change based on your OS as follow:

<strong>Windows:</strong> Open your notepad as admin then open the file with name hosts in the path `C:\Windows\system32\drivers\etc\`

<strong>Linux/Mac:</strong> Just need to open the `/etc/hots` with uso using any text text editor (nano, vi, vim, etc.) with sudo privileges.
Ex.: `sudo vim /etc/hosts`

> :exclamation: If you are using WSL 2 with Docker Engine you should edit the Windows hosts file not the WSL one

After that where you should find the `localhost` to reach the keycloak you will put the `host.docker.internal`.

Ex.: `localhost:8080` will be `host.docker.internal:8080`

</details>
<details>
<summary>Custom network</summary>
You can create a external network and link the containers to it.

Creating a docker new network command:

```bash
docker network create keycloak-env
```

Adding to `docker-compose.yaml` file:

```yaml
networks:
  default:
    external: true
    name: keycloak-env
```

This way this network will by applied to all services in this file using this approach where you should find the `localhost` to reach the keycloak you will put the keycloak's container name.

Ex.: Considering the name of container was keycloak-container the reference should be from `localhost:8080` to `keycloak-container:8080`

</details>
