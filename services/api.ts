const data = [
  {
    name: "Ultra Aprendizado",
    price: "R$ 23,90",
    code: "9786555110050",
    image:
      "https://images-na.ssl-images-amazon.com/images/I/41+NFJVQcBL._SX335_BO1,204,203,200_.jpg",
  },
  {
    name: "Código Limpo",
    price: "R$ 75,90",
    code: "9788576082675",
    image: "https://images-na.ssl-images-amazon.com/images/I/71dH97FwGbL.jpg",
  },
];

export interface IProduct {
  name: string;
  price: string;
  code: string;
  image: string;
}

export function findProductByCode(code: string) {
  return data.find((product) => product.code === code);
}
