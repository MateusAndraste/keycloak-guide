import "dotenv/config";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

const memoryStore = new session.MemoryStore();

const { KC_BASE_URL, KC_REALM, KC_CLIENT_ID } = process.env;
const BASE_URL = `${KC_BASE_URL}/realms/${KC_REALM}/protocol/openid-connect`;
const app = express();
app.use(session({
    secret: "ultra-secret",
    resave: false,
    saveUninitialized: false,
    store: memoryStore
}))
app.use(cookieParser());

app.get("/", (req, res) => {
    let login = '<a href="/login">Login</a>';
    let content = "";
    const isAuthenticated = req.session?.id_token && req.session?.access_token;
    if (isAuthenticated) {
        login = '<a href="/logout">Logout</a>';
        content = `
            <div style="max-width: 700px; word-wrap: break-word;">
                <strong>access_token: </strong>
                ${JSON.stringify(req.session?.access_token)}
            </div>
            </br>
            <div style="max-width: 700px; word-wrap: break-word;">
                <strong>id_token: </strong>
                ${JSON.stringify(req.session?.id_token)}
            </div>
        `;
    }
    const isFailed = req.session?.error;
    if (isFailed) {
        content = `<strong>Error: </strong> ${JSON.stringify(req.session?.error)}`;
    }
    res.send(`
        <main style="font-family: sans-serif; padding: 20px;">
            <h1>Hello Auth</h1>
            ${login}
            <br/>
            ${content}
        </main>
    `)
});

app.get("/login", (req, res) => {
    const prams = new URLSearchParams({
        client_id: KC_CLIENT_ID as string,
        response_type: "code",
        scope: "openid",
        redirect_uri: "http://localhost:3000/callback",
    })

    const url = `${BASE_URL}/auth?${prams.toString()}`;
    res.redirect(url)
});

app.get("/callback", async (req, res) => {
    const params = new URLSearchParams({
        client_id: KC_CLIENT_ID as string,
        grant_type: "authorization_code",
        code: req.query.code as string,
        redirect_uri: "http://localhost:3000/callback",
    });

    const url = `${BASE_URL}/token`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
    })
    const result = await response.json();
    if (!response.ok) {
        req.session.error = result;
    }
    req.session.access_token = result.access_token;
    req.session.refresh_token = result.refresh_token;
    req.session.id_token = result.id_token;
    req.session.save();
    res.redirect("/")
});

app.get("/logout", async (req, res) => {
    const params = new URLSearchParams({
        client_id: KC_CLIENT_ID as string,
        id_token_hint: req.session.id_token as string,
        refresh_token: req.session.refresh_token as string,
        post_logout_redirect_uri: "http://localhost:3000/callback",
    });
    const url = `${BASE_URL}/logout`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
    })
    if (!response.ok) {
        const result = await response.json();
        console.log(result);
        throw new Error("Failed to logout");
    }

    req.session.destroy((err: any) => {
        console.error(err);
    });
    res.redirect("/")
});

app.listen(3000, () => {
    console.log("listening on port 3000")
})