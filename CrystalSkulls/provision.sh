#!/bin/sh

# node
yum -y install epel-release
yum -y repolist
yum -y install node
yum -y install npm
npm install express-generator -g
npm install node-inspector -g
npm install nodemon -g
npm install -g gulp

# mongodb
cp /vagrant/mongodb.repo /etc/yum.repos.d/
yum -y install mongodb-org
chkconfig mongod on
service mongod start
