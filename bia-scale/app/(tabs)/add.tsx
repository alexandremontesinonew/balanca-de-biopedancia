import { useEffect } from "react";
import { useRouter } from "expo-router";

// Esta tab existe apenas como placeholder para o FAB central.
// O FAB usa um botão customizado que abre o BottomSheet na tela Home.
export default function AddTab() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/(tabs)/");
  }, []);
  return null;
}
