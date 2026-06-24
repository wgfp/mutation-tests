const Pessoa = require("../src/pessoa");

test("Criar uma pessoa com nome e idade", () => {
  const pessoa = new Pessoa("João", 30);

  expect(pessoa.nome).toStrictEqual("João");
  expect(pessoa.idade).toStrictEqual(30);
});

test("Apresentar deve retornar a frase correta", () => {
  const pessoa = new Pessoa("Maria", 25);

  expect(pessoa.apresentar()).toStrictEqual(
    "Olá, meu nome é Maria e eu tenho 25 anos."
  );
});

test("Atualizar idade corretamente", () => {
  const pessoa = new Pessoa("Carlos", 40);

  pessoa.atualizarIdade(45);

  expect(pessoa.idade).toStrictEqual(45);
});