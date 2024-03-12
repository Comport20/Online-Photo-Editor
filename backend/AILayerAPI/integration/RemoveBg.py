import requests
from requests import Response


def ask_acetone(img_path: str):
    with open(img_path, 'rb') as file:
        return requests.post(
            url='https://api.acetone.ai/api/v1/remove/background?format=png',
            files={
                'image': ('test.png', file.read()),
            },
            headers={'Token': '1ebaf582-e5d3-4d9f-bff8-0805792cf4e8'}
        )


def response_acetone(server_response: Response):
    if server_response.headers['content-type'] in ('image/png', 'image/webp', 'image/jpeg'):
        return server_response
    else:
        return server_response.json()
