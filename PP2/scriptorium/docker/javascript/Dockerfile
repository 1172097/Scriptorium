FROM node:18-slim
WORKDIR /app
RUN useradd -m runner && \
    chown -R runner:runner /app && \
    chmod 777 /app
USER runner
CMD ["node"]
