import { DisabledByDefault, Done } from "@mui/icons-material";
import { Avatar, Chip, Link, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Config from "../../api/Config";
import CustomNoDataOverlay from "../../components/gridComponents/CustomNoDataOverlay";
import {useSnackbar} from "./Admin"

const Doctors = () => {
    const {setSnackbar} = useSnackbar();
    const [data,setData] = useState({loading:true,row:[]})

    useEffect(()=>{
        axios.get(Config.ADMIN_URL+"/doctors",Config.getAuthHeaders())
        .then(({data})=>{
            const mappedData = data.map(element=>{
                return {
                    id:element.user.id,
                    docRoles:element.docRoles.join(),
                    avatar: element.user.email,
                    name:element.user.firstname+" "+element.user.middlename,
                    specialization:element.specialization,
                    homedoctor:element.homedoctor||false,
                    disabled:element.user.disabled,
                }
            })
            setData({loading:false,row:mappedData});
        })
        .catch(error=>{
            setSnackbar({open:true,children:"could't load data from the server: "+error.message,severity:"error"});
            setData({row:[],loading:false});
        })
    },[]);
    
    const handleAccountStatus = (row) => {
        setData({...data,loading:true});
            axios.put(Config.ADMIN_URL+`/user/${row.id}?disabled=${!row.disabled}`,null,Config.getAuthHeaders())
            .then(()=>{
                const newDate = data.row.map(e=>{
                    if(e.id===row.id)
                    return {...e,disabled:!row.disabled};
                    return e;
                });
                setData({loading:false,row:newDate})
                setSnackbar({open:true,children:`Account has been ${row.disabled?"enabled":"disabled"} successfully`});
            })
            .catch(error=>{
                setData({...data,loading:false})
                setSnackbar({open:true,children:"error changing use account: "+error.message,severity:"error"})
            })
    }

    const column = [
        {
            field:"avatar",
            headerName:"Avatar",
            width:100,
            renderCell:({value})=>{
                return <Avatar sx={{width:'70px',height:'70px'}} src={`${Config.USER_URL}/avatar/${value}`}/>
            }
        },
        {
            field:"name",
            flex:1,
            headerName:"Name",
        },
        {
            field:"specialization",
            flex:1,
            headerName:"specialization",
        },
        {
            field:"docRoles",
            flex:0.5,
            headerName:"Roles",
        },
        {
            field:"homedoctor",
            headerName:"Home Doctor",
            type:"boolean",
        },
        {
            field:"disabled",
            headerName:"Activated",
            flex:1,
            type:"boolean",
            renderCell:({value})=>{
                return value?<Chip icon={<DisabledByDefault/>} color={"error"} label="Disabled"/>:
                <Chip icon={<Done color="success"/>} color={"success"} label="Activated"/>
            }
        },
        {
            field:"actions",
            type:"actions",
            getActions:({row})=>{
                return [
                    <GridActionsCellItem
                        label="View Profile"
                        showInMenu
                        />,
                    <GridActionsCellItem
                        label={row.disabled?"Enable Account":"Disable Account"}
                        showInMenu
                        icon={row.disabled?<Done color="success"/>:<DisabledByDefault/>}
                        onClick={()=>handleAccountStatus(row)}
                    />
                ]
            }
        }
    ]

    return (<>
    <br/>
    <Typography variant="h4" color="primary">Doctors</Typography>
    <br/>
    <div style={{height:"500px",width:"100%"}}>
        <DataGrid
            loading={data.loading}
            rows={data.row}
            columns={column}
            hideFooter
            rowHeight={100}
            components={
                { NoRowsOverlay:CustomNoDataOverlay }
            }
        />
    </div>
    </>)
}
export default Doctors;