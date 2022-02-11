#!/bin/bash
cd /home/ec2-user/RoboticNightmare
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install v16.6.0
npm install /home/ec2-user/RoboticNightmare
killall node
node index.js > /home/ec2-user/RoboticNightmare/app.log 2> /home/ec2-user/RoboticNightmare/app.log < /home/ec2-user/RoboticNightmare/app.log &