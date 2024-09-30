import { useEffect, useState } from "react";
import { View, FlatList, Button, Alert } from "react-native";
import { router } from "expo-router"; 

import { Input } from "@/components/Input";
import { Product } from "@/components/Product";

import { ProductDatabase, useProductDatabase } from "@/database/useProductDatabase";


export default function Index(){
    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [quantity, setQuantity] = useState("")
    const [search, setSearch] = useState("")
    const [products, setProducts] = useState<ProductDatabase[]>([])

    const productDatabase = useProductDatabase()

    async function create(){
        try{
            if (isNaN(Number(quantity))) {
                return Alert.alert("Quantidade", "A quantidade precisa ser um número!")
            }
            
            const response = await productDatabase.create({
                name,
                quantity: Number(quantity),
            })

            Alert.alert("Produto cadastrado com o ID: " + response.insertedRowID)

        } catch (error) {
            console.log(error)
        }
        
    }

    async function list() {
        try {
            const response = await productDatabase.searchByName(search)
            setProducts(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        list()
    }, [search])

    function details(item: ProductDatabase){
        setId(String(item.id))
         setName(item.name)
         setQuantity(String(item.quantity))
    }

    async function update(){
        try{
            if (isNaN(Number(quantity))) {
                return Alert.alert("Quantidade", "A quantidade precisa ser um número!")
            }
            
            await productDatabase.update({
                id: Number(id),
                name,
                quantity: Number(quantity),
            })

            Alert.alert("Produto atualizado")

        } catch (error) {
            console.log(error)
        }
    }

    async function handleSave(){
        if (id) {
            update()
        } else {
            create()
        }

        setId("")
        setName("")
        setQuantity("")
        await list()

    }
    
    async function remove(id: number){
        try {
            const response = await productDatabase.remove(id)
            
            setId("")
            setName("")
            setQuantity("")
            await list()
            
        } catch (error){
            throw error
        }
    }

    return (
        <View 
            style={{
                 flex: 1, justifyContent: "center",
                 padding: 32,
                 gap: 16
            }}>

            <Input placeholder="Nome" onChangeText={setName} value={name}/>

            <Input placeholder="Quantidade"  onChangeText={setQuantity} value={quantity}/>

            <Button title="Salvar" onPress={handleSave}/>

            <Input placeholder="Pesquisar"  onChangeText={setSearch}/>

            <FlatList
                data = {products}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => 
                    <Product 
                            onPress={() => details(item)} 
                            data={item} 
                            onOpen={() => router.navigate("/details/" + item.id)} 
                            onDelete={() => remove(item.id)
                        }
                    />}
                contentContainerStyle={{gap: 16}}
            />
        </View>
    )
}
