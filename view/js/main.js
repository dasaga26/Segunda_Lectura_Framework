// function load_menu() {
//     var token = localStorage.getItem('token');
//     console.log('token=' + encodeURIComponent(token));
//     if (token) {
//         ajaxPromise('module/auth/ctrl/ctrl_auth.php?op=data_user', 'POST', 'JSON', 'token=' + encodeURIComponent(token))
//             .then(function (data) {
//                 if (data.type_user == "client") {
//                     console.log("Client loged");
//                     $('.opc_CRUD').empty();
//                     $('.opc_exceptions').empty();
//                 } else {
//                     console.log("Admin loged");
//                     $('.opc_CRUD').show();
//                     $('.opc_exceptions').show();
//                 }
//                 $('#pfp').attr('src', data.avatar);
//                 $('.dropdown-menu').empty();
//                 $('<p></p>').text(data.username).appendTo('.dropdown-menu');
//                 $('<a></a>').attr('id', 'logout').text('Log Out').appendTo('.dropdown-menu');
//             }).catch(function () {
//                 console.log("Error al cargar los datos del user");
//             });
//     } else {
//         console.log("No hay token disponible");
//     }
// }

// function click_logout() {
//     $(document).on('click', '#logout', function () {
//         localStorage.removeItem('token');
//         Swal.fire({
//             icon: 'success',
//             title: 'Logout successfully',
//             showConfirmButton: false,
//             timer: 1500
//         });
//         setTimeout(function () {
//             logout();
//         }, 1000);
//     });
// }

// function logout() {
//     ajaxPromise('module/auth/ctrl/ctrl_auth.php?op=logout', 'POST', 'JSON')
//         .then(function (data) {
//             localStorage.removeItem('token');
//             window.location.href = "index.php?page=homepage";
//         }).catch(function () {
//             console.log('Something has occured');
//         });
// }


// //DROPDOWN MENU//
// const profileIcon = document.getElementById('pfp');
// const dropdownMenu = document.querySelector('.dropdown-menu');

// profileIcon.addEventListener('click', () => {
//     dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
// });

// document.addEventListener('click', (event) => {
//     if (!profileIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
//         dropdownMenu.style.display = 'none';
//     }
// });
// ////////////////

// $(document).ready(function () {
//     load_menu();
//     click_logout();
// });
