# My first attempt to dockerize a project
#___________Init_____________
# FROM node:20.10.0

############# Separate the old files into stages ###################
############# Tried to learn write docker files like the veteran ###################


############# ############# ############# ############# #############
################### Stage 0 getting ready for dependency ###################
############# ############# ############# ############# #############
# optimization 1 tried to use a slimmer version
# By using alpine I reduced the image size from 1.16 GB to 147mb
# Also locked the version and the image using 
# Version locked is for stability and image using locked is for the security reason.
FROM node:20.11.1-alpine3.19@sha256:c0a3badbd8a0a760de903e00cedbca94588e609299820557e72cba2a53dbaa2c AS Dependencies

LABEL maintainer="Zhaokai Guan <zguan25@myseneca.ca>"\
      description="Fragment node.js microservice"
WORKDIR /app
# My usual port number
ENV PORT=8080
# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn
# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false
# Optimized 2: in Lab6 setting the NODE_ENV as production
# So this could make sure express is in the production mode. 
# So as the other packages too. 
ENV NODE_ENV=production
# Install node dependencies defined in package-lock.json
COPY package*.json ./
RUN npm install
############# ############# ############# ############# #############
############# Stage 1 getting the repo ready #############
############# ############# ############# ############# #############
FROM node:20.11.1-alpine3.19@sha256:c0a3badbd8a0a760de903e00cedbca94588e609299820557e72cba2a53dbaa2c AS Start
# Setting up curl otherwise there is no curl to use in the health check
# THIS IS HOW YOU SELECT A VERSION IN 
RUN apk update && apk add --no-cache 'curl=8.5.0-r0'
# Setting work dir 
# For docker noobs, the work dir is set as /app
# PWD is /app
WORKDIR /app
# Copy over the node modules from the earlier stage
COPY --from=Dependencies /app /app
# Copy the source code over
# left is path on the host right is path on the image

COPY . .

# If the mode is on dev
# Copy the test needed files over here
# COPY ./test/.htpasswd ./test/.htpasswd

# Start the server and get ready to run it
CMD ["npm", "start"]
EXPOSE 8080


HEALTHCHECK --interval=15s --timeout=30s --start-period=5s --retries=3 \
    CMD curl --fail http://localhost:${PORT} || exit 1
