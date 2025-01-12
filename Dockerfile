FROM node:20

WORKDIR /usr/src/smart-brain-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]
