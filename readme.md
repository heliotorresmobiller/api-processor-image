# Processor Image API

Este projeto é uma API de processamento de imagens construída com **Node.js**, **Express**, **TypeScript**, e **Sharp**. A API busca imagens armazenadas em um **bucket AWS S3**, aplica transformações conforme os parâmetros informados e retorna as imagens otimizadas. As imagens processadas são armazenadas em cache no **Redis** para melhorar o desempenho.

## Funcionalidades

- **Redimensionamento**: Defina a largura e/ou altura da imagem.
- **Mudança de formato**: Suporte para JPEG, PNG e WEBP.
- **Controle de qualidade**: Ajuste a qualidade da imagem (1-100).
- **Grayscale**: Converta a imagem para tons de cinza.
- **Cache**: Imagens processadas são armazenadas no Redis para evitar processamento repetido.

## Tecnologias utilizadas

- **Node.js**: Plataforma de desenvolvimento.
- **Express**: Framework web.
- **TypeScript**: Superconjunto de JavaScript para tipagem estática.
- **AWS S3**: Armazenamento de imagens.
- **Redis**: Cache para imagens processadas.
- **Sharp**: Biblioteca de processamento de imagens.
- **Docker**: Containerização da aplicação.

## Requisitos

Antes de rodar o projeto, você precisará ter:

- **Node.js** instalado (>= 18.x)
- **Redis** em execução (localmente ou em um servidor)
- **Docker** (opcional, se preferir rodar a aplicação em container)
- Uma conta AWS com um bucket S3 configurado
- As credenciais da AWS configuradas em variáveis de ambiente

## Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/heliotorresmobiller/api-processor-image
cd api-processor-image
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:

```env
AWS_ACCESS_KEY_ID=seu-access-key
AWS_SECRET_ACCESS_KEY=sua-secret-key
AWS_REGION=regiao-do-bucket
S3_BUCKET_NAME=nome-do-bucket
REDIS_URL=redis://redis:6379
```

- `PORT`: Porta na qual a aplicação irá rodar (padrão: 3000).
- `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY`: Credenciais de acesso da AWS.
- `AWS_REGION`: Região do bucket S3.
- `S3_BUCKET_NAME`: Nome do bucket S3 onde as imagens estão armazenadas.
- `REDIS_URL`: URL de conexão ao servidor Redis.

### 4. Rodando a aplicação

#### Rodando localmente

Para rodar a aplicação localmente, execute:

```bash
npm run dev
```

#### Rodando com Docker

Se preferir rodar a aplicação em um container Docker, primeiro, construa a imagem:

```bash
docker build -t api-processor-image .
```

E depois, suba o container com Redis usando **docker-compose**:

```bash
docker-compose up
```

### 5. Acessando a API

A aplicação estará disponível em `http://localhost:3000`. Para acessar uma imagem, utilize o seguinte formato de URL:

```
http://localhost:3000/pictures/:key?w={width}&h={height}&fm={format}&q={quality}&gray={0 or 1}
```

#### Exemplos de uso:

1. **Imagem original** (somente otimizada):
   ```bash
   http://localhost:3000/pictures/clovis.png
   ```

2. **Imagem redimensionada (largura = 200, altura = 200)**:
   ```bash
   http://localhost:3000/pictures/clovis.png?w=200&h=200
   ```

3. **Imagem no formato WEBP, qualidade 75**:
   ```bash
   http://localhost:3000/pictures/clovis.png?fm=webp&q=75
   ```

4. **Imagem em tons de cinza**:
   ```bash
   http://localhost:3000/pictures/clovis.png?gray=1
   ```

### Parâmetros suportados:

- **w**: Largura da imagem.
- **h**: Altura da imagem.
- **fm**: Formato da imagem (`jpeg`, `png`, `webp`).
- **q**: Qualidade da imagem (1 a 100, padrão: 85).
- **gray**: Converter para tons de cinza (`1` para sim, `0` para não).

## Estrutura do Projeto

```
/src
  /controllers   # Controladores da API
  /services      # Serviços para integração com AWS S3 e Redis
```

### Principais arquivos:

- **`server.ts`**: Arquivo principal que inicializa o servidor Express.
- **`ImageController.ts`**: Controlador responsável por processar as imagens.
- **`aws.ts`**: Serviço que interage com o AWS S3 para buscar as imagens.
- **`redis.ts`**: Serviço que gerencia o cache de imagens no Redis.
- **`image.ts`**: Serviço que utiliza o Sharp para processar as imagens (redimensionar, mudar formato, aplicar grayscale).

## Considerações de Infraestrutura

Para garantir baixa latência global e escalabilidade:

- **CloudFront**: Utilize **AWS CloudFront** como CDN para cachear e distribuir as imagens para diferentes regiões geográficas, melhorando o tempo de resposta para usuários em locais distantes.
- **Lambda e S3**: Considerar o uso de **AWS Lambda** para processamento sem servidor, combinado com **S3** e **API Gateway** para uma solução totalmente escalável.
- **Monitoramento e alertas**: Configure o monitoramento de métricas de Redis, S3 e o servidor da aplicação para garantir uma operação otimizada.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma **issue** ou enviar um **pull request** para melhorias e correções.