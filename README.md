# ⚖ Calculadora de IMC — PWA

Calculadora de **Índice de Massa Corporal** moderna, responsiva, acessível e instalável como aplicativo (PWA). O cálculo acontece inteiramente no navegador e funciona offline. Depois do cálculo, o app mostra **informações educativas de fontes confiáveis** (Ministério da Saúde, OMS, SBEM, ABESO, universidades) sobre a faixa de IMC obtida — sempre com link para a fonte original.

> As informações têm finalidade educativa e não substituem avaliação médica ou nutricional.

## Funcionalidades

- Cálculo do IMC com validação no formulário (peso, altura em cm ou m, idade e sexo opcionais)
- Classificação para adultos, indicador visual animado e faixa de peso correspondente ao IMC de 18,5 a 24,9
- Aviso para menores de 18 anos (a tabela de adultos não é aplicada)
- Informações educativas por faixa, com fontes filtradas e links originais
- Histórico dos últimos 10 cálculos salvo só no dispositivo (`localStorage`)
- Tema claro/escuro (respeita o sistema e salva a preferência)
- PWA: instalação, modo standalone, cache e funcionamento offline
- Formatação brasileira (`26,12`, `80,5 kg`, `27/09/2026`)

## Tecnologias

```text
React 19
TypeScript
Vite
PWA (vite-plugin-pwa / Workbox)
CSS moderno (custom properties, sem framework)
Lucide Icons
Vercel (hospedagem + Serverless Function)
```

## Estrutura

```text
imc-pwa/
├── api/information.ts        # Serverless Function da Vercel (POST /api/information)
├── public/                   # favicon, ícones PWA, imagem Open Graph
├── src/
│   ├── components/           # Header, IMCCalculator, IMCResult, IMCIndicator, History...
│   ├── data/                 # fontes curadas, domínios confiáveis, conteúdo educativo
│   ├── hooks/                # tema, status online, instalação PWA
│   ├── services/             # informationService (chamada à API)
│   ├── types/                # tipos TypeScript
│   ├── utils/                # cálculo, validação, formatação, localStorage
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts            # inclui o manifest e o Service Worker
└── vercel.json
```

> O `manifest.webmanifest` é gerado automaticamente pelo `vite-plugin-pwa` no build (configurado em `vite.config.ts`), por isso não fica em `public/`.

## Instalação

Requer Node.js 20 ou superior.

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Em `npm run dev` a rota `/api` não existe — o app detecta isso e usa automaticamente a seleção curada de fontes oficiais. Para rodar também a função serverless localmente, use a CLI da Vercel:

```bash
npm i -g vercel
vercel dev
```

## Build

```bash
npm run build
```

Executa a verificação de tipos (frontend e API) e gera a pasta `dist`.

## Preview

```bash
npm run preview
```

Use o preview para testar o PWA (Service Worker, instalação e modo offline), que não fica ativo em `npm run dev`.

## Pesquisa de informações online

O frontend envia **apenas a categoria** do resultado:

```json
{ "category": "sobrepeso" }
```

Peso, altura, idade e sexo nunca saem do dispositivo.

A função `api/information.ts`:

1. valida a categoria;
2. se a variável `INFORMATION_API_KEY` estiver configurada, pesquisa na web pela [Brave Search API](https://brave.com/search/api/);
3. mantém somente resultados HTTPS de domínios confiáveis (lista em `src/data/sources.ts`) e descarta conteúdo promocional;
4. completa a lista com a seleção curada de publicações oficiais;
5. sem chave ou em caso de falha, responde apenas com a seleção curada.

A resposta fica em cache na CDN da Vercel por 12 horas por categoria.

### Variáveis de ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `INFORMATION_API_KEY` | Não | Chave da Brave Search API. Sem ela, o app usa as fontes curadas. |

Localmente, copie `.env.example` para `.env.local`. **Nunca** coloque chaves no código React nem envie `.env` ao GitHub (já está no `.gitignore`).

## Deploy na Vercel

1. Crie um repositório no GitHub.
2. Faça o push do projeto:
   ```bash
   git init
   git add .
   git commit -m "Calculadora de IMC PWA"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/imc-pwa.git
   git push -u origin main
   ```
3. Na Vercel, clique em **Add New → Project** e importe o repositório.
4. Confira as configurações (já definidas no `vercel.json`):
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Opcional: em **Settings → Environment Variables**, adicione `INFORMATION_API_KEY`.
6. Clique em **Deploy**.

A pasta `api/` é publicada automaticamente como Serverless Function.

## Instalar o aplicativo (PWA)

**Android (Chrome):** abra o site e toque em **Instalar aplicativo** no banner, ou no menu ⋮ → **Instalar app**.

**iPhone (Safari):** toque em **Compartilhar** → **Adicionar à Tela de Início** → **Adicionar**.

**Windows (Chrome ou Edge):** clique no ícone de instalação na barra de endereço, ou no menu → **Aplicativos → Instalar este site como aplicativo**.

**Navegador desktop (macOS/Linux):** no Chrome, ícone de instalação na barra de endereço; no Safari (macOS Sonoma ou superior), **Arquivo → Adicionar ao Dock**.

Depois de instalado, o app abre em janela própria e calcula o IMC mesmo sem internet.

## Privacidade

Os dados são processados localmente no dispositivo. O histórico fica no `localStorage` do navegador e pode ser apagado a qualquer momento em **Limpar histórico**. Nenhuma informação pessoal é enviada ou armazenada em servidor.

## Aviso

O IMC é um indicador geral: não mede diretamente a gordura corporal, não diferencia completamente massa muscular de gordura e não avalia a distribuição de gordura. O sistema não diagnostica nem prescreve tratamentos.
