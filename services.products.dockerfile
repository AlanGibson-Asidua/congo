FROM python:3-alpine

WORKDIR /usr/src/app

COPY services/products/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

ENV FLASK_APP app.py
ENV FLASK_DEBUG 1
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]