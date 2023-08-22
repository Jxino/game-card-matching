from typing import Union
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()

# 정적 파일 디렉토리를 설정합니다. 이 디렉토리는 실제로 정적 파일이 저장된 곳입니다.
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/") # 라우팅 설정
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}") # 라우팅 설정
def read_item(item_id: int, x: str, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q, "x": x}

class Item(BaseModel):
    y_value: str

@app.post("/upper.api")
def to_upper(item: Item):
    result = item.y_value.upper()
    response = {
        "result": result
    }
    return response;