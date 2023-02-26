# Aftermidinight - Layout Boa Vista

O nome Aftermidinight surgiu pois só consigo tocar os projetos pessoais nas madrugadas, quando 
a paz reina no mundo!

O nome Boa Vista é em referência à uma caverna chamada Toca da Boa Vista, localizada em Campo Formoso, Bahia.

A necessidade de produzir um layout veio em virtude de projetos pessoais, sobretudo no que diz respeito ao grupo de Espeleologia que participo: o Espeleo Grupo de Brasília (EGB).

_________________

## Estrutura de diretórios
- dist (versão compilada)
    - assets
        - css
        - fonts
        - img
        - js
        - libs (vendors - scripts de outros fornecedores)
    - all html pages
- src (código fonte)
    - assets
        - fonts
        - img
        - js
            - pages
        - scss
            - pages
    - html
        - partials
            - default
                - body.html
                - footer.html
                - header.html
                - left-sidebar.html
                - main.html
                - vendor-scripts.html
            - simple
                - body.html
                - footer.html
        - all html pages (templates)
    - .editorconfig
    - .gitignore
    - gulpfile.js
    - LICENCE
    - package.json
    - yarn.lock

_________________

## Pré-Requisítos

### Nodejs
<https://nodejs.org/en/>

Node.js é um software de código aberto, multiplataforma, baseado no interpretador V8 do Google e que permite a execução de códigos JavaScript fora de um navegador web (fonte:wkipedia).

Neste momento a versão mais atual LTS é a v18.14.2 e existem várias formas de instalar o nodejs.

No Ubuntu 22.04, usando apt, por exemplo:

no repositório APT padrão não vem o 18 (só testei o projeto na versão 18)
```bash
$ sudo apt update -y && sudo apt upgrade -y
$ udo apt. install nodejs -y
$ node -v
```

para versão 18 foi preciso utilizar o repositório do NodeSource <https://github.com/nodesource/distributions>

Ele fizeram a gentileza de preparar um setup :) :

```bash.
$ curl -sL https://deb.nodesource.com/setup_18.x -o

#caso deseje inspecionar o arquivo:
$ vim nodesource_setup.sh
```

Agora só instalar:
```bash
$ sudo apt update -y && sudo apt upgrade -y
$ sudo apt install nodejs -y
$ node -v

# output
# v18.7.0
```

Caso precise remover, ou mesmo uma versão antiga, instalada pelo 

```bash
$ sudo apt remove nodejs
# ou
$ sudo apt purge nodejs
```

lembre-se que o 'apt remove' mantém os arquivos locais de configurações e o 'apt purge' apaga.



### Yarn
<https://yarnpkg.com/>

O Yarn é um gerenciador de pacotes muito bacana, automatiza uma série de tarefas chatas, como gerir as versões utilizadas em projeto web, por exemplo. Assim como o nodejs, existem várias formas de instala-lo.
Utilizei o NPM, que é um gerenciador de pacotes para o nodejs.

No Ubuntu 22.04 instalei globalmente, mas há formas de configurar e/ou instalar localmente.
```bash.
$ npm install -g yarn
$ yarn --version

# output
# 1.22.11
```

### Gulp
<https://gulpjs.com/>

Gulp.js é uma ferramenta de automação de tarefas em JavaScript, tal como Grunt e outras tantas por ai.
A diferença é que o Grunt é capaz de executar tarefas paralelizadas.

```bash
$ npm install -g gulp
$ gulp --version

# CLI version: 2.3.0
# Local version: 4.0.2

```
_________________

## Instalação

Uma vez os pre-requisitos atendidos, para configurar o projeto e começar a alterar basta usar os comandos abaixo:


<table>
<tr>
<th>
Comandos
</th>

<th>
Descrição
</th>
</tr>
<tr>
<td>

  ```bash
  yarn install
  ```

</td>
<td>

  Instala as dependências requeridas, criando o diretório node_modules. O comando dever ser executado no diretório raiz

</td>
</tr>

<tr>
<td>

  ```bash
  gulp
  ```

</td>
<td>

  Executas as tarefas descritas no gulpfile.js. Compila e rxecuta o projeto localmente em <http://localhost:3000>

</td>

</tr>

<tr>
<td>

  ```bash
  gulp build
  ```

</td>
<td>

  Apenas compila os arquivos em /dist, sem executar localmente.

</td>

</tr>
</table>

_________________

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
