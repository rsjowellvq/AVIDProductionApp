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
const discoveredUUIDs = [];
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
  

  });

  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={NewHomeScreen}/>
        <Stack.Screen name="DetailScreen" component={NewDetailScreen}/>
      </Stack.Navigator>
    </NavigationContainer>


  );



} //End New App

const handleDiscoverDevice = (peripheral) =>{

    
  if(peripheral.name != null && peripheral.name.substring(0,4) == "Avid" && !discoveredUUIDs.includes(peripheral.id))
    {
      deviceList.push(peripheral);
      discoveredUUIDs.push(peripheral.id);
      console.log("Device Found "+deviceList[0].id);
      console.log("UUIS "+discoveredUUIDs);
    }

} // End Handle Discover Device





const NewHomeScreen = ({navigation}) =>{

  React.useEffect(()=>{
  
    //BleManager.start();
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral',handleDiscoverDevice);
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    

    console.log("Pissy Person");

    //bleManagerEmitter.addListener('BleManagerDidWrite', handleDidWrite );


  });
  
  const [buttons,setButtons] = React.useState([]);
  const [show,setShow] = React.useState(false);
 
  const buttonsRef = React.useRef(buttons);
  
  
  


  const handleStopScan = () =>{

    var currentVal = "";
    var currentSerialNum = "";
    
    var deviceCount = 0;
    let serialNoMemoryAddress = ['00','55'].map(x=>{return parseInt(x,16);});
    var currentValue = "";
  
    const getDeviceData = () =>
    {
      
      BleManager.connect(deviceList[deviceCount].id).then((value)=>{
        console.log("Boobies "+deviceList[deviceCount].name);
        BleManager.retrieveServices(deviceList[deviceCount].id).then((deviceInfo)=>{
          console.log("Cheeseburger");


            BleManager.write(deviceList[deviceCount].id,getServicesAndCharacteristics('30'),getServicesAndCharacteristics('31'),serialNoMemoryAddress).then(()=>{

                setTimeout(()=>{

                BleManager.read(deviceList[deviceCount].id,getServicesAndCharacteristics('30'),getServicesAndCharacteristics('32')).then((readData)=>{

                  console.log("The Data Is "+readData);
                  const buffer = Buffer.Buffer.from(readData);

                  for(var i = 0;i<6;i++)
                  {
                      currentValue+= hex_to_ascii(buffer.readUInt8(i).toString(16));
                  }
                  console.log("The Serial No Is "+currentValue);
                  buttonList.push(<Button title={currentValue.split("").reverse().join("")} ref={ref => this.button = ref} deviceUUID={deviceList[deviceCount].id} key={currentVal} nativeID={currentVal}  onPress={()=>{processButton(this.button.props.deviceUUID);}} />  );
                  BleManager.disconnect(deviceList[deviceCount].id);
                  console.log("Chicken");
                  deviceCount += 1;
                  console.log("Length Is "+deviceCount+" "+deviceList.length);
                  if(deviceCount < deviceList.length)
                  {
                    console.log("Pot");  
                    getDeviceData();
                  }
                  else
                  {
                    console.log("pie");
                    setButtons(buttonList);
                    setShow(false);
                    return;
                  }
                })},200);
 
             });//End of Write
          });//End Retrieve Services
        });//End connect

      }//end get device data
 


 

















          
       
          
  
   
  


      const getSerialNumber = (inputDevice) =>
      {
      let memoryAddress = ['00','55'].map(x=>{return parseInt(x,16);});
      var currentValue = "";

      BleManager.write(inputDevice.id,getServicesAndCharacteristics('30'),getServicesAndCharacteristics('31'),serialNoMemoryAddress).then(()=>{

        setTimeout(()=>{

          BleManager.read(inputDevice.id,getServicesAndCharacteristics('30'),getServicesAndCharacteristics('32')).then((readData)=>{

            console.log("The Data Is "+readData);
            const buffer = Buffer.Buffer.from(readData);

            for(var i = 0;i<6;i++)
            {
                currentValue+= hex_to_ascii(buffer.readUInt8(i).toString(16));
            }
            console.log("The Serial No Is "+currentValue);
            buttonList.push(<Button title={currentValue.split("").reverse().join("")} ref={ref => this.button = ref} deviceUUID={inputDevice.id} key={currentVal} nativeID={currentVal}  onPress={()=>{processButton(this.button.props.deviceUUID);}} />  );
            setButtons(buttonList);
            setShow(false);
            BleManager.disconnect(inputDevice.id);
            return Promise.resolve(true);

            


          });


        },200);


      });

    }



    const processButton = (inputDeviceUUID) => {

      console.log("Boopies");
      bleManagerEmitter.removeAllListeners('BleManagerStopScan');
      bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');


      //get256Data(inputDeviceUUID);








      navigation.navigate('DetailScreen',{serialNumber:this.button.props.title,InputUUID:this.button.props.deviceUUID});


    }


    
    
  
      getDeviceData();
      
  
  }
  


  

  


  return(
    <View>
      <Pressable style={{marginTop:'10%'}}  title="Start Scan" onPress={()=>{setShow(!show);BleManager.scan([],5,false).then(()=>{console.log("Scan Started");});}}>
        <Text style={{textAlign:'center',fontSize:30}}>Start Scan</Text>
      </Pressable>
      {show && <Text style={{textAlign:'center',fontSize:25}}>Scanning...</Text>}
      <ScrollView>
        {buttons}
        
      </ScrollView>
    </View>
  );


}

const NewDetailScreen = ({route,navigation}) => {

  const {serialNumber,InputUUID} = route.params;

  var currentVal = "";
  var currentHexIndex = 0;
  const [loadingDetail,setLoadingDetail] = React.useState(false);
  const [showLoadingLabel,setShowLoadingLabel] = React.useState(true);
  const [First256Bytes,setFirst256] = React.useState("");
  
    const get256Data = (inputDeviceID) =>
      {
        
        
        
        console.log("The Current Thing Is "+inputDeviceID);
        let addressData = ['00',firstAddresses[currentHexIndex]].map(x=>{return parseInt(x,16);});
        
        
        BleManager.connect(inputDeviceID).then((device)=>{

          BleManager.retrieveServices(inputDeviceID,[getServicesAndCharacteristics('30')]).then((info)=>{



            setTimeout(()=>{
              console.log("Turkey");
              BleManager.write(inputDeviceID,getServicesAndCharacteristics('30'),getServicesAndCharacteristics('31'), addressData).then(()=>{
                console.log("Dressing");
              setTimeout(()=>{
        
                  BleManager.read(inputDeviceID,getServicesAndCharacteristics('30'),getServicesAndCharacteristics('32')).then((readData)=>{
        
                    console.log("Data From Device 2aa "+readData);
                    const buffer = Buffer.Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
                    //const sensorData = buffer.readUInt8(7, true);
                    for(var i = 0;i<20;i++)
                    {
                      currentVal+=buffer.readUInt8(i).toString(16);
                    }
                    console.log("The String Is "+currentVal);
                    
    
    
                   
                    if(currentHexIndex < 12)
                    {
                      currentHexIndex+=1;
                      console.log("Phishing "+currentHexIndex);
                      //return Promise.reject();
                      get256Data(inputDeviceID);
                      //return Promise.reject();
                        
                    }
                    else
                    {
                      
                      console.log("Piping "+currentVal);
                      setFirst256(currentVal);
                      setLoadingDetail(true);
                      setShowLoadingLabel(false);
                      return;
                      /*deviceData.push(currentVal);
                      console.log("Serial Num Is "+currentVal.substring(130,142));
                      buttonList.push(<Button title={hex_to_ascii(currentVal.substring(130,142)).split("").reverse().join("")} ref={ref => this.button = ref} deviceUUID={inputDevice.id} key={currentVal} nativeID={currentVal}  onPress={()=>{bleManagerEmitter.removeAllListeners('BleManagerStopScan');bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');navigation.navigate('DetailScreen',{serialNumber:this.button.props.title,InputUUID:this.button.props.deviceUUID,FirstBytes:this.button.props.nativeID})}} />  );
                      console.log("How many buttons "+buttonList.length+buttonList[0].accessibilityLabel);
                      currentVal = "";
                      currentHexIndex = 0;
                      setButtons(buttonList);
                      setShow(false);
                      BleManager.disconnect(inputDevice.id).then(()=>{
                        return Promise.resolve(true);
      
                      })*/
                      
                    }
        
      
          
                  }).catch((error)=>{console.log("RRRREDDD error "+error);});
                 
                },100);
        
              }).catch((error)=>{console.log("Writeee Error "+error);});
      
            },100);





          });


        });
        
        
        
        
        
       
  
  
       
        
        
       
      }///////

  get256Data(InputUUID);

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
      {showLoadingLabel && <Text>Loading</Text>}
      {loadingDetail &&  <Text>Serial Number:{serialNumber}</Text>}
      {loadingDetail && <Text>First 256 Bytes: {First256Bytes}</Text>}
      {loadingDetail && <Pressable onPress={()=>{assignSerialNumber("AABBCC",InputUUID)}}>
        <Text style={{fontSize:30}}>Press Here to assign serial number 'AABBCC'</Text>
      </Pressable>}
    
    </View>
      


  );

}

///////////////////////////////////////////////////////////////////


export default NewApp;
