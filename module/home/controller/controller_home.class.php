<?php
    class controller_home {
        function view() {
            // echo 'hola view';
            // exit;
            common::load_view('top_page_home.html', VIEW_PATH_HOME . 'home.html');
        }

        function carrusel() {
            // echo 'hola carrusel';
            // exit;
            echo json_encode(common::load_model('home_model', 'get_carrusel'));
        }

        function category() {
            echo json_encode(common::load_model('home_model', 'get_category'));
        }
        
        function type() {
            // echo json_encode('Hola');
            echo json_encode(common::load_model('home_model', 'get_type'));
        }
    }
?>