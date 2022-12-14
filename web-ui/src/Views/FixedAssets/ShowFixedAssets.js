/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import ErrorPage from '../../Components/ErrorPage'
import {getFixedAssets} from '../../Components/GetFromApi'
import getFromApi from '../../Components/GetFromApi'
import Navbar from '../../Components/NavBar'
import ListContainer from "../../Components/ListContainer"
import ListBasic from '../../Components/ListBasic'
import ListWithSubheader from '../../Components/ListWithSubheader'
import ButtonPrimary from '../../Components/MUI-Button';    
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import SearchBar from '../../Components/SearchBar';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ShowFixedAssets() {
    const [open, setOpen] = useState(null);
    const [fixedAssets, setFixedAssets] = useState()
    const [searchResult, setSearchResults] = useState ([])
    const [hasErrorWithFetch, setHasErrorWithFetch] = useState(null)


    const location = useLocation()
    const navigate = useNavigate();

    const completeInfoFixedAsset = '/activos-fijos'
    const url = 'https://ncv-api.herokuapp.com/api/fixedAssets/'
    const urlCategories = 'https://ncv-api.herokuapp.com/api/assetCategories?showAssets=true'
    let showAlert = location.state ? location.state.showAlert : false
    let alertMessage = location.state ? location.state.alertMessage : null
    const { apiData: assetCategories, errors } = getFromApi(urlCategories)
    const headerIndices = [];
    const getHeaderName = (i) => {
        switch (i) {
            case 1:
                return 'Equipos y herramientas';
            case 2:
                return 'Muebles y enseres';
            case 3:
                return 'Maquinaria';
            case 4:
                return 'Herramientas';
        }
    }
    function ordenCriteria(posts) {
        posts = posts.sort((a, b) => { return a.name.toLowerCase().localeCompare(b.name.toLowerCase())});
        return posts;
    }

    function searchCriteria (e, posts) {
        if (!e.target.value) return posts
        const resultsArray = posts.filter(post => post.name.toLowerCase().includes(e.target.value.toLowerCase()))
        return resultsArray;
    }

    useEffect(()=>{
        getFixedAssets(url).then(
            response => {
                if(response.name != "AxiosError"){
                    setFixedAssets(response.data)
                    setSearchResults(response.data)
                    return response
                }
                setHasErrorWithFetch(response)
            }
        )
        setOpen(showAlert)
    },[])

    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return
        }
        setOpen(false)
    }

    if (hasErrorWithFetch != null){
        return ErrorPage(hasErrorWithFetch)
    } 
    if (!fixedAssets || !assetCategories) return null
    const searcher = <SearchBar posts={fixedAssets} setSearchResults={setSearchResults} orderCriteria={ordenCriteria} searchCriteria={searchCriteria} />
    if (fixedAssets.length>0 && assetCategories.length>0){
        const listCategories = assetCategories.map((el)=>{
            return {
                id:el.id, 
                title:`${el.category}`,
                description:``,
            }
        })
        const listElements = searchResult.map((el)=>{
            console.log(el);
            return {
                id:el.id, 
                title: el.code ? `${el.name} #${el.code}` : `${el.name}`,
                description:`Programa: ${el.programHouseAcronym!=null&&el.programHouseAcronym!=""&&el.programHouseAcronym!=undefined?el.programHouseAcronym:"*Sin programa*"}`,                 
                elementUrl:`${completeInfoFixedAsset}/${el.id}`,
                imgSrc:`https://st.depositphotos.com/1005574/2080/v/450/depositphotos_20808761-stock-illustration-laptop.jpg`,
                categoryId: el.assetCategoryId
            }
        })
        let assetCategoriesComponent = <ListWithSubheader itemsHeader={listCategories} itemsSubheader={listElements} withImage={false} />
        let nexFixedAsset = "/crear-activo-fijo"
        const listHeaderComponents = <ButtonPrimary label={"Crear activo fijo"} onClick={()=>navigate(nexFixedAsset)}/>
        return (
            <>
                <Navbar /><Box sx={{ display: 'flex', justifyContent: 'center' , marginTop:'15vh'}}>
                    <ListContainer title="Lista de activos fijos" header={listHeaderComponents}>
                        {searcher}
                        {assetCategoriesComponent}
                    </ListContainer>
                </Box>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        {alertMessage}
                    </Alert>
                </Snackbar>
            </>
        )
    }
}