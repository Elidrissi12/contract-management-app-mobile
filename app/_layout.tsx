import "../global.css";

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { AppProvider, useAppContext } from "@/context/AppContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

type RoutePath = "/" | "/contracts" | "/clients" | "/assistant" | "/settings";

function CustomDrawerContent() {
  const router = useRouter();

  const items: { label: string; path: RoutePath }[] = [
    { label: "Dashboard / Accueil", path: "/" },
    { label: "Contrats", path: "/contracts" },
    { label: "Clients", path: "/clients" },
    { label: "ChatBot", path: "/assistant" },
    { label: "Paramètres", path: "/settings" },
  ];

  return (
    <DrawerContentScrollView>
      <View style={{ paddingVertical: 24 }}>
        {items.map((item) => (
          <Pressable
            key={item.path}
            onPress={() => router.push(item.path)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Text style={{ fontSize: 15, color: "#e5e7eb" }}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </DrawerContentScrollView>
  );
}

function RootNavigation() {
  const { colorScheme } = useAppContext();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Drawer
        screenOptions={{
          headerShown: true,
        }}
        drawerContent={() => <CustomDrawerContent />}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            title: "Dashboard / Accueil",
          }}
        />
      </Drawer>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootNavigation />
    </AppProvider>
  );
}

