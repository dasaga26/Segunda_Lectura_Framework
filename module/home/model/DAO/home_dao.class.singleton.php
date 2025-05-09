<?php
class home_dao
{
    static $_instance;

    private function __construct() {}

    public static function getInstance()
    {
        // return 'hola getInstance dao';
        if (!(self::$_instance instanceof self)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function select_data_carrusel($db)
    {
        //public function select_data_carrusel() {
        //return 'hola select_data_carrusel';
        $sql = "SELECT * FROM editorial";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function select_data_category($db)
    {

        $sql = "SELECT * FROM categorias";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function select_data_type($db)
    {

        $sql = "SELECT * FROM tipos";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function select_data_tipoVenta($db)
    {

        $sql = "SELECT * FROM tipo_venta";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function select_data_estado($db)
    {

        $sql = "SELECT * FROM estado";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }
    public function select_data_popProduct($db)
    {
        $sql = "SELECT l.id_libro, l.titulo, l.descripcion, l.precio, l.longi, l.lat,  
        GROUP_CONCAT(i.url ORDER BY i.url SEPARATOR ':') AS imagenes
        FROM `libros` l
        INNER JOIN `imagenes_prod` i 
        ON l.id_libro = i.id_libro
        GROUP BY l.id_libro
        ORDER BY l.popularidad DESC
        LIMIT 8";
    
        $stmt = $db->ejecutar($sql);
        $res = $db->listar($stmt);

        $retrArray = [];
        if (mysqli_num_rows($res) > 0) {
            while ($row = mysqli_fetch_assoc($res)) {
                $retrArray[] = array(
                    "id_libro" => $row["id_libro"],
                    "titulo" => $row["titulo"],
                    "descripcion" => $row["descripcion"],
                    "precio" => $row["precio"],
                    "longi" => $row["longi"],
                    "lat" => $row["lat"],
                    "imagenes" => explode(":", $row['imagenes'])
                );
            }
        }
        return $retrArray;
    }
}
