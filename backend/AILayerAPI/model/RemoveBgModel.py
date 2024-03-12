from pydantic import BaseModel


class RemoveBgModel(BaseModel):
    base64: str | None = None
    uid: str
