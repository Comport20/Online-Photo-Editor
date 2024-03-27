import requests
import json

generate_json = {
    "prompt": "Котики смотрят на море",
    "style": 2
}

remove_json = {
    "base64": "",
    "uid": "1442"
}


def test_generate_model():
    response = requests.post(url="http://127.0.0.1:8000/ai/generate/model/", json=generate_json)
    remove_json["base64"] = response.json()[0]["image"]
    assert response.status_code == 200


def test_remove_bg():
    response = requests.post(url="http://127.0.0.1:8000/ai/remove/bg", json=remove_json)
    assert response.status_code == 200
