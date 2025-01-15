import os
import requests
from dotenv import load_dotenv

load_dotenv()

KC_URL = os.getenv("KC_URL")
KC_ADM_USER = os.getenv("KC_ADM_USER")
KC_ADM_PASS = os.getenv("KC_ADM_PASS")


def fetch_admin_token():
    url = f"{KC_URL}/realms/master/protocol/openid-connect/token"
    body = {
        "grant_type": "password",
        "client_id": "admin-cli",
        "username": KC_ADM_USER,
        "password": KC_ADM_PASS
    }
    response = requests.post(url, data=body)

    if response.status_code == 200:
        response_body = response.json()
        return response_body["access_token"]
    return None


def create_realm(realm_name, admin_token):
    url = f"{KC_URL}/admin/realms"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {admin_token}"
    }
    body = {
        "realm": realm_name,
        "enabled": True,
        "displayName": realm_name,
        "userManagedAccessAllowed": True
    }
    response = requests.post(url, json=body, headers=headers)
    if response.status_code == 201:
        return {
            "message": f"Realm {realm_name} created"
        }
    return None


admin_token = fetch_admin_token()
realm = create_realm("Programatic Realm", admin_token)

print(realm["message"])
