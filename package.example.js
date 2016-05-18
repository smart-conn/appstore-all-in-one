module.exports = {
  flow1: JSON.stringify([{
    "id": "3367e45f.cc981c",
    "type": "function",
    "name": "++",
    "func": "if ( (msg.i += 1) < msg.items.length ) return msg;\n",
    "outputs": 1,
    "x": 376,
    "y": 268,
    "z": "886b17b1.7794e8",
    "wires": [
      ["116d5bb3.ee92a4"]
    ]
  }, {
    "id": "116d5bb3.ee92a4",
    "type": "function",
    "name": "for each item",
    "func": "if( msg.i     == undefined ) msg.i = 0;\nif( msg.items == undefined ) msg.items = msg.payload;\n\nmsg.payload = msg.items[ msg.i ];\n\nreturn msg;",
    "outputs": 1,
    "x": 378,
    "y": 240,
    "z": "886b17b1.7794e8",
    "wires": [
      ["3367e45f.cc981c", "92f7e57c.6d0818"]
    ]
  }]),
  flow2: JSON.stringify([{
    "id": "3367e45f.cc981c",
    "type": "function",
    "name": "++",
    "func": "if ( (msg.i += 1) < msg.items.length ) return msg;\n",
    "outputs": 1,
    "x": 376,
    "y": 268,
    "z": "886b17b1.7794e8",
    "wires": [
      ["116d5bb3.ee92a4"]
    ]
  }, {
    "id": "116d5bb3.ee92a4",
    "type": "function",
    "name": "for each item",
    "func": "if( msg.i == undefined ) msg.i = 0;\nif( msg.items == undefined ) msg.items = msg.payload;\n\nmsg.payload = msg.items[ msg.i ];\n\nreturn msg;",
    "outputs": 1,
    "x": 378,
    "y": 240,
    "z": "886b17b1.7794e8",
    "wires": [
      ["3367e45f.cc981c", "92f7e57c.6d0818"]
    ]
  }]),
  flow3: JSON.stringify([{
    "id": "3012f18f.cfed0e",
    "type": "inject",
    "name": "basic inject",
    "topic": "",
    "payload": "",
    "payloadType": "date",
    "repeat": "",
    "crontab": "",
    "once": false,
    "x": 180.0994415283203,
    "y": 190.09091186523438,
    "z": "fe309029.01cf7",
    "wires": [
      ["b7f4e964.480b18"]
    ]
  }, {
    "id": "b7f4e964.480b18",
    "type": "debug",
    "name": "",
    "active": true,
    "console": "false",
    "complete": "false",
    "x": 393.0994415283203,
    "y": 233.09091186523438,
    "z": "fe309029.01cf7",
    "wires": []
  }])
}
