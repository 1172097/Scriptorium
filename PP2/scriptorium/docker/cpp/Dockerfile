FROM gcc:latest
WORKDIR /app
RUN apt-get update && apt-get install -y cmake && \
    useradd -m runner && \
    chown -R runner:runner /app && \
    chmod 777 /app
USER runner
CMD ["bash"]
