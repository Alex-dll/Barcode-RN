import { BarCodeScanner } from "expo-barcode-scanner";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { findProductByCode, IProduct } from "./services/api";

async function askForPermission() {
  const { status } = await BarCodeScanner.requestPermissionsAsync();

  return status === "granted";
}

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [product, setProduct] = useState<IProduct | null | undefined>(null);

  useEffect(() => {
    askForPermission().then(setHasPermission);
  }, []);

  function onBarCodeScanner(payload: { data: string }) {
    // com o código de barras, podemos consultar a nossa API
    const product = findProductByCode(payload.data);
    setProduct(product);
    setScanning(false);
    // após o retorna da API, podemos salvar o produto em um state
  }

  if (hasPermission === null) {
    return <Text>Requisitando permissão....</Text>;
  }

  if (hasPermission === false) {
    return <Text>Sem acesso a camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Easy Barcode Scanner</Text>
      <Text style={styles.subtitle}>
        Encontre o preço dos itens que você precisa
      </Text>

      {product === undefined && (
        <Text style={styles.subtitle}>Produto não encontrado :(</Text>
      )}

      {product && (
        <View style={styles.productContainer}>
          <Text style={styles.productPrice}>{product?.price}</Text>
          <Text style={styles.productName}>{product?.name}</Text>

          <View style={styles.productImageContainer}>
            <Image
              style={styles.productImage}
              source={{
                uri: product?.image,
              }}
            />
          </View>
        </View>
      )}

      {scanning && (
        <BarCodeScanner
          onBarCodeScanned={onBarCodeScanner}
          style={{
            height: 300,
            width: "100%",
          }}
        />
      )}

      <TouchableOpacity style={styles.button}>
        <Text
          style={styles.buttonText}
          onPress={() => {
            setScanning((prev) => !prev);
            setProduct(null);
          }}
        >
          {scanning ? "Cancelar" : "Consultar Preço"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2CA58D",
    alignItems: "center",
    justifyContent: "space-around",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 40,
    color: "#fff",
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  button: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: "#0A2342",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  productContainer: {
    flex: 1,
    alignItems: "center",
  },
  productPrice: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#0A2342",
  },
  productName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0A2342",
  },
  productImageContainer: {
    marginVertical: 30,
    width: 350,
    height: 350,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
