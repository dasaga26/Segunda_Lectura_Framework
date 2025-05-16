function ajaxForSearch(url, offset = 0, filters) {
    ajaxPromise(url, "POST", "JSON", `${filters}&offset=${offset}`)
        .then(function (data) {
            console.log("IMANOL: ", data);
            $("#list-content").empty();
            if (data === "error" || data.length === 0) {
                $("#list-content").html(
                    "<div class='col-lg-12'>" +
                    "<img src='view/images/notfound.avif' alt='No books found' width='250px'/>" +
                    "<h3>¡No se encuentran resultados con los filtros aplicados!</h3>" +
                    "</div>"
                );
            } else {

                data.forEach((book) => {
                    let bookHtml = `
                <div class="col-lg-6 col-sm-6">
                <div class="single_product_item more_info_list" id="${book.id_libro}">
                    <div id="list-carousel-${book.id_libro}" class="img_container"></div>
                    <a class="list__heart" id="${book.id_libro}" >
                    <i id="${book.id_libro}" class="fa-solid fa-heart fa-lg heart_like"></i>
                    </a>
                    <div class="single_product_text">
                    <h4>${book.titulo} 
                        
                    </h4>
                    <p>${book.descripcion}</p>
                    <h3>${book.precio}€</h3>
                    </div>
                </div>
                </div>
            `;

                    $("#list-content").append(bookHtml);
                    book.imagenes.forEach((img) => {
                        let imgHtml = `
                        <div>
                            <div class='card-box-b card-shadow news-box'>
                            <div class='img-box-b'>
                                <img src='${img}' alt='' class='img-b img-fluid'>
                            </div>
                            </div>
                        </div>
                        `;
                        $(`#list-carousel-${book.id_libro}`).append(imgHtml);
                    });

                    $(`#list-carousel-${book.id_libro}`).slick({
                        infinite: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true,
                        prevArrow:
                            '<button type="button" class="slick-prev" onclick="event.stopPropagation();">&larr;</button>',
                        nextArrow:
                            '<button type="button" class="slick-next" onclick="event.stopPropagation();">&rarr;</button>',
                    });

                    $(`#list-carousel-${book.id_libro} .slick-dots`).on(
                        "click",
                        function (event) {
                            event.stopPropagation();
                        }
                    );
                });

                load_likes_user()

            }

            show_map(data);

        })
        .catch(function () {
            $("#list-content").html(`
            <div class="col-lg-12">
            <img src="view/images/notfound.avif" alt="No books found" width="250px"/>
            <h3>No hay libros disponibles.</h3>
            </div>
        `);
        });
}

function loadBooks() {
    var filters = localStorage.getItem("filter") || false;
    if (filters) {
        ajaxForSearch("?module=shop&op=filter", 0, filters);
        pagination(filters);
    } else {
        ajaxForSearch("?module=shop&op=list", 0);
        pagination({}); // Pasar un objeto vacío para el caso sin filtros
        print_filters2();
    }

}



function loadDetails(id_book) {
    ajaxPromise(
        "?module=shop&op=details_carousel&id=" + id_book,
        "GET",
        "JSON"
    )
        .then(function (data) {
            console.log("Detalles del libro:", data);
            $("#productos-details").empty();
            let detailsHtml = `
        <div class="col-lg-4">
        <div class="img_container">
        
        </div>
        </div>
        <div class="col-lg-6">
        <div class="product_details_text">
        <h2 style="margin: 20px 0 !important;">${data[0].titulo}</h2>
        <a class="details__heart" id="${data[0].id_libro}">
        <i id="${data[0].id_libro}" class="fa-solid fa-heart fa-lg details_like"></i>
        </a>
        <p><b>Categoría:</b>${data[0].categorias}</p>
        <p><b>Editorial:</b>${data[0].editoriales}</p>
        <p><b>Autores:</b>${data[0].autores}</p>
        <p><b>Edición:</b>${data[0].edicion}</p>
        <p><b>Páginas:</b>${data[0].paginas}</p>
        <p>${data[0].descripcion}</p>
        <h3>${data[0].precio}€</h3>
        <div class="card_area d-flex justify-content-between align-items-center">
        <div class="product_count">
            <span class="inumber-decrement"> <i class="ti-minus"></i></span>
            <input class="input-number" type="text" value="1" min="1" max="10">
            <span class="number-increment"> <i class="ti-plus"></i></span>
        </div>
        <a href="#" class="btn_3">Añadir al carrito</a>
        <a href="#" class="like_us"><i class="ti-heart"></i></a>
        </div>
        <div class="product_extras">
        <h4>Extras del Producto</h4>
        </div>
        </div>               
        </div>
        <div class="col-lg-12 container_map_details">
        <h3>Ubicación del Libro</h3>
        <div id="map-single" style="height: 400px;"></div>
        <!-- Related Books Section -->
        <section id="related-books" class="related_books_area section_padding">
        <div class="container">
        <h2 class="cat">Otros clientes tambien buscaron</h2>

        <div class="title_content">
        </div>
        <div class="related_button"></div>
        </div>
        </section>
        </div>
        `;

            $("#productos-details").append(detailsHtml);
            $("#list-container").hide();
            $("#details-container").show();

            for (row in data[1][0]) {
                $("<div></div>")
                    .attr({
                        id: data[1][0].id_libro,
                        class: "date_img_dentro img_details",
                    })
                    .appendTo(".img_container")
                    .html(
                        "<div class='content-img-details'>" +
                        "<img src= '" +
                        data[1][0][row].url +
                        "'" +
                        " </img>" +
                        "</div>"
                    );
                console.log(data[1][0][row].url);
            }

            for (row in data[2][0]) {
                let extraHtml = `
            <div class="extra_item">
                ${data[2][0][row].icono} ${data[2][0][row].extra}
            </div>
            `;
                $(".product_extras").append(extraHtml);
                console.log(data[2][0][row].icono, data[2][0][row].extra);
            }
            load_likes_user()
            more_books_related(data[0].id_tipo); /////////////////
            // Initialize Slick Carousel for the image container
            $(".img_container").slick({
                infinite: true,
                slidesToShow: 1,
                dots: true,
                slidesToScroll: 1,
                prevArrow: '<button type="button" class="slick-prev">&larr;</button>',
                nextArrow: '<button type="button" class="slick-next">&rarr;</button>',
            });
            show_map_single(data[0]);
        })
        .catch(function () {
            console.error("Error cargando los detalles del libro.");
        });
}

function print_filters2() {
    ajaxPromise("?module=shop&op=get_filters", "GET", "json")
        .then(function (filters) {
            console.log(filters);

            let container = document.getElementById("filters2");
            container.innerHTML = "";

            let categoryHTML = "";
            let selectHTML = '<div class="textos">';
            let locationHTML = "";
            let sliderHTML = "";

            for (let nombre in filters) {
                let filtro = filters[nombre];
                let formato = filtro.formato;
                let opciones = filtro.opciones;

                if (formato === "checkbox") {
                    categoryHTML += `<div class="filter_${nombre}"><p class="nombre_filtro">${nombre}</p>`;
                    opciones.forEach((op) => {
                        categoryHTML += `<label><input type="checkbox" value="${op.id}"> ${op.nombre}</label>`;
                    });
                    categoryHTML += `</div>`;
                } else if (formato === "radio") {
                    locationHTML += `<div class="filter_${nombre}"><p class="nombre_filtro">${nombre}</p>`;
                    opciones.forEach((op) => {
                        locationHTML += `<label><input type="radio" name="${nombre}" value="${op.id}"> ${op.nombre}</label>`;
                    });
                    locationHTML += `</div>`;
                } else if (formato === "select") {
                    selectHTML += `<select class="filter_${nombre}">`;
                    opciones.forEach((op) => {
                        selectHTML += `<option value="${op.id}">${op.nombre}</option>`;
                    });
                    selectHTML += `</select>`;
                } else if (nombre === "precio") {
                    let min = filtro.min || 0;
                    let max = filtro.max || 100;

                    // Obtener valores previos desde localStorage
                    let savedPrice = localStorage.getItem("filter_precio")
                        ? JSON.parse(localStorage.getItem("filter_precio"))
                        : [min, max];

                    sliderHTML += `
                    <div class="widgets_inner">
                    <div class="range_item">
                        <input type="text" class="js-range-slider" id="priceRange">
                        <div class="d-flex">
                            <div class="price_text">
                                <p>Price :</p>
                            </div>
                            <div class="price_value d-flex justify-content-center">
                                <input type="text" class="js-input-from" id="amount-from" readonly>
                                <span>to</span>
                                <input type="text" class="js-input-to" id="amount-to" readonly>
                            </div>
                        </div>
                    </div>
                    </div>
                `;

                    setTimeout(() => {
                        let slider = $("#priceRange").ionRangeSlider({
                            type: "double",
                            min: min,
                            max: max,
                            from: savedPrice[0], // Usa el valor guardado
                            to: savedPrice[1], // Usa el valor guardado
                            skin: "round",
                            onStart: function (data) {
                                $("#amount-from").val(data.from);
                                $("#amount-to").val(data.to);
                            },
                            onChange: function (data) {
                                $("#amount-from").val(data.from);
                                $("#amount-to").val(data.to);
                            },
                            onFinish: function (data) {
                                // Guardar los valores al cambiar el slider
                                localStorage.setItem(
                                    "filter_precio",
                                    JSON.stringify([data.from, data.to])
                                );
                            },
                        });

                        $("#priceRange").data("ionRangeSlider", slider);
                    }, 0);
                }
            }

            selectHTML += `</div>`;

            // Añadir el nuevo filtro fijo para ordenar
            let orderHTML = `
            <div class="filter_order">
            <p class="nombre_filtro">Ordenar:</p>
            <select class="filter_ordenar">
                <option value="precio:desc">Precio: Mayor a Menor</option>
                <option value="precio:asc">Precio: Menor a Mayor</option>
                <option value="popularidad:desc">Popularidad</option>
            </select>
            </div>
        `;

            container.innerHTML +=
                categoryHTML + selectHTML + orderHTML + locationHTML + sliderHTML;

            container.innerHTML += `
            </br></br>
            <button class="filter_button" id="Button_filter">Filter</button>
            <button class="filter_remove" id="Remove_filter">Remove</button>
            `;
            filter_button();
            highlightFilters();

        })
        .catch(function () {
            console.log("Error al obtener los filtros");
        });
}

function filter_button() {
    // Filtro categoría
    $(".filter_categoria input[type=checkbox]").change(function () {
        let selectedCategories = [];
        $(".filter_categoria input[type=checkbox]:checked").each(function () {
            selectedCategories.push(this.value);
        });
        localStorage.setItem(
            "filter_categoria",
            JSON.stringify(selectedCategories)
        );
    });
    if (localStorage.getItem("filter_categoria")) {
        let savedCategories = JSON.parse(localStorage.getItem("filter_categoria"));
        savedCategories.forEach(function (category) {
            $(`.filter_categoria input[type=checkbox][value=${category}]`).prop(
                "checked",
                true
            );
        });
    }

    // Filtro tipo
    $(".filter_tipo").change(function () {
        localStorage.setItem("filter_tipo", this.value);
    });
    if (localStorage.getItem("filter_tipo")) {
        $(".filter_tipo").val(localStorage.getItem("filter_tipo"));
    }

    // Filtro editorial
    $(".filter_editorial").change(function () {
        localStorage.setItem("filter_editorial", this.value);
    });
    if (localStorage.getItem("filter_editorial")) {
        $(".filter_editorial").val(localStorage.getItem("filter_editorial"));
    }

    // Filtro tipo de venta
    $(".filter_tipo_venta").change(function () {
        localStorage.setItem("filter_tipo_venta", this.value);
    });
    if (localStorage.getItem("filter_tipo_venta")) {
        $(".filter_tipo_venta").val(localStorage.getItem("filter_tipo_venta"));
    }
    // Filtro estado
    $(".filter_estado").change(function () {
        localStorage.setItem("filter_estado", this.value);
    });
    if (localStorage.getItem("filter_estado")) {
        $(".filter_estado").val(localStorage.getItem("filter_estado"));
    }
    // Filtro localización
    $(".filter_localizacion input[type=radio]").change(function () {
        localStorage.setItem("filter_localizacion", this.value);
    });
    if (localStorage.getItem("filter_localizacion")) {
        $(
            `.filter_localizacion input[type=radio][value=${localStorage.getItem(
                "filter_localizacion"
            )}]`
        ).prop("checked", true);
    }

    // Filtro de precio
    $(".js-range-slider").change(function () {
        let from = $(this).data("from");
        let to = $(this).data("to");
        localStorage.setItem("filter_precio", JSON.stringify([from, to]));
    });
    if (localStorage.getItem("filter_precio")) {
        let savedPrice = JSON.parse(localStorage.getItem("filter_precio"));
        let sliderInstance = $(".js-range-slider").data("ionRangeSlider");
        if (sliderInstance) {
            sliderInstance.update({
                from: savedPrice[0],
                to: savedPrice[1],
            });
        }
    }

    // Filtro de orden
    $(".filter_ordenar").change(function () {
        localStorage.setItem("filter_ordenar", this.value);
    });
    if (localStorage.getItem("filter_ordenar")) {
        $(".filter_ordenar").val(localStorage.getItem("filter_ordenar"));
    }
}

function remove_filters() {
    localStorage.removeItem("filter_categoria");
    localStorage.removeItem("filter_editorial");
    localStorage.removeItem("filter_tipo");
    localStorage.removeItem("filter_estado");
    localStorage.removeItem("filter_tipo_venta");
    localStorage.removeItem("filter_localizacion");
    localStorage.removeItem("filter_precio");
    localStorage.removeItem("filter");
    localStorage.removeItem("filter_ordenar");
    location.reload();
}

function confirm_filters() {
    var filter = {};

    if (localStorage.getItem("filter_categoria")) {
        filter["categoria"] = JSON.parse(localStorage.getItem("filter_categoria"));
    } else {
        filter["categoria"] = "*";
    }
    if (localStorage.getItem("filter_tipo")) {
        filter["tipo"] = localStorage.getItem("filter_tipo");
    } else {
        filter["tipo"] = "*";
    }
    if (localStorage.getItem("filter_editorial")) {
        filter["editorial"] = localStorage.getItem("filter_editorial");
    } else {
        filter["editorial"] = "*";
    }
    if (localStorage.getItem("filter_tipo_venta")) {
        filter["tipo_venta"] = localStorage.getItem("filter_tipo_venta");
    } else {
        filter["tipo_venta"] = "*";
    }
    if (localStorage.getItem("filter_estado")) {
        filter["estado"] = localStorage.getItem("filter_estado");
    } else {
        filter["estado"] = "*";
    }
    if (localStorage.getItem("filter_localizacion")) {
        filter["localizacion"] = localStorage.getItem("filter_localizacion");
    } else {
        filter["localizacion"] = "*";
    }
    if (localStorage.getItem("filter_precio")) {
        filter["precio"] = JSON.parse(localStorage.getItem("filter_precio"));
    } else {
        filter["precio"] = "*";
    }
    if (localStorage.getItem("filter_ordenar")) {
        filter["ordenar"] = localStorage.getItem("filter_ordenar");
    } else {
        filter["ordenar"] = "*";
    }

    localStorage.setItem("filter", $.param(filter));
    console.log("filters:", $.param(filter));
    location.reload();
}

function highlightFilters() {
    // console.log("entra");
    var filterData = localStorage.getItem("filter");
    var all_filters = filterData ? filterData : null;
    // Convertir en un objeto
    all_filters = all_filters ? Object.fromEntries(new URLSearchParams(all_filters)) : {};

    if (all_filters) {
        if (all_filters.categoria && all_filters.categoria !== "*") {
            let categories = all_filters.categoria.split(","); // Separar las categorías por coma
            categories.forEach(function (category) {
                $(`.filter_categoria input[type=checkbox][value=${category}]`)
                    .prop("checked", true)
                    .closest("label")
            });
        }
        if (all_filters.tipo && all_filters.tipo !== "*") {
            $(".filter_tipo")
                .val(all_filters.tipo)
                .addClass("selected-filter");
        }
        if (all_filters.editorial && all_filters.editorial !== "*") {
            $(".filter_editorial")
                .val(all_filters.editorial)
                .addClass("selected-filter");
        }
        if (all_filters.tipo_venta && all_filters.tipo_venta !== "*") {
            $(".filter_tipo_venta")
                .val(all_filters.tipo_venta)
                .addClass("selected-filter");
        }
        if (all_filters.estado && all_filters.estado !== "*") {
            $(".filter_estado")
                .val(all_filters.estado)
                .addClass("selected-filter");
        }
        if (all_filters.localizacion && all_filters.localizacion !== "*") {
            $(`.filter_localizacion input[type=radio][value=${all_filters.localizacion}]`)
                .prop("checked", true)
                .closest("label")
        }
    }
}

function show_filters() {
    $("#filters2").toggleClass("filters2_hidden filters2_show");
    localStorage.setItem(
        "filters_visibility",
        $("#filters2").hasClass("filters2_show")
    );
}

function restore_filters_visibility() {
    const isFiltersVisible =
        localStorage.getItem("filters_visibility") === "true";
    if (isFiltersVisible) {
        $("#filters2").addClass("filters2_show").removeClass("filters2_hidden");
    } else {
        $("#filters2").addClass("filters2_hidden").removeClass("filters2_show");
    }
}

function clicks() {
    $(document).on("click", ".more_info_list", function () {
        var id_book = this.getAttribute("id");
        loadDetails(id_book);
    });
    $(document).on("click", ".filter_button", function () {
        confirm_filters();
    });

    $(document).on("click", ".filter_remove", function () {
        remove_filters();
    });

    $(document).on("click", ".list__heart", function (event) {
        event.stopPropagation(); // Evita que el evento se propague al contenedor padre
        var id_libro = this.getAttribute('id');
        click_like(id_libro, "list_all");
    });

    $(document).on("click", ".details__heart", function () {
        var id_libro = this.getAttribute('id');
        click_like(id_libro, "details");
    });
}

let map; // Variable global para almacenar el mapa
let markersLayer; // Capa para los marcadores

function show_map(data) {

    if (!map) {
        // Crear el mapa solo si no existe
        map = L.map("map").setView([40.4168, -3.7038], 6); // Centrado en España

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">DANI SANZ GARCIA</a> contributors',
        }).addTo(map);
    }

    // Si ya hay una capa de marcadores, la eliminamos antes de añadir los nuevos
    if (markersLayer) {
        markersLayer.clearLayers();
    } else {
        markersLayer = L.layerGroup().addTo(map);
    }

    // Agregar los nuevos marcadores
    data.forEach((book) => {
        const marker = L.marker([book.lat, book.longi]).addTo(markersLayer);

        let imagesHtml = "";
        book.imagenes.forEach((img) => {
            imagesHtml += `
            <div>
            <div class='card-box-b card-shadow news-box'>
                <div class='img-box-b'>
                <img src='${img}' alt='' class='img-b img-fluid'>
                </div>
            </div>
            </div>
        `;
        });

        const popupContent = `
        <div class="book-info-popup more_info_list" id="${book.id_libro}">
            <h3 class="book-title">${book.titulo}</h3>
            <p class="book-price">Precio: <b>${book.precio}€</b></p>
            <div class="img-container">
            <div id="popup-carousel-${book.id_libro}" class="popup-carousel">
                ${imagesHtml}
            </div>
            </div>
        </div>
        `;

        marker.bindPopup(popupContent).on("popupopen", function () {
            setTimeout(() => {
                $(`#popup-carousel-${book.id_libro}`).slick({
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: false,
                });
            }, 0);
        });
    });
}

function show_map_single(book) {
    console.log(book);
    var map = L.map("map-single").setView([book.lat, book.longi], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">DANI SANZ GARCIA</a> contributors',
    }).addTo(map);

    L.marker([book.lat, book.longi]).addTo(map);
}

function pagination(filter) {
    var filtros = localStorage.getItem("filter");
    var url;

    // Determinar la URL correcta basada en el tipo de filtro
    if (filtros) {
        url = "?module=shop&op=count_filters";
        filter = filtros;
    } else {
        url = "?module=shop&op=count";
    }

    ajaxPromise(url, "POST", "json", filter)
        .then(function (data) {
            var total_prod = data;
            var total_pages = total_prod >= 4 ? Math.ceil(total_prod / 4) : 1;

            var paginationContainer = $("#pagination");
            paginationContainer.empty();
            var currentPage = 1;

            function renderPagination() {
                paginationContainer.empty();
                if (currentPage > 1) {
                    paginationContainer.append(
                        `<button class="page-btn prev-btn" data-page="${currentPage - 1}">&larr; Anterior</button>`
                    );
                }

                for (let i = 1; i <= total_pages; i++) {
                    paginationContainer.append(
                        `<button class="page-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`
                    );
                }

                if (currentPage < total_pages) {
                    paginationContainer.append(
                        `<button class="page-btn next-btn" data-page="${currentPage + 1}">Siguiente &rarr;</button>`
                    );
                }

                $(".page-btn").off("click").on("click", function () {
                    currentPage = $(this).data("page");
                    var offset = 4 * (currentPage - 1);

                    // Determinar la URL correcta para la búsqueda
                    let searchUrl;
                    if (filtros) {
                        searchUrl = "?module=shop&op=filter";
                        filter = filtros;
                    } else {
                        searchUrl = "?module=shop&op=list";
                        filter = null;
                    }

                    ajaxForSearch(searchUrl, offset, filter);
                    $("html, body").animate({ scrollTop: $(".wrap") });
                    renderPagination();
                });
            }
            renderPagination();
        });
}

function books_related(loadeds = 0, type_book, total_items = 4) {
    let items = 3;
    ajaxPromise(`?module=shop&op=more_related&type=${type_book}&loadeds=${loadeds}&total_items=${items}`, "GET", "JSON")
        .then(function (data) {
            data.forEach((book) => {
                console.log("Book:", book);
            });
            if (loadeds === 0) {
                $('<div></div>')
                    .attr({ id: "title_content", class: "title_content" })
                    .appendTo(".results")
                    .html('<h2 class="cat">Books Related</h2>');

                data.forEach((book) => {
                    if (book.id_libro !== undefined) {
                        $('<div></div>')
                            .attr({ id: book.id_libro, class: "more_info_list" })
                            .appendTo(".title_content")
                            .html(`
                    <li class='portfolio-item'>
                    <div class='item-main'>
                        <div class='portfolio-image'>
                        <img src="${book.imagenes[0]}" alt='Book Image' />
                        </div>
                        <h5>${book.titulo}</h5>
                        <p>${book.descripcion}</p>
                        <h6>${book.precio}€</h6>
                    </div>
                    </li>
                `);
                    }
                });

                $('<div></div>')
                    .attr({ id: "more_book__button", class: "more_book__button" })
                    .appendTo(".related_button")
                    .html('<button class="load_more_button" id="load_more_button">LOAD MORE</button>');
            } else {
                // Append new books without clearing existing ones
                data.forEach((book) => {
                    if (book.id_libro !== undefined) {
                        $('<div></div>')
                            .attr({ id: book.id_libro, class: "more_info_list" })
                            .appendTo(".title_content")
                            .html(`
                    <li class='portfolio-item'>
                    <div class='item-main'>
                        <div class='portfolio-image'>
                        <img src="${book.imagenes[0]}" alt='Book Image' />
                        </div>
                        <h5>${book.titulo}</h5>
                        <p>${book.descripcion}</p>
                        <h6>${book.precio}€</h6>
                    </div>
                    </li>
                `);
                    }
                });
            }
            let remainingBooks = total_items - loadeds - items;
            if (remainingBooks <= 0) {
                $(".more_book__button").remove();
                $('<div></div>')
                    .attr({ id: "more_book__button", class: "more_book__button" })
                    .appendTo(".title_content")
                    .html("</br><button class='btn-notexist' id='btn-notexist'>No More Books</button>");
            } else {
                $(".more_book__button").remove();
                $('<div></div>')
                    .attr({ id: "more_book__button", class: "more_book__button" })
                    .appendTo(".title_content")
                    .html('<button class="load_more_button" id="load_more_button">LOAD MORE</button>');
            }
        })
        .catch(function () {
            console.log("Error loading related books");
        });
}

function more_books_related(type_book) {
    var items = 0;
    ajaxPromise('?module=shop&op=count_more_related&type_book=' + type_book, 'POST', 'JSON',)
        .then(function (data) {
            console.log("Total items:", data);
            var total_items = data;
            books_related(0, type_book, total_items);
            $(document).on("click", '.load_more_button', function () {
                items = items + 3;
                $('.more_car__button').empty();
                books_related(items, type_book, total_items);
            });
        }).catch(function () {
            console.log('error total_items');
        });
}

function click_like(id_libro, lugar) {
    var token = localStorage.getItem('token');
    if (token) {
        ajaxPromise("?module=shop&op=control_likes", 'POST', 'JSON', `id_libro=${id_libro}&token=${token}`)
            .then(function (data) {
                console.log("ESERE: " + data);
                if (lugar === "details") {
                    $(".details__heart#" + id_libro + " .fa-heart").toggleClass('like_red');
                } else if (lugar === "list_all") {
                    $(".list__heart#" + id_libro + " .fa-heart").toggleClass('like_red');
                }
            }).catch(function () {
                console.error("error like");
                //window.location.href = "index.php?module=ctrl_exceptions&op=503&type=503&lugar=Function click_like SHOP";
            });

    } else {
        const redirect = [];
        redirect.push(id_libro, lugar);

        localStorage.setItem('redirect_like', redirect);
        localStorage.setItem('id_libro', id_libro);

        Swal.fire({
            icon: 'warning',
            title: 'Debes iniciar sesión',
            text: 'Por favor, inicia sesión para continuar.',
            confirmButtonText: 'Aceptar'
        });
        setTimeout("location.href = 'index.php?module=ctrl_login&op=login-register_view';", 1000);
    }
}

function load_likes_user() {
    var token = localStorage.getItem('token');
    if (token) {
        ajaxPromise("?module=shop&op=load_likes", 'POST', 'JSON', `token=${token}`)
            .then(function (data) {
                for (row in data) {
                    $("#" + data[row].id_libro + ".fa-heart").toggleClass('like_red');
                }
            }).catch(function () {
                window.location.href = "index.php?module=ctrl_exceptions&op=503&type=503&lugar=Function load_like_user SHOP";
            });
    }
}

function redirect_login_like() {
    //var token = localStorage.getItem('token');
    //var id_car = localStorage.getItem('id_car');
    //fer el like a l'user
    //loadDetails(id_car);
    var redirect = localStorage.getItem('redirect_like').split(",");
    if (redirect[1] == "details") {
        loadDetails(redirect[0]);
        localStorage.removeItem('redirect_like');
        localStorage.removeItem('page');
    } else if (redirect[1] == "list_all") {
        localStorage.removeItem('redirect_like');
        loadBooks();
    }
}

$(document).ready(function () {
    loadBooks();
    print_filters2();
    restore_filters_visibility();
    filter_button();
    clicks();
});
