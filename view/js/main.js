function load_menu() {
    var token = localStorage.getItem('token');
    console.log('token=' + encodeURIComponent(token));
    if (token) {
        ajaxPromise('module/auth/ctrl/ctrl_auth.php?op=data_user', 'POST', 'JSON', 'token=' + encodeURIComponent(token))
            .then(function (data) {
                if (data.type_user == "client") {
                    console.log("Client loged");
                    $('.opc_CRUD').empty();
                    $('.opc_exceptions').empty();
                } else {
                    console.log("Admin loged");
                    $('.opc_CRUD').show();
                    $('.opc_exceptions').show();
                }
                $('#pfp').attr('src', data.avatar);
                $('.dropdown-menu').empty();
                $('<p></p>').text(data.username).appendTo('.dropdown-menu');
                $('<a></a>').attr('id', 'logout').text('Log Out').appendTo('.dropdown-menu');
            }).catch(function () {
                console.log("Error al cargar los datos del user");
            });
    } else {
        console.log("No hay token disponible");
    }
}

function click_logout() {
    $(document).on('click', '#logout', function () {
        localStorage.removeItem('token');
        Swal.fire({
            icon: 'success',
            title: 'Logout successfully',
            showConfirmButton: false,
            timer: 1500
        });
        setTimeout(function () {
            logout();
        }, 1000);
    });
}

function logout() {
    ajaxPromise('module/auth/ctrl/ctrl_auth.php?op=logout', 'POST', 'JSON')
        .then(function (data) {
            localStorage.removeItem('token');
            window.location.href = "index.php?page=homepage";
        }).catch(function () {
            console.log('Something has occured');
        });
}

function friendlyURL(url) {
    var link = "";
    url = url.replace("?", "");
    url = url.split("&");
    cont = 0;
    for (var i = 0; i < url.length; i++) {
        cont++;
        var aux = url[i].split("=");
        if (cont == 2) {
            link += "/" + aux[1] + "/";
        } else {
            link += "/" + aux[1];
        }
    }
    return "http://localhost/Segunda_Lectura/Segunda_Lectura_Framework" + link;
}



function renderHeader() {
    const headerHTML = `
    <div class="hearer_icon d-flex">
        <div class="search-container" style="position: relative;"></div>
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-12">
                    <nav class="navbar navbar-expand-lg navbar-light">
                        <a class="navbar-brand" href="${friendlyURL('?module=home')}"> 
                            <img src="view/images/logo.png" alt="logo" width="170px"> 
                        </a>
                        <button class="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span class="menu_icon"><i class="fas fa-bars"></i></span>
                        </button>
                        <div class="collapse navbar-collapse main-menu-item" id="navbarSupportedContent">
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <a class="nav-link" href="${friendlyURL('?module=shop')}">Shop</a>
                                </li>
                            </ul>
                        </div>
                        <div class="hearer_icon d-flex">
                            <div class="search-container" style="position: relative;">
                                <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" name="query" id="autocom" autocomplete="off" style="width: 200px;">
                                <div id="searchAuto" class="autocomplete-items"></div>
                            </div>
                            <select class="form-control mr-sm-2" name="location" style="width: 150px;"></select>
                            <select class="form-control mr-sm-2" name="state" style="width: 150px;"></select>
                            <button class="btn btn-outline-success my-2 my-sm-0" type="submit" id="search-btn">Search</button>
                            <div class="profile-container" style="position: relative; margin-left: 20px;">
                                <img src="view/images/default_pfp.webp" id="pfp" alt="Profile Icon" width="40px" height="40px" style="border-radius: 50%; cursor: pointer;">
                                <div class="dropdown-menu" style="position: absolute; top: 50px; right: 0; display: none; background-color: white; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                                    <a class="dropdown-item" href="${friendlyURL('?module=auth')}" style="padding: 10px; display: block; text-decoration: none; color: black;">Iniciar Sesión</a>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <style>
                        .nice-select {
                            display: none !important;
                        }
                        .autocomplete-items {
                            position: absolute;
                            border: 1px solid #d4d4d4;
                            border-bottom: none;
                            border-top: none;
                            z-index: 99;
                            top: 73%;
                            left: 50.9%;
                            right: 400px;
                        }
                        .autocomplete-items div {
                            padding: 10px;
                            cursor: pointer;
                            background-color: #fff;
                            border-bottom: 1px solid #d4d4d4;
                        }
                        .autocomplete-items div:hover {
                            background-color: #e9e9e9;
                        }
                        .autocomplete-active {
                            background-color: DodgerBlue !important;
                            color: #ffffff;
                        }
                        .search-container {
                            display: flex;
                            flex-direction: column;
                        }
                    </style>
                </div>
            </div>
        </div>
    </div>
    `;
    // Inserta el header en el div con id="header"
    document.getElementById('header').innerHTML = headerHTML;
}


function dropdown() {
    // DROPDOWN MENU //
    $(function () {
        const $profileIcon = $('#pfp');
        const $dropdownMenu = $('.dropdown-menu');

        $profileIcon.on('click', function (e) {
            e.stopPropagation();
            $dropdownMenu.toggle();
        });

        $(document).on('click', function (e) {
            if (!$(e.target).closest('.profile-container').length) {
                $dropdownMenu.hide();
            }
        });
    });
}

$(document).ready(function () {
    // alert("Welcome to the app");
    renderHeader();
    dropdown();
    // load_menu();
    // click_logout();
});
