import React, {useEffect, useState} from 'react';
import { Feather as Icon} from '@expo/vector-icons';
import {View , Text ,Image ,ImageBackground , StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import axios from 'axios';

const Home = () =>{
  
  interface IBGEUFResponse{
    id:string;
    sigla:string;
    nome:string;
  }

  interface IBGECityResponse{
    id:string;
    nome:string;
  }


  const [ufs,setUfs] = useState<Item[]>([]);
  const [ufSelected, setUfSelected] = useState<Item>({} as Item);
  const [citySelected, setCitySelected] = useState<Item>({} as Item);
  const [cities, setCities] = useState<Item[]>([]);
  

  useEffect(()=>{},[])

  useEffect(()=>{
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response=>{
        const ufInitials = response.data.map(res=>{return {label: res.nome , value:  res.sigla , key: res.id}});
        setUfs(ufInitials);
    });
  },[]);


    const navigation = useNavigation();

    function handleNavigateToPoints() {
        navigation.navigate('Points',{uf: ufSelected.value, city: citySelected.label });
    }

    function handleSelectUF(label:string,value:number){
      const [uf] = ufs.filter(uf=>label===uf.value);
      if (uf!==undefined){
        setUfSelected(uf);
        setCities([]);
        return;
      } 
      setUfSelected({} as Item);
      setCitySelected({} as Item);
    }

    function handleDoneUfSelect(){
      if(ufSelected.value!=0){
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelected.value}/municipios`)
        .then(response=>{
            const cities = response.data.map(res=>{return {label: res.nome , value:  res.id}});
            setCities(cities);
        });
        return;
      }
      setCities([]);
    }

    function handleSelectCity(label:string,value:number){
      const [city] = cities.filter(city=>label===city.value);
      if (city!==undefined){
         setCitySelected(city);
         return;
      } 
    }

    return (
      <ImageBackground 
          source={require('../../assets/homeBckg.png')} 
          style={styles.container}
          imageStyle={{width: 274 , height: 274}}
      >
          <View style={styles.main}>
              <Image source={require('../../assets/logo.png')}/>
              <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
              <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
          <View style={styles.footer}>
              <View style={styles.input}>
                <RNPickerSelect
                  key='UF'
                  style={styles}
                  placeholder={{label:'Selecione a UF',value: 0}}
                  onValueChange={(label,value)=>handleSelectUF(label,value)}
                  onDonePress={handleDoneUfSelect}
                  items={ufs}  
                />
              </View>
              <View style={styles.input}>
                <RNPickerSelect
                  key="city"
                  style={styles}
                  placeholder={{label:'Selecione a cidade',value: 0}}
                  value={cities.length>0?citySelected.value:0}
                  onValueChange={handleSelectCity}
                  items={cities}  
                />
              </View>
              <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                  <View style={styles.buttonIcon}>
                      <Text>
                          <Icon name='arrow-right' color='#FFF' size={24}/>
                      </Text>
                  </View>
                  <Text style={styles.buttonText}>
                      Entrar
                  </Text>
              </RectButton>
          </View>
      </ImageBackground>)
}

const styles = StyleSheet.create({

    container: {
      flex: 1,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 40,
    },
  


    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Roboto_700Bold',
      maxWidth: 280,
      marginTop: 72,
     
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Ubuntu_400Regular',
      maxWidth: 280,
      lineHeight: 24,
    },
  
    footer: {
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 40
    },
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },

      inputIOS: {
        fontSize: 16,
        justifyContent:'center',
        paddingVertical: 20,
        paddingHorizontal: 10,
        //borderWidth: 1,
        //borderColor: 'gray',
//        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
      },

    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Ubuntu_500Medium',
      fontSize: 16,
    }
  });

export default Home;