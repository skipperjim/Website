#!/bin/bash

a=1
for i in /var/www/backups/*; do
	let a=a+1
done 

timestamp=`date +'%Y-%m-%d_%H.%M.%S'`
mv /var/www/html/dexter /var/www/backups/${a}_dexter_bak_${timestamp}
cp -R /home/steven/workspace/Dexter /var/www/html/dexter && echo "Copy complete."
#ls /var/www/backups/
chmod -R o+r /var/www/html/dexter/assets/images/dexter/
