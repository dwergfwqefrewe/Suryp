from pydantic import BaseModel
from datetime import datetime

class MessageSchema(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    text: str
    timestamp: datetime

    class Config:
        from_attributes = True 


