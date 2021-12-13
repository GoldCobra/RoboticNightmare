#!/bin/bash
cd /home/ec2-user/RoboticNightmare
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install v16.6.0
npm install -C /home/ec2-user/RoboticNightmare
npm run start