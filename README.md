# infra -> presentation -> application -> domain

# João precisava de um sistema de controle veicular web, para que pudesse então se organizar com seu estoque e manutenções.

Pensando nisso, ele lhe contratou para desenvolver o sistema. Os pré-requisitos são:

-   O sistema deve ser responsivo, e para tanto ele gostaria que fosse utilizado o bootstrap;
-   Ele gostaria que tivesse algumas ações de front com algum framework JS, podendo ser utilizado até o jQuery, pois haverá necessidades de algumas ações que não dependam de acesso no servidor, ou que dependem mas não façam o "refresh" na tela do usuário;
-   Ele pretende usar um banco de dados MySql, Postgres, SqlServer ou até MongoDB. (Fica a critério);
-   Ao inicializar a aplicação na primeira vez, o sistema deve já configurar o banco de dados, ou no máximo ter um script de geração das tabelas e dados iniciais. Nas respostas da questão ou no readme deverá conter os dados de acesso ao banco (Nome do banco, etc);
-   No banco de dados, será necessário criar as tabelas: Marca, Modelo, Anuncio. A marca é vital ter o campo da marca do veículo, exemplo: Honda. No modelo o detalhe do Modelo. exemplo: Civic LXR 2.0, e no anúncio os dados do veículo: (Modelo, Marca, Ano, Valor de Compra, Valor de Venda, Cor, Tipo Combustível, Data de Venda). Esses seriam os campos básicos e necessários para o João, mas podem ser aprimorados conforme visão do desenvolvedor.
-   Criar a área administrativa, com login e senha para que o João possa cadastrar seus veículos;
-   Na área administrativa, deve conter o crud da marca, modelo e anúncio (pelo menos);
-   No cadastro do anúncio, quando for buscar o modelo do veículo, usar uma consulta ajax para retornar só os modelos vinculados a marca já escolhida na hora do cadastro do anúncio.
-   Lembre de fazer a validação dos campos que são obrigatórios (modelo, marca, ano, valor de compra, valor de venda, cor , tipo combustível);
-   Gere um relatório em PDF para que o João possa ver os veículos vendidos durante uma faixa de data (ele quer escolher a data mínima e máxima). Nesse relatório deve conter a data que foi vendido, o veículo e o lucro (Valor de venda - Valor de Compra);
-   Criar a página que mostre a listagem de seus veículos, aonde ele possa editá-los;
-   A última solicitação do João, para questão de um software terceiro que ele tem, seria necessário criar uma API que simplesmente tenha um método GET, passando o Id do anúncio. Esse método deve retornar o objeto do anúncio.

---

# Criar usuário

-   Nome, email, senha

# Fazer login

-   Validar autenticação

# Criar cadastro de Marca

-   Codigo e descrição

## Comandos para o sequelize

-   yarn sequelize db:create
    Cria um banco de dados no zero

-   yarn sequelize migration:create --name=create-users
    Cria um arquivo de migrations chamado create-users

-   yarn sequelize db:migrate
    Executa todas as migrações pendentes

-   yarn sequelize db:migrate:undo
    Desfaz a ultima migration executada

-   yarn sequelize db:migrate:undo:all
    Desfaz todas as migrations

-   yarn sequelize seed:generate --name demo-user
    Cria um arquivo de seeds para inserir dados

-   yarn sequelize db:seed:all
    Executa todos os seeds pendentes

-   yarn sequelize db:seed:undo:all
    Desfaz todos os seeds
