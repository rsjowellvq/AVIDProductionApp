/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
//import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  NativeModules,
  NativeEventEmitter,
  useColorScheme,
  View,
} from 'react-native';
import BleManager, { read } from 'react-native-ble-manager';
import Buffer from 'buffer';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
/*const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};*/

const bleManagerModule = NativeModules.BleManager;
console.log("Cheeseburger1 "+bleManagerModule);
const bleManagerEmitter = new NativeEventEmitter(bleManagerModule);
const deviceList = [];
const buttonList = [];
//const hexLetters = ['A','B','C','D','E','F'];
//const firstAddresses = ['00','14','28','3C']
//let command = ['00','00'];
let addressData = ['00','0A'].map(x=>{return parseInt(x,16);});





const App = () => {
  
  
  
  React.useEffect(()=>{

    BleManager.start();
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral',handleDiscoverDevice);
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan );
    //bleManagerEmitter.addListener('BleManagerDidWrite', handleDidWrite );


  });
  
  
  const scanForAvidDevices = ()=>{

     

      BleManager.scan([],5,false).then(()=>{

        console.log("Scan Started");

      });
        //console.log("Device List Is "+deviceList.length);

        //console.log("Scanning For Devices");
        

    };

  const handleDidWrite = () => {

    console.log("We Dun Wrote");

  }
    
    
  const handleStopScan = () => {

    var currentVal = 0;

    for(var i=0;i<20;i++)
    {
      currentVal += 20;
    }
    
    
    
    
    
    
    for(var i = 0;i<deviceList.length;i++)
    {
      
      let currentDevice = deviceList[i];
      
      BleManager.connect(deviceList[i].id).then(()=>{

        BleManager.retrieveServices(currentDevice.id,["F0001130-0451-4000-B000-000000000000"]).then((deviceInfo)=>{

          BleManager.write(currentDevice.id,"F0001130-0451-4000-B000-000000000000","F0001131-0451-4000-B000-000000000000", addressData).then(()=>{

            console.log("Write Success2233");

            
            setTimeout(()=>{

              BleManager.read(currentDevice.id,"F0001130-0451-4000-B000-000000000000","F0001132-0451-4000-B000-000000000000").then((readData)=>{
    
                console.log("Data From Device 2aa "+readData);
    
                //const buffer = Buffer.Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
                //const sensorData = buffer.readUInt8(, true);
                //console.log("Buffer Data 2 "+sensorData);
      
      
              });
             
            },100);
            /*
  
            BleManager.read(currentDevice.id,"F0001130-0451-4000-B000-000000000000","F0001132-0451-4000-B000-000000000000").then((readData)=>{
    
              console.log("Data From Device 333 "+readData.data);
  
              const buffer = Buffer.Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
              const sensorData = buffer.readUInt8(7, true);
              console.log("Buffer Data 3 "+sensorData);
    
    
            });

            BleManager.read(currentDevice.id,"F0001130-0451-4000-B000-000000000000","F0001132-0451-4000-B000-000000000000").then((readData)=>{
    
              console.log("Data From Device 444 "+readData.data);
  
              const buffer = Buffer.Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
              const sensorData = buffer.readUInt8(7, true);
              console.log("Buffer Data 4 "+sensorData);
    
    
            });

            BleManager.read(currentDevice.id,"F0001130-0451-4000-B000-000000000000","F0001132-0451-4000-B000-000000000000").then((readData)=>{
    
              console.log("Data From Device 555 "+readData.data);
  
              const buffer = Buffer.Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
              const sensorData = buffer.readUInt8(7, true);
              console.log("Buffer Data 5 "+sensorData);
    
    
            });

            BleManager.read(currentDevice.id,"F0001130-0451-4000-B000-000000000000","F0001132-0451-4000-B000-000000000000").then((readData)=>{
    
              console.log("Data From Device 666 "+readData);
  
              const buffer = Buffer.Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
              const sensorData = buffer.readUInt8(7, true);
              console.log("Buffer Data 6 "+sensorData);
    
    
            });*/
            
  
          });

          
         

          


        });


      });
      
      
      //console.log("The ID Is "+device[i].id);
    }


  };
    
  

  const handleDiscoverDevice = (peripheral) => {

    
    
    
    
    if(peripheral.name != null && peripheral.name.substring(0,4) == "Avid")
    {
      deviceList.push(peripheral);
      console.log("Device Found "+deviceList[0].id);
    }


  }

  function retrieveSerialNumber(device)
  {
    BleManager.stopScan().then(()=>{

      BleManager.connect(device.id).then(()=>{





      });



    });
  }
  
  
  

  /*

      React.useEffect(()=>{

      BleManager.start();

      bleManagerEmitter.addListener('BleManagerDiscoverPeripheral',handleDiscoverDevice);

      BleManager.scan([],30,false).then(()=>{

        console.log("Scan Started");

      });


  */





  return (
    <View>
      <Text>Home Screen</Text>
      <Text>Home Screen</Text>
      <Text>Home Screen</Text>
      <Button onPress={scanForAvidDevices} title="Start Scan"/>
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

export default App;
