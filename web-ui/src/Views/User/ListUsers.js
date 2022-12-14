import ErrorPage from '../../Components/ErrorPage'
import getFromApi from '../../Components/GetFromApi'
import Alert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';
import Box from '@mui/material/Box';
import ListContainer from "../../Components/ListContainer";
import Navbar from '../../Components/NavBar';
import ButtonPrimary from '../../Components/MUI-Button';
import ListBasic from '../../Components/ListBasic';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'

function TranslateRole(nameRole){
    var answer=""
    switch (nameRole) {
        case "AuntUser":
            answer="Tia"
            break;
        case "AdminUser":
            answer="Administrador"
            break;
        case "Cordinator":
            answer="Cordinador"
        case "Soporte":
            answer="Soporte"
            break;
        default:
            answer="Rol No definido"
            //answer="----"
            break;
    }
    return answer
}

function ListUsers() {
    const url="https://ncv-api.herokuapp.com/api/auth";
    const { apiData:users, error } = getFromApi(url)

    const location = useLocation()
    
    let showAlert = location.state ? location.state.showAlert : false 
    let alertMessage = location.state ? location.state.alertMessage : null 
    const [open, setOpen] = useState(showAlert);

    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return
        }
        setOpen(false)
    }

   // const location = useLocation()
    const completeInfoUser= "/vista-usuarios"
 

    const navigate = useNavigate()
    if(error){
        return ErrorPage(error)
    }
    if (!users) return null
    if (users.length>0){
        const listElements = users.map((el) => {
            return {
                id:el.id, 
                title: `${el.firstName} ${el.lastName}`,
                description: `${el.email} - ${el.cellPhone} - ${TranslateRole(el.nameRole)}`,
                elementUrl:`${completeInfoUser}/${el.id}`,
            };
        })
    
        let usersComponents = <ListBasic items={listElements} withImage={false}/>
        let registerUser = "/registrarse-ncv"
        let listHeaderComponents = <ButtonPrimary label={"Registrar Usuario"} onClick={()=>navigate(registerUser)}/>
        return ( 
            <>
                <Navbar /><Box sx={{ display: 'flex', justifyContent: 'center' , marginTop:'15vh'}}>
                    <ListContainer title="Lista de usuarios" header={listHeaderComponents}>
                        {usersComponents}
                    </ListContainer>
                </Box>
                
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    {alertMessage}
                </Alert>
        </Snackbar>
            </>
        );
    }
}
export default ListUsers