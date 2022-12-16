/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, { useState } from 'react';
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
import {stringToBytes} from "convert-string";
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Buffer from 'buffer';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { title } from 'process';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';



const bleManagerModule = NativeModules.BleManager;
console.log("Cheeseburger1 "+bleManagerModule);
const bleManagerEmitter = new NativeEventEmitter(bleManagerModule);
const Stack = createStackNavigator();
const deviceList = [];
var deviceData = [];
const buttonList = [];
console.log("Step 1");
//let service1130Addr = "F0001130-0451-4000-B000-000000000000";
//let charac1131Addr = "F0001131-0451-4000-B000-000000000000";

console.log("Step 2");
//const hexLetters = ['A','B','C','D','E','F'];
const firstAddresses = ['00','14','28','3C','50','64','78','8C','A0','B4','C8','DC','F0'];
//let command = ['00','00'];
let addressData = ['00','0A'].map(x=>{return parseInt(x,16);});


function getServicesAndCharacteristics(inputNo)
{
  return "F00011"+inputNo+"-0451-4000-B000-000000000000";
}


function convertHexArrayToBinary(hexInputAsArray)
{
  return hexInputAsArray.map(x=>{return parseInt(x,16);});
}





function hex_to_ascii(str1)
 {
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }




const NewApp = () => {

  React.useEffect(()=>{
  
    BleManager.start();
    //bleManagerEmitter.addListener('BleManagerDiscoverPeripheral',handleDiscoverDevice);
    //bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    

    console.log("Pissy Person");

    //bleManagerEmitter.addListener('BleManagerDidWrite', handleDidWrite );


  });

  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={NewHomeScreen}/>
        <Stack.Screen name="DetailScreen" component={NewDetailScreen}/>
      </Stack.Navigator>
    </NavigationContainer>


  );



}

const handleDiscoverDevice = (peripheral) =>{

    
  if(peripheral.name != null && peripheral.name.substring(0,4) == "Avid")
    {
      deviceList.push(peripheral);
      console.log("Device Found "+deviceList[0].id);
    }

}





const NewHomeScreen = ({navigation}) =>{

  React.useEffect(()=>{
  
    //BleManager.start();
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral',handleDiscoverDevice);
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    

    console.log("Pissy Person");

    //bleManagerEmitter.addListener('BleManagerDidWrite', handleDidWrite );


  });
  
  const [buttons,setButtons] = React.useState([]);
  const buttonsRef = React.useRef(buttons);
  
  
  


  const handleStopScan = () =>{

    var currentVal = "";
    var currentSerialNum = "";
    var currentHexIndex = 0;
    var deviceCount = 0;
  
    const getDeviceData = () =>
    {
      
      BleManager.connect(deviceList[deviceCount].id).then((value)=>{
        console.log("Boobies "+deviceList[deviceCount].name);
        BleManager.retrieveServices(deviceList[deviceCount].id).then((deviceInfo)=>{
          console.log("Cheeseburger");
          writeAndRead256Data(deviceList[deviceCount]).then((value)=>{
            console.log("Chicken");
            deviceCount += 1;
            if(deviceCount < deviceList.length)
            {
              getDeviceData();
            }
            else
            {
              //return new Promise((resolve)=>{resolve(true);});
              return;
            }
  
  
          });
          //BleManager.disconnect(deviceList[deviceCount].id);
          
  
        });
  
  
      });
  
    }///
  
  
    const writeAndRead256Data = (inputDevice) =>
      {
        
        
        
        console.log("The Current Thing Is "+inputDevice.id);
        let addressData = ['00',firstAddresses[currentHexIndex]].map(x=>{return parseInt(x,16);});
        
        setTimeout(()=>{
          console.log("Turkey");
          BleManager.write(inputDevice.id,getServicesAndCharacteristics('30'),getServicesAndCharacteristics('31'), addressData).then(()=>{
            console.log("Dressing");
          setTimeout(()=>{
    
              BleManager.read(inputDevice.id,getServicesAndCharacteristics('30'),getServicesAndCharacteristics('32')).then((readData)=>{
    
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
                  console.log("Serial Num Is "+currentVal.substring(130,142));
                  buttonList.push(<Button title={hex_to_ascii(currentVal.substring(130,142)).split("").reverse().join("")} ref={ref => this.button = ref} deviceUUID={inputDevice.id} key={currentVal} nativeID={currentVal}  onPress={()=>{bleManagerEmitter.removeAllListeners('BleManagerStopScan');bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');navigation.navigate('DetailScreen',{serialNumber:this.button.props.title,InputUUID:this.button.props.deviceUUID,FirstBytes:this.button.props.nativeID})}} />  );
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
  
        },500);
  
  
       
        
        
       
      }///////
    
  
      getDeviceData();
  
  }
  


  

  


  return(
    <View>
      <Pressable style={{marginTop:'10%'}}  title="Start Scan" onPress={()=>{BleManager.scan([],5,false).then(()=>{console.log("Scan Started");});}}>
        <Text style={{textAlign:'center',fontSize:30}}>Start Scan</Text>
      </Pressable>
      <ScrollView>
        {buttons}
        
      </ScrollView>
    </View>
  );


}

const NewDetailScreen = ({route,navigation}) => {

  const {serialNumber,InputUUID,FirstBytes} = route.params;

  

  const assignSerialNumber = (serialNumber,deviceUUID) =>
  {
    console.log("Fresh Fish");
    var setCode = ['00','55'].map(x=>{return parseInt(x,16);});
    var dataToWrite = serialNumber.split("").reverse().map(x=>{return parseInt(x.charCodeAt(0).toString(16),16);});
    console.log("Fresh Meat");
    
    BleManager.connect(deviceUUID).then((valueHello)=>{
      console.log("Fresh Tuna");
      BleManager.retrieveServices(deviceUUID).then((deviceInfo)=>{

        BleManager.write(deviceUUID,getServicesAndCharacteristics('30'),getServicesAndCharacteristics('31'),setCode).then(()=>{

          BleManager.write(deviceUUID,getServicesAndCharacteristics('30'),getServicesAndCharacteristics('33'),dataToWrite).then(()=>{


            console.log("Write Success");

          });


        });

      }).catch((error)=>{console.log("Retrieve Error "+error);});

    }).catch((error)=>{console.log("Connect ERror "+error)}); // End Connect
  }
// console.log("0xF1" + data.charCodeAt(0).toString(16));

  return(
    <View>
      <Text>Serial Number:{serialNumber}</Text>
      <Pressable onPress={()=>{assignSerialNumber("AABBCC",InputUUID)}}>
        <Text style={{fontSize:30}}>Press Here to assign serial number 'AABBCC'</Text>
      </Pressable>
    </View>


  );

}

///////////////////////////////////////////////////////////////////


export default NewApp;
