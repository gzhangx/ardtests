void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  // prints title with ending line break
  Serial.println("ASCII Table ~ Character Map");
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(12, INPUT);
}

int counter = 0;
void loop() {
  counter++;
  // put your main code here, to run repeatedly:
 digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(100);                       // wait for a second
  digitalWrite(LED_BUILTIN, LOW);    // turn the LED off by making the voltage LOW
  delay(100);           
  
  char buffer[40];
  int p12 = pulseIn(12, HIGH);
  sprintf(buffer, "loop %d %d", counter,p12);
  Serial.println(buffer);
  //range 1100-1900 stop to max
}
