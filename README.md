[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

# Node-Monarch

Interactive command-line based on the following documentation:
ftp://ftp.matrox.com/pub/video/doc/Matrox%20Monarch%20HDX%20Dev%20Tools%20Reference%20Guide_1.1.1.pdf

Previous version was based on:
http://www.matrox.com/video/media/pdf/support/monarch_hd/doc/en_Matrox_Monarch_HD_Control_API_Guide_1_1_3.pdf

## Installation

0. Clone :
`git clone git@github.com:soixantecircuits/node-monarch.git`

1. Install
`npm install`

2. configure by modifying `config.json` file.

3. configure your option there :

```
options = {
    timeout: 3000,
    permanentTestInterval: 60000,
    recordDuration: 15000,
    hdx: true
  },
```

Configure a remote point for NFS, on Ubuntu `14.04` the good guide is here: https://help.ubuntu.com/14.04/serverguide/network-file-system.html

4. And start with: `npm start`

Make sure you are pointing to the right IP of you Matrox Monarch HD or HDX

You can select, the `hdx` option with `true` or `false`



# TODO

[ ] Implement full API support for HDX model
[ ] Make it a npm module
[ ] Make it a global command-line controller
