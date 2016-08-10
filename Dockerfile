FROM node:0.12
MAINTAINER bn0ir <gblacknoir@gmail.com>

RUN apt-get update \
    && apt-get install -y \
       git \
       sudo \
       rsync \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN useradd -r --shell /bin/bash --create-home reepio

RUN mkdir -p /data \
    && cd /data \
    && chown -R reepio:reepio /data \
    && sudo -u reepio git clone https://github.com/KodeKraftwerk/reepio-peering-server.git ./ \
    && sudo -u reepio cp config/dev/peering-server.dist.json config/dev/peering-server.json \
    && sudo -u reepio npm install

WORKDIR /data
USER reepio

EXPOSE 9000

CMD ["npm", "run", "start"]