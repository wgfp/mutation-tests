const ContaBancaria = require("../src/contaBancaria");

describe("ContaBancaria", () => {
  let conta;
  let contaBancaria;

  beforeEach(() => {
    conta = {
      id: 1,
      titular: "João",
      saldo: 100,
      limite: 50,
      status: "ativa",
      atualizadaEm: new Date(),
    };

    contaBancaria = new ContaBancaria(conta);
  });

  test("Obter saldo", () => {
    expect(contaBancaria.obterSaldo()).toBe(100);
  });

  test("Obter titular", () => {
    expect(contaBancaria.obterTitular()).toBe("João");
  });

  test("Conta está ativa", () => {
    expect(contaBancaria.estaAtiva()).toBe(true);
  });

  test("Depositar valor válido", () => {
    expect(contaBancaria.depositar(50)).toBe(true);
    expect(contaBancaria.obterSaldo()).toBe(150);
  });

  test("Não depositar valor inválido", () => {
    expect(contaBancaria.depositar(0)).toBe(false);
  });

  test("Sacar valor válido", () => {
    expect(contaBancaria.sacar(50)).toBe(true);
    expect(contaBancaria.obterSaldo()).toBe(50);
  });

  test("Não sacar valor maior que saldo + limite", () => {
    expect(contaBancaria.sacar(1000)).toBe(false);
  });

  test("Alterar titular", () => {
    expect(contaBancaria.alterarTitular("Maria")).toBe(true);
    expect(contaBancaria.obterTitular()).toBe("Maria");
  });

  test("Bloquear conta", () => {
    expect(contaBancaria.bloquearConta()).toBe(true);
    expect(contaBancaria.obterStatus()).toBe("bloqueada");
  });

  test("Ativar conta", () => {
    conta.status = "bloqueada";
    expect(contaBancaria.ativarConta()).toBe(true);
    expect(contaBancaria.obterStatus()).toBe("ativa");
  });

  test("Encerrar conta com saldo zerado", () => {
    conta.saldo = 0;
    expect(contaBancaria.encerrarConta()).toBe(true);
    expect(contaBancaria.obterStatus()).toBe("encerrada");
  });

  test("Não encerrar conta com saldo diferente de zero", () => {
    expect(contaBancaria.encerrarConta()).toBe(false);
  });

  test("Pode sacar valor válido", () => {
    expect(contaBancaria.podeSacar(100)).toBe(true);
  });

  test("Não pode sacar valor inválido", () => {
    expect(contaBancaria.podeSacar(1000)).toBe(false);
  });

  test("Aplicar tarifa", () => {
    expect(contaBancaria.aplicarTarifa(10)).toBe(true);
    expect(contaBancaria.obterSaldo()).toBe(90);
  });

  test("Ajustar limite", () => {
    expect(contaBancaria.ajustarLimite(200)).toBe(true);
    expect(contaBancaria.obterLimite()).toBe(200);
  });

  test("Saldo negativo", () => {
    conta.saldo = -10;
    expect(contaBancaria.saldoNegativo()).toBe(true);
  });

  test("Transferir valor para outra conta", () => {
    const contaDestino = new ContaBancaria({
      id: 2,
      titular: "Maria",
      saldo: 0,
      limite: 0,
      status: "ativa",
      atualizadaEm: new Date(),
    });

    expect(contaBancaria.transferir(50, contaDestino)).toBe(true);
    expect(contaBancaria.obterSaldo()).toBe(50);
    expect(contaDestino.obterSaldo()).toBe(50);
  });

  test("Calcular saldo disponível", () => {
    expect(contaBancaria.calcularSaldoDisponivel()).toBe(150);
  });

  test("Gerar resumo", () => {
    const resumo = contaBancaria.gerarResumo();

    expect(resumo).toEqual({
      titular: "João",
      saldo: 100,
      limite: 50,
      disponivel: 150,
      status: "ativa",
    });
  });

  test("Validar conta válida", () => {
    expect(contaBancaria.validarConta()).toBe(true);
  });

  test("Validar conta inválida", () => {
    conta.id = null;
    expect(contaBancaria.validarConta()).toBe(false);
  });

  test("Resetar conta", () => {
    contaBancaria.resetarConta();

    expect(contaBancaria.obterSaldo()).toBe(0);
    expect(contaBancaria.obterLimite()).toBe(0);
    expect(contaBancaria.obterStatus()).toBe("ativa");
  });
});

describe("Casos de erro e edge cases", () => {
  let conta;
  let contaBancaria;

  beforeEach(() => {
    conta = {
      id: 1,
      titular: "João",
      saldo: 100,
      limite: 50,
      status: "ativa",
      atualizadaEm: new Date(),
    };

    contaBancaria = new ContaBancaria(conta);
  });

  test("Não sacar valor <= 0", () => {
    expect(contaBancaria.sacar(0)).toBe(false);
    expect(contaBancaria.sacar(-10)).toBe(false);
  });

  test("Não depositar valor negativo", () => {
    expect(contaBancaria.depositar(-5)).toBe(false);
  });

  test("Não alterar titular vazio", () => {
    expect(contaBancaria.alterarTitular("")).toBe(false);
    expect(contaBancaria.alterarTitular(null)).toBe(false);
  });

  test("Não bloquear conta já bloqueada", () => {
    conta.status = "bloqueada";
    expect(contaBancaria.bloquearConta()).toBe(false);
  });

  test("Não ativar conta já ativa", () => {
    expect(contaBancaria.ativarConta()).toBe(false);
  });

  test("Não ajustar limite negativo", () => {
    expect(contaBancaria.ajustarLimite(-100)).toBe(false);
  });

  test("Não aplicar tarifa inválida", () => {
    expect(contaBancaria.aplicarTarifa(0)).toBe(false);
    expect(contaBancaria.aplicarTarifa(-10)).toBe(false);
  });

  test("Transferência falha por saldo insuficiente", () => {
    const contaDestino = new ContaBancaria({
      id: 2,
      titular: "Maria",
      saldo: 0,
      limite: 0,
      status: "ativa",
      atualizadaEm: new Date(),
    });

    expect(contaBancaria.transferir(1000, contaDestino)).toBe(false);
  });

  test("Transferência falha se saque falhar", () => {
    const contaDestino = new ContaBancaria({
      id: 2,
      titular: "Maria",
      saldo: 0,
      limite: 0,
      status: "ativa",
      atualizadaEm: new Date(),
    });

    jest.spyOn(contaBancaria, "sacar").mockReturnValue(false);

    expect(contaBancaria.transferir(50, contaDestino)).toBe(false);
  });

  test("podeSacar retorna false para valor <= 0", () => {
    expect(contaBancaria.podeSacar(0)).toBe(false);
    expect(contaBancaria.podeSacar(-10)).toBe(false);
  });

  test("validarConta falha sem id", () => {
    conta.id = null;
    expect(contaBancaria.validarConta()).toBe(false);
  });

  test("validarConta falha sem titular", () => {
    conta.titular = "";
    expect(contaBancaria.validarConta()).toBe(false);
  });

  test("validarConta falha com saldo inválido", () => {
    conta.saldo = "100";
    expect(contaBancaria.validarConta()).toBe(false);
  });

  test("validarConta falha com limite negativo", () => {
    conta.limite = -10;
    expect(contaBancaria.validarConta()).toBe(false);
  });

  test("validarConta falha com status inválido", () => {
    conta.status = "qualquer";
    expect(contaBancaria.validarConta()).toBe(false);
  });
});