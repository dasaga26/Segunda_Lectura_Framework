<?php
    // echo $_SERVER['DOCUMENT_ROOT'] . '/1_Fw_PHP_OO_MVC_jQuery_AngularJS/Framework/5_begin_framework_ORM/';
    // exit;

    require 'autoload.php';
    
    // $path = $_SERVER['DOCUMENT_ROOT'] . '/Segunda_Lectura/Segunda_Lectura_Framework/';
    // include($path . "utils/common.inc.php");
    // //include($path . "utils/mail.inc.php");
    // include($path . "paths.php");

    // include($path . "module/home/model/BLL/home_bll.class.singleton.php");
    // include($path . "module/home/model/DAO/home_dao.class.singleton.php");
    // include($path . "model/db.class.singleton.php");
    // include($path . "model/Conf.class.singleton.php");

    //ob_start();
    //session_start();

    class router {
        private $uriModule;
        private $uriFunction;
        private $nameModule;
        static $_instance;
        
        public static function getInstance() {  /// Crea el constructor si no existe
            // echo 'hola';
            // exit;
            if (!(self::$_instance instanceof self)) {
                self::$_instance = new self();
            }
            return self::$_instance;
        }
    
        function __construct() {   
            // echo 'hola';
            // exit;
            if(isset($_GET['module'])){
                $this -> uriModule = $_GET['module'];
            }else{
                $this -> uriModule = 'home';
            }
            if(isset($_GET['op'])){
                $this -> uriFunction = ($_GET['op'] === "") ? 'view' : $_GET['op'];
            }else{
                $this -> uriFunction = 'view';
                // $this -> uriFunction = 'carrusel';
            }
        }
    
        function routingStart() {
            // echo 'hola';
            // exit;
            try {
                call_user_func(array($this -> loadModule(), $this -> loadFunction()));
            }catch(Exception $e) {
                common::load_error();
            }
        }
        
        private function loadModule() {
            // echo 'hola';
            // exit;
            if (file_exists('resources/modules.xml')) {
                $modules = simplexml_load_file('resources/modules.xml');
                foreach ($modules as $row) {
                    if (in_array($this -> uriModule, (Array) $row -> uri)) {
                        $path = MODULES_PATH . $row -> name . '/controller/controller_' . (String) $row -> name . '.class.singleton.php';
                        // echo 'hola';
                        // exit;
                        if (file_exists($path)) {
                            require_once($path);
                            $controllerName = 'controller_' . (String) $row -> name;
                            $this -> nameModule = (String) $row -> name;
                            static $controllerInstance = null;
                            // ESTO /////////////////////////////////////
                            if ($controllerInstance === null) {
                                $controllerInstance = new $controllerName;
                            }
                            return $controllerInstance;
                            // POSIBLEMENTE SE TENGA QUE CAMBIAR ///////
                        }
                    }
                }
            }
            throw new Exception('Not Module found.');
        }
        
        private function loadFunction() {
            // echo 'hola';
            // exit;
            $path = MODULES_PATH . $this -> nameModule . '/resources/function.xml'; 
            if (file_exists($path)) {
                $functions = simplexml_load_file($path);
                foreach ($functions as $row) {
                    if (in_array($this -> uriFunction, (Array) $row -> uri)) {
                        return (String) $row -> name;
                    }
                }
            }
            throw new Exception('Not Function found.');
        }
    }
    
    // echo 'hola';
    // exit;
    router::getInstance() -> routingStart();
    