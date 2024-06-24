FROM python:3.12

COPY . /app

WORKDIR /app

RUN pip3 install --upgrade pip && \
    pip3 install -r requirements.txt

RUN python3 init_db.py && python3 populate_db.py

CMD ["flask", "run", "--host=0.0.0.0"]
