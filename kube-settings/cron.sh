crontab -e
*/10 * * * * /home/user/scripts/create-loadbalancers.sh >> /home/user/scripts/cron.log 2>&1
