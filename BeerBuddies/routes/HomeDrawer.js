import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeDrawer from '../pages/Home';
import AboutDrawer from '../pages/About';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (


    <Drawer.Navigator>

      <Drawer.Screen
        name="Home"
        component={HomeDrawer}
      />

      <Drawer.Screen
        name="Sobre"
        component={AboutDrawer}
      />

    </Drawer.Navigator>


  );
}

export default MyDrawer;