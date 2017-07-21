'use strict';

(function() {
  const VERSION = '0.1.0'

  function MicroCanvas(ctx) {
    ctx = ctx || document.querySelector('canvas.microcanvas').getContext('2d');
    ctx.width = ctx.canvas.width;
    ctx.height = ctx.canvas.height;

    // Disables interpolation on drawImage calls
    if ('imageSmoothingEnabled' in ctx) {
      ctx.imageSmoothingEnabled = false;
    } else {
      ctx.mozImageSmoothingEnabled = false;
    }

    // Keystroke emulation
    ctx.$buttons = {};
    window.addEventListener('keydown', e => {
      if (e.key==='ArrowLeft') ctx.$buttons.left = true;
      if (e.key==='ArrowRight') ctx.$buttons.right = true;
      if (e.key==='ArrowUp') ctx.$buttons.up = true;
      if (e.key==='ArrowDown') ctx.$buttons.down = true;
      if (e.key===' ') ctx.$buttons.A = true;
      if (e.key==='Enter') ctx.$buttons.B = true;

      // 8bitdo controller support (Mode 2)
      if (e.key==='e') ctx.$buttons.left = true;
      if (e.key==='f') ctx.$buttons.right = true;
      if (e.key==='c') ctx.$buttons.up = true;
      if (e.key==='d') ctx.$buttons.down = true;
      if (e.key==='j' || e.key==='i' || e.key==='k') ctx.$buttons.A = true;
      if (e.key==='g' || e.key==='h' || e.key==='m') ctx.$buttons.B = true;
      // Start button emulates A+B pressed simultaneously
      if (e.key==='o') { ctx.$buttons.A = true; ctx.$buttons.B = true; }
    });

    window.addEventListener('keyup', e => {
      if (e.key==='ArrowLeft') ctx.$buttons.left = false;
      if (e.key==='ArrowRight') ctx.$buttons.right = false;
      if (e.key==='ArrowUp') ctx.$buttons.up = false;
      if (e.key==='ArrowDown') ctx.$buttons.down = false;
      if (e.key===' ' ) ctx.$buttons.A = false;
      if (e.key==='Enter') ctx.$buttons.B = false;

      // 8bitdo controller support (Mode 2)
      if (e.key==='e') ctx.$buttons.left = false;
      if (e.key==='f') ctx.$buttons.right = false;
      if (e.key==='c') ctx.$buttons.up = false;
      if (e.key==='d') ctx.$buttons.down = false;
      if (e.key==='j' || e.key==='i' || e.key==='k') ctx.$buttons.A = false;
      if (e.key==='g' || e.key==='h' || e.key==='m') ctx.$buttons.B = false;
      // Start button emulates A+B pressed simultaneously
      if (e.key==='o') { ctx.$buttons.A = false; ctx.$buttons.B = false; }
    });

    // TODO: daydream controller emulation
    // TODO: tilt detection

    // Touchscreen support
    window.addEventListener('touchstart', e => {
      const eX = Math.floor(e.changedTouches[0].clientX / window.innerWidth * 100);

      // Left
      if (eX < 25) {
        ctx.$buttons.left = true;

      // Right
    } else if (eX < 50) {
        ctx.$buttons.right = true;

      // Fire
      } else {
        ctx.$buttons.A = true;
      }

      //console.log(e)
      e.preventDefault()
    })
    window.addEventListener('touchend', e => {
      const eX = Math.floor(e.changedTouches[0].clientX / window.innerWidth * 100);

      // Left
      if (eX < 25) {
        ctx.$buttons.left = false;

      // Right
    } else if (eX < 50) {
        ctx.$buttons.right = false;

      // Fire
      } else {
        ctx.$buttons.A = false;
      }


      //console.log(e)
      e.preventDefault()
    })

    // default fillStyle
    ctx.fillStyle = "white";

    let mc = Object.assign(ctx, MicroCanvas.prototype);
    Object.defineProperty(mc, 'VERSION', { value: VERSION });

    return mc;
  }

  let MCP = MicroCanvas.prototype;

  MCP.loadGraphics = function(src) {
    return loadGraphics(src);
  };
  MCP.loadSprite = function(src) {
    return loadGraphics(src);
  }
  MCP.loadTune = function(src) {
    let contents = PixelData.util.arrayInitializerContent(src);

    return new ArduboyScore(contents);
  }
  MCP.everyXFrames = MCP.everyXFrame = function(frames) {
     return this.frameCount % frames == 0;
  }
  MCP.clear = function() {
    this.clearRect(0, 0, this.width, this.height);
  };
  MCP.eraseImage = MCP.clearImage = function(...args) {
    // Learn more of composites:
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    let prevComp = this.globalCompositeOperation;

    this.globalCompositeOperation = 'destination-out';
      this.drawImage(...args);
    this.globalCompositeOperation = prevComp;
  };
  MCP.measureText = function (text) {
    // TODO: multiline? different "size" & "gfont" handling?
    return ({
      width: Math.max( text.length*(game.gfont[0].width+1)-1, 0),
      height: game.gfont[0].height
    });
  }
  MCP.fillText = function (x, y, text) {
    return this.drawText(text, x, y)
  }
  MCP.centerText = function (text, x, y) {
    // Parameters accepted in either "text,x,y" or "x,y,text" order
    if (typeof text == 'number' && typeof y == 'string') {
      let actualText = y;
      y = x;
      x = text;
      text = actualText;
    }

    const { width, height } = this.measureText(text)

    return this.drawText(text, x-width/2|0, y-height/2|0)
  }
  MCP.drawText = function (text, x, y, size) {
    if (size) {
      console.warn('[!] The "size" parameter is deprecated - use the ".fillStyle" property!');
      // TODO: fillStyle handling
    }
    //ctx.fillText-compatible usage
    if (typeof text == 'number' && typeof y == 'string') {
      let actualText = y;
      y = x;
      x = text;
      text = actualText;
    }

    size = size || 1;
    let c = 0,
      xd = 0,
      w = game.gfont[0].width, h = game.gfont[0].height;

    while (c < text.length) {
      switch (text.charAt(c)) {
        case '\r': break;
        case '\n': y += (h+1)*size; xd = 0; break;
        default:
          // basic fillStyle handling
          if (game.fillStyle ==='#000000' || game.fillStyle.indexOf('black')!==-1) {
            game.clearImage(game.gfont[text.charCodeAt(c)], x + xd*size, y, w*size, h*size);
          } else {
            game.drawImage(game.gfont[text.charCodeAt(c)], x + xd*size, y, w*size, h*size);
          }
          xd += w+1;
      }
      ++c;
    };
  };
  MCP.detectCollision = function (s1, x1,y1, s2, x2,y2, precise=true) {
    let result = false;

    if (this.DEBUG) {
      this.save();

      this.strokeStyle = "rgba(0,200,0,.3)";
      this.strokeRect(x1 +.5,y1 +.5, s1.width -1,s1.height -1);
      this.strokeRect(x2 +.5,y2 +.5, s2.width -1,s2.height -1);
    }

    // Basic collision rectangle
    let cx = x1>x2 ? x1 : x2;
    let cw = x1>x2 ? x2+s2.width-x1 : x1+s1.width-x2;

    let cy = y1>y2 ? y1 : y2;
    let ch = y1>y2 ? y2+s2.height-y1 : y1+s1.height-y2;

    if (cw>0 && ch>0) {
      if (this.DEBUG) {
        this.fillStyle = "rgba(200,0,0,.5)";
        this.fillRect(cx,cy, cw,ch);
      }

      result = true;
    }

    // No bounding rect collision or no precise check requested
    if (!precise || !result) {
      this.restore();
      return result;
    }

    // Optimization: Cache context on graphics objects
    s1.context = s1.context || s1.getContext('2d');
    s2.context = s2.context || s2.getContext('2d');

    let id1 = s1.context.getImageData(x1>x2 ? 0 : x2-x1, y1>y2 ? 0 : y2-y1, cw,ch);
    let id2 = s2.context.getImageData(x1<x2 ? 0 : x1-x2, y1<y2 ? 0 : y1-y2, cw,ch);

    let collisions = 0;
    for (let i=0; i<id1.data.length; i+=4) {
      if (
        id1.data[i] > 0 && id2.data[i] > 0 // monochrome test
      ) {
        if (this.DEBUG) {
          this.fillStyle = "yellow";
          this.fillRect(cx + (i/4)%cw,cy + (i/4/cw)|0, 1,1);
        }

        ++collisions;
      }
    }

    if (this.DEBUG) {
      this.restore();
    }

    return (collisions>0);
  };
  MCP.buttonPressed = function(button) {
    if (button in this.$buttons) return this.$buttons[button];
    if (button === "space") return !!this.$buttons.A;
    if (button === "enter") return !!this.$buttons.B;
    if (button === "start") return !!(this.$buttons.A&&this.$buttons.B);
    return false;
  };
  MCP.custom = function (platforms) {
    if ('canvas' in platforms) {
      const game = this; // alias for the current context
      ( new Function(platforms.canvas) ).call(this);
    }
  };
  MCP.random = function(min, max) {
    return Math.floor(min + Math.random()*(max-min+1));
  };
  MCP.setup = function(cb, fps = 60) {
    this.frameCount = 0;
    this.frameRate = fps;

    // Set up drawing font
    setFont.call(this);

    cb(this);

    setTimeout( _ => {
      if (!this.LOOP) this.loopCallback();
      this.LOOP = true
    }, 0);

    // Convenience function for resetting the game
    this.reset = function() {
      this.setup(cb, fps);
    }
  };
  MCP.loop = function(cb) {
    this.loopCallback = (function() {
      cb();

      this.frameCount++;

      // Slow down framerate (for debugging etc)
      if (this.playbackRate && this.playbackRate !== 1) {
        window.setTimeout(this.loopCallback, this.frameRate/this.playbackRate);
      } else {
        window.requestAnimationFrame(this.loopCallback);
      }
    }).bind(this);
  };
  // Async state fragment (generator function) runner
  MCP.run = function(gen) {
    if (!this.$state || this.$state instanceof gen === false) this.$state = gen();

    if (this.$delay && this.$delay > 0) {
       --this.$delay;
    } else {
      let c = this.$state.next();

      if (c.done) {
        this.$state = null;

        // state finished
        return true;
      } else {
        this.$delay = c.value -1;
      }
    }

    return;
  }


  function loadBitmap(bmp) {
    let bitmap = bmp.split('\n').map(r => r.trim()).filter(r => r !== '' );
    let rows = bitmap.filter(r => r[0].match(/^[a-z0-0\.\#]/i))
    let meta = bitmap.filter(r => r[0].match(/^[^a-z0-0\.\#]/i))

    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    canvas.width = ctx.width = rows[0].length;
    canvas.height = ctx.height = rows.length;

    ctx.fillStyle = 'white';

    rows.forEach(function(row, y) {
      row.split('').forEach(function(px, x) {
        if (px === '#' || parseInt(px,16)&1) ctx.fillRect(x, y, 1, 1);
      });
    });

    return canvas;
  }

  function quickRenderSprite(px, canvas) {
    canvas = canvas || document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = ctx.width = px.w
    canvas.height = ctx.height = px.h

    ctx.putImageData(new ImageData(px.rgba, px.w,px.h*(px.frames||1)) ,0,0)

    return canvas
  }

  function renderSprite(px, canvas) {
    canvas = canvas || document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const rows = px.bitmap
    const colors = px.palette && px.palette.length || 1

    canvas.width = ctx.width = px.w;
    canvas.height = ctx.height = px.h;

    ctx.fillStyle = 'white';

    rows.forEach(function(row, y) {
      row.forEach(function(pixelcolor, x) {
        // Color
        if (colors > 1 && pixelcolor < colors) {
          // Non-transparent color
          if (px.palette[pixelcolor][3]) {
            ctx.fillStyle = 'rgb('+px.palette[pixelcolor].slice(0,3).join(',')+')';
            ctx.fillRect(x, y, 1, 1);
          }

        // Monochrome
        } else {
          if (pixelcolor&1) ctx.fillRect(x, y, 1, 1);
        }
      });
    });

    return canvas;
  }

  function loadGraphics(g) {
    let ret;

    let pix = typeof g == 'object' && g instanceof PixelData ? g : new PixelData(g)

    // Multiframe image?
    if (pix.frames) {
      ret = [...Array(pix.frames).keys()].map(i => quickRenderSprite(pix.frame(i)) );
      // ^ same as Array(pix.frames).fill(null).map((_,i) => ... );
      // | in essence: [ 0, 1, .., pix.frames-1 ].map( ... )
      // | Array(..).keys() returns a Symbol.iterator that [...<iterator>] expands
      // | this is the same as saying Array.from(Array(pix.frames).keys())

      Object.defineProperty(ret, 'width', { value: ret[0].width });
      Object.defineProperty(ret, 'height', { value: ret[0].height });
    } else {
      //ret = renderSprite(pix);
      ret = quickRenderSprite(pix);

      // Single-frame sprite, sprite[0] is the object itself
      Object.defineProperty(ret, '0', { get: function() { return this } })
    }

    Object.defineProperty(ret, 'pixeldata', { value: pix });

    return ret;
  }




  function setFont(graphicsFont) {
    this.gfont = graphicsFont || loadGraphics(`
const static unsigned char font[] PROGMEM =
{ /*5x8x256*/
    0x00, 0x00, 0x00, 0x00, 0x00,
    0x3E, 0x5B, 0x4F, 0x5B, 0x3E,
    0x3E, 0x6B, 0x4F, 0x6B, 0x3E,
    0x1C, 0x3E, 0x7C, 0x3E, 0x1C,
    0x18, 0x3C, 0x7E, 0x3C, 0x18,
    0x1C, 0x57, 0x7D, 0x57, 0x1C,
    0x1C, 0x5E, 0x7F, 0x5E, 0x1C,
    0x00, 0x18, 0x3C, 0x18, 0x00,
    0xFF, 0xE7, 0xC3, 0xE7, 0xFF,
    0x00, 0x18, 0x24, 0x18, 0x00,
    0xFF, 0xE7, 0xDB, 0xE7, 0xFF,
    0x30, 0x48, 0x3A, 0x06, 0x0E,
    0x26, 0x29, 0x79, 0x29, 0x26,
    0x40, 0x7F, 0x05, 0x05, 0x07,
    0x40, 0x7F, 0x05, 0x25, 0x3F,
    0x5A, 0x3C, 0xE7, 0x3C, 0x5A,
    0x7F, 0x3E, 0x1C, 0x1C, 0x08,
    0x08, 0x1C, 0x1C, 0x3E, 0x7F,
    0x14, 0x22, 0x7F, 0x22, 0x14,
    0x5F, 0x5F, 0x00, 0x5F, 0x5F,
    0x06, 0x09, 0x7F, 0x01, 0x7F,
    0x00, 0x66, 0x89, 0x95, 0x6A,
    0x60, 0x60, 0x60, 0x60, 0x60,
    0x94, 0xA2, 0xFF, 0xA2, 0x94,
    0x08, 0x04, 0x7E, 0x04, 0x08,
    0x10, 0x20, 0x7E, 0x20, 0x10,
    0x08, 0x08, 0x2A, 0x1C, 0x08,
    0x08, 0x1C, 0x2A, 0x08, 0x08,
    0x1E, 0x10, 0x10, 0x10, 0x10,
    0x0C, 0x1E, 0x0C, 0x1E, 0x0C,
    0x30, 0x38, 0x3E, 0x38, 0x30,
    0x06, 0x0E, 0x3E, 0x0E, 0x06,
    0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x5F, 0x00, 0x00,
    0x00, 0x07, 0x00, 0x07, 0x00,
    0x14, 0x7F, 0x14, 0x7F, 0x14,
    0x24, 0x2A, 0x7F, 0x2A, 0x12,
    0x23, 0x13, 0x08, 0x64, 0x62,
    0x36, 0x49, 0x56, 0x20, 0x50,
    0x00, 0x08, 0x07, 0x03, 0x00,
    0x00, 0x1C, 0x22, 0x41, 0x00,
    0x00, 0x41, 0x22, 0x1C, 0x00,
    0x2A, 0x1C, 0x7F, 0x1C, 0x2A,
    0x08, 0x08, 0x3E, 0x08, 0x08,
    0x00, 0x80, 0x70, 0x30, 0x00,
    0x08, 0x08, 0x08, 0x08, 0x08,
    0x00, 0x00, 0x60, 0x60, 0x00,
    0x20, 0x10, 0x08, 0x04, 0x02,
    0x3E, 0x51, 0x49, 0x45, 0x3E,
    0x00, 0x42, 0x7F, 0x40, 0x00,
    0x72, 0x49, 0x49, 0x49, 0x46,
    0x21, 0x41, 0x49, 0x4D, 0x33,
    0x18, 0x14, 0x12, 0x7F, 0x10,
    0x27, 0x45, 0x45, 0x45, 0x39,
    0x3C, 0x4A, 0x49, 0x49, 0x31,
    0x41, 0x21, 0x11, 0x09, 0x07,
    0x36, 0x49, 0x49, 0x49, 0x36,
    0x46, 0x49, 0x49, 0x29, 0x1E,
    0x00, 0x00, 0x14, 0x00, 0x00,
    0x00, 0x40, 0x34, 0x00, 0x00,
    0x00, 0x08, 0x14, 0x22, 0x41,
    0x14, 0x14, 0x14, 0x14, 0x14,
    0x00, 0x41, 0x22, 0x14, 0x08,
    0x02, 0x01, 0x59, 0x09, 0x06,
    0x3E, 0x41, 0x5D, 0x59, 0x4E,
    0x7C, 0x12, 0x11, 0x12, 0x7C,
    0x7F, 0x49, 0x49, 0x49, 0x36,
    0x3E, 0x41, 0x41, 0x41, 0x22,
    0x7F, 0x41, 0x41, 0x41, 0x3E,
    0x7F, 0x49, 0x49, 0x49, 0x41,
    0x7F, 0x09, 0x09, 0x09, 0x01,
    0x3E, 0x41, 0x41, 0x51, 0x73,
    0x7F, 0x08, 0x08, 0x08, 0x7F,
    0x00, 0x41, 0x7F, 0x41, 0x00,
    0x20, 0x40, 0x41, 0x3F, 0x01,
    0x7F, 0x08, 0x14, 0x22, 0x41,
    0x7F, 0x40, 0x40, 0x40, 0x40,
    0x7F, 0x02, 0x1C, 0x02, 0x7F,
    0x7F, 0x04, 0x08, 0x10, 0x7F,
    0x3E, 0x41, 0x41, 0x41, 0x3E,
    0x7F, 0x09, 0x09, 0x09, 0x06,
    0x3E, 0x41, 0x51, 0x21, 0x5E,
    0x7F, 0x09, 0x19, 0x29, 0x46,
    0x26, 0x49, 0x49, 0x49, 0x32,
    0x03, 0x01, 0x7F, 0x01, 0x03,
    0x3F, 0x40, 0x40, 0x40, 0x3F,
    0x1F, 0x20, 0x40, 0x20, 0x1F,
    0x3F, 0x40, 0x38, 0x40, 0x3F,
    0x63, 0x14, 0x08, 0x14, 0x63,
    0x03, 0x04, 0x78, 0x04, 0x03,
    0x61, 0x59, 0x49, 0x4D, 0x43,
    0x00, 0x7F, 0x41, 0x41, 0x41,
    0x02, 0x04, 0x08, 0x10, 0x20,
    0x00, 0x41, 0x41, 0x41, 0x7F,
    0x04, 0x02, 0x01, 0x02, 0x04,
    0x40, 0x40, 0x40, 0x40, 0x40,
    0x00, 0x03, 0x07, 0x08, 0x00,
    0x20, 0x54, 0x54, 0x78, 0x40,
    0x7F, 0x28, 0x44, 0x44, 0x38,
    0x38, 0x44, 0x44, 0x44, 0x28,
    0x38, 0x44, 0x44, 0x28, 0x7F,
    0x38, 0x54, 0x54, 0x54, 0x18,
    0x00, 0x08, 0x7E, 0x09, 0x02,
    0x18, 0xA4, 0xA4, 0x9C, 0x78,
    0x7F, 0x08, 0x04, 0x04, 0x78,
    0x00, 0x44, 0x7D, 0x40, 0x00,
    0x20, 0x40, 0x40, 0x3D, 0x00,
    0x7F, 0x10, 0x28, 0x44, 0x00,
    0x00, 0x41, 0x7F, 0x40, 0x00,
    0x7C, 0x04, 0x78, 0x04, 0x78,
    0x7C, 0x08, 0x04, 0x04, 0x78,
    0x38, 0x44, 0x44, 0x44, 0x38,
    0xFC, 0x18, 0x24, 0x24, 0x18,
    0x18, 0x24, 0x24, 0x18, 0xFC,
    0x7C, 0x08, 0x04, 0x04, 0x08,
    0x48, 0x54, 0x54, 0x54, 0x24,
    0x04, 0x04, 0x3F, 0x44, 0x24,
    0x3C, 0x40, 0x40, 0x20, 0x7C,
    0x1C, 0x20, 0x40, 0x20, 0x1C,
    0x3C, 0x40, 0x30, 0x40, 0x3C,
    0x44, 0x28, 0x10, 0x28, 0x44,
    0x4C, 0x90, 0x90, 0x90, 0x7C,
    0x44, 0x64, 0x54, 0x4C, 0x44,
    0x00, 0x08, 0x36, 0x41, 0x00,
    0x00, 0x00, 0x77, 0x00, 0x00,
    0x00, 0x41, 0x36, 0x08, 0x00,
    0x02, 0x01, 0x02, 0x04, 0x02,
    0x3C, 0x26, 0x23, 0x26, 0x3C,
    0x1E, 0xA1, 0xA1, 0x61, 0x12,
    0x3A, 0x40, 0x40, 0x20, 0x7A,
    0x38, 0x54, 0x54, 0x55, 0x59,
    0x21, 0x55, 0x55, 0x79, 0x41,
    0x21, 0x54, 0x54, 0x78, 0x41,
    0x21, 0x55, 0x54, 0x78, 0x40,
    0x20, 0x54, 0x55, 0x79, 0x40,
    0x0C, 0x1E, 0x52, 0x72, 0x12,
    0x39, 0x55, 0x55, 0x55, 0x59,
    0x39, 0x54, 0x54, 0x54, 0x59,
    0x39, 0x55, 0x54, 0x54, 0x58,
    0x00, 0x00, 0x45, 0x7C, 0x41,
    0x00, 0x02, 0x45, 0x7D, 0x42,
    0x00, 0x01, 0x45, 0x7C, 0x40,
    0xF0, 0x29, 0x24, 0x29, 0xF0,
    0xF0, 0x28, 0x25, 0x28, 0xF0,
    0x7C, 0x54, 0x55, 0x45, 0x00,
    0x20, 0x54, 0x54, 0x7C, 0x54,
    0x7C, 0x0A, 0x09, 0x7F, 0x49,
    0x32, 0x49, 0x49, 0x49, 0x32,
    0x32, 0x48, 0x48, 0x48, 0x32,
    0x32, 0x4A, 0x48, 0x48, 0x30,
    0x3A, 0x41, 0x41, 0x21, 0x7A,
    0x3A, 0x42, 0x40, 0x20, 0x78,
    0x00, 0x9D, 0xA0, 0xA0, 0x7D,
    0x39, 0x44, 0x44, 0x44, 0x39,
    0x3D, 0x40, 0x40, 0x40, 0x3D,
    0x3C, 0x24, 0xFF, 0x24, 0x24,
    0x48, 0x7E, 0x49, 0x43, 0x66,
    0x2B, 0x2F, 0xFC, 0x2F, 0x2B,
    0xFF, 0x09, 0x29, 0xF6, 0x20,
    0xC0, 0x88, 0x7E, 0x09, 0x03,
    0x20, 0x54, 0x54, 0x79, 0x41,
    0x00, 0x00, 0x44, 0x7D, 0x41,
    0x30, 0x48, 0x48, 0x4A, 0x32,
    0x38, 0x40, 0x40, 0x22, 0x7A,
    0x00, 0x7A, 0x0A, 0x0A, 0x72,
    0x7D, 0x0D, 0x19, 0x31, 0x7D,
    0x26, 0x29, 0x29, 0x2F, 0x28,
    0x26, 0x29, 0x29, 0x29, 0x26,
    0x30, 0x48, 0x4D, 0x40, 0x20,
    0x38, 0x08, 0x08, 0x08, 0x08,
    0x08, 0x08, 0x08, 0x08, 0x38,
    0x2F, 0x10, 0xC8, 0xAC, 0xBA,
    0x2F, 0x10, 0x28, 0x34, 0xFA,
    0x00, 0x00, 0x7B, 0x00, 0x00,
    0x08, 0x14, 0x2A, 0x14, 0x22,
    0x22, 0x14, 0x2A, 0x14, 0x08,
    0x95, 0x00, 0x22, 0x00, 0x95,
    0xAA, 0x00, 0x55, 0x00, 0xAA,
    0xAA, 0x55, 0xAA, 0x55, 0xAA,
    0x00, 0x00, 0x00, 0xFF, 0x00,
    0x10, 0x10, 0x10, 0xFF, 0x00,
    0x14, 0x14, 0x14, 0xFF, 0x00,
    0x10, 0x10, 0xFF, 0x00, 0xFF,
    0x10, 0x10, 0xF0, 0x10, 0xF0,
    0x14, 0x14, 0x14, 0xFC, 0x00,
    0x14, 0x14, 0xF7, 0x00, 0xFF,
    0x00, 0x00, 0xFF, 0x00, 0xFF,
    0x14, 0x14, 0xF4, 0x04, 0xFC,
    0x14, 0x14, 0x17, 0x10, 0x1F,
    0x10, 0x10, 0x1F, 0x10, 0x1F,
    0x14, 0x14, 0x14, 0x1F, 0x00,
    0x10, 0x10, 0x10, 0xF0, 0x00,
    0x00, 0x00, 0x00, 0x1F, 0x10,
    0x10, 0x10, 0x10, 0x1F, 0x10,
    0x10, 0x10, 0x10, 0xF0, 0x10,
    0x00, 0x00, 0x00, 0xFF, 0x10,
    0x10, 0x10, 0x10, 0x10, 0x10,
    0x10, 0x10, 0x10, 0xFF, 0x10,
    0x00, 0x00, 0x00, 0xFF, 0x14,
    0x00, 0x00, 0xFF, 0x00, 0xFF,
    0x00, 0x00, 0x1F, 0x10, 0x17,
    0x00, 0x00, 0xFC, 0x04, 0xF4,
    0x14, 0x14, 0x17, 0x10, 0x17,
    0x14, 0x14, 0xF4, 0x04, 0xF4,
    0x00, 0x00, 0xFF, 0x00, 0xF7,
    0x14, 0x14, 0x14, 0x14, 0x14,
    0x14, 0x14, 0xF7, 0x00, 0xF7,
    0x14, 0x14, 0x14, 0x17, 0x14,
    0x10, 0x10, 0x1F, 0x10, 0x1F,
    0x14, 0x14, 0x14, 0xF4, 0x14,
    0x10, 0x10, 0xF0, 0x10, 0xF0,
    0x00, 0x00, 0x1F, 0x10, 0x1F,
    0x00, 0x00, 0x00, 0x1F, 0x14,
    0x00, 0x00, 0x00, 0xFC, 0x14,
    0x00, 0x00, 0xF0, 0x10, 0xF0,
    0x10, 0x10, 0xFF, 0x10, 0xFF,
    0x14, 0x14, 0x14, 0xFF, 0x14,
    0x10, 0x10, 0x10, 0x1F, 0x00,
    0x00, 0x00, 0x00, 0xF0, 0x10,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xF0, 0xF0, 0xF0, 0xF0, 0xF0,
    0xFF, 0xFF, 0xFF, 0x00, 0x00,
    0x00, 0x00, 0x00, 0xFF, 0xFF,
    0x0F, 0x0F, 0x0F, 0x0F, 0x0F,
    0x38, 0x44, 0x44, 0x38, 0x44,
    0x7C, 0x2A, 0x2A, 0x3E, 0x14,
    0x7E, 0x02, 0x02, 0x06, 0x06,
    0x02, 0x7E, 0x02, 0x7E, 0x02,
    0x63, 0x55, 0x49, 0x41, 0x63,
    0x38, 0x44, 0x44, 0x3C, 0x04,
    0x40, 0x7E, 0x20, 0x1E, 0x20,
    0x06, 0x02, 0x7E, 0x02, 0x02,
    0x99, 0xA5, 0xE7, 0xA5, 0x99,
    0x1C, 0x2A, 0x49, 0x2A, 0x1C,
    0x4C, 0x72, 0x01, 0x72, 0x4C,
    0x30, 0x4A, 0x4D, 0x4D, 0x30,
    0x30, 0x48, 0x78, 0x48, 0x30,
    0xBC, 0x62, 0x5A, 0x46, 0x3D,
    0x3E, 0x49, 0x49, 0x49, 0x00,
    0x7E, 0x01, 0x01, 0x01, 0x7E,
    0x2A, 0x2A, 0x2A, 0x2A, 0x2A,
    0x44, 0x44, 0x5F, 0x44, 0x44,
    0x40, 0x51, 0x4A, 0x44, 0x40,
    0x40, 0x44, 0x4A, 0x51, 0x40,
    0x00, 0x00, 0xFF, 0x01, 0x03,
    0xE0, 0x80, 0xFF, 0x00, 0x00,
    0x08, 0x08, 0x6B, 0x6B, 0x08,
    0x36, 0x12, 0x36, 0x24, 0x36,
    0x06, 0x0F, 0x09, 0x0F, 0x06,
    0x00, 0x00, 0x18, 0x18, 0x00,
    0x00, 0x00, 0x10, 0x10, 0x00,
    0x30, 0x40, 0xFF, 0x01, 0x01,
    0x00, 0x1F, 0x01, 0x01, 0x1E,
    0x00, 0x19, 0x1D, 0x17, 0x12,
    0x00, 0x3C, 0x3C, 0x3C, 0x3C,
    0x00, 0x00, 0x00, 0x00, 0x00,
};
`);
  }

  window.MicroCanvas = MicroCanvas;
})();




'use strict';

(function () {

  // Table of midi note frequencies * 2
  //   They are times 2 for greater accuracy, yet still fits in a word.
  //   Generated from Excel by =ROUND(2*440/32*(2^((x-9)/12)),0) for 0<x<128
  // The lowest notes might not work, depending on the Arduino clock frequency
  // Ref: http://www.phy.mtu.edu/~suits/notefreqs.html
  // From: Arduboy's audio.cpp
  // https://github.com/Arduboy/Arduboy/blob/master/audio.cpp @ bac3ae9 on Jun 2 2015
  var NOTES = [
    16,17,18,19,21,22,23,24,26,28,29,31,33,35,37,39,41,44,46,49,52,55,58,62,65,
    69,73,78,82,87,92,98,104,110,117,123,131,139,147,156,165,175,185,196,208,220,
    233,247,262,277,294,311,330,349,370,392,415,440,466,494,523,554,587,622,659,
    698,740,784,831,880,932,988,1047,1109,1175,1245,1319,1397,1480,1568,1661,1760,
    1865,1976,2093,2217,2349,2489,2637,2794,2960,3136,3322,3520,3729,3951,4186,
    4435,4699,4978,5274,5588,5920,6272,6645,7040,7459,7902,8372,8870,9397,9956,
    10548,11175,11840,12544,13290,14080,14917,15804,16744,17740,18795,19912,21096,
    22351,23680,25088
  ];

  function ClouduboySynth() {
    // create web audio api context
    var ctx = new (window.AudioContext || window.webkitAudioContext)();

    // create main gain node
    var mainGain = ctx.createGain();

    mainGain.connect(ctx.destination);
    mainGain.gain.value = .33;

    // Access to audioContext (TODO: is this needed?)
    Object.defineProperty(this, 'audioCtx', {
      enumerable: true,
      get: function() { return ctx; }
    });

    // Current time in audioContext
    Object.defineProperty(this, 'playHead', {
      enumerable: true,
      get: function() { return ctx.currentTime; }
    });

    // Create a new Oscillator and pipe it into the main gain
    this.osc = function(freq, type) {
      var osc = ctx.createOscillator();

      osc.type = type || 'square';
      osc.frequency.value = freq;

      osc.connect(mainGain);
      return osc;
    }
  }

  ClouduboySynth.prototype = Object.create(null);

  ClouduboySynth.prototype.pause = function() {
    this.audioCtx.pause();
  }
  ClouduboySynth.prototype.play = function() {
    this.audioCtx.resume();
  }
  ClouduboySynth.prototype.stop = function() {
    this.audioCtx.close();
  }

  ClouduboySynth.prototype.playNote = function(note, at, length) {
    var osc,
        freq = NOTES[ note>127 ? 127 : note ]/2;

    // Create oscillator w/ freq frequency (default type is 'square')
    osc = this.osc(freq);

    // Start note at the 'at' playhead-position
    if (typeof at !== 'undefined') {
      // Start now
      if (at === 0) at = this.playHead;

      osc.start(at);

      // Stop note at after 'length' ms
      if (typeof length !== 'undefined') {
        osc.stop(at+length);
      }

    // start right now
    } else {
      osc.start();
    }

    return osc;
  }

  ClouduboySynth.prototype.stopNote = function(osc, at) {
    // Stop note at the 'at' playhead-position
    if (typeof at !== 'undefined') {
      osc.stop(at);

    // stop playing right now
    } else {
      osc.stop();
    }
  }

  ClouduboySynth.freq = function(note) {
    return NOTES[ note>127 ? 127 : note ]/2;
  }

  self.ClouduboySynth = ClouduboySynth;
})();
(function () {
  'use strict';

  // Synth control command constants (from audio.h)
  var TUNE_OP_PLAYNOTE = 0x90;  /* play a note: low nibble is generator #, note is next byte */
  var TUNE_OP_STOPNOTE = 0x80;  /* stop a note: low nibble is generator # */
  var TUNE_OP_RESTART  = 0xe0;  /* restart the score from the beginning */
  var TUNE_OP_STOP     = 0xf0;  /* stop playing */

  // Ported from: Arduboy's audio.cpp & audio.h
  // https://github.com/Arduboy/Arduboy/blob/master/audio.h @ 7ddb720 on Dec 3 2015
  // https://github.com/Arduboy/Arduboy/blob/master/audio.cpp @ bac3ae9 on Jun 2 2015
  function ArduboyScore(score) {
    // Tab is a parsed score, represents the more flexible in-memory
    // representation of the binary score/score data
    var tab;

    // Score speed ratio, allows one to stretch/compress the score
    // TODO: currently unimplemented/not exposed
    var speed = 1;

    // Create tab
    tab = parse(score);

    // Access to "tab" via this.tab
    Object.defineProperty(this, 'tab', {
      enumerable: true,
      get: function() { return tab; }
    });


    // Parses string/binary score data into internal "tab" representation
    function parse(score) {
      // Binary score data
      var pgm_read_byte;

      // Already in binary format
      if (score instanceof Array) {
        pgm_read_byte = score;

      // Parse score into binary format
      } else {
        //pgm_read_byte = util.cleanComments(score).split(/,/).map(function(n) {
        pgm_read_byte = score.replace(/(\/\/[^\n]*\n|\/\*(.*?\*\/))/g, '').split(/,/).map(function(n) {
          return parseInt(n);
        });
      }

      // TODO: create index for source data

      // Current score position
      var score_cursor, score_start, tune_playing;

      // Current play context time
      var playhead;

      // Concurrent channels (3)
      var chn = [];

      // Init & play
      var tab = [],
          tabch = [];

      score_cursor = score_start = playhead = 0;
      tune_playing = true;

      // Play whole song
      while (score_cursor < pgm_read_byte.length) {
        step();
      }

      // Done
      return tab;



      /* Functions used for parsing */
      function __play_note(channel, note) {
        tab.push(
          { op: "play-note", note: note, freq: ClouduboySynth.freq(note), ch: channel, score: [score_cursor-2, score_cursor-1], time: playhead }
        );

        // latest note in channel
        tabch[ channel ] = tab[ tab.length-1 ];
      }

      function __stop_note(channel) {
        tab.push(
          { op: "stop-note", stops: tabch[channel], ch: channel, score: [score_cursor-1, score_cursor-1], time: playhead }
        );

        // link stop-note to the start-note
        if (tabch[channel]) {
          tabch[channel].stop = tab[tab.length-1];
          tabch[channel] = null;
        }
      }

      function __wait(ms) {
        ms *= speed; // speed up/slow down TODO: expose this

        tab.push(
          { op: "wait", duration: ms, score: [score_cursor-2, score_cursor-1], time: playhead }
        );

        // Advance playhead
        playhead += ms;
      }

      // Ported from: audio.cpp
      function step() {
        var command, opcode, chan;
        var duration;

        while (score_cursor < pgm_read_byte.length) {
          command = pgm_read_byte[score_cursor++];
          opcode = command & 0xf0;
          chan = command & 0x0f;
          if (opcode == TUNE_OP_STOPNOTE) { /* stop note */
            __stop_note(chan);
          }
          else if (opcode == TUNE_OP_PLAYNOTE) { /* play note */
            __play_note(chan, pgm_read_byte[score_cursor++]);
          }
          else if (opcode == TUNE_OP_RESTART) { /* restart score */
            score_cursor = score_start;
          }
          else if (opcode == TUNE_OP_STOP) { /* stop score */
            tune_playing = false;
            break;
          }
          else if (opcode < 0x80) { /* wait count in msec. */
            duration = (command << 8) | (pgm_read_byte[score_cursor++]);
            __wait(duration);
            //wait_toggle_count = ((unsigned long) wait_timer_frequency2 * duration + 500) / 1000;
            //if (wait_toggle_count == 0) wait_toggle_count = 1;
            break;
          }
        }
      } // step()

    } // parse()
  } // ArduboyScore constructor


  ArduboyScore.prototype = Object.create(null);

  ArduboyScore.prototype.play = function() {
    var ch = [];

    // Create new synth, close old one if one exists
    if (this.synth) this.synth.stop();
    var synth = this.synth = new ClouduboySynth();

    // Play score from tab data
    this.tab.forEach(function(t) {
      // Play note
      if (t.op === 'play-note') {
        ch[t.ch] = synth.playNote(t.note, t.time/1000);
        // TODO: explore ommiting this, by scheduling the note in the 'stop-note'
        // handler, via the .starts link right before scheduling the stop
        // (catch: what if a note is never stopped?)

      // Stop note
      } else if(t.op === 'stop-note') {
        if (ch[t.ch]) synth.stopNote(ch[t.ch], t.time/1000);
        ch[t.ch] = null;

      } // ignore all other tab nodes
    });

    return this;
  }

  ArduboyScore.prototype.pause = function() {
    this.synth.pause();
  }
  ArduboyScore.prototype.resume = function() {
    this.synth.resume();
  }
  ArduboyScore.prototype.stop = function() {
    this.synth.stop();
  }

  // Global non-instance methods
  ArduboyScore.make = function(inputs) {
    var score = [];
    var PLAY = "0x"+TUNE_OP_PLAYNOTE.toString(16);
    var STOP = "0x"+TUNE_OP_STOPNOTE.toString(16);
    var END = "0x"+TUNE_OP_STOP.toString(16);

    var basetime, time, d;

    if (!inputs.length) return "";
    basetime = inputs[0].t;
    time = basetime;

    for (var i of inputs) {
      if (i.t > time) {
        d = Math.round(i.t - time);
        score.push(d >> 8, d & 255);
      }
      time = i.t;

      if (i.state) {
        score.push(PLAY);
        score.push(i.note);
      } else {
        score.push(STOP);
      }
    }

    score.push(END);
    console.log( score.join(', ') );
    return JSON.stringify(inputs);
  }

  // Expose
  self.ArduboyScore = ArduboyScore;
})();
