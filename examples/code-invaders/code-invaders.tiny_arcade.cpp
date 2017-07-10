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

TinyScreen display = TinyScreen(TinyScreenPlus);




// frame counter, 2-byte unsigned int, max 65536
unsigned int _microcanvas_frame_counter = 0;

// sprintf() textbuffer for drawText
char _microcanvas_textbuffer[32];

// global state machine
unsigned int _microcanvas_state;


// 16-bit color sprite
#define GFX_INVADER_WIDTH 9
#define GFX_INVADER_HEIGHT 8
#define GFX_INVADER_FRAMES 1
#define GFX_INVADER_FRAMESIZE = GFX_INVADER_WIDTH * GFX_INVADER_HEIGHT

const uint16_t gfx_invader[GFX_INVADER_WIDTH * GFX_INVADER_HEIGHT] = {
  /*9x8@16b*/ 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0x0000, 0x0000, 0x0000, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0x0000, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0xffff, 0x0000, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0x0000, 0xffff, 0x0000, 0xffff, 0x0000, 0xffff, 0x0000, 0xffff, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000
};
const uint16_t GFX_INVADER_MASKCOLOR = 0x0000;


#define GFX_INVADER_2_WIDTH 9
#define GFX_INVADER_2_HEIGHT 8
#define GFX_INVADER_2_FRAMES 1
#define GFX_INVADER_2_FRAMESIZE = GFX_INVADER_2_WIDTH * GFX_INVADER_2_HEIGHT

const uint16_t gfx_invader_2[GFX_INVADER_WIDTH * GFX_INVADER_2_HEIGHT] = {
  /*9x8@16b*/ 0x0000, 0x0000, 0x0000, 0x0000, 0xcbb3, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xcbb3, 0xcbb3, 0xcbb3, 0xcbb3, 0xcbb3, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xcbb3, 0x0000, 0x0000, 0x0000, 0x0000, 0xcbb3, 0x0000, 0xcbb3, 0xcbb3, 0xcbb3, 0xcbb3, 0xcbb3, 0x0000, 0xcbb3, 0x0000, 0xcbb3, 0xcbb3, 0x0000, 0xcbb3, 0x0000, 0xcbb3, 0xcbb3, 0x0000, 0xcbb3, 0x0000, 0xcbb3, 0xcbb3, 0xcbb3, 0xcbb3, 0xcbb3, 0x0000, 0xcbb3, 0x0000, 0x0000, 0x0000, 0xcbb3, 0x0000, 0xcbb3, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xcbb3, 0x0000, 0x0000, 0x0000, 0xcbb3, 0x0000, 0x0000
};
const uint16_t GFX_INVADER_2_MASKCOLOR = 0x0000;


#define GFX_DEFENDER_WIDTH 9
#define GFX_DEFENDER_HEIGHT 6
#define GFX_DEFENDER_FRAMES 1
#define GFX_DEFENDER_FRAMESIZE = GFX_DEFENDER_WIDTH * GFX_DEFENDER_HEIGHT

const uint16_t gfx_defender[GFX_DEFENDER_WIDTH * GFX_DEFENDER_HEIGHT] = {
  /*9x6@16b*/ 0x0000, 0x0000, 0x0000, 0x0000, 0x0640, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0640, 0x0640, 0x0640, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0640, 0x0640, 0x0640, 0x0640, 0x0640, 0x0000, 0x0000, 0x0640, 0x0000, 0x0640, 0x0640, 0x0000, 0x0640, 0x0640, 0x0000, 0x0640, 0x0640, 0x0640, 0x0640, 0x0000, 0x0000, 0x0000, 0x0640, 0x0640, 0x0640, 0x0640, 0x0640, 0x0640, 0x0640, 0x0640, 0x0640, 0x0640, 0x0640, 0x0640
};
const uint16_t GFX_DEFENDER_MASKCOLOR = 0x0000;


#define GFX_ROCKET_WIDTH 1
#define GFX_ROCKET_HEIGHT 3
#define GFX_ROCKET_FRAMES 1
#define GFX_ROCKET_FRAMESIZE = GFX_ROCKET_WIDTH * GFX_ROCKET_HEIGHT

const uint16_t gfx_rocket[GFX_ROCKET_WIDTH * GFX_ROCKET_HEIGHT] = {
  /*1x3@16b*/ 0x001f, 0x001f, 0x001f
};
const uint16_t GFX_ROCKET_MASKCOLOR = 0x0000;



////// CUST
int rocket_x;
int rocket_y;
int turret_x;
byte invaders[] = { 0xff, 0xff, 0xff, 0xff };
int invader_animation = 1;
int invader_x = 0;

boolean collides(const uint16_t* s1, int x1,int y1, int s1_width, int s1_height, const uint16_t* s2, int x2,int y2, int s2_width, int s2_height, boolean precise) {
  boolean result = false;

  // Basic collision rectangle
  int cx = x1>x2 ? x1 : x2;
  int cw = x1>x2 ? x2+s2_width-x1 : x1+s1_width-x2;

  int cy = y1>y2 ? y1 : y2;
  int ch = y1>y2 ? y2+s2_height-y1 : y1+s1_height-y2;

  if (cw>0 && ch>0) {
    result = true;
  }

  // No bounding rect collision or no precise check requested
  if (!precise || !result) {
    return result;
  }


  return false;
}

void draw() {
////// FUNCTION BODY //////
tiny_arcade_clear();
if (tiny_arcade_everyXFrames( 10 )) {
  invader_x = (invader_x + invader_animation);
  if (invader_x >= 6) {
  invader_animation = -1;
}
  if (invader_x <= 0) {
  invader_animation = 1;
}
}
int spacing = 4;
int start_x = (WIDTH - (6 * (GFX_INVADER_WIDTH + spacing) - spacing)) / 2;
int y = 0;
while (y < 4) {
  int x = 0;
  while (x < 6) {
  if (invaders[y] & (1 << x)) {
  if (y % 2) {
  tiny_arcade_drawBitmap( ((start_x + (invader_x +spacing-1)) + x * (GFX_INVADER_WIDTH + spacing)), y * (GFX_INVADER_HEIGHT + 1), gfx_invader, GFX_INVADER_WIDTH, GFX_INVADER_HEIGHT, WHITE );
  if (rocket_y >= 3 && collides( gfx_invader, ((start_x + (invader_x +spacing-1)) + x * (GFX_INVADER_WIDTH + spacing)), y * (GFX_INVADER_HEIGHT + 1), GFX_INVADER_WIDTH, GFX_INVADER_HEIGHT, gfx_rocket, rocket_x, rocket_y, GFX_ROCKET_WIDTH, GFX_ROCKET_HEIGHT, false )) {
  invaders[y] = invaders[y] & ~(1 << x);
  rocket_y = 0;
}
} else {
  tiny_arcade_drawBitmap( ((start_x - (invader_x +spacing-1)) + x * (GFX_INVADER_WIDTH + spacing)), y * (GFX_INVADER_HEIGHT + 1), gfx_invader_2, GFX_INVADER_2_WIDTH, GFX_INVADER_2_HEIGHT, WHITE );
  if (rocket_y >= 3 && collides( gfx_invader_2, ((start_x - (invader_x +spacing-1)) + x * (GFX_INVADER_WIDTH + spacing)), y * (GFX_INVADER_HEIGHT + 1), GFX_INVADER_2_WIDTH, GFX_INVADER_2_HEIGHT, gfx_rocket, rocket_x, rocket_y, GFX_ROCKET_WIDTH, GFX_ROCKET_HEIGHT, false )) {
  invaders[y] = invaders[y] & ~(1 << x);
  rocket_y = 0;
}
}
}
  x = (x + 1);
}
  y = (y + 1);
}
tiny_arcade_drawBitmap( (turret_x - 5), (HEIGHT - 8), gfx_defender, GFX_DEFENDER_WIDTH, GFX_DEFENDER_HEIGHT, WHITE );
if (rocket_y >= 3) {
  tiny_arcade_drawBitmap( rocket_x, rocket_y, gfx_rocket, GFX_ROCKET_WIDTH, GFX_ROCKET_HEIGHT, WHITE );
}

}

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
  turret_x = WIDTH / 2;
  rocket_x = 0;
  rocket_y = 0;
}


void loop() {
  if (!tiny_arcade_nextFrame()) return;

  ++_microcanvas_frame_counter;
  if (_microcanvas_frame_counter==60000) _microcanvas_frame_counter = 0;

  ////// LOOP CONTENTS TO FOLLOW //////
  tiny_arcade_clear();
  if (tiny_arcade_pressed( LEFT_BUTTON )) {
    turret_x = (turret_x - 3);
  }
  if (tiny_arcade_pressed( RIGHT_BUTTON )) {
    turret_x = (turret_x + 3);
  }
  if (turret_x < 0) {
    turret_x = 0;
  }
  if (turret_x > (WIDTH - GFX_DEFENDER_WIDTH / 2)) {
    turret_x = (WIDTH - GFX_DEFENDER_WIDTH / 2);
  }
  if (rocket_y < 3) {
    if (tiny_arcade_pressed( A_BUTTON )) {
    rocket_y = (HEIGHT - 3);
    rocket_x = (turret_x - 1);
  }
  }
  if (rocket_y >= 3) {
    rocket_y = (rocket_y - 3);
  }
  draw();
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
      if (blending == WHITE && color != GFX_INVADER_MASKCOLOR) { //TODO: hardcoded mask object
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
}
