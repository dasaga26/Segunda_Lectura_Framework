<?php
	class search_bll {
		private $dao;
		private $db;
		static $_instance;

		function __construct() {
			$this -> dao = search_dao::getInstance();
			$this->db = db::getInstance();
		}

		public static function getInstance() {
			if (!(self::$_instance instanceof self)) {
				self::$_instance = new self();
			}
			return self::$_instance;
		}

		function get_locations_BLL() {
			return $this -> dao -> select_locations($this->db);
		}

		function search_state_null_BLL() {
			return $this -> dao -> search_state_null($this->db);
		}

		function search_state_BLL($args) {
			return $this -> dao -> search_state($this->db, $args);
		}
		
		function select_only_location_BLL($args) {
			return $this->dao->select_only_location($this->db, $args[0], $args[1]);
		}

		function select_location_state_BLL($args) {
			return $this->dao->select_location_state($this->db, $args[0], $args[1], $args[2]);
		}

		function select_only_state_BLL($args) {
			return $this->dao->select_only_state($this->db, $args[0], $args[1]);
		}

		function select_title_BLL($args) {
			return $this->dao->select_title($this->db, $args);
		}
		
	}
?>