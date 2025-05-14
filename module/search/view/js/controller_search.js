function load_locations() {
    ajaxPromise('?module=search&op=search_location', 'POST', 'JSON')
        .then(function (data) {
            $('<option>Location</option>').attr('selected', true).attr('disabled', true).appendTo('select[name="location"]');
            for (let row in data) {
                $('<option value="' + data[row].id_localizacion + '">' + data[row].ciudad + '</option>').appendTo('select[name="location"]');
            }
        }).catch(function () {
            alert('Error al cargar las localizaciones');
        });
}

function load_states(location) {
    $('select[name="state"]').empty();

    if (location == undefined) {
        ajaxPromise('?module=search&op=search_state_null', 'POST', 'JSON')
            .then(function (data) {
                $('<option>State</option>').attr('selected', true).attr('disabled', true).appendTo('select[name="state"]');
                for (let row in data) {
                    $('<option value="' + data[row].id_estado + '">' + data[row].estado + '</option>').appendTo('select[name="state"]');
                }
            }).catch(function () {
                alert('Error al cargar los estados');
            });
    } else {
        ajaxPromise('?module=search&op=search_state', 'POST', 'JSON', { location: location })
            .then(function (data) {
                for (let row in data) {
                    $('<option value="' + data[row].id_estado + '">' + data[row].estado + '</option>').appendTo('select[name="state"]');
                }
            }).catch(function () {
                alert('Error al cargar los estados');
            });
    }
}

function launch_search() {
    load_locations();
    load_states();
    $(document).on('change', 'select[name="location"]', function () {
        let location = $(this).val();
        if (location === 0) {
            load_states();
        } else {
            load_states(location);
        }
    });
}
function autocomplete() {
    $("#autocom").on("keyup", function () {
        let query = $(this).val().trim();
        if (query === "") {
            $('#searchAuto').empty().hide();
            return;
        }

        let sdata = { complete: query };
        if ($('select[name="location"]').val() != 0) {
            sdata.location = $('select[name="location"]').val();
            if ($('select[name="location"]').val() != 0 && $('select[name="state"]').val() != 0) {
                sdata.state = $('select[name="state"]').val();
            }
        }
        if ($('select[name="location"]').val() == undefined && $('select[name="state"]').val() != 0) {
            sdata.state = $('select[name="state"]').val();
        }

        ajaxPromise('?module=search&op=autocomplete', 'POST', 'JSON', sdata)
            .then(function (data) {
                $('#searchAuto').empty().hide();
                if (data.length === 0) {
                    return; // No mostrar nada si no hay resultados
                }
                for (let row in data) {
                    $('<div></div>').appendTo('#searchAuto').html(data[row].titulo).attr({ 'class': 'searchElement', 'id': data[row].titulo });
                }
                $('#searchAuto').fadeIn(300);
                $(document).on('click', '.searchElement', function () {
                    $('#autocom').val(this.getAttribute('id'));
                    $('#searchAuto').fadeOut(300);
                });
                $(document).on('click scroll', function (event) {
                    if (event.target.id !== 'autocom') {
                        $('#searchAuto').fadeOut(300);
                    }
                });
            }).catch(function () {
                $('#searchAuto').fadeOut(300);
            });
    });
}

function button_search() {
    $('#search-btn').on('click', function (event) {
        event.preventDefault(); // Prevenir la recarga de la página

        // Objeto con los filtros seleccionados
        var search = {
            categoria: '*',
            tipo: '*',
            editorial: '*',
            tipo_venta: '*',
            estado: '*',
            localizacion: '*',
            precio: '*',
            ordenar: '*',
            title: '*'
        };

        // Actualizar localizacion si se ha seleccionado
        if ($('select[name="location"]').val()) {
            search.localizacion = $('select[name="location"]').val();
        }

        // Actualizar estado si se ha seleccionado
        if ($('select[name="state"]').val()) {
            search.estado = $('select[name="state"]').val();
        }

        // Actualizar título si hay búsqueda por autocompletado
        if ($('#autocom').val()) {
            search.title = $('#autocom').val();
        }

        // Guardar los filtros en localStorage
        localStorage.setItem('filter', $.param(search));
        
        // Redirigir a la página de shop
        window.location.href = '?module=shop';
    });
}

$(document).ready(function () {
    launch_search();
    autocomplete();
    button_search();
    // alert("hola");
});