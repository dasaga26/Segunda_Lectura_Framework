
function carousel_Brands() {
  ajaxPromise("?module=home&op=carrusel", "GET", "JSON")
    .then(function (data) {
      console.log(data);

      var sliderContainer = $("<div></div>")
        .attr("id", "carouselBrands")
        .addClass("best_product_slider owl-carousel")
        .appendTo("#containerEditoriales");

      for (var row in data) {
        var item = $("<div></div>").addClass("single_item").appendTo(sliderContainer);

        var editorialDiv = $("<div></div>")
          .attr("id", data[row].id_editorial)
          .addClass("editorial")
          .appendTo(item);

        editorialDiv.html(`
          <img class='img_datos' src='${data[row].img}' alt='Imagen de categoría'>
          <div class='single_product_text'>
            <h4>${data[row].editorial}</h4>
          </div>
        `);
      }

      $("#carouselBrands").owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        items: 4,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
          0: { items: 1, margin: 20 },
          600: { items: 2, margin: 20 },
          1000: { items: 4, margin: 20 },
        },
      });
    })
    .catch(function () {
      alert("error");
      console.log(data);
    });
}

function loadCategories() {
  ajaxPromise("?module=home&op=category", "GET", "JSON")
    .then(function (data) {
      var sliderContainer = $("<div></div>")
        .attr("id", "carouselCategories")
        .addClass("best_product_slider owl-carousel")
        .appendTo("#containerCategories");

      for (var row in data) {
        var item = $("<div></div>").addClass("single_item").appendTo(sliderContainer);

        var categoryDiv = $("<div></div>")
          .attr("id", data[row].id_categoria)
          .addClass("category")
          .appendTo(item);

        categoryDiv.html(`
          <img class='img_datos' src='${data[row].img}' alt='Imagen de categoría'>
          <div class='single_product_text'>
            <h4>${data[row].categoria}</h4>
          </div>
        `);
      }

      $("#carouselCategories").owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        items: 4,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
          0: { items: 1, margin: 20 },
          600: { items: 2, margin: 20 },
          1000: { items: 4, margin: 20 },
        },
      });
    })
    .catch(function () {
      alert("error");
      console.log(data);
    });
}

function loadCatTypes() {
  ajaxPromise("?module=home&op=type", "GET", "JSON")
    .then(function (data) {
      var sliderContainer = $("<div></div>")
        .attr("id", "carouselCatTypes")
        .addClass("best_product_slider owl-carousel")
        .appendTo("#containerTipos");

      for (var row in data) {
        var item = $("<div></div>").addClass("single_item").appendTo(sliderContainer);

        var typeDiv = $("<div></div>")
          .attr("id", data[row].id_tipo)
          .addClass("type")
          .appendTo(item);

        typeDiv.html(`
          <img class='img_datos' src='${data[row].img}' alt='Imagen de categoría'>
          <div class='single_product_text'>
            <h4>${data[row].tipo}</h4>
          </div>
        `);
      }

      $("#carouselCatTypes").owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        items: 4,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
          0: { items: 1, margin: 20 },
          600: { items: 2, margin: 20 },
          1000: { items: 4, margin: 20 },
        },
      });
    })
    .catch(function () {
      alert("error");
      console.log(data);
    });
}
function loadMostVisited() {
  ajaxPromise("?module=home&op=popProducts", "GET", "JSON")
    .then(function (data) {
      console.log(data);
      var container = $("#mas_visitados");
      container.empty();

      var sliderContainer = $("<div></div>")
        .attr("id", "carouselMostVisited")
        .addClass("most_visited_slider owl-carousel")
        .appendTo(container);

      for (var row in data) {
        var productItem = $("<div></div>")
          .addClass("single_most_visited_item")
          .appendTo(sliderContainer);

        var productDiv = $("<div></div>")
          .addClass("single_most_visited_product more_info_list")
          .attr("id", data[row].id_libro)
          .appendTo(productItem);

        var imgContainer = $("<div></div>")
          .addClass("img_container_most_visited")
          .attr("id", `most-visited-carousel-${data[row].id_libro}`)
          .appendTo(productDiv);

        data[row].imagenes.forEach((img) => {
          var imgHtml = `
            <div>
              <div class='card-box-b card-shadow news-box'>
                <div class='img-box-b'>
                  <img src='${img}' alt='' class='img-b img-fluid'>
                </div>
              </div>
            </div>
          `;
          imgContainer.append(imgHtml);
        });

        var productText = $("<div></div>")
          .addClass("single_most_visited_text")
          .appendTo(productDiv);

        productText.html(`
          <h4>${data[row].titulo}</h4>
          <p>${data[row].descripcion}</p>
          <h3>${data[row].precio}€</h3>
        `);

        $(`#most-visited-carousel-${data[row].id_libro}`).slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          prevArrow:
            '<button type="button" class="slick-prev" onclick="event.stopPropagation();">&larr;</button>',
          nextArrow:
            '<button type="button" class="slick-next" onclick="event.stopPropagation();">&rarr;</button>',
        });

        $(`#most-visited-carousel-${data[row].id_libro} .slick-dots`).on(
          "click",
          function (event) {
            event.stopPropagation();
          }
        );
      }

      $("#carouselMostVisited").owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        items: 2,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
          0: { items: 2, margin: 20 },
          600: { items: 3, margin: 20 },
          1000: { items: 4, margin: 20 },
        },
      });
    })
    .catch(function () {
      alert("Error loading most visited products");
    });
}

function loadTiposVenta() {
  ajaxPromise("?module=home&op=tipoVenta", "GET", "JSON")
    .then(function (data) {
      var sliderContainer = $("<div></div>")
        .attr("id", "carouselTiposVenta")
        .addClass("best_product_slider owl-carousel")
        .appendTo("#containerTiposVenta");

      for (var row in data) {
        var item = $("<div></div>").addClass("single_item").appendTo(sliderContainer);

        var saleTypeDiv = $("<div></div>")
          .attr("id", data[row].id_tipo_venta)
          .addClass("saleType")
          .appendTo(item);

        saleTypeDiv.html(`
          <img class='img_datos' src='${data[row].img}' alt='Imagen de categoría'>
          <div class='single_product_text'>
            <h4>${data[row].tipo_venta}</h4>
          </div>
        `);
      }

      $("#carouselTiposVenta").owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        items: 4,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
          0: { items: 1, margin: 20 },
          600: { items: 2, margin: 20 },
          1000: { items: 4, margin: 20 },
        },
      });
    })
    .catch(function () {
      alert("error");
      console.log(data);
    });
}

function loadEstado() {
  ajaxPromise(friendlyURL("?module=home&op=estado"), "GET", "JSON")
    .then(function (data) {
      var sliderContainer = $("<div></div>")
        .attr("id", "carouselEstado")
        .addClass("best_product_slider owl-carousel")
        .appendTo("#containerEstado");

      for (var row in data) {
        var item = $("<div></div>").addClass("single_item").appendTo(sliderContainer);

        var stateDiv = $("<div></div>")
          .attr("id", data[row].id_estado)
          .addClass("state")
          .appendTo(item);

        stateDiv.html(`
          <img class='img_datos' src='${data[row].img}' alt='Imagen de categoría'>
          <div class='single_product_text'>
            <h4>${data[row].estado}</h4>
          </div>
        `);
      }

      $("#carouselEstado").owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        items: 4,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
          0: { items: 1, margin: 20 },
          600: { items: 2, margin: 20 },
          1000: { items: 4, margin: 20 },
        },
      });
    })
    .catch(function () {
      alert("error");
      console.log(data);
    });
}

function clicks() {
  $(document).on("click", 'div.editorial', function () {
    let filters = JSON.parse(localStorage.getItem('filter')) || {
      categoria: '*',
      tipo: '*',
      editorial: '*',
      tipo_venta: '*',
      estado: '*',
      localizacion: '*',
      precio: '*',
      ordenar: '*'
    };
    filters.editorial = this.getAttribute('id');
    localStorage.setItem('filter', $.param(filters));
    setTimeout(function () {
      window.location.href = '?module=shop';
    }, 1000);
  });

  $(document).on("click", 'div.category', function () {
    let filters = JSON.parse(localStorage.getItem('filter')) || {
      categoria: '*',
      tipo: '*',
      editorial: '*',
      tipo_venta: '*',
      estado: '*',
      localizacion: '*',
      precio: '*',
      ordenar: '*'
    };
    filters.categoria = this.getAttribute('id');
    localStorage.setItem('filter', $.param(filters));
    setTimeout(function () {
      window.location.href = 'index.php?page=shop';
    }, 1000);
  });

  $(document).on("click", 'div.type', function () {
    let filters = JSON.parse(localStorage.getItem('filter')) || {
      categoria: '*',
      tipo: '*',
      editorial: '*',
      tipo_venta: '*',
      estado: '*',
      localizacion: '*',
      precio: '*',
      ordenar: '*'
    };
    filters.tipo = this.getAttribute('id');
    localStorage.setItem('filter', $.param(filters));
    setTimeout(function () {
      window.location.href = 'index.php?page=shop';
    }, 1000);
  });

  $(document).on("click", 'div.saleType', function () {
    let filters = JSON.parse(localStorage.getItem('filter')) || {
      categoria: '*',
      tipo: '*',
      editorial: '*',
      tipo_venta: '*',
      estado: '*',
      localizacion: '*',
      precio: '*',
      ordenar: '*'
    };
    filters.tipo_venta = this.getAttribute('id');
    localStorage.setItem('filter', $.param(filters));
    setTimeout(function () {
      window.location.href = 'index.php?page=shop';
    }, 1000);
  });

  $(document).on("click", 'div.state', function () {
    let filters = JSON.parse(localStorage.getItem('filter')) || {
      categoria: '*',
      tipo: '*',
      editorial: '*',
      tipo_venta: '*',
      estado: '*',
      localizacion: '*',
      precio: '*',
      ordenar: '*'
    };
    filters.estado = this.getAttribute('id');
    localStorage.setItem('filter', $.param(filters));
    setTimeout(function () {
      window.location.href = 'index.php?page=shop';
    }, 1000);
  });
}



$(document).ready(function () {
  localStorage.removeItem('filter');
  carousel_Brands();
  loadCategories();
  loadCatTypes();
  loadTiposVenta();
  loadEstado();
  loadMostVisited()
  clicks();

});
