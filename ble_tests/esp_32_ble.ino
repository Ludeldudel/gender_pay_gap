#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#define SERVICE_UUID        "12345678-1234-1234-1234-1234567890ab"
#define CHARACTERISTIC_UUID "abcd1234-5678-90ab-cdef-1234567890ab"

BLEServer* pServer = nullptr;
BLEAdvertising* pAdvertising = nullptr;

bool deviceConnected = false;

class ServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    Serial.println("Client connected.");
  }

  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    Serial.println("Client disconnected. Restarting advertising...");
    delay(100);  // short delay to avoid BLE stack issues
    pAdvertising->start();
  }
};

class StartCommandCallback : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) {
    uint8_t* data = pCharacteristic->getData();
    size_t length = pCharacteristic->getLength();

    if (length > 0 && data[0] == 1) {
      Serial.println("Start command received!");
      // Add your custom logic here
      // the script should start the 7-segment display logic
    } else if (length > 0) {
      Serial.print("Received other value: ");
      Serial.println(data[0]);
    }
  }
};

void setup() {
  Serial.begin(115200);
  Serial.println("Starting BLE...");

  BLEDevice::init("7SegmentDisplay");

  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);

  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_WRITE
  );

  pCharacteristic->setCallbacks(new StartCommandCallback());

  pService->start();

  pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->start();

  Serial.println("BLE advertising started. Waiting for client...");
}

void loop() {
  // Nothing needed here unless you want to add something else
}
