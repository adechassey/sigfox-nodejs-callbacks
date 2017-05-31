# [Sigfox](http://www.sigfox.com/) texting with [SiPy](https://www.pycom.io/product/sipy/)

Wish you could send some short SMS with __no SIM card__ and from almost anywhere? Well you can with Sigfox and BLE!

This repository includes:
- the firmware to upload on the SiPy
- an Android application to communicate to the SiPy with Bluetooth _BLE_
- the API registering requests from the Sigfox Backend and forwarding them by SMS with Twilio

![alt text](https://www.pycom.io/wp-content/uploads/2016/10/sipyMultipackTransGX-510x510.png)


## Requirements

- a SiPy board [activated](https://backend.sigfox.com/activate/pycom) on the Sigfox Backend
- an Android phone with Bluetooth
- [Node](https://nodejs.org)
- MongoDB Database: [mLab](https://mlab.com) or [local](https://www.mongodb.com/download-center)

## Installation

- Clone the repo: `git clone https://github.com/AntoinedeChassey/sigfox-nodejs-callbacks.git`
- Copy the .env.example to your own file: `cp .env.example .env`
- Set the all the variables in `.env` with your own information
- Start the server: `node server.js`
- View in browser: <http://localhost:3000>

> *Antoine de Chassey*