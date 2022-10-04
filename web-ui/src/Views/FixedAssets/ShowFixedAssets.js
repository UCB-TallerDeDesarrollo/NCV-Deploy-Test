/* eslint-disable react/jsx-key */
import React, { useState } from 'react'
import axios from 'axios'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import ErrorPage from '../../Components/ErrorPage'
import getFromApi from '../../Components/GetFromApi'
import Navbar from '../../Components/NavBar'

export default function ShowFixedAssets() {
    const navigate = useNavigate()
    const completeInfoFixedAsset = '/activos-fijos/'
    const createFixedAssetRoute = '/crear-activo-fijo'
    
    const [url, setSomeUrl] = useState('https://ncv-api.herokuapp.com/api/fixedAssets')
    const { apiData:fixedAssets, error } = getFromApi(url)

    if(error){
        return ErrorPage(error)
    }
    if (!fixedAssets) return null
    return (
        <><Navbar /><div style={{ marginTop: '10vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    ></IconButton>
                </Toolbar>
            </AppBar>
            <div style={{ marginLeft: '7%' }}>
                <div>
                    <h1>ACTIVOS FIJOS</h1>
                    <Button
                        variant="outlined"
                        onClick={(e) => navigate(createFixedAssetRoute)}
                    >
                        Agregar Activo Fijo
                    </Button>
                </div>
                {fixedAssets.map((asset) => {
                    return (
                        <Grid
                            id="lista-activos-fijos"
                            class="activos-fijos"
                            style={{ minHeight: '60vh' }}
                        >
                            <Card sx={{ p: 10, maxWidth: 1300, minWidth: 275 }} key={asset.id}>
                                <Box sx={{ display: 'flex' }}>
                                    <CardHeader id="Name" title={asset.name} />
                                </Box>
                                <Box sx={{ display: 'inline-block' }}>
                                    <CardMedia
                                        component="img"
                                        image="https://st.depositphotos.com/1005574/2080/v/450/depositphotos_20808761-stock-illustration-laptop.jpg"
                                        sx={{ width: 400 }}
                                    ></CardMedia>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'inline-block',
                                        position: 'absolute',
                                        right: '30%'
                                    }}
                                >
                                    <CardContent>
                                        <h4>
                                            Descripción: {asset.description}{' '}
                                        </h4>
                                        <h4>
                                            Fecha de entrada: {asset.entryDate!=null? asset.entryDate.split('T')[0]:null}
                                        </h4>
                                        <h4>Precio: {asset.price} </h4>
                                        <br></br>
                                        <Button
                                            variant="outlined"
                                            onClick={(e) => navigate(
                                                completeInfoFixedAsset +
                                                asset.id
                                            )}
                                        >
                                            Ver más
                                        </Button>
                                    </CardContent>
                                </Box>
                            </Card>
                        </Grid>
                    )
                })}
            </div>
        </div></>
    )
}
