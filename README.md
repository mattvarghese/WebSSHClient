# Web Based SSH Client
This is a demo web based SSH Client. 

# Prerequisites
* `sudo apt install dotnet-sdk-8.0`
* You also need npm and node but since there are several ways to do that, you can figure out your preferred way.

# Enable SSL on your local machine
* `sudo apt instal openssh-server`
* `sudo systemctl status ssh`
* `sudo systemctl enable ssh`
* `sudo systemctl start ssh`
* `sudo ufw allow ssh`
* Test from a terminal that you can ssh to localhost

# Running the app
* `git clone https://github.com/mattvarghese/WebSSHClient.git`
* `cd` into that folder
* `code .` to open VS Code
* Go to the Run and Debug tab on the left
* At the top, click the drop down to select "Full Stack (Client + Server)"
* Click the green run button

# Example interaction
* Please watch the sample-interaction.webm file
