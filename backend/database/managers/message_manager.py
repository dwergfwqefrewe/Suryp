from typing import List
from models.message import Message
from database.managers.base_manager import BaseManager
from database.config import SessionLocal

class MessageManager(BaseManager):
    def __init__(self):
        super().__init__(Message)

    def save_message(self, sender_id: int, receiver_id: int, text: str) -> Message:
        with SessionLocal() as session:
            message = Message(sender_id=sender_id,
                              receiver_id=receiver_id,
                              text=text)
            session.add(message)
            session.commit()
            session.refresh(message)
            return message

    def get_history(self, user1_id: int, user2_id: int) -> List[Message]:
        with SessionLocal() as session:
            return session.query(Message).filter(
                ((Message.sender_id == user1_id) & (Message.receiver_id == user2_id)) |
                ((Message.sender_id == user2_id) & (Message.receiver_id == user1_id))
            ).order_by(Message.timestamp.desc()).all()


    def get_chats(self, user_id: int) -> List[Message]:
        with SessionLocal() as session:
            messages = session.query(Message).filter(
                (Message.sender_id == user_id) | (Message.receiver_id == user_id)
            ).order_by(Message.timestamp.desc()).all()

            return messages

