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

const productsContainer = document.getElementById("productsContainer");
const loadingIndicator = document.getElementById("loadingIndicator");

async function fetchProducts() {
  productsContainer.innerHTML = "";
  loadingIndicator.style.display = "inline-block";

  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    if (response.ok) {
      const products = await response.json();
      if (products.length === 0) {
        productsContainer.innerHTML =
          '<p class="col-12 text-center text-muted">Nessun prodotto disponibile al momento.</p>';
        return;
      }

      products.forEach((product) => {
        const productCard = `
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div class="card h-100 shadow-sm">
                            <img src="${
                              product.imageUrl
                            }" class="card-img-top object-fit-cover" alt="${
          product.name
        }" style="height: 200px;">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text text-muted mb-2">${
                                  product.brand
                                }</p>
                                <p class="card-text">${product.description.substring(
                                  0,
                                  80
                                )}${
          product.description.length > 80 ? "..." : ""
        }</p>
                                <div class="mt-auto pt-2 border-top">
                                    <p class="card-text fs-5 fw-bold text-end">${product.price.toFixed(
                                      2
                                    )}€</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <a href="detail.html?productId=${
                                          product._id
                                        }" class="btn btn-primary btn-sm">Dettagli</a>
                                        <a href="backoffice.html?productId=${
                                          product._id
                                        }" class="btn btn-warning btn-sm">Modifica</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
        productsContainer.innerHTML += productCard;
      });
      showAlert("Pagina e prodotti caricati con successo!", "success");
    } else {
      showAlert(
        `Errore nel recupero dei prodotti: ${response.statusText}`,
        "danger"
      );
      console.error("Errore API:", await response.json());
    }
  } catch (error) {
    showAlert(
      "Si è verificato un errore di rete. Controlla la tua connessione.",
      "danger"
    );
    console.error("Errore di rete:", error);
  } finally {
    loadingIndicator.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", fetchProducts);
