import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import VendasScreen from "./src/screens/VendasScreen";
import RelatoriosScreen from "./src/screens/RelatoriosScreen"; // Adicione esta linha
import ProdutosScreen from "./src/screens/ProdutosScreen"; // Adicione esta linha

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Vendas" component={VendasScreen} />
        <Stack.Screen name="Relatorios" component={RelatoriosScreen} />
        <Stack.Screen name="Produtos" component={ProdutosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
