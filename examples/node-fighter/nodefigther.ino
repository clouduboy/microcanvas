#include <SPI.h>
#include <EEPROM.h>

#include <avr/pgmspace.h>

#include <Arduboy.h>

Arduboy arduboy;

// frame counter, 2-byte unsigned int, max 65536
unsigned int _microcanvas_frame_counter = 0;

// sprintf() textbuffer for drawText
char _microcanvas_textbuffer[32];

// global state machine
unsigned int _microcanvas_state;

// global current drawing color
unsigned int _microcanvas_fill_color = WHITE;

#define LENGTHOF(x)  (sizeof(x) / sizeof(x[0]))

PROGMEM const unsigned char gfx_js_ship[] = {
  /*16x9*/ 0x10, 0x92, 0xba, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xfe, 0x7c, 0x38, 0x10, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00 };
PROGMEM const unsigned char gfx_enemy_1[] = {
  /*13x9*/ 0x7c, 0xfe, 0x83, 0x83, 0xc6, 0x44, 0x10, 0x38, 0x10, 0x00, 0x10, 0x38, 0x10, 0x00, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
PROGMEM const unsigned char gfx_enemy_2[] = {
  /*14x9*/ 0xf8, 0x24, 0x24, 0x18, 0x00, 0x7e, 0x08, 0x08, 0x70, 0x00, 0xf8, 0x24, 0x24, 0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
PROGMEM const unsigned char gfx_enemy_3[] = {
  /*9x10*/ 0x20, 0xa4, 0xaa, 0xa1, 0xa4, 0xba, 0x00, 0xa0, 0x40, 0x00, 0x00, 0x02, 0x02, 0x02, 0x01, 0x00, 0x00, 0x00 };
PROGMEM const unsigned char gfx_rocket[] = {
  /*5x1*/ 0x01, 0x01, 0x01, 0x01, 0x01 };
PROGMEM const unsigned char gfx_star[] = {
  /*1x1*/ 0x01 };
PROGMEM const unsigned char gfx_intro[] = {
  /*96x27*/ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0xc0, 0xc0, 0xc0, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xc0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xfe, 0xfc, 0xf8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0xc0, 0xc0, 0xc0, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf8, 0xfc, 0xfe, 0xff, 0x0f, 0x07, 0x03, 0x07, 0x0f, 0xff, 0xfe, 0xfc, 0xf8, 0x00, 0x00, 0xf8, 0xfc, 0xfe, 0xff, 0xff, 0xff, 0xfe, 0xfc, 0xf8, 0x00, 0x00, 0xf8, 0xfc, 0xfe, 0x9f, 0x0f, 0x07, 0x0f, 0x9f, 0xff, 0xff, 0xff, 0x00, 0x00, 0xf8, 0xfc, 0xfe, 0xff, 0x8f, 0x07, 0x63, 0x67, 0x0f, 0x0f, 0x1e, 0x3c, 0x78, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x07, 0x03, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x03, 0x07, 0x00, 0x00, 0x07, 0x1f, 0x03, 0x0f, 0x1f, 0x0f, 0x03, 0x1f, 0x07, 0x00, 0x00, 0xc1, 0x43, 0x47, 0x4f, 0x0f, 0x4e, 0xcf, 0x4f, 0x0f, 0x87, 0x43, 0x40, 0x40, 0x00, 0xc1, 0x03, 0x07, 0xcf, 0x0f, 0x4e, 0x4e, 0xcc, 0x40, 0x40, 0x00, 0xc0, 0x40, 0x40, 0x40, 0x00, 0xc0, 0x40, 0x40, 0x80, 0x00, 0xc0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x07, 0x01, 0x01, 0x00, 0x00, 0x04, 0x07, 0x04, 0x00, 0x03, 0x04, 0x05, 0x03, 0x00, 0x07, 0x01, 0x01, 0x07, 0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x07, 0x05, 0x05, 0x04, 0x00, 0x07, 0x01, 0x03, 0x04, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };


const int MAX_ENEMIES = 3;
const int MAX_STARS = 20;
const int MAX_ROCKETS = 10;
const byte GFX_JS_SHIP_WIDTH = 16;
const byte GFX_JS_SHIP_HEIGHT = 9;
const byte GFX_JS_SHIP_FRAMES = 0;
const byte GFX_JS_SHIP_FRAMESIZE = 32;
const byte GFX_ENEMY_1_WIDTH = 13;
const byte GFX_ENEMY_1_HEIGHT = 9;
const byte GFX_ENEMY_1_FRAMES = 0;
const byte GFX_ENEMY_1_FRAMESIZE = 26;
const byte GFX_ENEMY_2_WIDTH = 14;
const byte GFX_ENEMY_2_HEIGHT = 9;
const byte GFX_ENEMY_2_FRAMES = 0;
const byte GFX_ENEMY_2_FRAMESIZE = 28;
const byte GFX_ENEMY_3_WIDTH = 9;
const byte GFX_ENEMY_3_HEIGHT = 10;
const byte GFX_ENEMY_3_FRAMES = 0;
const byte GFX_ENEMY_3_FRAMESIZE = 18;
const byte GFX_ROCKET_WIDTH = 5;
const byte GFX_ROCKET_HEIGHT = 1;
const byte GFX_ROCKET_FRAMES = 0;
const byte GFX_ROCKET_FRAMESIZE = 5;
const byte GFX_STAR_WIDTH = 1;
const byte GFX_STAR_HEIGHT = 1;
const byte GFX_STAR_FRAMES = 0;
const byte GFX_STAR_FRAMESIZE = 1;
const byte GFX_INTRO_WIDTH = 96;
const byte GFX_INTRO_HEIGHT = 27;
const byte GFX_INTRO_FRAMES = 0;
const int GFX_INTRO_FRAMESIZE = 384;

int shoot_timer = 10;
int x_spaceship = 0;
int y_spaceship = 0;
int sprite_enemies[ MAX_ENEMIES ];
int x_enemies[ MAX_ENEMIES ];
int y_enemies[ MAX_ENEMIES ];
int sprite_stars[ MAX_STARS ];
int x_stars[ MAX_STARS ];
int y_stars[ MAX_STARS ];
int possible_enemies[ MAX_ENEMIES ];
int x_rockets[ MAX_ROCKETS ];
int y_rockets[ MAX_ROCKETS ];
int sprite_rockets[ MAX_ROCKETS ];
int is_alive_rocket[ MAX_ROCKETS ];
int score = 0;
int playing = false;
int in_intro = true;
int in_score_screen = false;
int intro_timeout;
int score_timeout;
int x_offset = 10;
int stars_movement_timer = 0;

boolean collides(
  const unsigned char* s1, int x1,int y1, int s1_width, int s1_height,
  const unsigned char* s2, int x2,int y2, int s2_width, int s2_height,
  boolean precise
) {
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

  // TODO: pixel-by-pixel collision test

  return result;
}

void generate_stars(int amount) {
////// FUNCTION BODY //////
for (int i = 0; i < amount; i++) {
  sprite_stars[ i ] = gfx_star;
  x_stars[ i ] = (int)floor( random() % WIDTH );
  y_stars[ i ] = random() % HEIGHT;
}

}
void shoot() {
////// FUNCTION BODY //////
int idx = 0;
while (is_alive_rocket[ idx ] && idx < LENGTHOF( is_alive_rocket )) idx++;
sprite_rockets[ idx ] = gfx_rocket;
x_rockets[ idx ] = x_spaceship + 14;
y_rockets[ idx ] = y_spaceship + 4;
is_alive_rocket[ idx ] = 1;

}
void game_over() {
////// FUNCTION BODY //////
arduboy.clear();
playing = false;
in_score_screen = true;

}

void setup() {
  _microcanvas_frame_counter = 0;

  // cpuLoad() will only be 0 right after boot
  if (!arduboy.cpuLoad()) arduboy.begin();

////// CUSTOM SETUP //////
possible_enemies[ 0 ] = 0;
possible_enemies[ 1 ] = 1;
possible_enemies[ 2 ] = 2;
generate_stars( MAX_STARS );
score = 0;
x_spaceship = 10;
y_spaceship = 32;
sprite_enemies[ 0 ] = possible_enemies[ (int)floor( random() % MAX_ENEMIES ) ];
x_enemies[ 0 ] = (int)floor( random() % WIDTH + WIDTH / 2 );
y_enemies[ 0 ] = (int)floor( random() % HEIGHT );
sprite_enemies[ 1 ] = possible_enemies[ (int)floor( random() % MAX_ENEMIES ) ];
x_enemies[ 1 ] = (int)floor( random() % WIDTH + WIDTH / 2 );
y_enemies[ 1 ] = (int)floor( random() % HEIGHT );
sprite_enemies[ 2 ] = possible_enemies[ (int)floor( random() % MAX_ENEMIES ) ];
x_enemies[ 2 ] = (int)floor( random() % WIDTH + WIDTH / 2 );
y_enemies[ 2 ] = (int)floor( random() % HEIGHT );
playing = false;
in_intro = true;
in_score_screen = false;
intro_timeout = 50;
score_timeout = 50;
}

void loop() {
  if (!arduboy.nextFrame()) return;

  ++_microcanvas_frame_counter;
  if (_microcanvas_frame_counter==60000) _microcanvas_frame_counter = 0;

////// LOOP CONTENTS TO FOLLOW //////
arduboy.clear();
for (int index = 0; index < LENGTHOF( sprite_stars ); index++) {
  if (x_stars[ index ] <= 0) {
  x_stars[ index ] = WIDTH;
  y_stars[ index ] = random() % HEIGHT;
}
  if (stars_movement_timer <= 0) {
  x_stars[ index ] -= 1;
}
  arduboy.drawBitmap( x_stars[ index ], y_stars[ index ], gfx_star, GFX_STAR_WIDTH, GFX_STAR_HEIGHT, WHITE );
}
if (stars_movement_timer <= 0) {
  stars_movement_timer = 10;
}
;
if (intro_timeout > 0) intro_timeout--;
if (in_intro) {
  arduboy.drawBitmap( 0, 10, gfx_intro, GFX_INTRO_WIDTH, GFX_INTRO_HEIGHT, WHITE );
  {
arduboy.setTextSize( 1 );
arduboy.setCursor( 10, (int)floor( HEIGHT / 2 ) + 20 );
arduboy.print( "[A] to fight!" );
};
  stars_movement_timer -= 2;
  if (arduboy.pressed( A_BUTTON ) && intro_timeout <= 0) {
  in_intro = false;
  playing = true;
}
} else if (in_score_screen) {
  if (score_timeout > 0) score_timeout--;
  {
arduboy.setTextSize( 1 );
arduboy.setCursor( x_offset, (int)floor( HEIGHT / 2 ) );
arduboy.print( "Final Score:" );
};
  {
arduboy.setTextSize( 1 );
arduboy.setCursor( x_offset + 80, (int)floor( HEIGHT / 2 ) );
arduboy.print( score );
};
  {
arduboy.setTextSize( 1 );
arduboy.setCursor( 10, (int)floor( HEIGHT / 2 ) + 20 );
arduboy.print( "[A] to restart!" );
};
  if (arduboy.pressed( A_BUTTON ) && score_timeout <= 0) {
  setup();
}
} else if (playing) {
  shoot_timer -= 2;
  arduboy.drawBitmap( x_spaceship, y_spaceship, gfx_js_ship, GFX_JS_SHIP_WIDTH, GFX_JS_SHIP_HEIGHT, WHITE );
  if (y_spaceship > 0 && y_spaceship < HEIGHT) {
  if (arduboy.pressed( UP_BUTTON )) {
  y_spaceship -= 1;
  if (y_spaceship <= 0) y_spaceship = 1;
} else if (arduboy.pressed( DOWN_BUTTON )) {
  y_spaceship += 1;
  if (y_spaceship >= HEIGHT) y_spaceship = HEIGHT - 1;
}
}
  if (arduboy.pressed( A_BUTTON ) && shoot_timer <= 0) {
  shoot();
  shoot_timer = 30;
}
  for (int idx = 0; idx < LENGTHOF( sprite_enemies ); idx++) {
  int crash = false;
  int enemy_sprite = sprite_enemies[ idx ];
  if (gfx_js_ship) {
  if (enemy_sprite == 0) crash = collides( gfx_js_ship, x_spaceship, y_spaceship, GFX_JS_SHIP_WIDTH, GFX_JS_SHIP_HEIGHT, gfx_enemy_1, x_enemies[ idx ], y_enemies[ idx ], GFX_ENEMY_1_WIDTH, GFX_ENEMY_1_HEIGHT, "true" ); else if (enemy_sprite == 1) crash = collides( gfx_js_ship, x_spaceship, y_spaceship, GFX_JS_SHIP_WIDTH, GFX_JS_SHIP_HEIGHT, gfx_enemy_2, x_enemies[ idx ], y_enemies[ idx ], GFX_ENEMY_2_WIDTH, GFX_ENEMY_2_HEIGHT, "true" ); else if (enemy_sprite == 2) crash = collides( gfx_js_ship, x_spaceship, y_spaceship, GFX_JS_SHIP_WIDTH, GFX_JS_SHIP_HEIGHT, gfx_enemy_3, x_enemies[ idx ], y_enemies[ idx ], GFX_ENEMY_3_WIDTH, GFX_ENEMY_3_HEIGHT, "true" );
}
  if (crash) {
  game_over();
}
  for (int rck_idx = 0; rck_idx < LENGTHOF( sprite_rockets ); rck_idx++) {
  if (is_alive_rocket[ rck_idx ]) {
  int is_dead = false;
  if (enemy_sprite == 0) is_dead = collides( gfx_rocket, x_rockets[ rck_idx ], y_rockets[ rck_idx ], GFX_ROCKET_WIDTH, GFX_ROCKET_HEIGHT, gfx_enemy_1, x_enemies[ idx ], y_enemies[ idx ], GFX_ENEMY_1_WIDTH, GFX_ENEMY_1_HEIGHT, "true" ); else if (enemy_sprite == 1) is_dead = collides( gfx_rocket, x_rockets[ rck_idx ], y_rockets[ rck_idx ], GFX_ROCKET_WIDTH, GFX_ROCKET_HEIGHT, gfx_enemy_2, x_enemies[ idx ], y_enemies[ idx ], GFX_ENEMY_2_WIDTH, GFX_ENEMY_2_HEIGHT, "true" ); else if (enemy_sprite == 2) is_dead = collides( gfx_rocket, x_rockets[ rck_idx ], y_rockets[ rck_idx ], GFX_ROCKET_WIDTH, GFX_ROCKET_HEIGHT, gfx_enemy_3, x_enemies[ idx ], y_enemies[ idx ], GFX_ENEMY_3_WIDTH, GFX_ENEMY_3_HEIGHT, "true" );
  ;
  if (is_dead) {
  x_enemies[ idx ] = WIDTH;
  is_alive_rocket[ rck_idx ] = 0;
  sprite_enemies[ idx ] = possible_enemies[ (int)floor( random() % 3 ) ];
  y_enemies[ idx ] = (int)floor( random() % HEIGHT );
  score++;
}
}
}
}
  stars_movement_timer--;
  for (int index = 0; index < LENGTHOF( sprite_enemies ); index++) {
  int enemy_sprite = sprite_enemies[ index ];
  if (x_enemies[ index ] <= 0) {
  x_enemies[ index ] = WIDTH;
  sprite_enemies[ index ] = possible_enemies[ (int)floor( random() % 3 ) ];
  y_enemies[ index ] = (int)floor( random() % HEIGHT );
}
  x_enemies[ index ] -= 1;
  if (enemy_sprite == 0) arduboy.drawBitmap( x_enemies[ index ], y_enemies[ index ], gfx_enemy_1, GFX_ENEMY_1_WIDTH, GFX_ENEMY_1_HEIGHT, WHITE ); else if (enemy_sprite == 1) arduboy.drawBitmap( x_enemies[ index ], y_enemies[ index ], gfx_enemy_2, GFX_ENEMY_2_WIDTH, GFX_ENEMY_2_HEIGHT, WHITE ); else if (enemy_sprite == 2) arduboy.drawBitmap( x_enemies[ index ], y_enemies[ index ], gfx_enemy_3, GFX_ENEMY_3_WIDTH, GFX_ENEMY_3_HEIGHT, WHITE );
}
  for (int index = 0; index < LENGTHOF( sprite_rockets ); index++) {
  if (is_alive_rocket[ index ]) {
  if (x_rockets[ index ] >= WIDTH) is_alive_rocket[ index ] = 0; else {
  x_rockets[ index ] += 1;
  arduboy.drawBitmap( x_rockets[ index ], y_rockets[ index ], gfx_rocket, GFX_ROCKET_WIDTH, GFX_ROCKET_HEIGHT, WHITE );
}
}
}
  {
arduboy.setTextSize( 1 );
arduboy.setCursor( 0, 0 );
arduboy.print( "Score" );
};
  {
arduboy.setTextSize( 1 );
arduboy.setCursor( 50, 0 );
arduboy.print( score );
};
}
////// END OF LOOP CONTENTS //////

  arduboy.display();
}

