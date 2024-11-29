# made by chatGPT
FROM mcr.microsoft.com/dotnet/sdk:latest
WORKDIR /app
RUN useradd -m runner && \
    chown -R runner:runner /app && \
    chmod 777 /app
USER runner
CMD ["bash"]
