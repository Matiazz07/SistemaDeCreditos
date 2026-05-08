let clientes = [];
let creditos = [];
let tasaInteres = 15;
let clienteSeleccionado = null;
let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoCalculado = 0;
let creditoAprobado = false;

function ocultarSeccion() {
  document.getElementById("parametros").classList.remove("activa");
  document.getElementById("clientes").classList.remove("activa");
  document.getElementById("credito").classList.remove("activa");
}

function mostrarSeccion(id) {
  ocultarSeccion();
  document.getElementById(id).classList.add("activa");
}

function guardarTasa() {
  let tasa = recuperarFloat("tasaInteres");
  if (tasa >= 10 && tasa <= 20) {
    tasaInteres = tasa;
    mostrarTexto("mensajeTasa", "Tasa configurada correctamente: " + tasa + "%");
  } else {
    mostrarTexto("mensajeTasa", "La tasa debe estar entre 10% y 20%");
  }
}

function guardarCliente() {
  let cedula = recuperarTexto("cedula");
  let nombre = recuperarTexto("nombre");
  let apellido = recuperarTexto("apellido");
  let ingresos = recuperarFloat("ingresos");
  let egresos = recuperarFloat("egresos");
  let clienteExiste = buscarCliente(cedula);
  if (clienteExiste == null) {
    let cliente = {
      cedula: cedula,
      nombre: nombre,
      apellido: apellido,
      ingresos: ingresos,
      egresos: egresos
    };
    clientes.push(cliente);
    pintarClientes();
  } else {
    clienteExiste.nombre = nombre;
    clienteExiste.apellido = apellido;
    clienteExiste.ingresos = ingresos;
    clienteExiste.egresos = egresos;
    pintarClientes();
  }
}

function pintarClientes() {
  let tabla = document.getElementById("tablaClientes");
  tabla.innerHTML = "";
  for (let i = 0; i < clientes.length; i++) {
    let cliente = clientes[i];
    tabla.innerHTML += "<tr>" +
      "<td>" + cliente.cedula + "</td>" +
      "<td>" + cliente.nombre + "</td>" +
      "<td>" + cliente.apellido + "</td>" +
      "<td>" + cliente.ingresos + "</td>" +
      "<td>" + cliente.egresos + "</td>" +
      "<td><button onclick='seleccionarCliente(" + cliente.cedula + ")'>Actualizar</button>" +
      "<button onclick='eliminarCliente(" + cliente.cedula + ")'>Eliminar</button></td>" +
      "</tr>"
  }
}

function buscarCliente(cedula) {
  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].cedula == cedula) {
      return clientes[i];
    }
  }
  return null;
}

function seleccionarCliente(cedula) {
  clienteSeleccionado = buscarCliente(cedula);
  mostrarTextoEnCaja("cedula", clienteSeleccionado.cedula);
  mostrarTextoEnCaja("nombre", clienteSeleccionado.nombre);
  mostrarTextoEnCaja("apellido", clienteSeleccionado.apellido);
  mostrarTextoEnCaja("ingresos", clienteSeleccionado.ingresos);
  mostrarTextoEnCaja("egresos", clienteSeleccionado.egresos);
}

function eliminarCliente(cedula) {
  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].cedula == cedula) {
      clientes.splice(i, 1);
      pintarClientes();
      break;
    }
  }
  limpiar();
}

function limpiar() {
  mostrarTextoEnCaja("cedula", "");
  mostrarTextoEnCaja("nombre", "");
  mostrarTextoEnCaja("apellido", "");
  mostrarTextoEnCaja("ingresos", "");
  mostrarTextoEnCaja("egresos", "");
}

function buscarClienteCredito() {
  let cedula = recuperarTexto("buscarCedulaCredito");
  let cliente = buscarCliente(cedula);
  if (cliente != null) {
    clienteSeleccionado = cliente;
    let cmpClienteCredito = document.getElementById("datosClienteCredito");
    cmpClienteCredito.innerHTML =
      "Cédula: " + cliente.cedula + "<br>" +
      "Nombre: " + cliente.nombre + "<br>" +
      "Apellido: " + cliente.apellido + "<br>" +
      "Ingresos: " + cliente.ingresos + "<br>" +
      "Egresos: " + cliente.egresos;
  } else {
    mostrarTexto("estadoCliente", "Cliente no encontrado");
  }
}

function calcularDisponible(ingresos, arriendo, alimentacion, varios) {
  let valorDisponible;
  valorDisponible = ingresos - (arriendo + alimentacion + varios);
  if (valorDisponible < 0) {
    return "0";
  }
  return valorDisponible;
}

function calcularCapacidadPago(montoDisponible) {
  return montoDisponible * 0.5;
}

function calcularInteresSimple(monto, tasa, plazo) {
  let interesAPagar;
  interesAPagar = plazo * (tasa / 100) * monto;
  return interesAPagar;
}

function calcularTotalPagar(monto, interes) {
  let totalAPagar;
  totalAPagar = monto + interes + 100;
  return totalAPagar;
}

function calcularCuotaMensual(total, plazoAnios) {
  let totalCuotaMensual;
  totalCuotaMensual = total / (plazoAnios * 12);
  return totalCuotaMensual.toFixed(2);
}

function aprobarCredito(capacidadPago, cuotaMensual) {
  if (capacidadPago > cuotaMensual) {
    return true;
  } else {
    return false;
  }
}

simularCredito = function () {
  let monto = document.getElementById("montoCredito").value;
  let floatMonto = parseFloat(monto);
  let plazo = document.getElementById("plazoCredito").value;
  let intPlazo = parseInt(plazo);
  let disponible = calcularDisponible(clienteSeleccionado.ingresos, clienteSeleccionado.egresos, 0, 0);
  let capacidadPago = calcularCapacidadPago(disponible);
  let interes = calcularInteresSimple(floatMonto, tasaInteres, intPlazo);
  let totalPagar = calcularTotalPagar(floatMonto, interes);
  let cuota = calcularCuotaMensual(totalPagar, intPlazo);
  let aprobado = aprobarCredito(capacidadPago, cuota);
  let veredicto = aprobado ? "Crédito disponible" : "El monto exede la capacidad de pago";
  let divResultado = document.getElementById("resultadoCredito")
  divResultado.innerHTML =
    "Capacidad de pago:" + capacidadPago + "<br>" +
    "Total a Pagar: " + totalPagar + "<br>" +
    "Cuota mensual: " + cuota + "<br>" +
    "RESULTADO: " + veredicto;
  divResultado.className = aprobado ? "aprobado" : "rechazado"
  document.getElementById("btnSolicitarCredito").disabled = !aprobado;
  montoCalculado = disponible;
  plazoCalculado = plazo;
  cuotaCalculada = cuota;
}
