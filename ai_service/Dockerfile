FROM python:3.10-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-vie \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements-render.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV DISABLE_TRANSFORMERS=1
ENV PORT=8001

COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8001

CMD ["/start.sh"]
