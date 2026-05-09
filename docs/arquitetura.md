# Arquitetura Do Gstudy

O Gstudy utiliza uma arquitetura web em camadas, com frontend e backend separados.

```text
Usuario -> Next.js -> NestJS REST API -> Prisma -> PostgreSQL
```

## Decisoes Tecnicas

- **Next.js** foi escolhido para construir uma interface moderna, responsiva e organizada por rotas.
- **NestJS** foi escolhido porque favorece modularidade, injeção de dependência e organização semelhante a projetos corporativos.
- **PostgreSQL** foi escolhido pela consistência transacional e pelo bom suporte a relacionamentos.
- **Prisma** foi escolhido para tipagem, migrations e clareza na modelagem.
- **JWT** foi escolhido por ser simples e adequado para autenticação stateless em APIs REST.

## Clean Architecture

O backend separa responsabilidades em:

- Controllers: recebem requisições HTTP.
- DTOs: validam dados de entrada.
- Services: concentram casos de uso e regras de negócio.
- PrismaService: abstrai acesso ao banco.
- Guards/Decorators: cuidam de autenticação e autorização.

Essa estrutura facilita testes, manutenção e evolução do sistema.
