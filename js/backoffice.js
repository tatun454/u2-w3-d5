const API_URL = "https://striveschool-api.herokuapp.com/api/product/";
const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODcwYzgzNTc4Y2RkZjAwMTU1ZDY3YWQiLCJpYXQiOjE3NTIyMjE3NDksImV4cCI6MTc1MzQzMTM0OX0.B2kTPshNXUChW2jz0tjDsAGZdXw1koLLXQqOXcN2QSs";

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

const productForm = document.getElementById("productForm");
const productIdInput = document.getElementById("productId");
const productNameInput = document.getElementById("productName");
const productDescriptionInput = document.getElementById("productDescription");
const productBrandInput = document.getElementById("productBrand");
const productImageUrlInput = document.getElementById("productImageUrl");
const productPriceInput = document.getElementById("productPrice");
const submitButton = document.getElementById("submitButton");
const resetButton = document.getElementById("resetButton");
const deleteButton = document.getElementById("deleteButton");
const pageTitle = document.getElementById("pageTitle");

let currentProductId = null;

function validateForm() {
  let isValid = true;
  const inputs = [
    { element: productNameInput, message: "Inserisci il nome del prodotto." },
    { element: productDescriptionInput, message: "Inserisci una descrizione." },
    { element: productBrandInput, message: "Inserisci il brand." },
    {
      element: productImageUrlInput,
      message: "Inserisci un URL immagine valido.",
    },
    { element: productPriceInput, message: "Inserisci un prezzo valido." },
  ];

  inputs.forEach((item) => {
    if (!item.element.value.trim()) {
      item.element.classList.add("is-invalid");
      isValid = false;
    } else {
      item.element.classList.remove("is-invalid");
      item.element.classList.add("is-valid");
    }
  });

  return isValid;
}
//aggiungi giochi
function resetForm() {
  productForm.reset();
  productIdInput.value = "";
  currentProductId = null;
  pageTitle.innerText = "Crea Nuovo Prodotto";
  submitButton.innerText = "Crea Prodotto";
  deleteButton.style.display = "none";

  document.querySelectorAll(".form-control").forEach((input) => {
    input.classList.remove("is-invalid", "is-valid");
  });
  showAlert("Form Aggiornato!", "info");
}

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    showAlert("Per favore, compila tutti i campi obbligatori.", "warning");
    return;
  }

  const productData = {
    name: productNameInput.value,
    description: productDescriptionInput.value,
    brand: productBrandInput.value,
    imageUrl: productImageUrlInput.value,
    price: parseFloat(productPriceInput.value),
  };

  const method = currentProductId ? "PUT" : "POST";
  const url = currentProductId ? `${API_URL}${currentProductId}` : API_URL;

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      const result = await response.json();
      showAlert(
        `Prodotto ${currentProductId ? "modificato" : "creato"} con successo!`,
        "success"
      );
      resetForm();
    } else {
      const errorData = await response.json();
      showAlert(
        `Errore ${currentProductId ? "modifica" : "creazione"} prodotto: ${
          errorData.message || response.statusText
        }`,
        "danger"
      );
    }
  } catch (error) {
    console.error("Errore durante la fetch:", error);
    showAlert("Si è verificato un errore di rete o del server.", "danger");
  }
});

resetButton.addEventListener("click", () => {
  if (
    confirm(
      "Sei sicuro di voler resettare il form? Tutte le modifiche non salvate andranno perse."
    )
  ) {
    resetForm();
  }
});

deleteButton.addEventListener("click", async () => {
  if (
    currentProductId &&
    confirm(
      "Sei sicuro di voler eliminare questo prodotto? Questa azione è irreversibile!"
    )
  ) {
    try {
      const response = await fetch(`${API_URL}${currentProductId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });

      if (response.ok) {
        showAlert("Prodotto eliminato con successo!", "success");
        resetForm();
      } else {
        const errorData = await response.json();
        showAlert(
          `Errore eliminazione prodotto: ${
            errorData.message || response.statusText
          }`,
          "danger"
        );
      }
    } catch (error) {
      console.error("Errore durante la fetch:", error);
      showAlert(
        "Si è verificato un errore di rete o del server durante l'eliminazione.",
        "danger"
      );
    }
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productIdFromUrl = urlParams.get("productId");

  if (productIdFromUrl) {
    currentProductId = productIdFromUrl;
    productIdInput.value = currentProductId;
    pageTitle.innerText = "Modifica Prodotto";
    submitButton.innerText = "Salva Modifiche";
    deleteButton.style.display = "inline-block";

    try {
      const response = await fetch(`${API_URL}${currentProductId}`, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
      if (response.ok) {
        const product = await response.json();
        productNameInput.value = product.name;
        productDescriptionInput.value = product.description;
        productBrandInput.value = product.brand;
        productImageUrlInput.value = product.imageUrl;
        productPriceInput.value = product.price;
        showAlert("Dati prodotto caricati per la modifica.", "info");
      } else {
        showAlert(
          "Errore nel recupero dei dati del prodotto per la modifica.",
          "warning"
        );
        console.error(
          "Errore nel recupero del prodotto:",
          await response.json()
        );
      }
    } catch (error) {
      showAlert(
        "Si è verificato un errore di rete durante il caricamento del prodotto.",
        "danger"
      );
      console.error("Errore di rete:", error);
    }
  } else {
    resetForm();
  }
});
