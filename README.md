# AutoHeal — Self-Healing CI/CD Platform 🚀

**Automated CI/CD | Jenkins | Docker | AWS | Node.js | GitHub**

AutoHeal is a DevOps project that automates the process of testing, packaging, and deploying a Node.js application to AWS Elastic Beanstalk. It uses Jenkins to orchestrate the CI/CD pipeline, Amazon S3 to store deployment artifacts, Docker to build container images, and automated health checks to verify deployments.

The project also implements a rollback mechanism that attempts to restore the previously deployed application version when a pipeline failure occurs.

## 📌 Project Overview

AutoHeal demonstrates how DevOps practices can make application deployments more consistent, repeatable, and easier to monitor.

### Key Features

- **Continuous Integration:** Jenkins retrieves source code from GitHub.
- **Automated Testing:** Runs Node.js tests before deployment.
- **Docker Image Build:** Builds a container image locally.
- **Artifact Packaging:** Packages application files into a ZIP deployment bundle.
- **AWS S3 Integration:** Uploads deployment artifacts to an S3 bucket.
- **Automated Deployment:** Creates application versions and deploys them through AWS Elastic Beanstalk.
- **Health Checks:** Verifies the application's `/health` endpoint after deployment.
- **Rollback Mechanism:** Attempts to redeploy the previously active version when a pipeline failure occurs.
- **Rollback Verification:** Checks the restored Elastic Beanstalk version and application health.
- **GitHub Integration:** Uses Jenkins Poll SCM to detect repository changes.

## 🏗️ Architecture

```text
Developer
    |
    v
GitHub Repository
    |
    v
Jenkins CI/CD Pipeline
    |
    +--> Checkout Source Code
    |
    +--> Install Dependencies
    |
    +--> Run Automated Tests
    |
    +--> Build Docker Image
    |
    +--> Package Deployment ZIP
    |
    v
Amazon S3
    |
    v
AWS Elastic Beanstalk
    |
    v
Node.js Application
    |
    v
/health Endpoint
    |
    +--> Healthy: Deployment succeeds
    |
    +--> Failure: Attempt rollback to previous version
```

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Git and GitHub | Version control and source code hosting |
| Jenkins | CI/CD pipeline orchestration |
| Node.js | Backend application runtime |
| Express.js | HTTP server and API endpoints |
| Node.js Test Runner | Automated application testing |
| Supertest | HTTP endpoint testing |
| Docker | Container image building |
| AWS CLI | Automating AWS operations |
| Amazon S3 | Storing deployment artifacts |
| AWS Elastic Beanstalk | Application deployment and environment management |
| Windows CMD and PowerShell | Local automation and command execution |

## 🔄 CI/CD Workflow

The Jenkins pipeline contains the following stages:

1. **Checkout:** Retrieves the latest source code from the `main` branch.
2. **Install Dependencies:** Installs dependencies using `npm ci`.
3. **Test:** Runs automated tests using `npm test`.
4. **Build Docker Image:** Builds the application image locally.
5. **Package Deployment:** Creates `autoheal-deploy.zip` containing the required application files.
6. **Upload to S3:** Uploads the deployment bundle to the configured S3 bucket.
7. **Create Application Version:** Registers a new application version in Elastic Beanstalk.
8. **Capture Previous Version:** Records the currently deployed version for potential rollback.
9. **Deploy to Elastic Beanstalk:** Updates the environment to the new application version.
10. **Wait for Deployment:** Waits for the Elastic Beanstalk environment update to finish.
11. **Health Check:** Sends an HTTP request to `/health` and verifies that the application reports a healthy status.
12. **Rollback on Failure:** Attempts to restore the previous version and verifies the restored version and health endpoint.

Jenkins uses Poll SCM to check the GitHub repository periodically and trigger builds when changes are detected.

## 🩺 Application Endpoints

### Home Endpoint

```http
GET /
```

Example response:

```json
{
  "application": "AutoHeal CI/CD Platform",
  "version": "1.0.0",
  "status": "running"
}
```

### Health Endpoint

```http
GET /health
```

Example response:

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2026-10-28T08:00:00.000Z"
}
```

The timestamp and version depend on the running application configuration.

## 📂 Project Structure

```text
autoheal-cicd/
├── server.js
├── server.test.js
├── package.json
├── package-lock.json
├── Dockerfile
├── .dockerignore
├── .gitignore
├── Jenkinsfile
└── README.md
```

## ⚙️ Prerequisites

Install or configure the following before reproducing the project:

- Node.js and npm
- Git
- Docker Desktop
- Jenkins
- AWS CLI v2
- An AWS account with appropriate IAM permissions
- An S3 bucket for deployment artifacts
- An Elastic Beanstalk application and environment configured for the application

## 🚀 Run Locally

Clone the repository:

```bash
git clone https://github.com/khetanmaya2-commits/Autoheal-CI-CD-Project.git
cd Autoheal-CI-CD-Project
```

Install dependencies:

```bash
npm ci
```

Run automated tests:

```bash
npm test
```

Start the application:

```bash
npm start
```

Open the following URLs:

- Home: `http://localhost:3000/`
- Health: `http://localhost:3000/health`

## 🐳 Build the Docker Image

Build the image:

```bash
docker build -t autoheal-app:local .
```

Run the container:

```bash
docker run --rm -p 3000:3000 autoheal-app:local
```

Test the health endpoint:

```bash
curl http://localhost:3000/health
```

The application uses the non-root `node` user inside the container.

**Note:** The Docker image build and the AWS Elastic Beanstalk deployment are separate steps in the current pipeline. The ZIP bundle contains the application source and Dockerfile; Elastic Beanstalk builds or runs the application according to its Docker platform configuration.

## ☁️ AWS Configuration

The project uses the Mumbai AWS region (`ap-south-1`).

| AWS Resource | Configuration |
|---|---|
| Elastic Beanstalk application | `AutoHeal` |
| Elastic Beanstalk environment | `AutoHeal-env` |
| S3 deployment bucket | `autoheal-deploy-artifacts-2026-maya` |
| AWS region | `ap-south-1` |

Configure your AWS CLI credentials securely using a named profile:

```bash
aws configure --profile autoheal
```

Verify your identity:

```bash
aws sts get-caller-identity --profile autoheal
```

Inspect the environment:

```bash
aws elasticbeanstalk describe-environments \
  --environment-names AutoHeal-env \
  --region ap-south-1 \
  --profile autoheal
```

**Security:** Never commit AWS access keys, secret keys, passwords, or `.env` files to GitHub. Jenkins uses stored credentials for AWS access. Apply least-privilege IAM permissions and avoid exposing credentials in console output.

## 🔁 Rollback Strategy

Before deployment, the pipeline captures the currently active Elastic Beanstalk version.

If a subsequent pipeline stage fails, the Jenkins `post` failure handler attempts to:

1. Update the environment to the previously captured version.
2. Wait for the environment update to finish.
3. Verify that Elastic Beanstalk reports the expected version label.
4. Call the restored application's `/health` endpoint.
5. Report whether the rollback verification succeeded.

The rollback mechanism is implemented in the Jenkinsfile. A controlled failure test is still required to confirm its behavior under real failure conditions.

## ✅ Project Validation

The following has been verified during development:

- Automated Node.js tests passed.
- Jenkins Build #10 completed successfully.
- The application was deployed to AWS Elastic Beanstalk.
- The live environment was reported healthy.
- The `/health` endpoint returned a healthy response.
- The `autoheal-10` application version exists in Elastic Beanstalk.
- Rollback logic and post-rollback verification are present in the Jenkinsfile.

**Known limitation:** Successful rollback under a deliberately induced deployment or health-check failure has not yet been verified.

## 🔐 Security and Cost Considerations

- Keep the S3 deployment bucket private.
- Store AWS credentials in Jenkins Credentials rather than in source code.
- Use least-privilege IAM policies.
- Avoid unnecessary EC2 instances, load balancers, NAT gateways, and other chargeable resources.
- Check AWS billing and resource usage after testing.
- Terminate the Elastic Beanstalk environment when a live demonstration is no longer needed, after saving project evidence.

## 🎯 Learning Outcomes

Through this project, I practised:

- Building a CI/CD pipeline with Jenkins.
- Automating tests and Docker image builds.
- Managing deployment artifacts with Amazon S3.
- Deploying a Node.js application using AWS Elastic Beanstalk.
- Integrating GitHub with Jenkins Poll SCM.
- Implementing deployment health checks.
- Writing rollback and recovery automation.
- Managing AWS credentials and deployment configuration.

## 👩‍💻 Author

**Maya Khetan**

BTech Computer Science Engineering Student | Aspiring DevOps & Cloud Engineer

GitHub: [khetanmaya2-commits](https://github.com/khetanmaya2-commits)

---

*AutoHeal is a learning and portfolio project demonstrating automated application delivery and an implemented rollback strategy. Rollback reliability should be confirmed through controlled failure testing before using the pipeline for production workloads.*
