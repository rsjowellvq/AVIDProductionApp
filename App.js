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
const Stack = createStackNavigator();
const deviceList = [];
var deviceData = [];
const buttonList = [];
console.log("Step 1");

console.log("Step 2");
//const hexLetters = ['A','B','C','D','E','F'];
const firstAddresses = ['00','14','28','3C','50','64','78','8C','A0','B4','C8','DC','F0'];
//let command = ['00','00'];
let addressData = ['00','0A'].map(x=>{return parseInt(x,16);});


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

  const {serialNumber,UUID,FirstBytes} = route.params;
  
  
  return(
    <View>
      <Text>{serialNumber}</Text>
      <Text>{UUID}</Text>
      <Text>{FirstBytes}</Text>
    </View>



  );


}


const LoadScreen = ({navigation}) => {
  
  
  const [buttons,setButtons] = React.useState([]);
  const buttonsRef = React.useRef(buttons);
  

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
    
  
  function updateButtonList()
  {
  
  React.useEffect(()=>{

    console.log("Here We Go");
    setButtons(buttonList);
    console.log("Winning");


  },[buttonList]);

  }


  


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
                buttonList.push(<Button title={currentVal.substring(167,173)} ref={ref => this.button = ref} deviceUUID={inputDevice.id} key={currentVal} nativeID={currentVal}  onPress={()=>{navigation.navigate('SetScreen',{serialNumber:this.button.props.title,UUID:this.button.props.deviceUUID,FirstBytes:this.button.props.nativeID})}} />  );
                console.log("How many buttons "+buttonList.length+buttonList[0].accessibilityLabel);
                currentVal = "";
                currentHexIndex = 0;
                setButtons(buttonList);
                
                return;
              }
  
              //const buffer = Buffer.Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
              //const sensorData = buffer.readUInt8(, true);
              //console.log("Buffer Data 2 "+sensorData);
    
    
            });
           
          },100);
  
        });


      },100);
      
      
     
    }

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





      
      
      
      
      
      
      /*
      for(var i = 0;i<deviceList.length;i++)
      {
      
          let currentDevice = deviceList[i];
      
          BleManager.connect(deviceList[i].id).then(()=>{

          BleManager.retrieveServices(currentDevice.id,["F0001130-0451-4000-B000-000000000000"]).then((deviceInfo)=>{

          writeAndRead256Data(currentDevice);
          //
          console.log("Cheeseburger");
          
          //updateButtonList();
          //buttonsRef.current = buttonList;
          
          
          
          

          console.log("Hamburger");
          
          
          console.log("Buttons Length Is "+buttons.length);

        
         
        });


      });
      
      
      
      
      //console.log("The ID Is "+device[i].id);
      }*/
      console.log("The Num of Buttons "+buttonList.length);

      return new Promise((resolve,reject)=>{

        resolve(true);
        
        if(1==0)
        {
          reject(false);
        }

      });


    }

    getDeviceData().then((result)=>{

      console.log("Vanilla "+buttonList.length);
      buttonsRef.current = buttonList;
      console.log("Chocolate "+buttons.length);


    }).catch((error)=>{console.log("Error");});

    function setNewButtons()
    {
      
    }
    
    
    
    
  

    
   


    

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

export default App;
