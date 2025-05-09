<?php
	class home_bll {
		private $dao;
		private $db;
		static $_instance;

		function __construct() {
			// return 'hola getInstance bll';
			$this -> dao = home_dao::getInstance();
			$this -> db = db::getInstance();
		}

		public static function getInstance() {
			// return 'hola getInstance bll';
			if (!(self::$_instance instanceof self)) {
				self::$_instance = new self();
			}
			return self::$_instance;
		}

		public function get_carrusel_BLL() {
			// return 'hola get_carrusel_BLL';

			return $this -> dao -> select_data_carrusel($this -> db);
			//return $this -> dao -> select_data_carrusel();
		}

		public function get_category_BLL() {
			return $this -> dao -> select_data_category($this -> db);
		}

		public function get_type_BLL() {
			return $this -> dao -> select_data_type($this -> db);
		}

		public function get_tipoVenta_BLL() {
			return $this -> dao -> select_data_tipoVenta($this -> db);
		}

		public function get_estado_BLL() {
			return $this -> dao -> select_data_estado($this -> db);
		}

		public function get_popProduct_BLL() {
			return $this -> dao -> select_data_popProduct($this -> db);
		}
	}
?>