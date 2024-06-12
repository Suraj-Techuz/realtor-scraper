#!/bin/bash

echo "Updating package list..."
sudo apt-get update

echo "Installing required libraries..."
sudo apt-get install -y libxfixes3 \
                        libatk1.0-0 \
                        libatk-bridge2.0-0 \
                        libcups2 \
                        libxcomposite1 \
                        libxdamage1 \
                        libxrandr2 \
                        libxss1 \
                        libxtst6 \
                        libnss3 \
                        liboss4-salsa-asound2 \
                        libpangocairo-1.0-0 \
                        libpango-1.0-0 \
                        libcairo2 \
                        libpangoft2-1.0-0 \
                        libjpeg-dev \
                        libx11-6 \
                        libx11-xcb1 \
                        libx11-xcb-dev \
                        libxcb1 \
                        libxkbcommon-x11-0 \
                        libgbm-dev

echo "Setup completed."