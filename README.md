atcmd
=====


ubuntu installation instructions
--------------------------------

sudo apt-get install nodejs  
sudo ln -s /usr/bin/nodejs /usr/local/bin/node #otherwise npm install websocket will fail  
sudo apt-get install npm  
npm install websocket  
npm install colors #optional  

to run: node chat.js

Windows installation instructions (work in progress)
----------------------------------------------------

Download (from http://nodejs.org/download/) and run the Windows installer; be sure to include the npm package manager (which is included by default).  
Download and extract the zip file from github (https://github.com/anth-ny/atcmd/archive/master.zip)  
Open a command prompt window  
cd to the extracted directory (with chat.js in it)  
npm install websockets  
(If you get an "Error: ENOENT, stat '[some directory]' then you need to mkdir [some directory].)  
optionally, npm install colors  

to run: node chat.js
