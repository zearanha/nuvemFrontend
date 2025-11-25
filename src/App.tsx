
import { useState, useEffect } from "react";
import api from "./server/api";
import { AxiosError } from "axios";
import {
  Box,
  Stack,
  Heading,
  Button,
  Input,
  Select,
  Text,
  Spinner,
  useToast,
} from "@chakra-ui/react";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  category: string;
};

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const toast = useToast();

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const response = await api.get("/categories");
        console.log("GET /categories ->", response);
        const payload = response.data;
        if (Array.isArray(payload)) {
          setCategories(payload);
        } else if (payload && Array.isArray((payload as { data?: Category[] }).data)) {
          setCategories((payload as { data: Category[] }).data);
        } else if (payload && Array.isArray((payload as { categories?: Category[] }).categories)) {
          setCategories((payload as { categories: Category[] }).categories);
        } else {
          console.warn("GET /categories retornou formato inesperado:", payload);
          setCategories([]);
        }
      } catch (err: unknown) {
        console.error("Erro ao buscar categorias:", err);
        toast({
          title: "Erro ao buscar categorias.",
          description: "Tente novamente mais tarde.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, [toast]);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      console.log("POST /categories payload:", { name: newCategory.trim() });
      const response = await api.post("/categories", { name: newCategory.trim() });
      console.log("POST /categories response:", response);
      setCategories((prev) => [...prev, response.data]);
      setNewCategory("");
      toast({
        title: "Categoria adicionada!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Erro ao adicionar categoria:", err);
      toast({
        title: "Erro ao adicionar categoria.",
        description: "Verifique o console para mais detalhes.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!newProductName.trim() || !newProductCategory) return;
    try {
      const payload = {
        name: newProductName.trim(),
        // enviar id como number — muitos backends esperam um inteiro
        category: Number(newProductCategory),
      };
      console.log("POST /products payload:", payload);
      const response = await api.post("/products", payload);
      console.log("POST /products response:", response);
      setProducts((prev) => [...prev, response.data]);
      setNewProductName("");
      setNewProductCategory("");
      toast({
        title: "Produto adicionado!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err: unknown) {
      console.error("Erro ao adicionar produto:", err);
      // Mostrar detalhes se disponíveis
      const axiosErr = err as AxiosError<unknown> | undefined;
      const status = axiosErr?.response?.status;
      const data = axiosErr?.response?.data;
      toast({
        title: "Erro ao adicionar produto.",
        description: status ? `Status ${status}` : "Verifique o console para mais detalhes.",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
      if (data) console.error("Response data:", data);
    }
  }

  return (
    <Box maxW="600px" mx="auto" py={10} px={4}>
      <Stack spacing={10}>
        <Heading as="h1" size="xl" textAlign="center" color="blue.700">
          Categorias e Produtos
        </Heading>

        {/* Criar Categoria */}
        <Box p={6} borderWidth={1} borderRadius="xl" boxShadow="md" bg="white">
          <Heading as="h2" size="md" mb={4} color="blue.600">
            Criar Categoria
          </Heading>
          <form onSubmit={addCategory}>
            <Stack direction={{ base: "column", sm: "row" }} spacing={4} align="center">
              <Input
                type="text"
                placeholder="Nome da categoria"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                flex={1}
                bg="gray.50"
              />
              <Button colorScheme="blue" type="submit">
                Adicionar
              </Button>
            </Stack>
          </form>
        </Box>

        {/* Exibir Categorias */}
        <Box p={6} borderWidth={1} borderRadius="xl" boxShadow="md" bg="white">
          <Heading as="h2" size="md" mb={4} color="blue.600">
            Categorias
          </Heading>
          {loading ? (
            <Stack align="center" py={4}>
              <Spinner size="lg" color="blue.500" />
              <Text>Carregando categorias...</Text>
            </Stack>
          ) : (
            <Stack as="ul" spacing={2} pl={4}>
              {categories.length === 0 ? (
                <Text>Nenhuma categoria cadastrada.</Text>
              ) : (
                categories.map((cat) => (
                  <Box as="li" key={cat.id} fontWeight="medium" color="gray.700">
                    {cat.name}
                  </Box>
                ))
              )}
            </Stack>
          )}
        </Box>

        {/* Criar Produto */}
        <Box p={6} borderWidth={1} borderRadius="xl" boxShadow="md" bg="white">
          <Heading as="h2" size="md" mb={4} color="green.600">
            Criar Produto
          </Heading>
          <form onSubmit={addProduct}>
            <Stack spacing={4}>
              <Input
                type="text"
                placeholder="Nome do produto"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                bg="gray.50"
              />
              <Select
                placeholder="Selecione uma categoria"
                value={newProductCategory}
                onChange={(e) => setNewProductCategory(e.target.value)}
                bg="gray.50"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
              <Button colorScheme="green" type="submit">
                Adicionar Produto
              </Button>
            </Stack>
          </form>
        </Box>

        {/* Exibir Produtos */}
        <Box p={6} borderWidth={1} borderRadius="xl" boxShadow="md" bg="white">
          <Heading as="h2" size="md" mb={4} color="green.600">
            Produtos
          </Heading>
          <Stack as="ul" spacing={2} pl={4}>
            {products.length === 0 ? (
              <Text>Nenhum produto cadastrado.</Text>
            ) : (
              products.map((prod) => {
                const catName = categories.find((c) => c.id === prod.category)?.name || prod.category;
                return (
                  <Box as="li" key={prod.id} color="gray.700">
                    <Text as="span" fontWeight="semibold">{prod.name}</Text>
                    {" — "}
                    <Text as="span" color="gray.500">{catName}</Text>
                  </Box>
                );
              })
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
