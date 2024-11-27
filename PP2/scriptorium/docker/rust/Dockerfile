FROM rust:latest
WORKDIR /app
RUN useradd -m runner && \
    chown -R runner:runner /app && \
    chmod 777 /app
USER runner
CMD ["bash"]
