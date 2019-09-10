let defaultWiFiTimeoutmS = 10000; //default time alloted for timeout on WiFi communication
let response = 2;
let receivedData = ""; //A place to store the response from the WiFi clickwhen requestting HTTP data
let MQTTMessageRetrieveState = 0; //Track MQTT message retrieval state.

let MQTTMessage = "" //Used to store the retrieved message

function clearSerialBuffer() {
    //   serial.clearRxBuffer()
}

function WiFiResponse(
    expectedResponse: string,
    IPDResponseTrue: boolean,
    timeoutmS: number,
    clickBoardNum: clickBoardID
) {
    
    let IPDLengthIndexStart = 0; 
    let receivedStr = ""; //The built string
    let tempIndex = 0; 
    receivedData = "";
    let IPDResponseLength = 0; //IPD Response length


    let expectedResponseIndex = 0; //The current position of the expected response comparison

    let responseState = 0; //Used to track where we are in parsing the response
    let startTime = input.runningTime(); //Get the time when this function was called

    while (input.runningTime() < (startTime + timeoutmS)) {
        //Do the code below while timeout hasn't occured
      
       

        if(bBoard.isUARTDataAvailable(clickBoardNum)){
           
            receivedStr = receivedStr + bBoard.getUARTData(clickBoardNum); //Read the serial port for any received responses
          
          
        }
         
                switch (responseState) {
                    case 0:
                   
                        if (receivedStr.indexOf(expectedResponse) !== -1)
                        {
                       
                            responseState = 1; //Move to the next stage of response comparison
                           
                        }
                        break;

                    case 1:
                   
                                if (IPDResponseTrue == true) {
                                  
                                    expectedResponseIndex = 0; //Reset the expected response index as we need to start over

                                    responseState = 3;
                                } 
                                else {
                                   
                                    return 1; //Succesfully matched
                                }
                           
                        break;
              

                    case 3:
                        tempIndex = receivedStr.indexOf("+IPD");
                       
                        if ( tempIndex !== -1)
                              {
                              
                                  expectedResponseIndex = tempIndex;
                                  responseState = 4;
                              }
                         
                        break;
                    case 4:
                        tempIndex = receivedStr.indexOf(",",expectedResponseIndex);
                       
                        if (tempIndex !== -1) {
                          
                            IPDLengthIndexStart = tempIndex + 1;
                            responseState = 5;
                        }
                        break;
                    case 5:
                        tempIndex = receivedStr.indexOf(":",expectedResponseIndex);
                
                        if (tempIndex !== -1) {
                           
                            expectedResponseIndex = tempIndex;
                            IPDResponseLength = parseInt(receivedStr.substr(IPDLengthIndexStart,(expectedResponseIndex - IPDLengthIndexStart))); //Convert the characters we received representing the length of the IPD response to an integer
                            responseState = 6;
                        }
                          
                        break;

                    case 6:
                        
                        receivedData = receivedStr.substr(expectedResponseIndex+1,IPDResponseLength);
               
                            return 1; //Successfully read
                    

                        break;
                } //Switch
           
        
    }

    return 0;
}

function ThingSpeakResponse() {
    let data = 0;
    let dataStr = "";
    let responseState = 0; //Used to track where we are in parsing the response
    let currentCharIndex = 0; //Used to track the character we are currently looking at

    let expectedResponseStr = "\"feeds\""; //Used to hold the desired response we are looking for
    let expectedResponseLen = expectedResponseStr.length; //Length of the expected Response we are looking for
    let expectedResponseIndex = 0; //Used to track the character we are currently looking at for the expected response

    let receivedDataLen = receivedData.length; //Length of the response

    for (
        let currentCharIndex = 0;
        currentCharIndex < receivedDataLen;
        currentCharIndex++
    ) {
        switch (responseState) {
            case 0:
                if (
                    receivedData
                        .charAt(currentCharIndex)
                        .compare(
                            expectedResponseStr.charAt(expectedResponseIndex)
                        ) == 0
                ) {
                    expectedResponseIndex++; //Look at the next character in the expected response next time through

                    if (expectedResponseIndex == expectedResponseLen) {
                        expectedResponseStr = "field1\":\""; //Used to hold the desired response we are looking for
                        expectedResponseLen = expectedResponseStr.length; //Length of the expected Response we are looking for
                        expectedResponseIndex = 0; //Used to track the character we are currently looking at for the expected response
                        responseState = 1; //Move to the next stage of response comparison
                    }
                }
                break;

            case 1:
                if (
                    receivedData
                        .charAt(currentCharIndex)
                        .compare(
                            expectedResponseStr.charAt(expectedResponseIndex)
                        ) == 0
                ) {
                    expectedResponseIndex++; //Look at the next character in the expected response next time through

                    if (expectedResponseIndex == expectedResponseLen) {
                        expectedResponseStr = "\""; //Used to hold the desired response we are looking for
                        expectedResponseLen = expectedResponseStr.length; //Length of the expected Response we are looking for
                        expectedResponseIndex = 0; //Used to track the character we are currently looking at for the expected response
                        responseState = 2; //Move to the next stage of response comparison
                    }
                }
                break;
            case 2:
                if (
                    receivedData
                        .charAt(currentCharIndex)
                        .compare(expectedResponseStr.charAt(0)) == 0
                ) {
                    data = parseInt(dataStr); //Convert the characters we received representing the length of the IPD response to an integer
                    return dataStr;
                } else {
                    dataStr = dataStr.concat(
                        receivedData.charAt(currentCharIndex)
                    );
                }
                break;
        }
    }

    return "";
}

/**
 * Custom blocks
 */
//% weight=100 color=#9E4894 icon=""
//% advanced=true
namespace WiFi_BLE {

    //% groups=" 'Initialization' weight=100, 'IFTTT', 'Thingspeak','MQTT', 'Bluetooth Click Board' weight=50, 'RFID Click Board', 'NFC Click Board' 'LoRaWAN Click, '3G Click Board' "
let MQTTMessage = ""
let UARTRawData  = ""

    let flag = true;

    // -------------- 2. WiFi ----------------
    //% blockId=Initialize_set_wifi_click
    //% block="Initialize WiFi Click 3 to ssid %ssid| pwd %pwd on click%clickBoardNum"
    //% weight=100
    //% group="Initialization"
    //% blockGap=7
    export function InitializeWifi(ssid: string, pwd: string,clickBoardNum: clickBoardID): void {
        bBoard.clearUARTRxBuffer(clickBoardNum);

        bBoard.sendString("AT+CWMODE=1\r\n", clickBoardNum); //Put the clickinto station (client) mode
        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"

        clearSerialBuffer(); //Clear any characters from the RX Buffer that came after the previous Response
        bBoard.sendString("AT+CIPMUX=1\r\n", clickBoardNum);  //Enable multiple connections
        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"

        clearSerialBuffer(); //Clear any characters from the RX Buffer that came after the previous Response
        bBoard.sendString("AT+CWJAP=\"" + ssid + "\",\"" + pwd + "\"\r\n", clickBoardNum);  //Connect to WiFi Network
        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"

        clearSerialBuffer(); //Clear any characters from the RX Buffer that came after the previous Response
        bBoard.sendString("AT+CIPSTATUS\r\n", clickBoardNum);  //Get information about the connection status
        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"

        clearSerialBuffer(); //Clear any characters from the RX Buffer that came after the previous Response
        bBoard.sendString("AT+CIFSR\r\n", clickBoardNum);  //Get local IP Address
        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"
    }

    // -------------- 3. Cloud ----------------
    //% blockId=BLTest_set_thingspeak
    //% block="Send ThingSpeak key %key| fieldNum %fieldNum| data %data on click%clickBoardNum"
    //% weight=90
    //% group="Thingspeak"
    //% blockGap=7
    export function sendThingspeak(
        key: string,
        fieldNum: number,
        data: string,
        clickBoardNum: clickBoardID
    ): void {
        let getData =
            "GET /update?api_key=" +
            key +
            "&field" +
            fieldNum.toString() +
            "=" +
            data +
            "\r\n";

        bBoard.sendString("AT+CIPMUX=1\r\n", clickBoardNum); 
        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum);

        bBoard.sendString("AT+CIPSTART=0,\"TCP\",\"api.thingspeak.com\",80\r\n", clickBoardNum); 
        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum);

        bBoard.sendString(
            "AT+CIPSEND=0," + getData.length.toString() + "\r\n", clickBoardNum);
        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum);

        bBoard.sendString(getData, clickBoardNum);
        response = WiFiResponse("OK", true, defaultWiFiTimeoutmS,clickBoardNum);
        //*** Need to address this. Use CIPSTATUS to see when TCP connection is closed as thingspeak automatically closes it when message sent/received */
        // bBoard.sendString("AT+CIPCLOSE=0\r\n",clickBoardNum)
        //response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"
    }

    // -------------- 3. Cloud ----------------
    //% blockId=BLTest_get_thingspeak
    //% block="Get ThingSpeak ChannelID %ChannelID| fieldNum %fieldNum on click%clickBoardNum"
    //% weight=90
    //% group="Thingspeak"
    //% blockGap=7
    export function getThingspeak(ChannelID: number, fieldNum: number, clickBoardNum: clickBoardID): string {
        let getData =
            "GET /channels/" +
            ChannelID.toString() +
            "/fields/" +
            fieldNum.toString() +
            ".json?results=1\r\n";
        let data = "";

        bBoard.sendString("AT+CIPMUX=1\r\n", clickBoardNum)
        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"

        bBoard.sendString("AT+CIPSTART=0,\"TCP\",\"api.thingspeak.com\",80\r\n", clickBoardNum); 
        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"

        bBoard.sendString(
            "AT+CIPSEND=0," + getData.length.toString() + "\r\n", clickBoardNum
        );
        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"

        bBoard.sendString(getData,clickBoardNum);
        response = WiFiResponse("OK", true, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"

        data = ThingSpeakResponse();

        //*** Need to address this. Use CIPSTATUS to see when TCP connection is closed as thingspeak automatically closes it when message sent/received */
        // bBoard.sendString("AT+CIPCLOSE=0\r\n",clickBoardNum)
        // response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK" //Wait for the response "OK"

        return data;
    }

    //% blockId=BL_set_ifttt
    //% block="Send IFTTT key %key|event_name %event|value1 %value1 on click%clickBoardNum"
    //% group="IFTTT"
    //% weight=90
    export function sendIFTTT(
        key: string,
        eventname: string,
        value1: number,clickBoardNum: clickBoardID
    ): void {
        let getData =
            "GET /trigger/" +
            eventname +
            "/with/key/" +
            key +
            "?value1=" +
            value1.toString() +
            " HTTP/1.1\r\nHost: maker.ifttt.com\r\n\r\n";

        bBoard.sendString("AT+CIPMUX=1\r\n", clickBoardNum);  //Multiple connections enabled
        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"

        bBoard.sendString("AT+CIPSTART=0,\"TCP\",\"maker.ifttt.com\",80\r\n", clickBoardNum);  //Make a TCP connection to the host
        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"

        bBoard.sendString(
            "AT+CIPSEND=0," + getData.length.toString() + "\r\n",clickBoardNum
        ); //Get ready to send a packet and specifiy the size
        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"

        bBoard.sendString(getData,clickBoardNum); //Send the contents of the packet
        response = WiFiResponse("OK", true, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"

        bBoard.sendString("AT+CIPCLOSE=0\r\n", clickBoardNum);  //Close your TCP connection
        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"
    }

    // -------------- 3. Cloud ----------------
    //% blockId=publishAdafruitMQTT
    //% block="Publish Adafruit MQTT  topic %string| data %data on click%clickBoardNum"
    //% group="MQTT"
    //% weight=70   
    //% blockGap=7  
    export function publishAdafruitMQTT(topic: string, data: number,clickBoardNum: clickBoardID): void {
        let publishPacketSize = 0
        let controlPacket = pins.createBuffer(1);
        controlPacket.setNumber(NumberFormat.UInt8LE,0,0x30); //Publish Control Packet header

        let remainingLengthTemp = pins.createBuffer(4) //Max size of remaining Length packet
        let topicLength = pins.createBuffer(2);
        topicLength.setNumber(NumberFormat.UInt8LE,0,topic.length >> 8); 
        topicLength.setNumber(NumberFormat.UInt8LE,1,topic.length & 0xFF); 

        let i = 0
        let encodedByte = 0
        let X = 0
        let remainingLengthBytes = 1 //At least 1 byte of RL is necessary for packet


        X = 0x02 + topic.length + data.toString().length 

        for (i = 0; i < 4; i++) {
            if (X >= 128) {
                remainingLengthTemp.setNumber(NumberFormat.UInt8LE,i,0xFF)
                X -= 127
            }
            else {
                remainingLengthTemp.setNumber(NumberFormat.UInt8LE,i,X)
                break;

            }

        }


        let remainingLength = pins.createBuffer(i + 1)
        for (let j = 0; j < i + 1; j++) {
            remainingLength.setNumber(NumberFormat.UInt8LE,j,remainingLengthTemp.getNumber(NumberFormat.UInt8LE,j))

        }

        publishPacketSize = 1 + remainingLength.length + 2 + topic.length + data.toString().length


  
        bBoard.sendString("AT+CIPSEND=0," + publishPacketSize.toString() + "\r\n",clickBoardNum)
        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"

        bBoard.sendBuffer(controlPacket,clickBoardNum)
        bBoard.sendBuffer(remainingLength,clickBoardNum)
        bBoard.sendBuffer(topicLength,clickBoardNum)
        bBoard.sendString(topic,clickBoardNum)
        bBoard.sendString(data.toString(),clickBoardNum)
       // bBoard.sendString("\r\n",clickBoardNum)


        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"
        basic.pause(200)


      //  bBoard.sendString("AT+CIPCLOSE=0\r\n",clickBoardNum)
      //  response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"



    }


    // -------------- 3. Cloud ----------------
    //% blockId=connectMQTT
    //% block="Connect to MQTT broker %broker|port %port|clientID %clientID|userName %userName|password %password on click%clickBoardNum"
    //% group="MQTT"
    //% weight=70   
    //% blockGap=7  
    export function connectMQTT(broker: string, port: string, clientID: string, userName: string, password: string,clickBoardNum: clickBoardID): void {

        let connectPacketSize = 0
        let controlPacket = pins.createBuffer(1);
        controlPacket.setNumber(NumberFormat.UInt8LE,0,0x10); //Publish Control Packet header

        let remainingLengthTemp = pins.createBuffer(4) //Max size of remaining Length packet
        let protocolName = "MQTT"

        let protocolNameLength = pins.createBuffer(2);
        protocolNameLength.setNumber(NumberFormat.UInt8LE,0,protocolName.length >> 8); 
        protocolNameLength.setNumber(NumberFormat.UInt8LE,1,protocolName.length & 0xFF); 


        let protocolLevel = pins.createBuffer(1);
        protocolLevel.setNumber(NumberFormat.UInt8LE,0,0x04); 
      
        let protocolFlags = pins.createBuffer(1);
        protocolFlags.setNumber(NumberFormat.UInt8LE,0,0xC2); 
      
     
        let keepAliveSeconds = 60

        let keepAlive = pins.createBuffer(2);
        keepAlive.setNumber(NumberFormat.UInt8LE,0,keepAliveSeconds >> 8); 
        keepAlive.setNumber(NumberFormat.UInt8LE,1,keepAliveSeconds & 0xFF); 

     
        let clientIDLength = pins.createBuffer(2);
        clientIDLength.setNumber(NumberFormat.UInt8LE,0,clientID.length >> 8); 
        clientIDLength.setNumber(NumberFormat.UInt8LE,1,clientID.length & 0xFF); 
        
            
        let userNameLength = pins.createBuffer(2);
        userNameLength.setNumber(NumberFormat.UInt8LE,0,userName.length >> 8); 
        userNameLength.setNumber(NumberFormat.UInt8LE,1,userName.length & 0xFF); 

        let passwordLength = pins.createBuffer(2);
        passwordLength.setNumber(NumberFormat.UInt8LE,0,password.length >> 8); 
        passwordLength.setNumber(NumberFormat.UInt8LE,1,password.length & 0xFF); 

    

        let i = 0
        let encodedByte = 0
        let X = 0
        let remainingLengthBytes = 1 //At least 1 byte of RL is necessary for packet


        X = 0x02 + 0x02 + protocolName.length + 0x01 + 0x01 + 0x02 + 0x02 + clientID.length + 0x02 + userName.length + 0x02 + password.length 
        connectPacketSize = X

        for (i = 0; i < 4; i++) {
            if (X >= 128) {
                remainingLengthTemp.setNumber(NumberFormat.UInt8LE,i,0xFF)
                X -= 127
            }
            else {
                remainingLengthTemp.setNumber(NumberFormat.UInt8LE,i,X)
                break;

            }

        }


        let remainingLength = pins.createBuffer(i + 1)
        for (let j = 0; j < i + 1; j++) {
            remainingLength.setNumber(NumberFormat.UInt8LE,j,remainingLengthTemp.getNumber(NumberFormat.UInt8LE,j))

        }

        connectPacketSize = connectPacketSize + 1 + remainingLength.length //The total size of the packet to send


        clearSerialBuffer()

        bBoard.sendString("AT+CIPMUX=1\r\n",clickBoardNum)

        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"
        clearSerialBuffer()
        bBoard.sendString("AT+CIPSTART=0,\"TCP\",\"io.adafruit.com\",1883,30\r\n",clickBoardNum)


        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"
        clearSerialBuffer()
        bBoard.sendString("AT+CIPSEND=0," + connectPacketSize.toString() + "\r\n",clickBoardNum)
        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"
       
        bBoard.sendBuffer(controlPacket,clickBoardNum)
        bBoard.sendBuffer(remainingLength,clickBoardNum)
        bBoard.sendBuffer(protocolNameLength,clickBoardNum)
        bBoard.sendString(protocolName,clickBoardNum)
        bBoard.sendBuffer(protocolLevel,clickBoardNum)
        bBoard.sendBuffer(protocolFlags,clickBoardNum)
        bBoard.sendBuffer(keepAlive,clickBoardNum)
        bBoard.sendBuffer(clientIDLength,clickBoardNum)
        bBoard.sendString(clientID,clickBoardNum)
        bBoard.sendBuffer(userNameLength,clickBoardNum)
        bBoard.sendString(userName,clickBoardNum)
        bBoard.sendBuffer(passwordLength,clickBoardNum)
        
        bBoard.sendString(password,clickBoardNum)
       // basic.pause(1)
        bBoard.sendString("\r\n",clickBoardNum)



        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"
        basic.pause(200)



    }


    // -------------- 3. Cloud ----------------
    //% blockId=subscribeAdafruitMQTT
    //% block="Subscribe Adafruit MQTT topic %string on click%clickBoardNum"
    //% group="MQTT"
    //% weight=70   
    //% blockGap=7  
    export function subscribeAdafruitMQTT(topic: string,clickBoardNum: clickBoardID): void {

        let subscribePacketSize = 0
        let controlPacket = pins.createBuffer(1);
        controlPacket.setNumber(NumberFormat.UInt8LE,0,0x82); //Subscribe Control Packet header

        let remainingLengthTemp = pins.createBuffer(4) //Max size of remaining Length packet
        let packetID = pins.createBuffer(2); // packet ID 
        packetID.setNumber(NumberFormat.UInt8LE,0,0);
        packetID.setNumber(NumberFormat.UInt8LE,1,1);

        let topicLength = pins.createBuffer(2);

        topicLength.setNumber(NumberFormat.UInt8LE,0,topic.length >> 8); 
        topicLength.setNumber(NumberFormat.UInt8LE,1,topic.length & 0xFF); 

        let QS = pins.createBuffer(1);
        QS.setNumber(NumberFormat.UInt8LE,0,0); //Set QOS to 0

        let i = 0
        let encodedByte = 0
        let X = 0
        let remainingLengthBytes = 1 //At least 1 byte of RL is necessary for packet


        X = 0x02 + 2 + topic.length + 1

        for (i = 0; i < 4; i++) {
            if (X >= 128) {
                remainingLengthTemp.setNumber(NumberFormat.UInt8LE,i,0xFF)
                X -= 127
            }
            else {
                remainingLengthTemp.setNumber(NumberFormat.UInt8LE,i,X)
                break;

            }

        }


        let remainingLength = pins.createBuffer(i + 1)
        for (let j = 0; j < i + 1; j++) {
            remainingLength.setNumber(NumberFormat.UInt8LE,j,remainingLengthTemp.getNumber(NumberFormat.UInt8LE,j))

        }

        subscribePacketSize = 1 + remainingLength.length + 2 + 2 + topic.length +1


  
        bBoard.sendString("AT+CIPSEND=0," + subscribePacketSize.toString() + "\r\n",clickBoardNum)
        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"

        bBoard.sendBuffer(controlPacket,clickBoardNum)
        bBoard.sendBuffer(remainingLength,clickBoardNum)
        bBoard.sendBuffer(packetID,clickBoardNum)
        bBoard.sendBuffer(topicLength,clickBoardNum)
        bBoard.sendString(topic,clickBoardNum)
        bBoard.sendBuffer(QS,clickBoardNum) //Quality of service

     


        response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"
        basic.pause(200)


       
        
    }
    // -------------- 3. Cloud ----------------
    //% blockId=getMQTTMessage
    //% block="Get MQTT Message on click%clickBoardNum"
    //% group="MQTT"
    //% weight=70   
    //% blockGap=7  
    export function getMQTTMessage(clickBoardNum: clickBoardID): string {
        return MQTTMessage
    }

   // -------------- 3. Cloud ----------------
    //% blockId=isMQTTMessage
    //% block="Is MQTT Message Available on click%clickBoardNum ?"
    //% group="MQTT"
    //% weight=70   
    //% blockGap=7  
    export function isMQTTMessage(clickBoardNum: clickBoardID): boolean{
        let startIndex = 0;
        let remainingLength = 0;
        let topicLength = 0;
       if(UARTRawData.length > 300){
           UARTRawData = ""
       }
      if(bBoard.isUARTDataAvailable(clickBoardNum) || UARTRawData.length > 0)
      {
          
            UARTRawData = UARTRawData + bBoard.getUARTData(clickBoardNum); // code block
            

            if(UARTRawData.indexOf("+IPD") !== -1) //If +IPD: was found
            {
   
                startIndex = UARTRawData.indexOf(":") + 1 //Look for beginning of MQTT message
                if(startIndex)
                {
             
                    if(UARTRawData.charCodeAt(startIndex) != 0x30) //If message type is not a publish packet
                    {
                        return false; //Not a publish packet

                    }
                    
                    remainingLength = UARTRawData.charCodeAt(startIndex + 1); //Extract the remaining length from the MQTT message (assuming RL < 127)
                   
                    if(UARTRawData.length >= startIndex + remainingLength) //Make sure the rest of the message is here
                    {
                        topicLength = UARTRawData.charCodeAt(startIndex + 3); //Extract the topic length from the MQTT message (assuming TL < 127)
                
                        MQTTMessage  = UARTRawData.substr(startIndex + 4+topicLength,remainingLength-topicLength-2)
    
                        UARTRawData = UARTRawData.substr(remainingLength-topicLength-2,UARTRawData.length-1) //Remove all data other than the last character (in case there is no more data)
                        
                    }
              
                    return true; //Message retrieved
                }
            }
     

        }
            return false;
            
    }



    // -------------- 3. Cloud ----------------
    //% blockId=pingAdafruitMQTT
    //% block="Ping Adafruit MQTT on click%clickBoardNum"
    //% group="MQTT"
    //% weight=70   
    //% blockGap=7  
    export function pingAdafruitMQTT(clickBoardNum: clickBoardID) {

        let controlPacket = pins.createBuffer(1);
        controlPacket.setNumber(NumberFormat.UInt8LE,0,0xC0); //Subscribe Control Packet header
        let remainingLength = pins.createBuffer(1) //size of remaining Length packet
        remainingLength.setNumber(NumberFormat.UInt8LE,0,0x00); //Remaining Length = 0 

            bBoard.sendString("AT+CIPSEND=0,2\r\n",clickBoardNum)
            response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"
            bBoard.sendBuffer(controlPacket,clickBoardNum);
            bBoard.sendBuffer(remainingLength,clickBoardNum);
            response = WiFiResponse("OK", false, defaultWiFiTimeoutmS,clickBoardNum); //Wait for the response "OK"
            
        }

    





}
