# 🚀 Início do projeto

O projeto **WaiterApp** é uma aplicação voltada para gerenciar pedidos de um restaurante, com foco na usabilidade para garçons e administradores. Ele foi desenvolvido com autenticação JWT e divide funcionalidades entre dois tipos de usuários: **waiter (garçom)** e **admin (administrador)**. A seguir, está uma descrição detalhada de cada etapa e funcionalidade do projeto:

---

## 🔖 Descrição Geral

O **WaiterApp** é uma solução que facilita o fluxo de trabalho dos garçons, desde o registro no sistema até o gerenciamento de mesas e pedidos. Além disso, permite que administradores acessem os pedidos realizados em uma interface separada. O projeto utiliza autenticação JWT para segurança e controle de acesso às rotas privadas.

---

## 💡 Funcionalidades

### **Para o Garçom (Waiter):**

- Registro e login para acessar o sistema.
    
- Gerenciamento de mesas com identificação por número.
    
- Visualização de produtos disponíveis com preços.
    
- Adição de produtos ao pedido com cálculo automático do total.
    
- Envio de pedidos ao sistema para processamento.
    

### **Para o Administrador (Admin):**

- Visualização dos pedidos enviados pelos garçons.
    
- Alteração de status de pedidos (como "preparando", "concluído").
    
- Gerenciamento de usuários (alterar papéis entre waiter e admin).
    

---

## 🔖 Fluxo de Usuário

### **1\. Registro e Login**

- O primeiro passo é o registro do usuário no servidor.
    
- Ao criar uma conta, o usuário é automaticamente configurado como **waiter** (garçom).
    
- Após o registro, o usuário pode acessar o sistema através do formulário de login, onde deve inserir o email e senha cadastrados.
    
- Se as credenciais estiverem corretas, um **token JWT** é gerado e armazenado localmente. Em seguida, o usuário é redirecionado para uma página privada.
    

**Exemplo de Requisição (JSON):**

``` json
{
    "email": "johndoe@example.com",
    "password": "password123"
}

 ```

<img src="https://i.pinimg.com/736x/65/c7/53/65c753a6aef3b9814649e00bc6bc402a.jpg" alt="Página de Login" width="100%">

<img src="https://i.pinimg.com/736x/2b/2d/9e/2b2d9e0dc839f7dcaef8df9d42690e26.jpg" width="100%">

<img src="https://i.pinimg.com/736x/ca/6a/48/ca6a48b8b14bc8ce8ea77c8cce40eb66.jpg" alt="Após%20logar%20essa%20página%20aparecerá.%20Ela%20contém%20o%20email%20do%20usuário%20e%20um%20botão%20de%20deslogar%20no%20cabeçalho.%20Temos%20um%20formulário%20para%20digitar%20e%20enviar%20o%20número%20da%20mesa." width="100%">

## 🪑 Fluxo da Mesa

- O Usuário irá digitar a mesa na qual ele irá fazer o pedido e enviará para o servidor, por isso, antes do pedido deve-se criar a mesa.
    

``` json
{
    "number": 15
}

 ```

<img src="https://i.pinimg.com/736x/d2/c1/ab/d2c1ab31319b575d94e42cf467503738.jpg" alt="Quando%20o%20campo%20é%20digitado%20ele%20envia%20essa%20informação%20para%20o%20Banco%20de%20Dados,%20onde%20teremos%20essa%20informação%20guardada,%20e%20mesmo%20eu%20recarregando%20a%20página%20ela%20ainda%20aparecerá." width="100%">

## ♨️ Fluxo do Pedido

#### **Passo 1: Requisitos para fazer o Pedido**

- tableId: Identificador único da mesa associada ao pedido. Ele é usado para vincular o pedido a uma mesa específica no sistema.
    
- userId: Identificador único do usuário (garçom) que está realizando o pedido. Ele é usado para obter os detalhes do garçom responsável pelo pedido.
    
- items: Dentro do items tem um array com vários objetos onde o `productId` é o _id do produto e a `quantity` que é a quantidade do produto.
    

``` json
{
    "tableId": "64afbe2c...",
    "userId": "64ac12f3...",
    "items": [
        {
            "productId": "64bfa2d1...",
            "quantity": 2
        },
        {
            "productId": "64bfa3e5...",
            "quantity": 1
        }
    ]
}

 ```

<img src="https://i.pinimg.com/736x/34/1b/46/341b4699bd41a3a9db184307366bedb4.jpg" width="100%">

<img src="https://i.pinimg.com/736x/94/3c/cb/943ccb2912fa9ab7e75df01fe28ba88b.jpg" width="100%">

<img src="https://i.pinimg.com/736x/1a/19/44/1a1944c30b5bc6eafa3481acee88065b.jpg" width="100%">
