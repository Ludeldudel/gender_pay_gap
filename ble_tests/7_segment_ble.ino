// =================================================================
//                 INCLUDES AND LIBRARIES
// =================================================================
#include <Adafruit_NeoPixel.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <Preferences.h> // For saving state across reboots

// =================================================================
//           NEOPIXEL 7-SEGMENT DISPLAY CONFIGURATION
// =================================================================
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

// Variables for the display counter
unsigned long startMillis;
const float womenInGermany = 29000000.0;
const float hourlyLoss = 4.10;
const float secondlyLoss = hourlyLoss / 3600.0;

// =================================================================
//                     BLUETOOTH CONFIGURATION
// =================================================================
#define SERVICE_UUID        "12345678-1234-1234-1234-1234567890ab"

// Preferences object to access NVS
Preferences preferences;

// Global flag to determine the mode
bool runDisplayMode = false;

// Callback class for BLE Server events
class ServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    Serial.println("Client connected. Setting flag to start display and restarting...");
    
    // Set the flag in permanent memory to run the display on next boot
    preferences.begin("app_state", false); // Open NVS in read/write mode
    preferences.putBool("run_display", true);
    preferences.end();

    delay(500); // Short delay to ensure data is written and serial can print
    ESP.restart(); // Restart the ESP32
  }

  void onDisconnect(BLEServer* pServer) {
    // This part will only be reached if the client disconnects before the restart
    Serial.println("Client disconnected.");
  }
};


// =================================================================
//                           SETUP
// =================================================================
void setup() {
  Serial.begin(115200);
  Serial.println();

  // --- Check the mode from NVS ---
  preferences.begin("app_state", true); // Open NVS in read-only mode
  runDisplayMode = preferences.getBool("run_display", false); // Default to false if not found
  preferences.end();
  
  // --- Decide which mode to run ---
  if (runDisplayMode) {
    // --- DISPLAY MODE ---
    Serial.println("Booting in Display Mode.");

    // Clear the flag so next reboot (e.g., power cycle) will start in BLE mode
    preferences.begin("app_state", false);
    preferences.putBool("run_display", false);
    preferences.end();
    
    strip.begin();
    strip.show(); // Initialize all pixels to 'off'
    startMillis = millis(); // Start the timer for the counter

  } else {
    // --- BLE MODE ---
    Serial.println("Booting in BLE Mode. Waiting for a connection to start...");
    
    // Turn off the display while waiting
    strip.begin();
    strip.clear();
    strip.show();

    BLEDevice::init("7SegmentDisplay");
    BLEServer *pServer = BLEDevice::createServer();
    pServer->setCallbacks(new ServerCallbacks());

    BLEService *pService = pServer->createService(SERVICE_UUID);
    pService->start();

    BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->start();

    Serial.println("BLE advertising started. Waiting for client...");
  }
}


// =================================================================
//                           MAIN LOOP
// =================================================================
void loop() {
  // Only run the display logic if we are in display mode
  if (runDisplayMode) {
    unsigned long displayNumber = calculateDisplayValue();
    showNumber(displayNumber);
    delay(delay_ms);
  }
  // If in BLE mode, the loop does nothing. All BLE work happens in the background.
}


// =================================================================
//                DISPLAY HELPER FUNCTIONS
// =================================================================

unsigned long calculateDisplayValue() {
  unsigned long elapsedMillis = millis() - startMillis;
  float elapsedSeconds = elapsedMillis / 1000.0;
  float totalLoss = womenInGermany * secondlyLoss * elapsedSeconds / 3.0;
  return (unsigned long)(totalLoss + 0.5); // Runden
}

void showNumber(unsigned long number) {
  // First, turn off all digits to prevent ghosting
  for (uint8_t d = 0; d < numDisplays; d++) {
    showDigit(d, 255); // Use 255 as a special value for "blank"
  }

  // Set digits from right to left
  uint8_t pos = numDisplays;
  if (number == 0) { // Special case to show '0'
      showDigit(pos - 1, 0);
  } else {
      while (number > 0 && pos > 0) {
        pos--;
        uint8_t digit = number % 10;
        showDigit(pos, digit);
        number /= 10;
      }
  }
  strip.show();
}

void showDigit(uint8_t displayIndex, uint8_t digit) {
  uint16_t digitStart = displayIndex * LEDS_PER_DIGIT;
  for (uint8_t s = 0; s < 7; s++) {
    uint16_t segStart = digitStart + segmentOffsets[s];
    uint32_t segColor;
    if (digit > 9) { // If digit is blank (e.g., 255)
      segColor = colorOff;
    } else {
      segColor = segmentMap[digit][s] ? colorOn : colorOff;
    }
    for (uint8_t l = 0; l < LEDS_PER_SEGMENT; l++) {
      strip.setPixelColor(segStart + l, segColor);
    }
  }
}