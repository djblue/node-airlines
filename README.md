# Node Airlines

Node Airlines provides an application for airlines to manage flights and
for customers to browse and purchase flight. The application focuses on
simplicity and ease of use while still being powerful.

## System dependencies and Installation

### Node.js

Node.js is the server software for this project. It can be installed
through various means.

For Ubuntu:

    sudo apt-get install nodejs

For Arch Linux:
    
    sudo pacman -S nodejs

### MongoDB

MongoDB is the database application for this project. It can installed
through various means.

For Ubuntu:

    sudo apt-get install mongodb

For Arch Linux:

    sudo pacman -S mongodb

### Heroku

Heroku is the deployment platform for this project. To install the heroku
cli:

    curl https://toolbelt.heroku.com/install.sh | sh
    echo 'PATH="/usr/local/heroku/bin:$PATH"' >> ~/.profile

After installation, the tool is and properly added to you paths, it should
be available system wide.


## Installation and Testing

To run a development version of the application application, simply clone
the repository, and run:

    grunt server

To run all of the unit tests:

    grunt test

To deploy:
