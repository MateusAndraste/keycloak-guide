# Examples

To run this example you can user the docker file present here, we will use Node JS just for simplincity purpouse, as the all flow uses the Built In Keycloak API, you can reproduce in any Programming language.

### Running the application

1. Run the container through the docker compose file using the `docker compose up -d`
2. Install dependencies `docker compose exec app npm i`
3. Then run the application `docker compose exec app npm run dev`

> :exclamation: This is an approach for developer only, do not use in production

This is a simples approach how a backend can interact with keycloak auth and redirect to a front-end for instance to do so you can follow:

1. Access `localhost:8080/login`, this way you will be redirected to keycloak login screen.
2. Fill form with user credentials
3. You will be redirected to home scream able to logout
