import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import VendasScreen from "../screens/VendasScreen";
import RelatoriosScreen from "../screens/RelatoriosScreen"; 
import ProdutosScreen from "../screens/ProdutosScreen";


const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Vendas" component={VendasScreen} /> {/* 👈 adiciona aqui */}
    </Stack.Navigator>
  );
}

<Stack.Navigator initialRouteName="Login">
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Dashboard" component={DashboardScreen} />
  <Stack.Screen name="Vendas" component={VendasScreen} />
  <Stack.Screen name="Relatorios" component={RelatoriosScreen} />
  <Stack.Screen name="Produtos" component={ProdutosScreen} />
</Stack.Navigator>


export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
