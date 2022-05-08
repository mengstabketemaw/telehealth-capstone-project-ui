import * as React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import {useLocation,NavLink} from "react-router-dom"
import Topbar from "../../components/Topbar"
import { Box, Divider, Drawer, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import { AccountBox, DocumentScanner, Feedback, Help, PieChart, Settings, } from '@mui/icons-material';

const drawerWidth = 240;

const SnackBarContext = React.createContext();
export const useSnackbar = ()=>React.useContext(SnackBarContext);

function Admin() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [snackbar,setSnackbar] = React.useState({open:false,severity:"error",children:"this is error"});
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar handleDrawerToggle={handleDrawerToggle}/>
      <NavigationDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}/>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <SnackBarContext.Provider value={{setSnackbar}}>
          <Outlet/>
        </SnackBarContext.Provider>
        <Snackbar
          open={snackbar.open}
          onClose={e=>setSnackbar({...snackbar,open:false})}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={e=>setSnackbar({...snackbar,open:false})}/>
        </Snackbar>
      </Box>
    </Box>
  );
}

const NavigationDrawer = ({mobileOpen,handleDrawerToggle}) =>{
  
  return (<>
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <DrawerTools/>
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        <DrawerTools/>
      </Drawer>
    </Box>
  
  </>)
}

function DrawerTools(){
  const {pathname} = useLocation();
  return (<>
  <Toolbar>
      <Typography>HealthCare</Typography>
    </Toolbar>
    <Divider />
  {
      ["Dashboard","Doctors","Help Applications","Feedback"].map((name,index)=>{

          let urlname = name.toLocaleLowerCase().replace(" ","").replaceAll(".","");
          let color = pathname.includes(urlname)?"primary":"";

          return (
          <NavLink key={index} to={urlname} style={{color:"inherit",textDecoration:"none", display:"flex"}}>
            <ListItem button >
                <ListItemIcon>
                    {
                        name==="Dashboard"?<PieChart color = {color}/>:
                        name==="Doctors"?<DocumentScanner color = {color}/>:
                        name==="Feedback"?<Feedback color = {color}/>:
                        <Help color = {color}/>
                    }
                </ListItemIcon>
                <ListItemText>
                        <Typography color={color}>{name}</Typography>
                </ListItemText>
            </ListItem>
         </NavLink>
          )
      })
  }

    <Divider />
    
    {
      ["Profile","Setting"].map((name,index)=>{
        let urlname = name.toLocaleLowerCase().replaceAll(" ","").replaceAll(".","");
        let color = pathname.includes(urlname)?"primary":"";
          return (
          <NavLink key={index} to={urlname} style={{color:"inherit",textDecoration:"none", display:"flex"}}>
          <ListItem button>
              <ListItemIcon>
                  {
                      name==="Profile"?<AccountBox color = {color}/>:
                      <Settings color = {color}/>
                  }
              </ListItemIcon>
              <ListItemText>
                <Typography color={color}>{name}</Typography>
              </ListItemText>
          </ListItem>
          </NavLink>
          )
      })
  }
  
  </>)
}
export default Admin;