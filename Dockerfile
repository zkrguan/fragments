# My first attempt to dockerize a project
#___________Init_____________
FROM node:20.10.0

LABEL maintainer="Zhaokai Guan <zguan25@myseneca.ca>"\
      description="Fragment node.js microservice"

#___________Setting ENV_____________
# My usual port number
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

#___________Setting Work Dir and install dependency_____________

# Setting work dir 
WORKDIR /app

# For docker noobs, the work dir is set as /app
# PWD is /app
# left is path on the host right is path on the image
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm install 

#___________Copy the source code to image_____________

# Copy src to /app/src/
# left is path on the host right is path on the image
COPY ./src ./src

# Copy the test needed files over here
COPY ./test/.htpasswd ./test/.htpasswd

#___________run this command when docker run triggers_____________
CMD npm start

#___________ Expose the port _____________
EXPOSE 8080


