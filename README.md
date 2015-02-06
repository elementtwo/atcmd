atcmd
=====

ubuntu installation instructions
--------------------------------

wget https://github.com/anth-ny/atcmd/archive/master.zip  
unzip master.zip   
cd atcmd-master/  
sudo apt-get install nodejs  
sudo ln -s /usr/bin/nodejs /usr/local/bin/node #otherwise npm install websocket will fail  
sudo apt-get install npm  
npm install atsession  
npm install colors #optional  
npm install cli-table #only needed for market.js

to run: node chat.js

Windows installation instructions (work in progress)
----------------------------------------------------

Download (from http://nodejs.org/download/) and run the Windows installer; be sure to include the npm package manager (which should be included by default).  
Download and extract the zip file from github (https://github.com/anth-ny/atcmd/archive/master.zip)  
Open a command prompt window  
cd to the extracted directory (with chat.js in it)  
npm install atsession
(If you get an "Error: ENOENT, stat '[some directory]'" then you need to mkdir [some directory].)  
optionally, npm install colors  

to run: node chat.js

Copyright
---------

This software is copyrighted. You can download it and run it. You can make a copy or adapatation which is an essential step in using the program under 17 USC 117. You can do whatever fair use allows you to do, which I imagine includes playing around with the code without redistributing it, and using it, modified or unmodified, to make trades (but not distributing the modified code). If you want to do something more than what you're automatically legally allowed to do, especially if you want to do so to make a profit or to help others make a profit, you need to get permission. If you're a hobbyist, I'll probably let you do what you want. If you want to make a profit or help others make a profit, I'm probably going to want a cut. If you want to contribute to the development and are willing to release your own rights, patches are welcome. If you want to contribute significantly to the development without releasing your own rights, I am willing to negotiate, including releasing everything under a copyleft license if your contributions are significant. I can be reached at anth-ny@users.noreply.github.com.
