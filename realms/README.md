# Configuring a Keycloak Realm

A Realm is a isolated environment who you can configure the user base (such as your roles), identity providers, authentication flows and more this way it is possible to manage many applications with different requirentments within the same keycloak instance as well as personalize the used interface, making them a greate tool to implicit flow authentication.

## Creating by Admin Console
It is the simplest way to create, just need to access the Admin Console and follow the steps.
> :bulb: In our case the admin console is located in [localhost:8080](localhost:8080)

When you access the Admin console you will see some welcome page with useful links, what is needed is click on the drop down in ther left up corner and click at "Create realm" button

![Create Realm button](images/create_realm.png)

This way you will guided to a "Create ralm" view, this one will show you a some form to fill with description.
> :exclamation: You will see a file upload box, ignore it for now, this is a topic for another moment.

Fill the form with the realm informations and click con Create button
![Realm info form](images/realm_info.png)

Congratulations, you just created a Realm, you can see come options in the drawer menu, we can focus by now in the <strong>Clients</strong> and <strong>Users</strong>.

<strong>Clients:</strong> They are used to create a service who will request the authentication for a user. It is important to note the user base it is specific of a realm, this way we can say with the with clients you can manage which applications users in that realm will interact with.

<strong>User:</strong> In the same way here are ours user base, this one can be created directly via admin console or programmatically through REST API or even the Federation and Social Login.

## API REST
We can create a Realm through the built in API REST, to do that, you will need a admin user, you can create one at the Master Realm with the required roles or use one already exists.

The first step is request a Auth token from the admin user, to do that you can call this endpoint:
```bash
curl --location '<KEYCLOAK_URL>/realms/master/protocol/openid-connect/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=password' \
--data-urlencode 'client_id=admin-cli' \
--data-urlencode 'username=<ADMIN_USER>' \
--data-urlencode 'password=<ADMIN_PASSWORD>'
```
With that the response will be an JWT token at the access_token key

Response:
```json
{
    "access_token": "eyJhbGciOi...sVUdOncNpw",
    "expires_in": 60,
    "refresh_expires_in": 1800,
    "refresh_token": "eyJhbGciOi...OzpWGyjXhg",
    "token_type": "Bearer",
    "not-before-policy": 0,
    "session_state": "1c3ec250-9bd4-4488-a471-a6c287cc6f17",
    "scope": "profile email"
}
```

Whit the token we can call now the endpoint to create the Realm
```bash
curl --location '<KEYCLOAK_URL>/admin/realms' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOi...qE7kn6stfQ' \
--data '{
    "realm": "API realm",
    "enabled": true,
    "displayName": "API realm",
    "userManagedAccessAllowed": true
}'
```
This way you will see a 201 status code and your Realm will be created, with that we have such a versatility in how we can manage our realms and use some automated method as we can see at [create_realm.py](./scripts/create_realm.py)

>:bulb: To run that script you can follow these [steps](./scripts/RUN.md)

To see the created Realms you can use the API to, just call the endpoint:
```bash
curl --location 'http://localhost:8080/admin/realms' \
--header 'Authorization: Bearer eyJhbGciOi...qE7kn6stfQ'
```

## Exporting the Realm
Keycloak has a powerful tool allowing us to export a Realm and import in another Keycloak cluster you can access the <strong>Realm settings</strong> area and then click on the drop down button at top right corner of the screen and select the <strong>Partial export</strong> option.

After that a Dialog will open, select what you want to export and click on Export button.

![Realm export](images/export.png)
![Realm export button](images/export_button.png)

To export them you can go to the Create Realm area and make the upload of the file or use the Partial Import in the Action drop down button.