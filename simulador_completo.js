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
  let cliente = {
    cedula: cedula,
    nombre: nombre,
    apellido: apellido,
    ingresos: ingresos,
    egresos: egresos
  };
  clientes.push(cliente);
  pintarClientes();
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
      "<td><button onclick='actualizarCliente(" + cliente.cedula + ")'>Actualizar</button>" +
      "<button onclick='eliminarCliente(" + cliente.cedula + ")'>Eliminar</button></td>" +
      "</tr>"
  }
}



