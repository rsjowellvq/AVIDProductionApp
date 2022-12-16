const App = () => {

    return(
  
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoadScreen">
          <Stack.Screen name="LoadScreen" component={LoadScreen}  />
          <Stack.Screen name="SetScreen" component={SetScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    
     );
  
  
  }
  
  
  
  const SetScreen = ({route,navigation}) => {
  
    const {serialNumber,InputUUID,FirstBytes} = route.params;
    const handleDidWrite = () => {
  
      console.log("We Dun Wrote");
  
    }
    
    React.useEffect(()=>{
  
      //BleManager.start();
      bleManagerEmitter.addListener('BleManagerDiscoverPeripheral',handleDiscoverIndividualDevice);
      bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic',handleDidWrite);
      //bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan );
     // bleManagerEmitter.addListener('BleManagerDidWrite', handleDidWrite );
  
  
    });
    
    
    function scanForNewDevice()
    {
      BleManager.scan([],5,false).then(()=>{
  
        console.log("Scan Started");
    
      });
    }
    
    
  function connectToDevice()
  {
    
    
  }
    
    
    
  
    const handleDiscoverIndividualDevice = (peripheral) => {
  
      
  
      function strToUtf16Bytes(str) {
        const bytes = [];
        for (ii = 0; ii < str.length; ii++) {
          const code = str.charCodeAt(ii); // x00-xFFFF
          bytes.push(code & 255, code >> 8); // low, high
        }
        return bytes;
      }
      
      console.log("Pound Puppies");
      
      if(peripheral.name != null && peripheral.id == InputUUID)
      {
        console.log("Found It!! "+peripheral.id);
        BleManager.stopScan();
        console.log("Elmyra");
    
    BleManager.connect("5F5B4627-6EC8-171C-2F2D-718C2536CF17").then((value)=>{
      console.log("Space X");
      BleManager.retrieveServices("5F5B4627-6EC8-171C-2F2D-718C2536CF17",["F0001130-0451-4000-B000-000000000000"]).then((deviceInfo)=>{
  
        console.log("Retrieve Services "+deviceInfo.deviceUUID);
  
        
       
        
  
      });
  
    });
        
  
  
  
      }
  
  
    }
  
    
    return(
      <View>
        <Text>Serial Number:{serialNumber}</Text>
        <Text>UUID: {InputUUID}</Text>
        <Text>First 256: {FirstBytes}</Text>
        <Button title="Press to Assign Serial Number 'ABCDEF' to this device" onPress={scanForNewDevice}/>
      </View>
  
  
  
    );
  
  
  }
  
  const CharacteristicValUpdated = ({ value, peripheral, characteristic, service }) =>{}
  
  
  
  const LoadScreen = ({navigation}) => {
    
    
    
    
    
    
    
    
    const [buttons,setButtons] = React.useState([]);
    const buttonsRef = React.useRef(buttons);
    
  
    React.useEffect(()=>{
  
      BleManager.start();
      bleManagerEmitter.addListener('BleManagerDiscoverPeripheral',handleDiscoverDevice);
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
      
  
      console.log("Pissy Person");
  
      //bleManagerEmitter.addListener('BleManagerDidWrite', handleDidWrite );
  
  
    });
    
    
    const scanForAvidDevices = ()=>{
  
       
  
        BleManager.scan([],5,false).then(()=>{
  
          console.log("Scan Started");
  
        });
          //console.log("Device List Is "+deviceList.length);
  
          //console.log("Scanning For Devices");
          
  
      };
  
   
  
  
  
    
  
  
    const handleStopScan = () => {
  
     
      var currentVal = "";
      var currentHexIndex = 0;
        
      
      function writeAndRead256Data(inputDevice)
      {
        console.log("The Current Thing Is "+inputDevice.id);
        let addressData = ['00',firstAddresses[currentHexIndex]].map(x=>{return parseInt(x,16);});
        
        setTimeout(()=>{
  
          BleManager.write(inputDevice.id,"F0001130-0451-4000-B000-000000000000","F0001131-0451-4000-B000-000000000000", addressData).then(()=>{
  
            setTimeout(()=>{
    
              BleManager.read(inputDevice.id,"F0001130-0451-4000-B000-000000000000","F0001132-0451-4000-B000-000000000000").then((readData)=>{
    
                console.log("Data From Device 2aa "+readData);
                const buffer = Buffer.Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
                //const sensorData = buffer.readUInt8(7, true);
                for(var i = 0;i<20;i++)
                {
                  currentVal+=buffer.readUInt8(i).toString(16);
                }
                console.log("The String Is "+currentVal);
                //console.log("Buffer Data 4 "+sensorData);
                //currentVal += String(readData);
                if(currentHexIndex < 12)
                {
                  currentHexIndex+=1;
                  console.log("Phishing");
                  
                  writeAndRead256Data(inputDevice);
                    
                }
                else
                {
                  deviceData.push(currentVal);
                  //console.log("Serial Num Is "+currentVal.substring(167,173));
                  buttonList.push(<Button title={currentVal.substring(167,173)} ref={ref => this.button = ref} deviceUUID={inputDevice.id} key={currentVal} nativeID={currentVal}  onPress={()=>{bleManagerEmitter.removeAllListeners('BleManagerStopScan');bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');navigation.navigate('SetScreen',{serialNumber:this.button.props.title,InputUUID:this.button.props.deviceUUID,FirstBytes:this.button.props.nativeID})}} />  );
                  console.log("How many buttons "+buttonList.length+buttonList[0].accessibilityLabel);
                  currentVal = "";
                  currentHexIndex = 0;
                  setButtons(buttonList);
                  BleManager.disconnect(inputDevice.id).then(()=>{
                    return;
  
                  })
                  
                }
    
  
      
              });
             
            },100);
    
          });
  
  
        },100);
        
        
       
      }///////
  
      var deviceCount = 0;
  
      function getDeviceData()
      {
        
        console.log("Device This "+deviceList[deviceCount].id);
  
        BleManager.connect(deviceList[deviceCount].id).then((value)=>{
  
          console.log("Pizza Pizza");
  
          BleManager.retrieveServices(deviceList[deviceCount].id,["F0001130-0451-4000-B000-000000000000"]).then((deviceInfo)=>{
  
            console.log("Cheese Cheese");
            
            writeAndRead256Data(deviceList[deviceCount]);
  
              deviceCount += 1;
            if(deviceCount < deviceList.length)
            {
            
              console.log("Russia");
              getDeviceData();
            }
            else
            {
              console.log("The Length Is "+buttonList.length);
              
            }
  
  
  
            
          //
            console.log("Cheeseburger");
          
          //updateButtonList();
          //buttonsRef.current = buttonList;
          
          
          
  
          console.log("Hamburger");
          
          
          console.log("Buttons Length Is "+buttons.length);
  
        
         
        });
  
  
        });
  
  
        console.log("The Num of Buttons "+buttonList.length);
  
        return new Promise((resolve,reject)=>{
  
          resolve(true);
          
          if(1==0)
          {
            reject(false);
          }
  
        });
  
  
      }///
  
      getDeviceData().then((result)=>{
  
        console.log("Vanilla "+buttonList.length);
        buttonsRef.current = buttonList;
        console.log("Chocolate "+buttons.length);
  
  
      }).catch((error)=>{console.log("Error");});
  
      
      
      
    
  
      
     
  
  
      
  
    };
      
    
  
    const handleDiscoverDevice = (peripheral) => {
  
      
      
      
      
      if(peripheral.name != null && peripheral.name.substring(0,4) == "Avid")
      {
        deviceList.push(peripheral);
        console.log("Device Found "+deviceList[0].id);
      }
  
  
    }
  
   
    
    
    
    console.log("Num button is "+buttons.length);
  
    const handleButtonClick = (e) => {
  
      console.log("TAADAA");
      console.log(e.props.title);
  
    }
  
  
  
   
  
  
  
    return (
      <View>
        <Text>&nbsp;</Text>
        <Text>&nbsp;</Text>
        <Text>&nbsp;</Text>
        <Button titleStyle={{fontSize: 25}} onPress={scanForAvidDevices} title="Start Scan"/>
        <ScrollView>
          
          {buttons}
        </ScrollView>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
  });