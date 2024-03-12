from pydantic import BaseModel


class RequestImageModel(BaseModel):
    prompt: str
    style: int | None = 3
