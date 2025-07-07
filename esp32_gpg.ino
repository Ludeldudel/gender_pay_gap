#include <Adafruit_NeoPixel.h>

// Konfiguration
#define DATA_PIN 13
#define LEDS_PER_SEGMENT 3
#define SEGMENTS_PER_DIGIT 7
#define LEDS_PER_DIGIT (LEDS_PER_SEGMENT * SEGMENTS_PER_DIGIT)

// Anzahl der Displays (kann beliebig angepasst werden)
uint8_t numDisplays = 10;
const uint8_t delay_ms = 100;


// Gesamtanzahl der LEDs
#define NUM_LEDS (LEDS_PER_DIGIT * numDisplays)

Adafruit_NeoPixel strip(NUM_LEDS, DATA_PIN, NEO_GRB + NEO_KHZ800);

// Segmentzuordnung: a, b, c, d, e, f, g
const uint8_t segmentMap[10][7] = {
  // a b c d e f g
  {1,1,1,1,1,1,0}, // 0
  {0,0,1,1,0,0,0}, // 1
  {0,1,1,0,1,1,1}, // 2
  {0,1,1,1,1,0,1}, // 3
  {1,0,1,1,0,0,1}, // 4
  {1,1,0,1,1,0,1}, // 5
  {1,1,0,1,1,1,1}, // 6
  {0,1,1,1,0,0,0}, // 7
  {1,1,1,1,1,1,1}, // 8
  {1,1,1,1,1,0,1}, // 9
};

// Start-LED jedes Segments (a bis g) innerhalb eines Digits
const uint8_t segmentOffsets[7] = {
  0 * LEDS_PER_SEGMENT, // a
  1 * LEDS_PER_SEGMENT, // b
  2 * LEDS_PER_SEGMENT, // c
  3 * LEDS_PER_SEGMENT, // d
  4 * LEDS_PER_SEGMENT, // e
  5 * LEDS_PER_SEGMENT, // f
  6 * LEDS_PER_SEGMENT  // g
};

// Farbe der Segmente
uint32_t colorOn  = strip.Color(255, 0, 0); // Rot
uint32_t colorOff = strip.Color(0, 0, 0);   // Aus

// Zahl, die angezeigt werden soll
unsigned long displayNumber = 1;

unsigned long startMillis;
const float womenInGermany = 29000000.0;
const float hourlyLoss = 4.10;
const float secondlyLoss = hourlyLoss / 3600.0;

void setup() {
  strip.begin();
  strip.show();
  Serial.begin(115200);
  startMillis = millis();
}

unsigned long calculateDisplayValue() {
  unsigned long elapsedMillis = millis() - startMillis;
  float elapsedSeconds = elapsedMillis / 1000.0;
  float totalLoss = womenInGermany * secondlyLoss * elapsedSeconds / 3.0;
  return (unsigned long)(totalLoss + 0.5); // Runden
}

void loop() {
  unsigned long displayNumber = calculateDisplayValue();
  showNumber(displayNumber);
  delay(delay_ms);
}

void showNumber(unsigned long number) {
  // Erst alle Digits ausschalten
  for (uint8_t d = 0; d < numDisplays; d++) {
    showDigit(d, 255); // 255 = "nichts anzeigen"
  }

  // Ziffern von hinten nach vorne
  uint8_t pos = numDisplays;
  while (number > 0 && pos > 0) {
    pos--;
    uint8_t digit = number % 10;
    showDigit(pos, digit);
    number /= 10;
  }
  strip.show();
}

void showDigit(uint8_t displayIndex, uint8_t digit) {
  uint16_t digitStart = displayIndex * LEDS_PER_DIGIT;
  for (uint8_t s = 0; s < 7; s++) {
    uint16_t segStart = digitStart + segmentOffsets[s];
    uint32_t segColor;
    if (digit > 9) { // "nichts anzeigen"
      segColor = colorOff;
    } else {
      segColor = segmentMap[digit][s] ? colorOn : colorOff;
    }
    for (uint8_t l = 0; l < LEDS_PER_SEGMENT; l++) {
      strip.setPixelColor(segStart + l, segColor);
    }
  }
}

