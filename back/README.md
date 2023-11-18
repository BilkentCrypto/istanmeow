# NFTq
Communities for NFT collections

### Description
Provide a more detailed explanation of what the project does, what it is for, and what problem it solves. It can also include some technical details.

### Dockerizing and google cloud run
1. Install gcloud sdk ( assuming you have google cloud run and project setup)
2. in terminal:
gcloud auth login
gcloud config set project <your project>

docker build --no-cache --platform=linux/amd64  -t gcr.io/<your project>/<name> .
docker push gcr.io/<your project>/<name> 
and then go to the browser and create a new service in gcloud
### Usage
Provide instructions on how to use the project, including any commands that need to be run or examples of how to use the project.

### Contributing
Explain how others can contribute to the project, including how to submit bug reports, feature requests, or pull requests.

### License
Include information about the project's license and any copyright information.