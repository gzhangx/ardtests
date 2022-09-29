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
  pinMode(11, INPUT);
  pinMode(9, OUTPUT);
  pinMode(10, OUTPUT);
}

int counter = 0;
int SCALE = 10;
void loop() {
  counter++;
  if (counter > SCALE) counter = 0;
  // put your main code here, to run repeatedly:
  if (counter %2)
    digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)
  else                   // wait for a second
    digitalWrite(LED_BUILTIN, LOW);    // turn the LED off by making the voltage LOW
  
  
  char buffer[40];
  int p12 = pulseIn(12, HIGH); //p12 to channel 3, left sift forward/backward.
  int p11 = pulseIn(11, HIGH); //p11 to channel 2, right side forward/backward
  sprintf(buffer, "loop %d %d p11=%d", counter,p12,p11);
  
  //chan 4 range 1100-1900 stop to max
  //chan3 left right, center aroud 1500m from 990 to 1980

  if (p12 < 1100) {
    digitalWrite(9, LOW);
    digitalWrite(10, LOW);
    sprintf(buffer, "stopped %d %d p11=%d", counter,p12,p11);
    Serial.println(buffer);
  } else {
    int RUN9 = HIGH;
    int RUN10 = LOW;
    if (p11 < 1400) {
      //reverse    
      RUN10 = HIGH;
      RUN9 = LOW;
    }
    float scale = (p12 - 1100.0)/800 * SCALE;
    int needRun = scale > counter?1:0;
    if (!needRun) {
      RUN9 = LOW;
      RUN10= LOW;
    }
    sprintf(buffer, "running %d scale=%i %d p11=%d runing=%d", counter, (int)(scale*10),p12,p11, needRun);
    Serial.println(buffer);
    digitalWrite(9, RUN9);
    digitalWrite(10, RUN10);
  }
}
