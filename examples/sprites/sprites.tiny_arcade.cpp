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

#define LEFT_BUTTON 1
#define RIGHT_BUTTON 2
#define A_BUTTON 3

// Currently used color bitdepth (1 - 8 bit, 2 - 16 bit)
#define BIT_DEPTH 2

// 16bit screenbuffer
uint8_t buffer[WIDTH * HEIGHT * BIT_DEPTH];

TinyScreen _display = TinyScreen(TinyScreenPlus);



// frame counter, 2-byte unsigned int, max 65536
unsigned int _microcanvas_frame_counter = 0;

// sprintf() textbuffer for drawText
char _microcanvas_textbuffer[32];

// global state machine
unsigned int _microcanvas_state;

// global current drawing color
unsigned int _microcanvas_fill_color = WHITE;

#define LENGTHOF(x)  (sizeof(x) / sizeof(x[0]))

const uint16_t gfx_bats[] = {
  /*16x6x2@16b*/ 0xffff, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0x0000, 0x0000, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0x0000, 0x0000, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0x0000, 0x0000, 0xffff, 0xffff, 0x0000, 0x0000, 0xffff, 0xffff, 0xffff, 0x0000, 0xffff, 0x0000, 0xffff, 0xffff, 0x0000, 0xffff, 0x0000, 0xffff, 0xffff, 0xffff, 0x0000, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0x0000, 0x0000, 0xffff, 0x0000, 0x0000, 0xffff, 0x0000, 0x0000, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0x0000, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0x0000, 0xffff, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000 };


const byte GFX_BATS_WIDTH = 16;
const byte GFX_BATS_HEIGHT = 6;
const byte GFX_BATS_FRAMES = 2;
const byte GFX_BATS_FRAMESIZE = 96;
const int GFX_BATS_MASKCOLOR = 0x0000;
const int ANIMATION_DELAY = 8;

int x;
int y;
int speed_x;
int speed_y;
int c_sprite;


void setup() {
  _microcanvas_frame_counter = 0;

  // TODO: reset compatibility
  // cpuLoad() will only be 0 right after boot
  arcadeInit();
  Wire.begin();

  _display.begin();
  _display.setFlip(0);
  _display.setBrightness(8);
  _display.setBitDepth(1);

////// CUSTOM SETUP //////
x = 0;
y = (HEIGHT - GFX_BATS_HEIGHT) / 2;
c_sprite = 0;
speed_x = 1;
speed_y = 1;
}

void loop() {
  if (!tiny_arcade_nextFrame()) return;

  ++_microcanvas_frame_counter;
  if (_microcanvas_frame_counter==60000) _microcanvas_frame_counter = 0;

  ////// LOOP CONTENTS TO FOLLOW //////

////// LOOP CONTENTS TO FOLLOW //////
if (tiny_arcade_everyXFrames( ANIMATION_DELAY )) {
  c_sprite = 1 - c_sprite;
}
x += speed_x;
y += speed_y;
if (x >= ((WIDTH - GFX_BATS_WIDTH) - 1) || x < 1) speed_x = -speed_x;
if (y >= ((HEIGHT - GFX_BATS_HEIGHT) - 1) || y < 1) speed_y = -speed_y;
tiny_arcade_clear();
{
tiny_arcade_setTextSize( 3 );
tiny_arcade_setCursor( 0, 0 );
tiny_arcade_print( "Sprite\nDemo" );
};
tiny_arcade_drawBitmap( 2 + x, 2 + y, gfx_bats + GFX_BATS_FRAMESIZE*(c_sprite), GFX_BATS_WIDTH, GFX_BATS_HEIGHT, BLACK );
tiny_arcade_drawBitmap( 0 + x, 2 + y, gfx_bats + GFX_BATS_FRAMESIZE*(c_sprite), GFX_BATS_WIDTH, GFX_BATS_HEIGHT, BLACK );
tiny_arcade_drawBitmap( 1 + x, 1 + y, gfx_bats + GFX_BATS_FRAMESIZE*(c_sprite), GFX_BATS_WIDTH, GFX_BATS_HEIGHT, WHITE );
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
  tiny_arcade_fillScreen(0x0000);
}

void tiny_arcade_fillScreen(uint16_t color) {
  for (int i = 0; i < WIDTH*HEIGHT*BIT_DEPTH; i++) {
    buffer[i++] = color & 0xff;
    buffer[i] = color >> 8;
  }
}

void tiny_arcade_display() {
  // write double-buffer contents
  _display.goTo(0, 0);
  _display.startData();
  _display.writeBuffer(buffer, WIDTH * HEIGHT * 2);
  _display.endTransfer();
}

//void tiny_arcade_drawBitmap(int16_t x, int16_t y, const uint8_t *gfx, uint8_t w, uint8_t h, uint8_t blending) {
void tiny_arcade_drawBitmap(int16_t dx, int16_t dy, const uint16_t *gfx, uint8_t w, uint8_t h, uint8_t blending) {
  for (int y = dy; y < min(HEIGHT, dy+h); y++) {
    for (int x = dx; x < min(WIDTH, dx+w); x++) {
      uint16_t color = *gfx++;

      // Color mode 0 (default)
      // Paint only opaque pixels, skip transparent pixels
      // TODO: transparency handling
      if (blending == WHITE) {
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

bool tiny_arcade_pressed(int btn) {
  switch (btn) {
    case A_BUTTON:
      return checkButton(TAButton1);
    case LEFT_BUTTON:
      return checkJoystick(TAJoystickLeft);
    case RIGHT_BUTTON:
      return checkJoystick(TAJoystickRight);
  }
  return false;
}



/// DUMMY / UNIMPLEMENTED
void tiny_arcade_fillRect(int x, int y, int w, int h) {}

void tiny_arcade_setTextSize(int size) {}
void tiny_arcade_setCursor( int x, int y ) {}
void tiny_arcade_print( const char* string) {}
