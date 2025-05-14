<?php
    class search_model {
        private $bll;
        static $_instance;
        
        function __construct() {
            $this -> bll = search_bll::getInstance();
        }

        public static function getInstance() {
            if (!(self::$_instance instanceof self)) {
                self::$_instance = new self();
            }
            return self::$_instance;
        }   

        public function search_state_null() {
            return $this -> bll -> search_state_null_BLL();
        }

        public function get_locations() {
            return $this -> bll -> get_locations_BLL();
        }

        public function search_state($args) {
            return $this -> bll -> search_state_BLL($args);
        }

        public function select_only_location($args) {
            return $this->bll->select_only_location_BLL($args);
        }

        public function select_location_state($args) {
            return $this->bll->select_location_state_BLL($args);
        }

        public function select_only_state($args) {
            return $this->bll->select_only_state_BLL($args);
        }

        public function select_title($args) {
            return $this->bll->select_title_BLL($args);
        }

    }