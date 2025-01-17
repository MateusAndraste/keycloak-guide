import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";

const { KC_BASE_URL, KC_REALM, KC_CLIENT_ID } = process.env;
const BASE_URL = `${KC_BASE_URL}/realms/${KC_REALM}/protocol/openid-connect`;
const app = express();
app.use(cookieParser());

app.get("/", (req, res) => {
    let login = '<a href="/login">Login</a>';
    let content = "";
    if (req.cookies?.kc_token) {
        login = '<a href="/logout">Logout</a>';
        content = `${JSON.stringify(req.cookies.kc_token)}`;
    }
    res.send(`
        <h1>Hello Auth</h1>
        ${login}
        <br/>
        ${content}
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

app.get("/logout", async (req, res) => {
    const idToken = req.cookies.kc_token.id_token;
    const refreshToken = req.cookies.kc_token.refresh_token;
    const params = new URLSearchParams({
        client_id: KC_CLIENT_ID as string,
        id_token_hint: idToken,
        refresh_token: refreshToken,
        post_logout_redirect_uri: "http://localhost:3000/callback",
    })

    const url = `${BASE_URL}/logout`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
    })
    if (!response.ok) {
        throw new Error("Failed to logout");
    }
    res.clearCookie("kc_token");
    res.redirect("/")

});

app.get("/callback", async (req, res) => {
    const params = new URLSearchParams({
        client_id: KC_CLIENT_ID as string,
        grant_type: "authorization_code",
        code: req.query.code as string,
        redirect_uri: "http://localhost:3000/callback",
    });

    const url = `${BASE_URL}/token`;
    const resposne = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
    })
    const data = await resposne.json();
    res.cookie("kc_token", data, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.redirect("/")
});

app.listen(3000, () => {
    console.log("listening on port 3000")
})