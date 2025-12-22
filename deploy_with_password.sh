#!/bin/bash

# Deployment script that handles SSH password authentication
# Usage: ./deploy_with_password.sh [your-ssh-password]

SSH_HOST="u933166613@82.180.152.127"
SSH_PORT="65002"
SSH_PASSWORD="${1:-}"

if [ -z "$SSH_PASSWORD" ]; then
    echo "Please provide your SSH password:"
    read -s SSH_PASSWORD
    echo ""
fi

# Check if expect is installed
if ! command -v expect &> /dev/null; then
    echo "❌ 'expect' is not installed. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install expect
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y expect
    else
        echo "Please install 'expect' manually and try again"
        exit 1
    fi
fi

# Create expect script
cat > /tmp/deploy_expect.exp <<'EXPECTSCRIPT'
#!/usr/bin/expect -f
set timeout 300
set password [lindex $argv 0]

spawn scp -P 65002 DEPLOY_ON_SERVER.sh u933166613@82.180.152.127:~/deploy.sh
expect {
    "password:" {
        send "$password\r"
        exp_continue
    }
    "yes/no" {
        send "yes\r"
        exp_continue
    }
    eof
}

spawn ssh -p 65002 u933166613@82.180.152.127 "chmod +x ~/deploy.sh && ~/deploy.sh"
expect {
    "password:" {
        send "$password\r"
        exp_continue
    }
    "yes/no" {
        send "yes\r"
        exp_continue
    }
    eof
}
EXPECTSCRIPT

chmod +x /tmp/deploy_expect.exp
expect /tmp/deploy_expect.exp "$SSH_PASSWORD"

echo ""
echo "✅ Deployment script executed on server!"
echo "Check the output above for deployment status."

