reep.io-peering-server
=======
This WebRTC is used to connect WebRTC clients for [https://reep.io](https://reep.io)

What is reep.io?
---
reep.io uses WebRTC technology to enable peer-to-peer file transfers between two browser without any server interaction. 
This repository holds the sources to run the reep.io frontend.  
**You will need a ICE and Peering server to run this project.** You can find the reep.io peering server [here](https://github.com/KodeKraftwerk/reepio-peering-server)

Configuration
---
You can set some options in the config/<env>/peering-server.js (if it does not exist, copy the peering-server.dist.js)

Installation
---
> vagrant up  
> vagrant ssh  
> cd reepio-peering-server
> npm install  
> npm start

License
---
reep.io uses the [GPL v2](http://www.gnu.org/licenses/gpl-2.0.html) license  
