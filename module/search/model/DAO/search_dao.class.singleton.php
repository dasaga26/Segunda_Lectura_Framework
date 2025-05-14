<?php
class search_dao
{
    static $_instance;

    private function __construct() {}

    public static function getInstance()
    {
        if (!(self::$_instance instanceof self)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function select_locations($db)
    {

        $sql = "SELECT id_localizacion, ciudad FROM localizacion";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function search_state_null($db)
    {

        $sql = "SELECT DISTINCT * FROM estado";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function search_state($db, $location_id)
    {

        $sql = "SELECT DISTINCT e.*
        FROM libros l
        INNER JOIN estado e ON l.id_estado = e.id_estado
        INNER JOIN localizacion loc ON l.id_localizacion = loc.id_localizacion
        WHERE loc.id_localizacion = '$location_id'";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function select_only_location($db, $location, $complete)
    {
        $sql = "SELECT l.*
        FROM libros l
        INNER JOIN localizacion loc ON l.id_localizacion = loc.id_localizacion
        WHERE loc.ciudad = '$location' AND l.titulo LIKE '$complete%'";
        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function select_location_state($db, $complete, $location, $state)
    {
        $sql = "SELECT l.*
        FROM libros l
        INNER JOIN localizacion loc ON l.id_localizacion = loc.id_localizacion
        INNER JOIN estado e ON l.id_estado = e.id_estado
        WHERE loc.ciudad = '$location' AND e.estado = '$state' AND l.titulo LIKE '$complete%'";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function select_only_state($db, $state, $complete)
    {
        $sql = "SELECT l.*
        FROM libros l
        INNER JOIN estado e ON l.id_estado = e.id_estado
        WHERE e.estado = '$state' AND l.titulo LIKE '$complete%'";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function select_title($db, $complete)
    {
        $sql = "SELECT l.*
        FROM libros l
        WHERE l.titulo LIKE '$complete%'";
        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }
}
