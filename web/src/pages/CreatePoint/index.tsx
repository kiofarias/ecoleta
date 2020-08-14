import React , { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './styles.css';
import logo from '../../assets/logo.svg';
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet'
import api from '../../services/api';
import axios from 'axios';

const CreatePoint = () =>{

    interface Item {
        id:number;
        title:string;
        image_url:string;
    }
    interface IBGEUFResponse{
        sigla:string;
    }

    interface IBGECityResponse{
        nome:string;
    }

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [ufSelected, setUfSelected] = useState('0');
    const [citySelected, setCitySelected] = useState('0');
    const [cities, setCities] = useState<string[]>([]);
    const [initialPosition,setInitialPosition] = useState<[number,number]>([0,0]);
    const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0]);
    const [selectedItems, setSelectedItems] =useState<number[]>([]);

    const [formData, setFormData] =useState({
        name:'',
        email:'',
        whatsapp:'',
    });

    const history = useHistory();

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(inf=>{
            setInitialPosition([inf.coords.latitude, inf.coords.longitude]);
//            setSelectedPosition([inf.coords.latitude, inf.coords.longitude]);
        });
    },[])
    useEffect(()=>{
        api.get('items').then(response=>{
            setItems(response.data);
        })
    },[]);

    useEffect(()=>{
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response=>{
            const ufInitials = response.data.map(res=>res.sigla);
            setUfs(ufInitials);
        });
    },[]);

    useEffect(()=>{
        if(ufSelected==='0'){
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelected}/municipios`)
            .then(response=>{
                const cities = response.data.map(res=>res.nome);
                setCities(cities);
            });
    },[ufSelected]);


    function handleSelectUF(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;
        setUfSelected(uf);
        setCities([]);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;
        setCitySelected(city);
    }

    function handleSelectPosition(event: LeafletMouseEvent){
        setSelectedPosition([event.latlng.lat, event.latlng.lng]);
    }

    function handleSelectdItems(id: number){

        if (selectedItems.includes(id)){
            const filterdSelectedItems = selectedItems.filter(item=>item!==id);
            setSelectedItems([...filterdSelectedItems])
        }
        else{
            setSelectedItems([...selectedItems, id]);
        }
    }

    function HandleInputChange(event: ChangeEvent<HTMLInputElement>){
        const name=event.target.name;
        const value=event.target.value;
        setFormData({...formData ,[name]:value });
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        const {name, email, whatsapp} = formData;
        const [latitude, longitude] = selectedPosition;
        const data ={
            name,
            email,
            whatsapp,
            uf: ufSelected,
            city: citySelected,
            latitude,
            longitude,
            items: selectedItems
        }
        await api.post('points',data);
        alert('Ponto de coleta cadastrado!')
        history.push('/');
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="ECOLETA"/>
                <Link to="/">
                <FiArrowLeft/>
                    Voltar para home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name"
                            onChange={HandleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email"
                                onChange={HandleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text" 
                                name="whatsapp" 
                                id="whatsapp"
                                onChange={HandleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereços</h2>
                        <span>Selecione um endereço no mapa</span>
                    </legend>
                    <Map center={initialPosition} zoom={15} onClick={handleSelectPosition}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} ></Marker>
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado(UF)</label>
                            <select 
                                name="uf" 
                                id="uf" 
                                value={ufSelected}
                                onChange={handleSelectUF}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf=>(
                                    <option key={uf} value={uf}>{uf}</option>                                    
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                name="city" 
                                id="city"
                                value={citySelected}
                                onChange={handleSelectCity}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city=>(
                                    <option key={city} value={city}>{city}</option>                                    
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item=>(
                             <li 
                                key={item.id} 
                                onClick={()=>handleSelectdItems(item.id)}
                                className={selectedItems.includes(item.id)?"selected":""}
                            >
                                <img src={item.image_url} alt="lâmpadas"/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    );
};

export default CreatePoint;
