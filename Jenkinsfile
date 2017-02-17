pipeline {
  agent { docker 'node:6.6' }

  parameters {
    string(name: 'SERVERLESS_VERSION', defaultValue: '1.6.1', description: 'Serverless version to build & deploy against')
  }

  stages('Setup') {
    steps {
      sh "npm install -g serverless@${params.SERVERLESS_VERSION}"
      sh 'npm install'
    }
  }

  stages('Test') {
    steps {
      sh 'npm run test:functions'
    }
  }

  stages('Build') {
    steps {
      sh 'sls webpack'
    }
  }

  stages('Deploy') {
    environment {
      AWS_ACCESS_KEY = credentials('aws-access-key')
      AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
      AWS_REGION = "eu-west-1"
    }

    steps {
      sh "sls deploy -s ${params.STAGE} -r ${env.AWS_REGION}"
    }
  }
}
