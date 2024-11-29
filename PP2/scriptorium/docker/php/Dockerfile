FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Create non-root user and set permissions
RUN useradd -m runner && \
    chown -R runner:runner /var/www/html && \
    chmod 755 /var/www/html

# Switch to non-root user
USER runner

# Apache runs on port 80
EXPOSE 80

# Use Apache's default command
CMD ["apache2-foreground"]