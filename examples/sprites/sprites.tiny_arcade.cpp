#include <TinyScreen.h>
#include <SPI.h>
#include <Wire.h>

#include <TinyArcade.h>

////// TARGET-SPECIFIC SETUP: TINY_ARCADE //////
#define screenWidth 96
#define screenHeight 64

// this is the canonical (arduboy lib) usage
#define WIDTH screenWidth
#define HEIGHT screenHeight

#define BLACK 1
#define WHITE 0

// Currently used color bitdepth (1 - 8 bit, 2 - 16 bit)
#define BIT_DEPTH 2

// 16bit screenbuffer
uint8_t buffer[WIDTH * HEIGHT * BIT_DEPTH];

TinyScreen display = TinyScreen(TinyScreenPlus);




// frame counter, 2-byte unsigned int, max 65536
unsigned int _microcanvas_frame_counter = 0;

// sprintf() textbuffer for drawText
char _microcanvas_textbuffer[32];

// global state machine
unsigned int _microcanvas_state;


// 16-bit color sprite
#define GFX_F10_MASKCOLOR 0xde5f

#define GFX_BATS_WIDTH 16
#define GFX_BATS_HEIGHT 6
#define GFX_BATS_FRAMES 2
#define GFX_BATS_FRAMESIZE  GFX_BATS_WIDTH*GFX_BATS_HEIGHT/GFX_BATS_FRAMES // pretty straightforward here

const uint16_t GFX_BATS[GFX_BATS_WIDTH * GFX_BATS_HEIGHT * GFX_BATS_FRAMES] = {
  /*16x6x2@16b*/ 0xffff, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0x0000, 0x0000, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0x0000, 0x0000, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0x0000, 0x0000, 0xffff, 0xffff, 0x0000, 0x0000, 0xffff, 0xffff, 0xffff, 0x0000, 0xffff, 0x0000, 0xffff, 0xffff, 0x0000, 0xffff, 0x0000, 0xffff, 0xffff, 0xffff, 0x0000, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0x0000, 0x0000, 0xffff, 0x0000, 0x0000, 0xffff, 0x0000, 0x0000, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0x0000, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0x0000, 0xffff, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000
};
const uint16_t GFX_BATS_MASKCOLOR = 0x0000;


////// CUST
int x = 0;
int y = 24;
int sx = 1;
int sy = 1;
int animation_speed = 8;
int c_sprite = 0;



void setup() {
  arcadeInit();
  Wire.begin();

  display.begin();
  display.setFlip(0);
  display.setBrightness(8);
  display.setBitDepth(1);
  //display.setBitDepth(0);

  tiny_arcade_init();

////// CUSTOM SETUP //////

}


void loop() {
  if (!tiny_arcade_nextFrame()) return;

  ++_microcanvas_frame_counter;
  if (_microcanvas_frame_counter==60000) _microcanvas_frame_counter = 0;

////// LOOP CONTENTS TO FOLLOW //////
if (tiny_arcade_everyXFrames( animation_speed )) {
  c_sprite = !c_sprite;
}
x += sx;
y += sy;
if (x >=  WIDTH-GFX_BATS_WIDTH -1  || x < 1) sx = -sx;
if (y >= HEIGHT-GFX_BATS_HEIGHT-1 || y < 1) sy = -sy;
tiny_arcade_clear();
{
//arduboy.setTextSize( 3 );
//arduboy.setCursor( 0, 0 );
//arduboy.print( "Sprite\nDemo" );
};
tiny_arcade_drawBitmap( (0 + x), (2 + y), GFX_BATS + BIT_DEPTH*GFX_BATS_FRAMESIZE*(c_sprite | 0), GFX_BATS_WIDTH, GFX_BATS_HEIGHT, BLACK );
tiny_arcade_drawBitmap( (2 + x), (2 + y), GFX_BATS + BIT_DEPTH*GFX_BATS_FRAMESIZE*(c_sprite | 0), GFX_BATS_WIDTH, GFX_BATS_HEIGHT, BLACK );
tiny_arcade_drawBitmap( (1 + x), (1 + y), GFX_BATS + BIT_DEPTH*GFX_BATS_FRAMESIZE*(c_sprite | 0), GFX_BATS_WIDTH, GFX_BATS_HEIGHT, WHITE );
////// END OF LOOP CONTENTS //////

  tiny_arcade_display();
}




////////////// TINY ARCADE LIB, BASED ON ARDUBOY //////////////////
uint8_t frameRate;
uint16_t frameCount;
uint8_t eachFrameMillis;
long lastFrameStart;
long nextFrameStart;
bool post_render;
uint8_t lastFrameDurationMs;

/* Graphics */
void tiny_arcade_clear() {
  tiny_arcade_fillScreen(0x00ff);
}

void tiny_arcade_fillScreen(uint16_t color) {
  for (int i = 0; i < WIDTH*HEIGHT*BIT_DEPTH; i++) {
    buffer[i++] = color & 0xff;
    buffer[i] = color >> 8;
  }
}

void tiny_arcade_display() {
  // write double-buffer contents
  display.goTo(0, 0);
  display.startData();
  display.writeBuffer(buffer, WIDTH * HEIGHT * 2);
  display.endTransfer();
}

//void tiny_arcade_drawBitmap(int16_t x, int16_t y, const uint8_t *gfx, uint8_t w, uint8_t h, uint8_t blending) {
void tiny_arcade_drawBitmap(int16_t dx, int16_t dy, const uint16_t *gfx, uint8_t w, uint8_t h, uint8_t blending) {
  for (int y = dy; y < min(HEIGHT, dy+h); y++) {
    for (int x = dx; x < min(WIDTH, dx+w); x++) {
      uint16_t color = *gfx++;

      // Color mode 0 (default)
      // Paint only opaque pixels, skip transparent pixels
      // TODO: transparency handling
      if (blending == WHITE && color != GFX_BATS_MASKCOLOR) {
        buffer[(x + y*WIDTH) * BIT_DEPTH] = color >> 8;
        if (BIT_DEPTH == 2) buffer[(x + y*WIDTH) * BIT_DEPTH + 1] = color;
      }
    }
  }
}


/* Frame management */
void tiny_arcade_setFrameRate(uint8_t rate)
{
  frameRate = rate;
  eachFrameMillis = 1000/rate;
}

bool tiny_arcade_everyXFrames(uint8_t frames)
{
  return frameCount % frames == 0;
}

void tiny_arcade_init() {
    // frame management
    tiny_arcade_setFrameRate(60);
    frameCount = 0;
    nextFrameStart = 0;
}

bool tiny_arcade_nextFrame()
{
  long now = millis();
  uint8_t remaining;

  // post render
  if (post_render) {
    lastFrameDurationMs = now - lastFrameStart;
    frameCount++;
    post_render = false;
  }

  // if it's not time for the next frame yet
  if (now < nextFrameStart) {
    remaining = nextFrameStart - now;
    // if we have more than 1ms to spare, lets sleep
    // we should be woken up by timer0 every 1ms, so this should be ok
    if (remaining > 1)
      ///*TODO:where is this from?*/idle();
    ///idle is from Arduboy core.cpp
    ///https://forum.arduino.cc/index.php?topic=337289.msg2325280#msg2325280
    ///
    {
      delay(1);
    }
    return false;
  }

  // pre-render

  // technically next frame should be last frame + each frame but if we're
  // running a slow render we would constnatly be behind the clock
  // keep an eye on this and see how it works.  If it works well the
  // lastFrameStart variable could be eliminated completely
  nextFrameStart = now + eachFrameMillis;
  lastFrameStart = now;
  post_render = true;
  return post_render;
}
