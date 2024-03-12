from fastapi import APIRouter
from fastapi.responses import Response

from model.RemoveBgModel import RemoveBgModel
from model.RequestImageModel import RequestImageModel
from integration.Text2Image import Text2ImageAPI
import integration.RemoveBg as RemoveBg

import base64
import os

router = APIRouter()


@router.post("/ai/generate/model/")
def generate_model(generate_request: RequestImageModel):
    api = Text2ImageAPI('https://api-key.fusionbrain.ai/',
                        '44C5CF680CA9237F63F15CA041970C6D',
                        'F4672A1A0848755706DA030FE857AE00')
    model_id = api.get_model()
    uuid = api.generate(generate_request.prompt, model_id, generate_request.style)
    images = api.check_generation(uuid)
    return [
        {"prompt": f"{generate_request.prompt}", "style": f"{generate_request.style}", "image": f"{images}"}]


@router.post("/ai/remove/bg",
             responses={
                 200: {
                     "content": {"image/png": {}}
                 }
             },
             response_class=Response
             )
def remove_bg(remove_bg_request: RemoveBgModel):
    file_url = fr"resource\transit-point\input{remove_bg_request.uid}.png"
    with open(file_url, "wb+") as image_file:
        decode = base64.b64decode(remove_bg_request.base64)
        image_file.write(decode)
    response_acetone = RemoveBg.ask_acetone(file_url)
    response_ai_remove = RemoveBg.response_acetone(response_acetone)
    os.remove(file_url)
    return Response(content=response_ai_remove.content,
                    media_type=response_ai_remove.headers['content-type'])
