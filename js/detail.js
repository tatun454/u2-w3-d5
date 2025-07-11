const API_URL = "https://striveschool-api.herokuapp.com/api/product/";
const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODcwYzgzNTc4Y2RkZjAwMTU1ZDY3YWQiLCJpYXQiOjE3NTIyMjE3NDksImV4cCI6MTc1MzQzMTM0OX0.B2kTPshNXUChW2jz0tjDsAGZdXw1koLLXQqOXcN2QSs"; // SOSTITUISCI CON IL TUO TOKEN REALE

function showAlert(message, type = "danger") {
  const alertContainer = document.getElementById("alertContainer");
  if (!alertContainer) return;
  const alertHtml = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
  alertContainer.innerHTML = alertHtml;
  setTimeout(() => {
    const alertElement = alertContainer.querySelector(".alert");
    if (alertElement) {
      new bootstrap.Alert(alertElement).close();
    }
  }, 5000);
}

const productDetailsContainer = document.getElementById("productDetails");

async function fetchProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("productId");

  if (!productId) {
    productDetailsContainer.innerHTML =
      '<p class="col-12 alert alert-danger">ID prodotto non trovato nell\'URL.</p>';
    showAlert(
      "Impossibile caricare i dettagli: ID prodotto mancante.",
      "danger"
    );
    return;
  }

  try {
    const response = await fetch(`${API_URL}${productId}`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    if (response.ok) {
      const product = await response.json();
      productDetailsContainer.innerHTML = `
                <div class="col-md-5">
                    <img src="${
                      product.imageUrl
                    }" class="img-fluid rounded shadow-sm" alt="${
        product.name
      }">
                </div>
                <div class="col-md-7">
                    <h2>${product.name}</h2>
                    <p class="text-muted"><strong>Brand:</strong> ${
                      product.brand
                    }</p>
                    <p><strong>Descrizione:</strong> ${product.description}</p>
                    <p class="lead fs-4 text-primary"><strong>Prezzo:</strong> ${product.price.toFixed(
                      2
                    )}€</p>
                    <hr>
                    <a href="index.html" class="btn btn-secondary me-2">Torna alla Homepage</a>
                    <a href="backoffice.html?productId=${
                      product._id
                    }" class="btn btn-warning">Modifica Prodotto</a>
                </div>
            `;
      showAlert("Dettagli prodotto caricati con successo!", "success");
    } else {
      showAlert(
        `Errore nel recupero dei dettagli del prodotto: ${response.statusText}`,
        "danger"
      );
      console.error("Errore API:", await response.json());
      productDetailsContainer.innerHTML =
        '<p class="col-12 alert alert-warning">Impossibile caricare i dettagli del prodotto.</p>';
    }
  } catch (error) {
    showAlert(
      "Si è verificato un errore di rete durante il caricamento dei dettagli.",
      "danger"
    );
    console.error("Errore di rete:", error);
    productDetailsContainer.innerHTML =
      '<p class="col-12 alert alert-danger">Si è verificato un errore di rete.</p>';
  }
}

document.addEventListener("DOMContentLoaded", fetchProductDetails);
