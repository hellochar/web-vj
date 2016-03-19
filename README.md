web-vj
======

Simple real-time vj tool running on the web. Made for use with the Novation Launch Control MIDI Controller.

Running
=======

1. Install Max MSP Runtime 32 bit.
2. Download the odot libraries from [http://cnmat.berkeley.edu/downloads](http://cnmat.berkeley.edu/downloads), and add them to the Max MSP Path (in the File Preferences menu).
3. Plug in your Novation Launch Control.
4. git clone this repo.
5. Run launchcontrol-lean.maxpat with the Max MSP Runtime. Test that the patch is working by pressing buttons on the Launch Control and verifying that the numbers change in the patch.
6. run `node index.js`
7. Visit [http://localhost:3000/](http://localhost:3000/), and play around with it!
