const data1 = {
    file: "worlds/syndei/animations/rune-1.webm",
    position: {
      x: 1011,
      y: 1167.2,
      z: 3
    },
    anchor: {
     x: 0,
     y: 0
    },
    angle: 0,
    scale: {
      x: 1.4,
      y: 1.4
    }
  }
  const data2 = {
    file: "worlds/syndei/animations/rune-1.webm",
    position: {
      x: 1011,
      y: 1239.4,
      z: 3
    },
    anchor: {
     x: 0,
     y: 0
    },
    angle: 0,
    scale: {
      x: 1.4,
      y: 1.4
    }
  }  
  canvas.fxmaster.playVideo(data1);
  canvas.fxmaster.playVideo(data2);
  game.socket.emit('module.fxmaster', data1);
  game.socket.emit('module.fxmaster', data2);
  
  
  setTimeout(() => {
  Tile.create({
    img: "worlds/syndei/stills/frame_00019.png",
    width: 140,
    height: 140,
    scale: 1,
    x: 1011,
    y: 1167.2,
    z: 2,
    rotation: 0,
    hidden: false,
    locked: false
  });
  Tile.create({
    img: "worlds/syndei/stills/frame_00019.png",
    width: 140,
    height: 140,
    scale: 1,
    x: 1011,
    y: 1239.4,
    z: 2,
    rotation: 0,
    hidden: false,
    locked: false
  });
  }, 1980)