// ========================================
// DATOS DEL EMPRENDIMIENTO
// ========================================

const negocio = {

    nombre: "TECNOANTIOQUIA",

    eslogan:
        "Venta de celulares, accesorios y servicio técnico",

    descripcion:
        "Venta de celulares y accesorios para diferentes marcas. También ofrecemos mantenimiento y reparación de celulares y equipos de cómputo.",

    direccion:
        "Cra 52 # 51 - 55, Rionegro, Antioquia",

    telefono:
        "3015752454",

    horario:
        "10:00 AM a 9:00 PM",


    // ====================================
    // WHATSAPP
    // ====================================

    whatsapp:
        "573015752454",


    // ====================================
    // REDES SOCIALES
    // ====================================

    instagram:
        "https://instagram.com/CAMBIAR_AQUI",

    tiktok:
        "https://tiktok.com/@CAMBIAR_AQUI",

    facebook:
        "https://facebook.com/CAMBIAR_AQUI",


    // ====================================
    // SERVICIOS
    // ====================================

    servicios: [

        {
            nombre:
                "VENTA DE CELULARES",

            descripcion:
                "iPhone, Samsung, Redmi, Motorola y otras marcas.",

            precio:
                "A cotizar",

            icono:
                "bi-phone"
        },


        {
            nombre:
                "ACCESORIOS",

            descripcion:
                "Cargadores, cables, silicones, audífonos y más.",

            precio:
                "$20.000 en adelante",

            icono:
                "bi-headphones"
        },


        {
            nombre:
                "MANTENIMIENTO DE CELULARES",

            descripcion:
                "Cambio de display genérico y Triple A, mantenimiento y reparación.",

            precio:
                "$120.000 en adelante",

            icono:
                "bi-tools"
        },


        {
            nombre:
                "MANTENIMIENTO DE COMPUTADORES",

            descripcion:
                "Formateo, instalación de Windows y Office, cargadores y otros servicios.",

            precio:
                "$80.000 en adelante",

            icono:
                "bi-laptop"
        }

    ]

};


// ========================================
// MOSTRAR INFORMACIÓN
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // Nombre

        document.getElementById(
            "nombreNegocio"
        ).textContent = negocio.nombre;


        // Eslogan

        document.getElementById(
            "eslogan"
        ).textContent = negocio.eslogan;


        // Descripción

        document.getElementById(
            "descripcion"
        ).textContent = negocio.descripcion;


        // Dirección

        document.getElementById(
            "direccion"
        ).textContent =
            "📍 Dirección: " +
            negocio.direccion;


        // Teléfono

        document.getElementById(
            "telefono"
        ).textContent =
            "📱 WhatsApp: " +
            negocio.telefono;


        // Horario

        document.getElementById(
            "horario"
        ).textContent =
            "🕐 Horario: " +
            negocio.horario;



        // =================================
        // WHATSAPP
        // =================================

        const mensaje =
            encodeURIComponent(
                "Hola, quiero información sobre los servicios de " +
                negocio.nombre
            );


        document.getElementById(
            "botonWhatsApp"
        ).href =
            "https://wa.me/" +
            negocio.whatsapp +
            "?text=" +
            mensaje;



        // =================================
        // REDES SOCIALES
        // =================================

        document.getElementById(
            "instagram"
        ).href =
            negocio.instagram;


        document.getElementById(
            "tiktok"
        ).href =
            negocio.tiktok;


        document.getElementById(
            "facebook"
        ).href =
            negocio.facebook;



        // =================================
        // SERVICIOS
        // =================================

        const contenedor =
            document.getElementById(
                "listaServicios"
            );


        negocio.servicios.forEach(
            function (servicio) {


                contenedor.innerHTML += `

                    <div class="col-md-6 col-lg-3">

                        <div class="card service-card p-4">

                            <div class="card-body text-center">

                                <i
                                    class="bi ${servicio.icono} fs-1"
                                    style="color: #0875BA;">
                                </i>


                                <h3 class="h5 mt-3">

                                    ${servicio.nombre}

                                </h3>


                                <p>

                                    ${servicio.descripcion}

                                </p>


                                <p class="price">

                                    ${servicio.precio}

                                </p>


                                <a
                                    href="#contacto"
                                    class="btn btn-warning">

                                    Más información

                                </a>

                            </div>

                        </div>

                    </div>

                `;

            }
        );

    }
);