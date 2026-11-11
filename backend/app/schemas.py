from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field

# задача класса - проверять данные, приходящие от пользователя
class NoteCreate(BaseModel):        # BaseModel для автоматической валидации данных
    question: str = Field(min_length = 1)
    content: str = Field(min_length = 1, max_length = 5000)
    
# Pydantic-схема, описывает, какие данные API должен возвращать клиенту
# задача класса - проверять данные, возвращающиеся от сервера
class NoteResponse(BaseModel):
    id: UUID
    question: str
    content: str
    created_at: datetime
    tags: list["TagResponse"]
    model_config = {"from_attributes": True}        # чтобы pydantic успешно читал атрибуты sqlalchemy-объекта
    
class TagResponse(BaseModel):
    id: UUID
    name: str
    model_config = {"from_attributes": True}