document.addEventListener("DOMContentLoaded", async function () {
    const user = getUser();
    if (!getToken() || !user) {
        window.location.href = "login.html";
        return;
    }

    const isAdmin = user.role === "admin";
    const money = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });

    document.getElementById("userBadge").textContent =
        user.username + " · " + (isAdmin ? "Administrador" : "Vendedor");
    document.getElementById("roleHint").textContent = isAdmin
        ? "Puedes crear, editar y eliminar productos."
        : "Puedes consultar el inventario y registrar ventas. No puedes modificar productos.";

    if (isAdmin) {
        document.getElementById("newProductBtn").classList.remove("d-none");
    }

    const productModal = new bootstrap.Modal(document.getElementById("productModal"));
    const saleModal = new bootstrap.Modal(document.getElementById("saleModal"));
    const alertBox = document.getElementById("appAlert");
    let productsCache = [];

    function showAlert(message, type) {
        alertBox.textContent = message;
        alertBox.className = "alert alert-" + type;
    }

    function hideAlert() {
        alertBox.className = "alert d-none";
    }

    async function loadData() {
        const [products, sales] = await Promise.all([
            api("/api/products"),
            api("/api/sales")
        ]);

        productsCache = products;
        renderProducts(products);
        renderSales(sales);
    }

    function renderProducts(products) {
        const body = document.getElementById("productsTable");
        body.innerHTML = products.map(function (product) {
            const stockClass = Number(product.stock) <= 3 ? "stock-low" : "";
            const adminButtons = isAdmin
                ? `<button class="btn btn-sm btn-outline-primary" data-edit="${product.id}">Editar</button>
                   <button class="btn btn-sm btn-outline-danger" data-delete="${product.id}">Eliminar</button>`
                : "";

            return `
                <tr>
                    <td>
                        <strong>${escapeHtml(product.nombre)}</strong>
                        <div class="text-muted small">${escapeHtml(product.descripcion || "")}</div>
                    </td>
                    <td>${escapeHtml(product.sku)}</td>
                    <td>${escapeHtml(product.categoria)}</td>
                    <td>${money.format(product.precio)}</td>
                    <td class="${stockClass}">${product.stock}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-warning" data-sale="${product.id}" data-name="${escapeHtml(product.nombre)}">
                            Vender
                        </button>
                        ${adminButtons}
                    </td>
                </tr>
            `;
        }).join("");
    }

    function renderSales(sales) {
        const body = document.getElementById("salesTable");
        body.innerHTML = sales.map(function (sale) {
            return `
                <tr>
                    <td>${new Date(sale.created_at).toLocaleString("es-CO")}</td>
                    <td>${escapeHtml(sale.producto)}</td>
                    <td>${sale.cantidad}</td>
                    <td>${money.format(sale.total)}</td>
                    <td>${escapeHtml(sale.vendedor)}</td>
                </tr>
            `;
        }).join("") || `<tr><td colspan="5" class="text-muted">Aún no hay ventas.</td></tr>`;
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");
    }

    function fillProductForm(product) {
        document.getElementById("productId").value = product ? product.id : "";
        document.getElementById("nombre").value = product ? product.nombre : "";
        document.getElementById("sku").value = product ? product.sku : "";
        document.getElementById("categoria").value = product ? product.categoria : "";
        document.getElementById("precio").value = product ? product.precio : "";
        document.getElementById("stock").value = product ? product.stock : "";
        document.getElementById("descripcion").value = product ? product.descripcion : "";
        document.getElementById("productModalTitle").textContent =
            product ? "Editar producto" : "Nuevo producto";
    }

    document.getElementById("logoutBtn").addEventListener("click", function () {
        clearSession();
        window.location.href = "login.html";
    });

    document.getElementById("newProductBtn").addEventListener("click", function () {
        fillProductForm(null);
        productModal.show();
    });

    document.getElementById("productsTable").addEventListener("click", async function (event) {
        const editId = event.target.getAttribute("data-edit");
        const deleteId = event.target.getAttribute("data-delete");
        const saleId = event.target.getAttribute("data-sale");

        if (editId) {
            const product = productsCache.find(function (item) {
                return String(item.id) === String(editId);
            });
            fillProductForm(product);
            productModal.show();
        }

        if (deleteId) {
            if (!confirm("¿Eliminar este producto del inventario?")) {
                return;
            }
            try {
                await api("/api/products/" + deleteId, { method: "DELETE" });
                showAlert("Producto eliminado.", "success");
                await loadData();
            } catch (error) {
                showAlert(error.message, "danger");
            }
        }

        if (saleId) {
            document.getElementById("saleProductId").value = saleId;
            document.getElementById("saleProductName").textContent =
                event.target.getAttribute("data-name");
            document.getElementById("saleCantidad").value = 1;
            saleModal.show();
        }
    });

    document.getElementById("productForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        hideAlert();

        const id = document.getElementById("productId").value;
        const payload = {
            nombre: document.getElementById("nombre").value,
            sku: document.getElementById("sku").value,
            categoria: document.getElementById("categoria").value,
            precio: Number(document.getElementById("precio").value),
            stock: Number(document.getElementById("stock").value),
            descripcion: document.getElementById("descripcion").value
        };

        try {
            await api(id ? "/api/products/" + id : "/api/products", {
                method: id ? "PUT" : "POST",
                body: JSON.stringify(payload)
            });
            productModal.hide();
            showAlert(id ? "Producto actualizado." : "Producto creado.", "success");
            await loadData();
        } catch (error) {
            showAlert(error.message, "danger");
        }
    });

    document.getElementById("saleForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        hideAlert();

        try {
            await api("/api/sales", {
                method: "POST",
                body: JSON.stringify({
                    productId: Number(document.getElementById("saleProductId").value),
                    cantidad: Number(document.getElementById("saleCantidad").value)
                })
            });
            saleModal.hide();
            showAlert("Venta registrada y stock actualizado.", "success");
            await loadData();
        } catch (error) {
            showAlert(error.message, "danger");
        }
    });

    try {
        await loadData();
    } catch (error) {
        showAlert(error.message, "danger");
    }
});
