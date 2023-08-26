# 혼자서 즐기는 신경쇠약 게임

8쌍의 카드(총 16장)를 2장씩 뒤집어서 매치하면 점수를 얻는 게임

# 설치 방법

이 게임은 FastAPI로 구현된 파이썬 서버가 필요합니다.
FastAPI를 구동하기 위해서 uvicorn과 FastAPI를 설치합니다.

```bash
$ pip install uvicorn
$ pip install fastapi
```

서버를 구동하려면 다음 명령어를 실행하면 됩니다.

```bash
$ uvicorn main:app -- reload
```

웹브라우저에서 http://127.0.0.1:8000/static/index.html으로 접속하면 됩니다.